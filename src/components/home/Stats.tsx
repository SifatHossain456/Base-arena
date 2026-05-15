'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Users, Zap, DollarSign } from 'lucide-react';

function CountUp({ end, prefix = '', suffix = '', decimals = 0 }: {
  end: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const step = end / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, end);
      setCount(current);
      if (current >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  {
    icon: DollarSign,
    label: 'Total Prize Pool',
    value: 2400000,
    prefix: '$',
    suffix: '+',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
  },
  {
    icon: Users,
    label: 'Active Competitors',
    value: 18400,
    suffix: '+',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    icon: Trophy,
    label: 'Tournaments Run',
    value: 3240,
    suffix: '+',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
  },
  {
    icon: Zap,
    label: 'Avg Block Time',
    value: 2,
    suffix: 's',
    decimals: 0,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
  },
];

export function Stats() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            The Arena by <span className="text-gradient-blue">Numbers</span>
          </h2>
          <p className="text-gray-400">Real metrics from the most competitive prediction platform on Base</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass glass-hover rounded-3xl p-6 text-center border ${stat.border}`}
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className={`text-3xl sm:text-4xl font-black ${stat.color} mb-1`}>
                  <CountUp
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                  />
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
