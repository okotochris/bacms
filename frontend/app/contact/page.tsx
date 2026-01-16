// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  ChevronRight 
} from 'lucide-react';
import Header from '../component/header';
import Footer from '../component/footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    childClass: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the data somewhere (API, email service, etc.)
    alert('Thank you! Your message has been sent. We will get back to you soon.');
    setFormData({
      name: '', phone: '', email: '', childClass: '', message: ''
    });
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            Get in Touch With Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to answer your questions and help you start your child's journey with us.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Address</h4>
                    <p className="text-gray-600 mt-1">
                      6 Ogie St, Benin Sapele Rd, off Okunseri Street, off Dumez Road, Oka<br />
                      Benin City, Edo State, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Phone Numbers</h4>
                    <p className="text-gray-600 mt-1 space-y-1">
                      <a href="tel:+2348030000000" className="hover:text-green-600 transition-colors block">
                        0903 070 2117
                      </a>
                      <a href="tel:+2348130000000" className="hover:text-green-600 transition-colors block">
                        +234 8100 100 560
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Email</h4>
                    <a 
                      href="mailto:info@bacms.edu.ng" 
                      className="text-blue-600 hover:underline mt-1 block"
                    >
                      bishopajayicrowther@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">School Hours</h4>
                    <p className="text-gray-600 mt-1">
                      Monday – Friday: 7:30 AM – 3:30 PM<br />
                      Saturday: Closed (Admin by appointment)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Big WhatsApp Button */}
            <a
              href="https://wa.me/2348116366225?text=Hello%20BACMS%2C%20I%20would%20like%20to%20make%20enquiries%20about%20admission..."
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-6 px-8 rounded-xl font-bold text-xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Message us on WhatsApp
            </a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="0803 XXX XXXX"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="childClass" className="block text-sm font-medium text-gray-700 mb-2">
                    Interested Class (optional)
                  </label>
                  <select
                    id="childClass"
                    name="childClass"
                    value={formData.childClass}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                  >
                    <option value="">Select class</option>
                    <option value="Nursery">Nursery (1-3)</option>
                    <option value="Basic">Basic (1-5)</option>
                    <option value="JSS">JSS (1-3)</option>
                    <option value="SSS">SSS (1-3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <Send className="w-6 h-6" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header - keep as is */}

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Left Column: Contact Info + WhatsApp - keep as is */}

          {/* Right Column: Form - keep as is */}

          {/* New: Full-width Google Maps Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-3 mt-8 md:mt-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Find Us Easily
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.709477413483!2d5.6393599749910335!3d6.301851793687307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1040d33a365553a7%3A0x3b10a4ce992ebc4e!2sBishop%20Ajayi%20Crowther%20Montessori%20schools!5e0!3m2!1sen!2sng!4v1768235881918!5m2!1sen!2sng"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="BACMS School Location"
              />
            </div>
            <p className="text-center text-gray-600 mt-4 text-sm md:text-base">
              We are located in [Your Area], Benin City. Feel free to visit during school hours!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}