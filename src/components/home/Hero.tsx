'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, TrendingUp, TrendingDown, Shield } from 'lucide-react';
import { useAssetPrices } from '@/hooks/useAssetPrices';

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const colors = ['rgba(0,82,255,', 'rgba(0,212,255,', 'rgba(124,58,237,'];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,82,255,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-bg" />;
}

function LivePriceTicker() {
  const prices = useAssetPrices(30000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex flex-wrap items-center justify-center gap-4 mt-8"
    >
      {prices.map((p) => {
        const up = (p.change24h ?? 0) >= 0;
        return (
          <div key={p.symbol} className="glass rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[160px]">
            <div>
              <p className="text-xs text-gray-400">{p.symbol}/USD</p>
              {p.loading ? (
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse mt-1" />
              ) : p.price === null ? (
                <p className="text-sm font-bold text-gray-500">—</p>
              ) : (
                <p className="text-sm font-bold font-mono">
                  ${p.symbol === 'ETH'
                    ? p.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : p.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              )}
            </div>
            {!p.loading && p.change24h !== null && (
              <div className={`flex items-center gap-1 ${up ? 'text-green-400' : 'text-red-400'}`}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="text-xs font-medium">{Math.abs(p.change24h).toFixed(2)}%</span>
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

const badges = [
  { icon: Zap, label: 'Lightning Fast', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { icon: Shield, label: 'Audited Contracts', color: 'text-green-400', bg: 'bg-green-400/10' },
  { icon: TrendingUp, label: 'Base Mainnet', color: 'text-blue-400', bg: 'bg-blue-400/10' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <ParticleCanvas />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-gray-300">Live on </span>
          <span className="text-gradient-blue font-semibold">Base Mainnet</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-black leading-tight tracking-tight mb-6"
        >
          <span className="text-white">Compete.</span>
          <br />
          <span className="text-gradient-blue">Predict.</span>
          <br />
          <span className="text-white">Win on </span>
          <span className="text-gradient-purple">Base.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Base Arena is the ultimate on-chain prediction tournament platform. Battle traders in real-time,
          predict crypto prices, earn ETH rewards and exclusive NFT trophies — all on Base mainnet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.label} className={`flex items-center gap-2 ${b.bg} rounded-full px-3 py-1.5`}>
                <Icon className={`w-3.5 h-3.5 ${b.color}`} />
                <span className="text-xs font-medium text-gray-300">{b.label}</span>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/arena"
            className="group flex items-center gap-2 bg-gradient-blue text-white px-8 py-4 rounded-2xl text-base font-bold hover:opacity-90 transition-all glow-blue shadow-lg shadow-blue-500/25"
          >
            Enter the Arena
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-2 glass text-white px-8 py-4 rounded-2xl text-base font-semibold hover:border-blue-500/40 transition-all"
          >
            View Leaderboard
          </Link>
        </motion.div>

        {/* Real-time prices from CoinGecko */}
        <LivePriceTicker />
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
          <div className="w-1 h-2 bg-blue-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
