"use client";

import { motion } from 'framer-motion';

export default function SamplePrompts() {
  const prompts = [
    "fullstack crm",
    "blog",
    "linear clone",
    "git repo",
    "screenshot"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
      <div className="flex flex-col items-center">
        <motion.p
          className="text-[#646464] mb-3 sm:mb-4 text-xs sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Try these prompts
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-1.5 sm:gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {prompts.map((prompt) => (
            <motion.button
              key={prompt}
              className="bg-[#2c2c2c] hover:bg-[#363637] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {prompt}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
