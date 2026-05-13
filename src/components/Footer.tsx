import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2026 LinkWise AI Extractor. Deep Intelligence Engine.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-tighter text-gray-400">
          <Link to="/about" className="hover:text-indigo-600 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link>
          <Link to="/how-it-works" className="hover:text-indigo-600 transition-colors">How it works</Link>
          <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
          <Link to="/security" className="hover:text-indigo-600 transition-colors">Security</Link>
        </div>
      </div>
    </footer>
  );
}
