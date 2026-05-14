/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  Link as LinkIcon, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Share2, 
  MessageSquare,
  Loader2, 
  Search,
  Globe,
  ArrowRight,
  Info,
  ShieldCheck,
  ExternalLink,
  Newspaper,
  Award,
  AlertTriangle,
  Calendar,
  Zap
} from 'lucide-react';
import { extractInfo, type ExtractedInfo } from '../services/gemini';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OutreachModal from '../components/OutreachModal';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [depth, setDepth] = useState<'quick' | 'deep'>('quick');
  const [result, setResult] = useState<ExtractedInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOutreachOpen, setIsOutreachOpen] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // URL Validation Helpers
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  const validateUrl = (value: string) => {
    if (!value) {
      setIsUrlValid(null);
      return;
    }
    setIsUrlValid(urlRegex.test(value.trim()));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    validateUrl(value);
  };

  const applyQuickFix = () => {
    if (url && !url.startsWith('http')) {
      const fixedUrl = `https://${url.trim()}`;
      setUrl(fixedUrl);
      setIsUrlValid(urlRegex.test(fixedUrl));
    }
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let targetUrl = url.trim();
    
    // Auto-complete protocol if missing
    if (!targetUrl.startsWith('http')) {
      targetUrl = `https://${targetUrl}`;
      setUrl(targetUrl);
    }

    // Final validation check
    if (!urlRegex.test(targetUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      setIsUrlValid(false);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Clean up input: take the first sequence of non-whitespace characters that looks like a URL
      const sanitizedUrl = url.trim().split(/\s+/)[0];
      const data = await extractInfo(sanitizedUrl, depth);
      setResult(data);
    } catch (err: any) {
      if (err.message?.includes('exceeds the limit') || err.message?.includes('400')) {
        setError('Complexity Limit: This page contains too many links for a single pass. Try providing a more specific sub-page URL (like an /about or /contact page).');
      } else {
        setError(err.message || 'An unexpected error occurred during extraction.');
      }
    } finally {
      setLoading(false);
    }
  };

  const InfoCard = ({ icon: Icon, title, data, type }: { icon: any, title: string, data: any[], type: 'text' | 'social' | 'person' | 'offering' | 'hours' | 'news' | 'award' | 'controversy' | 'event' }) => {
    if (!data || data.length === 0) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-7 group/card flex flex-col h-full"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800/50 text-brand rounded-xl flex items-center justify-center group-hover/card:bg-brand group-hover/card:text-white transition-all duration-500">
              <Icon size={20} />
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white group-hover/card:text-brand transition-colors">{title}</h3>
          </div>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black px-2.5 py-1 rounded-lg tracking-widest">
            {data.length}
          </span>
        </div>
        
        <div className="space-y-3 flex-1">
          {data.map((item, idx) => (
            <div key={idx} className="group/item flex flex-col gap-1.5 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50">
              {type === 'text' && (
                <div className="flex items-start gap-3">
                  <p className="text-gray-600 dark:text-gray-400 break-all leading-relaxed">{item}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(item)}
                    className="ml-auto opacity-0 group-hover:opacity-100 text-indigo-500 hover:text-indigo-700 transition-opacity p-1"
                  >
                    <Share2 size={14} />
                  </button>
                </div>
              )}
              {type === 'social' && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-bold">
                    <span className="capitalize">{item.platform}</span>
                    {item.isVerified && (
                      <div className="p-0.5 bg-blue-500 rounded-full text-white" title="Verified Profile">
                        <ShieldCheck size={10} fill="currentColor" />
                      </div>
                    )}
                    <ExternalLink size={14} />
                    {item.followers && <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded uppercase">{item.followers}</span>}
                  </div>
                  <span className="text-gray-400 dark:text-gray-500 font-normal truncate text-xs">{item.handle || item.url}</span>
                </a>
              )}
              {type === 'person' && (
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {item.name}
                    {item.role && <span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded uppercase tracking-wider">{item.role}</span>}
                  </span>
                  {item.bio && <p className="text-gray-500 dark:text-gray-400 text-xs italic leading-relaxed">"{item.bio}"</p>}
                </div>
              )}
              {type === 'offering' && (
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {item.name}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                      item.type === 'product' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 
                      item.type === 'service' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    }`}>
                      {item.type}
                    </span>
                  </span>
                  {item.description && <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{item.description}</p>}
                </div>
              )}
              {type === 'hours' && (
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{item.day}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium tabular-nums">{item.hours}</span>
                </div>
              )}
              {type === 'news' && (
                <a href={item.url} target={item.url ? "_blank" : undefined} rel="noopener noreferrer" className={`flex flex-col gap-1 ${item.url ? 'cursor-pointer' : 'cursor-default'}`}>
                  <span className={`font-bold text-gray-900 dark:text-white transition-colors ${item.url ? 'group-hover:text-brand' : ''}`}>
                    {item.title}
                  </span>
                  <div className="flex items-center justify-between">
                    {item.date && <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{item.date}</span>}
                    {item.url && <ExternalLink size={10} className="text-slate-300 group-hover:text-brand" />}
                  </div>
                </a>
              )}
              {type === 'award' && (
                <a href={item.url} target={item.url ? "_blank" : undefined} rel="noopener noreferrer" className={`flex items-start gap-3 ${item.url ? 'cursor-pointer' : 'cursor-default'}`}>
                  <div className="mt-1 text-amber-500"><Award size={14} /></div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className={`font-bold text-gray-900 dark:text-white transition-colors ${item.url ? 'group-hover:text-brand' : ''}`}>{item.title}</span>
                    <div className="flex items-center justify-between">
                      {item.year && <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{item.year}</span>}
                      {item.url && <ExternalLink size={10} className="text-slate-300 group-hover:text-brand" />}
                    </div>
                  </div>
                </a>
              )}
              {type === 'controversy' && (
                <a href={item.url} target={item.url ? "_blank" : undefined} rel="noopener noreferrer" className={`flex items-start gap-3 ${item.url ? 'cursor-pointer' : 'cursor-default'}`}>
                  <div className="mt-1 text-red-500"><AlertTriangle size={14} /></div>
                  <div className="flex flex-col gap-1 flex-1">
                    <p className={`text-gray-700 dark:text-gray-300 font-medium transition-colors ${item.url ? 'group-hover:text-brand' : ''}`}>{item.description}</p>
                    <div className="flex items-center justify-between">
                      {item.impact && <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Impact: {item.impact}</span>}
                      {item.url && <ExternalLink size={10} className="text-slate-300 group-hover:text-brand" />}
                    </div>
                  </div>
                </a>
              )}
              {type === 'event' && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-500"><Calendar size={14} /></div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-900 dark:text-white">{item.name}</span>
                    {item.date && <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">{item.date}</span>}
                    {item.description && <p className="text-xs text-gray-500 dark:text-gray-400 italic">{item.description}</p>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand/20 selection:text-brand transition-colors duration-500">
      <Helmet>
        <title>{result ? `${result.companyInfo?.name || 'Extraction Result'} | LinkWise AI Intelligence` : 'LinkWise AI | Professional URL Intelligence & Strategic Outreach'}</title>
        <meta name="description" content={result ? `Intelligence report for ${result.companyInfo?.name || 'the entity'}. ${result.summary}` : 'Discover professional business intelligence from any URL. LinkWise AI extracts verified contacts, social metrics, and strategic gaps.'} />
      </Helmet>
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-28">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-brand/5 blur-[120px] rounded-full -z-10" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-brand/10"
          >
            <ShieldCheck size={14} />
            Deep Intelligence Engine V3
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display font-black tracking-tight text-slate-950 dark:text-white mb-8 leading-[0.95]"
          >
            Extract <span className="text-brand italic font-light">Deep Intel</span> <br className="hidden md:block" />
            From Any URL Instantly.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Go beyond surface-level data. Uncover company profiles, strategic improvements, and social footprints using production-grade AI analysis.
          </motion.p>
        </div>

        {/* Search Input Area */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-4xl mx-auto mb-28"
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        >
          <form 
            onSubmit={handleExtract} 
            className={`relative group p-2 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl transition-all border ${
              isUrlValid === false 
                ? 'border-red-400/50 shadow-red-500/5' 
                : isUrlValid === true 
                  ? 'border-emerald-400/50 shadow-emerald-500/5' 
                  : 'border-slate-200/60 dark:border-white/5 shadow-brand/5'
            } focus-within:ring-1 focus-within:ring-brand/20`}
          >
            <div className={`absolute inset-y-0 left-7 flex items-center pointer-events-none transition-colors ${
              isUrlValid === false ? 'text-red-400' : isUrlValid === true ? 'text-emerald-400' : 'text-slate-400 group-focus-within:text-brand'
            }`}>
              {isUrlValid === false ? <AlertTriangle size={24} /> : <LinkIcon size={24} />}
            </div>
            
            <input 
              type="text" 
              value={url}
              onChange={handleUrlChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Paste any company or social link..."
              className="w-full bg-transparent border-none py-6 md:py-8 pl-16 md:pl-20 pr-16 md:pr-60 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none text-lg md:text-xl font-medium tracking-tight"
            />

            {/* Quick Fix Helper */}
            <AnimatePresence>
              {url && !url.startsWith('http') && isUrlValid && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  type="button"
                  onClick={applyQuickFix}
                  className="absolute right-[180px] md:right-[240px] top-1/2 -translate-y-1/2 p-2 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-brand hover:text-white text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hidden sm:block"
                >
                  Add https://
                </motion.button>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={loading || !url.trim()}
              className="absolute right-3 inset-y-3 bg-brand hover:bg-slate-950 dark:hover:bg-white dark:hover:text-brand disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white px-6 md:px-10 rounded-[30px] font-black uppercase tracking-widest text-xs md:text-sm flex items-center gap-3 transition-all duration-300 shadow-xl shadow-brand/20 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span className="hidden md:inline">Run Extraction</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Contextual Suggestions */}
          <AnimatePresence>
            {showSuggestions && !url && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 flex flex-wrap justify-center gap-3 w-full"
              >
                {['google.com', 'apple.com', 'tesla.com', 'twitter.com/spacex'].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      const completeUrl = `https://${suggestion}`;
                      setUrl(completeUrl);
                      validateUrl(completeUrl);
                    }}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-full text-[10px] font-bold text-slate-400 hover:text-brand hover:border-brand/30 transition-all shadow-sm"
                  >
                    Try "{suggestion}"
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-14 flex flex-wrap justify-center gap-10">
            {[
              { color: 'bg-emerald-400', label: 'Local Intel' },
              { color: 'bg-brand-light', label: 'Social OSINT' },
              { color: 'bg-amber-400', label: 'Strategic Gaps' }
            ].map((tag, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400"
              >
                <div className={`w-2 h-2 rounded-full ${tag.color} shadow-lg shadow-${tag.color}/20`} /> 
                {tag.label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-400 p-4 rounded-2xl mb-12 flex items-center gap-3 overflow-hidden"
            >
              <Info size={18} className="shrink-0" />
              <p className="text-sm font-semibold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Area */}
        <section id="results-section" className="space-y-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-24 flex flex-col items-center justify-center text-gray-400"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-indigo-50 dark:border-indigo-900/20 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-200 dark:text-indigo-900">
                    <Search size={40} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analyzing Deep Structure...</h3>
                <p className="text-sm max-w-xs text-center dark:text-gray-500">Our AI is parsing metadata, identifying entities, and extracting key data points.</p>
              </motion.div>
            ) : result ? (
              <motion.div key="results" className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Main Intel Panel */}
                <div className="md:col-span-12 space-y-8">
                  {/* Summary & Header */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 rounded-[48px] p-8 md:p-16 shadow-2xl shadow-brand/5"
                  >
                    <div className="absolute top-10 right-10 flex items-center gap-3">
                      <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                        result.sentiment === 'positive' ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50' :
                        result.sentiment === 'negative' ? 'bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800'
                      }`}>
                        {result.sentiment || 'neutral'} sentiment
                      </div>
                    </div>

                    <div className="max-w-3xl">
                      <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
                          <Zap size={24} />
                        </div>
                        <h2 className="text-xl font-display font-black tracking-tight text-slate-950 dark:text-white uppercase tracking-[0.05em]">Executive Summary</h2>
                      </div>

                      <h2 className="text-4xl md:text-6xl font-display font-black text-slate-950 dark:text-white mb-10 leading-[1.05] tracking-tight">
                        {result.metadata?.title || "Entity Intelligence Report"}
                      </h2>
                      
                      <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-12">
                        {result.summary}
                      </p>

                      <div className="flex flex-wrap gap-5">
                        <button 
                          onClick={() => {
                            const event = new CustomEvent('open-linkwise-chat', { 
                              detail: { message: `I just extracted info from ${url}. Can you tell me more about their market position?` } 
                            });
                            window.dispatchEvent(event);
                          }}
                          className="flex items-center gap-3 px-8 py-4 bg-brand hover:bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-brand/20 group"
                        >
                          <MessageSquare size={18} className="group-hover:-rotate-12 transition-transform" />
                          Chat with Intelligence
                        </button>
                        
                        {result.companyInfo?.name && (
                          <div className="flex items-center gap-4 px-6 border-l border-slate-100 dark:border-slate-800 ml-2">
                             <div className="w-10 h-10 rounded-full overflow-hidden bg-brand/10 flex items-center justify-center font-display font-black text-brand">
                                {result.companyInfo.name.charAt(0)}
                             </div>
                             <div>
                               <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Entity</span>
                               <span className="font-bold text-slate-900 dark:text-white">{result.companyInfo.name}</span>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Info Grids */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoCard icon={Mail} title="Communication" data={result.emails} type="text" />
                    <InfoCard icon={Phone} title="Direct Lines" data={result.phoneNumbers} type="text" />
                    <InfoCard icon={Share2} title="Social Ecosystem" data={result.socialMediaLinks} type="social" />
                    <InfoCard icon={User} title="Key Leadership" data={result.associatedPersons} type="person" />
                    <InfoCard icon={ArrowRight} title="Core Offerings" data={result.offerings} type="offering" />
                    <InfoCard icon={MapPin} title="Operational Hubs" data={result.addresses} type="text" />
                    {result.businessHours && (
                      <div className="lg:col-span-1">
                        <InfoCard icon={Search} title="Business Hours" data={result.businessHours} type="hours" />
                      </div>
                    )}
                  </div>

                {/* Reputation Grids */}
                  {(result.reputation.latestNews.length > 0 || result.reputation.awards.length > 0 || result.reputation.controversies.length > 0 || result.reputation.upcomingEvents.length > 0) && (
                    <section className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-1 md:w-20 md:h-1 bg-gradient-to-r from-transparent to-indigo-500 rounded-full" />
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Public Reputation & Events</h3>
                        <div className="w-10 h-1 md:w-20 md:h-1 bg-gradient-to-l from-transparent to-indigo-500 rounded-full" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <InfoCard icon={Newspaper} title="Latest News" data={result.reputation.latestNews} type="news" />
                        <InfoCard icon={Award} title="Awards & Wins" data={result.reputation.awards} type="award" />
                        <InfoCard icon={AlertTriangle} title="Controversies" data={result.reputation.controversies} type="controversy" />
                        <InfoCard icon={Calendar} title="Future Roadmap" data={result.reputation.upcomingEvents} type="event" />
                      </div>
                    </section>
                  )}

                  {/* Strategic Insights Section */}
                  <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="lg:col-span-8 premium-card p-10 md:p-16"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-brand/5 text-brand rounded-[24px] flex items-center justify-center">
                            <Info size={32} />
                          </div>
                          <div>
                            <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white">Gap Analysis</h3>
                            <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Strategic Improvement Vector</p>
                          </div>
                        </div>

                        <div className="p-1 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2 py-2">
                             <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live AI Monitoring</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                          <div>
                            <h4 className="inline-flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-6 px-3 py-1 bg-red-50 dark:bg-red-950/20 rounded-full border border-red-100 dark:border-red-900/30">
                              <AlertTriangle size={12} /> Critically Missing
                            </h4>
                            <ul className="space-y-5">
                              {result.insights.missingElements.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-slate-600 dark:text-slate-400 group">
                                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 group-hover:scale-150 transition-transform duration-300" />
                                  <span className="text-lg font-medium leading-tight">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div>
                             <h4 className="inline-flex items-center gap-2 text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-6 px-3 py-1 bg-brand/5 rounded-full border border-brand/10">
                               <Zap size={12} /> Growth Vectors
                             </h4>
                            <ul className="space-y-5">
                              {result.insights.improvementSuggestions.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-slate-600 dark:text-slate-400 group">
                                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-brand shrink-0 group-hover:scale-150 transition-transform duration-300" />
                                  <span className="text-lg font-medium leading-tight">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="mt-20 pt-12 border-t border-slate-100 dark:border-slate-800/60 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                        <div className="flex-1">
                          <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 block">Calculated Market Position</span>
                          <p className="text-slate-900 dark:text-white font-display font-black text-3xl leading-tight">
                            "{result.insights.marketPosition}"
                          </p>
                        </div>
                        
                        <div className="shrink-0">
                          <button
                            onClick={() => setIsOutreachOpen(true)}
                            className="w-full xl:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-slate-950 dark:bg-brand text-white rounded-[24px] font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-2xl shadow-brand/20 group active:scale-95"
                          >
                            <Zap size={20} className="group-hover:text-amber-400 transition-colors" />
                            Draft Strategic Outreach
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="lg:col-span-4 bg-slate-950 rounded-[48px] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col h-full"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 blur-[100px] rounded-full -mr-32 -mt-32" />
                      
                      <div className="flex items-center gap-5 mb-12 relative">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl flex items-center justify-center">
                          <Search size={28} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-display font-black tracking-tight">Rivalry Map</h3>
                          <p className="text-[11px] text-white/40 font-black uppercase tracking-[0.2em] mt-1 leading-none">Core Competitors</p>
                        </div>
                      </div>

                      <div className="space-y-6 flex-1 relative">
                        {result.insights.competitors.slice(0, 3).map((comp, idx) => (
                          <div key={idx} className="group p-6 rounded-[28px] bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-500">
                            <div className="flex items-center justify-between mb-4">
                              <span className="font-display font-black text-brand-light text-xl leading-none">{comp.name}</span>
                              <div className="w-8 h-8 rounded-2xl bg-white/10 flex items-center justify-center text-xs font-black group-hover:bg-brand transition-all duration-500 translate-x-2 -translate-y-2">
                                0{idx + 1}
                              </div>
                            </div>
                            <p className="text-sm text-white/50 leading-relaxed font-medium line-clamp-2">
                              {comp.reason}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-12 p-8 rounded-[32px] bg-brand/20 border border-brand/20 relative">
                        <div className="flex items-center gap-3 mb-3">
                           <Info size={16} className="text-brand-light" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-brand-light">Strategy Note</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-white/90">
                          These entities represent the most immediate threat to market share expansion.
                        </p>
                      </div>
                    </motion.div>
                  </section>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>

        {!result && !loading && !error && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                <Globe size={24} />
              </div>
              <h4 className="font-bold mb-2 dark:text-white">Web Analysis</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Full crawl of homepage, contact, and about pages for verified data points.</p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h4 className="font-bold mb-2 dark:text-white">Local Intel</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Maps scraping for hours, addresses, and secondary contact channels.</p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] shadow-sm">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-6">
                <User size={24} />
              </div>
              <h4 className="font-bold mb-2 dark:text-white">Social OSINT</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Extracting handles, bios, and engagement signals from profile links.</p>
            </div>
          </div>
        )}
      </main>
      
      {result && (
        <OutreachModal 
          isOpen={isOutreachOpen} 
          onClose={() => setIsOutreachOpen(false)} 
          info={result} 
        />
      )}

      {/* Floating Depth Selection */}
      <AnimatePresence>
        {!loading && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ delay: 0.5, type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[340px] max-w-[90vw]"
          >
            <div className="flex flex-col items-center gap-3 p-2.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[36px] shadow-2xl shadow-brand/20 ring-1 ring-black/5">
               <div className="flex bg-slate-200/50 dark:bg-white/5 p-1 rounded-[28px] shadow-inner w-full">
                 <button 
                   onClick={() => setDepth('quick')}
                   className={`flex-1 px-6 py-3.5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                     depth === 'quick' 
                       ? 'bg-white dark:bg-slate-700 text-brand shadow-xl scale-[1.02]' 
                       : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                   }`}
                 >
                   Quick Scan
                 </button>
                 <button 
                   onClick={() => setDepth('deep')}
                   className={`flex-1 px-6 py-3.5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                     depth === 'deep' 
                       ? 'bg-white dark:bg-slate-700 text-brand shadow-xl scale-[1.02]' 
                       : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                   }`}
                 >
                   Deep Dive
                 </button>
               </div>
               <div className="flex items-center gap-2 px-4 pb-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${depth === 'deep' ? 'bg-amber-500 animate-pulse' : 'bg-brand'}`} />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                     {depth === 'quick' ? '30s Intelligence Pulse' : 'Extended 60s Deep Analysis'}
                  </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
