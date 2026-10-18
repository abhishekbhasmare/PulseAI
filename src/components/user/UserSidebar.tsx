import React from 'react';
import { Language } from '../../types';
import { getTranslation } from '../../utils/i18n';
import {
  LayoutDashboard,
  FolderHeart,
  GitCommit,
  CalendarCheck2,
  TrendingUp,
  Bot,
  FileSpreadsheet,
  Building2,
  CalendarDays,
  Pill,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';

export type UserTab =
  | 'dashboard'
  | 'memory'
  | 'timeline'
  | 'checkups'
  | 'trends'
  | 'trustguard'
  | 'visitready'
  | 'directory'
  | 'appointments'
  | 'medications'
  | 'wellness'
  | 'privacy';

interface UserSidebarProps {
  activeTab: UserTab;
  onSelectTab: (tab: UserTab) => void;
  language: Language;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  activeTab,
  onSelectTab,
  language,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const navItems: { id: UserTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'memory',
      label: t('healthMemory'),
      icon: <FolderHeart className="w-4 h-4" />,
    },
    {
      id: 'timeline',
      label: t('healthTimeline'),
      icon: <GitCommit className="w-4 h-4" />,
    },
    {
      id: 'checkups',
      label: t('monthlyCheckups'),
      icon: <CalendarCheck2 className="w-4 h-4" />,
      badge: 'Monthly',
    },
    {
      id: 'trends',
      label: t('healthTrends'),
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'trustguard',
      label: t('aiNavigator'),
      icon: <Bot className="w-4 h-4" />,
      badge: 'Safety',
    },
    {
      id: 'visitready',
      label: t('visitReady'),
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
    {
      id: 'directory',
      label: t('hospitalDirectory'),
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'appointments',
      label: t('appointments'),
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'medications',
      label: t('medications'),
      icon: <Pill className="w-4 h-4" />,
    },
    {
      id: 'wellness',
      label: t('wellness'),
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'privacy',
      label: t('privacySettings'),
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64">
      {/* Mobile Header with close button */}
      <div className="lg:hidden p-4 border-b border-slate-100 flex items-center justify-between">
        <span className="font-semibold text-slate-800 text-sm">Patient Portal Menu</span>
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Continuity Engine
        </div>
        {navItems.slice(0, 7).map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onSelectTab(item.id);
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
              activeTab === item.id
                ? 'bg-teal-50 text-teal-900 border border-teal-200/80 shadow-2xs font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className={activeTab === item.id ? 'text-teal-700' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </div>
            {item.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                  activeTab === item.id ? 'bg-teal-200/70 text-teal-900' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}

        <div className="pt-4 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Services & Support
        </div>
        {navItems.slice(7).map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onSelectTab(item.id);
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
              activeTab === item.id
                ? 'bg-teal-50 text-teal-900 border border-teal-200/80 shadow-2xs font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className={activeTab === item.id ? 'text-teal-700' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Continuity Engine status box */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center justify-between text-teal-800 font-semibold text-[11px]">
            <span>PulseAI Engine</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Memory → Timeline → Checkups → Trends → Consultation
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
