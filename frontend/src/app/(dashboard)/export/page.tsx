'use client';
import { useState } from 'react';
import { exportApi } from '@/lib/api';
import { Download, FileText, File, FileJson, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { today } from '@/lib/utils';

type ExportFormat = 'dlog' | 'rci' | 'csv' | 'json';

const FORMATS: { id: ExportFormat; label: string; description: string; icon: any }[] = [
  {
    id: 'dlog',
    label: 'DLOG',
    description: 'DLOG-compatible CSV format for UK climbing logs',
    icon: FileText,
  },
  {
    id: 'rci',
    label: 'RCI / Certification',
    description: 'UK Rock Climbing Instructor certification format',
    icon: File,
  },
  {
    id: 'csv',
    label: 'CSV (Universal)',
    description: 'Full data export — open in Excel, Google Sheets',
    icon: FileText,
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'Complete structured data export for developers',
    icon: FileJson,
  },
];

const thisYear = new Date().getFullYear();

export default function ExportPage() {
  const [format, setFormat] = useState<ExportFormat>('dlog');
  const [startDate, setStartDate] = useState(`${thisYear}-01-01`);
  const [endDate, setEndDate] = useState(today());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await exportApi.download(format, startDate, endDate);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Export failed. Do you have any climbs in this date range?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Export</h1>
        <p className="text-stone-500 text-sm mt-1">
          Download your climbing log for certification or personal records.
        </p>
      </div>

      {/* Format selector */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-stone-700">Export format</label>
        {FORMATS.map(({ id, label, description, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setFormat(id)}
            className={cn(
              'card w-full p-4 flex items-start gap-3 text-left transition-all hover:shadow active:scale-[0.99]',
              format === id && 'border-rock-400 shadow-sm bg-rock-50',
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
              format === id ? 'bg-rock-600 text-white' : 'bg-stone-100 text-stone-500',
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className={cn('font-semibold text-sm', format === id ? 'text-rock-700' : 'text-stone-900')}>
                {label}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">{description}</p>
            </div>
            {format === id && (
              <CheckCircle className="w-4 h-4 text-rock-500 ml-auto mt-0.5 shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Date range */}
      <div className="card p-4 space-y-4">
        <h2 className="font-semibold text-stone-900">Date range</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input text-sm"
              max={endDate}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input text-sm"
              min={startDate}
              max={today()}
            />
          </div>
        </div>
      </div>

      {/* Info box for RCI */}
      {format === 'rci' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium mb-1">RCI Certification Export</p>
          <p className="text-xs text-blue-600 leading-relaxed">
            This format maps your log entries to RCI submission fields including method type, area, and rock type.
            Ensure route data has been fully entered for best results.
          </p>
        </div>
      )}

      {/* Status messages */}
      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">
          <CheckCircle className="w-4 h-4 shrink-0" />
          File downloaded successfully!
        </div>
      )}

      {/* Download button */}
      <button
        onClick={handleExport}
        disabled={loading}
        className="btn-primary w-full text-base"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Preparing export…</>
        ) : (
          <><Download className="w-5 h-5" /> Download {FORMATS.find((f) => f.id === format)?.label}</>
        )}
      </button>
    </div>
  );
}
