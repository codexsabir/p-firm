'use client';

import React from 'react';
import { Download, FileSpreadsheet, FileText, FileJson } from 'lucide-react';
import { FirmRecord } from '@/types/firm';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/exporters';

interface Props {
  data: FirmRecord[];
}

export const ExportButtons: React.FC<Props> = ({ data }) => {
  const disabled = !data.length;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        disabled={disabled}
        onClick={() => exportToCSV(data, { filenameBase:'firms' })}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-slateDeep text-white hover:bg-slateDeep/90 disabled:opacity-40 focus-outline"
      >
        <FileText className="w-4 h-4" /> CSV
      </button>
      <button
        disabled={disabled}
        onClick={() => exportToExcel(data, { filenameBase:'firms' })}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-lemon-400 text-slateDeep hover:bg-lemon-300 disabled:opacity-40 focus-outline"
      >
        <FileSpreadsheet className="w-4 h-4" /> Excel
      </button>
      <button
        disabled={disabled}
        onClick={() => exportToPDF(data, { filenameBase:'firms' })}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-slateDeep text-white hover:bg-slateDeep/90 disabled:opacity-40 focus-outline"
      >
        <Download className="w-4 h-4" /> PDF
      </button>
      <button
        disabled={disabled}
        onClick={() => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
            const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `firms_${Date.now()}.json`;
          a.click();
        }}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-slateDeep dark:text-white disabled:opacity-40 border border-black/10 dark:border-white/10 focus-outline"
      >
        <FileJson className="w-4 h-4" /> JSON
      </button>
    </div>
  );
};