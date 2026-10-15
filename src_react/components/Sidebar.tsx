import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Egg, 
  UtensilsCrossed, 
  FileSpreadsheet, 
  Code2, 
  X,
  Sparkles
} from 'lucide-react';
import { User } from '../types';

export type ActiveTab = 'dashboard' | 'batches' | 'eggs' | 'feed' | 'reports' | 'code-hub';

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  user: User;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  mobileMenuOpen,
  onCloseMobileMenu,
  user
}) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'batches', label: 'Flock & Batches', icon: <Layers className="w-4 h-4" /> },
    { id: 'eggs', label: 'Egg Collection Log', icon: <Egg className="w-4 h-4" /> },
    { id: 'feed', label: 'Feed & Rations', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'reports', label: 'Monthly Financials', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'code-hub', label: 'Academic Java Hub', icon: <Code2 className="w-4 h-4" />, badge: 'ZIP' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 select-none">
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            <span>Main Navigation</span>
          </div>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      active ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Academic Card in Sidebar */}
        <div className="mt-auto p-4 m-3 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/20 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Project Kit</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
            Contains ready-to-run Eclipse/IntelliJ WAR project, SQL dump & 15 Viva Q&A guide.
          </p>
          <button
            onClick={() => onSelectTab('code-hub')}
            className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition text-center"
          >
            Open Java Hub & ZIP Exporter
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Slide-over */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobileMenu}
          />
          <div className="relative w-72 max-w-[80%] bg-slate-900 h-full border-r border-slate-800 p-5 flex flex-col z-10 animate-slide-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐣</span>
                <span className="font-bold text-white text-base">Poultry Farm Pro</span>
              </div>
              <button 
                onClick={onCloseMobileMenu}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 flex-1">
              {menuItems.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobileMenu();
                    }}
                    className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition ${
                      active
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sticky Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg text-[10px] font-medium transition ${
            activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onSelectTab('batches')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg text-[10px] font-medium transition ${
            activeTab === 'batches' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span>Batches</span>
        </button>

        <button
          onClick={() => onSelectTab('eggs')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg text-[10px] font-medium transition ${
            activeTab === 'eggs' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Egg className="w-5 h-5 mb-0.5" />
          <span>Eggs</span>
        </button>

        <button
          onClick={() => onSelectTab('feed')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg text-[10px] font-medium transition ${
            activeTab === 'feed' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5 mb-0.5" />
          <span>Feed</span>
        </button>

        <button
          onClick={() => onSelectTab('code-hub')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg text-[10px] font-medium transition ${
            activeTab === 'code-hub' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Code2 className="w-5 h-5 mb-0.5" />
          <span>Code Hub</span>
        </button>
      </nav>
    </>
  );
};
