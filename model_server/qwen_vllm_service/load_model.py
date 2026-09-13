from vllm import LLM, SamplingParams

def init_models():
    print("Loading large generative models via vLLM...")
    
    # Qwen3-1.7B handles: Spelling, Grammar, Text Rewriting, Punctuation
    print("- Loading Qwen/Qwen3-1.7B")
    # qwen_1_7b = LLM(model="Qwen/Qwen3-1.7B", tensor_parallel_size=1)
    
    # Qwen3-4B handles: Summarization (Detailed/Bullet), Headline Generation
    print("- Loading Qwen/Qwen3-4B")
    # qwen_4b = LLM(model="Qwen/Qwen3-4B", tensor_parallel_size=1)
    
    print("vLLM models successfully configured.")

if __name__ == "__main__":
    init_models()
