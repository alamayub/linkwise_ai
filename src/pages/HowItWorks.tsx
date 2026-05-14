import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Search, Cpu, Database, Fingerprint, Zap, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "URL Ingestion",
      description: "Submit any valid web link, Google Maps location, or social profile. Our system first validates the reachability and header metadata of the target.",
      color: "indigo"
    },
    {
      icon: Cpu,
      title: "Neural Content Parsing",
      description: "Powered by Gemini 1.5 Flash, the engine performs a 'Deep Read' of the page. It doesn't just scrape text; it understands the semantic relationship between entities.",
      color: "violet"
    },
    {
      icon: Database,
      title: "Entity Extraction",
      description: "Our AI identifies specific patterns for emails, phone numbers, and addresses, while simultaneously building a company profile from unstructured descriptions.",
      color: "blue"
    },
    {
      icon: Fingerprint,
      title: "Reputation Analysis",
      description: "We cross-reference news mentions, awards, and public controversies across the web to build a high-level reputation score for the entity.",
      color: "emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Helmet>
        <title>How It Works | LinkWise AI Pipeline & Methodology</title>
        <meta name="description" content="Discover the neural extraction pipeline and methodology behind LinkWise AI's deep URL intelligence." />
      </Helmet>
      <Header />
      
      <main className="max-w-4xl mx-auto py-20 px-4">
        <header className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <ShieldCheck size={14} />
            The Extraction Pipeline
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            How LinkWise <span className="text-indigo-600">Extracts Intel</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            We've combined modern AI with broad-spectrum web crawling to turn any URL into a structured business report in seconds.
          </motion.p>
        </header>

        <div className="space-y-12 relative">
          {/* Vertical line for desktop */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800 hidden md:block" />

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full">
                <div className={`p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] shadow-sm hover:shadow-md transition-all ${idx % 2 !== 0 ? 'md:text-right' : ''}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg ${
                    step.color === 'indigo' ? 'bg-indigo-600 shadow-indigo-200 dark:shadow-none' :
                    step.color === 'violet' ? 'bg-violet-600 shadow-violet-200 dark:shadow-none' :
                    step.color === 'blue' ? 'bg-blue-600 shadow-blue-200 dark:shadow-none' : 'bg-emerald-600 shadow-emerald-200 dark:shadow-none'
                  } ${idx % 2 !== 0 ? 'md:ml-auto' : ''}`}>
                    <step.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{step.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              
              <div className="relative z-10 w-16 h-16 rounded-full bg-white dark:bg-black border-4 border-gray-100 dark:border-gray-800 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 shrink-0">
                {idx + 1}
              </div>
              
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>

        <section className="mt-32 p-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[48px] text-center shadow-xl shadow-indigo-100/10">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Zap size={32} />
          </div>
          <h2 className="text-3xl font-extrabold mb-6 tracking-tight">Zero Stale Data Policy</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Unlike traditional lead databases, LinkWise performs **live lookups**. When you submit a URL, our AI visits that site in real-time, meaning your results are as fresh as the website itself.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Extraction Active
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
