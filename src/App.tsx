import React, { useState, useEffect } from 'react';
import {
  Language,
  HealthRecord,
  HealthMeasurement,
  MonthlyCheckup,
  DemoAppointment,
  Hospital,
  Doctor,
  SmartReminder,
  MedicationItem,
  VaccinationItem,
  UserProfile,
} from './types';
import {
  initStorage,
  subscribeToStorage,
  getHealthRecords,
  getMeasurements,
  getCheckups,
  getAppointments,
  getHospitals,
  getDoctors,
  getReminders,
  getMedications,
  getVaccinations,
  getUserProfile,
  isAdminAuthenticated,
  setAdminAuthenticated,
  getStoredLanguage,
  setStoredLanguage,
} from './services/storage';

// Common Components
import { Header } from './components/common/Header';

// Landing Page
import { LandingPage } from './components/landing/LandingPage';

// User Portal Components
import { UserSidebar, UserTab } from './components/user/UserSidebar';
import { UserDashboard } from './components/user/UserDashboard';
import { HealthMemory } from './components/user/HealthMemory';
import { HealthTimeline } from './components/user/HealthTimeline';
import { MonthlyCheckups } from './components/user/MonthlyCheckups';
import { HealthTrends } from './components/user/HealthTrends';
import { TrustGuardChat } from './components/user/TrustGuardChat';
import { VisitReady } from './components/user/VisitReady';
import { HospitalDirectory } from './components/user/HospitalDirectory';
import { AppointmentsList } from './components/user/AppointmentsList';
import { MedicationTracker } from './components/user/MedicationTracker';
import { WellnessTools } from './components/user/WellnessTools';
import { PrivacySettings } from './components/user/PrivacySettings';

// Admin Portal Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminSidebar, AdminTab } from './components/admin/AdminSidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminHospitals } from './components/admin/AdminHospitals';
import { AdminDoctors } from './components/admin/AdminDoctors';
import { AdminAppointments } from './components/admin/AdminAppointments';

