import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200/60 dark:border-white/5 mt-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center text-white">
               <Globe size={18} />
             </div>
             <span className="font-display font-bold text-lg tracking-tight">LinkWise <span className="text-brand">AI</span></span>
           </div>
           <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed font-medium">
             The global standard for deep entity intelligence and strategic business extraction. Powered by state-of-the-art AI.
           </p>
        </div>

        <div className="flex flex-wrap gap-x-12 gap-y-8">
          <div className="flex flex-col gap-4">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Platform</h4>
             <div className="flex flex-col gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
               <Link to="/about" className="hover:text-brand transition-colors">About</Link>
               <Link to="/how-it-works" className="hover:text-brand transition-colors">Methodology</Link>
             </div>
          </div>
          <div className="flex flex-col gap-4">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Legal</h4>
             <div className="flex flex-col gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
               <Link to="/privacy" className="hover:text-brand transition-colors">Privacy</Link>
               <Link to="/terms" className="hover:text-brand transition-colors">Terms</Link>
               <Link to="/security" className="hover:text-brand transition-colors">Security</Link>
             </div>
          </div>
        </div>
      </div>
      
      <div className="mt-20 pt-8 border-t border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          © 2026 LinkWise AI. All Rights Reserved.
        </p>
        <div className="flex items-center gap-4 text-slate-400">
           <div className="w-2 h-2 rounded-full bg-emerald-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
}
