import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Link as LinkIcon, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Share2, 
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
} from 'lucide-react';
import { extractInfo } from '../services/gemini';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractedInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      setError('Please enter a valid URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Clean up input: take the first sequence of non-whitespace characters that looks like a URL
      const sanitizedUrl = url.trim().split(/\s+/)[0];
      const data = await extractInfo(sanitizedUrl);
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
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all h-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Icon size={20} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white uppercase tracking-tight text-sm">{title}</h3>
          <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {data.length}
          </span>
        </div>
        
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={idx} className="group flex flex-col gap-1 text-sm p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
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
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1">
                  <span className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </span>
                  {item.date && <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{item.date}</span>}
                </a>
              )}
              {type === 'award' && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-amber-500"><Award size={14} /></div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-900 dark:text-white">{item.title}</span>
                    {item.year && <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{item.year}</span>}
                  </div>
                </div>
              )}
              {type === 'controversy' && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-red-500"><AlertTriangle size={14} /></div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{item.description}</p>
                    {item.impact && <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Impact: {item.impact}</span>}
                  </div>
                </div>
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 transition-colors duration-300">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <ShieldCheck size={14} />
            Deep Intelligence Engine
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6"
          >
            Extract <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 italic">deep intelligence</span> <br className="hidden md:block" />
            from any URL in seconds.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Go beyond contact info. Uncover company profiles, products, business hours, and social media metrics using advanced AI analysis.
          </motion.p>
        </div>

        {/* Search Input Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-3xl mx-auto mb-16"
        >
          <form onSubmit={handleExtract} className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              <LinkIcon size={20} />
            </div>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a link..."
              className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-3xl py-4 md:py-6 pl-12 md:pl-14 pr-16 md:pr-48 text-gray-900 dark:text-white placeholder:text-gray-400 shadow-2xl shadow-indigo-100/30 dark:shadow-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-8 focus:ring-indigo-100/50 dark:focus:ring-indigo-900/30 outline-none transition-all text-base md:text-lg"
            />
            <button 
              type="submit"
              disabled={loading || !url.trim()}
              className="absolute right-2 md:right-3 inset-y-2 md:inset-y-3 bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-4 md:px-8 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="hidden md:inline">Extract Deep Info</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Google Maps Locations</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Social Media Bios</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Corporate Websites</span>
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
        <div className="space-y-8">
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
                    className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-indigo-100/20 dark:shadow-none"
                  >
                    <div className="absolute top-0 right-0 p-8">
                      <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        result.sentiment === 'positive' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' :
                        result.sentiment === 'negative' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        Sentiment: {result.sentiment || 'neutral'}
                      </div>
                    </div>

                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 mb-6 text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-wide uppercase">
                        <Info size={20} />
                        Executive Summary
                      </div>
                      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                        {result.metadata?.title || "Entity Intelligence Report"}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                        {result.summary}
                      </p>
                      
                      {result.companyInfo && (
                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 md:grid-cols-3 gap-6">
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Entity Name</span>
                            <span className="font-bold text-gray-900 dark:text-white">{result.companyInfo.name}</span>
                          </div>
                          {result.companyInfo.industry && (
                            <div>
                              <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Industry</span>
                              <span className="font-bold text-gray-900 dark:text-white">{result.companyInfo.industry}</span>
                            </div>
                          )}
                          {result.companyInfo.size && (
                            <div>
                              <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Scale</span>
                              <span className="font-bold text-gray-900 dark:text-white">{result.companyInfo.size}</span>
                            </div>
                          )}
                        </div>
                      )}
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
                  <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 shadow-xl shadow-indigo-100/10 dark:shadow-none"
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl">
                          <Info size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Strategic Improvements</h3>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">Business Gap Analysis</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-[0.2em] mb-4">Critically Missing</h4>
                            <ul className="space-y-3">
                              {result.insights.missingElements.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 group-hover:scale-150 transition-transform" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                             <h4 className="text-[10px] font-black text-amber-500 dark:text-amber-400 uppercase tracking-[0.2em] mb-4">Growth Opportunities</h4>
                            <ul className="space-y-3">
                              {result.insights.improvementSuggestions.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 group-hover:scale-150 transition-transform" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-800">
                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 block">Current Market Positioning</span>
                        <p className="text-gray-900 dark:text-white font-bold text-lg italic leading-relaxed">
                          " {result.insights.marketPosition} "
                        </p>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gray-900 dark:bg-indigo-950 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200/20 dark:shadow-none relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                      
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/10 dark:bg-white/5 text-white rounded-2xl">
                          <Share2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold underline decoration-indigo-500/50 underline-offset-4">Market Rivalry</h3>
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Top Competitors</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {result.insights.competitors.map((comp, idx) => (
                          <div key={idx} className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-indigo-400">{comp.name}</span>
                              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] group-hover:bg-indigo-500 transition-colors">
                                {idx + 1}
                              </div>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed italic">
                              {comp.reason}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-lg shadow-indigo-500/20">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/80">Pro Tip</p>
                        <p className="text-xs font-medium leading-relaxed">
                          Analyze these competitors' backlink strategies and SEO keywords.
                        </p>
                      </div>
                    </motion.div>
                  </section>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

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

      <Footer />
    </div>
  );
}
