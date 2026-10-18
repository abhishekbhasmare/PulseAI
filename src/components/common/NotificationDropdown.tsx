import React, { useState, useEffect } from 'react';
import { SmartReminder } from '../../types';
import { getReminders, markReminderRead, dismissReminder, subscribeToStorage } from '../../services/storage';
import { Bell, Check, Clock, Calendar, Pill, AlertTriangle } from 'lucide-react';

interface NotificationDropdownProps {
  userId: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reminders, setReminders] = useState<SmartReminder[]>([]);

  useEffect(() => {
    const update = () => {
      setReminders(getReminders(userId));
    };
    update();
    return subscribeToStorage(update);
  }, [userId]);

  const unreadCount = reminders.filter((r) => !r.isRead).length;

  const getIcon = (category: SmartReminder['category']) => {
    switch (category) {
      case 'checkup':
        return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'appointment':
        return <Clock className="w-4 h-4 text-sky-600" />;
      case 'medication':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
        title="Smart Reminders"
        aria-label="View in-app reminders"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-600" />
                <h4 className="text-sm font-semibold text-slate-800">In-App Smart Reminders</h4>
              </div>
              <span className="text-xs bg-teal-100 text-teal-800 font-medium px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {reminders.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No active reminders. Add a checkup or follow-up date to see reminders here.
                </div>
              ) : (
                reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                      !rem.isRead ? 'bg-teal-50/40' : ''
                    }`}
                  >
                    <div className="p-2 bg-white rounded-md border border-slate-200 shrink-0 mt-0.5">
                      {getIcon(rem.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-semibold truncate ${!rem.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                          {rem.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {rem.dueDate} {rem.dueTime || ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{rem.description}</p>
                      
                      <div className="mt-2 flex items-center gap-2">
                        {!rem.isRead && (
                          <button
                            onClick={() => markReminderRead(rem.id)}
                            className="text-[11px] text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Mark read
                          </button>
                        )}
                        <button
                          onClick={() => dismissReminder(rem.id)}
                          className="text-[11px] text-slate-400 hover:text-slate-600"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
              Reliable in-app reminders • Zero paid SMS/cloud notifications required
            </div>
          </div>
        </>
      )}
    </div>
  );
};
