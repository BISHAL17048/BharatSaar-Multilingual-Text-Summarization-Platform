import os
import gc
import re
import torch
import sys
import concurrent.futures
from workers.celery_app import celery_app
from workers.stages.stage_01_detection import sync_update_job, run_async
from models.job import JobStatus
from repositories.document_repo import DocumentRepository
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import asyncio

SUMMARIZATION_TIMEOUT = 300  # 5 minutes for Qwen3-4B

def _clean_text_for_llm(text: str) -> str:
    """Strip markdown syntax and navigation noise before feeding to LLM."""
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    text = re.sub(r'!\[[^\]]*\]\([^)]+\)', '', text)
    text = re.sub(r'#{1,6}\s*', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    return text

import tempfile
import subprocess
import json

def load_and_run_qwen_summarization(text: str, detected_language: str = "the exact same language") -> tuple[str, str, str, str]:
    print(f"Delegating Qwen3-4B Summarization to isolated subprocess...")
    
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json', encoding='utf-8') as fin:
        json.dump({"text": text, "detected_language": detected_language}, fin, ensure_ascii=False)
        input_file = fin.name
        
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json', encoding='utf-8') as fout:
        output_file = fout.name
        
    script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "run_qwen_isolated.py"))
    
    try:
        # Run isolated process
        env = os.environ.copy()
        # Force a clean CUDA context
        result = subprocess.run([sys.executable, script_path, input_file, output_file], capture_output=True, text=True, env=env)
        
        if result.returncode != 0:
            print(f"Isolated Qwen3-4B failed with exit code {result.returncode}")
            print("STDOUT:", result.stdout)
            print("STDERR:", result.stderr)
            return "Document Intelligence Executive Summary", text[:2000], "", ""
            
        with open(output_file, 'r', encoding='utf-8') as f:
            out_data = json.load(f)
            
        headline = out_data.get("headline", "Document Intelligence Executive Summary")
        detailed_summary = out_data.get("detailed_summary", text[:2000])
        bullet_summary = out_data.get("bullet_summary", "")
        keywords_str = out_data.get("keywords", "")
        
        return headline, detailed_summary, bullet_summary, keywords_str
        
    except Exception as e:
        print(f"Error calling isolated Qwen3-4B: {e}")
        return "Document Intelligence Executive Summary", text[:2000], "", ""
    finally:
        try:
            if os.path.exists(input_file):
                os.remove(input_file)
            if os.path.exists(output_file):
                os.remove(output_file)
        except:
            pass

async def async_update_mongo(doc_id, detailed_summary, bullet_summary, chronological_events, headline, entities, topics, keywords, language=None):
    await DocumentRepository.update_document_intelligence(
        doc_id=doc_id,
        detailed_summary=detailed_summary,
        bullet_summary=bullet_summary,
        chronological_events=chronological_events,
        headline=headline,
        entities=entities,
        topics=topics,
        keywords=keywords,
        language=language
    )

