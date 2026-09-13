import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, ArrowUp, RefreshCcw, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export default function Dashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', 'mock_user_123'); 
      const response = await apiClient.post(`${ENDPOINTS.DOCUMENTS.UPLOAD_FILE}?user_id=mock_user_123`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success && response.data.data.job_id) {
        navigate(`/document/${response.data.data.job_id}`);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload document.");
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    await handleFileUpload(acceptedFiles[0]);
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true, // Trigger manually with Plus icon
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt', '.md']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Process as URL ingestion if it looks like a URL
    if (inputValue.startsWith('http://') || inputValue.startsWith('https://')) {
      setIsUploading(true);
      try {
        const response = await apiClient.post(ENDPOINTS.DOCUMENTS.UPLOAD_URL, {
          url: inputValue,
          user_id: 'mock_user_123'
        });
        if (response.data.success && response.data.data.job_id) {
          navigate(`/document/${response.data.data.job_id}`);
        }
      } catch (error) {
        console.error("URL Ingestion failed", error);
        alert("Failed to process URL.");
        setIsUploading(false);
      }
    } else {
      alert("Currently only URL ingestion and file uploads are supported in this demo.");
    }
  };

  return (
    <div {...getRootProps()} className="relative h-full flex flex-col items-center justify-center p-4">
      <input {...getInputProps()} />
      
      {/* Background Watermark Logo */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: "url('/logo.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "40%",
          filter: "invert(1)",
          mixBlendMode: "screen"
        }}
      />
      
      {/* Global Drag Overlay */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-background/90 backdrop-blur-sm border-2 border-primary border-dashed rounded-xl flex items-center justify-center m-4"
          >
            <div className="flex flex-col items-center text-primary">
              <FileText className="w-16 h-16 mb-4" />
              <h2 className="text-2xl font-semibold">Drop document here</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center w-full max-w-[800px] relative z-10 mt-auto mb-8">

        <form 
          onSubmit={handleSubmit}
          className="w-full bg-secondary border border-zinc-700/50 rounded-[24px] p-2 flex flex-col focus-within:ring-1 focus-within:ring-zinc-600 transition-shadow"
        >
          <div className="flex items-center min-h-[44px]">
            <button 
              type="button" 
              onClick={open}
              className="p-2 text-textPrimary hover:bg-zinc-700/50 rounded-full transition-colors mx-1"
              title="Attach File"
            >
              <Plus className="w-5 h-5" />
            </button>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste a URL"
              className="flex-1 bg-transparent border-none outline-none text-textPrimary placeholder:text-muted px-2 py-2 text-base"
              disabled={isUploading}
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || isUploading}
              className={`p-2 rounded-full transition-colors mx-1 flex items-center justify-center ${
                inputValue.trim() && !isUploading ? 'bg-textPrimary text-background' : 'bg-zinc-700/50 text-zinc-500'
              }`}
            >
              {isUploading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
