import React, { useState } from 'react';
import { FeedConsumption, Batch } from '../types';
import { Wheat, IndianRupee, PlusCircle, Trash2, Scale, Calculator } from 'lucide-react';

interface Props {
  feedConsumptions: FeedConsumption[];
  batches: Batch[];
  onCreateFeed: (entry: Omit<FeedConsumption, 'feed_id'>) => Promise<void>;
  onDeleteFeed: (id: number) => Promise<void>;
}

export const FeedView: React.FC<Props> = ({
  feedConsumptions,
  batches,
  onCreateFeed,
  onDeleteFeed,
}) => {
  const [feedDate, setFeedDate] = useState(new Date().toISOString().split('T')[0]);
  const [batchId, setBatchId] = useState<number>(batches[0]?.batch_id || 1);
  const [feedType, setFeedType] = useState('Layer Mash Phase-1 (17% Crude Protein)');
  const [quantityKg, setQuantityKg] = useState<number>(150);
  const [costPerKg, setCostPerKg] = useState<number>(35.00);
  const [remarks, setRemarks] = useState('');

  // Auto calculated Total Cost
  const totalCost = Number((quantityKg * costPerKg).toFixed(2));

  // Summary Metrics
  const totalFeedDistributedKg = feedConsumptions.reduce((acc, f) => acc + Number(f.quantity_kg), 0);
  const totalFeedExpense = feedConsumptions.reduce((acc, f) => acc + Number(f.total_cost), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId || quantityKg <= 0) return;
    await onCreateFeed({
      feed_date: feedDate,
      batch_id: Number(batchId),
      feed_type: feedType,
      quantity_kg: Number(quantityKg),
      cost_per_kg: Number(costPerKg),
      total_cost: totalCost,
      remarks
    });
    setRemarks('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 2 Feed Summary Cards at top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-2xl border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Feed Distributed</span>
            <div className="text-2xl font-bold text-white mt-1">
              {totalFeedDistributedKg.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span>
            </div>
            <div className="text-xs text-emerald-400 mt-1">All batches lifetime aggregate</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Feed Expenditure</span>
            <div className="text-2xl font-bold text-white mt-1">
              ₹{totalFeedExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-purple-400 mt-1">Calculated at live formula prices</div>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed Rationing Form */}
        <div className="glass-card p-5 rounded-2xl border-slate-800/80 h-fit">
          <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
            <PlusCircle className="w-4 h-4 text-emerald-400" /> Log Daily Feed Ration
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Ration Date</label>
              <input
                type="date"
                required
                value={feedDate}
                onChange={(e) => setFeedDate(e.target.value)}
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

            <div>
              <label className="block text-slate-300 font-medium mb-1">Feed Formula / Ration Type</label>
              <select
                value={feedType}
                onChange={(e) => setFeedType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Layer Mash Phase-1 (17% Crude Protein)">Layer Mash Phase-1 (17% Crude Protein)</option>
                <option value="Layer Mash Phase-2 (Maintenance)">Layer Mash Phase-2 (Maintenance)</option>
                <option value="Grower Pellets (Development)">Grower Pellets (Development)</option>
                <option value="Starter Crumbs (Chicks)">Starter Crumbs (Chicks)</option>
                <option value="Calcium Shell Grit (Eggshell Fortification)">Calcium Shell Grit (Eggshell Fortification)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Quantity (Kg)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Cost / Kg (₹)</label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={costPerKg}
                  onChange={(e) => setCostPerKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Auto Computed Total Cost */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-purple-400" /> Computed Total Cost:
              </span>
              <span className="text-base font-bold text-purple-300 font-mono">
                ₹{totalCost.toFixed(2)}
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Remarks / Formula Batch No.</label>
              <input
                type="text"
                placeholder="e.g. Added 2% mineral premix"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <Wheat className="w-4 h-4" /> Save Feed Consumption Log
            </button>
          </form>
        </div>

        {/* Feed History Table */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Daily Feed Consumption History</h3>
              <p className="text-xs text-slate-400">Total {feedConsumptions.length} rationing events recorded</p>
            </div>
          </div>

          <div className="overflow-x-auto min-w-[650px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Formula</th>
                  <th className="py-3 px-3">Quantity</th>
                  <th className="py-3 px-3">Cost/Kg</th>
                  <th className="py-3 px-3">Total (₹)</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {feedConsumptions.map(item => (
                  <tr key={item.feed_id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{item.feed_date}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{item.batch_name || `Batch #${item.batch_id}`}</td>
                    <td className="py-2.5 px-3 text-slate-300 truncate max-w-[150px]">{item.feed_type}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{item.quantity_kg} kg</td>
                    <td className="py-2.5 px-3 text-slate-400">₹{item.cost_per_kg}</td>
                    <td className="py-2.5 px-3 font-bold text-purple-400">₹{Number(item.total_cost).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm('Delete this feed consumption entry?')) {
                            onDeleteFeed(item.feed_id);
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
