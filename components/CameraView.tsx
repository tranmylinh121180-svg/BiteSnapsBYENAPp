import React, { useState, useRef } from 'react';
import { X, Check, Lock, Globe, Sparkles, Loader2 } from 'lucide-react';
import { analyzeFoodImage } from '../services/geminiService';
import { Snap, AIAnalysisResult } from '../types';

interface CameraViewProps {
  onSave: (snap: Snap) => void;
  onCancel: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onSave, onCancel }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [note, setNote] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      // Auto-trigger analysis
      setIsAnalyzing(true);
      try {
        const result = await analyzeFoodImage(file);
        setAnalysisResult(result);
        if (!note) setNote(""); // Let user type freely
      } catch (error) {
        console.error("Analysis failed", error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSave = () => {
    if (!previewUrl || !imageFile) return;
    
    const newSnap: Snap = {
      id: crypto.randomUUID(),
      userId: 'me',
      timestamp: Date.now(),
      imageUrl: previewUrl,
      note: note || (analysisResult?.foodName ?? "Yummy bite!"),
      tags: analysisResult?.tags || [],
      isPrivate,
      aiData: analysisResult || undefined,
      reactions: []
    };
    
    onSave(newSnap);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Idle State (Camera Button)
  if (!previewUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-between bg-black relative p-6 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]"></div>

        <button 
          onClick={onCancel}
          className="self-start text-white p-3 rounded-full bg-white/10 backdrop-blur-md active:scale-90 transition-transform"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
            <h2 className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-md">Snap a bite!</h2>
            <p className="text-white/80 font-bold text-lg">No calories, just vibes.</p>
        </div>

        {/* Shutter Button */}
        <div className="mb-12 relative z-10">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
            <button 
            onClick={triggerFileInput}
            className="relative w-24 h-24 rounded-full border-4 border-white flex items-center justify-center bg-white/10 active:scale-90 transition-all duration-200"
            >
            <div className="w-20 h-20 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"></div>
            </button>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*" 
          capture="environment"
          onChange={handleFileChange}
          className="hidden" 
        />
      </div>
    );
  }

  // Review & Edit State
  return (
    <div className="h-full flex flex-col bg-black relative">
      {/* Full Screen Image Preview */}
      <div className="relative w-full h-full">
         <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
         
         <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
             <button 
                onClick={() => {
                    setPreviewUrl(null);
                    setImageFile(null);
                    setAnalysisResult(null);
                }}
                className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md hover:bg-black/60 transition-colors"
             >
                <X size={24} strokeWidth={3} />
             </button>
         </div>

         {/* Analyzing Overlay */}
         {isAnalyzing && (
             <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-sm z-20">
                 <Loader2 size={48} className="animate-spin mb-4 text-teal-300" />
                 <span className="font-bold text-xl animate-pulse">Guessing flavor...</span>
             </div>
         )}
      </div>

      {/* Sliding Bottom Sheet Editor */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] transition-transform duration-500 ease-out z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col max-h-[85%] ${isAnalyzing ? 'translate-y-full' : 'translate-y-0'}`}>
        
        {/* Handle */}
        <div className="w-full flex justify-center pt-4 pb-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
        </div>

        <div className="px-6 pb-8 pt-2 flex flex-col h-full overflow-y-auto">
            {/* AI Insight Bubble */}
            {analysisResult && (
                <div className="mb-6 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
                    <Sparkles className="text-teal-500 shrink-0 mt-0.5" size={20} fill="currentColor" />
                    <div>
                        <p className="text-teal-900 text-sm font-bold leading-relaxed">"{analysisResult.insight}"</p>
                    </div>
                </div>
            )}

            {/* Note Input - Bubble Style */}
            <div className="mb-6 relative group">
                <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note... (e.g. 'Late night snack!')"
                    className="w-full bg-gray-50 text-lg font-bold border-2 border-gray-100 rounded-2xl px-5 py-4 focus:ring-0 focus:border-teal-400 focus:outline-none placeholder-gray-300 text-gray-800 transition-colors"
                />
            </div>

            {/* Tags Bubbles */}
            <div className="mb-8">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Flavors Detected</label>
                <div className="flex flex-wrap gap-2">
                    {analysisResult?.tags.map((tag, idx) => (
                        <span key={idx} className="px-4 py-2 bg-pink-50 text-pink-600 text-sm font-bold rounded-full border border-pink-100 shadow-sm">
                            {tag}
                        </span>
                    ))}
                    <button className="px-4 py-2 border-2 border-dashed border-gray-300 text-gray-400 rounded-full text-sm font-bold hover:border-gray-400 hover:text-gray-500 transition-colors">
                        + Tag
                    </button>
                </div>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between mb-8 px-2">
                <span className="text-sm font-bold text-gray-500">Who can see this?</span>
                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    <button 
                        onClick={() => setIsPrivate(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${!isPrivate ? 'bg-white text-teal-600 shadow-md transform scale-105' : 'text-gray-400'}`}
                    >
                        <Globe size={16} /> Friends
                    </button>
                    <button 
                        onClick={() => setIsPrivate(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isPrivate ? 'bg-white text-orange-600 shadow-md transform scale-105' : 'text-gray-400'}`}
                    >
                        <Lock size={16} /> Just Me
                    </button>
                </div>
            </div>

            {/* Save Action */}
            <button 
                onClick={handleSave}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-xl shadow-xl shadow-gray-300 flex items-center justify-center gap-2 active:scale-95 transition-all mt-auto"
            >
                <Check size={24} strokeWidth={3} /> Save Bite
            </button>
        </div>
      </div>
    </div>
  );
};

export default CameraView;