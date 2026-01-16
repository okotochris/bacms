// app/select-class/page.tsx
'use client';

import { BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '../component/footer';
import Header from '../component/header';

export default function SelectClassPage() {
const cardVariants = {
    hover: { 
      y: -8, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
   <Header />
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Welcome Back!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Please select your current class level
          </motion.p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Primary Card */}
          <motion.div
            whileHover="hover"
            variants={cardVariants}
            className="group relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all"
           
          >
            <div className="h-3 bg-gradient-to-r from-blue-500 to-cyan-500" />
            
            <div className="p-10">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                Nursery / Primary
              </h2>
              
              <p className="text-gray-600 text-center mb-8">
                Nursery 1 -3 & Primary 1 - 6
              </p>

              <div className="flex justify-center">
                <Link href="http://bacms.schsite.org/index.php/login" className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors group-hover:scale-105">
                  Continue to Primary
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Secondary Card */}
          <motion.div
            whileHover="hover"
            variants={cardVariants}
            className="group relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all"
        
          >
            <div className="h-3 bg-gradient-to-r from-purple-500 to-pink-500" />
            
            <div className="p-10">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <GraduationCap className="w-10 h-10 text-purple-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                Secondary
              </h2>
              
              <p className="text-gray-600 text-center mb-8">
                JSS 1 - SSS 3
              </p>

              <div className="flex justify-center">
                <Link href="http://bacms.portalreport.org/index.php/login" className="flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors group-hover:scale-105">
                  Continue to Secondary
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-500 mt-16 text-sm"
        >
          Choose carefully • You can change this later in settings
        </motion.p>
      </div>
    </div>
    <Footer />
     </>
  );
}