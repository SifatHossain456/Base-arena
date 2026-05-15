'use client';

import { useState, useEffect, useCallback } from 'react';

export type AssetPrice = {
  symbol: string;
  coingeckoId: string;
  price: number | null;
  change24h: number | null;
  loading: boolean;
  error: boolean;
};

const ASSETS: Pick<AssetPrice, 'symbol' | 'coingeckoId'>[] = [
  { symbol: 'ETH', coingeckoId: 'ethereum' },
  { symbol: 'BTC', coingeckoId: 'bitcoin' },
  { symbol: 'cbBTC', coingeckoId: 'bitcoin' },
];

export function useAssetPrices(refreshMs = 30000) {
  const [prices, setPrices] = useState<AssetPrice[]>(
    ASSETS.map((a) => ({ ...a, price: null, change24h: null, loading: true, error: false }))
  );

  const fetch_ = useCallback(async () => {
    try {
      const ids = [...new Set(ASSETS.map((a) => a.coingeckoId))].join(',');
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) throw new Error('API error');
      const data: Record<string, { usd: number; usd_24h_change: number }> = await res.json();

      setPrices(
        ASSETS.map((a) => {
          const row = data[a.coingeckoId];
          return {
            ...a,
            price: row?.usd ?? null,
            change24h: row?.usd_24h_change ?? null,
            loading: false,
            error: !row,
          };
        })
      );
    } catch {
      setPrices((prev) => prev.map((p) => ({ ...p, loading: false, error: true })));
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, refreshMs);
    return () => clearInterval(id);
  }, [fetch_, refreshMs]);

  return prices;
}
