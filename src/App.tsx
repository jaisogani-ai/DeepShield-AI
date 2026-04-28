import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, UploadCloud, FileText, MessageSquare, LayoutDashboard, 
  ShieldAlert, CheckCircle, AlertTriangle, AlertOctagon,
  Image as ImageIcon, Video, Mic, RefreshCw, Smartphone, Search,
  X, Database, Activity, ShieldCheck, Link2, Lock,
  Copy, Download, ExternalLink, Award
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const apiKey = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const ai = new GoogleGenAI({ apiKey });

// --- Types ---
type Page = 'hero' | 'deepfake' | 'document' | 'scam' | 'dashboard' | 'url';
type ScanResult = {
  id: string;
  type: string;
  date: string;
  verdict: 'REAL' | 'FAKE' | 'SUSPICIOUS' | 'SAFE' | 'DANGEROUS';
  confidence: number;
  threat_level: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  red_flags: string[];
  explanation_hindi?: string;
  explanation_english: string;
  recommendation: string;
  scam_type?: string;
  impersonating?: string;
};

// --- Shared Utility: File to Base64 ---
const translations = {
  en: {
    protectingIndia: "Protecting India from",
    aiDeception: "AI Deception",
    heroDesc: "India's first AI-powered Deepfake & Digital Asset Protection system. Detect media manipulation, forged documents, and sophisticated scam patterns instantly.",
    scansAnalyzed: "SCANS ANALYZED",
    accuracy: "ACCURACY",
    speed: "SPEED",
    scanMedia: "Scan Media",
    scanMediaDesc: "Detect deepfakes in Audio, Video & Images",
    verifyDoc: "Verify Document",
    verifyDocDesc: "Check Aadhaar, PAN & Certificates for forgery",
    checkScam: "Check Scam",
    checkScamDesc: "Analyze suspicious messages & call scripts",
    navMediaScan: "Media Scan",
    navVerifyDoc: "Verify Doc",
    navCheckScam: "Check Scam",
    navCheckUrl: "Check URL",
    navDashboard: "Dashboard",
    uploadDocMsg: "Upload a document to begin verification",
    uploadMediaMsg: "Upload video, audio, or image to detect AI deepfakes.",
    uploadDocDesc: "Upload PAN, Aadhaar, certificates or identity cards for authenticity check.",
    threatDashboard: "Threat Dashboard",
    monitoring: "Monitoring digital assets and real-time scanning history.",
    totalScans: "Total Scans",
    threatsDetected: "Threats Detected",
    safeAssets: "Safe Assets",
    recentScans: "Recent Security Scans",
    indiaThreatMap: "India Threat Map",
    builtBy: "Built by Team",
    clickToUpload: "Click to upload file",
    supports: "Supports",
    startScan: "Start Security Scan",
    analyzing: "DeepShield Analyzing...",
    scamTitle: "Scam Call & Text Checker",
    scamDesc: "Paste suspicious SMS, WhatsApp messages, or call transcripts.",
    analyzeMsg: "Analyze Message",
    checkUrlTitle: "URL Safety Checker",
    checkUrlDesc: "Paste suspicious URL to analyze for phishing and fraud.",
    pasteUrlPlaceholder: "Paste suspicious URL here... e.g. http://paypa1.com",
    scanUrl: "Scan URL",
    resultsWillAppear: "Analysis results will appear here",
    verificationReady: "Upload a document to begin verification"
  },
  hi: {
    protectingIndia: "भारत की रक्षा करें",
    aiDeception: "एआई धोखाधड़ी से",
    heroDesc: "भारत का पहला एआई-पावर्ड डीपफेक और डिजिटल एसेट प्रोटेक्शन सिस्टम। मीडिया हेरफेर, जाली दस्तावेजों और परिष्कृत घोटाले के पैटर्न का तुरंत पता लगाएं।",
    scansAnalyzed: "स्कैन विश्लेषण",
    accuracy: "सटीकता",
    speed: "गति",
    scanMedia: "मीडिया स्कैन",
    scanMediaDesc: "ऑडियो, वीडियो और छवियों में डीपफेक का पता लगाएं",
    verifyDoc: "दस्तावेज़ सत्यापन",
    verifyDocDesc: "जालसाजी के लिए आधार, पैन और प्रमाणपत्र जांचें",
    checkScam: "स्कैम जांच",
    checkScamDesc: "संदिग्ध संदेशों और कॉल स्क्रिप्ट का विश्लेषण करें",
    navMediaScan: "मीडिया स्कैन",
    navVerifyDoc: "दस्तावेज़",
    navCheckScam: "स्कैम जांच",
    navCheckUrl: "यूआरएल जांच",
    navDashboard: "डैशबोर्ड",
    uploadDocMsg: "सत्यापन शुरू करने के लिए दस्तावेज़ अपलोड करें",
    uploadMediaMsg: "एआई डीपफेक का पता लगाने के लिए वीडियो, ऑडियो या छवि अपलोड करें।",
    uploadDocDesc: "प्रमाणिकता जांच के लिए पैन, आधार, प्रमाणपत्र या पहचान पत्र अपलोड करें।",
    threatDashboard: "खतरा डैशबोर्ड",
    monitoring: "डिजिटल संपत्ति और रीयल-टाइम स्कैनिंग इतिहास की निगरानी करें।",
    totalScans: "कुल स्कैन",
    threatsDetected: "खतरे पाए गए",
    safeAssets: "सुरक्षित संपत्ति",
    recentScans: "हाल के सुरक्षा स्कैन",
    indiaThreatMap: "भारत थ्रेट मैप",
    builtBy: "टीम द्वारा निर्मित",
    clickToUpload: "फ़ाइल अपलोड करने के लिए क्लिक करें",
    supports: "समर्थन:",
    startScan: "सुरक्षा स्कैन शुरू करें",
    analyzing: "डीपशील्ड विश्लेषण कर रहा है...",
    scamTitle: "स्कैम कॉल और टेक्स्ट चेकर",
    scamDesc: "संदिग्ध एसएमएस, व्हाट्सएप संदेश या कॉल ट्रांसक्रिप्ट चिपकाएं।",
    analyzeMsg: "संदेश का विश्लेषण करें",
    checkUrlTitle: "यूआरएल सुरक्षा जांच",
    checkUrlDesc: "फ़िशिंग और धोखाधड़ी के लिए संदिग्ध URL पेस्ट करें।",
    pasteUrlPlaceholder: "संदिग्ध URL यहाँ पेस्ट करें... जैसे http://paypa1.com",
    scanUrl: "यूआरएल स्कैन करें",
    resultsWillAppear: "विश्लेषण के परिणाम यहां दिखाई देंगे",
    verificationReady: "सत्यापन शुरू करने के लिए दस्तावेज़ अपलोड करें"
  }
};

