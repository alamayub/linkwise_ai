/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Linkedin, 
  Twitter, 
  Copy, 
  Check, 
  Zap,
  MessageSquare,
  Send,
} from 'lucide-react';
import { generateOutreach, type ExtractedInfo } from '../services/gemini';

interface OutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  info: ExtractedInfo;
}

type Platform = 'Email' | 'LinkedIn' | 'X/Twitter' | 'General';

export default function OutreachModal({ isOpen, onClose, info }: OutreachModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Customization State
  const [targetRole, setTargetRole] = useState('');
  const [cta, setCta] = useState('');
  const [focusPainPoint, setFocusPainPoint] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(false);

  const platforms: { id: Platform; label: string; icon: any; color: string; available: boolean }[] = [
    { 
      id: 'Email', 
      label: 'Email', 
      icon: Mail, 
      color: 'bg-brand', 
      available: info.emails.length > 0 
    },
    { 
      id: 'LinkedIn', 
      label: 'LinkedIn', 
      icon: Linkedin, 
      color: 'bg-blue-600', 
      available: info.socialMediaLinks.some(s => s.platform.toLowerCase().includes('linkedin'))
    },
    { 
      id: 'X/Twitter', 
      label: 'X/Twitter', 
      icon: Twitter, 
      color: 'bg-slate-900', 
      available: info.socialMediaLinks.some(s => s.platform.toLowerCase().includes('twitter') || s.platform.toLowerCase().includes('x'))
    },
    { 
      id: 'General', 
      label: 'Generic Strategy', 
      icon: MessageSquare, 
      color: 'bg-emerald-500', 
      available: true 
    }
  ];

  const handleSelectPlatform = (platform: Platform) => {
    setSelectedPlatform(platform);
    setIsCustomizing(true);
    setGeneratedMessage(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedPlatform) return;

    setLoading(true);
    setGeneratedMessage(null);
    setError(null);
    setIsCustomizing(false);
    try {
      const data = await generateOutreach(info, selectedPlatform, {
        targetRole: targetRole.trim() || undefined,
        cta: cta.trim() || undefined,
        focusPainPoint: focusPainPoint.trim() || undefined
      });
      setGeneratedMessage(data);
    } catch (err: any) {
      console.error('Failed to generate outreach:', err);
      setError(err.message || 'An error occurred while generating your outreach message.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetSelection = () => {
    setSelectedPlatform(null);
    setGeneratedMessage(null);
    setError(null);
    setIsCustomizing(false);
    setTargetRole('');
    setCta('');
    setFocusPainPoint('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-[48px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200/60 dark:border-white/5"
        >
          {/* Header */}
          <div className="p-8 md:p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/30 blur-[100px] rounded-full -mr-16 -mt-16" />
            <div className="flex items-center gap-5 relative">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group">
                <Send size={28} className="text-brand-light group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black tracking-tight">Outreach Strategy</h3>
                <p className="text-xs text-white/50 font-black uppercase tracking-[0.2em] mt-0.5">Select Channel & Generate</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-white/10 rounded-2xl transition-all relative active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 md:p-10">
            {!selectedPlatform ? (
              <div className="space-y-10">
                <div className="text-center space-y-4">
                  <h4 className="text-2xl font-display font-black text-slate-900 dark:text-white">Choose Your Platform</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">LinkWise AI will craft a high-conversion message specific to your chosen channel.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handleSelectPlatform(platform.id)}
                      className="group p-6 bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 hover:border-brand/30 transition-all text-left flex items-center gap-5 relative overflow-hidden"
                    >
                      <div className={`p-4 ${platform.color} text-white rounded-2xl shadow-lg transition-transform group-hover:scale-110`}>
                        <platform.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-black text-lg text-slate-900 dark:text-white">{platform.label}</span>
                          {platform.available && (
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest rounded-md">Detected</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-1">
                          {platform.id === 'Email' ? 'Focus on subject & long-form' : platform.id === 'LinkedIn' ? 'Focus on network & networking' : 'Rapid OSINT engagement'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : isCustomizing ? (
              <div className="space-y-10 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={resetSelection}
                    className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-400 hover:text-brand transition-all"
                  >
                    <X size={20} />
                  </button>
                  <div>
                    <h4 className="font-display font-black text-xl text-slate-900 dark:text-white">Customize Outreach</h4>
                    <p className="text-[10px] text-brand font-black uppercase tracking-[0.2em]">{selectedPlatform} Channel</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Target Role (Optional)</label>
                    <input 
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Head of Engineering, Marketing Lead..."
                      className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 outline-none focus:border-brand/50 transition-all font-medium dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Focus on Pain Point</label>
                    <select 
                      value={focusPainPoint}
                      onChange={(e) => setFocusPainPoint(e.target.value)}
                      className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 outline-none focus:border-brand/50 transition-all font-medium appearance-none dark:text-white"
                    >
                      <option value="">Select an identified trend/gap...</option>
                      {info.insights.improvementSuggestions.map((gap, i) => (
                        <option key={`gap-${i}`} value={gap}>{gap}</option>
                      ))}
                      {info.insights.missingElements.map((missing, i) => (
                        <option key={`miss-${i}`} value={`Lack of ${missing}`}>{`Lack of ${missing}`}</option>
                      ))}
                      <option value="custom">Custom Pain Point...</option>
                    </select>
                    {focusPainPoint === 'custom' && (
                      <input 
                        type="text"
                        onChange={(e) => setFocusPainPoint(e.target.value)}
                        placeholder="Type custom pain point..."
                        className="w-full mt-3 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 outline-none focus:border-brand/50 transition-all font-medium dark:text-white"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Call to Action (CTA)</label>
                    <input 
                      type="text"
                      value={cta}
                      onChange={(e) => setCta(e.target.value)}
                      placeholder="e.g. Schedule a 15-min discovery call"
                      className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 outline-none focus:border-brand/50 transition-all font-medium dark:text-white"
                    />
                  </div>

                  <button
                    onClick={handleGenerate}
                    className="w-full py-6 bg-brand text-white rounded-[32px] font-black uppercase tracking-widest text-sm hover:bg-slate-950 transition-all shadow-xl shadow-brand/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Zap size={20} />
                    Generate Strategic Message
                  </button>
                </div>
              </div>
            ) : loading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-brand/10 border-t-brand rounded-full animate-spin mb-8" />
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Architecting {selectedPlatform} Draft...</p>
              </div>
            ) : error ? (
              <div className="py-16 px-8 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-[32px] text-center">
                <MessageSquare className="mx-auto text-red-500 mb-6 font-light" size={48} />
                <h4 className="text-red-900 dark:text-red-300 font-display font-black text-xl mb-3">Generation Failed</h4>
                <p className="text-red-700 dark:text-red-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                  {error}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleSelectPlatform(selectedPlatform)}
                    className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-950 transition-all shadow-xl active:scale-95"
                  >
                    Retry Generation
                  </button>
                  <button
                    onClick={resetSelection}
                    className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
                  >
                    Back to Selection
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Draft Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => { setIsCustomizing(true); setGeneratedMessage(null); }}
                      className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-400 hover:text-brand transition-all"
                    >
                      <X size={20} />
                    </button>
                    <div>
                      <h4 className="font-display font-black text-xl text-slate-900 dark:text-white">{selectedPlatform} Draft</h4>
                      <p className="text-[10px] text-brand font-black uppercase tracking-[0.2em]">Strategy Optimized</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedMessage || '')}
                    className="flex items-center gap-3 px-5 py-2.5 bg-brand text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 transition-all shadow-xl shadow-brand/20 active:scale-95"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Captured' : 'Copy Draft'}
                  </button>
                </div>

                {/* Message Body */}
                <div className="p-8 md:p-10 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-slate-200/60 dark:border-white/5 font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-base">
                  {generatedMessage}
                </div>

                {/* Strategy Note */}
                <div className="p-6 bg-brand/5 dark:bg-brand/10 border border-brand/10 rounded-[32px] flex items-start gap-5">
                  <div className="mt-1 text-brand">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-slate-900 dark:text-white mb-1">Strategic Fix Suggestions</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      This draft addresses specific business gaps and inconsistencies for <strong>{info.companyInfo?.name}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-6">
            {generatedMessage && (
               <button
                  onClick={() => copyToClipboard(generatedMessage)}
                  className="sm:hidden w-full py-4 bg-brand text-white rounded-2xl font-black uppercase tracking-widest text-xs"
               >
                 Copy to Clipboard
               </button>
            )}
            
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              Discard Session
            </button>

            {(selectedPlatform && !loading && !isCustomizing) && (
              <button
                onClick={handleGenerate}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-brand text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-950 transition-all active:scale-95 shadow-xl shadow-brand/20"
              >
                <Zap size={18} />
                Regenerate for {selectedPlatform}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
