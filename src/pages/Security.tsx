import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { Lock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const content = `
At LinkWise AI, security is our top priority. We employ industry-leading practices to ensure your data and our intelligence engine remain secure.

## 1. Data Encryption
- **In Transit:** All communications between your browser and our servers are encrypted using TLS 1.3.
- **At Rest:** Any data stored on our infrastructure is encrypted using AES-256.

## 2. Infrastructure Security
Our platform is hosted on secure, enterprise-grade cloud infrastructure (Google Cloud Platform) with rigorous physical and digital security controls.

## 3. AI Safety
We use the Gemini 3 Flash model, which incorporates advanced safety filters and alignment techniques to prevent the generation of harmful content.

## 4. API Security
API access is managed through secure tokens and rate-limiting to prevent abuse and ensure high availability for all users.

## 5. Regular Audits
We perform regular vulnerability scans and code reviews to identify and mitigate potential security risks.

## 6. Responsible Disclosure
If you believe you have found a security vulnerability in LinkWise AI, please report it to us at security@linkwise.ai. We appreciate your help in keeping our platform safe.

## 7. Zero-Trust Architecture
We follow a zero-trust security model, ensuring that every request is authenticated and authorized before it is processed.
`;

export default function Security() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Helmet>
        <title>Security | LinkWise AI Platform Integrity</title>
        <meta name="description" content="Discover how LinkWise AI ensures platform security, data encryption, and AI safety." />
      </Helmet>
      <Header />
      <div className="max-w-4xl mx-auto py-20 px-4">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-[0.3em]"
          >
            <Lock size={16} />
            System Integrity
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8"
          >
            Security <span className="text-indigo-600">Policy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 dark:text-gray-400 font-medium"
          >
            Verified Infrastructure & Zero-Trust
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
