"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally connect to an authentication service
    console.log("Login attempt with:", { email, password });
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      <div className="p-4">
        <Link href="/" className="text-white inline-flex items-center gap-1 hover:text-gray-300 transition-colors">
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Log in to Same</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#2c2c2c] border border-[#363637] rounded-lg text-white focus:outline-none focus:border-[#848484]"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#2c2c2c] border border-[#363637] rounded-lg text-white focus:outline-none focus:border-[#848484]"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="pt-2">
              <motion.button
                type="submit"
                className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Log in
              </motion.button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-[#848484]">
              Don't have an account?{" "}
              <Link href="/signup" className="text-white hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
