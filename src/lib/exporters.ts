import { FirmRecord } from '@/types/firm';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportOptions {
  filenameBase?: string;
}

const flattenRecord = (r: FirmRecord) => {
  const o = r.output;
  return {
    firm_name: o.firm_name,
    website_url: o.website_url,
    owner_name: o.owner_name,
    owner_phone: o.owner_phone,
    owner_email: o.owner_email,
    city: o.city,
    state: o.state,
    vacant_listings_count: o.vacant_listings_count,
    doors_managed: o.doors_managed,
    property_management_software: o.property_management_software,
    leasing_manager_name: o.leasing_manager_name,
    leasing_manager_contact: o.leasing_manager_contact,
    services_offered: o.services_offered?.join('; '),
    portfolio_focus: o.portfolio_focus?.join('; '),
    google_reviews_count: o.google_reviews_count,
    google_rating: o.google_rating,
    last_blog_update: o.last_blog_update,
    linkedin_url: o.linkedin_url,
    instagram_url: o.instagram_url,
    facebook_url: o.facebook_url,
    advertises_24_7_maintenance: o.advertises_24_7_maintenance,
    advertises_tenant_portal: o.advertises_tenant_portal,
    is_hiring: o.is_hiring
  };
};

export function exportToCSV(data: FirmRecord[], opts?: ExportOptions) {
  if (!data.length) return;
  const rows = data.map(flattenRecord);
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map(row => headers.map(h => {
      const val = (row as any)[h] ?? '';
      const needsQuote = /[",\n]/.test(String(val));
      return needsQuote ? `"${String(val).replace(/"/g,'""')}"` : val;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${opts?.filenameBase || 'firms'}_${Date.now()}.csv`;
  link.click();
}

export function exportToExcel(data: FirmRecord[], opts?: ExportOptions) {
  if (!data.length) return;
  const rows = data.map(flattenRecord);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Firms');
  XLSX.writeFile(wb, `${opts?.filenameBase || 'firms'}_${Date.now()}.xlsx`);
}

export function exportToPDF(data: FirmRecord[], opts?: ExportOptions) {
  if (!data.length) return;
  const rows = data.map(flattenRecord);
  const doc = new jsPDF({ orientation:'landscape' });
  const headers = Object.keys(rows[0]);
  const body = rows.map(r => headers.map(h => (r as any)[h] ?? ''));

  // @ts-ignore - autoTable types
  doc.autoTable({
    head: [headers],
    body,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [255,235,59], textColor: '#0F1724' },
    didDrawPage: (d: any) => {
      doc.setFontSize(10);
      doc.text('Firm Data Export', 14, 10);
    }
  });

  doc.save(`${opts?.filenameBase || 'firms'}_${Date.now()}.pdf`);
}