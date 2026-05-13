import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const content = `
By accessing or using LinkWise AI, you agree to be bound by these Terms of Service. Please read them carefully.

## 1. Description of Service
LinkWise AI provides deep intelligence extraction from URLs using artificial intelligence. The results are provided for informational purposes only.

## 2. Acceptable Use
You agree not to use LinkWise AI for:
- Any illegal or unauthorized purpose.
- Scraping or harvesting data in violation of a website's robots.txt or terms of service.
- Attempting to bypass any rate limits or security measures.

## 3. Intellectual Property
The LinkWise AI platform, including its design, code, and proprietary algorithms, is owned by LinkWise AI and protected by intellectual property laws.

## 4. User Responsibilities
You are responsible for the URLs you submit and the subsequent use of the extracted data. LinkWise AI does not guarantee the 100% accuracy of the AI-generated intelligence.

## 5. Limitation of Liability
In no event shall LinkWise AI be liable for any direct, indirect, incidental, or consequential damages arising out of your use of the service.

## 6. Modifications to Service
We reserve the right to modify or discontinue the service at any time without notice.

## 7. Governing Law
These terms are governed by and construed in accordance with the laws of the jurisdiction in which LinkWise AI operates.

## 8. Termination
We reserve the right to terminate your access to the service for any violation of these terms.

If you have questions about these terms, contact us at legal@linkwise.ai.
`;

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <div className="max-w-4xl mx-auto py-20 px-4">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-[0.3em]"
          >
            <FileText size={16} />
            Legal Framework
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8"
          >
            Terms of <span className="text-indigo-600">Service</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 dark:text-gray-400 font-medium"
          >
            Last Updated: May 13, 2026
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
