import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const content = `
Welcome to LinkWise AI ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our deep intelligence extraction services.

## 1. Information We Collect
We collect information that you provide directly to us when you use the LinkWise AI platform:
- **Usage Data:** We may collect information about the URLs you submit for analysis to improve our AI extraction models.
- **Log Data:** Our servers automatically record information ("log data") including your IP address, browser type, and interactions with the service.

## 2. How We Use Your Information
We use the information we collect to:
- Provide, maintain, and improve our services.
- Analyze trends and usage to enhance user experience.
- Protect against fraudulent or illegal activity.

## 3. Data Processing and Storage
LinkWise AI uses advanced Large Language Models (LLMs) to process URLs. The data extracted is processed in real-time. We do not sell your personal data or the data you extract to third parties.

## 4. Third-Party Services
We may use third-party services like Google Gemini API to perform deep analysis. These services have their own privacy policies governing the use of your data.

## 5. Security
We implement a variety of security measures to maintain the safety of your information. However, no method of transmission over the Internet is 100% secure.

## 6. Your Choices
You can choose not to provide certain information, though it may limit your ability to use some features of our service.

## 7. Contact Us
If you have any questions about this Privacy Policy, please contact us at privacy@linkwise.ai.
`;

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Helmet>
        <title>Privacy Policy | LinkWise AI Data Protection</title>
        <meta name="description" content="Learn about how LinkWise AI collects, uses, and safeguards your information in our privacy policy." />
      </Helmet>
      <Header />
      <div className="max-w-4xl mx-auto py-20 px-4">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-[0.3em]"
          >
            <Shield size={16} />
            Data Protection
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8"
          >
            Privacy <span className="text-indigo-600">Policy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 dark:text-gray-400 font-medium"
          >
            Effective Date: May 13, 2026
          </motion.p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[40px] p-8 md:p-16 shadow-xl shadow-indigo-100/10 dark:shadow-none prose dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-li:text-gray-600 dark:prose-li:text-gray-400"
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
