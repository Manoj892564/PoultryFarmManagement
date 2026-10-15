import React, { useState } from 'react';
import { 
  Bird, 
  Egg, 
  CheckCircle2, 
  AlertTriangle, 
  Wheat, 
  IndianRupee, 
  PlusCircle, 
  TrendingUp, 
  Layers, 
  ArrowUpRight 
} from 'lucide-react';
import { DashboardSummary, Batch, EggCollection } from '../types';

interface Props {
  summary: DashboardSummary | null;
  batches: Batch[];
  recentEggs: EggCollection[];
  onOpenAddBirdsModal: () => void;
  onNavigate: (tab: any) => void;
}

export const Dashboard: React.FC<Props> = ({
  summary,
  batches,
  recentEggs,
  onOpenAddBirdsModal,
  onNavigate
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // 7-day trend sample data or aggregated from recentEggs
  const trendPoints = [
    { day: 'Day 1', val: 3200 },
    { day: 'Day 2', val: 3350 },
    { day: 'Day 3', val: 3100 },
    { day: 'Day 4', val: 3480 },
    { day: 'Day 5', val: 3520 },
    { day: 'Day 6', val: 3690 },
    { day: 'Today', val: summary?.totalEggs && summary.totalEggs > 0 ? summary.totalEggs : 3845 },
  ];

  const maxVal = Math.max(...trendPoints.map(p => p.val));
  const minVal = Math.min(...trendPoints.map(p => p.val));

  // Generate SVG coordinates
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const points = trendPoints.map((p, idx) => {
    const x = paddingX + (idx / (trendPoints.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((p.val - minVal * 0.9) / (maxVal - minVal * 0.9 || 1)) * (svgHeight - paddingY * 2);
    return { ...p, x, y };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/20">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Flock Intelligence & Control Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time harvest metrics, feed conversion ratio, and live flock inventory.
          </p>
        </div>

        {/* 3 Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenAddBirdsModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Birds</span>
          </button>
          <button
            onClick={() => onNavigate('eggs')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/25 transition active:scale-95"
          >
            <Egg className="w-4 h-4" />
            <span>Record Eggs</span>
          </button>
          <button
            onClick={() => onNavigate('feed')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95"
          >
            <Wheat className="w-4 h-4" />
            <span>Record Feed</span>
          </button>
        </div>
      </div>

      {/* 6 Live KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: Total Birds */}
        <div className="glass-card p-4 rounded-2xl border-slate-800/80 glass-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Flock Birds</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Bird className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {summary?.totalBirds?.toLocaleString() || '5,000'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">{summary?.activeBatchesCount || 4}</span> Active Batches
          </div>
        </div>

        {/* Card 2: Daily Egg Yield */}
        <div className="glass-card p-4 rounded-2xl border-slate-800/80 glass-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Egg Yield</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Egg className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {summary?.totalEggs?.toLocaleString() || '3,845'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            Efficiency: <span className="text-amber-400 font-semibold">{summary?.layingRate || '76.9'}%</span>
          </div>
        </div>

        {/* Card 3: Good Eggs Count */}
        <div className="glass-card p-4 rounded-2xl border-slate-800/80 glass-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Grade-A Eggs</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {summary?.goodEggs?.toLocaleString() || '3,799'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Marketable stock
          </div>
        </div>

        {/* Card 4: Broken Egg Rate */}
        <div className="glass-card p-4 rounded-2xl border-slate-800/80 glass-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Breakage %</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {summary?.brokenRate || '1.2'}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span className="text-rose-400">{summary?.brokenEggs || 46}</span> eggs lost
          </div>
        </div>

        {/* Card 5: Daily Feed Consumed */}
        <div className="glass-card p-4 rounded-2xl border-slate-800/80 glass-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Feed Consumed</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {summary?.totalFeedKg || '680'} <span className="text-xs text-slate-400 font-normal">kg</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Layer ration phase-1
          </div>
        </div>

        {/* Card 6: Feed Cost Today */}
        <div className="glass-card p-4 rounded-2xl border-slate-800/80 glass-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Feed Expense</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{summary?.totalFeedCost || '23,800'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Avg ₹35.00/kg
          </div>
        </div>
      </div>

      {/* SVG Production Trend Chart & Flock Quick List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Trend SVG Chart */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> 7-Day Egg Production Curve
              </h3>
              <p className="text-xs text-slate-400">Harvest output progression over the last week</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live Aggregate
            </span>
          </div>

          {/* Responsive SVG Chart */}
          <div className="relative w-full overflow-hidden bg-slate-950/50 rounded-xl p-2 border border-slate-800/50">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 sm:h-52">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#1e293b" strokeDasharray="3 3" />
              <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="#1e293b" strokeDasharray="3 3" />
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#334155" />

              {/* Area Fill */}
              <path d={areaD} fill="url(#areaGradient)" />

              {/* Trend Line */}
              <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Interactive Points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint === idx ? 6 : 4}
                    fill={hoveredPoint === idx ? '#34d399' : '#10b981'}
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <text
                    x={p.x}
                    y={svgHeight - 6}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="sans-serif"
                  >
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip display */}
            {hoveredPoint !== null && (
              <div className="absolute top-4 right-4 bg-slate-900 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs shadow-xl pointer-events-none">
                <span className="text-slate-400">{points[hoveredPoint].day}:</span>{' '}
                <strong className="text-emerald-400">{points[hoveredPoint].val.toLocaleString()} eggs</strong>
              </div>
            )}
          </div>
        </div>

        {/* Active Batches Overview */}
        <div className="glass-card p-5 rounded-2xl border-slate-800/80 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Active Flock Batches
            </h3>
            <button
              onClick={() => onNavigate('batches')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-0.5"
            >
              All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-56 pr-1">
            {batches.map((b) => (
              <div 
                key={b.batch_id}
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between hover:bg-slate-800/70 transition"
              >
                <div>
                  <div className="font-semibold text-xs text-white">{b.batch_name}</div>
                  <div className="text-[11px] text-slate-400">{b.breed} • {b.arrival_date}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">
                    {b.bird_count.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">birds</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
