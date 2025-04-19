"use client";

import Link from "next/link";
import { LucideMenu, Folder, Files, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex items-center justify-between w-full py-4 px-4 sm:px-6 relative z-50">
      <div className="flex items-center gap-2">
        <motion.button
          className="text-white p-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={20} /> : <LucideMenu size={20} />}
        </motion.button>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-2xl font-bold text-white">
            code
          </Link>
        </motion.div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <motion.button
          className="text-white p-1 hidden sm:block"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Folder size={20} />
        </motion.button>
        <motion.button
          className="text-white p-1 hidden sm:block"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Files size={20} />
        </motion.button>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/signup" className="text-white text-sm font-medium">
            Sign up
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/login"
            className="bg-white text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors"
          >
            Log in
          </Link>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-[#141414] z-40 pt-20"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-6 p-6">
              <Link
                href="/"
                className="text-white text-xl font-medium py-2"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="text-white text-xl font-medium py-2"
                onClick={toggleMenu}
              >
                Projects
              </Link>
              <Link
                href="/gallery"
                className="text-white text-xl font-medium py-2"
                onClick={toggleMenu}
              >
                Gallery
              </Link>
              <Link
                href="/documentation"
                className="text-white text-xl font-medium py-2"
                onClick={toggleMenu}
              >
                Documentation
              </Link>
              <div className="w-full h-px bg-[#363637] my-2" />
              <Link
                href="/signup"
                className="text-white text-xl font-medium py-2"
                onClick={toggleMenu}
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="text-xl font-medium py-2 px-8 bg-white text-black rounded-full"
                onClick={toggleMenu}
              >
                Log in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
