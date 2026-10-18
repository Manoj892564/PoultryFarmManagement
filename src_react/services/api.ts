import { Batch, EggCollection, FeedConsumption, DashboardSummary, User } from '../types';

const API_BASE = '/api';

// Dual-layer LocalStorage cache keys
const CACHE_KEYS = {
  BATCHES: 'poultry_cached_batches',
  EGGS: 'poultry_cached_eggs',
  FEED: 'poultry_cached_feed',
  USER: 'poultry_active_user',
  SUMMARY: 'poultry_cached_summary',
};

// Initial local seeds if neither API nor local cache is populated
const SEED_BATCHES: Batch[] = [
  { batch_id: 1, batch_name: 'Batch 1 - White Leghorn A', breed: 'Layer', bird_count: 1200, arrival_date: '2026-09-01', status: 'Active' },
  { batch_id: 2, batch_name: 'Batch 2 - Rhode Island Red', breed: 'Layer', bird_count: 1500, arrival_date: '2026-09-10', status: 'Active' },
  { batch_id: 3, batch_name: 'Batch 3 - BV300 Hybrid', breed: 'Layer', bird_count: 1350, arrival_date: '2026-08-20', status: 'Active' },
  { batch_id: 4, batch_name: 'Batch 4 - Lohmann Brown', breed: 'Layer', bird_count: 950, arrival_date: '2026-09-15', status: 'Active' },
];

