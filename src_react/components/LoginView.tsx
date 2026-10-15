import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { Lock, User as UserIcon, ArrowRight, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

interface Props {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<Props> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await api.login(username, password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError('Invalid username or password. Please use the quick demo accounts below.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-radial-gradient">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md glass-card rounded-3xl p-8 border-slate-700/60 shadow-2xl z-10 animate-fade-in">
        {/* Brand Logo & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-xl shadow-emerald-600/30 text-2xl mb-3">
            🐣
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Poultry Farm Pro</h1>
          <p className="text-xs text-slate-400 mt-1">Smart Enterprise Flock & Harvest Management Platform</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Username</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick 1-Click Demo Role Selector Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5 font-medium justify-center">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Click Presentation Demo Roles</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickRole('admin', 'admin123')}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-center transition"
            >
              <div className="text-[11px] font-bold text-emerald-400">Admin</div>
              <div className="text-[9px] text-slate-400 font-mono">admin / 123</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('manager', 'manager123')}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-center transition"
            >
              <div className="text-[11px] font-bold text-amber-400">Manager</div>
              <div className="text-[9px] text-slate-400 font-mono">manager / 123</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('staff', 'staff123')}
              className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-center transition"
            >
              <div className="text-[11px] font-bold text-blue-400">Staff</div>
              <div className="text-[9px] text-slate-400 font-mono">staff / 123</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
