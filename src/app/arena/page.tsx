'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Zap, SlidersHorizontal } from 'lucide-react';
import { ArenaCard } from '@/components/arena/ArenaCard';
import { MOCK_TOURNAMENTS } from '@/lib/contracts';

const FILTERS = ['All', 'ETH', 'BTC', 'cbBTC', 'Ending Soon', 'Hot'];
const SORTS = ['Prize Pool', 'Entry Fee', 'Time Left', 'Participants'];

export default function ArenaPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sort, setSort] = useState('Prize Pool');

  const filtered = MOCK_TOURNAMENTS
    .filter((t) => {
      const matchSearch = t.asset.toLowerCase().includes(search.toLowerCase());
      if (activeFilter === 'All') return matchSearch;
      if (activeFilter === 'Hot') return matchSearch && (t.participantCount / t.maxParticipants) > 0.7;
      if (activeFilter === 'Ending Soon') return matchSearch && t.endTime - Date.now() < 3600000 * 4;
      return matchSearch && t.asset === activeFilter;
    })
    .sort((a, b) => {
      if (sort === 'Prize Pool') return b.prizePool - a.prizePool;
      if (sort === 'Entry Fee') return a.entryFee - b.entryFee;
      if (sort === 'Time Left') return a.endTime - b.endTime;
      if (sort === 'Participants') return b.participantCount - a.participantCount;
      return 0;
    });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-blue rounded-2xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              Live <span className="text-gradient-blue">Arenas</span>
            </h1>
          </div>
          <p className="text-gray-400 ml-13">
            {filtered.length} active tournaments on Base mainnet. Choose your battle.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by asset..."
              className="w-full glass rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-600"
            />
          </div>

          {/* Sort */}
          <div className="relative flex items-center">
            <SlidersHorizontal className="absolute left-4 w-4 h-4 text-gray-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="glass rounded-2xl pl-11 pr-8 py-3 text-sm outline-none focus:border-blue-500/50 transition-colors appearance-none bg-transparent cursor-pointer"
            >
              {SORTS.map((s) => <option key={s} value={s} className="bg-[#0D1F38]">{s}</option>)}
            </select>
          </div>
        </motion.div>

        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'glass text-gray-400 hover:text-white hover:border-blue-500/30'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((t, i) => (
              <ArenaCard key={t.id} tournament={t} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🏟️</div>
            <p className="text-gray-400 text-lg">No arenas match your filter.</p>
            <button
              onClick={() => { setActiveFilter('All'); setSearch(''); }}
              className="mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 glass rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4 border border-blue-500/20"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Filter className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="font-semibold">Can't find the perfect arena?</p>
            <p className="text-sm text-gray-400 mt-0.5">
              Create your own tournament with custom entry fees, prize pools, and duration.
            </p>
          </div>
          <a
            href="/create"
            className="sm:ml-auto flex-shrink-0 bg-gradient-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Create Arena
          </a>
        </motion.div>
      </div>
    </div>
  );
}
