// app/about/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Award, Heart, BookOpen, Users, Globe, Shield } from 'lucide-react';
import Header from '../component/header';
import Footer from '../component/footer';

const values = [
  { icon: Heart, title: "Christ-Centered", desc: "Rooted in Anglican faith and biblical principles" },
  { icon: BookOpen, title: "Montessori Excellence", desc: "Child-led, hands-on learning for natural development" },
  { icon: Users, title: "Holistic Growth", desc: "Nurturing mind, body, heart, and spirit" },
  { icon: Globe, title: "Global Readiness", desc: "Equipping students with 21st-century skills" },
  { icon: Shield, title: "Safe & Loving Environment", desc: "Supportive space where every child thrives" },
  { icon: Award, title: "Proven Excellence", desc: "Multiple local & national awards" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function AboutPage() {
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center bg-gradient-to-r from-indigo-900/70 to-purple-900/70">
        <div className="absolute inset-0">
          <img
            src="/schoolbuilding.png"
            alt="Children in joyful learning"
            className="w-full h-full object-cover brightness-75"
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            About Bishop Ajayi Crowther Montessori Schools
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto font-light"
          >
            Where faith meets excellence, and every child is nurtured to become a confident leader of tomorrow.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20 md:py-28">
        {/* School Story */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Our Story & Mission
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            Bishop Ajayi Crowther Montessori Schools (BACMS) was founded with a clear vision: to provide a Christ-centered, Montessori-inspired education that develops the whole child — intellectually, emotionally, spiritually, and physically.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Named after the great missionary and educator Bishop Samuel Ajayi Crowther, we carry forward his legacy of faith, learning, and service. Located in the heart of Benin City, Edo State, Nigeria, BACMS has grown to become one of the most respected private schools in the region, consistently recognized with awards for academic excellence and holistic child development.
          </p>
        </div>

        {/* Core Values */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
            >
              <div className="inline-block p-4 bg-indigo-50 rounded-full mb-6">
                <value.icon className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Principal's Message */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="h-full bg-indigo-600 flex items-center justify-center p-10">
                <div className="text-center text-white">
                  <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
                    Principal
                  </div>
                  <h4 className="text-2xl font-bold">Rev. [Principal's Name]</h4>
                  <p className="text-indigo-200">Head of School</p>
                </div>
              </div>
            </div>
            <div className="md:w-2/3 p-10 md:p-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                A Message from the Principal
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Welcome to Bishop Ajayi Crowther Montessori Schools — a place where every child is known, loved, and challenged to reach their God-given potential.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our dedicated team of educators, rooted in faith and trained in the Montessori method, work together with parents to create a nurturing environment where curiosity flourishes, character is built, and lifelong learning begins.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-6 font-medium">
                We invite you to join our loving family and witness the transformation that happens when faith, education, and love come together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}