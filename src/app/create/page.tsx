'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Info, ChevronRight, Zap, DollarSign, Clock, Users } from 'lucide-react';
import { useAccount, useWriteContract, useBalance } from 'wagmi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { ARENA_CONTRACT_ADDRESS, BASE_ARENA_ABI } from '@/lib/contracts';
import { formatETH } from '@/lib/utils';
import Link from 'next/link';

const ASSETS = ['ETH', 'BTC', 'cbBTC'];
const DURATIONS = [
  { label: '1 Hour', value: 3600 },
  { label: '6 Hours', value: 21600 },
  { label: '12 Hours', value: 43200 },
  { label: '24 Hours', value: 86400 },
  { label: '3 Days', value: 259200 },
  { label: '7 Days', value: 604800 },
];

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <label className="text-sm font-semibold">{label}</label>
      {hint && (
        <div className="group relative">
          <Info className="w-3.5 h-3.5 text-gray-500 cursor-help" />
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[#0D1F38] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 w-48 hidden group-hover:block z-10 shadow-xl">
            {hint}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreatePage() {
  const [asset, setAsset] = useState('ETH');
  const [duration, setDuration] = useState(21600);
  const [entryFee, setEntryFee] = useState('0.01');
  const [creatorContrib, setCreatorContrib] = useState('0.1');
  const [maxParticipants, setMaxParticipants] = useState('100');
  const [step, setStep] = useState(1);

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address, chainId: 8453 });
  const { writeContract, isPending } = useWriteContract();

  const totalCost = parseFloat(creatorContrib || '0');
  const estimatedPool = totalCost + parseFloat(entryFee || '0') * parseInt(maxParticipants || '0') * 0.95;
  const durationLabel = DURATIONS.find((d) => d.value === duration)?.label ?? '';

  const handleCreate = async () => {
    if (!isConnected) { toast.error('Connect wallet first'); return; }
    const parsedMax = parseInt(maxParticipants, 10);
    if (!entryFee || !creatorContrib || !maxParticipants || isNaN(parsedMax) || parsedMax < 2) {
      toast.error('Fill all fields with valid values'); return;
    }
    try {
      writeContract({
        address: ARENA_CONTRACT_ADDRESS,
        abi: BASE_ARENA_ABI,
        functionName: 'createTournament',
        args: [asset, BigInt(duration), parseEther(entryFee), BigInt(parsedMax)],
        value: parseEther(creatorContrib),
      });
      toast.success('Arena created on Base mainnet!');
    } catch {
      toast.error('Transaction failed — check wallet');
    }
  };

  const steps = [
    { label: 'Asset & Duration', icon: Zap },
    { label: 'Fees & Prize Pool', icon: DollarSign },
    { label: 'Review & Deploy', icon: ChevronRight },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-blue rounded-3xl flex items-center justify-center mx-auto mb-5 glow-blue">
            <PlusCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            Create <span className="text-gradient-blue">Arena</span>
          </h1>
          <p className="text-gray-400">Launch your own prediction tournament on Base mainnet</p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = step === i + 1;
            const done = step > i + 1;
            return (
              <div key={s.label} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white glow-blue' : 'bg-white/10 text-gray-500'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${active ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px transition-colors ${done ? 'bg-green-500/50' : 'bg-white/10'}`} />
                )}
              </div>
            );
          })}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass rounded-3xl p-7"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <FieldLabel label="Price Asset" hint="Which asset will participants predict?" />
                <div className="grid grid-cols-3 gap-3">
                  {ASSETS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAsset(a)}
                      className={`py-4 rounded-2xl font-bold text-sm transition-all ${asset === a ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel label="Tournament Duration" hint="How long participants have to wait for resolution" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDuration(d.value)}
                      className={`py-3 rounded-2xl text-sm font-medium transition-all ${duration === d.value ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel label="Max Participants" hint="Maximum number of traders that can enter" />
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    aria-label="Max participants"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-colors"
                    min="2"
                    max="1000"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <FieldLabel label="Entry Fee (ETH)" hint="What each participant pays to enter" />
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    aria-label="Entry fee in ETH"
                    step="0.001"
                    min="0.001"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {['0.001', '0.005', '0.01', '0.05'].map((v) => (
                    <button key={v} onClick={() => setEntryFee(v)} className="py-2 rounded-xl bg-white/5 text-xs font-medium hover:bg-white/10 transition-colors">
                      {v} ETH
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel label="Your Prize Contribution (ETH)" hint="Seed the prize pool to attract more participants" />
                <div className="relative">
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    value={creatorContrib}
                    onChange={(e) => setCreatorContrib(e.target.value)}
                    aria-label="Your prize contribution in ETH"
                    step="0.01"
                    min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                {balance && (
                  <p className="text-xs text-gray-500 mt-2">
                    Balance: {parseFloat(balance.formatted).toFixed(4)} ETH
                  </p>
                )}
              </div>

              {/* Preview */}
              <div className="bg-white/5 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 mb-3">Estimated Prize Pool</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Your contribution</span>
                  <span className="font-semibold">{formatETH(totalCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">From participants (95%)</span>
                  <span className="font-semibold">{formatETH(estimatedPool - totalCost)}</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold">Max Prize Pool</span>
                  <span className="font-black text-green-400">{formatETH(estimatedPool)}</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">Review Your Arena</h3>
              {[
                { label: 'Asset', value: asset },
                { label: 'Duration', value: durationLabel },
                { label: 'Max Participants', value: maxParticipants },
                { label: 'Entry Fee', value: `${entryFee} ETH` },
                { label: 'Your Contribution', value: `${creatorContrib} ETH` },
                { label: 'Max Prize Pool', value: `~${estimatedPool.toFixed(3)} ETH` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-gray-400 text-sm">{label}</span>
                  <span className="font-semibold text-sm">{value}</span>
                </div>
              ))}

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mt-4">
                <p className="text-xs text-blue-300">
                  By deploying, you'll send <strong>{creatorContrib} ETH</strong> to the Base Arena contract on Base mainnet. This seeds the prize pool and makes your arena visible to all traders.
                </p>
              </div>

              {!isConnected && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
                  <p className="text-xs text-orange-300">Connect your wallet to deploy the arena.</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-2xl border border-white/10 text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 py-3 rounded-2xl bg-gradient-blue text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={isPending || !isConnected}
                className="flex-1 py-3 rounded-2xl bg-gradient-blue text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 glow-blue"
              >
                {isPending ? 'Deploying...' : 'Deploy Arena on Base →'}
              </button>
            )}
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Smart contracts audited · 5% platform fee on prize pool ·{' '}
          <Link href="https://docs.base.org" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400">
            Base Docs
          </Link>
        </p>
      </div>
    </div>
  );
}
