import { Link } from 'react-router-dom';
import { Globe, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-brand rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Globe size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight leading-tight">LinkWise <span className="text-brand">AI</span></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-brand transition-colors">Intelligence Platform</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-6 md:gap-10">
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <Link to="/about" className="hover:text-brand transition-all relative group py-2">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
            </Link>
            <Link to="/how-it-works" className="hover:text-brand transition-all relative group py-2">
              Methodology
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-all duration-300 flex items-center justify-center"
              aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/" className="hidden sm:flex bg-slate-900 dark:bg-brand text-white px-7 py-3 rounded-2xl hover:bg-brand dark:hover:bg-white dark:hover:text-brand transition-all duration-300 text-sm font-black uppercase tracking-widest shadow-lg shadow-brand/10">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
