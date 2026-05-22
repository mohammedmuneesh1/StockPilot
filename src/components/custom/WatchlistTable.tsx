'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import type { StockWithData } from '@/types/global';

interface WatchlistTableProps {
  watchlist: StockWithData[];
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({ watchlist }) => {
  const [rows, setRows] = useState<StockWithData[]>(watchlist);
  const [open, setOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [threshold, setThreshold] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRow = useMemo(
    () => rows.find((row) => row.symbol === selectedSymbol),
    [rows, selectedSymbol]
  );

  const handleOpen = (symbol: string, currentThreshold?: number) => {
    setSelectedSymbol(symbol);
    setThreshold(currentThreshold !== undefined && currentThreshold !== null ? String(currentThreshold) : '');
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSymbol('');
    setThreshold('');
    setError(null);
  };

  const handleSave = async () => {
    if (!selectedSymbol) return;

    setIsSaving(true);
    setError(null);

    const payload = {
      symbol: selectedSymbol,
      alertThreshold: threshold === '' ? null : Number(threshold),
    };

    try {
      const response = await fetch('/api/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || 'Failed to save alert threshold');
      }

      const data = await response.json();
      setRows((currentRows) =>
        currentRows.map((row) =>
          row.symbol === selectedSymbol
            ? {
                ...row,
                alertThreshold:
                  data.alertThreshold === null || data.alertThreshold === undefined
                    ? undefined
                    : Number(data.alertThreshold),
              }
            : row
        )
      );
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save alert');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4">
      <table className="min-w-full table-auto border-separate border-spacing-y-3 text-left text-sm text-slate-300">
        <thead>
          <tr className="text-xs uppercase tracking-[0.18em] text-slate-500">
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Change</th>
            <th className="px-4 py-3">Market Cap</th>
            <th className="px-4 py-3">P/E Ratio</th>
            <th className="px-4 py-3">Alert</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.symbol} className="rounded-3xl border border-slate-800 bg-slate-950 shadow-sm">
              <td className="px-4 py-4 align-top">
                <div className="text-sm font-semibold text-white">{row.company}</div>
              </td>
              <td className="px-4 py-4 align-top text-slate-300">{row.symbol}</td>
              <td className="px-4 py-4 align-top">{row.priceFormatted ?? 'N/A'}</td>
              <td
                className={`px-4 py-4 align-top font-medium ${
                  row.changePercent !== undefined && row.changePercent >= 0
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {row.changeFormatted ?? 'N/A'}
              </td>
              <td className="px-4 py-4 align-top">{row.marketCap ?? 'N/A'}</td>
              <td className="px-4 py-4 align-top">{row.peRatio ?? 'N/A'}</td>
              <td className="px-4 py-4 align-top text-slate-200">
                {row.alertThreshold !== undefined && row.alertThreshold !== null
                  ? `${row.alertThreshold}%`
                  : 'None'}
              </td>
              <td className="px-4 py-4 align-top space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(row.symbol, row.alertThreshold)}
                >
                  Alert
                </Button>
                <Link href={`/stocks/${row.symbol}`}>
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-3xl bg-slate-950 p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle>Price change alert</DialogTitle>
            <DialogDescription>
              Set the percent change threshold for {selectedRow?.symbol}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="alert-threshold">Alert threshold (%)</Label>
              <Input
                id="alert-threshold"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 2.5"
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
              />
            </div>
            <div className="text-sm text-slate-400">
              Leave blank to clear the alert threshold.
            </div>
            {error ? <div className="rounded-xl bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
          </div>

          <DialogFooter className="flex flex-wrap gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="button" disabled={isSaving} onClick={handleSave}>
              {isSaving ? 'Saving...' : 'Save alert'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WatchlistTable;
