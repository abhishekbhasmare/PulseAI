import React from 'react';
import {
  HealthRecord,
  HealthMeasurement,
  MonthlyCheckup,
  SmartReminder,
  Language,
} from '../../types';
import { UserTab } from './UserSidebar';
import {
  Activity,
  FolderHeart,
  GitCommit,
  CalendarCheck2,
  TrendingUp,
  FileSpreadsheet,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface UserDashboardProps {
  records: HealthRecord[];
  measurements: HealthMeasurement[];
  checkups: MonthlyCheckup[];
  reminders: SmartReminder[];
  onSelectTab: (tab: UserTab) => void;
  language: Language;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  records,
  measurements,
  checkups,
  reminders,
  onSelectTab,
  language,
}) => {
  const isMr = language === 'mr';
  const upcomingCheckup = checkups.find((c) => c.status === 'upcoming');
  const latestMeas = measurements[measurements.length - 1];
  const unreadReminders = reminders.filter((r) => !r.isRead);

  // Continuity Engine Workflow Stages
  const continuitySteps = [
    {
      title: isMr ? '१. आरोग्य नोंद जतन' : '1. Save Health Record',
      desc: isMr ? 'वैद्यकीय अहवाल व नोंदी' : 'Lab reports & notes',
      done: records.length > 0,
      active: true,
      tab: 'memory' as UserTab,
    },
    {
      title: isMr ? '२. वैयक्तिक कालक्रम' : '2. Personal Timeline',
      desc: isMr ? 'एकत्रित आरोग्य इतिहास' : 'Unified health chronology',
      done: records.length > 0,
      active: true,
      tab: 'timeline' as UserTab,
    },
    {
      title: isMr ? '३. मासिक तपासणी' : '3. Monthly Checkup',
      desc: isMr ? 'नियमित फॉलो-अप वेळ' : 'Recurring scheduled care',
      done: checkups.some((c) => c.status === 'completed' || c.status === 'upcoming'),
      active: true,
      tab: 'checkups' as UserTab,
    },
    {
      title: isMr ? '४. इन-ॲप स्मरणपत्र' : '4. In-App Reminder',
      desc: isMr ? 'वेळेवर सूचना' : 'Upcoming alerts & meds',
      done: reminders.length > 0,
      active: true,
      tab: 'checkups' as UserTab,
    },
    {
      title: isMr ? '५. मोजमाप तुलना' : '5. Compare Trends',
      desc: isMr ? 'रक्तदाब/साखर कल' : 'Historical BP/glucose diff',
      done: measurements.length >= 2,
      active: true,
      tab: 'trends' as UserTab,
    },
    {
      title: isMr ? '६. व्हिजिट-रेडी सारांश' : '6. VisitReady Prep',
      desc: isMr ? 'डॉक्टरांसाठी प्रश्न व नोंद' : 'Doctor summary & questions',
      done: true,
      active: true,
      tab: 'visitready' as UserTab,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: PulseAI Continuity Engine Overview */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 rounded-2xl text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-teal-600/60 backdrop-blur-xs text-teal-100 text-xs px-3 py-1 rounded-full mb-3 border border-teal-400/30 font-medium">
            <Activity className="w-3.5 h-3.5 text-teal-200" />
            <span>PulseAI Continuity Engine Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {isMr ? 'स्मार्ट आरोग्य सातत्य व्यासपीठ' : 'Connected Healthcare Continuity'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-teal-100 max-w-2xl leading-relaxed">
            {isMr
              ? 'तुमचे आरोग्य हे विखुरलेल्या घटना नसून एक अखंड प्रवास आहे. पल्सएआय मागील नोंदी, मासिक तपासण्या, स्मार्ट स्मरणपत्रे आणि डॉक्टर भेट पूर्वतयारी यांना एका सुरक्षित साखळीत जोडते.'
              : 'Health interactions are not isolated events. PulseAI connects saved records to upcoming checkups, in-app reminders, actual vitals trends, and doctor consultation preparation.'}
          </p>

          {/* Quick Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onSelectTab('memory')}
              className="bg-white text-teal-900 hover:bg-teal-50 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4 text-teal-700" />
              {isMr ? 'नवीन नोंद तयार करा' : 'Create Health Record'}
            </button>
            <button
              onClick={() => onSelectTab('checkups')}
              className="bg-teal-700/80 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border border-teal-500/40"
            >
              <CalendarCheck2 className="w-4 h-4 text-teal-200" />
              {isMr ? 'मासिक तपासणी शेड्यूल करा' : 'Schedule Checkup'}
            </button>
            <button
              onClick={() => onSelectTab('visitready')}
              className="bg-teal-700/80 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border border-teal-500/40"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-200" />
              {isMr ? 'व्हिजिट-रेडी सारांश तयार करा' : 'Prepare Consultation'}
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-teal-500/10 pointer-events-none blur-2xl" />
      </div>

      {/* Continuity Engine Stepper Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {isMr ? 'पल्सएआय सातत्य चक्र (Continuity Workflow)' : 'PulseAI Continuity Workflow'}
            </h3>
            <p className="text-xs text-slate-500">
              {isMr
                ? 'खालील सर्व टप्पे तुमच्या प्रत्यक्ष साठवलेल्या डेटाशी जोडलेले आहेत'
                : 'All stages execute on actual stored patient records. No fabricated data.'}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
            {records.length} {isMr ? 'नोंदी जोडल्या' : 'Records Active'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {continuitySteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTab(step.tab)}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-teal-50/50 hover:border-teal-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-teal-700">
                  {step.title}
                </span>
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Overview Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Records in Vault */}
        <div
          onClick={() => onSelectTab('memory')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isMr ? 'आरोग्य नोंदी' : 'Health Memory'}
            </span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <FolderHeart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{records.length}</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>{isMr ? 'सर्व अहवाल व चिठ्ठ्या' : 'Stored medical events'}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Card 2: Upcoming Checkup */}
        <div
          onClick={() => onSelectTab('checkups')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isMr ? 'पुढील तपासणी' : 'Next Checkup'}
            </span>
            <div className="p-2 bg-sky-50 text-sky-700 rounded-lg group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2 truncate">
            {upcomingCheckup ? upcomingCheckup.scheduledDate : (isMr ? 'नियोजित नाही' : 'None Scheduled')}
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {upcomingCheckup ? `${upcomingCheckup.scheduledTime} - ${upcomingCheckup.title}` : (isMr ? 'तपासणी शेड्यूल करा' : 'Click to schedule')}
          </p>
        </div>

        {/* Card 3: Latest Vitals Reading */}
        <div
          onClick={() => onSelectTab('trends')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isMr ? 'नवीनतम रक्तदाब' : 'Latest Vitals (BP)'}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-teal-800 mt-2">
            {latestMeas && latestMeas.systolicBp ? `${latestMeas.systolicBp}/${latestMeas.diastolicBp}` : '--'}{' '}
            <span className="text-xs font-normal text-slate-500">mmHg</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {latestMeas ? `${isMr ? 'तारीख' : 'Recorded'}: ${latestMeas.date}` : (isMr ? 'नोंद नाही' : 'No vitals logged')}
          </p>
        </div>

        {/* Card 4: Active Reminders */}
        <div
          onClick={() => onSelectTab('checkups')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isMr ? 'स्मार्ट स्मरणपत्रे' : 'Smart Reminders'}
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{unreadReminders.length}</div>
          <p className="text-xs text-amber-700 mt-1 font-medium">
            {unreadReminders.length > 0 ? (isMr ? 'लक्षात ठेवण्यासारखे टास्क' : 'Active alerts to review') : (isMr ? 'सर्व पूर्ण' : 'All clear')}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Checkup Detail & Recent Records Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Scheduled Monthly Checkup Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-5 h-5 text-teal-600" />
                <h3 className="font-semibold text-slate-800 text-sm">
                  {isMr ? 'नजीकची मासिक तपासणी' : 'Next Scheduled Monthly Checkup'}
                </h3>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 bg-teal-50 text-teal-800 rounded-full border border-teal-200">
                {isMr ? 'पुढील चक्र' : 'Continuity Care'}
              </span>
            </div>

            {upcomingCheckup ? (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{upcomingCheckup.title}</h4>
                      <p className="text-xs text-teal-800 mt-0.5 font-medium">{upcomingCheckup.provider}</p>
                    </div>
                    <span className="text-xs font-bold bg-white text-teal-700 px-2.5 py-1 rounded-md border border-teal-200 shadow-2xs">
                      {upcomingCheckup.scheduledDate} @ {upcomingCheckup.scheduledTime}
                    </span>
                  </div>
                  {upcomingCheckup.location && (
                    <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                      {upcomingCheckup.location}
                    </p>
                  )}
                  {upcomingCheckup.notes && (
                    <p className="text-xs text-slate-500 mt-1 italic">"{upcomingCheckup.notes}"</p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    {isMr
                      ? 'तपासणीनंतर मोजमाप नोंदवल्यास पल्सएआय आपोआप ऐतिहासिक ट्रेंड्स अपडेट करेल आणि पुढील महिन्याची तारीख सेट करेल.'
                      : 'During your checkup, enter new measurements to immediately calculate trend trajectory and schedule the recurring monthly checkup.'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center py-6">
                <CalendarCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">
                  {isMr ? 'सध्या कोणतीही तपासणी नियोजित नाही.' : 'No upcoming monthly checkups scheduled.'}
                </p>
                <button
                  onClick={() => onSelectTab('checkups')}
                  className="mt-3 text-xs font-semibold text-teal-700 hover:text-teal-900 underline"
                >
                  {isMr ? 'पहिली तपासणी शेड्यूल करा' : 'Schedule your monthly checkup'}
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onSelectTab('checkups')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>{isMr ? 'सर्व तपासण्या पहा' : 'Manage Checkups'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectTab('visitready')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <span>{isMr ? 'भेट तयारी सुरू करा' : 'Prep with VisitReady'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Health Records Feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderHeart className="w-5 h-5 text-teal-600" />
                <h3 className="font-semibold text-slate-800 text-sm">
                  {isMr ? 'नुकत्याच जतन केलेल्या नोंदी' : 'Recent Health Records'}
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('memory')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900"
              >
                {isMr ? 'सर्व पहा' : 'View All'} ({records.length})
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {records.slice(0, 3).map((rec) => (
                <div key={rec.id} className="py-3 hover:bg-slate-50/50 rounded-lg px-2 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{rec.provider || 'Independent Entry'}</p>
                    </div>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded whitespace-nowrap">
                      {rec.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                    <span>{rec.date}</span>
                    {rec.followUpDate && (
                      <span className="text-teal-700 font-medium">
                        Follow-up: {rec.followUpDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onSelectTab('timeline')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <GitCommit className="w-3.5 h-3.5 text-teal-600" />
              <span>{isMr ? 'संपूर्ण कालक्रम उघडा (Timeline)' : 'Open Unified Health Timeline'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
