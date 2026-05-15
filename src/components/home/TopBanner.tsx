'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

export function TopBanner() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700" />
          <div className="absolute inset-0 bg-gradient-radial from-cyan-400/20 via-transparent to-transparent" />

          {/* Animated orbs */}
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-600/30 rounded-full blur-3xl" />

          <div className="relative z-10 text-center py-16 px-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium">
              <Zap className="w-4 h-4" />
              Season 1 — Limited Time
            </div>
            <h2 className="text-3xl sm:text-5xl font-black mb-4 text-white">
              Ready to Enter the Arena?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Join 18,000+ traders competing on Base. The next tournament starts in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/arena"
                className="group flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Start Competing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/create"
                className="flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:border-white/60 hover:bg-white/10 transition-all"
              >
                Create Tournament
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