def _back_translate_and_overwrite(
    job_id: str,
    doc_id: str,
    previous_result: dict,
    headline: str,
    detailed_summary: str,
    bullet_summary: str,
    keywords: list
):
    """
    Back-translates the English Qwen summary into the original low-resource
    language using Sarvam, then overwrites the MongoDB document so that the
    stored (and displayed) summary is always in the document's native language.
    """
    original_language_name = previous_result.get("original_language_name", "")
    intelligence = previous_result.get("intelligence", {})
    if not original_language_name:
        return

    print(f"[{job_id}] Back-translating English summary to {original_language_name} using Sarvam...")

    weights_path = os.path.abspath(os.path.join(
        os.path.dirname(__file__), "..", "..", "..",
        "model_server", "weights", "sarvam-translate"
    ))

    tokenizer = None
    model     = None

    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig as BnBCfg

        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"[{job_id}] Loading sarvam-translate on {device.upper()} (4-bit NF4)...")

        tokenizer = AutoTokenizer.from_pretrained(weights_path, local_files_only=True)
        bnb_config = BnBCfg(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16
        )
        model = AutoModelForCausalLM.from_pretrained(
            weights_path, local_files_only=True,
            quantization_config=bnb_config, device_map="auto"
        )

        def _translate(text_str: str) -> str:
            if not text_str:
                return ""
            messages = [
                {"role": "system", "content": f"Translate the text below to {original_language_name}."},
                {"role": "user",   "content": text_str}
            ]
            formatted = tokenizer.apply_chat_template(
                messages, tokenize=False, add_generation_prompt=True
            )
            inputs = tokenizer([formatted], return_tensors="pt").to(model.device)
            with torch.no_grad():
                generated_ids = model.generate(
                    **inputs,
                    max_new_tokens=2048,
                    do_sample=True,
                    temperature=0.01,
                    num_return_sequences=1
                )
            output_ids = generated_ids[0][len(inputs.input_ids[0]):].tolist()
            return tokenizer.decode(output_ids, skip_special_tokens=True)

        native_headline  = _translate(headline)
        native_detailed  = _translate(detailed_summary)
        native_bullet    = _translate(bullet_summary)

        # Keywords: translate as one comma-separated string
        kw_str          = ", ".join(keywords) if keywords else ""
        native_kw_str   = _translate(kw_str)
        native_keywords = [k.strip() for k in native_kw_str.split(",")] if native_kw_str else keywords

        # Overwrite the English summary in MongoDB with the original-language version
        run_async(
            async_update_mongo(
                doc_id=doc_id,
                detailed_summary=native_detailed,
                bullet_summary=native_bullet,
                chronological_events="",
                headline=native_headline,
                entities=intelligence.get("entities", []),
                topics=intelligence.get("topics", []),
                keywords=native_keywords
            )
        )
        print(f"[{job_id}] Back-translation complete. Summary is now in {original_language_name}.")

    except Exception as e:
        print(f"[{job_id}] Back-translation failed: {e}. English summary will be retained.")
    finally:
        if model is not None:
            del model
        if tokenizer is not None:
            del tokenizer
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        print(f"[{job_id}] Unloaded sarvam-translate (back-translation) from RAM.")

async def build_context_from_chroma(user_id: str, doc_id: str, keywords: list, fallback_text: str) -> str:
    """Queries ChromaDB using BGE-M3 for long context retrieval, scoped to the current document."""
    if not keywords:
        return fallback_text[:12000]
        
    try:
        from services.embedding_service import EmbeddingService, unload_bge_model
        from repositories.vector_repo import VectorRepository
        
        embed_service = EmbeddingService()
        query_str = " ".join(keywords[:5])
        print(f"Retrieving Long Context from ChromaDB for query: '{query_str}'")
        
        vectors = await embed_service.get_embedding(query_str)
        results = VectorRepository.hybrid_search(
            user_id=user_id,
            dense_query=vectors["dense"],
            sparse_query=vectors["sparse"],
            limit=12,
            doc_id=doc_id  # Scope strictly to this document — prevents cross-doc contamination
        )
        
        if not results:
            # No chunks found for this doc — fall back to the raw text directly
            print(f"No ChromaDB chunks found for doc_id={doc_id}, using fallback text.")
            return fallback_text[:12000]
            
        unique_chunks = []
        seen = set()
        for res in results:
            if res["text"] not in seen:
                seen.add(res["text"])
                unique_chunks.append(res["text"])
                
        context = "\n...\n".join(unique_chunks)
        print(f"Retrieved {len(results)} chunks, deduplicated to {len(unique_chunks)} highly relevant chunks from ChromaDB for Summarization.")
        return context
    except Exception as e:
        print(f"ChromaDB retrieval failed, using fallback text: {e}")
        return fallback_text[:12000]
    finally:
        try:
            from services.embedding_service import unload_bge_model
            unload_bge_model()
        except:
            pass

