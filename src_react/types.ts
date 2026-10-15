export interface User {
  id: number;
  uid?: string;
  username: string;
  full_name: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  email?: string;
}

export interface Batch {
  batch_id: number;
  batch_name: string;
  breed: string;
  bird_count: number;
  arrival_date: string;
  status: 'Active' | 'Sold' | 'Culled' | 'Quarantine';
  created_at?: string;
}

export interface EggCollection {
  collection_id: number;
  collection_date: string;
  batch_id: number;
  batch_name?: string;
  egg_quantity: number;
  broken_eggs: number;
  good_eggs: number;
  remarks?: string;
  created_at?: string;
}

export interface FeedConsumption {
  feed_id: number;
  feed_date: string;
  batch_id: number;
  batch_name?: string;
  feed_type: string;
  quantity_kg: number;
  cost_per_kg: number;
  total_cost: number;
  remarks?: string;
  created_at?: string;
}

export interface DashboardSummary {
  totalBirds: number;
  activeBatchesCount: number;
  totalEggs: number;
  goodEggs: number;
  brokenEggs: number;
  brokenRate: string;
  layingRate: string;
  totalFeedKg: string;
  totalFeedCost: string;
  batchesCount: number;
  estimatedRevenue: string;
  netProfit: string;
}
