// app/gallery/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Header from '../component/header';
import Footer from '../component/footer';

// Sample gallery items – replace src with your real images
const galleryItems = [
  { id: 1, src: '/playground1.jpg', alt: 'Montessori classroom activity', category: 'Classes' },
  { id: 2, src: '/playground.webp', alt: 'Children during play-based learning', category: 'Classes' },
  { id: 3, src: '/lab.jpg', alt: 'Students in science laboratory', category: 'Facilities' },
  { id: 4, src: '/library.jpg', alt: 'Students reading in the library', category: 'Facilities' },
  { id: 5, src: '/playground.jpg', alt: 'Children enjoying the playground', category: 'Facilities' },
  { id: 6, src: '/science_lab.jpg', alt: 'ICT & Computer Lab session', category: 'Facilities' },
  { id: 7, src: '/hero_image.png', alt: 'School award ceremony', category: 'Events' },
  { id: 8, src: '/playground2.png', alt: 'Sports day activities', category: 'Events' },
  { id: 9, src: '/hero.png', alt: 'Graduation day celebration', category: 'Events' },
  { id: 10, src: '/dancing.jpg', alt: 'School choir practice', category: 'Activities' },
];

const categories = ['All', 'Classes', 'Facilities', 'Events', 'Activities'];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5">
            Our School Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Capturing joyful moments of learning, growth, creativity, and community at Bishop Ajayi Crowther Montessori Schools.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Gallery Grid */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="break-inside-avoid group cursor-pointer"
                onClick={() => setSelectedImage(item.id)}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white text-sm md:text-base font-medium drop-shadow-md">
                      {item.alt}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-5xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <X size={40} />
                </button>

                <Image
                  src={galleryItems.find(item => item.id === selectedImage)?.src || ''}
                  alt={galleryItems.find(item => item.id === selectedImage)?.alt || ''}
                  width={1200}
                  height={900}
                  className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
                />

                <p className="text-white text-center mt-6 text-lg">
                  {galleryItems.find(item => item.id === selectedImage)?.alt}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    <Footer/>
    </>
  );
}