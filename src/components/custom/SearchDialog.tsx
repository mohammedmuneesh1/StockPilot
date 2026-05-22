"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import Link from 'next/link'

type SearchResult = {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)


//  used to reset the search dialog state when the dialog closes.
  React.useEffect(() => {
    if (!open) {
      const resetId = setTimeout(() => {
        setQuery('')
        setResults([])
        setError(null)
        setIsLoading(false)
      }, 0);

      return () => {
        window.clearTimeout(resetId)
        // clearTimeout() does NOT check whether it executed.
        // It tries to CANCEL the timeout IF it has NOT run yet.
      }
    }

    //EXPLANTATION

    // STEP-1:WHEN DIALOG OPEN
// The effect runs, but if (!open) is false
// No return statement, no cleanup function set up
// Nothing happens

// STEP-2: When dialog closes (open = false):
// The effect runs, if (!open) is true
// The setTimeout is scheduled
// ⚠️ The cleanup function is returned and stored (not executed yet) ⚠️

//STEP-3: Dialog opens again (open = true again):

//React calls the previous cleanup function first → cancels the timeout
// Then the new effect runs → if (!open) is false again

// Dialog opens    → if (!open) is false → no cleanup set
// Dialog closes   → if (!open) is true → cleanup function is SET UP (not called yet)
// Dialog opens    → cleanup function CALLS HERE → then new effect runs

// Effect runs
// ↓
// Timeout scheduled
// ↓
// Current JS finishes
// ↓
// Timeout callback executes


  }, [open]);

  React.useEffect(() => {
    const controller = new AbortController()
    const trimmed = query.trim()
    if (!trimmed) {
      const resetId = window.setTimeout(() => {
        setResults([])
        setError(null)
        setIsLoading(false)
      }, 0)
      return () => {
        window.clearTimeout(resetId)
        controller.abort()
      }
    }

    const loadingId = window.setTimeout(() => {
      setIsLoading(true)
      setError(null)
    }, 0)

    const timer = window.setTimeout(async () => {
      try {
        //nexxtj s api route
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to fetch search results')
        }

        const data = await response.json()
        setResults(Array.isArray(data?.results) ? data.results : [])
      } catch {
        if (controller.signal.aborted) return
        setError('Search failed. Try again.')
        setResults([])
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, 250)
    return () => {
      window.clearTimeout(loadingId)
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg  max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <DialogTitle>Search stocks</DialogTitle>
              <DialogDescription>Type a symbol or company name to see results instantly.</DialogDescription>
            </div>
            {/* <Button variant="ghost" size="icon-sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button> */}
          </div>
        </DialogHeader>

        <div className="space-y-4 h-full overflow-hidden">
          <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search stocks..."
              className="border-none bg-transparent p-0 focus-visible:ring-0"
              autoFocus
            />
          </div>

          <div className="rounded-xl border border-input bg-muted/60 p-3 overflow-y-auto max-h-[calc(80vh-220px)]">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Searching...</p>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : query.trim().length === 0 ? (
              <p className="text-sm text-muted-foreground">Start typing to search for symbols.</p>
            ) : results.length === 0 ? (
              <p className="text-sm text-muted-foreground">No results found.</p>
            ) : (
              <ul className="space-y-2">
                {results.map((item) => (
                  <Link
                    href={`/stocks/${item.symbol}`}
                    onClick={() => onOpenChange(false)}
                    key={`${item.symbol}-${item.exchange}`}
                    className="block rounded-lg border border-border bg-background p-3 hover:border-primary hover:bg-primary/10"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.symbol}</p>
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                      </div>
                      <span className="text-xs uppercase text-muted-foreground">{item.exchange}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{item.type}</p>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SearchDialog
