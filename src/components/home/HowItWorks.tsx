'use client';

import { motion } from 'framer-motion';
import { Wallet, Swords, Trophy, Zap } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    step: '01',
    title: 'Connect Your Wallet',
    description: 'Use Base Smart Wallet for instant, gasless sign-in or connect MetaMask. No seed phrase needed with Smart Wallet.',
    color: 'from-blue-600 to-cyan-500',
    glow: 'shadow-blue-500/25',
  },
  {
    icon: Swords,
    step: '02',
    title: 'Enter an Arena',
    description: 'Browse live tournaments, pay the entry fee in ETH, and submit your price prediction before the deadline.',
    color: 'from-purple-600 to-blue-600',
    glow: 'shadow-purple-500/25',
  },
  {
    icon: Zap,
    step: '03',
    title: 'Wait for Resolution',
    description: 'Chainlink oracles verify the final price on Base mainnet. The contract automatically scores every prediction.',
    color: 'from-cyan-500 to-blue-500',
    glow: 'shadow-cyan-500/25',
  },
  {
    icon: Trophy,
    step: '04',
    title: 'Claim Your Rewards',
    description: 'Winners receive ETH prizes and exclusive NFT trophies minted directly to their wallet. No manual claiming needed.',
    color: 'from-yellow-500 to-orange-500',
    glow: 'shadow-yellow-500/25',
  },
];

const features = [
  { label: 'Zero Gas Fees', desc: 'Base Smart Wallet covers gas costs', emoji: '⚡' },
  { label: 'Chainlink Oracles', desc: 'Tamper-proof price resolution', emoji: '🔗' },
  { label: 'NFT Trophies', desc: 'On-chain proof of your victories', emoji: '🏆' },
  { label: 'Instant Payouts', desc: 'Auto-distributed to winners', emoji: '💸' },
  { label: 'Fair & Transparent', desc: 'Fully on-chain, open source', emoji: '🔍' },
  { label: 'Base Native', desc: 'Built for Base ecosystem', emoji: '🔵' },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            How the <span className="text-gradient-blue">Arena</span> Works
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Four simple steps from wallet connect to winning. Everything runs on Base mainnet — trustless and transparent.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent z-0" style={{ width: 'calc(100% - 3rem)' }} />
                )}

                <div className="glass rounded-3xl p-6 relative z-10 h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg ${step.glow}`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-bold text-gray-600 mb-2 font-mono">{step.step}</div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 border-gradient"
        >
          <h3 className="text-xl font-bold text-center mb-8">Why Base Arena?</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors"
              >
                <span className="text-2xl">{f.emoji}</span>
                <div>
                  <p className="text-sm font-semibold">{f.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
