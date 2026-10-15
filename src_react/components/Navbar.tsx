import React from 'react';
import { User } from '../types';
import { Database, LogOut, User as UserIcon, Menu } from 'lucide-react';

interface Props {
  user: User;
  onLogout: () => void;
  onOpenDbModal: () => void;
  onToggleMobileMenu: () => void;
  dbStatus: any;
}

export const Navbar: React.FC<Props> = ({ user, onLogout, onOpenDbModal, onToggleMobileMenu, dbStatus }) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MANAGER': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Logo */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-lg">
            🐣
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              Poultry Farm Pro
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                v2.0
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">Smart Flock, Harvest & Ration Control</div>
          </div>
        </div>
      </div>

      {/* Right: DB Status Indicator & User Badge */}
      <div className="flex items-center gap-3">
        {/* Pulsing DB Badge */}
        <button
          onClick={onOpenDbModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition shadow-sm group"
          title="Click to view Database & Supabase connection details"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Database className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
          <span className="hidden sm:inline font-medium text-slate-300">DB / Supabase</span>
        </button>

        {/* User Role Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <UserIcon className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-white leading-tight">{user.full_name}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
