import React, { useState } from 'react';
import { Batch, EggCollection, FeedConsumption, DashboardSummary } from '../types';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  TrendingUp, 
  IndianRupee, 
  Calendar,
  Egg,
  Wheat,
  PieChart
} from 'lucide-react';

interface Props {
  summary: DashboardSummary | null;
  batches: Batch[];
  eggCollections: EggCollection[];
  feedConsumptions: FeedConsumption[];
}

export const ReportsView: React.FC<Props> = ({
  summary,
  batches,
  eggCollections,
  feedConsumptions,
}) => {
  const [reportSubTab, setReportSubTab] = useState<'financial' | 'monthly-eggs' | 'monthly-feed'>('financial');

  // Financial Estimates:
  const goodEggsCount = summary?.goodEggs || 0;
  const eggSellingPrice = 6.00; // ₹6 per good egg
  const grossRevenue = goodEggsCount * eggSellingPrice;
  const totalFeedExpense = Number(summary?.totalFeedCost || 0);
  const netProfit = grossRevenue - totalFeedExpense;
  const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

  // Export CSV Handler
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportSubTab === 'monthly-eggs') {
      csvContent += 'Collection ID,Date,Batch,Total Harvested,Broken Eggs,Good Eggs,Remarks\n';
      eggCollections.forEach(e => {
        csvContent += `${e.collection_id},${e.collection_date},"${e.batch_name || e.batch_id}",${e.egg_quantity},${e.broken_eggs},${e.good_eggs},"${e.remarks || ''}"\n`;
      });
    } else if (reportSubTab === 'monthly-feed') {
      csvContent += 'Feed ID,Date,Batch,Formula,Quantity (Kg),Cost/Kg (INR),Total Cost (INR),Remarks\n';
      feedConsumptions.forEach(f => {
        csvContent += `${f.feed_id},${f.feed_date},"${f.batch_name || f.batch_id}","${f.feed_type}",${f.quantity_kg},${f.cost_per_kg},${f.total_cost},"${f.remarks || ''}"\n`;
      });
    } else {
      csvContent += 'Financial Metric,Value\n';
      csvContent += `Total Birds,${summary?.totalBirds || 0}\n`;
      csvContent += `Total Good Eggs Harvested,${goodEggsCount}\n`;
      csvContent += `Egg Unit Selling Price,INR 6.00\n`;
      csvContent += `Gross Egg Revenue,INR ${grossRevenue.toFixed(2)}\n`;
      csvContent += `Total Feed Expenses,INR ${totalFeedExpense.toFixed(2)}\n`;
      csvContent += `Net Estimated Profit,INR ${netProfit.toFixed(2)}\n`;
      csvContent += `Profit Margin,${profitMargin}%\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PoultryFarm_${reportSubTab}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Export & Print Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/20">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" /> Farm Financial & Production Reports
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time laying efficiency, egg sales revenue, feed expenses, and printable statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setReportSubTab('financial')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            reportSubTab === 'financial'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Financial Profit & Loss
        </button>
        <button
          onClick={() => setReportSubTab('monthly-eggs')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            reportSubTab === 'monthly-eggs'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Monthly Egg Yield View
        </button>
        <button
          onClick={() => setReportSubTab('monthly-feed')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            reportSubTab === 'monthly-feed'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Monthly Feed Expenses
        </button>
      </div>

      {/* Sub Tab 1: Financial Overview */}
      {reportSubTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Egg Sales</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                ₹{grossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {goodEggsCount.toLocaleString()} Grade-A eggs @ ₹6.00/egg
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Feed Expenses</span>
              <div className="text-2xl font-bold text-rose-400 mt-1">
                ₹{totalFeedExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {summary?.totalFeedKg || 0} kg total feed rationed
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Estimated Profit</span>
              <div className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                ₹{netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Sales Revenue minus Feed Cost
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operating Margin</span>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {profitMargin}%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Net Margin efficiency ratio
              </div>
            </div>
          </div>

          {/* Detailed Financial Statement Table */}
          <div className="glass-card p-5 rounded-2xl border-slate-800/80">
            <h3 className="text-base font-semibold text-white mb-3">Flock Production & Margin Statement</h3>
            <div className="overflow-x-auto min-w-[650px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Batch Name</th>
                    <th className="py-3 px-3">Flock Birds</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Estimated Daily Eggs</th>
                    <th className="py-3 px-3">Est. Daily Revenue (₹)</th>
                    <th className="py-3 px-3">Daily Feed Est. (₹)</th>
                    <th className="py-3 px-3 text-right">Daily Margin (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {batches.map(b => {
                    const estDailyEggs = Math.round(b.bird_count * 0.78);
                    const estRev = estDailyEggs * 6;
                    const estFeedKg = (b.bird_count * 0.12);
                    const estFeedCost = estFeedKg * 35;
                    const estMargin = estRev - estFeedCost;
                    return (
                      <tr key={b.batch_id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-3 font-semibold text-white">{b.batch_name}</td>
                        <td className="py-3 px-3">{b.bird_count.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-amber-400">{estDailyEggs.toLocaleString()}</td>
                        <td className="py-3 px-3 text-emerald-400 font-mono">₹{estRev.toLocaleString()}</td>
                        <td className="py-3 px-3 text-rose-400 font-mono">₹{estFeedCost.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-300 font-mono">
                          +₹{estMargin.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 2: Monthly Egg Breakdown */}
      {reportSubTab === 'monthly-eggs' && (
        <div className="glass-card p-5 rounded-2xl border-slate-800/80">
          <h3 className="text-base font-semibold text-white mb-3">All Monthly Egg Collections</h3>
          <div className="overflow-x-auto min-w-[650px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Egg Count</th>
                  <th className="py-3 px-3">Broken</th>
                  <th className="py-3 px-3">Good Eggs</th>
                  <th className="py-3 px-3">Est. Value (@₹6)</th>
                  <th className="py-3 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {eggCollections.map(e => (
                  <tr key={e.collection_id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{e.collection_date}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{e.batch_name || `Batch #${e.batch_id}`}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">{e.egg_quantity.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-rose-400">{e.broken_eggs}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{e.good_eggs.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-emerald-300 font-mono">₹{(e.good_eggs * 6).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-400">{e.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub Tab 3: Monthly Feed Expenses */}
      {reportSubTab === 'monthly-feed' && (
        <div className="glass-card p-5 rounded-2xl border-slate-800/80">
          <h3 className="text-base font-semibold text-white mb-3">Monthly Feed Ration & Cost Records</h3>
          <div className="overflow-x-auto min-w-[650px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Feed Type</th>
                  <th className="py-3 px-3">Quantity (Kg)</th>
                  <th className="py-3 px-3">Rate/Kg</th>
                  <th className="py-3 px-3">Total Cost (₹)</th>
                  <th className="py-3 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {feedConsumptions.map(f => (
                  <tr key={f.feed_id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{f.feed_date}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{f.batch_name || `Batch #${f.batch_id}`}</td>
                    <td className="py-2.5 px-3 text-slate-300">{f.feed_type}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{f.quantity_kg} kg</td>
                    <td className="py-2.5 px-3 text-slate-400">₹{f.cost_per_kg}</td>
                    <td className="py-2.5 px-3 font-bold text-purple-400">₹{Number(f.total_cost).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-400">{f.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
