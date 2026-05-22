import TradingViewWidget from "@/components/tradingView/TradingViewWidget";
import WatchlistButton from "@/components/custom/WatchlistButton";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getWatchlistStatusByUserId } from "@/lib/actions/watchlist.action";
import { fetchJSON } from "@/lib/actions/finhub.actions";

import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? null;
  const isInWatchlist = userId ? await getWatchlistStatusByUserId(userId, symbol.toUpperCase()) : false;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  // Resolve company name for this symbol so WatchlistButton stores the proper company
  const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
  const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';
  let companyName = symbol.toUpperCase();
  if (token) {
    try {
      type FinnhubProfile = { name?: string; marketCapitalization?: number };
      const profileUrl = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${token}`;
      const profile = await fetchJSON<FinnhubProfile>(profileUrl, 3600);
      if (profile?.name) companyName = profile.name;
    } catch (e) {
      console.error('Failed to fetch company profile for', symbol, e);
    }
  }

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <WatchlistButton
              symbol={symbol.toUpperCase()}
              company={companyName}
              isInWatchlist={isInWatchlist}
            />
          </div>

          <TradingViewWidget
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
}