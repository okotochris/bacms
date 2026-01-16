// components/Header.tsx
'use client'; // Required because we use useState

import { useState } from 'react';
import Link from 'next/link';
import { X, Menu } from 'lucide-react'; // ← Install: npm install lucide-react

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },

    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'Check Result', href: '/student_class' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="fixed top-0 p-3.5 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <img src="/bacms_logo.png" alt="BACMS Logo" width={70} height={100} />

                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                      BACMS
                    </h1>
                    <p className="text-xs text-gray-600">Montessori School</p>
                  </div>
                </div>
              </Link>

            </div >

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {navItems.map((item) => {
                if (item.name === 'Contact') {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-white bg-blue-700 hover:text-primary-600 font-medium transition-colors duration-200 text-base"
                    >
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                        {item.name}
                      </button>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-base"
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slide down */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen py-6 opacity-100' : 'max-h-0 py-0 opacity-0'
            }`}
        >
          <nav className="container mx-auto px-5 flex flex-col gap-6">
            {navItems.map((item) => (
              item.name === 'Contact' ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white p-2 bg-blue-700 hover:text-primary-600 font-medium transition-colors duration-200 text-base"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-800 hover:text-primary-600 font-medium text-lg py-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}

          </nav>
        </div>

      </header>
     <div className='h-20'>

     </div>
    </>
  );
}