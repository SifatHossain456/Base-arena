'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, TrendingUp, TrendingDown, Flame, Lock, CheckCircle2 } from 'lucide-react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { ARENA_CONTRACT_ADDRESS, BASE_ARENA_ABI, MOCK_TOURNAMENTS } from '@/lib/contracts';
import { getTimeLeft, formatETH, cn } from '@/lib/utils';

type Tournament = typeof MOCK_TOURNAMENTS[0];

const ASSET_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  ETH: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400' },
  BTC: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
  cbBTC: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  USDC: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400' },
};

function PredictionModal({ tournament, onClose }: { tournament: Tournament; onClose: () => void }) {
  const [selectedDir, setSelectedDir] = useState<'UP' | 'DOWN' | null>(null);
  const [targetPrice, setTargetPrice] = useState('');
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const handleSubmit = async () => {
    if (!selectedDir || !targetPrice) {
      toast.error('Select direction and enter target price');
      return;
    }
    if (!isConnected) {
      toast.error('Connect your wallet first');
      return;
    }
    try {
      writeContract({
        address: ARENA_CONTRACT_ADDRESS,
        abi: BASE_ARENA_ABI,
        functionName: 'enterTournament',
        args: [BigInt(tournament.id)],
        value: parseEther(tournament.entryFee.toString()),
      });
      toast.success('Prediction submitted! Good luck in the Arena.');
      onClose();
    } catch {
      toast.error('Transaction failed — check wallet');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative glass rounded-3xl p-7 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-xl font-bold mb-1">{tournament.asset} Arena</h3>
        <p className="text-sm text-gray-400 mb-6">Submit your prediction to enter</p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Entry Fee</p>
            <p className="font-bold text-blue-400">{formatETH(tournament.entryFee)}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Prize Pool</p>
            <p className="font-bold text-green-400">{formatETH(tournament.prizePool)}</p>
          </div>
        </div>

        <p className="text-sm font-semibold mb-3">Will {tournament.asset} go UP or DOWN?</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {(['UP', 'DOWN'] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => setSelectedDir(dir)}
              className={cn(
                'flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all font-semibold',
                selectedDir === dir && dir === 'UP' ? 'bg-green-500/20 border-green-400 text-green-400' :
                selectedDir === dir && dir === 'DOWN' ? 'bg-red-500/20 border-red-400 text-red-400' :
                'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
              )}
            >
              {dir === 'UP' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {dir}
            </button>
          ))}
        </div>

        <div className="mb-5">
          <label className="text-sm font-semibold mb-2 block">Target Price (USD)</label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="e.g. 4200"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-600"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-white/10 text-sm font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-3 rounded-2xl bg-gradient-blue text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? 'Confirming...' : `Enter — ${formatETH(tournament.entryFee)}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function ArenaCard({ tournament, index }: { tournament: Tournament; index: number }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(tournament.endTime));
  const [showModal, setShowModal] = useState(false);
  const fillPct = Math.round((tournament.participantCount / tournament.maxParticipants) * 100);
  const isHot = fillPct > 75;
  const isAlmostFull = fillPct > 90;
  const colors = ASSET_COLORS[tournament.asset] ?? ASSET_COLORS.ETH;

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(tournament.endTime)), 1000);
    return () => clearInterval(interval);
  }, [tournament.endTime]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        whileHover={{ y: -3 }}
        className="glass rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden"
      >
        {/* Hot badge */}
        {isHot && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-2 py-1">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-xs text-orange-400 font-medium">Hot</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={cn('px-3 py-2 rounded-xl font-bold text-sm', colors.bg, colors.text, `border ${colors.border}`)}>
            {tournament.asset}
          </div>
          <div>
            <p className="font-bold">{tournament.asset} Battle #{tournament.id}</p>
            <p className="text-xs text-gray-500">by {tournament.creator}</p>
          </div>
        </div>

        {/* Direction */}
        <div className={cn(
          'flex items-center gap-2 w-fit rounded-xl px-3 py-2',
          tournament.direction === 'UP' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
        )}>
          {tournament.direction === 'UP'
            ? <TrendingUp className="w-4 h-4 text-green-400" />
            : <TrendingDown className="w-4 h-4 text-red-400" />}
          <span className={cn('text-sm font-medium', tournament.direction === 'UP' ? 'text-green-400' : 'text-red-400')}>
            Predict {tournament.direction}
          </span>
        </div>

        {/* Prize/Fee */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-xs text-gray-500">Prize Pool</p>
            <p className="font-bold text-green-400 text-sm mt-1">{formatETH(tournament.prizePool)}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-xs text-gray-500">Entry Fee</p>
            <p className="font-bold text-blue-400 text-sm mt-1">{formatETH(tournament.entryFee)}</p>
          </div>
        </div>

        {/* Participants progress */}
        <div>
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>{tournament.participantCount} / {tournament.maxParticipants}</span>
            </div>
            {isAlmostFull && (
              <span className="text-xs text-orange-400 font-medium">Almost full!</span>
            )}
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-blue transition-all"
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        {/* Time + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={isAlmostFull && fillPct >= 100}
            className="flex items-center gap-1.5 bg-gradient-blue text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {fillPct >= 100 ? <><Lock className="w-3 h-3" /> Full</> : 'Enter Arena →'}
          </button>
        </div>
      </motion.div>

      {showModal && <PredictionModal tournament={tournament} onClose={() => setShowModal(false)} />}
    </>
  );
}
