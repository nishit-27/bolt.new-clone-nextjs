"use client";

import Link from "next/link";
import { LucideMenu, Folder, Files, X, Home, FolderOpen, Image, BookOpen, Clock, Star, Trash2, Users, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFolder = () => {
    setIsFolderOpen(!isFolderOpen);
    setIsFilesOpen(false);
  };

  const toggleFiles = () => {
    setIsFilesOpen(!isFilesOpen);
    setIsFolderOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Close mobile menu if clicking outside
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
      
      // Close folder dropdown if clicking outside
      if (isFolderOpen && folderRef.current && !folderRef.current.contains(target)) {
        setIsFolderOpen(false);
      }
      
      // Close files dropdown if clicking outside
      if (isFilesOpen && filesRef.current && !filesRef.current.contains(target)) {
        setIsFilesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isFolderOpen, isFilesOpen]);

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
      <div className="flex items-center gap-2 sm:gap-4 relative">
        <div className="relative" ref={folderRef}>
          <motion.button
            className="text-white p-1 hidden sm:block hover:bg-white/10 rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFolder}
          >
            <Folder size={20} />
          </motion.button>
          
          {/* Folder Dropdown */}
          <AnimatePresence>
            {isFolderOpen && (
              <motion.div
                className="absolute top-full left-0 mt-3 bg-[#0f0f0f]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-40 min-w-[240px]"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <div className="p-2">
                  <div className="text-xs font-medium text-white/60 px-3 py-2 uppercase tracking-wider">
                    Projects
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/projects"
                      className="flex items-center gap-3 text-white/90 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                      onClick={() => setIsFolderOpen(false)}
                    >
                      {/* <FolderOpen size={16} className="text-blue-400" /> */}
                      <span>My Projects</span>
                    </Link>
                    <Link
                      href="/templates"
                      className="flex items-center gap-3 text-white/90 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                      onClick={() => setIsFolderOpen(false)}
                    >
                      {/* <FileText size={16} className="text-green-400" /> */}
                      <span>Templates</span>
                    </Link>
                    <Link
                      href="/shared"
                      className="flex items-center gap-3 text-white/90 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                      onClick={() => setIsFolderOpen(false)}
                    >
                      {/* <Users size={16} className="text-purple-400" /> */} 
                      <span>Shared with me</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={filesRef}>
          <motion.button
            className="text-white p-1 hidden sm:block hover:bg-white/10 rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // onClick={toggleFiles}
          >
            <Files size={20} />
          </motion.button>
          
          {/* Files Dropdown */}
          <AnimatePresence>
            {isFilesOpen && (
              <motion.div
                className="absolute top-full left-0 mt-3 bg-[#0f0f0f]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-40 min-w-[240px]"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <div className="p-2">
                  <div className="text-xs font-medium text-white/60 px-3 py-2 uppercase tracking-wider">
                    Files
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/recent"
                      className="flex items-center gap-3 text-white/90 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                      onClick={() => setIsFilesOpen(false)}
                    >
                      {/* <Clock size={16} className="text-orange-400" /> */} 
                      <span>Recent Files</span>
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center gap-3 text-white/90 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                      onClick={() => setIsFilesOpen(false)}
                    >
                      {/* <Star size={16} className="text-yellow-400" /> */}
                      <span>Favorites</span>
                    </Link>
                    <Link
                      href="/trash"
                      className="flex items-center gap-3 text-white/90 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                      onClick={() => setIsFilesOpen(false)}
                    >
                      {/* <Trash2 size={16} className="text-red-400" /> */}
                      <span>Trash</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/signup" className="text-white text-sm font-medium hover:text-white/80 transition-colors">
            Sign up
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/login"
            className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-all duration-200 shadow-sm"
          >
            Log in
          </Link>
        </motion.div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            className="absolute top-full left-0 right-0 mt-3 bg-[#0f0f0f]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-40 mx-4"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="p-4">
              <div className="text-xs font-medium text-white/60 px-3 py-2 uppercase tracking-wider">
                Navigation
              </div>
              <div className="space-y-1 mb-4">
                <Link
                  href="/"
                  className="flex items-center gap-3 text-white/90 text-base font-medium py-3 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                  onClick={toggleMenu}
                >
 
                  <span>Home</span>
                </Link>
                <Link
                  href="/projects"
                  className="flex items-center gap-3 text-white/90 text-base font-medium py-3 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                  onClick={toggleMenu}
                >
 
                  <span>Projects</span>
                </Link>
                <Link
                  href="/gallery"
                  className="flex items-center gap-3 text-white/90 text-base font-medium py-3 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                  onClick={toggleMenu}
                >
 
                  <span>Gallery</span>
                </Link>
                <Link
                  href="/documentation"
                  className="flex items-center gap-3 text-white/90 text-base font-medium py-3 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                  onClick={toggleMenu}
                >
 
                  <span>Documentation</span>
                </Link>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <div className="text-xs font-medium text-white/60 px-3 py-2 uppercase tracking-wider">
                  Account
                </div>
                <div className="space-y-1">
                  <Link
                    href="/signup"
                    className="flex items-center gap-3 text-white/90 text-base font-medium py-3 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                    onClick={toggleMenu}
                  >
 
                    <span>Sign up</span>
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 bg-white/10 text-white text-base font-medium py-3 px-3 rounded-lg hover:bg-white/20 transition-all duration-200 group"
                    onClick={toggleMenu}
                  >
                    <span>Log in</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
