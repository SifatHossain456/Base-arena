'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Search, Medal, Crown, ExternalLink } from 'lucide-react';
import { MOCK_LEADERBOARD } from '@/lib/contracts';
import { shortenAddress, formatETH } from '@/lib/utils';
import { useAccount } from 'wagmi';

const BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Diamond: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-400/30' },
  Platinum: { bg: 'bg-gray-300/15', text: 'text-gray-200', border: 'border-gray-300/30' },
  Gold: { bg: 'bg-yellow-500/15', text: 'text-yellow-300', border: 'border-yellow-400/30' },
  Silver: { bg: 'bg-slate-400/15', text: 'text-slate-300', border: 'border-slate-400/30' },
  Bronze: { bg: 'bg-orange-700/15', text: 'text-orange-400', border: 'border-orange-700/30' },
};

const TABS = ['All Time', 'This Week', 'This Month'];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
  return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState('All Time');
  const [search, setSearch] = useState('');
  const { address } = useAccount();

  const filtered = MOCK_LEADERBOARD.filter((p) =>
    p.username.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  const podium = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5 text-sm">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-gray-300">Live Rankings · Updated every block</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">
            Global <span className="text-gradient-gold">Leaderboard</span>
          </h1>
          <p className="text-gray-400">The top predictors competing on Base Arena</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-8 glass rounded-2xl p-1.5 w-fit mx-auto"
        >
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </motion.div>

        {/* Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8 items-end"
        >
          {[podium[1], podium[0], podium[2]].map((player, i) => {
            if (!player) return <div key={i} />;
            const displayRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const heights = ['h-32', 'h-44', 'h-28'];
            const styles = BADGE_STYLES[player.badge] ?? BADGE_STYLES.Bronze;
            return (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`glass rounded-3xl p-5 flex flex-col items-center justify-center ${heights[i]} ${displayRank === 1 ? 'border border-yellow-400/30 glow-blue' : ''}`}
              >
                <div className="mb-2">
                  <RankBadge rank={displayRank} />
                </div>
                <div className="w-10 h-10 bg-gradient-blue rounded-full flex items-center justify-center text-sm font-bold mb-2">
                  {player.username.slice(0, 2).toUpperCase()}
                </div>
                <p className="text-xs font-semibold text-center truncate w-full text-center">{player.username}</p>
                <p className="text-xs text-blue-400 font-bold mt-1">{player.points.toLocaleString()} pts</p>
                {displayRank === 1 && (
                  <div className={`mt-2 px-2 py-0.5 rounded-full text-xs border ${styles.bg} ${styles.text} ${styles.border}`}>
                    {player.badge}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username or address..."
            className="w-full glass rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-600"
          />
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl overflow-hidden"
        >
          {/* Table header */}
          <div className="grid grid-cols-12 gap-3 px-6 py-3 border-b border-white/5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Trader</div>
            <div className="col-span-2 text-right">Points</div>
            <div className="col-span-2 text-right">Wins</div>
            <div className="col-span-2 text-right">PnL</div>
            <div className="col-span-1 text-right">Badge</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {filtered.map((player, i) => {
              const styles = BADGE_STYLES[player.badge] ?? BADGE_STYLES.Bronze;
              const isMe = address && player.address.toLowerCase().startsWith(address.slice(0, 6).toLowerCase());
              return (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`grid grid-cols-12 gap-3 px-6 py-4 items-center hover:bg-white/3 transition-colors ${isMe ? 'bg-blue-500/5 border-l-2 border-blue-500' : ''}`}
                >
                  <div className="col-span-1 flex items-center">
                    <RankBadge rank={player.rank} />
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {player.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{player.username}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-gray-500 font-mono">{player.address}</p>
                        <a
                          href={`https://basescan.org/address/${player.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-400 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="font-bold text-sm text-blue-400">{player.points.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="font-semibold text-sm">{player.wins}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="flex items-center justify-end gap-1 text-green-400">
                      <TrendingUp className="w-3 h-3" />
                      <span className="font-bold text-sm">{formatETH(player.totalPnl, 1)}</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${styles.bg} ${styles.text} ${styles.border}`}>
                      {player.badge}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {address && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 glass rounded-2xl p-4 border border-blue-500/20 flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">Your wallet is connected</p>
              <p className="text-xs text-gray-400">Enter tournaments to appear on the leaderboard</p>
            </div>
            <a href="/arena" className="ml-auto text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Compete Now →
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
