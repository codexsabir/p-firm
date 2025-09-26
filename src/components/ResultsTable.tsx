'use client';

import React, { useMemo, useState } from 'react';
import { FirmRecord } from '@/types/firm';
import { ArrowUpDown, ExternalLink } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?(val: any, row: FirmRecord): React.ReactNode;
  width?: string;
}

const baseColumns: Column[] = [
  { key:'firm_name', label:'Firm', width:'220px' },
  { key:'website_url', label:'Website', render:(v) => v ? <a href={v} target="_blank" className="underline inline-flex items-center gap-1 text-sm text-slateDeep dark:text-lemon-400">{new URL(v).hostname}<ExternalLink className="w-3 h-3" /></a> : '—' },
  { key:'city', label:'City' },
  { key:'state', label:'State' },
  { key:'doors_managed', label:'Doors Managed' },
  { key:'google_rating', label:'Rating' },
  { key:'google_reviews_count', label:'Reviews' },
  { key:'is_hiring', label:'Hiring', render:(v)=> v ? <span className="px-2 py-0.5 text-[10px] rounded bg-green-500/15 text-green-600 dark:text-green-400">Yes</span> : <span className="px-2 py-0.5 text-[10px] rounded bg-red-500/15 text-red-600 dark:text-red-400">No</span> },
];

interface Props {
  data: FirmRecord[];
  loading?: boolean;
}

export const ResultsTable: React.FC<Props> = ({ data, loading }) => {
  const [sortKey, setSortKey] = useState<string>('firm_name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const columns = baseColumns;

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      const av = (a.output as any)[sortKey];
      const bv = (b.output as any)[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return copy;
  }, [data, sortKey, sortDir]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;

  function toggleSort(key: string) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return (
    <div className="glass-base p-5 md:p-6 relative mt-8">
      <div className="glass-noise" />
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold heading-gradient">Results</h2>
          <p className="text-xs text-muted">
            {loading ? 'Fetching data...' : data.length ? `${data.length} record(s)` : 'No data yet'}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto table-scroll-shadow relative">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-white/50 dark:bg-white/10">
              {columns.map(col => {
                const active = col.key === sortKey;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className="px-3 py-2 font-semibold text-xs uppercase tracking-wide text-muted"
                  >
                    <button
                      onClick={() => toggleSort(col.key)}
                      className={`inline-flex items-center gap-1 hover:text-slateDeep dark:hover:text-lemon-400 transition ${active ? 'text-slateDeep dark:text-lemon-400' : ''}`}
                    >
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-muted">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && !paged.length && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted text-sm">
                  No data. Select a city to fetch firms.
                </td>
              </tr>
            )}
            {!loading && paged.map((row, i) => (
              <tr
                key={i}
                className="border-b border-black/5 dark:border-white/5 hover:bg-lemon-50/50 dark:hover:bg-white/5 transition"
              >
                {columns.map(col => {
                  const value = (row.output as any)[col.key];
                  return (
                    <td key={col.key} className="px-3 py-2 align-top">
                      {col.render ? col.render(value, row) : (value ?? '—')}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > pageSize && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-muted">
            Page {page} of {totalPages}
          </p>
            <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/10 text-xs disabled:opacity-40 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/10 text-xs disabled:opacity-40 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};