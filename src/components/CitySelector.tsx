'use client';

import React, { useMemo, useState } from 'react';
import { US_CITIES } from '@/lib/cities';
import { Search, MapPin, Sparkles } from 'lucide-react';

interface Props {
  onSelect(city: string): void;
  loading?: boolean;
  selectedCity?: string | null;
}

/**
 * Enhanced City Selector
 * - Grouped alphabetically
 * - Popular chips
 * - Match highlighting
 * - Brand focus / active styles
 */
export const CitySelector: React.FC<Props> = ({
  onSelect,
  loading,
  selectedCity
}) => {
  const [query, setQuery] = useState('');

  const popular = useMemo(
    () => ['New York', 'Los Angeles', 'Chicago', 'Dallas', 'Houston', 'Phoenix', 'San Francisco', 'Seattle'],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return US_CITIES;
    return US_CITIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.state && c.state.toLowerCase().includes(q))
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof US_CITIES> = {};
    filtered.forEach(c => {
      const letter = c.name.charAt(0).toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(c);
    });
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([letter, cities]) => ({
        letter,
        cities: cities.sort((a, b) => a.name.localeCompare(b.name))
      }));
  }, [filtered]);

  function highlight(text: string) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'ig');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="rounded px-0.5 bg-lemon-300/70 dark:bg-lemon-400/40 text-slateDeep dark:text-white">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  return (
    <div className="glass-base p-5 md:p-6 lg:p-7 relative flex flex-col h-full">
      <div className="glass-noise" />

      <header className="mb-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-lemon-200/60 to-lemon-400/80 g-depth-2">
            <MapPin className="w-5 h-5 text-slateDeep" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight heading-gradient">Select a City</h2>
            <p className="text-xs text-muted">Browse or search the available cities.</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={query}
            placeholder="Search city or state..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl bg-white/70 dark:bg-slateDeep/40 border border-black/10 dark:border-white/10 px-9 py-2.5 text-sm focus:outline-none focus:ring-2 ring-lemon-400 ring-offset-0 placeholder:text-muted backdrop-blur-md transition"
            aria-label="Search cities"
          />
        </div>
      </header>

      {/* Popular chips (only when no query) */}
      {!query && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted mb-2">
            <Sparkles className="w-3.5 h-3.5 text-lemon-500" />
            Popular
          </div>
          <div className="flex flex-wrap gap-2">
            {popular.map(city => {
              const active = selectedCity === city;
              return (
                <button
                  key={city}
                  disabled={loading}
                  onClick={() => onSelect(city)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition focus-outline
                    ${active
                      ? 'bg-lemon-400 text-slateDeep border-lemon-300 shadow-sm'
                      : 'bg-white/60 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-lemon-200/50 dark:hover:bg-lemon-400/10 text-slateDeep dark:text-white'
                    }
                    disabled:opacity-40`}
                  aria-pressed={active}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="relative flex-1 min-h-0">
        <div className="absolute inset-0 overflow-y-auto pr-1 custom-thin-scroll scroll-smooth">
          {grouped.length === 0 && (
            <p className="text-center text-sm text-muted py-8">No cities match “{query}”.</p>
          )}

            <nav aria-label="City list" className="space-y-6">
            {grouped.map(group => (
              <div key={group.letter}>
                <div className="sticky top-0 z-10 -mx-5 md:-mx-6 lg:-mx-7 px-5 md:px-6 lg:px-7 py-1.5 backdrop-blur-sm bg-gradient-to-r from-white/85 to-white/60 dark:from-slateDeep/80 dark:to-slateDeep/60 border-b border-black/5 dark:border-white/5">
                  <h3 className="text-[11px] font-semibold tracking-wider text-muted">
                    {group.letter}
                  </h3>
                </div>
                <ul className="mt-3 grid gap-2 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                  {group.cities.map(c => {
                    const label = c.state ? `${c.name}, ${c.state}` : c.name;
                    const active = selectedCity === c.name;
                    return (
                      <li key={label}>
                        <button
                          disabled={loading}
                          onClick={() => onSelect(c.name)}
                          className={`group w-full text-left text-[11px] sm:text-xs font-medium px-3 py-2 rounded-lg border relative overflow-hidden
                            transition focus-outline
                            ${active
                              ? 'bg-lemon-400 text-slateDeep border-lemon-300 shadow-sm'
                              : 'bg-white/60 dark:bg-white/5 hover:bg-lemon-50/80 dark:hover:bg-lemon-400/10 text-slateDeep dark:text-white border-black/10 dark:border-white/10'
                            }
                            disabled:opacity-40`}
                          aria-pressed={active}
                        >
                          <span className="relative z-10 flex flex-col">
                            <span className="font-semibold truncate">
                              {highlight(c.name)}
                            </span>
                            {c.state && (
                              <span className="text-[10px] text-muted -mt-0.5">
                                {highlight(c.state)}
                              </span>
                            )}
                          </span>
                          {!active && (
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-tr from-lemon-200/40 to-lemon-300/20 pointer-events-none" />
                          )}
                          {active && (
                            <span className="absolute inset-0 ring-2 ring-lemon-500/70 ring-offset-[1.5px] ring-offset-lemon-200/40 dark:ring-offset-slateDeep/60 pointer-events-none rounded-lg" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Loading skeleton */}
          {loading && (
            <div className="mt-6 space-y-3 animate-pulse">
              <div className="h-5 w-24 rounded bg-white/50 dark:bg-white/10" />
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 rounded bg-white/50 dark:bg-white/10"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-5 pt-3 border-t border-black/5 dark:border-white/5">
        <p className="text-[10px] text-muted">
          Showing {filtered.length} of {US_CITIES.length} cities.
          {query && filtered.length === 0 && ' Try adjusting your search.'}
        </p>
      </footer>
    </div>
  );
};