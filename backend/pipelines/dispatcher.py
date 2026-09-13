from celery import chain
import workers.stages.stage_01_detection as s1
import workers.stages.stage_02_parsing as s2
import workers.stages.stage_03_linguistics as s3
import workers.stages.stage_03b_pivot_translation as s3b
import workers.stages.stage_04_refinement as s4
import workers.stages.stage_05_embedding as s5
import workers.stages.stage_06_intelligence as s6
import workers.stages.stage_07_summarization as s7

class PipelineDispatcher:
    @staticmethod
    def trigger_full_pipeline(job_id: str, document_id: str, url: str = None, file_path: str = None):
        """
        Triggers the full linear pipeline via Celery Chain.
        If any stage fails, the chain stops and Celery handles retries.
        """
        workflow = chain(
            s1.run_detection.s(job_id, document_id, url=url, file_path=file_path),
            s2.run_parsing.s(),
            s3.run_linguistics.s(),
            s3b.run_pivot_translation.s(),   # No-op for mainstream languages; translates low-resource → English
            s4.run_refinement.s(),
            s5.run_embedding.s(),
            s6.run_intelligence.s(),
            s7.run_summarization.s()
        )
        workflow.apply_async()
