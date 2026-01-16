// components/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-4">
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                <Image
                  src="/bacms_logo.png"          // ← Your real school logo here
                  alt="BACMS Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  BACMS
                </h3>
                <p className="text-sm text-gray-400">Montessori Schools</p>
              </div>
            </Link>

            <p className="text-gray-400 leading-relaxed max-w-sm">
              Nurturing tomorrow's leaders through faith, academic excellence, and Montessori-inspired holistic education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
               
                { name: 'Gallery', href: '/gallery' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">Get In Touch</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                <span>6 Ogie St, Benin Sapele Rd, off Okunseri Street, off Dumez Road, Oka<br />Benin City, Edo State, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-400" />
                <span>0903 070 2117<br /> +234 811 636 6225</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <a href="mailto:info@bacms.edu.ng" className="hover:text-white transition-colors">
                  bishopajayicrowther@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div className="space-y-8">
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">
                Stay updated with school news, events and admissions.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-indigo-500 text-white text-sm"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-r-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-5">
                <a href="https://web.facebook.com/profile.php?id=61553693643008&sk" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-7 h-7" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-7 h-7" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="w-7 h-7" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 lg:px-12 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Bishop Ajayi Crowther Montessori Schools. All rights reserved.
          <span className="mx-4">|</span>
          <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span className="mx-4">|</span>
          <Link href="/" className="hover:text-white transition-colors">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}