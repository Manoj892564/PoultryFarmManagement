import React, { useState } from 'react';
import { EggCollection, Batch } from '../types';
import { Egg, CheckCircle2, AlertCircle, PlusCircle, Trash2, Calendar, Filter } from 'lucide-react';

interface Props {
  eggCollections: EggCollection[];
  batches: Batch[];
  onCreateCollection: (entry: Omit<EggCollection, 'collection_id'>) => Promise<void>;
  onDeleteCollection: (id: number) => Promise<void>;
}

export const EggHarvestView: React.FC<Props> = ({
  eggCollections,
  batches,
  onCreateCollection,
  onDeleteCollection,
}) => {
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [batchId, setBatchId] = useState<number>(batches[0]?.batch_id || 1);
  const [totalEggs, setTotalEggs] = useState<number>(1200);
  const [brokenEggs, setBrokenEggs] = useState<number>(10);
  const [remarks, setRemarks] = useState('');
  const [filterBatch, setFilterBatch] = useState<string>('all');

  // Automatic computation: Good Eggs = Total - Broken
  const goodEggs = Math.max(0, totalEggs - brokenEggs);

  // Compute Today's Summation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntries = eggCollections.filter(e => e.collection_date === todayStr || e.collection_date === collectionDate);

  // Map totals by batch for today
  const batchHarvestMap: { [key: string]: number } = {};
  let totalDailyHarvest = 0;

  todayEntries.forEach(entry => {
    const b = batches.find(b => b.batch_id === entry.batch_id);
    const name = b ? b.batch_name.split(' - ')[0] : `Batch #${entry.batch_id}`;
    batchHarvestMap[name] = (batchHarvestMap[name] || 0) + Number(entry.egg_quantity);
    totalDailyHarvest += Number(entry.egg_quantity);
  });

  const bannerFormula = Object.entries(batchHarvestMap).length > 0
    ? Object.entries(batchHarvestMap).map(([name, qty]) => `${name} (${qty.toLocaleString()})`).join(' + ') + ` = ${totalDailyHarvest.toLocaleString()} eggs`
    : 'No harvests recorded for selected date yet';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId || totalEggs <= 0) return;
    await onCreateCollection({
      collection_date: collectionDate,
      batch_id: Number(batchId),
      egg_quantity: Number(totalEggs),
      broken_eggs: Number(brokenEggs),
      good_eggs: goodEggs,
      remarks
    });
    setRemarks('');
  };

  const filteredLogs = eggCollections.filter(e => {
    if (filterBatch === 'all') return true;
    return e.batch_id === Number(filterBatch);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* High-Visibility Daily Summation Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/30 shadow-lg">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Egg className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Daily Summation Breakdown</span>
            <div className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">
              Today's Total: {bannerFormula}
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400 pl-11">
          Aggregated live across all shed collection stations for date: <strong className="text-slate-300">{collectionDate}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Harvest Logging Form */}
        <div className="glass-card p-5 rounded-2xl border-slate-800/80 h-fit">
          <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
            <PlusCircle className="w-4 h-4 text-emerald-400" /> Log Egg Harvest
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Collection Date</label>
              <input
                type="date"
                required
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Flock Batch</label>
              <select
                value={batchId}
                onChange={(e) => setBatchId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              >
                {batches.map((b) => (
                  <option key={b.batch_id} value={b.batch_id}>
                    {b.batch_name} ({b.bird_count} birds)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Total Harvested</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={totalEggs}
                  onChange={(e) => setTotalEggs(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Broken / Damaged</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={brokenEggs}
                  onChange={(e) => setBrokenEggs(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Auto Computed Good Eggs Box */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Grade-A Good Eggs:
              </span>
              <span className="text-base font-bold text-emerald-300 font-mono">
                {goodEggs.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Remarks / Quality Notes</label>
              <input
                type="text"
                placeholder="e.g. Standard morning collection, good shell hardness"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
            >
              <Egg className="w-4 h-4" /> Save Harvest Record
            </button>
          </form>
        </div>

        {/* Harvest Log Table with Filter */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Harvest Log History</h3>
              <p className="text-xs text-slate-400">Total {filteredLogs.length} collection entries</p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none"
              >
                <option value="all">All Batches</option>
                {batches.map(b => (
                  <option key={b.batch_id} value={b.batch_id}>{b.batch_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto min-w-[650px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Harvested</th>
                  <th className="py-3 px-3">Broken</th>
                  <th className="py-3 px-3">Good</th>
                  <th className="py-3 px-3">Remarks</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredLogs.map(item => (
                  <tr key={item.collection_id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{item.collection_date}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{item.batch_name || `Batch #${item.batch_id}`}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">{item.egg_quantity.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-rose-400">{item.broken_eggs}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{item.good_eggs.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">{item.remarks || '-'}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm('Delete this collection log entry?')) {
                            onDeleteCollection(item.collection_id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