export function App() {
  // Initialize storage once on mount
  useEffect(() => {
    initStorage();
  }, []);

  // Language state
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());

  // Routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('/admin')) return hash;
    if (hash.startsWith('/user')) return hash;
    return '/';
  });

  // User Portal Tab
  const [userTab, setUserTab] = useState<UserTab>('dashboard');

  // Admin Portal Tab
  const [adminTab, setAdminTab] = useState<AdminTab>('analytics');

  // Mobile menu open state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reactive Data States from Storage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getUserProfile());
  const [records, setRecords] = useState<HealthRecord[]>(() => getHealthRecords());
  const [measurements, setMeasurements] = useState<HealthMeasurement[]>(() => getMeasurements());
  const [checkups, setCheckups] = useState<MonthlyCheckup[]>(() => getCheckups());
  const [appointments, setAppointments] = useState<DemoAppointment[]>(() => getAppointments());
  const [hospitals, setHospitals] = useState<Hospital[]>(() => getHospitals());
  const [doctors, setDoctors] = useState<Doctor[]>(() => getDoctors());
  const [reminders, setReminders] = useState<SmartReminder[]>(() => getReminders());
  const [medications, setMedications] = useState<MedicationItem[]>(() => getMedications());
  const [vaccinations, setVaccinations] = useState<VaccinationItem[]>(() => getVaccinations());
  const [adminAuth, setAdminAuth] = useState<boolean>(() => isAdminAuthenticated());

  // Subscribe to storage updates
  useEffect(() => {
    const updateAllData = () => {
      setUserProfile(getUserProfile());
      setRecords(getHealthRecords());
      setMeasurements(getMeasurements());
      setCheckups(getCheckups());
      setAppointments(getAppointments());
      setHospitals(getHospitals());
      setDoctors(getDoctors());
      setReminders(getReminders());
      setMedications(getMedications());
      setVaccinations(getVaccinations());
      setAdminAuth(isAdminAuthenticated());
    };

    return subscribeToStorage(updateAllData);
  }, []);

  // Update hash when path changes
  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLanguage = (lang: Language) => {
    setLanguage(lang);
    setStoredLanguage(lang);
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setAdminAuth(false);
    navigate('/');
  };

  // Determine current role based on active path
  const currentRole = currentPath.startsWith('/admin') ? 'admin' : 'patient';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        currentPath={currentPath}
        onNavigate={navigate}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        userId={userProfile.id}
        userName={userProfile.name}
        onToggleMobileMenu={
          currentPath !== '/' ? () => setIsMobileMenuOpen(!isMobileMenuOpen) : undefined
        }
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col">
        {/* Route 1: Landing Page */}
        {currentPath === '/' && (
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
            <LandingPage
              onEnterUserPortal={() => navigate('/user')}
              onEnterAdminPortal={() => navigate('/admin')}
              language={language}
            />
          </main>
        )}

        {/* Route 2: Patient User Portal */}
        {currentPath.startsWith('/user') && (
          <div className="flex-1 flex max-w-7xl mx-auto w-full">
            {/* User Sidebar */}
            <UserSidebar
              activeTab={userTab}
              onSelectTab={setUserTab}
              language={language}
              isOpenMobile={isMobileMenuOpen}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
            />

            {/* User Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
              {userTab === 'dashboard' && (
                <UserDashboard
                  records={records}
                  measurements={measurements}
                  checkups={checkups}
                  reminders={reminders}
                  onSelectTab={setUserTab}
                  language={language}
                />
              )}

              {userTab === 'memory' && (
                <HealthMemory
                  records={records}
                  userId={userProfile.id}
                  language={language}
                />
              )}

              {userTab === 'timeline' && (
                <HealthTimeline
                  records={records}
                  checkups={checkups}
                  appointments={appointments}
                  measurements={measurements}
                  medications={medications}
                  vaccinations={vaccinations}
                  language={language}
                />
              )}

              {userTab === 'checkups' && (
                <MonthlyCheckups
                  checkups={checkups}
                  userId={userProfile.id}
                  language={language}
                />
              )}

              {userTab === 'trends' && (
                <HealthTrends
                  measurements={measurements}
                  userId={userProfile.id}
                  language={language}
                />
              )}

              {userTab === 'trustguard' && (
                <TrustGuardChat language={language} />
              )}

              {userTab === 'visitready' && (
                <VisitReady
                  records={records}
                  appointments={appointments}
                  checkups={checkups}
                  measurements={measurements}
                  language={language}
                />
              )}

              {userTab === 'directory' && (
                <HospitalDirectory
                  hospitals={hospitals}
                  doctors={doctors}
                  userId={userProfile.id}
                  userName={userProfile.name}
                  userPhone={userProfile.phone}
                  language={language}
                  onAppointmentBooked={() => setUserTab('appointments')}
                />
              )}

              {userTab === 'appointments' && (
                <AppointmentsList
                  appointments={appointments}
                  userId={userProfile.id}
                  language={language}
                  onNavigateToDirectory={() => setUserTab('directory')}
                />
              )}

              {userTab === 'medications' && (
                <MedicationTracker
                  medications={medications}
                  vaccinations={vaccinations}
                  userId={userProfile.id}
                  language={language}
                />
              )}

              {userTab === 'wellness' && (
                <WellnessTools language={language} />
              )}

              {userTab === 'privacy' && (
                <PrivacySettings
                  userProfile={userProfile}
                  language={language}
                />
              )}
            </main>
          </div>
        )}

        {/* Route 3: Admin Operations Portal */}
        {currentPath.startsWith('/admin') && (
          <div className="flex-1 flex flex-col">
            {!adminAuth ? (
              <AdminLogin
                onLoginSuccess={() => setAdminAuth(true)}
                onBackToLanding={() => navigate('/')}
              />
            ) : (
              <div className="flex-1 flex max-w-7xl mx-auto w-full">
                {/* Admin Sidebar */}
                <AdminSidebar
                  activeTab={adminTab}
                  onSelectTab={setAdminTab}
                  onLogout={handleAdminLogout}
                  isOpenMobile={isMobileMenuOpen}
                  onCloseMobile={() => setIsMobileMenuOpen(false)}
                />

                {/* Admin Main Content Area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
                  {adminTab === 'analytics' && (
                    <AdminDashboard
                      hospitals={hospitals}
                      doctors={doctors}
                      appointments={appointments}
                      onSelectTab={setAdminTab}
                    />
                  )}

                  {adminTab === 'hospitals' && (
                    <AdminHospitals hospitals={hospitals} />
                  )}

                  {adminTab === 'doctors' && (
                    <AdminDoctors doctors={doctors} hospitals={hospitals} />
                  )}

                  {adminTab === 'appointments' && (
                    <AdminAppointments appointments={appointments} />
                  )}
                </main>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Application Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-800">PulseAI — Smarter Healthcare, Simplified</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              National-Level Hackathon Prototype • Zero Mandatory Cost (₹0) • Credit-Efficient Implementation
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => navigate('/user')} className="hover:text-teal-700">Patient Portal</button>
            <button onClick={() => navigate('/admin')} className="hover:text-sky-700">Admin Operations</button>
            <span className="text-slate-300">|</span>
            <span>Emergency: 112 / 108</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
