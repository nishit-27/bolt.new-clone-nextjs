"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center pt-16 sm:pt-24 pb-8 sm:pb-12 text-center px-4">
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Make anything
      </motion.h1>
      <motion.p
        className="text-base sm:text-lg text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Build fullstack web apps by prompting
      </motion.p>
    </div>
  );
}
