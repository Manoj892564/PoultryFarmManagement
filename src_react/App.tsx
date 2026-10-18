import React, { useState, useEffect } from 'react';
import { User, Batch, EggCollection, FeedConsumption, DashboardSummary } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BatchesView } from './components/BatchesView';
import { EggHarvestView } from './components/EggHarvestView';
import { FeedView } from './components/FeedView';
import { ReportsView } from './components/ReportsView';
import { LoginView } from './components/LoginView';
import { MinusCircle, PlusCircle, Trash2, AlertTriangle, X } from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(api.getSavedUser());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data States - Hydrated instantly from cache to eliminate refresh delay
  const [batches, setBatches] = useState<Batch[]>(() => api.getCachedBatches());
  const [eggCollections, setEggCollections] = useState<EggCollection[]>(() => api.getCachedEggCollections());
  const [feedConsumptions, setFeedConsumptions] = useState<FeedConsumption[]>(() => api.getCachedFeedConsumptions());
  const [summary, setSummary] = useState<DashboardSummary | null>(() => api.getCachedSummary());
  const [loading, setLoading] = useState(false);

  // Global Add Birds Modal
  const [isAddBirdsOpen, setIsAddBirdsOpen] = useState(false);
  const [addBirdsBatchId, setAddBirdsBatchId] = useState<number>(1);
  const [addBirdsCount, setAddBirdsCount] = useState<number>(100);

  // Global Delete Birds Modal
  const [isDeleteBirdsOpen, setIsDeleteBirdsOpen] = useState(false);
  const [deleteBirdsBatchId, setDeleteBirdsBatchId] = useState<number>(1);
  const [deleteBirdsCount, setDeleteBirdsCount] = useState<number>(100);
  const [deleteReason, setDeleteReason] = useState<string>('Data Entry Correction');

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [b, e, f, s] = await Promise.all([
        api.getBatches(),
        api.getEggCollections(),
        api.getFeedConsumptions(),
        api.getDashboardSummary()
      ]);
      setBatches(b);
      setEggCollections(e);
      setFeedConsumptions(f);
      setSummary(s);
      if (b.length > 0) {
        setAddBirdsBatchId(b[0].batch_id);
        setDeleteBirdsBatchId(b[0].batch_id);
      }
    } catch (err) {
      console.error('Error loading farm data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  const handleAddBirds = async (batchId: number, count: number) => {
    await api.addBirds(batchId, count);
    await loadAllData();
  };

  const handleDeleteBirds = async (batchId: number, count: number) => {
    await api.deleteBirds(batchId, count);
    await loadAllData();
  };

  const handleCreateBatch = async (batch: Omit<Batch, 'batch_id'>) => {
    await api.createBatch(batch);
    await loadAllData();
  };

  const handleUpdateBatch = async (batchId: number, batch: Partial<Batch>) => {
    await api.updateBatch(batchId, batch);
    await loadAllData();
  };

  const handleDeleteBatch = async (batchId: number) => {
    await api.deleteBatch(batchId);
    await loadAllData();
  };

  const handleCreateEggCollection = async (entry: Omit<EggCollection, 'collection_id'>) => {
    await api.createEggCollection(entry);
    await loadAllData();
  };

  const handleDeleteEggCollection = async (id: number) => {
    await api.deleteEggCollection(id);
    await loadAllData();
  };

  const handleCreateFeed = async (entry: Omit<FeedConsumption, 'feed_id'>) => {
    await api.createFeedConsumption(entry);
    await loadAllData();
  };

  const handleDeleteFeed = async (id: number) => {
    await api.deleteFeedConsumption(id);
    await loadAllData();
  };

  const handleQuickAddBirdsModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addBirdsBatchId || addBirdsCount <= 0) return;
    await handleAddBirds(addBirdsBatchId, addBirdsCount);
    setIsAddBirdsOpen(false);
  };

  const handleQuickDeleteBirdsModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteBirdsBatchId || deleteBirdsCount <= 0) return;
    await handleDeleteBirds(deleteBirdsBatchId, deleteBirdsCount);
    setIsDeleteBirdsOpen(false);
  };

  const openDeleteBirdsModal = (batchId?: number) => {
    if (batchId) {
      setDeleteBirdsBatchId(batchId);
      const target = batches.find(b => b.batch_id === batchId);
      if (target) {
        setDeleteBirdsCount(Math.min(100, target.bird_count));
      }
    } else if (batches.length > 0) {
      setDeleteBirdsBatchId(batches[0].batch_id);
      setDeleteBirdsCount(Math.min(100, batches[0].bird_count));
    }
    setIsDeleteBirdsOpen(true);
  };

  const selectedDeleteBatch = batches.find(b => b.batch_id === deleteBirdsBatchId);

  if (!user) {
    return <LoginView onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans pb-16 lg:pb-0">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onToggleMobileMenu={() => setMobileMenuOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Desktop Sidebar + Mobile Bottom Nav */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(t) => setActiveTab(t)}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
          user={user}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              summary={summary}
              batches={batches}
              recentEggs={eggCollections}
              onOpenAddBirdsModal={() => setIsAddBirdsOpen(true)}
              onOpenDeleteBirdsModal={openDeleteBirdsModal}
              onDeleteBatch={handleDeleteBatch}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'batches' && (
            <BatchesView
              batches={batches}
              onAddBirds={handleAddBirds}
              onDeleteBirds={handleDeleteBirds}
              onCreateBatch={handleCreateBatch}
              onUpdateBatch={handleUpdateBatch}
              onDeleteBatch={handleDeleteBatch}
            />
          )}

          {activeTab === 'eggs' && (
            <EggHarvestView
              eggCollections={eggCollections}
              batches={batches}
              onCreateCollection={handleCreateEggCollection}
              onDeleteCollection={handleDeleteEggCollection}
            />
          )}

          {activeTab === 'feed' && (
            <FeedView
              feedConsumptions={feedConsumptions}
              batches={batches}
              onCreateFeed={handleCreateFeed}
              onDeleteFeed={handleDeleteFeed}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              summary={summary}
              batches={batches}
              eggCollections={eggCollections}
              feedConsumptions={feedConsumptions}
            />
          )}
        </main>
      </div>

      {/* Global Add Birds Modal */}
      {isAddBirdsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Add Birds to Flock</h4>
              </div>
              <button onClick={() => setIsAddBirdsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">Increase live bird count for flock harvest tracking.</p>
            
            <form onSubmit={handleQuickAddBirdsModalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Flock Batch</label>
                <select
                  value={addBirdsBatchId}
                  onChange={(e) => setAddBirdsBatchId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  {batches.map(b => (
                    <option key={b.batch_id} value={b.batch_id}>
                      {b.batch_name} (Current: {b.bird_count.toLocaleString()} birds)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Number of Birds to Add</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={addBirdsCount}
                  onChange={(e) => setAddBirdsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBirdsOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                >
                  Add Birds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Delete Birds Modal */}
      {isDeleteBirdsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <MinusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Bird Deletion / Reduction</h4>
                  <p className="text-[11px] text-slate-400">Deduct or remove birds from flock population</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDeleteBirdsOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickDeleteBirdsModalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Select Flock Batch</label>
                <select
                  value={deleteBirdsBatchId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setDeleteBirdsBatchId(id);
                    const b = batches.find(item => item.batch_id === id);
                    if (b) setDeleteBirdsCount(Math.min(deleteBirdsCount || 100, b.bird_count));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500 text-xs"
                >
                  {batches.map(b => (
                    <option key={b.batch_id} value={b.batch_id}>
                      {b.batch_name} — {b.bird_count.toLocaleString()} live birds
                    </option>
                  ))}
                </select>
                {selectedDeleteBatch && (
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span>Current live population:</span>
                    <strong className="text-emerald-400 font-mono">{selectedDeleteBatch.bird_count.toLocaleString()} birds</strong>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Deletion Reason / Outflow Type</label>
                <select
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500 text-xs"
                >
                  <option value="Data Entry Correction">Data Entry Correction (Fix wrong counts)</option>
                  <option value="Mortality / Disease Loss">Mortality / Disease Loss</option>
                  <option value="Culling / Slaughter">Culling / Slaughter</option>
                  <option value="Commercial Sale">Commercial Flock Sale</option>
                  <option value="Other Reduction">Other Reduction</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-medium">Number of Birds to Delete</label>
                  {selectedDeleteBatch && selectedDeleteBatch.bird_count > 0 && (
                    <button
                      type="button"
                      onClick={() => setDeleteBirdsCount(selectedDeleteBatch.bird_count)}
                      className="text-[10px] text-rose-400 hover:text-rose-300 underline font-medium"
                    >
                      Delete All ({selectedDeleteBatch.bird_count.toLocaleString()})
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  min="1"
                  max={selectedDeleteBatch ? selectedDeleteBatch.bird_count : 9999999}
                  required
                  value={deleteBirdsCount}
                  onChange={(e) => setDeleteBirdsCount(Number(e.target.value))}
                  placeholder="Enter bird count to delete"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500 text-sm font-semibold"
                />

                {/* Quick Selection Chips */}
                {selectedDeleteBatch && selectedDeleteBatch.bird_count > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] text-slate-500">Quick:</span>
                    {[50, 100, 500, 1000].filter(n => n <= selectedDeleteBatch.bird_count).map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setDeleteBirdsCount(n)}
                        className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono transition ${
                          deleteBirdsCount === n 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold' 
                            : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        -{n.toLocaleString()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Count Preview */}
              {selectedDeleteBatch && (
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Population after deletion:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {Math.max(0, selectedDeleteBatch.bird_count - deleteBirdsCount).toLocaleString()}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">birds</span>
                  </span>
                </div>
              )}

              {/* Option to Delete Whole Batch */}
              {selectedDeleteBatch && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Need to remove the entire batch?</span>
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Are you sure you want to completely delete batch "${selectedDeleteBatch.batch_name}" and all its logs?`)) {
                        setIsDeleteBirdsOpen(false);
                        await handleDeleteBatch(selectedDeleteBatch.batch_id);
                      }
                    }}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Entire Batch</span>
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteBirdsOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold shadow-lg shadow-rose-600/30 transition flex items-center gap-1.5"
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>Confirm Bird Deletion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default App;
