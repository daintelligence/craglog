'use client';
import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/lib/api';
import { Loader2, TrendingUp, Mountain, Target, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

const TYPE_COLORS: Record<string, string> = {
  trad: '#856440', sport: '#3b82f6', boulder: '#10b981', mixed: '#a855f7', alpine: '#f59e0b',
};

export default function StatsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: statsApi.dashboard,
  });
  const { data: yearData = [] } = useQuery({
    queryKey: ['stats', 'years'],
    queryFn: statsApi.yearComparison,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-rock-400" />
      </div>
    );
  }

  const progression = stats?.progression || [];
  const byType = stats?.byType || [];
  const gradeDistrib = (stats?.gradeDistribution || []).slice(-15);
  const topCrags = stats?.topCrags || [];
  const t = stats?.totals;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Statistics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Climbs', value: t?.totalAscents ?? 0 },
          { label: 'Onsight Rate', value: `${stats?.onsightRate?.onsightRate ?? 0}%` },
          { label: 'Crags Visited', value: t?.uniqueCrags ?? 0 },
          { label: 'Days Climbing', value: t?.totalDays ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4">
            <p className="text-3xl font-bold text-stone-900">{value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Year comparison */}
      {yearData.length > 0 && (
        <div className="card p-4">
          <h2 className="font-semibold text-stone-900 mb-4">Year comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-stone-400 border-b border-stone-100">
                  <th className="text-left pb-2">Year</th>
                  <th className="text-right pb-2">Climbs</th>
                  <th className="text-right pb-2">Crags</th>
                  <th className="text-right pb-2">Onsights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {yearData.map((y: any) => (
                  <tr key={y.year}>
                    <td className="py-2 font-medium">{y.year}</td>
                    <td className="py-2 text-right text-stone-600">{y.total}</td>
                    <td className="py-2 text-right text-stone-600">{y.crags}</td>
                    <td className="py-2 text-right text-stone-600">{y.onsights}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Monthly progression */}
      {progression.length > 0 && (
        <div className="card p-4">
          <h2 className="font-semibold text-stone-900 mb-4">Monthly activity (12 months)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={progression} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#a8a29e' }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#a8a29e' }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e7e5e4' }}
                labelFormatter={(v) => v}
              />
              <Bar dataKey="total" fill="#856440" radius={[4, 4, 0, 0]} name="Climbs" />
              <Bar dataKey="onsights" fill="#10b981" radius={[4, 4, 0, 0]} name="Onsights" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Grade distribution */}
      {gradeDistrib.length > 0 && (
        <div className="card p-4">
          <h2 className="font-semibold text-stone-900 mb-4">Grade distribution</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={gradeDistrib} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="grade" tick={{ fontSize: 10, fill: '#a8a29e' }} />
              <YAxis tick={{ fontSize: 10, fill: '#a8a29e' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e7e5e4' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Climbs" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Sport vs Trad */}
      {byType.length > 0 && (
        <div className="card p-4">
          <h2 className="font-semibold text-stone-900 mb-4">Climbing type breakdown</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={byType} cx="50%" cy="50%" outerRadius={60} dataKey="count" paddingAngle={3}>
                  {byType.map((entry: any, index: number) => (
                    <Cell key={index} fill={TYPE_COLORS[entry.type] || '#94a3b8'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {byType.map((t: any) => (
                <div key={t.type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ background: TYPE_COLORS[t.type] || '#94a3b8' }} />
                    <span className="capitalize text-stone-700">{t.type}</span>
                  </div>
                  <span className="font-semibold text-stone-900">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top crags */}
      {topCrags.length > 0 && (
        <div className="card p-4">
          <h2 className="font-semibold text-stone-900 mb-4">Most climbed crags</h2>
          <div className="space-y-2">
            {topCrags.map((c: any, i: number) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-stone-800 truncate">{c.name}</span>
                    <span className="text-xs text-stone-500 ml-2 shrink-0">{c.visits}</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rock-500 rounded-full"
                      style={{ width: `${(c.visits / topCrags[0].visits) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
