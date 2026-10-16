import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// In-memory fallback store
const memoryStore = {
  batches: [
    { batch_id: 1, batch_name: 'Batch 1 - White Leghorn A', breed: 'Layer', bird_count: 1200, arrival_date: '2026-09-01', status: 'Active', created_at: new Date() },
    { batch_id: 2, batch_name: 'Batch 2 - Rhode Island Red', breed: 'Layer', bird_count: 1500, arrival_date: '2026-09-10', status: 'Active', created_at: new Date() },
    { batch_id: 3, batch_name: 'Batch 3 - BV300 Hybrid', breed: 'Layer', bird_count: 1350, arrival_date: '2026-08-20', status: 'Active', created_at: new Date() },
    { batch_id: 4, batch_name: 'Batch 4 - Lohmann Brown', breed: 'Layer', bird_count: 950, arrival_date: '2026-09-15', status: 'Active', created_at: new Date() }
  ],
  eggCollections: [
    { collection_id: 1, collection_date: '2026-10-14', batch_id: 1, egg_quantity: 1120, broken_eggs: 10, good_eggs: 1110, remarks: 'Morning harvest', created_at: new Date() },
    { collection_id: 2, collection_date: '2026-10-14', batch_id: 2, egg_quantity: 1420, broken_eggs: 12, good_eggs: 1408, remarks: 'Good shell quality', created_at: new Date() },
    { collection_id: 3, collection_date: '2026-10-15', batch_id: 1, egg_quantity: 1145, broken_eggs: 8, good_eggs: 1137, remarks: 'Regular harvest', created_at: new Date() },
    { collection_id: 4, collection_date: '2026-10-15', batch_id: 2, egg_quantity: 1450, broken_eggs: 15, good_eggs: 1435, remarks: 'Peak yield', created_at: new Date() },
    { collection_id: 5, collection_date: '2026-10-15', batch_id: 3, egg_quantity: 1280, broken_eggs: 11, good_eggs: 1269, remarks: 'Normal', created_at: new Date() }
  ],
  feedConsumptions: [
    { feed_id: 1, feed_date: '2026-10-14', batch_id: 1, feed_type: 'Layer Mash Phase-1', quantity_kg: 150, cost_per_kg: 35.00, total_cost: 5250.00, remarks: 'Morning standard feed', created_at: new Date() },
    { feed_id: 2, feed_date: '2026-10-14', batch_id: 2, feed_type: 'Layer Mash Phase-1', quantity_kg: 185, cost_per_kg: 35.00, total_cost: 6475.00, remarks: 'Added calcium supplement', created_at: new Date() },
    { feed_id: 3, feed_date: '2026-10-15', batch_id: 1, feed_type: 'Layer Mash Phase-1', quantity_kg: 155, cost_per_kg: 35.00, total_cost: 5425.00, remarks: 'Morning ration', created_at: new Date() },
    { feed_id: 4, feed_date: '2026-10-15', batch_id: 2, feed_type: 'Layer Mash Phase-1', quantity_kg: 190, cost_per_kg: 35.00, total_cost: 6650.00, remarks: 'Standard feed', created_at: new Date() }
  ],
  users: [
    { id: 1, uid: 'admin-001', username: 'admin', password: 'admin123', full_name: 'Administrator Manoj', role: 'ADMIN', email: 'admin@poultryfarm.com' },
    { id: 2, uid: 'mgr-001', username: 'manager', password: 'manager123', full_name: 'Farm Supervisor Rajesh', role: 'MANAGER', email: 'manager@poultryfarm.com' },
    { id: 3, uid: 'stf-001', username: 'staff', password: 'staff123', full_name: 'Flock Attendant Kumar', role: 'STAFF', email: 'staff@poultryfarm.com' }
  ]
};

// PostgreSQL Supabase Connection
let connectionString = process.env.DATABASE_URL || 'postgresql://postgres.dwplfixdzaubssqgdbbw:Manojselvaraj%40123412@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';
if (connectionString.includes('?sslmode=')) {
  connectionString = connectionString.split('?')[0];
}

