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
      if (b.length > 0) setAddBirdsBatchId(b[0].batch_id);
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
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'batches' && (
            <BatchesView
              batches={batches}
              onAddBirds={handleAddBirds}
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
            <h4 className="text-base font-bold text-white mb-1">Add Birds to Flock</h4>
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
                      {b.batch_name} (Current: {b.bird_count} birds)
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

    </div>
  );
};
export default App;