type LangType = 'en' | 'hi';
const LangContext = React.createContext<{lang: LangType, setLang: (l: LangType) => void, t: typeof translations.en}>({
  lang: 'en', setLang: () => {}, t: translations.en
});
export const useLang = () => React.useContext(LangContext);

const SoundContext = React.createContext<{isSoundEnabled: boolean, toggleSound: () => void, playSound: (type: 'SAFE' | 'FAKE') => void}>({
  isSoundEnabled: true, toggleSound: () => {}, playSound: () => {}
});
export const useSound = () => React.useContext(SoundContext);

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}

// --- App Component ---
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('hero');
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [lang, setLang] = useState<LangType>('en');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('deepshield_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const toggleSound = () => setIsSoundEnabled(!isSoundEnabled);

  const playSound = (type: 'SAFE' | 'FAKE') => {
    if (!isSoundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'SAFE') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(400, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(300, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(400, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  const addToHistory = (result: ScanResult) => {
    const newHistory = [result, ...history];
    setHistory(newHistory);
    localStorage.setItem('deepshield_history', JSON.stringify(newHistory));
    
    // Play sound based on result verdict
    if (['FAKE', 'SUSPICIOUS', 'DANGEROUS'].includes(result.verdict)) {
      playSound('FAKE');
    } else {
      playSound('SAFE');
    }
  };

  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <SoundContext.Provider value={{ isSoundEnabled, toggleSound, playSound }}>
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          
          <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {currentPage === 'hero' && <Hero setCurrentPage={setCurrentPage} key="hero" />}
              {currentPage === 'deepfake' && <DeepfakeScanner onScanComplete={addToHistory} key="deepfake" />}
              {currentPage === 'document' && <DocumentVerifier onScanComplete={addToHistory} key="document" />}
              {currentPage === 'scam' && <ScamChecker onScanComplete={addToHistory} key="scam" />}
              {currentPage === 'url' && <UrlChecker onScanComplete={addToHistory} key="url" />}
              {currentPage === 'dashboard' && <Dashboard history={history} key="dashboard" />}
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </SoundContext.Provider>
    </LangContext.Provider>
  );
}

// --- Navbar Component ---
function Navbar({ currentPage, setCurrentPage }: { currentPage: Page, setCurrentPage: (p: Page) => void }) {
  const { lang, setLang, t } = useLang();
  const { isSoundEnabled, toggleSound } = useSound();
  
  const navItems: { id: Page; label: string; icon: any }[] = [
    { id: 'deepfake', label: t.navMediaScan, icon: Video },
    { id: 'document', label: t.navVerifyDoc, icon: FileText },
    { id: 'scam', label: t.navCheckScam, icon: MessageSquare },
    { id: 'url', label: t.navCheckUrl, icon: Link2 },
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-900/50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <button 
          onClick={() => setCurrentPage('hero')}
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <Shield className="w-8 h-8 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-30 group-hover:opacity-60 transition-opacity rounded-full"></div>
          </div>
          <span className="text-xl font-bold tracking-wider glow-text-cyan">
            DeepShield <span className="text-cyan-500">AI</span>
          </span>
        </button>

        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${active 
                    ? 'bg-cyan-950/50 text-cyan-400 glow-cyan border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
          
          <button
            onClick={toggleSound}
            className="ml-2 px-3 py-1.5 rounded-lg text-sm bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700 flex items-center whitespace-nowrap"
            title="Toggle Sound"
          >
            {isSoundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
          </button>

          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="ml-2 px-3 py-1.5 rounded-lg text-sm font-bold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700 whitespace-nowrap"
          >
            हिंदी | EN
          </button>
        </nav>
      </div>
    </header>
  );
}

// --- Footer Component ---
function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-12 text-center text-slate-500 text-sm">
      <p>{t.builtBy} <span className="font-semibold text-slate-300">Neuro Galaxy</span></p>
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="w-2 h-2 rounded-full animate-pulse bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
        <span>Powered by Google Gemini 1.5 Pro</span>
      </div>
    </footer>
  );
}

// --- Hero Page ---
function Hero({ setCurrentPage }: { setCurrentPage: (p: Page) => void; key?: string }) {
  const { t } = useLang();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center py-12 sm:py-20"
    >
      <div className="relative mb-8">
        <motion.div
           animate={{ scale: [1, 1.05, 1] }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           className="relative z-10"
        >
           <Shield className="w-24 h-24 sm:w-32 sm:h-32 text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" strokeWidth={1.5} />
        </motion.div>
        <div className="absolute inset-0 bg-cyan-500/20 blur-[50px] rounded-full"></div>
      </div>
      
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-center mb-6 tracking-tighter text-white leading-[1.1]">
        {t.protectingIndia}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 glow-text-cyan">
          {t.aiDeception}
        </span>
      </h1>
      
      <p className="text-lg sm:text-xl text-slate-400 max-w-2xl text-center mb-12 leading-relaxed">
        {t.heroDesc}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {[
          { id: 'deepfake', icon: Video, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', hoverBorder: 'group-hover:border-rose-500/50', hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]', title: t.navMediaScan, desc: t.scanMediaDesc },
          { id: 'document', icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', hoverBorder: 'group-hover:border-emerald-500/50', hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]', title: t.navVerifyDoc, desc: t.verifyDocDesc },
          { id: 'scam', icon: MessageSquare, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', hoverBorder: 'group-hover:border-orange-500/50', hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]', title: t.navCheckScam, desc: t.checkScamDesc },
          { id: 'url', icon: Link2, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', hoverBorder: 'group-hover:border-indigo-500/50', hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]', title: t.navCheckUrl, desc: t.checkUrlDesc },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id as Page)}
            className={`group relative flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border ${item.border} ${item.hoverBorder} ${item.hoverGlow} transition-all duration-300 overflow-hidden`}
          >
            <div className={`p-3 rounded-xl ${item.bg} ${item.color} mb-4 transition-transform group-hover:scale-110 duration-300`}>
              <item.icon className="w-6 h-6 stroke-2" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.desc}</p>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// --- Generic File Scanner Component ---
function FileScanner({ 
  title, 
  description, 
  acceptedTypes, 
  analyzeType,
  onScanComplete 
}: { 
  title: string, 
  description: string, 
  acceptedTypes: string, 
  analyzeType: 'media' | 'document',
  onScanComplete: (r: ScanResult) => void 
}) {
  const { t } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
    if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsScanning(true);
    setError(null);
    
    try {
      const base64Data = await fileToBase64(file);
      const mimeType = file.type;
      
      let systemPrompt = "";
      if (analyzeType === 'media') {
        systemPrompt = `You are DeepShield AI, India's top deepfake detection system. 
Analyze this media file for signs of AI manipulation, deepfake generation, or digital tampering. Check for: unnatural eye blinking, facial boundary artifacts, lighting inconsistencies, pixel-level anomalies, unnatural skin texture, audio-visual sync issues. 
ALWAYS Return analysis in this EXACT JSON format ONLY (Do not use markdown blocks, just raw JSON text):
{
  "verdict": "FAKE",
  "confidence": 95,
  "threat_level": "CRITICAL",
  "red_flags": ["list", "of", "issues found"],
  "explanation_hindi": "simple explanation in Hindi",
  "explanation_english": "simple explanation in English",
  "recommendation": "what user should do next"
}
If media looks completely natural, set verdict="REAL" and threat_level="SAFE".`;
      } else {
        systemPrompt = `You are DeepShield AI document verification system. 
Analyze this document image for signs of forgery or tampering. Check: font consistency, logo authenticity, QR code validity, color gradients, hologram indicators, layout standards, text alignment, government watermarks. 
ALWAYS Return analysis in this EXACT JSON format ONLY (Do not use markdown blocks, just raw JSON text):
{
  "verdict": "SUSPICIOUS",
  "confidence": 88,
  "threat_level": "HIGH",
  "red_flags": ["font mismatch", "signature anomaly"],
  "explanation_hindi": "simple explanation in Hindi",
  "explanation_english": "simple explanation in English",
  "recommendation": "what user should do next"
}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          systemPrompt,
          { inlineData: { data: base64Data, mimeType } }
        ]
      });

      if (!response.text) throw new Error("Empty response from AI");
      
      // Clean up markdown syntax if it exists
      let rawJson = response.text.trim();
      if (rawJson.startsWith('```json')) rawJson = rawJson.replace(/```json\n?/, '');
      if (rawJson.startsWith('```')) rawJson = rawJson.replace(/```\n?/, '');
      if (rawJson.endsWith('```')) rawJson = rawJson.replace(/\n?```$/, '');

      const parsed: ScanResult = JSON.parse(rawJson);
      
      // Decorate with metadata
      parsed.id = Math.random().toString(36).substr(2, 9);
      parsed.date = new Date().toISOString();
      parsed.type = analyzeType === 'media' ? 'Media File' : 'Document';
      
      setResult(parsed);
      onScanComplete(parsed);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze file. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-8 text-center text-left sm:text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center justify-center gap-3">
          {analyzeType === 'media' ? <Video className="w-8 h-8 text-cyan-400" /> : <FileText className="w-8 h-8 text-cyan-400" />}
          {title}
        </h2>
        <p className="text-slate-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="flex flex-col gap-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[300px]
              ${isScanning ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-700 hover:border-cyan-500/50 hover:bg-slate-900/50'}
              ${file && !isScanning ? 'border-cyan-500/50 bg-slate-900' : ''}
            `}
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept={acceptedTypes}
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />
            
            {previewUrl && file?.type.startsWith('video/') ? (
              <video src={previewUrl} className="max-h-[220px] rounded-lg object-contain" controls />
            ) : previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-h-[220px] rounded-lg object-contain" />
            ) : (
              <>
                <UploadCloud className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-300 font-medium text-lg mb-1">{t.clickToUpload}</p>
                <p className="text-slate-500 text-sm">{t.supports} {acceptedTypes.replace(/,/g, ', ')}</p>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            {file && (
              <span className="text-sm text-cyan-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {file.name} ({(file.size/1024/1024).toFixed(2)} MB)
              </span>
            )}
            <button
              onClick={handleAnalyze}
              disabled={!file || isScanning}
              className={`ml-auto px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all
                ${!file || isScanning 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                }`}
            >
              {isScanning ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> {t.analyzing}</>
              ) : (
                <><Search className="w-5 h-5" /> {t.startScan}</>
              )}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        {/* Results Section */}
        <div className="flex flex-col relative h-full min-h-[400px]">
          {isScanning ? (
            <ScanningAnimation type={analyzeType} />
          ) : result ? (
            <AnalysisResultCard result={result} />
          ) : analyzeType === 'document' ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800/50 p-8 text-center text-slate-400">
              <ShieldCheck className="w-16 h-16 mb-4 text-cyan-500 opacity-80" />
              <p className="text-lg text-white font-medium mb-4">{t.verificationReady}</p>
              <ul className="text-sm space-y-2 text-left w-full max-w-[200px]">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0"/> Aadhaar Cards</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0"/> PAN Cards</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0"/> Passports</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0"/> Certificates</li>
              </ul>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800/50 p-8 text-center text-slate-500">
              <Shield className="w-16 h-16 mb-4 opacity-50" />
              <p>{t.resultsWillAppear}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- Pages implementations using generic scanner ---
function DeepfakeScanner({ onScanComplete }: { onScanComplete: (r: ScanResult) => void; key?: string }) {
  const { t } = useLang();
  return <FileScanner 
    title={t.scanMedia} 
    description={t.uploadMediaMsg}
    acceptedTypes=".jpg,.jpeg,.png,.mp4,.avi,.mp3,.wav"
    analyzeType="media"
    onScanComplete={onScanComplete}
  />;
}

function DocumentVerifier({ onScanComplete }: { onScanComplete: (r: ScanResult) => void; key?: string }) {
  const { t } = useLang();
  return <FileScanner 
    title={t.verifyDoc} 
    description={t.uploadDocDesc}
    acceptedTypes="image/*,application/pdf"
    analyzeType="document"
    onScanComplete={onScanComplete}
  />;
}

// --- Scam Text Checker ---
function ScamChecker({ onScanComplete }: { onScanComplete: (r: ScanResult) => void; key?: string }) {
  const { t } = useLang();
  const [text, setText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const systemPrompt = `You are DeepShield AI scam detection system for Indian users.
Analyze this text/message/call transcript for scam patterns. Check for: urgency manipulation, fake government impersonation, UPI fraud patterns, KYC scam language, lottery fraud, job scam patterns, loan fraud, romance scam, electricity bill scam.
ALWAYS Return analysis in this EXACT JSON format ONLY (Do not use markdown blocks, just raw JSON text):
{
  "verdict": "FAKE",
  "confidence": 99,
  "threat_level": "CRITICAL",
  "scam_type": "UPI Fraud / Extortion",
  "red_flags": ["list", "of", "manipulation tactics identified"],
  "explanation_hindi": "simple explanation in Hindi",
  "explanation_english": "simple explanation in English",
  "recommendation": "what user should do next step by step"
}
If it looks like a normal legitimate message, set verdict="REAL" and threat_level="SAFE".`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          systemPrompt,
          { text: text }
        ]
      });

      if (!response.text) throw new Error("Empty response from AI");
      
      let rawJson = response.text.trim();
      if (rawJson.startsWith('```json')) rawJson = rawJson.replace(/```json\n?/, '');
      if (rawJson.startsWith('```')) rawJson = rawJson.replace(/```\n?/, '');
      if (rawJson.endsWith('```')) rawJson = rawJson.replace(/\n?```$/, '');

      const parsed: ScanResult = JSON.parse(rawJson);
      
      parsed.id = Math.random().toString(36).substr(2, 9);
      parsed.date = new Date().toISOString();
      parsed.type = 'Text/Message';
      
      setResult(parsed);
      onScanComplete(parsed);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze text.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-8 text-center text-left sm:text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center justify-center gap-3">
          <MessageSquare className="w-8 h-8 text-cyan-400" />
          {t.scamTitle}
        </h2>
        <p className="text-slate-400">{t.scamDesc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              className="w-full h-[300px] bg-slate-900 border border-slate-700 rounded-2xl p-4 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              placeholder="Paste the suspicious message here...&#10;&#10;e.g., 'Dear customer, your SBI account PAN link is pending. Your account will be blocked today. Click link: http://sbi-kyc-update.xyz'"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {text && (
              <button 
                onClick={() => setText('')}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || isScanning}
              className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all
                ${!text.trim() || isScanning 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                }`}
            >
              {isScanning ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> {t.analyzing}</>
              ) : (
                <><Search className="w-5 h-5" /> {t.analyzeMsg}</>
              )}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <div className="flex flex-col relative h-full min-h-[400px]">
          {isScanning ? (
            <ScanningAnimation type="document" />
          ) : result ? (
            <AnalysisResultCard result={result} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800/50 p-8 text-center text-slate-500">
              <Shield className="w-16 h-16 mb-4 opacity-50" />
              <p>{t.resultsWillAppear}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- URL Checker ---
function UrlChecker({ onScanComplete }: { onScanComplete: (r: ScanResult) => void; key?: string }) {
  const { t } = useLang();
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const systemPrompt = `You are DeepShield AI URL safety analyzer for Indian users. Analyze this URL for signs of phishing, fraud, or cybercrime. Check for: fake banking sites, UPI fraud pages, government impersonation, brand misspelling, suspicious TLDs, HTTP usage for sensitive sites.
ALWAYS Return analysis in this EXACT JSON format ONLY:
{
  "verdict": "SAFE" or "DANGEROUS",
  "confidence": number between 0 and 100,
  "threat_type": "description of threat",
  "impersonating": "what brand/org it fakes",
  "explanation_hindi": "Hindi explanation",
  "explanation_english": "English explanation",
  "action": "what user should do"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          systemPrompt,
          { text: url }
        ]
      });

      if (!response.text) throw new Error("Empty response from AI");
      
      let rawJson = response.text.trim();
      if (rawJson.startsWith('```json')) rawJson = rawJson.replace(/```json\n?/, '');
      if (rawJson.startsWith('```')) rawJson = rawJson.replace(/```\n?/, '');
      if (rawJson.endsWith('```')) rawJson = rawJson.replace(/\n?```$/, '');

      const parsed = JSON.parse(rawJson);
      
      const scanResult: ScanResult = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        type: 'URL',
        verdict: parsed.verdict,
        confidence: parsed.confidence,
        threat_level: parsed.verdict === 'DANGEROUS' ? (parsed.confidence > 80 ? 'CRITICAL' : 'HIGH') : 'SAFE',
        red_flags: parsed.verdict === 'DANGEROUS' ? [parsed.threat_type] : [],
        explanation_hindi: parsed.explanation_hindi,
        explanation_english: parsed.explanation_english,
        recommendation: parsed.action,
        scam_type: parsed.threat_type,
        impersonating: parsed.impersonating
      };
      
      setResult(scanResult);
      onScanComplete(scanResult);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze URL.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-8 text-center text-left sm:text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center justify-center gap-3">
          <Link2 className="w-8 h-8 text-cyan-400" />
          {t.checkUrlTitle}
        </h2>
        <p className="text-slate-400">{t.checkUrlDesc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex-1 min-h-[300px] bg-slate-900 border border-slate-700/50 rounded-2xl p-4 flex flex-col focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all">
            <textarea
              className="flex-1 bg-transparent border-none text-slate-300 placeholder:text-slate-600 resize-none outline-none custom-scrollbar"
              placeholder={t.pasteUrlPlaceholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl text-red-500 flex items-center gap-3">
              <AlertOctagon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!url.trim() || isScanning}
            className={`w-full py-4 rounded-xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-3
              ${!url.trim() ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 
                isScanning ? 'bg-cyan-900 text-cyan-400 border border-cyan-800 glow-cyan' : 
                'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }`}
          >
            {isScanning ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> {t.analyzing}</>
            ) : (
              <><Lock className="w-5 h-5" /> {t.scanUrl}</>
            )}
          </button>
        </div>

        <div className="relative min-h-[400px] flex rounded-2xl overflow-hidden">
          {isScanning ? (
            <ScanningAnimation type="media" />
          ) : result ? (
            <AnalysisResultCard result={result} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800/50 p-8 text-center text-slate-500">
              <Shield className="w-16 h-16 mb-4 opacity-50" />
              <p>{t.resultsWillAppear}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- Animated Counter ---
function AnimatedCounter({ value, duration = 2 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function (easeOutExpo)
      const current = progress === 1 ? end : end * (1 - Math.pow(2, -10 * progress));
      setCount(Math.floor(current));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count}</span>;
}

// --- Dashboard Component ---
function Dashboard({ history }: { history: ScanResult[]; key?: string }) {
  const { t } = useLang();
  const fakesCount = history.filter(h => ['FAKE', 'SUSPICIOUS', 'DANGEROUS'].includes(h.verdict)).length;
  const safeCount = history.filter(h => ['REAL', 'SAFE'].includes(h.verdict)).length;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-cyan-400" />
            {t.threatDashboard}
          </h2>
          <p className="text-slate-400">{t.monitoring}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            <h3 className="text-slate-400 font-medium">{t.totalScans}</h3>
          </div>
          <p className="text-4xl font-bold text-white"><AnimatedCounter value={history.length} /></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 glow-red">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="text-slate-400 font-medium">{t.threatsDetected}</h3>
          </div>
          <p className="text-4xl font-bold text-red-500"><AnimatedCounter value={fakesCount} /></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 glow-green">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <h3 className="text-slate-400 font-medium">{t.safeAssets}</h3>
          </div>
          <p className="text-4xl font-bold text-green-500"><AnimatedCounter value={safeCount} /></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertOctagon className="w-5 h-5 text-orange-500" />
            <h3 className="text-slate-400 font-medium">Threat Ratio</h3>
          </div>
          <p className="text-4xl font-bold text-orange-500">
            <AnimatedCounter value={history.length > 0 ? (fakesCount / history.length) * 100 : 0} />%
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-white">{t.indiaThreatMap}</h3>
        </div>
        <div className="p-6 flex justify-center bg-slate-950 min-h-[400px] relative overflow-hidden">
          <IndiaThreatMap />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatTypeBreakdown history={history} />
        <LiveScanFeed history={history} />
      </div>

    </motion.div>
  );
}

// --- Dashboard Extra Components ---
function ThreatTypeBreakdown({ history }: { history: ScanResult[] }) {
  const data = [
    { type: 'Media', label: 'Deepfakes', color: 'bg-indigo-500' },
    { type: 'Document', label: 'Fake Documents', color: 'bg-emerald-500' },
    { type: 'Scam', label: 'Scam Messages', color: 'bg-orange-500' },
    { type: 'URL', label: 'Dangerous URLs', color: 'bg-rose-500' }
  ];

  const maxTotal = Math.max(history.length, 1); // Avoid division by zero
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" /> Threat Breakdown
        </h3>
      </div>
      <div className="p-6 space-y-6 flex-1 bg-slate-950/30">
        {data.map(item => {
          const count = history.filter(h => h.type === item.type).length;
          const threatCount = history.filter(h => h.type === item.type && ['FAKE', 'SUSPICIOUS', 'DANGEROUS'].includes(h.verdict)).length;
          const pct = Math.round((count / maxTotal) * 100) || 0;
          return (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className="text-slate-500"><span className="text-slate-200 font-bold">{threatCount} threats</span> / {count} total</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full ${item.color} shadow-[0_0_10px_currentColor]`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return diffSec <= 1 ? 'Just now' : `${diffSec} seconds ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} mins ago`;
  const diffHrs = Math.round(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  const diffDays = Math.round(diffHrs / 24);
  return `${diffDays} days ago`;
}

function LiveScanFeed({ history }: { history: ScanResult[] }) {
  const recentScans = [...history].reverse().slice(0, 10);
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" /> Live Scan Feed
        </h3>
        <span className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-cyan-400 bg-cyan-950/30 px-2 py-1 flex-shrink-0 rounded-md border border-cyan-900/50">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_5px_#22d3ee]"></span>
          LIVE
        </span>
      </div>
      <div className="p-4 flex-1 h-[350px] overflow-y-auto custom-scrollbar bg-slate-950/50">
        <div className="space-y-3 h-full">
          <AnimatePresence mode="popLayout">
            {recentScans.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-slate-500 py-12"
              >
                <RefreshCw className="w-8 h-8 mb-4 animate-spin opacity-50" />
                <p className="animate-pulse">Awaiting first scan...</p>
              </motion.div>
            ) : (
              recentScans.map((item) => {
                const isThreat = ['FAKE', 'SUSPICIOUS', 'DANGEROUS'].includes(item.verdict);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border backdrop-blur-sm transition-colors gap-3 sm:gap-0
                      ${isThreat 
                        ? 'bg-red-950/10 border-red-900/30 text-red-100' 
                        : 'bg-emerald-950/10 border-emerald-900/30 text-emerald-100'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`shrink-0 p-2.5 rounded-lg ${isThreat ? 'bg-red-900/40 text-red-400' : 'bg-emerald-900/40 text-emerald-400'}`}>
                        {item.type === 'Media' ? <Video className="w-5 h-5" /> : 
                         item.type === 'Document' ? <FileText className="w-5 h-5" /> : 
                         item.type === 'Scam' ? <MessageSquare className="w-5 h-5" /> : 
                         <Link2 className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider ${isThreat ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                            {item.verdict}
                          </span>
                          <span className={`text-[10px] sm:text-xs font-mono font-medium ${isThreat ? 'text-red-300' : 'text-emerald-300'}`}>Conf: {item.confidence}%</span>
                        </div>
                        <div className="text-xs flex items-center gap-1.5 font-medium">
                          {isThreat ? <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                          <span className={isThreat ? "text-red-200" : "text-emerald-200"}>Level: {item.threat_level}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right sm:text-right flex sm:flex-col justify-between sm:justify-end items-center sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800/40 text-xs font-mono">
                      <span className="opacity-50 tracking-widest">{timeAgo(item.date)}</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Scanning Animation overlay ---
function ScanningAnimation({ type }: { type: 'media' | 'document' }) {
  return (
    <div className="absolute inset-0 bg-slate-900 border border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center glow-cyan overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      <motion.div 
        animate={{ translateY: ['-100%', '300%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 left-0 w-full h-[6px] bg-cyan-400 shadow-[0_0_20px_#06b6d4] opacity-80"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Shield className="w-20 h-20 text-cyan-400 mb-6" />
      </motion.div>
      <h3 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">DeepShield AI</h3>
      <p className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">ANALYZING {type === 'media' ? 'PIXELS & AUDIO' : 'PATTERN'}...</p>
      
      <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
        <motion.div 
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'easeInOut' }}
          className="h-full bg-cyan-500"
        />
      </div>
    </div>
  );
}

// --- Analysis Result Card ---
function AnalysisResultCard({ result }: { result: ScanResult }) {
  const isDanger = ['FAKE', 'SUSPICIOUS', 'DANGEROUS'].includes(result.verdict);
  const colorObj = isDanger ? {
    border: 'border-red-500',
    bg: 'bg-red-950/20',
    glow: 'glow-red',
    text: 'text-red-500',
    icon: AlertOctagon
  } : {
    border: 'border-green-500',
    bg: 'bg-green-950/20',
    glow: 'glow-green',
    text: 'text-green-500',
    icon: CheckCircle
  };

  const Icon = colorObj.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`absolute inset-0 border-2 ${colorObj.border} ${colorObj.bg} ${colorObj.glow} rounded-2xl p-6 overflow-y-auto custom-scrollbar`}
    >
      <div className="flex items-start justify-between border-b border-slate-700/50 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Analysis Verdict</h3>
          <div className="flex items-center gap-3">
            <Icon className={`w-8 h-8 ${colorObj.text}`} />
            <span className={`text-4xl font-black tracking-tight ${colorObj.text}`}>{result.verdict}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 font-mono mb-1">Confidence Score</p>
          <p className={`text-3xl font-bold font-mono ${colorObj.text}`}>{result.confidence}%</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-slate-400">Threat Level:</span>
        <span className={`px-3 py-1 rounded text-xs font-bold tracking-wider
          ${result.threat_level === 'CRITICAL' || result.threat_level === 'HIGH' ? 'bg-red-500 text-white' : 
            result.threat_level === 'MEDIUM' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}
        `}>
          {result.threat_level}
        </span>
        {result.scam_type && (
          <span className="ml-auto text-sm font-semibold bg-red-900/50 text-red-300 px-3 py-1 rounded-full border border-red-800">
            {result.scam_type}
          </span>
        )}
        {result.impersonating && (
          <span className="ml-2 text-sm font-semibold bg-orange-900/50 text-orange-300 px-3 py-1 rounded-full border border-orange-800 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> Faking: {result.impersonating}
          </span>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" /> Red Flags Detected
          </h4>
          {result.red_flags.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              {result.red_flags.map((flag, i) => <li key={i}>{flag}</li>)}
            </ul>
          ) : (
            <p className="text-green-400 text-sm">No suspicious anomalies found in the scan.</p>
          )}
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-2">AI Analysis</h4>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-3">
            <p className="text-slate-300 text-sm leading-relaxed"><span className="text-cyan-400 font-semibold text-xs uppercase tracking-widest mr-2">EN</span> {result.explanation_english}</p>
            {result.explanation_hindi && (
              <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3"><span className="text-green-400 font-semibold text-xs uppercase tracking-widest mr-2">HI</span> {result.explanation_hindi}</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-500" /> Recommendation
          </h4>
          <div className="bg-cyan-950/30 border border-cyan-900 p-4 rounded-xl mb-6">
            <p className="text-cyan-100 font-medium">{result.recommendation}</p>
          </div>
        </div>
      </div>
      
      {/* ACTION BLOCK */}
      <div className="mt-8 border-t border-slate-700/50 pt-6">
        {isDanger ? (
          <CybercrimeAction result={result} />
        ) : (
          <CertificateAction result={result} />
        )}
      </div>

    </motion.div>
  );
}

// --- Action Components ---
function CybercrimeAction({ result }: { result: ScanResult }) {
  const [copied, setCopied] = useState(false);
  
  const reportText = `DEEPSHIELD AI THREAT REPORT
Generated: ${new Date().toLocaleString()}
Scan Type: ${result.type}
Verdict: ${result.verdict}
Confidence: ${result.confidence}%
Threat Level: ${result.threat_level}
Red Flags Found:
${result.red_flags.map(f => `- ${f}`).join('\\n')}

Recommended Action: Report immediately to
National Cybercrime Portal: cybercrime.gov.in
Helpline: 1930

Generated by DeepShield AI | Team Neuro Galaxy`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div>
          <h4 className="text-red-400 font-bold flex items-center gap-2 text-lg">
            <ShieldAlert className="w-5 h-5" /> Threat Action Required
          </h4>
          <p className="text-slate-400 text-sm mt-1">Please report this incident to authorities.</p>
        </div>
        <a 
          href="https://cybercrime.gov.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(239,68,68,0.3)]"
        >
          <ExternalLink className="w-4 h-4" /> 🚔 Report to Cybercrime
        </a>
      </div>
      <div className="bg-slate-950/50 rounded-lg border border-slate-800 p-3 relative group">
        <textarea 
          readOnly 
          value={reportText}
          className="w-full bg-transparent text-slate-400 text-xs font-mono resize-none outline-none custom-scrollbar h-32"
        />
        <button 
          onClick={handleCopy}
          className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded flex items-center gap-2 transition-colors"
        >
          {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          <span className="text-xs font-bold">{copied ? 'COPIED' : 'COPY REPORT'}</span>
        </button>
      </div>
    </div>
  );
}

function generateVerificationID() {
  const prefix = "DSA";
  const year = new Date().getFullYear();
  const country = "IND";
  const timestamp = Date.now().toString(36).toUpperCase();
  const scanHash = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${year}-${country}-${timestamp}-${scanHash}`;
}

function CertificateAction({ result }: { result: ScanResult }) {
  const handleDownload = () => {
    const certId = generateVerificationID();
    const dateStr = new Date().toLocaleString();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DeepShield Authenticity Certificate</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f4f8; margin: 0; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .cert-container { background: white; border: 8px solid #0ea5e9; border-radius: 12px; padding: 60px; max-w-3xl; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.1); position: relative; overflow: hidden; }
          .bg-pattern { position: absolute; inset: 0; opacity: 0.03; background-image: radial-gradient(#0ea5e9 2px, transparent 2px); background-size: 30px 30px; pointer-events: none; }
          .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 30px; margin-bottom: 40px; }
          .logo { color: #0ea5e9; font-size: 48px; margin-bottom: 15px; }
          h1 { color: #0f172a; margin: 0; font-size: 36px; letter-spacing: 2px; text-transform: uppercase; }
          .subtitle { color: #64748b; font-size: 18px; margin-top: 10px; }
          .content { text-align: center; }
          .declaration { font-size: 24px; color: #334155; line-height: 1.6; margin: 40px 0; font-weight: 300; }
          .highlight { font-weight: bold; color: #10b981; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 40px; }
          .detail-item { margin-bottom: 15px; }
          .detail-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
          .detail-value { font-size: 16px; color: #0f172a; font-weight: 600; margin-top: 4px; }
          .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; }
          .signature-box { text-align: center; }
          .signature-line { width: 200px; border-top: 1px solid #cbd5e1; margin-bottom: 10px; }
          .id-badge { background: #0f172a; color: white; padding: 10px 20px; border-radius: 4px; font-family: monospace; font-size: 14px; letter-spacing: 1px; }
          .stamp { position: absolute; bottom: 50px; right: 50px; width: 120px; height: 120px; border: 4px solid #10b981; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #10b981; font-weight: bold; font-size: 18px; transform: rotate(-15deg); opacity: 0.8; }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div class="bg-pattern"></div>
          <div class="header">
             <div class="logo">🛡️ DeepShield AI</div>
             <h1>Certificate of Authenticity</h1>
             <div class="subtitle">Digital Asset Verification Report</div>
          </div>
          
          <div class="content">
            <div class="declaration">
              This digital asset has been thoroughly analyzed and is verified as <span class="highlight">GENUINE & SAFE</span> by the DeepShield AI engine.
            </div>
            
            <div class="details">
              <div class="detail-item">
                <div class="detail-label">Asset Type</div>
                <div class="detail-value">${result.type.toUpperCase()}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Verification Date</div>
                <div class="detail-value">${dateStr}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Confidence Score</div>
                <div class="detail-value">${result.confidence}%</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Threat Level</div>
                <div class="detail-value">${result.threat_level}</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>Authorized by <br><b>DeepShield AI Systems</b></div>
            </div>
            <div class="id-badge">ID: ${certId}</div>
          </div>
          <div class="stamp">VERIFIED</div>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-green-950/30 border border-green-900/50 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h4 className="text-green-400 font-bold flex items-center gap-2 text-lg">
          <Award className="w-5 h-5" /> Asset Verified Safe
        </h4>
        <p className="text-slate-400 text-sm mt-1">Generate an official certificate of authenticity for your records.</p>
      </div>
      <button 
        onClick={handleDownload}
        className="bg-green-500 hover:bg-green-600 text-slate-950 px-5 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(16,185,129,0.3)] w-full sm:w-auto justify-center"
      >
        <Download className="w-5 h-5" /> 📜 Download Certificate
      </button>
    </div>
  );
}

// --- India Threat Map Component ---
const INDIA_TOPO_JSON = "/india-topo.json";

const THREAT_CITIES = [
  { name: 'Mumbai', level: 'CRITICAL', coordinates: [72.8777, 19.0760], type: 'Deepfake Video' },
  { name: 'New Delhi', level: 'CRITICAL', coordinates: [77.2090, 28.6139], type: 'UPI Scam SMS' },
  { name: 'Bengaluru', level: 'CRITICAL', coordinates: [77.5946, 12.9716], type: 'Fraudulent Domain' },
  { name: 'Hyderabad', level: 'CRITICAL', coordinates: [78.4867, 17.3850], type: 'Identity Theft' },
  { name: 'Kolkata', level: 'CRITICAL', coordinates: [88.3639, 22.5726], type: 'Fake Passport' },
  { name: 'Chennai', level: 'HIGH', coordinates: [80.2707, 13.0827], type: 'Phishing Attack' },
  { name: 'Ahmedabad', level: 'HIGH', coordinates: [72.5714, 23.0225], type: 'Document Forgery' },
  { name: 'Jaipur', level: 'HIGH', coordinates: [75.7873, 26.9124], type: 'Scam Call' },
  { name: 'Pune', level: 'HIGH', coordinates: [73.8567, 18.5204], type: 'Deepfake Audio' },
  { name: 'Lucknow', level: 'HIGH', coordinates: [80.9462, 26.8467], type: 'UPI Fraud' },
  { name: 'Surat', level: 'HIGH', coordinates: [72.8311, 21.1702], type: 'Banking Malware' },
  { name: 'Bhopal', level: 'HIGH', coordinates: [77.4126, 23.2599], type: 'Fake App Link' },
  { name: 'Patna', level: 'MEDIUM', coordinates: [85.1376, 25.5941], type: 'Spam SMS' },
  { name: 'Nagpur', level: 'MEDIUM', coordinates: [79.0882, 21.1458], type: 'Suspicious Email' },
  { name: 'Indore', level: 'MEDIUM', coordinates: [75.8577, 22.7196], type: 'Fake Certificate' },
  { name: 'Visakhapatnam', level: 'MEDIUM', coordinates: [83.2185, 17.6868], type: 'Malicious URL' },
  { name: 'Kochi', level: 'MEDIUM', coordinates: [76.2673, 9.9312], type: 'Botnet Activity' }
];

function IndiaThreatMap() {
  const [activeThreats, setActiveThreats] = useState(1243);
  const [tickerNews, setTickerNews] = useState<any[]>([]);
  const [tooltip, setTooltip] = useState<any>(null);

  useEffect(() => {
    const int1 = setInterval(() => {
      setActiveThreats(prev => prev + 1);
    }, 4500);
    return () => clearInterval(int1);
  }, []);

  useEffect(() => {
    let nextId = 0;
    const generateNews = () => {
      const city = THREAT_CITIES[Math.floor(Math.random() * THREAT_CITIES.length)];
      return {
        id: ++nextId,
        city: city.name,
        level: city.level,
        threat: city.type + ' flagged',
        timeStr: `${Math.floor(Math.random() * 5) + 1} mins ago`
      };
    };

    setTickerNews(Array.from({length: 8}, generateNews));

    const int2 = setInterval(() => {
      setTickerNews(prev => {
        const next = [...prev, generateNews()];
        if (next.length > 20) next.shift();
        return next;
      });
    }, 30000); 
    return () => clearInterval(int2);
  }, []);

  const getLevelColor = (level: string) => {
    if (level === 'CRITICAL') return '#ef4444'; 
    if (level === 'HIGH') return '#f97316'; 
    return '#eab308'; 
  };

  const getBorderClass = (level: string) => {
    if (level === 'CRITICAL') return 'border-red-500 text-red-500';
    if (level === 'HIGH') return 'border-orange-500 text-orange-500';
    return 'border-yellow-500 text-yellow-500';
  };

  return (
    <div className="w-full flex flex-col bg-[#050a18] rounded-2xl border-2 border-slate-800 overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      {/* Radar Grid */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(#00d4ff 1px, transparent 1px),
            linear-gradient(90deg, #00d4ff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Header Stats */}
      <div className="relative z-10 flex flex-wrap items-center justify-between p-4 border-b border-slate-800/80 bg-[#0a0f1e]/90 backdrop-blur-md">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-900/60 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-red-400 font-mono text-sm tracking-wider font-bold">CRITICAL: 5</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-950/40 px-3 py-1.5 rounded-lg border border-orange-900/60 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-orange-400 font-mono text-sm tracking-wider font-bold">HIGH: 7</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-yellow-950/40 px-3 py-1.5 rounded-lg border border-yellow-900/60 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
          <Activity className="w-4 h-4 text-yellow-500 animate-pulse" />
          <span className="text-yellow-400 font-mono text-sm tracking-wider font-bold">ACTIVE THREATS: <span className="text-white">{activeThreats}</span></span>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative w-full h-[500px] flex items-center justify-center pt-8 z-10">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 850, center: [80, 22] }}
          className="w-full h-full"
        >
          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  className="outline-none transition-colors duration-300"
                  style={{
                    default: { outline: "none", fill: "#0a0f1e", stroke: "#00d4ff", strokeWidth: 0.6, filter: "drop-shadow(0px 0px 3px rgba(0, 212, 255, 0.4))" },
                    hover: { outline: "none", fill: "#0f172a", stroke: "#00d4ff", strokeWidth: 1, filter: "drop-shadow(0px 0px 5px rgba(0, 212, 255, 0.8))" },
                    pressed: { outline: "none", fill: "#0a0f1e", stroke: "#00d4ff" }
                  }}
                />
              ))
            }
          </Geographies>

          {THREAT_CITIES.map(({ name, level, coordinates, type }) => {
            const size = level === 'CRITICAL' ? 6 : level === 'HIGH' ? 4.5 : 3;
            const getStaticDelay = (str: string) => (str.charCodeAt(0) % 5) * 0.5;
            const delay = getStaticDelay(name);
            
            return (
              <Marker 
                key={name} 
                coordinates={coordinates as [number, number]}
                onMouseEnter={(e) => {
                   setTooltip({
                      name, level, type,
                      threats: Math.floor(Math.random() * 89) + 10,
                      time: Math.floor(Math.random() * 15) + 1,
                      x: e.clientX, y: e.clientY
                   });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <g className="cursor-pointer">
                  <circle r={size} fill="none" stroke={getLevelColor(level)} strokeWidth="1" className="map-ring" style={{ animationDelay: `${delay}s` }} />
                  <circle r={size} fill="none" stroke={getLevelColor(level)} strokeWidth="1" className="map-ring" style={{ animationDelay: `${delay + 0.6}s` }} />
                  <circle r={size} fill="none" stroke={getLevelColor(level)} strokeWidth="1" className="map-ring" style={{ animationDelay: `${delay + 1.2}s` }} />
                  
                  <circle 
                    r={size * 0.8} 
                    fill={getLevelColor(level)} 
                    className="map-dot-pulse"
                    style={{ 
                      filter: `drop-shadow(0 0 10px ${getLevelColor(level)})`,
                      animationDelay: `${delay}s`
                    }}
                  />
                  
                  {level !== 'MEDIUM' && (
                    <text x={10} y={4} fontSize={10} fill="#cbd5e1" fontFamily="monospace" fontWeight="bold" className="pointer-events-none drop-shadow-md">
                      {name}
                    </text>
                  )}
                </g>
              </Marker>
            );
          })}
        </ComposableMap>

        {/* CSS for animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes mapRingPulse {
            0% { transform: scale(0.5); opacity: 0.8; stroke-width: 2px; }
            100% { transform: scale(4); opacity: 0; stroke-width: 0.5px; }
          }
          .map-ring {
            animation: mapRingPulse 2s infinite cubic-bezier(0.1, 0.8, 0.3, 1);
            transform-origin: center;
          }
          @keyframes mapDotBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          .map-dot-pulse {
            animation: mapDotBlink 1.5s infinite;
          }
          .marquee-container {
            display: flex;
            width: max-content;
            animation: scroll 40s linear infinite;
          }
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}} />

        {/* Legend */}
        <div className="absolute bottom-6 right-6 bg-[#0a0f1e]/90 backdrop-blur-md border border-slate-700/80 p-4 rounded-xl flex flex-col gap-3 z-10 font-mono text-xs text-slate-300 shadow-xl">
          <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></span> Critical Threat</div>
          <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span> High Threat</div>
          <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></span> Medium Threat</div>
          <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-cyan-500 opacity-50"></span> Monitored City</div>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                left: tooltip.x + 15,
                top: tooltip.y - 40,
                pointerEvents: 'none',
                zIndex: 100
              }}
              className="bg-[#0f172a] border border-cyan-500 p-4 rounded-xl shadow-[0_10px_30px_rgba(0,212,255,0.2)] min-w-[220px]"
            >
               <div className="flex items-center justify-between mb-2">
                 <h4 className="text-white font-bold text-lg">{tooltip.name}</h4>
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getBorderClass(tooltip.level)} bg-slate-900`}>
                   {tooltip.level}
                 </span>
               </div>
               <div className="space-y-1 font-mono text-xs">
                 <div className="text-slate-400">Active Threats: <span className="text-slate-200 font-bold">{tooltip.threats}</span></div>
                 <div className="text-slate-400">Last Scan: <span className="text-slate-200">{tooltip.time} mins ago</span></div>
                 <div className="text-cyan-400 mt-2 truncate w-full pt-1 border-t border-slate-700">Dominant: {tooltip.type}</div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrolling Ticker */}
      <div className="border-t border-slate-800/80 bg-[#000000] text-sm font-mono py-3 overflow-hidden flex items-center shadow-inner relative z-10">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10"></div>
        <div className="marquee-container space-x-12 px-4 hover:[animation-play-state:paused]">
          {[...tickerNews, ...tickerNews].map((news, i) => (
             <div key={`${news.id}-${i}`} className="flex items-center gap-3">
               <span className="font-bold text-slate-200">
                 [{news.level === 'CRITICAL' ? '🔴 CRITICAL' : news.level === 'HIGH' ? '🟠 HIGH' : '🟡 MEDIUM'}] {news.city}
               </span>
               <span className="text-slate-400">— {news.threat}</span>
               <span className="text-slate-500">— {news.timeStr}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
