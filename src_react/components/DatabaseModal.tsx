import React, { useState } from 'react';
import { Database, Check, Copy, X, Server, ShieldCheck, Key, Terminal } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dbStatus: any;
}

export const DatabaseModal: React.FC<Props> = ({ isOpen, onClose, dbStatus }) => {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const envSnippet = `# Supabase PostgreSQL Configuration
DATABASE_URL=postgresql://postgres.dwplfixdzaubssqgdbbw:Manojselvaraj%40123412@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
DB_HOST=aws-0-ap-south-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.dwplfixdzaubssqgdbbw
DB_PASSWORD=Manojselvaraj@123412
DB_NAME=postgres
DB_SSL=true`;

  const sqlScript = `-- Poultry Farm Management PostgreSQL Schema
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid TEXT UNIQUE,
  email TEXT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'STAFF' CHECK (role IN ('ADMIN', 'MANAGER', 'STAFF')),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batches (
  batch_id SERIAL PRIMARY KEY,
  batch_name VARCHAR(100) NOT NULL,
  breed VARCHAR(50) NOT NULL,
  bird_count INT NOT NULL CHECK (bird_count >= 0),
  arrival_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Sold', 'Culled', 'Quarantine')),
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
);`;

  const copyToClipboard = (text: string, type: 'env' | 'sql') => {
    navigator.clipboard.writeText(text);
    if (type === 'env') {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    } else {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Database / Supabase Connection Hub</h3>
              <p className="text-xs text-slate-400">PostgreSQL cloud cluster & connection pool status</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Status badge */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <div className="font-medium text-white">{dbStatus?.status || 'Supabase PostgreSQL Pool Connected'}</div>
                <div className="text-xs text-slate-400 font-mono">aws-0-ap-south-1.pooler.supabase.com:6543</div>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              SSL Mode: Require
            </span>
          </div>

          {/* 4-Step Instructions */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 4-Step Supabase Connection Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <div className="font-semibold text-emerald-300 mb-1">1. Project Settings</div>
                <p className="text-slate-400">Navigate to <strong>Database</strong> &gt; <strong>Connection Pooling</strong> in your Supabase Dashboard.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <div className="font-semibold text-emerald-300 mb-1">2. Transaction Pooler</div>
                <p className="text-slate-400">Use port <strong>6543</strong> (Transaction mode) with SSL enabled for robust concurrent pooling.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <div className="font-semibold text-emerald-300 mb-1">3. Password Config</div>
                <p className="text-slate-400">Stored in <code>.env</code> and <code>src/main/resources/db.properties</code>.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <div className="font-semibold text-emerald-300 mb-1">4. Dual Persistence</div>
                <p className="text-slate-400">Writes synchronize both to PostgreSQL and client <code>localStorage</code> cache.</p>
              </div>
            </div>
          </div>

          {/* Copyable .env */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" /> Environment Variables (.env)
              </label>
              <button
                onClick={() => copyToClipboard(envSnippet, 'env')}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedEnv ? 'Copied to Clipboard!' : 'Copy .env'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto">
              {envSnippet}
            </pre>
          </div>

          {/* SQL Script Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" /> Complete Schema Script (SQL Editor)
              </label>
              <button
                onClick={() => copyToClipboard(sqlScript, 'sql')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Copied SQL Script!' : 'Copy SQL Script'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono text-xs max-h-36 overflow-y-auto">
              {sqlScript}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
