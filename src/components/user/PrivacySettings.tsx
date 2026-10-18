import React, { useState } from 'react';
import { UserProfile, Language } from '../../types';
import { updateUserProfile, resetStorageToSeed } from '../../services/storage';
import {
  ShieldCheck,
  Database,
  Lock,
  Download,
  RotateCcw,
  Check,
  AlertTriangle,
  User,
} from 'lucide-react';

interface PrivacySettingsProps {
  userProfile: UserProfile;
  language: Language;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ userProfile, language }) => {
  const isMr = language === 'mr';
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [city, setCity] = useState(userProfile.city || '');
  const [age, setAge] = useState(userProfile.age ? String(userProfile.age) : '48');
  const [bloodGroup, setBloodGroup] = useState(userProfile.bloodGroup || 'B+');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      age: Number(age) || undefined,
      bloodGroup: bloodGroup.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportJson = () => {
    const dataToExport = {
      userProfile,
      records: JSON.parse(localStorage.getItem('pulseai_records_v1') || '[]'),
      measurements: JSON.parse(localStorage.getItem('pulseai_measurements_v1') || '[]'),
      checkups: JSON.parse(localStorage.getItem('pulseai_checkups_v1') || '[]'),
      appointments: JSON.parse(localStorage.getItem('pulseai_appointments_v1') || '[]'),
      exportDate: new Date().toISOString(),
      platform: 'PulseAI Healthcare Continuity Engine',
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulseai-health-backup-${userProfile.id}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        isMr
          ? 'तुम्हाला सर्व माहिती मूळ प्रात्यक्षिक (Demo Seed) डेटामध्ये रीसेट करायची आहे का?'
          : 'Reset all platform data back to standard hackathon demonstration seed dataset?'
      )
    ) {
      resetStorageToSeed();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
          {isMr ? 'डेटा गोपनीयता आणि स्टोरेज आर्किटेक्चर' : 'Data Privacy & Storage Architecture'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isMr
            ? 'रुग्ण डेटा गोपनीयता, स्थानिक प्रात्यक्षिक साठा आणि सुरक्षित क्लाउड डेटाबेस स्पष्टीकरण.'
            : 'Patient record ownership boundaries, local demo store vs production PostgreSQL database.'}
        </p>
      </div>

      {/* Two Column Layout: Architecture Notice & Profile Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Details Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              {isMr ? 'रुग्ण प्रोफाईल तपशील' : 'Patient Profile Details'}
            </h3>
            <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium border border-teal-200">
              ID: {userProfile.id}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City (Maharashtra)</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Profile Updated!
                </span>
              ) : (
                <span></span>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* Storage Architecture & Data Boundaries */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-600" />
              Storage Boundaries & Security
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Isolated Scope
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block font-semibold mb-0.5">
                1. Hackathon Demonstration Mode (Local Repository)
              </strong>
              Currently running on PulseAI reactive local storage layer with strict user ownership checks. Zero paid cloud infrastructure cost (₹0 mandatory spend).
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block font-semibold mb-0.5">
                2. Enterprise Production Architecture (Supabase / PostgreSQL)
              </strong>
              In production deployment, this client repository maps directly to PostgreSQL tables secured by Row Level Security (RLS) policies:
              <code className="block mt-1 p-1.5 bg-white border border-slate-200 rounded text-[11px] text-teal-800 font-mono">
                CREATE POLICY "patient_isolation" ON health_records FOR ALL USING (auth.uid() = user_id);
              </code>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block font-semibold mb-0.5">
                3. Privacy Safeguard Notice
              </strong>
              PulseAI does not transmit sensitive health records to third-party ad networks or unverified cloud brokers.
            </div>
          </div>

          {/* Action Buttons: Export JSON & Reset Demo */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-teal-700" />
              Export Health Vault (JSON)
            </button>

            <button
              onClick={handleResetData}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              Reset to Demo Seed Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
