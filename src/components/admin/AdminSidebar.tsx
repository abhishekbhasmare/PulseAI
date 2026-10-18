import React from 'react';
import {
  LayoutDashboard,
  Building2,
  UserCheck,
  CalendarDays,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react';

export type AdminTab = 'analytics' | 'hospitals' | 'doctors' | 'appointments';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'analytics',
      label: 'Operations Analytics',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'hospitals',
      label: 'Hospital Directory CRUD',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'doctors',
      label: 'Doctor Directory CRUD',
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      id: 'appointments',
      label: 'Demo Appointments Triage',
      icon: <CalendarDays className="w-4 h-4" />,
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800 w-64">
      {/* Admin Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs border border-sky-400/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white text-xs block">PulseAI Operations</span>
            <span className="text-[10px] text-sky-400 block font-medium">Administrator View</span>
          </div>
        </div>

        {onCloseMobile && (
          <button onClick={onCloseMobile} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Management Controls
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onSelectTab(item.id);
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
              activeTab === item.id
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className={activeTab === item.id ? 'text-white' : 'text-slate-400'}>
              {item.icon}
            </span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Admin Footer & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        {content}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-950/70" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