export const api = {
  // Database status
  async getDbStatus() {
    try {
      const res = await fetch(`${API_BASE}/db-status`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API fallback for db status');
    }
    return { connected: false, status: 'Client Caching Active', host: 'Local Storage' };
  },

  // Auth
  async login(username: string, password: string): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          localStorage.setItem(CACHE_KEYS.USER, JSON.stringify(data.user));
          return data.user;
        }
      }
    } catch (e) {
      console.warn('Backend login unavailable, checking local accounts');
    }

    // Local fallback check
    if (username === 'admin' && password === 'admin123') {
      const u: User = { id: 1, username: 'admin', full_name: 'Administrator Manoj', role: 'ADMIN', email: 'admin@poultryfarm.com' };
      localStorage.setItem(CACHE_KEYS.USER, JSON.stringify(u));
      return u;
    }
    if (username === 'manager' && password === 'manager123') {
      const u: User = { id: 2, username: 'manager', full_name: 'Farm Supervisor Rajesh', role: 'MANAGER', email: 'manager@poultryfarm.com' };
      localStorage.setItem(CACHE_KEYS.USER, JSON.stringify(u));
      return u;
    }
    if (username === 'staff' && password === 'staff123') {
      const u: User = { id: 3, username: 'staff', full_name: 'Egg Collector Kumar', role: 'STAFF', email: 'staff@poultryfarm.com' };
      localStorage.setItem(CACHE_KEYS.USER, JSON.stringify(u));
      return u;
    }

    return null;
  },

  getSavedUser(): User | null {
    const raw = localStorage.getItem(CACHE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(CACHE_KEYS.USER);
  },

  getCachedBatches(): Batch[] {
    try {
      const c = localStorage.getItem(CACHE_KEYS.BATCHES);
      return c ? JSON.parse(c) : [];
    } catch {
      return [];
    }
  },

  getCachedEggCollections(): EggCollection[] {
    try {
      const c = localStorage.getItem(CACHE_KEYS.EGGS);
      return c ? JSON.parse(c) : [];
    } catch {
      return [];
    }
  },

  getCachedFeedConsumptions(): FeedConsumption[] {
    try {
      const c = localStorage.getItem(CACHE_KEYS.FEED);
      return c ? JSON.parse(c) : [];
    } catch {
      return [];
    }
  },

  getCachedSummary(): DashboardSummary | null {
    try {
      const c = localStorage.getItem(CACHE_KEYS.SUMMARY);
      return c ? JSON.parse(c) : null;
    } catch {
      return null;
    }
  },


  // Batches
  async getBatches(): Promise<Batch[]> {
    try {
      const res = await fetch(`${API_BASE}/batches`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(CACHE_KEYS.BATCHES, JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('API error fetching batches, using cache');
    }

    const cached = localStorage.getItem(CACHE_KEYS.BATCHES);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    localStorage.setItem(CACHE_KEYS.BATCHES, JSON.stringify(SEED_BATCHES));
    return SEED_BATCHES;
  },

  async createBatch(batch: Omit<Batch, 'batch_id'>): Promise<Batch> {
    try {
      const res = await fetch(`${API_BASE}/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
      });
      if (res.ok) {
        const created = await res.json();
        const current = await this.getBatches();
        const updated = [...current, created];
        localStorage.setItem(CACHE_KEYS.BATCHES, JSON.stringify(updated));
        return created;
      }
    } catch (e) {
      console.warn('API error creating batch, using local cache');
    }

    const current = await this.getBatches();
    const newId = current.length > 0 ? Math.max(...current.map(b => b.batch_id)) + 1 : 1;
    const newBatch: Batch = { ...batch, batch_id: newId };
    const updated = [...current, newBatch];
    localStorage.setItem(CACHE_KEYS.BATCHES, JSON.stringify(updated));
    return newBatch;
  },

  async addBirds(batchId: number, count: number): Promise<Batch> {
    try {
      const res = await fetch(`${API_BASE}/batches/${batchId}/add-birds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });
      if (res.ok) {
        const updated = await res.json();
        const current = await this.getBatches();
        const list = current.map(b => b.batch_id === batchId ? updated : b);
        localStorage.setItem(CACHE_KEYS.BATCHES, JSON.stringify(list));
        return updated;
      }
    } catch (e) {
      console.warn('API add-birds failed, falling back to local');
    }

    const current = await this.getBatches();
    const batch = current.find(b => b.batch_id === batchId);
    if (batch) {
      batch.bird_count += count;
      localStorage.setItem(CACHE_KEYS.BATCHES, JSON.stringify(current));
      return batch;
    }
    throw new Error('Batch not found');
  },

  async deleteBirds(batchId: number, count: number): Promise<Batch> {
    try {
      const res = await fetch(`${API_BASE}/batches/${batchId}/delete-birds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });
      if (res.ok) {
        const updated = await res.json();
        const current = await this.getBatches();
        const list = current.map(b => b.batch_id === batchId ? updated : b);
        localStorage.setItem(CACHE_KEYS.BATCHES, JSON.stringify(list));
        return updated;
      }
    } catch (e) {
      console.warn('API delete-birds failed, falling back to local');
    }

    const current = await this.getBatches();
    const batch = current.find(b => b.batch_id === batchId);
    if (batch) {
      batch.bird_count = Math.max(0, batch.bird_count - count);
      localStorage.setItem(CACHE_KEYS.BATCHES, JSON.stringify(current));
      return batch;
    }
    throw new Error('Batch not found');
  },

  async updateBatch(batchId: number, batch: Partial<Batch>): Promise<Batch> {
    try {
      const res = await fetch(`${API_BASE}/batches/${batchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
      });
      if (res.ok) {
        const updated = await res.json();
        const current = await this.getBatches();
        const list = current.map(b => b.batch_id === batchId ? updated : b);
        localStorage.setItem(CACHE_KEYS.BATCHES, JSON.stringify(list));
        return updated;
      }
    } catch (e) {}

    const current = await this.getBatches();
    const index = current.findIndex(b => b.batch_id === batchId);
    if (index !== -1) {
      current[index] = { ...current[index], ...batch };
      localStorage.setItem(CACHE_KEYS.BATCHES, JSON.stringify(current));
      return current[index];
    }
    throw new Error('Batch not found');
  },

  async deleteBatch(batchId: number): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/batches/${batchId}`, { method: 'DELETE' });
    } catch (e) {}

    const current = await this.getBatches();
    const filtered = current.filter(b => b.batch_id !== batchId);
    localStorage.setItem(CACHE_KEYS.BATCHES, JSON.stringify(filtered));

    // Also remove associated egg collections and feed records locally
    const eggs = this.getCachedEggCollections().filter(e => e.batch_id !== batchId);
    localStorage.setItem(CACHE_KEYS.EGGS, JSON.stringify(eggs));
    const feed = this.getCachedFeedConsumptions().filter(f => f.batch_id !== batchId);
    localStorage.setItem(CACHE_KEYS.FEED, JSON.stringify(feed));

    return true;
  },

  // Egg Collections
  async getEggCollections(): Promise<EggCollection[]> {
    try {
      const res = await fetch(`${API_BASE}/egg-collections`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem(CACHE_KEYS.EGGS, JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {}

    const cached = localStorage.getItem(CACHE_KEYS.EGGS);
    return cached ? JSON.parse(cached) : [];
  },

  async createEggCollection(entry: Omit<EggCollection, 'collection_id'>): Promise<EggCollection> {
    try {
      const res = await fetch(`${API_BASE}/egg-collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        const created = await res.json();
        const current = await this.getEggCollections();
        const updated = [created, ...current];
        localStorage.setItem(CACHE_KEYS.EGGS, JSON.stringify(updated));
        return created;
      }
    } catch (e) {}

    const current = await this.getEggCollections();
    const newId = current.length > 0 ? Math.max(...current.map(e => e.collection_id)) + 1 : 1;
    const item: EggCollection = { ...entry, collection_id: newId };
    const updated = [item, ...current];
    localStorage.setItem(CACHE_KEYS.EGGS, JSON.stringify(updated));
    return item;
  },

  async deleteEggCollection(id: number): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/egg-collections/${id}`, { method: 'DELETE' });
    } catch (e) {}
    const current = await this.getEggCollections();
    const filtered = current.filter(e => e.collection_id !== id);
    localStorage.setItem(CACHE_KEYS.EGGS, JSON.stringify(filtered));
    return true;
  },

  // Feed Consumptions
  async getFeedConsumptions(): Promise<FeedConsumption[]> {
    try {
      const res = await fetch(`${API_BASE}/feed-consumptions`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem(CACHE_KEYS.FEED, JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {}

    const cached = localStorage.getItem(CACHE_KEYS.FEED);
    return cached ? JSON.parse(cached) : [];
  },

  async createFeedConsumption(entry: Omit<FeedConsumption, 'feed_id'>): Promise<FeedConsumption> {
    try {
      const res = await fetch(`${API_BASE}/feed-consumptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        const created = await res.json();
        const current = await this.getFeedConsumptions();
        const updated = [created, ...current];
        localStorage.setItem(CACHE_KEYS.FEED, JSON.stringify(updated));
        return created;
      }
    } catch (e) {}

    const current = await this.getFeedConsumptions();
    const newId = current.length > 0 ? Math.max(...current.map(f => f.feed_id)) + 1 : 1;
    const item: FeedConsumption = { ...entry, feed_id: newId };
    const updated = [item, ...current];
    localStorage.setItem(CACHE_KEYS.FEED, JSON.stringify(updated));
    return item;
  },

  async deleteFeedConsumption(id: number): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/feed-consumptions/${id}`, { method: 'DELETE' });
    } catch (e) {}
    const current = await this.getFeedConsumptions();
    const filtered = current.filter(f => f.feed_id !== id);
    localStorage.setItem(CACHE_KEYS.FEED, JSON.stringify(filtered));
    return true;
  },

  // Dashboard summary
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const res = await fetch(`${API_BASE}/dashboard-summary`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(CACHE_KEYS.SUMMARY, JSON.stringify(data));
        return data;
      }
    } catch (e) {}

    const batches = await this.getBatches();
    const eggs = await this.getEggCollections();
    const feed = await this.getFeedConsumptions();

    const totalBirds = batches.reduce((acc, b) => acc + (b.status === 'Active' ? Number(b.bird_count) : 0), 0);
    const activeBatchesCount = batches.filter(b => b.status === 'Active').length;
    const totalEggs = eggs.reduce((acc, e) => acc + Number(e.egg_quantity), 0);
    const goodEggs = eggs.reduce((acc, e) => acc + Number(e.good_eggs), 0);
    const brokenEggs = eggs.reduce((acc, e) => acc + Number(e.broken_eggs), 0);
    const totalFeedKg = feed.reduce((acc, f) => acc + Number(f.quantity_kg), 0);
    const totalFeedCost = feed.reduce((acc, f) => acc + Number(f.total_cost), 0);

    return {
      totalBirds,
      activeBatchesCount,
      totalEggs,
      goodEggs,
      brokenEggs,
      brokenRate: totalEggs > 0 ? ((brokenEggs / totalEggs) * 100).toFixed(1) : '0.0',
      layingRate: totalBirds > 0 ? (((totalEggs / 7) / totalBirds) * 100).toFixed(1) : '0.0',
      totalFeedKg: totalFeedKg.toFixed(1),
      totalFeedCost: totalFeedCost.toFixed(2),
      batchesCount: batches.length,
      estimatedRevenue: (goodEggs * 6).toFixed(2),
      netProfit: ((goodEggs * 6) - totalFeedCost).toFixed(2)
    };
  }
};
