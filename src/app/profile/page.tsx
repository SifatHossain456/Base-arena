'use client';

import { motion } from 'framer-motion';
import { Trophy, Zap, TrendingUp, BarChart3, User, ExternalLink, Copy } from 'lucide-react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { shortenAddress, formatETH } from '@/lib/utils';
import { MOCK_TOURNAMENTS } from '@/lib/contracts';
import toast from 'react-hot-toast';
import Link from 'next/link';

const MOCK_USER_STATS = {
  points: 4820,
  rank: 8,
  wins: 18,
  losses: 7,
  totalPnl: 3.2,
  winRate: 72,
  badge: 'Silver',
  tournamentsEntered: 25,
  nfts: [
    { id: 1, name: 'ETH Battle Winner', rarity: 'Gold', date: 'May 2026' },
    { id: 2, name: 'Speed Predictor', rarity: 'Silver', date: 'Apr 2026' },
    { id: 3, name: 'Base Pioneer', rarity: 'Bronze', date: 'Mar 2026' },
  ],
};

const statCards = [
  { label: 'Arena Points', value: '4,820', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Win Rate', value: '72%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
  { label: 'Total Wins', value: '18', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { label: 'Total PnL', value: '+3.2 ETH', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

const NFT_RARITY_COLORS: Record<string, string> = {
  Gold: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  Silver: 'text-slate-300 border-slate-400/30 bg-slate-400/10',
  Bronze: 'text-orange-400 border-orange-700/30 bg-orange-700/10',
};

function NotConnected() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-gradient-blue rounded-3xl flex items-center justify-center mx-auto mb-6 glow-blue">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Connect to View Profile</h2>
        <p className="text-gray-400 mb-8 max-w-sm">
          Connect your wallet to see your Arena stats, trophy NFTs, and tournament history.
        </p>
        <Link
          href="/arena"
          className="bg-gradient-blue text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity"
        >
          Enter the Arena
        </Link>
      </motion.div>
    </div>
  );
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address, chainId: 8453 });
  const { disconnect } = useDisconnect();

  if (!isConnected || !address) return <NotConnected />;

  const copyAddr = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied!');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-7 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-2xl font-black glow-blue">
              {address.slice(2, 4).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-[#050B18] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-900" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-black">Arena Warrior</h1>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-400/10 text-slate-300 border border-slate-400/30">
                {MOCK_USER_STATS.badge}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="font-mono text-sm">{shortenAddress(address, 8)}</span>
              <button onClick={copyAddr} className="hover:text-white transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-sm text-blue-400 mt-2 font-semibold">
              {balance ? `${parseFloat(balance.formatted).toFixed(4)} ETH` : '—'} on Base
            </p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="text-right">
              <p className="text-xs text-gray-500">Global Rank</p>
              <p className="text-3xl font-black text-gradient-blue">#{MOCK_USER_STATS.rank}</p>
            </div>
            <button
              onClick={() => disconnect()}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-5"
              >
                <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Win rate bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 mb-6"
        >
          <div className="flex justify-between mb-3">
            <span className="text-sm font-semibold">Win / Loss Record</span>
            <span className="text-sm text-gray-400">{MOCK_USER_STATS.wins}W · {MOCK_USER_STATS.losses}L</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden bg-white/10 flex">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-l-full"
              initial={{ width: 0 }}
              animate={{ width: `${MOCK_USER_STATS.winRate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <div className="h-full flex-1 bg-red-500/40" />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-green-400 font-medium">{MOCK_USER_STATS.winRate}% Win Rate</span>
            <span className="text-xs text-red-400 font-medium">{100 - MOCK_USER_STATS.winRate}% Loss Rate</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NFT Trophies */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="font-bold">Trophy NFTs</h2>
              <span className="ml-auto text-xs text-gray-500">{MOCK_USER_STATS.nfts.length} owned</span>
            </div>
            <div className="space-y-3">
              {MOCK_USER_STATS.nfts.map((nft) => (
                <div key={nft.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/8 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center text-xl">
                    🏆
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{nft.name}</p>
                    <p className="text-xs text-gray-500">{nft.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${NFT_RARITY_COLORS[nft.rarity]}`}>
                    {nft.rarity}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Tournaments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold">Recent Battles</h2>
            </div>
            <div className="space-y-3">
              {MOCK_TOURNAMENTS.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center font-bold text-xs text-blue-300">
                    {t.asset}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{t.asset} Battle #{t.id}</p>
                    <p className="text-xs text-gray-500">{t.participantCount} competitors</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-400">+{formatETH(t.entryFee * 2, 3)}</p>
                    <p className="text-xs text-gray-500">Won</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/arena"
              className="block text-center mt-4 text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Enter more battles →
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
