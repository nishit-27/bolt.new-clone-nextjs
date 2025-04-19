"use client";

import { motion } from 'framer-motion';
import { ArrowUpRight, User2 } from 'lucide-react';

export default function ProjectGrid() {
  // In the real site, this would be fetched from an API
  const projects = [
    {
      id: 1,
      title: "Fullstack Blog",
      description: "A complete blogging platform with authentication and comments",
      image: "https://ext.same-assets.com/23804050/2669673301.jpeg",
      author: "Sarah Johnson",
      date: "2 days ago"
    },
    {
      id: 2,
      title: "Dashboard UI",
      description: "Admin dashboard with data visualization and user management",
      image: "https://ext.same-assets.com/23804050/2067915261.jpeg",
      author: "Alex Chen",
      date: "5 days ago"
    },
    {
      id: 3,
      title: "E-commerce Store",
      description: "Complete online store with product listings and shopping cart",
      image: "https://ext.same-assets.com/23804050/1610625980.jpeg",
      author: "Michael Kim",
      date: "1 week ago"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 1.0
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-[#1c1c1c] border border-[#363637] rounded-lg overflow-hidden cursor-pointer hover:border-[#4c4c4c] transition-colors"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="relative h-40">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] to-transparent opacity-70" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium text-lg">{project.title}</h3>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="text-[#848484] hover:text-white"
                >
                  <ArrowUpRight size={18} />
                </motion.div>
              </div>
              <p className="text-[#848484] text-sm mb-4">{project.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center bg-[#2c2c2c] w-6 h-6 rounded-full">
                    <User2 size={14} className="text-[#848484]" />
                  </div>
                  <span className="text-[#848484] text-xs">{project.author}</span>
                </div>
                <span className="text-[#646464] text-xs">{project.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
