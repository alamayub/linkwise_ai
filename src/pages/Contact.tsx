import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, Send, Globe, Loader2, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API calls and processing time
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <div className="max-w-4xl mx-auto py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <header>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-[0.3em]"
            >
              <MessageSquare size={16} />
              Get in Touch
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8"
            >
              Have questions about our <span className="text-indigo-600">AI capabilities?</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10"
            >
              Whether you need volume processing, custom AI training, or just want to report a bug, we'd love to hear from you.
            </motion.p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-indigo-600 shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Us</p>
                  <p className="font-bold">hello@linkwise.ai</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-indigo-600 shadow-sm">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Headquarters</p>
                  <p className="font-bold">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </header>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 md:p-10 rounded-[32px] shadow-xl shadow-indigo-100/10 dark:shadow-none"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 px-6 outline-none transition-all text-sm font-medium"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 px-6 outline-none transition-all text-sm font-medium"
                      placeholder="jane@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Message</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 px-6 outline-none transition-all text-sm font-medium resize-none"
                      placeholder="Tell us what you're looking for..."
                    />
                  </div>
                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95 disabled:bg-gray-200 dark:disabled:bg-gray-800"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Message</>}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
                    Thanks for reaching out. A human from our team will get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-sm font-bold text-indigo-600 hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
