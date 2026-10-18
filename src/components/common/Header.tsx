import React from 'react';
import { Language, UserRole } from '../../types';
import { NotificationDropdown } from './NotificationDropdown';
import { Activity, ShieldAlert, Globe, User, ShieldCheck, Menu } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  currentPath: string;
  onNavigate: (path: string) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  userId: string;
  userName: string;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentPath,
  onNavigate,
  language,
  onToggleLanguage,
  userId,
  userName,
  onToggleMobileMenu,
}) => {
  const isMr = language === 'mr';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* High-visibility Emergency Helpline Alert Bar */}
      <div className="bg-red-600 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-200 animate-pulse" />
          <span>
            {isMr
              ? 'आपत्कालीन वैद्यकीय मदत (महाराष्ट्र/भारत): त्वरित ११२ (आणीबाणी) किंवा १०८ (रुग्णवाहिका) वर संपर्क साधा.'
              : 'Medical Emergency (India): Dial 112 (National Helpline) or 108 (Ambulance). PulseAI is not for emergency triage.'}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px] text-red-100 shrink-0">
          <span className="bg-red-700/60 px-2 py-0.5 rounded">₹0 Zero Mandatory Cost</span>
          <span className="bg-red-700/60 px-2 py-0.5 rounded">Continuous Health Memory</span>
        </div>
      </div>

      {/* Main Header Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  PulseAI
                  <span className="text-[10px] uppercase font-semibold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded tracking-normal">
                    Continuity
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 block -mt-1 hidden sm:block">
                  {isMr ? 'स्मार्ट आरोग्यसेवा, अधिक सुलभ' : 'Smarter Healthcare, Simplified'}
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Portal Switching Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onNavigate('/user')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentPath.startsWith('/user')
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              {isMr ? 'रुग्ण पोर्टल' : 'Patient Portal'}
            </button>

            <button
              onClick={() => onNavigate('/admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentPath.startsWith('/admin')
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {isMr ? 'प्रशासक ऑपरेशन्स' : 'Admin Operations'}
            </button>
          </nav>

          {/* Right Header Actions: Reminders, Language, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* In-app Reminders Notification Dropdown */}
            <NotificationDropdown userId={userId} />

            {/* Marathi / English Language Switcher */}
            <button
              onClick={() => onToggleLanguage(language === 'en' ? 'mr' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              title="Toggle English / मराठी"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-semibold">{language === 'en' ? 'मराठी' : 'English'}</span>
            </button>

            {/* Current Profile Badge */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 text-xs font-bold">
                {currentRole === 'admin' ? 'AD' : userName.charAt(0)}
              </div>
              <div className="text-left text-xs">
                <span className="font-semibold text-slate-800 block truncate max-w-[100px]">
                  {currentRole === 'admin' ? 'Administrator' : userName}
                </span>
                <span className="text-[10px] text-teal-600 font-medium block">
                  {currentRole === 'admin' ? 'Verified Admin' : 'Pune, MH'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
