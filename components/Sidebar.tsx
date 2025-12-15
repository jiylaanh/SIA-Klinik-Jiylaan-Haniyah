import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, MessageSquare, BookOpen, Activity, Settings, PlusCircle } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onNewEntry: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onNewEntry }) => {
  const menuItems = [
    { view: ViewState.DASHBOARD, label: 'Dashboard Keuangan', icon: LayoutDashboard },
    { view: ViewState.AI_ASSISTANT, label: 'Asisten AI (SIA Core)', icon: MessageSquare },
    { view: ViewState.JOURNAL, label: 'Jurnal Transaksi', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl">
      <div className="p-6 border-b border-slate-700 flex items-center gap-3">
        <Activity className="text-emerald-400 h-8 w-8" />
        <div>
          <h1 className="font-bold text-lg tracking-tight">SIA Klinik</h1>
          <p className="text-xs text-slate-400">Integrated System</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onChangeView(item.view)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              currentView === item.view
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
        
        <div className="pt-6 mt-6 border-t border-slate-700">
           <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Aksi Cepat</p>
           <button 
             onClick={onNewEntry}
             className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition-colors"
           >
             <PlusCircle size={18} />
             Entri Baru
           </button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm">
          <Settings size={18} />
          Pengaturan Sistem
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;