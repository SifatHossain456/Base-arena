'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { MOCK_TOURNAMENTS } from '@/lib/contracts';
import { getTimeLeft, formatETH } from '@/lib/utils';
import { useEffect, useState } from 'react';

function TournamentCard({ tournament, index }: { tournament: typeof MOCK_TOURNAMENTS[0]; index: number }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(tournament.endTime));
  const fillPct = Math.round((tournament.participantCount / tournament.maxParticipants) * 100);
  const isHot = fillPct > 80;
  const assetColors: Record<string, string> = {
    ETH: '#627EEA', BTC: '#F7931A', cbBTC: '#0052FF', USDC: '#2775CA',
  };

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(tournament.endTime)), 1000);
    return () => clearInterval(interval);
  }, [tournament.endTime]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="glass glass-hover rounded-3xl p-6 relative overflow-hidden cursor-pointer"
    >
      {isHot && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-2.5 py-1">
          <Flame className="w-3 h-3 text-orange-400" />
          <span className="text-xs font-medium text-orange-400">Hot</span>
        </div>
      )}

      {/* Asset header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white"
          style={{ background: `${assetColors[tournament.asset] ?? '#0052FF'}30`, border: `1px solid ${assetColors[tournament.asset] ?? '#0052FF'}40` }}
        >
          {tournament.asset}
        </div>
        <div>
          <p className="font-bold text-base">{tournament.asset} Battle</p>
          <p className="text-xs text-gray-500">by {tournament.creator}</p>
        </div>
      </div>

      {/* Direction badge */}
      <div className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 mb-4 ${tournament.direction === 'UP' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
        {tournament.direction === 'UP'
          ? <TrendingUp className="w-3.5 h-3.5 text-green-400" />
          : <TrendingDown className="w-3.5 h-3.5 text-red-400" />
        }
        <span className={`text-xs font-medium ${tournament.direction === 'UP' ? 'text-green-400' : 'text-red-400'}`}>
          Predict {tournament.direction}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-2xl p-3">
          <p className="text-xs text-gray-500 mb-1">Prize Pool</p>
          <p className="text-sm font-bold text-green-400">{formatETH(tournament.prizePool)}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-3">
          <p className="text-xs text-gray-500 mb-1">Entry Fee</p>
          <p className="text-sm font-bold text-blue-400">{formatETH(tournament.entryFee)}</p>
        </div>
      </div>

      {/* Participants */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">{tournament.participantCount}/{tournament.maxParticipants}</span>
          </div>
          <span className="text-xs text-gray-500">{fillPct}% full</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-blue rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${fillPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">{timeLeft}</span>
        </div>
        <Link href="/arena" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          Enter →
        </Link>
      </div>
    </motion.div>
  );
}

export function FeaturedArenas() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Live <span className="text-gradient-blue">Arenas</span>
            </h2>
            <p className="text-gray-400">Active tournaments you can join right now</p>
          </div>
          <Link
            href="/arena"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_TOURNAMENTS.map((t, i) => (
            <TournamentCard key={t.id} tournament={t} index={i} />
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:hidden">
          <Link
            href="/arena"
            className="flex items-center gap-2 glass px-6 py-3 rounded-2xl text-sm font-semibold hover:border-blue-500/40 transition-all"
          >
            View all arenas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
