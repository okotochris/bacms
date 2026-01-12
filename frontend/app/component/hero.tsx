// Hero.tsx (or inside app/page.tsx)
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence,  Variants } from 'framer-motion';
// Your hero images (place them in /public folder)
const slides = [
  {
    image: '/schoolbuilding.png',
    title: "A LEADING MONTESSORI SCHOOL IN BENIN CITY",
    subtitle: "We are committed to giving your child the best in learning and in character.",
  },
  {
    image: '/ss.png',
    title: "EDUCATING THE FUTURE OF YOUR CHILD",
    subtitle: "Enroll your wards in one of the best private schools in Benin City today.",
  },
  {
    image: '/hero.png',
    title: "CHOOSE THE RIGHT EDUCATION FOR YOUR WARDS",
    subtitle: "BACMS – A Christ-centered Montessori school approved for excellence.",
  },
  {
    image: '/sciencelap.webp',
    title: "NURTURING MINDS WITH LOVE & FAITH",
    subtitle: "Where curiosity meets character in a joyful learning environment.",
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6500); // Change every 6.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Animation variants
const textVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.4, 0, 0.2, 1], // ✅ smooth ease-out
    },
  },
};
  return (
    <section className="relative h-screen min-h-[720px] flex items-center overflow-hidden pt-20">
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentIndex].image}
            alt="Joyful learning at BACMS"
            fill
            className="object-cover brightness-[0.62] scale-105"
            priority={currentIndex === 0}
            quality={85}
          />
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/45" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 text-white">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial="hidden"
              animate="visible"
               variants={textVariants}
              exit={{ opacity: 0, y: -40 }}
               
              className="space-y-6 md:space-y-8"
            >
              <span className="inline-block px-5 py-2.5 bg-white/15 backdrop-blur-lg rounded-full text-sm md:text-base font-medium border border-white/20 shadow-sm">
                Christ-Centered • Montessori Excellence
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
                {slides[currentIndex].title}
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl font-light max-w-3xl opacity-95 leading-relaxed drop-shadow-md">
                {slides[currentIndex].subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link
                  href="/admissions"
                  className="inline-flex items-center justify-center px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:from-indigo-500 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Start Admission Now →
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-5 border-2 border-white/60 text-white rounded-xl font-semibold text-lg backdrop-blur-md hover:bg-white/15 hover:border-white transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-500 cursor-pointer ${
              i === currentIndex ? 'bg-white scale-150 shadow-lg' : 'bg-white/50 hover:bg-white/80'
            }`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;