let pool: pg.Pool | null = null;
try {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    max: 3,
  });
  pool.on('error', (err) => {
    console.warn('Postgres client error on pool:', err.message);
  });
} catch (e: any) {
  console.warn('Failed to construct pg pool:', e.message);
}

let isDbConnected = false;
let dbInitDone = false;

async function initDb() {
  if (dbInitDone || !pool) return;
  dbInitDone = true;
  try {
    const client = await pool.connect();
    isDbConnected = true;

    // Schema setup
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid TEXT UNIQUE,
        email TEXT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'STAFF',
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS batches (
        batch_id SERIAL PRIMARY KEY,
        batch_name VARCHAR(100) NOT NULL,
        breed VARCHAR(50) NOT NULL,
        bird_count INT NOT NULL CHECK (bird_count >= 0),
        arrival_date DATE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS egg_collections (
        collection_id SERIAL PRIMARY KEY,
        collection_date DATE NOT NULL,
        batch_id INT NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
        egg_quantity INT NOT NULL CHECK (egg_quantity >= 0),
        broken_eggs INT NOT NULL DEFAULT 0 CHECK (broken_eggs >= 0),
        good_eggs INT NOT NULL CHECK (good_eggs >= 0),
        remarks VARCHAR(255),
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS feed_consumptions (
        feed_id SERIAL PRIMARY KEY,
        feed_date DATE NOT NULL,
        batch_id INT NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
        feed_type VARCHAR(100) NOT NULL,
        quantity_kg NUMERIC(10,2) NOT NULL CHECK (quantity_kg >= 0),
        cost_per_kg NUMERIC(10,2) NOT NULL DEFAULT 35.00 CHECK (cost_per_kg >= 0),
        total_cost NUMERIC(12,2) NOT NULL CHECK (total_cost >= 0),
        remarks VARCHAR(255),
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Sync serial sequences
    try {
      await client.query(`
        SELECT setval(pg_get_serial_sequence('batches', 'batch_id'), COALESCE(MAX(batch_id), 1)) FROM batches;
        SELECT setval(pg_get_serial_sequence('egg_collections', 'collection_id'), COALESCE(MAX(collection_id), 1)) FROM egg_collections;
        SELECT setval(pg_get_serial_sequence('feed_consumptions', 'feed_id'), COALESCE(MAX(feed_id), 1)) FROM feed_consumptions;
      `);
    } catch {}

    client.release();
    isDbConnected = true;
    console.log('PostgreSQL database fully connected and active.');
  } catch (err: any) {
    isDbConnected = false;
    console.warn('DB initialization error (fallback active):', err.message);
  }
}

// Router containing all API endpoints
const router = express.Router();

// 1. Health Status
router.get('/db-status', async (req, res) => {
  if (!dbInitDone) await initDb();
  return res.json({
    ok: isDbConnected,
    mode: isDbConnected ? 'production' : 'fallback'
  });
});

// 2. Authentication
router.post('/auth/login', async (req, res) => {
  if (!dbInitDone) await initDb();
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (isDbConnected && pool) {
    try {
      const q = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username.trim(), password.trim()]);
      if (q.rows.length > 0) {
        const u = { ...q.rows[0] };
        delete u.password;
        return res.json({ success: true, user: u });
      }
    } catch (e: any) {
      console.warn('DB login error, checking fallback:', e.message);
    }
  }

  const user = memoryStore.users.find(u => u.username === username.trim() && u.password === password.trim());
  if (user) {
    const copy = { ...user };
    delete copy.password;
    return res.json({ success: true, user: copy });
  }

  return res.status(401).json({ error: 'Invalid username or password' });
});

// 3. Batches
router.get('/batches', async (req, res) => {
  if (!dbInitDone) await initDb();
  if (isDbConnected && pool) {
    try {
      const q = await pool.query('SELECT * FROM batches ORDER BY batch_id ASC');
      return res.json(q.rows);
    } catch (e: any) {
      console.warn('DB fetch batches error:', e.message);
    }
  }
  return res.json(memoryStore.batches);
});

router.post('/batches', async (req, res) => {
  if (!dbInitDone) await initDb();
  const { batch_name, breed, bird_count, arrival_date, status } = req.body;
  const count = parseInt(bird_count) || 0;

  if (isDbConnected && pool) {
    try {
      const q = await pool.query(
        `INSERT INTO batches (batch_name, breed, bird_count, arrival_date, status)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [batch_name, breed, count, arrival_date, status || 'Active']
      );
      return res.status(201).json(q.rows[0]);
    } catch (e: any) {
      console.warn('DB insert batch error:', e.message);
    }
  }

  const newId = memoryStore.batches.length > 0 ? Math.max(...memoryStore.batches.map(b => b.batch_id)) + 1 : 1;
  const newBatch = {
    batch_id: newId,
    batch_name,
    breed,
    bird_count: count,
    arrival_date,
    status: status || 'Active',
    created_at: new Date()
  };
  memoryStore.batches.push(newBatch);
  return res.status(201).json(newBatch);
});

router.post('/batches/:id/add-birds', async (req, res) => {
  if (!dbInitDone) await initDb();
  const { id } = req.params;
  const { count } = req.body;
  const addCount = parseInt(count);

  if (isNaN(addCount) || addCount <= 0) {
    return res.status(400).json({ error: 'Valid positive count required' });
  }

  if (isDbConnected && pool) {
    try {
      const q = await pool.query(
        `UPDATE batches SET bird_count = bird_count + $1 WHERE batch_id = $2 RETURNING *`,
        [addCount, id]
      );
      if (q.rows.length > 0) return res.json(q.rows[0]);
    } catch (e: any) {
      console.warn('DB add birds error:', e.message);
    }
  }

  const batch = memoryStore.batches.find(b => b.batch_id === parseInt(id));
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  batch.bird_count += addCount;
  return res.json(batch);
});

router.put('/batches/:id', async (req, res) => {
  if (!dbInitDone) await initDb();
  const { id } = req.params;
  const { batch_name, breed, bird_count, arrival_date, status } = req.body;

  if (isDbConnected && pool) {
    try {
      const q = await pool.query(
        `UPDATE batches SET batch_name = $1, breed = $2, bird_count = $3, arrival_date = $4, status = $5 WHERE batch_id = $6 RETURNING *`,
        [batch_name, breed, parseInt(bird_count), arrival_date, status, id]
      );
      if (q.rows.length > 0) return res.json(q.rows[0]);
    } catch (e: any) {
      console.warn('DB update batch error:', e.message);
    }
  }

  const batch = memoryStore.batches.find(b => b.batch_id === parseInt(id));
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  Object.assign(batch, { batch_name, breed, bird_count: parseInt(bird_count), arrival_date, status });
  return res.json(batch);
});

router.delete('/batches/:id', async (req, res) => {
  if (!dbInitDone) await initDb();
  const { id } = req.params;

  if (isDbConnected && pool) {
    try {
      await pool.query('DELETE FROM batches WHERE batch_id = $1', [id]);
      return res.json({ success: true, message: 'Batch deleted' });
    } catch (e: any) {
      console.warn('DB delete batch error:', e.message);
    }
  }

  memoryStore.batches = memoryStore.batches.filter(b => b.batch_id !== parseInt(id));
  return res.json({ success: true, message: 'Batch deleted' });
});

// 4. Egg Collections
router.get('/egg-collections', async (req, res) => {
  if (!dbInitDone) await initDb();
  if (isDbConnected && pool) {
    try {
      const q = await pool.query(`
        SELECT ec.*, b.batch_name 
        FROM egg_collections ec 
        LEFT JOIN batches b ON ec.batch_id = b.batch_id 
        ORDER BY ec.collection_date DESC, ec.collection_id DESC
      `);
      return res.json(q.rows);
    } catch (e: any) {
      console.warn('DB fetch egg collections error:', e.message);
    }
  }

  const withNames = memoryStore.eggCollections.map(ec => {
    const b = memoryStore.batches.find(b => b.batch_id === ec.batch_id);
    return { ...ec, batch_name: b ? b.batch_name : 'Unknown' };
  });
  return res.json(withNames);
});

router.post('/egg-collections', async (req, res) => {
  if (!dbInitDone) await initDb();
  const { collection_date, batch_id, egg_quantity, broken_eggs, remarks } = req.body;
  const qty = parseInt(egg_quantity) || 0;
  const broken = parseInt(broken_eggs) || 0;
  const good = Math.max(0, qty - broken);

  if (isDbConnected && pool) {
    try {
      const q = await pool.query(
        `INSERT INTO egg_collections (collection_date, batch_id, egg_quantity, broken_eggs, good_eggs, remarks)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [collection_date, parseInt(batch_id), qty, broken, good, remarks || '']
      );
      return res.status(201).json(q.rows[0]);
    } catch (e: any) {
      console.warn('DB insert egg collection error:', e.message);
    }
  }

  const newId = memoryStore.eggCollections.length > 0 ? Math.max(...memoryStore.eggCollections.map(e => e.collection_id)) + 1 : 1;
  const item = {
    collection_id: newId,
    collection_date,
    batch_id: parseInt(batch_id),
    egg_quantity: qty,
    broken_eggs: broken,
    good_eggs: good,
    remarks: remarks || '',
    created_at: new Date()
  };
  memoryStore.eggCollections.unshift(item);
  return res.status(201).json(item);
});

router.delete('/egg-collections/:id', async (req, res) => {
  if (!dbInitDone) await initDb();
  const { id } = req.params;

  if (isDbConnected && pool) {
    try {
      await pool.query('DELETE FROM egg_collections WHERE collection_id = $1', [id]);
      return res.json({ success: true });
    } catch (e: any) {
      console.warn('DB delete egg collection error:', e.message);
    }
  }

  memoryStore.eggCollections = memoryStore.eggCollections.filter(e => e.collection_id !== parseInt(id));
  return res.json({ success: true });
});

// 5. Feed Consumptions
router.get('/feed-consumptions', async (req, res) => {
  if (!dbInitDone) await initDb();
  if (isDbConnected && pool) {
    try {
      const q = await pool.query(`
        SELECT fc.*, b.batch_name 
        FROM feed_consumptions fc 
        LEFT JOIN batches b ON fc.batch_id = b.batch_id 
        ORDER BY fc.feed_date DESC, fc.feed_id DESC
      `);
      return res.json(q.rows);
    } catch (e: any) {
      console.warn('DB fetch feed error:', e.message);
    }
  }

  const withNames = memoryStore.feedConsumptions.map(fc => {
    const b = memoryStore.batches.find(b => b.batch_id === fc.batch_id);
    return { ...fc, batch_name: b ? b.batch_name : 'Unknown' };
  });
  return res.json(withNames);
});

router.post('/feed-consumptions', async (req, res) => {
  if (!dbInitDone) await initDb();
  const { feed_date, batch_id, feed_type, quantity_kg, cost_per_kg, remarks } = req.body;
  const kg = parseFloat(quantity_kg) || 0;
  const costKg = parseFloat(cost_per_kg) || 35.00;
  const total = parseFloat((kg * costKg).toFixed(2));

  if (isDbConnected && pool) {
    try {
      const q = await pool.query(
        `INSERT INTO feed_consumptions (feed_date, batch_id, feed_type, quantity_kg, cost_per_kg, total_cost, remarks)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [feed_date, parseInt(batch_id), feed_type, kg, costKg, total, remarks || '']
      );
      return res.status(201).json(q.rows[0]);
    } catch (e: any) {
      console.warn('DB insert feed error:', e.message);
    }
  }

  const newId = memoryStore.feedConsumptions.length > 0 ? Math.max(...memoryStore.feedConsumptions.map(f => f.feed_id)) + 1 : 1;
  const item = {
    feed_id: newId,
    feed_date,
    batch_id: parseInt(batch_id),
    feed_type,
    quantity_kg: kg,
    cost_per_kg: costKg,
    total_cost: total,
    remarks: remarks || '',
    created_at: new Date()
  };
  memoryStore.feedConsumptions.unshift(item);
  return res.status(201).json(item);
});

router.delete('/feed-consumptions/:id', async (req, res) => {
  if (!dbInitDone) await initDb();
  const { id } = req.params;

  if (isDbConnected && pool) {
    try {
      await pool.query('DELETE FROM feed_consumptions WHERE feed_id = $1', [id]);
      return res.json({ success: true });
    } catch (e: any) {
      console.warn('DB delete feed error:', e.message);
    }
  }

  memoryStore.feedConsumptions = memoryStore.feedConsumptions.filter(f => f.feed_id !== parseInt(id));
  return res.json({ success: true });
});

// 6. Dashboard Summary
router.get('/dashboard-summary', async (req, res) => {
  if (!dbInitDone) await initDb();
  let batches = [];
  let eggCollections = [];
  let feedConsumptions = [];

  if (isDbConnected && pool) {
    try {
      const [bRes, eRes, fRes] = await Promise.all([
        pool.query('SELECT * FROM batches'),
        pool.query('SELECT * FROM egg_collections'),
        pool.query('SELECT * FROM feed_consumptions')
      ]);
      batches = bRes.rows;
      eggCollections = eRes.rows;
      feedConsumptions = fRes.rows;
    } catch (e: any) {
      console.warn('DB fetch dashboard summary error:', e.message);
      batches = memoryStore.batches;
      eggCollections = memoryStore.eggCollections;
      feedConsumptions = memoryStore.feedConsumptions;
    }
  } else {
    batches = memoryStore.batches;
    eggCollections = memoryStore.eggCollections;
    feedConsumptions = memoryStore.feedConsumptions;
  }

  const totalBirds = batches.reduce((acc: number, b: any) => acc + (b.status === 'Active' ? Number(b.bird_count) : 0), 0);
  const activeBatchesCount = batches.filter((b: any) => b.status === 'Active').length;

  const totalEggsEver = eggCollections.reduce((acc: number, e: any) => acc + Number(e.egg_quantity), 0);
  const goodEggsEver = eggCollections.reduce((acc: number, e: any) => acc + Number(e.good_eggs), 0);
  const brokenEggsEver = eggCollections.reduce((acc: number, e: any) => acc + Number(e.broken_eggs), 0);

  const totalFeedKg = feedConsumptions.reduce((acc: number, f: any) => acc + Number(f.quantity_kg), 0);
  const totalFeedCost = feedConsumptions.reduce((acc: number, f: any) => acc + Number(f.total_cost), 0);

  const brokenRate = totalEggsEver > 0 ? ((brokenEggsEver / totalEggsEver) * 100).toFixed(1) : '0.0';
  const layingRate = totalBirds > 0 ? (((totalEggsEver / 7) / totalBirds) * 100).toFixed(1) : '0.0';

  return res.json({
    totalBirds,
    activeBatchesCount,
    totalEggs: totalEggsEver,
    goodEggs: goodEggsEver,
    brokenEggs: brokenEggsEver,
    brokenRate,
    layingRate,
    totalFeedKg: totalFeedKg.toFixed(1),
    totalFeedCost: totalFeedCost.toFixed(2),
    batchesCount: batches.length,
    estimatedRevenue: (goodEggsEver * 6).toFixed(2),
    netProfit: ((goodEggsEver * 6) - totalFeedCost).toFixed(2)
  });
});

// Mount router on both /api and / to handle all rewrite variants seamlessly
app.use('/api', router);
app.use('/', router);

// Error fallback handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled Serverless Error:', err);
  res.status(500).json({ error: err.message || 'Server error' });
});

// Export Express app
export { app };

// Default Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  try {
    if (!dbInitDone) {
      await Promise.race([
        initDb(),
        new Promise((resolve) => setTimeout(resolve, 2000))
      ]);
    }
    return app(req, res);
  } catch (err: any) {
    console.error('Handler execution error:', err);
    res.status(500).json({ error: err.message || 'Execution error' });
  }
}
