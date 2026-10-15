import React, { useState } from 'react';
import { Batch } from '../types';
import { 
  Plus, 
  Layers, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Calendar, 
  PlusCircle, 
  X,
  Check
} from 'lucide-react';

interface Props {
  batches: Batch[];
  onAddBirds: (batchId: number, count: number) => Promise<void>;
  onCreateBatch: (batch: Omit<Batch, 'batch_id'>) => Promise<void>;
  onUpdateBatch: (batchId: number, batch: Partial<Batch>) => Promise<void>;
  onDeleteBatch: (batchId: number) => Promise<void>;
}

export const BatchesView: React.FC<Props> = ({
  batches,
  onAddBirds,
  onCreateBatch,
  onUpdateBatch,
  onDeleteBatch
}) => {
  // Inflow bar state
  const [inflowBatchId, setInflowBatchId] = useState<number>(batches[0]?.batch_id || 1);
  const [inflowCount, setInflowCount] = useState<number>(500);
  const [inflowSuccess, setInflowSuccess] = useState(false);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editBatch, setEditBatch] = useState<Batch | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formBreed, setFormBreed] = useState('Layer (White Leghorn)');
  const [formCount, setFormCount] = useState(1000);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStatus, setFormStatus] = useState<'Active' | 'Sold' | 'Culled' | 'Quarantine'>('Active');

  // Inline quick add modal
  const [quickAddTarget, setQuickAddTarget] = useState<Batch | null>(null);
  const [quickAddCount, setQuickAddCount] = useState<number>(100);

  // Dynamic Age in Weeks calculation
  const calculateAgeInWeeks = (arrivalDate: string) => {
    const arrival = new Date(arrivalDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - arrival.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} weeks`;
  };

  const handleInflowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inflowBatchId || inflowCount <= 0) return;
    await onAddBirds(inflowBatchId, inflowCount);
    setInflowSuccess(true);
    setTimeout(() => setInflowSuccess(false), 2500);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editBatch) {
      await onUpdateBatch(editBatch.batch_id, {
        batch_name: formName,
        breed: formBreed,
        bird_count: Number(formCount),
        arrival_date: formDate,
        status: formStatus
      });
      setEditBatch(null);
    } else {
      await onCreateBatch({
        batch_name: formName,
        breed: formBreed,
        bird_count: Number(formCount),
        arrival_date: formDate,
        status: formStatus
      });
    }

    setFormName('');
    setIsCreateOpen(false);
  };

  const openEdit = (b: Batch) => {
    setEditBatch(b);
    setFormName(b.batch_name);
    setFormBreed(b.breed);
    setFormCount(b.bird_count);
    setFormDate(b.arrival_date);
    setFormStatus(b.status);
    setIsCreateOpen(true);
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddTarget || quickAddCount <= 0) return;
    await onAddBirds(quickAddTarget.batch_id, quickAddCount);
    setQuickAddTarget(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Inflow Bar: Dedicated slot at the top */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Flock Inflow Bar <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Fast Inflow</span>
              </div>
              <p className="text-xs text-slate-400">Add newly arrived birds directly into an active flock in one click.</p>
            </div>
          </div>

          <form onSubmit={handleInflowSubmit} className="flex items-center gap-2 flex-wrap">
            <select
              value={inflowBatchId}
              onChange={(e) => setInflowBatchId(Number(e.target.value))}
              className="px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            >
              {batches.map((b) => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.batch_name} ({b.bird_count} birds)
                </option>
              ))}
            </select>

            <div className="relative">
              <input
                type="number"
                min="1"
                value={inflowCount}
                onChange={(e) => setInflowCount(Number(e.target.value))}
                className="w-28 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 pl-7"
                placeholder="Count"
              />
              <span className="absolute left-2.5 top-2 text-xs text-slate-400">+</span>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5"
            >
              {inflowSuccess ? <Check className="w-4 h-4 text-emerald-200" /> : <PlusCircle className="w-4 h-4" />}
              <span>{inflowSuccess ? 'Added Successfully!' : 'Apply Inflow'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main Flocks Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> Flock Batches Directory
          </h2>
          <p className="text-xs text-slate-400">Total {batches.length} registered flock units</p>
        </div>
        <button
          onClick={() => {
            setEditBatch(null);
            setFormName('');
            setFormCount(1000);
            setFormDate(new Date().toISOString().split('T')[0]);
            setFormStatus('Active');
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Batch</span>
        </button>
      </div>

      {/* Flocks Table (with horizontal scroll container for mobile) */}
      <div className="glass-card rounded-2xl border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto min-w-[700px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Batch ID</th>
                <th className="py-3.5 px-4">Batch Name</th>
                <th className="py-3.5 px-4">Breed</th>
                <th className="py-3.5 px-4">Bird Count</th>
                <th className="py-3.5 px-4">Age in Weeks</th>
                <th className="py-3.5 px-4">Arrival Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {batches.map((b) => (
                <tr key={b.batch_id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-400">#{b.batch_id}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{b.batch_name}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                      {b.breed}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white text-sm">{b.bird_count.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 ml-1">birds</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-emerald-400">
                    {calculateAgeInWeeks(b.arrival_date)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {b.arrival_date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      b.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : b.status === 'Quarantine'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {/* Inline + Add button */}
                    <button
                      onClick={() => setQuickAddTarget(b)}
                      className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium transition"
                      title="Add birds to this batch"
                    >
                      + Add
                    </button>
                    {/* Edit */}
                    <button
                      onClick={() => openEdit(b)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                      title="Edit Batch"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${b.batch_name}?`)) {
                          onDeleteBatch(b.batch_id);
                        }
                      }}
                      className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                      title="Delete Batch"
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

      {/* Create / Edit Batch Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-semibold text-white">
                {editBatch ? 'Edit Flock Batch' : 'Create New Flock Batch'}
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Batch Name / Code</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Batch 5 - White Leghorn B"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Breed Category</label>
                <select
                  value={formBreed}
                  onChange={(e) => setFormBreed(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Layer (White Leghorn)">Layer (White Leghorn)</option>
                  <option value="Layer (Rhode Island Red)">Layer (Rhode Island Red)</option>
                  <option value="Hybrid (BV300 Commercial Layer)">Hybrid (BV300 Commercial Layer)</option>
                  <option value="Layer (Lohmann Brown)">Layer (Lohmann Brown)</option>
                  <option value="Broiler (Cobb 500)">Broiler (Cobb 500)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initial Bird Population</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formCount}
                    onChange={(e) => setFormCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Quarantine">Quarantine</option>
                    <option value="Sold">Sold</option>
                    <option value="Culled">Culled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Arrival Date</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                >
                  {editBatch ? 'Save Changes' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inline Quick Add Birds Modal */}
      {quickAddTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <h4 className="text-sm font-semibold text-white">Add Birds to Flock</h4>
              <button onClick={() => setQuickAddTarget(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Adding new stock to <strong className="text-emerald-400">{quickAddTarget.batch_name}</strong> (currently {quickAddTarget.bird_count} birds).
            </p>
            <form onSubmit={handleQuickAdd} className="space-y-3">
              <input
                type="number"
                min="1"
                required
                value={quickAddCount}
                onChange={(e) => setQuickAddCount(Number(e.target.value))}
                placeholder="Number of birds"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickAddTarget(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold"
                >
                  Confirm Addition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
