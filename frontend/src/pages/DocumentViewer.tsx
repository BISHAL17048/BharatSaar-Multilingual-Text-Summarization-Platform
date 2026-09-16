import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Sparkles, Globe2, FileText, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { useHistory } from '../contexts/HistoryContext';
import { UI_TRANSLATIONS } from '../utils/translations';

export default function DocumentViewer() {
  const { id } = useParams(); // This is the job_id
  const [jobStatus, setJobStatus] = useState<string>('PENDING');
  const { triggerRefresh } = useHistory();
  
  // Intelligence Data
  const [docData, setDocData] = useState<any>(null);
  const [summaryText, setSummaryText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Translation State
  const [targetLanguage, setTargetLanguage] = useState('original');
  const [displayLanguage, setDisplayLanguage] = useState('original');
  const [isTranslating, setIsTranslating] = useState(false);

  const INDIC_LANGUAGES = [
    { code: 'hin_Deva', name: 'Hindi', native: 'हिन्दी' },
    { code: 'asm_Beng', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'ben_Beng', name: 'Bengali', native: 'বাংলা' },
    { code: 'brx_Deva', name: 'Bodo', native: 'बड़ो' },
    { code: 'doi_Deva', name: 'Dogri', native: 'डोगरी' },
    { code: 'eng_Latn', name: 'English', native: 'English' },
    { code: 'guj_Gujr', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kan_Knda', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'kas_Arab', name: 'Kashmiri', native: 'कॉशुर' },
    { code: 'gom_Deva', name: 'Konkani', native: 'कोंकणी' },
    { code: 'mai_Deva', name: 'Maithili', native: 'मैथिली' },
    { code: 'mal_Mlym', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'mni_Beng', name: 'Manipuri', native: 'মৈতৈলোন্' },
    { code: 'mar_Deva', name: 'Marathi', native: 'मराठी' },
    { code: 'npi_Deva', name: 'Nepali', native: 'नेपाली' },
    { code: 'ory_Orya', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'pan_Guru', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'san_Deva', name: 'Sanskrit', native: 'संस्कृतम्' },
    { code: 'sat_Olck', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
    { code: 'snd_Arab', name: 'Sindhi', native: 'سنڌي' },
    { code: 'tam_Taml', name: 'Tamil', native: 'தமிழ்' },
    { code: 'tel_Telu', name: 'Telugu', native: 'తెలుగు' },
    { code: 'urd_Arab', name: 'Urdu', native: 'اُردُو' }
  ];

  const shortCodeMap: Record<string, {native: string, english: string}> = {
    'hi': { native: 'हिन्दी', english: 'Hindi' },
    'as': { native: 'অসমীয়া', english: 'Assamese' },
    'asm': { native: 'অসমীয়া', english: 'Assamese' },
    'bn': { native: 'বাংলা', english: 'Bengali' },
    'brx': { native: 'बड़ो', english: 'Bodo' },
    'doi': { native: 'डोगरी', english: 'Dogri' },
    'en': { native: 'English', english: 'English' },
    'gu': { native: 'ગુજરાતી', english: 'Gujarati' },
    'kn': { native: 'ಕನ್ನಡ', english: 'Kannada' },
    'ks': { native: 'कॉशुर', english: 'Kashmiri' },
    'kas': { native: 'कॉशुर', english: 'Kashmiri' },
    'kok': { native: 'कोंकणी', english: 'Konkani' },
    'gom': { native: 'कोंकणी', english: 'Konkani' },
    'mai': { native: 'मैथिली', english: 'Maithili' },
    'ml': { native: 'മലയാളം', english: 'Malayalam' },
    'mni': { native: 'মৈতৈলোন্', english: 'Manipuri' },
    'mr': { native: 'मराठी', english: 'Marathi' },
    'ne': { native: 'नेपाली', english: 'Nepali' },
    'or': { native: 'ଓଡ଼િଆ', english: 'Odia' },
    'pa': { native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
    'sa': { native: 'संस्कृतम्', english: 'Sanskrit' },
    'san': { native: 'संस्कृतम्', english: 'Sanskrit' },
    'sat': { native: 'ᱥᱟᱱᱛᱟᱲᱤ', english: 'Santali' },
    'sd': { native: 'سنڌي', english: 'Sindhi' },
    'ta': { native: 'தமிழ்', english: 'Tamil' },
    'te': { native: 'తెలుగు', english: 'Telugu' },
    'ur': { native: 'اُردُو', english: 'Urdu' }
  };

  const getOriginalLanguageLabel = () => {
    const langCode = docData?.language || docData?.detection_meta?.language;
    if (!langCode) return "Original Language";

    const langData = shortCodeMap[langCode];
    if (langData) {
      return `${langData.native} (${langData.english} - Original Language)`;
    }
    return `${langCode} (Original Language)`;
  };

  // ── Reset ALL state whenever the user navigates to a different document ──
  useEffect(() => {
    setJobStatus('PENDING');
    setDocData(null);
    setSummaryText('');
    setIsTyping(false);
    setDisplayLanguage('original');
    setTargetLanguage('original');
    setIsTranslating(false);
  }, [id]);

  // ── Job status polling ──
  useEffect(() => {
    if (!id) return;

    let intervalId: ReturnType<typeof setInterval>;
    let stopped = false;

    const fetchStatus = async () => {
      try {
        const res = await apiClient.get(ENDPOINTS.JOBS.GET_STATUS(id));
        if (res.data.success) {
          const status = res.data.data.status;
          const doc_id = res.data.data.document_id;

          setJobStatus(status);

          if (doc_id) {
            fetchDocumentData(doc_id);
          }

          if (status === 'COMPLETED' && doc_id) {
            stopped = true;
            clearInterval(intervalId);
            triggerRefresh(); // Signal sidebar to refresh its history list
          }
        }
      } catch (err) {
        console.error('Failed to fetch job status', err);
      }
    };

    // Always poll — do NOT gate on stale closed-over jobStatus
    intervalId = setInterval(() => { if (!stopped) fetchStatus(); }, 2000);
    fetchStatus(); // Immediate first check

    return () => {
      stopped = true;
      clearInterval(intervalId);
    };
  }, [id]); // Only re-run when the document id changes

  // Translation Polling Effect
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (isTranslating && docData?._id) {
      intervalId = setInterval(async () => {
        try {
          const res = await apiClient.get(ENDPOINTS.DOCUMENTS.GET_BY_ID(docData._id));
          if (res.data.success && res.data.data.translations?.[targetLanguage]) {
            setDocData(res.data.data);
            setDisplayLanguage(targetLanguage);
            setIsTranslating(false);
            clearInterval(intervalId);
            // Retrigger typing effect for translated summary
            startTypingEffect(res.data.data.translations[targetLanguage].detailed_summary || res.data.data.translations[targetLanguage].summary || "");
          }
        } catch(e) {
          console.error(e);
        }
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [isTranslating, targetLanguage, docData?._id]);

  const startTypingEffect = (fullText: string) => {
    if (!fullText) return;
    setIsTyping(true);
    let i = 0;
    const typingInterval = setInterval(() => {
      setSummaryText(fullText.substring(0, i));
      i += 3;
      if (i > fullText.length) {
        setSummaryText(fullText);
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 15);
  };

  const fetchDocumentData = async (doc_id: string) => {
    try {
      const res = await apiClient.get(ENDPOINTS.DOCUMENTS.GET_BY_ID(doc_id));
      if (res.data.success) {
        const data = res.data.data;
        setDocData(data);
        
        // Start streaming effect for summary
        if (data.detailed_summary || data.summary) {
          startTypingEffect(data.detailed_summary || data.summary);
        }
      }
    } catch (err) {
      console.error("Failed to fetch document", err);
    }
  };

  const handleTranslate = async () => {
    if (!docData?._id || displayLanguage === targetLanguage) return;
    
    // If we already have the translation, just switch to it
    if (targetLanguage === 'original' || docData.translations?.[targetLanguage]) {
      setDisplayLanguage(targetLanguage);
      if (targetLanguage === 'original') {
        startTypingEffect(docData.detailed_summary || docData.summary || "");
      } else {
        startTypingEffect(docData.translations[targetLanguage].detailed_summary || "");
      }
      return;
    }
    
    // Otherwise trigger the API
    setIsTranslating(true);
    try {
      await apiClient.post(`/translate?doc_id=${docData._id}&target_lang=${targetLanguage}`);
    } catch(e) {
      console.error(e);
      setIsTranslating(false);
    }
  };

  const getLocalized = (field: string) => {
    if (displayLanguage === 'original' || !docData?.translations?.[displayLanguage]) {
      return docData?.[field] || "";
    }
    return docData.translations[displayLanguage][field] || "";
  };

  const formatBulletSummary = (content: string) => {
    if (!content) return '';
    let lines = content.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length <= 1 && content.length > 100) {
      const sentences = content.split(/(?<=[।\.\?!])\s+/).map(s => s.trim()).filter(Boolean);
      if (sentences.length > 1) {
        lines = sentences;
      }
    }
    return lines
      .map(line => {
        const clean = line.replace(/^[-*•–—]\s*/, '').replace(/^\d+[\.\)]\s*/, '').trim();
        return `- ${clean}`;
      })
      .join('\n');
  };

  const getUIString = (key: string, fallback: string) => {
    const currentLang = displayLanguage !== 'original' ? displayLanguage : (docData?.language || docData?.detection_meta?.language || 'eng_Latn');
    if (UI_TRANSLATIONS[currentLang] && UI_TRANSLATIONS[currentLang][key]) {
      return UI_TRANSLATIONS[currentLang][key];
    }
    return fallback;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32 pt-8 px-4">
      
      {/* User Bubble */}
      <div className="flex gap-4">
        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-zinc-300" />
        </div>
        <div className="flex-1 pt-1">
          <p className="font-semibold text-textPrimary mb-1">You</p>
          <div className="bg-secondary inline-flex items-center px-4 py-2 rounded-2xl border border-zinc-700">
            <FileText className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm text-textPrimary truncate max-w-md">
              {docData?.original_name || docData?.url || `Analyze Document (Job ${id})`}
            </span>
          </div>
        </div>
      </div>

      {/* AI Bubble */}
      <div className="flex gap-4 mt-8">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 pt-1 overflow-hidden">
          <p className="font-semibold text-textPrimary mb-2">BharatSaar</p>

          {jobStatus !== 'COMPLETED' || (!docData?.summary && !docData?.detailed_summary) ? (
            <div className="flex items-center space-x-3 text-muted">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Analyzing document structure and content...</span>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Translation Controls directly embedded */}
              <div className="flex items-center space-x-2 bg-secondary p-1.5 rounded-lg border border-zinc-700/50 w-fit">
                <Globe2 className="w-4 h-4 text-muted ml-2" />
                <select 
                  value={targetLanguage} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setTargetLanguage(val);
                    if (val === 'original' && docData) {
                      setDisplayLanguage('original');
                      startTypingEffect(docData.detailed_summary || docData.summary || "");
                    }
                  }}
                  className="bg-transparent text-sm text-textPrimary focus:outline-none border-none py-1 pr-6 cursor-pointer"
                  disabled={isTranslating}
                >
                  <option value="original" className="text-zinc-900">{getOriginalLanguageLabel()}</option>
                  <hr className="bg-zinc-800" />
                  {INDIC_LANGUAGES.filter(lang => {
                    const langCode = docData?.language || docData?.detection_meta?.language;
                    if (!langCode) return true;
                    const originalLangData = shortCodeMap[langCode];
                    if (originalLangData && originalLangData.english === lang.name) {
                      return false; // Skip the original language in the translation list
                    }
                    return true;
                  }).map(lang => (
                    <option key={lang.code} value={lang.code} className="text-zinc-900">
                      {lang.native} ({lang.name})
                    </option>
                  ))}
                </select>
                {targetLanguage !== 'original' && (
                  <button 
                    onClick={handleTranslate}
                    disabled={isTranslating || displayLanguage === targetLanguage}
                    className="bg-primary hover:opacity-90 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-colors flex items-center"
                  >
                    {isTranslating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                    {isTranslating ? "Translating..." : "Translate"}
                  </button>
                )}
              </div>

              {/* Main Content */}
              <div className="prose prose-invert prose-zinc max-w-none text-textPrimary">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  {getLocalized('headline') || "BharatSaar Report"}
                </h2>
                
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                  {summaryText}
                  {isTyping && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse align-middle"></span>}
                </p>

                {(docData.bullet_summary || getLocalized('bullet_summary')) && !isTyping && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-white mb-3">{getUIString('keyTakeaways', 'Key Takeaways')}</h3>
                    <div className="text-[15px] whitespace-pre-wrap leading-relaxed text-zinc-300 bg-secondary/50 p-4 rounded-xl border border-zinc-800/50">
                      {formatBulletSummary(getLocalized('bullet_summary'))}
                    </div>
                  </div>
                )}
                
                {(() => {
                  const localizedKeywords = getLocalized('keywords');
                  const keywordsToDisplay = Array.isArray(localizedKeywords) && localizedKeywords.length > 0 
                    ? localizedKeywords 
                    : (docData.keywords || docData.intelligence?.keywords || []);
                  
                  if (keywordsToDisplay && keywordsToDisplay.length > 0 && !isTyping) {
                    return (
                      <div className="mt-8 flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-muted mr-2 self-center">{getUIString('keywords', 'Keywords')}:</span>
                        {keywordsToDisplay.map((kw: string, idx: number) => (
                          <span key={`k-${idx}`} className="px-2 py-1 bg-secondary text-zinc-300 rounded text-xs">
                            {kw}
                          </span>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
