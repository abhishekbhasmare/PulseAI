import React from 'react';
import { Language } from '../../types';
import {
  Activity,
  FolderHeart,
  GitCommit,
  CalendarCheck2,
  TrendingUp,
  Bot,
  FileSpreadsheet,
  Building2,
  ShieldCheck,
  User,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';

interface LandingPageProps {
  onEnterUserPortal: () => void;
  onEnterAdminPortal: () => void;
  language: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterUserPortal,
  onEnterAdminPortal,
  language,
}) => {
  const isMr = language === 'mr';

  const continuityWorkflow = [
    {
      step: '01',
      title: isMr ? 'आरोग्य नोंद जतन करा' : 'Save Health Record',
      desc: isMr
        ? 'वैद्यकीय अहवाल, चिठ्ठ्या आणि तपासण्या सुरक्षित नोंदवहीत जतन करा.'
        : 'Store clinical notes, lab reports, and vitals in your personal health vault.',
      icon: <FolderHeart className="w-5 h-5 text-teal-600" />,
    },
    {
      step: '02',
      title: isMr ? 'एकत्रित कालक्रम' : 'Unified Timeline',
      desc: isMr
        ? 'मागील नोंदी आणि घटना कालक्रमानुसार एकाच पानावर एकत्र येतात.'
        : 'All historical health events automatically arrange in a continuous timeline.',
      icon: <GitCommit className="w-5 h-5 text-sky-600" />,
    },
    {
      step: '03',
      title: isMr ? 'नियमित मासिक तपासणी' : 'Schedule Checkup',
      desc: isMr
        ? 'दरमहा आवर्ती तपासणी नियोजित करा आणि वेळेवर स्मरणपत्रे मिळवा.'
        : 'Set up recurring monthly reviews with time & date handling in Asia/Kolkata.',
      icon: <CalendarCheck2 className="w-5 h-5 text-indigo-600" />,
    },
    {
      step: '04',
      title: isMr ? 'स्मार्ट स्मरणपत्रे' : 'Smart Reminders',
      desc: isMr
        ? 'तपासणी, औषधे आणि फॉलो-अपसाठी इन-ॲप सूचना.'
        : 'Reliable in-app notification center without expensive cloud SMS costs.',
      icon: <Activity className="w-5 h-5 text-amber-600" />,
    },
    {
      step: '05',
      title: isMr ? 'मोजमाप तुलना व ट्रेंड्स' : 'Compare Real Trends',
      desc: isMr
        ? 'रक्तदाब, साखर व वजनातील बदल खऱ्या आकडेवारीसह आलेखात पहा.'
        : 'View objective trajectory and calculated deltas between recorded dates.',
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
    },
    {
      step: '06',
      title: isMr ? 'व्हिजिट-रेडी डॉक्टर पूर्वतयारी' : 'VisitReady Consultation',
      desc: isMr
        ? 'डॉक्टरांच्या भेटीसाठी लक्षणे, प्रश्न आणि अहवालांचा सारांश तयार करा.'
        : 'Generate an editable, printable summary and targeted doctor questions.',
      icon: <FileSpreadsheet className="w-5 h-5 text-purple-600" />,
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center max-w-4xl mx-auto px-4">
        {/* Badges */}
        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 text-xs px-3.5 py-1.5 rounded-full font-semibold shadow-2xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>{isMr ? '₹० शून्य अनिवार्य खर्च | राष्ट्रीय हॅकाथॉन एमव्हीपी' : '₹0 Zero Mandatory Cost | National Hackathon MVP'}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          {isMr ? 'स्मार्ट आरोग्यसातत्य,' : 'Smarter Healthcare,'}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700">
            {isMr ? 'अधिक सुलभ.' : 'Simplified.'}
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {isMr
            ? 'आरोग्य नोंदी, मासिक तपासण्या, मोजमापांचे ट्रेंड्स आणि डॉक्टर भेट पूर्वतयारी यांना जोडणारे महाराष्ट्रातील पहिले अखंड व्यासपीठ.'
            : 'Connecting personal health memory, recurring checkups, in-app reminders, verified vitals trends, and doctor consultation preparation.'}
        </p>

        {/* Two Distinct Portal Entry Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnterUserPortal}
            className="w-full sm:w-auto px-8 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
          >
            <User className="w-5 h-5" />
            <span>{isMr ? 'रुग्ण पोर्टल उघडा (Patient Portal)' : 'Launch Patient Portal'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onEnterAdminPortal}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group text-sm sm:text-base border border-slate-700"
          >
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <span>{isMr ? 'प्रशासक ऑपरेशन्स (Admin Portal)' : 'Admin Operations Portal'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Verified Disclosures */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Bilingual (English & मराठी)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            15 Maharashtra Hospitals & 10 Cities
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Instant Emergency Deterministic Triage (112 / 108)
          </span>
        </div>
      </section>

      {/* Primary Innovation: PulseAI Continuity Engine Workflow */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Flagship Continuity Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isMr ? 'अखंड आरोग्य प्रवास कसा कार्य करतो?' : 'How the PulseAI Continuity Engine Works'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            {isMr
              ? 'आरोग्य ही एक वेगळी घटना नाही. पल्सएआय नोंदीपासून थेट डॉक्टरांच्या भेटीपर्यंत प्रत्येक पायरी जोडते.'
              : 'Healthcare should not be isolated events. Every stored record flows into future checkups, trends, and visits.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {continuityWorkflow.map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {item.icon}
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">STEP {item.step}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-4">{item.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TrustGuard & Clinical Safety Highlights */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-red-600/80 text-white text-xs px-3 py-1 rounded-full font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              Safety-First Architecture
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              AI Health Navigator — PulseAI TrustGuard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Medical assistance should be responsible, accessible, and grounded. TrustGuard executes deterministic emergency keyword screening prior to processing, directing critical cases to India’s 112 and 108 helpline services immediately.
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={onEnterUserPortal}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors shadow-sm"
              >
                Try TrustGuard in Patient Portal
              </button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none p-6">
            <Bot className="w-72 h-72 text-white" />
          </div>
        </div>
      </section>

      {/* Two Portals Comparison Grid */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Two Distinct Operating Environments
          </h2>
          <p className="text-xs text-slate-500">
            Tailored experiences for patients and healthcare facility administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Portal Card */}
          <div className="bg-white rounded-2xl border-2 border-teal-500/40 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-base text-slate-900">Patient User Portal</h3>
                </div>
                <span className="text-[10px] uppercase font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                  Route: /user
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Health Memory Vault (Full CRUD & Search)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Unified Health Timeline & In-App Reminders
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Monthly Checkup Scheduling with IST Timezone
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Health Trends with Responsive SVG Charts & Deltas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  VisitReady Printable Doctor Consultation Prep
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  15 Maharashtra Hospitals Directory & Booking
                </li>
              </ul>
            </div>
            <button
              onClick={onEnterUserPortal}
              className="mt-6 w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              Enter Patient Portal
            </button>
          </div>

          {/* Admin Portal Card */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-base text-white">Admin Operations Portal</h3>
                </div>
                <span className="text-[10px] uppercase font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
                  Route: /admin
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Operations Analytics & Dynamic Key Performance Indicators
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Full CRUD Management for 15 Maharashtra Hospitals
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Specialist Doctor Directory Management (18+ Specialists)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Demo Appointment Triage (Confirm / Cancel / Notes)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Real-time Synchronization with User Portal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Sample Bed Availability & Regional City Network
                </li>
              </ul>
            </div>
            <button
              onClick={onEnterAdminPortal}
              className="mt-6 w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              Enter Admin Operations
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
