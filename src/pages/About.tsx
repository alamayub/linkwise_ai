import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Globe, ShieldCheck, Zap, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  const values = [
    {
      icon: Cpu,
      title: "Neural Extraction",
      description: "Our proprietary LLM logic doesn't just scrape; it understands context, identifying entities and relationships that standard scrapers miss."
    },
    {
      icon: ShieldCheck,
      title: "Verified Identity",
      description: "We prioritize official sources and verified badges to ensure the intelligence you get is authentic and high-confidence."
    },
    {
      icon: Zap,
      title: "Real-time Insight",
      description: "Information changes fast. We perform live lookups rather than relying on stale databases to give you the most current picture."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Helmet>
        <title>About Us | LinkWise AI Mission & Values</title>
        <meta name="description" content="Learn about LinkWise AI's mission to turn the unstructured web into high-fidelity business intelligence." />
      </Helmet>
      <Header />
      <div className="max-w-4xl mx-auto py-20 px-4">
        
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-[0.3em]"
          >
            <Globe size={16} />
            Our Mission
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8"
          >
            Turning the web into <span className="text-indigo-600">structured intelligence.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl"
          >
            LinkWise AI was built to solve a simple problem: the web is too big to read manually. We use Gemini 1.5 Flash to automatically parse complex data from any URL, giving you the facts you need in seconds.
          </motion.p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {values.map((v, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[32px] shadow-sm"
            >
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <v.icon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-3 tracking-tight">{v.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </section>

        <footer className="bg-indigo-600 rounded-[40px] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-6">Ready to see deep intel in action?</h2>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl active:scale-95"
            >
              Try the Extractor
              <Zap size={20} />
            </Link>
          </div>
        </footer>
      </div>
      <Footer />
    </div>
  );
}