@celery_app.task(bind=True, name="stages.summarization")
def run_summarization(self, previous_result: dict):
    job_id = previous_result["job_id"]
    doc_id = previous_result["document_id"]
    user_id = previous_result.get("user_id", "system")
    
    sync_update_job(job_id, JobStatus.PROCESSING, "Generating Summary", 95)
    
    text = previous_result.get("refined_text", "")
    if not text:
        text = previous_result.get("raw_text", "")
    
    if not text.strip():
        sync_update_job(job_id, JobStatus.COMPLETED, "Completed without text", 100)
        return previous_result
        
    print(f"[{job_id}] Generating Abstractive Summary via Qwen3-4B Natively...")
    
    try:
        intelligence = previous_result.get("intelligence", {})
        original_keywords = intelligence.get("keywords", [])
        
        language_meta = previous_result.get("language_meta", {})
        original_language_name = language_meta.get("language_name", "the exact same language")
        
        qwen_target_language = original_language_name
        if previous_result.get("needs_english_pivot", False):
            qwen_target_language = "English"
            print(f"[{job_id}] English Pivot: Prompting Qwen to summarize in English first...")
        else:
            print(f"[{job_id}] Target language for summarization: {qwen_target_language}")

        # End-to-End ChromaDB Long Context Retrieval — scoped to current document only!
        context_text = run_async(build_context_from_chroma(user_id, doc_id, original_keywords, text))
        
        headline, detailed_summary, bullet_summary, keywords_str = load_and_run_qwen_summarization(context_text, qwen_target_language)
        
        # If Qwen didn't extract keywords well, fallback to GLiNER/IndicBERT keywords
        qwen_keywords = [k.strip() for k in keywords_str.split(',')] if keywords_str else original_keywords
        
        original_code = previous_result.get("original_language_code")
        if original_code:
            language_code = original_code.split("_")[0]
        else:
            language_code = language_meta.get("language_code", None)
        
        run_async(
            async_update_mongo(
                doc_id=doc_id,
                detailed_summary=detailed_summary,
                bullet_summary=bullet_summary,
                chronological_events="",
                headline=headline,
                entities=intelligence.get("entities", []),
                topics=intelligence.get("topics", []),
                keywords=qwen_keywords,
                language=language_code
            )
        )
        
        # If this was a low-resource language, back-translate the English summary
        # and overwrite MongoDB with the original-language version
        if previous_result.get("needs_english_pivot", False):
            _back_translate_and_overwrite(
                job_id=job_id,
                doc_id=doc_id,
                previous_result=previous_result,
                headline=headline,
                detailed_summary=detailed_summary,
                bullet_summary=bullet_summary,
                keywords=qwen_keywords
            )

        print(f"[{job_id}] Pipeline Completed Successfully!")
        sync_update_job(job_id, JobStatus.COMPLETED, "Pipeline Complete", 100)
        
    except Exception as e:
        print(f"[{job_id}] Summarization fallback engaged ({e})")
        headline = "Executive Document Summary"
        paragraphs = [p.strip() for p in text.split("\n") if len(p.strip()) > 40]
        detailed_summary = "\n\n".join(paragraphs[:3]) if paragraphs else text[:1000]
        bullet_summary = ""
        chronological_events = ""
        
        intelligence = previous_result.get("intelligence", {})
        
        run_async(
            async_update_mongo(
                doc_id=doc_id,
                detailed_summary=detailed_summary,
                bullet_summary=bullet_summary,
                chronological_events=chronological_events,
                headline=headline,
                entities=intelligence.get("entities", []),
                topics=intelligence.get("topics", []),
                keywords=intelligence.get("keywords", [])
            )
        )
        sync_update_job(job_id, JobStatus.COMPLETED, "Pipeline Complete", 100)

    return previous_result
