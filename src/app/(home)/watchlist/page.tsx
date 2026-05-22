import WatchlistTable from '@/components/custom/WatchlistTable';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { getWatchlistByUserId } from '@/lib/actions/watchlist.action';
import { fetchJSON } from '@/lib/actions/finhub.actions';
import { formatMarketCapValue } from '@/lib/utils';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

type RawWatchlistItem = {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
  alertThreshold?: number;
};

async function getWatchlistWithMetrics(items: RawWatchlistItem[]) {
  const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';

  return await Promise.all(
    items.map(async (item) => {
      if (!token) {
        return {
          ...item,
          addedAt: item.addedAt.toISOString(),
          currentPrice: undefined,
          changePercent: undefined,
          priceFormatted: 'N/A',
          changeFormatted: 'N/A',
          marketCap: 'N/A',
          peRatio: 'N/A',
        };
      }

      try {
        const quoteUrl = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(item.symbol)}&token=${token}`;
        const profileUrl = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(item.symbol)}&token=${token}`;
        const metricUrl = `${FINNHUB_BASE_URL}/stock/metric?symbol=${encodeURIComponent(item.symbol)}&metric=all&token=${token}`;

        type FinnhubProfile = {
        marketCapitalization?: number;
      };

      type FinnhubMetric = {
        metric?: {
          peBasicExclExtraTTM?: number;
          peRatio?: number;
        };
      };

      const [quote, profile, metric] = await Promise.all([
          fetchJSON<{ c?: number; dp?: number }>(quoteUrl, 60),
          fetchJSON<FinnhubProfile>(profileUrl, 3600),
          fetchJSON<FinnhubMetric>(metricUrl, 3600),
        ]);

        const currentPrice = quote?.c;
        const changePercent = quote?.dp;
        const priceFormatted = typeof currentPrice === 'number' ? `$${currentPrice.toFixed(2)}` : 'N/A';
        const changeFormatted = typeof changePercent === 'number' ? `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%` : 'N/A';
        const marketCap = formatMarketCapValue(Number(profile?.marketCapitalization ?? 0));
        const peMetric = metric?.metric?.peBasicExclExtraTTM ?? metric?.metric?.peRatio ?? null;
        const peRatio = typeof peMetric === 'number' && Number.isFinite(peMetric) ? peMetric.toFixed(2) : 'N/A';

        return {
          ...item,
          addedAt: item.addedAt.toISOString(),
          currentPrice,
          changePercent,
          priceFormatted,
          changeFormatted,
          marketCap,
          peRatio,
        };
      } catch (error) {
        console.error('Failed to load watchlist metric for', item.symbol, error);
        return {
          ...item,
          addedAt: item.addedAt.toISOString(),
          currentPrice: undefined,
          changePercent: undefined,
          priceFormatted: 'N/A',
          changeFormatted: 'N/A',
          marketCap: 'N/A',
          peRatio: 'N/A',
        };
      }
    })
  );
}

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? null;

  if (!userId) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center">
          <h1 className="text-3xl font-semibold text-white mb-3">Watchlist</h1>
          <p className="text-slate-400 mb-6">You need to sign in to view your saved watchlist stocks.</p>
          <a
            href="/auth/sign-in"
            className="inline-flex rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  const watchlistItems = await getWatchlistByUserId(userId);
  const watchlistData = JSON.parse(JSON.stringify(await getWatchlistWithMetrics(watchlistItems as RawWatchlistItem[]))); 

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">My Watchlist</p>
          <h1 className="text-4xl font-semibold text-white">Saved Stocks</h1>
          <p className="max-w-2xl text-slate-400">
            Track your saved symbols with price, daily change, market cap, P/E ratio, and alert thresholds.
          </p>
        </div>

        {watchlistData.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center">
            <p className="text-lg font-medium text-white mb-3">Your watchlist is empty.</p>
            <p className="text-slate-400 mb-6">Add stocks from the search page or a stock detail page to start tracking them here.</p>
            <a
              href="/search"
              className="inline-flex rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Search stocks
            </a>
          </div>
        ) : (
          <WatchlistTable watchlist={watchlistData} />
        )}
      </div>
    </div>
  );
}
