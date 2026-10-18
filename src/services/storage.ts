import {
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
  Language,
} from '../types';
import {
  SEED_HOSPITALS,
  SEED_DOCTORS,
  SEED_RECORDS,
  SEED_MEASUREMENTS,
  SEED_CHECKUPS,
  SEED_APPOINTMENTS,
  SEED_REMINDERS,
  SEED_MEDICATIONS,
  SEED_VACCINATIONS,
  SEED_USER_PROFILE,
  DEMO_USER_ID,
} from '../data/seedData';

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Storage listener error:', e);
    }
  });
}

export function subscribeToStorage(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// LocalStorage helpers with type safety and fallback
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (e) {
    console.error(`Failed to write ${key} to storage:`, e);
  }
}

// Storage keys
const KEYS = {
  HOSPITALS: 'pulseai_hospitals_v1',
  DOCTORS: 'pulseai_doctors_v1',
  RECORDS: 'pulseai_records_v1',
  MEASUREMENTS: 'pulseai_measurements_v1',
  CHECKUPS: 'pulseai_checkups_v1',
  APPOINTMENTS: 'pulseai_appointments_v1',
  REMINDERS: 'pulseai_reminders_v1',
  MEDICATIONS: 'pulseai_medications_v1',
  VACCINATIONS: 'pulseai_vaccinations_v1',
  USER_PROFILE: 'pulseai_profile_v1',
  ADMIN_AUTH: 'pulseai_admin_auth_v1',
  LANGUAGE: 'pulseai_lang_v1',
};

// Initialize seed data if not present
export function initStorage(): void {
  if (!localStorage.getItem(KEYS.HOSPITALS)) {
    localStorage.setItem(KEYS.HOSPITALS, JSON.stringify(SEED_HOSPITALS));
  }
  if (!localStorage.getItem(KEYS.DOCTORS)) {
    localStorage.setItem(KEYS.DOCTORS, JSON.stringify(SEED_DOCTORS));
  }
  if (!localStorage.getItem(KEYS.RECORDS)) {
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(SEED_RECORDS));
  }
  if (!localStorage.getItem(KEYS.MEASUREMENTS)) {
    localStorage.setItem(KEYS.MEASUREMENTS, JSON.stringify(SEED_MEASUREMENTS));
  }
  if (!localStorage.getItem(KEYS.CHECKUPS)) {
    localStorage.setItem(KEYS.CHECKUPS, JSON.stringify(SEED_CHECKUPS));
  }
  if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(SEED_APPOINTMENTS));
  }
  if (!localStorage.getItem(KEYS.REMINDERS)) {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(SEED_REMINDERS));
  }
  if (!localStorage.getItem(KEYS.MEDICATIONS)) {
    localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(SEED_MEDICATIONS));
  }
  if (!localStorage.getItem(KEYS.VACCINATIONS)) {
    localStorage.setItem(KEYS.VACCINATIONS, JSON.stringify(SEED_VACCINATIONS));
  }
  if (!localStorage.getItem(KEYS.USER_PROFILE)) {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(SEED_USER_PROFILE));
  }
}

// Reset everything to default demonstration data
export function resetStorageToSeed(): void {
  localStorage.setItem(KEYS.HOSPITALS, JSON.stringify(SEED_HOSPITALS));
  localStorage.setItem(KEYS.DOCTORS, JSON.stringify(SEED_DOCTORS));
  localStorage.setItem(KEYS.RECORDS, JSON.stringify(SEED_RECORDS));
  localStorage.setItem(KEYS.MEASUREMENTS, JSON.stringify(SEED_MEASUREMENTS));
  localStorage.setItem(KEYS.CHECKUPS, JSON.stringify(SEED_CHECKUPS));
  localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(SEED_APPOINTMENTS));
  localStorage.setItem(KEYS.REMINDERS, JSON.stringify(SEED_REMINDERS));
  localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(SEED_MEDICATIONS));
  localStorage.setItem(KEYS.VACCINATIONS, JSON.stringify(SEED_VACCINATIONS));
  localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(SEED_USER_PROFILE));
  notifyListeners();
}

// User Profile & Authentication
export function getUserProfile(): UserProfile {
  return getItem<UserProfile>(KEYS.USER_PROFILE, SEED_USER_PROFILE);
}

export function updateUserProfile(profile: Partial<UserProfile>): void {
  const current = getUserProfile();
  const updated = { ...current, ...profile };
  setItem(KEYS.USER_PROFILE, updated);
}

// Admin Authentication
export function isAdminAuthenticated(): boolean {
  return getItem<boolean>(KEYS.ADMIN_AUTH, false);
}

export function setAdminAuthenticated(auth: boolean): void {
  setItem(KEYS.ADMIN_AUTH, auth);
}

// Language
export function getStoredLanguage(): Language {
  return getItem<Language>(KEYS.LANGUAGE, 'en');
}

export function setStoredLanguage(lang: Language): void {
  setItem(KEYS.LANGUAGE, lang);
}

// ==========================================
// HEALTH RECORDS (User-isolated CRUD)
// ==========================================
export function getHealthRecords(userId: string = DEMO_USER_ID): HealthRecord[] {
  const all = getItem<HealthRecord[]>(KEYS.RECORDS, []);
  return all
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function saveHealthRecord(record: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>, id?: string): HealthRecord {
  const all = getItem<HealthRecord[]>(KEYS.RECORDS, []);
  const now = new Date().toISOString();
  
  if (id) {
    // Edit existing
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Record not found');
    if (all[index].userId !== record.userId) throw new Error('Access denied: Unauthorized record ownership');
    
    const updated: HealthRecord = {
      ...all[index],
      ...record,
      updatedAt: now,
    };
    all[index] = updated;
    setItem(KEYS.RECORDS, all);

    // If measurement values provided, also record to measurements
    if (record.measurements && (record.measurements.systolicBp || record.measurements.weightKg || record.measurements.bloodGlucose)) {
      addMeasurementFromRecord(updated);
    }

    return updated;
  } else {
    // Create new
    const newRecord: HealthRecord = {
      ...record,
      id: `rec-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(newRecord);
    setItem(KEYS.RECORDS, all);

    // If follow-up date exists, create a smart reminder
    if (record.followUpDate) {
      addReminder({
        userId: record.userId,
        title: `Follow-up for: ${record.title}`,
        description: `Scheduled follow-up reminder from record dated ${record.date}`,
        dueDate: record.followUpDate,
        category: 'follow-up',
        relatedId: newRecord.id,
        isRead: false,
        isDismissed: false,
        createdAt: now,
      });
    }

    // If measurements are present, save to measurements history
    if (record.measurements && (record.measurements.systolicBp || record.measurements.weightKg || record.measurements.bloodGlucose)) {
      addMeasurementFromRecord(newRecord);
    }

    return newRecord;
  }
}

function addMeasurementFromRecord(record: HealthRecord) {
  if (!record.measurements) return;
  saveMeasurement({
    userId: record.userId,
    date: record.date,
    time: '12:00',
    systolicBp: record.measurements.systolicBp,
    diastolicBp: record.measurements.diastolicBp,
    heartRateBpm: record.measurements.heartRate,
    weightKg: record.measurements.weightKg,
    bloodGlucoseMgDl: record.measurements.bloodGlucose,
    notes: `Extracted from record: ${record.title}`,
  });
}

export function deleteHealthRecord(id: string, userId: string = DEMO_USER_ID): void {
  const all = getItem<HealthRecord[]>(KEYS.RECORDS, []);
  const record = all.find((r) => r.id === id);
  if (!record) return;
  if (record.userId !== userId) throw new Error('Access denied: Unauthorized record ownership');
  
  const filtered = all.filter((r) => r.id !== id);
  setItem(KEYS.RECORDS, filtered);
}

// ==========================================
// MEASUREMENTS & VITALS (User-isolated)
// ==========================================
export function getMeasurements(userId: string = DEMO_USER_ID): HealthMeasurement[] {
  const all = getItem<HealthMeasurement[]>(KEYS.MEASUREMENTS, []);
  return all
    .filter((m) => m.userId === userId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function saveMeasurement(measurement: Omit<HealthMeasurement, 'id'>, id?: string): HealthMeasurement {
  const all = getItem<HealthMeasurement[]>(KEYS.MEASUREMENTS, []);
  if (id) {
    const index = all.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Measurement not found');
    const updated: HealthMeasurement = { ...all[index], ...measurement };
    all[index] = updated;
    setItem(KEYS.MEASUREMENTS, all);
    return updated;
  } else {
    const newMeas: HealthMeasurement = {
      ...measurement,
      id: `meas-${Date.now()}`,
    };
    all.push(newMeas);
    setItem(KEYS.MEASUREMENTS, all);
    return newMeas;
  }
}

export function deleteMeasurement(id: string, userId: string = DEMO_USER_ID): void {
  const all = getItem<HealthMeasurement[]>(KEYS.MEASUREMENTS, []);
  const meas = all.find((m) => m.id === id);
  if (meas && meas.userId === userId) {
    setItem(KEYS.MEASUREMENTS, all.filter((m) => m.id !== id));
  }
}

// ==========================================
// MONTHLY CHECKUPS & REMINDERS
// ==========================================
export function getCheckups(userId: string = DEMO_USER_ID): MonthlyCheckup[] {
  const all = getItem<MonthlyCheckup[]>(KEYS.CHECKUPS, []);
  return all
    .filter((c) => c.userId === userId)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
}

export function saveCheckup(checkup: Omit<MonthlyCheckup, 'id'>, id?: string): MonthlyCheckup {
  const all = getItem<MonthlyCheckup[]>(KEYS.CHECKUPS, []);
  if (id) {
    const index = all.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Checkup not found');
    const updated: MonthlyCheckup = { ...all[index], ...checkup };
    all[index] = updated;
    setItem(KEYS.CHECKUPS, all);
    return updated;
  } else {
    const newCheckup: MonthlyCheckup = {
      ...checkup,
      id: `chk-${Date.now()}`,
    };
    all.push(newCheckup);
    setItem(KEYS.CHECKUPS, all);

    // Create an in-app reminder for the checkup if not duplicate
    addReminder({
      userId: checkup.userId,
      title: `Upcoming Checkup: ${checkup.title}`,
      description: `Scheduled on ${checkup.scheduledDate} at ${checkup.scheduledTime} with ${checkup.provider || 'Healthcare Provider'}`,
      dueDate: checkup.scheduledDate,
      dueTime: checkup.scheduledTime,
      category: 'checkup',
      relatedId: newCheckup.id,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });

    return newCheckup;
  }
}

export function markCheckupCompleted(id: string, recordedMeasurements?: MonthlyCheckup['recordedMeasurements']): void {
  const all = getItem<MonthlyCheckup[]>(KEYS.CHECKUPS, []);
  const index = all.findIndex((c) => c.id === id);
  if (index === -1) return;

  const current = all[index];
  const now = new Date();
  const completedDateStr = now.toISOString().split('T')[0];

  current.status = 'completed';
  current.completedAt = now.toISOString();
  if (recordedMeasurements) {
    current.recordedMeasurements = recordedMeasurements;
    // Persist to user's historical measurements
    saveMeasurement({
      userId: current.userId,
      date: completedDateStr,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      systolicBp: recordedMeasurements.systolicBp,
      diastolicBp: recordedMeasurements.diastolicBp,
      heartRateBpm: recordedMeasurements.heartRate,
      weightKg: recordedMeasurements.weightKg,
      bloodGlucoseMgDl: recordedMeasurements.bloodGlucose,
      notes: `Recorded during checkup: ${current.title}`,
    });
  }

  // If this is a recurring monthly checkup, schedule the NEXT occurrence for next month!
  if (current.isRecurring) {
    const currentSchedule = new Date(current.scheduledDate);
    const nextMonth = new Date(currentSchedule);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Prevent duplicates: check if a future checkup with same title already exists
    const nextDateStr = nextMonth.toISOString().split('T')[0];
    const exists = all.some((c) => c.title === current.title && c.scheduledDate === nextDateStr);
    
    if (!exists) {
      const nextCheckup: MonthlyCheckup = {
        id: `chk-${Date.now() + 1}`,
        userId: current.userId,
        title: current.title,
        scheduledDate: nextDateStr,
        scheduledTime: current.scheduledTime,
        status: 'upcoming',
        provider: current.provider,
        location: current.location,
        notes: `Automated next monthly cycle following completed checkup on ${current.scheduledDate}`,
        isRecurring: true,
        recurrenceDayOfMonth: current.recurrenceDayOfMonth,
      };
      all.push(nextCheckup);

      // Create reminder for next occurrence
      addReminder({
        userId: current.userId,
        title: `Upcoming Monthly Checkup: ${nextCheckup.title}`,
        description: `Scheduled for ${nextCheckup.scheduledDate} at ${nextCheckup.scheduledTime}`,
        dueDate: nextDateStr,
        dueTime: nextCheckup.scheduledTime,
        category: 'checkup',
        relatedId: nextCheckup.id,
        isRead: false,
        isDismissed: false,
        createdAt: now.toISOString(),
      });
    }
  }

  setItem(KEYS.CHECKUPS, all);
}

export function cancelCheckup(id: string): void {
  const all = getItem<MonthlyCheckup[]>(KEYS.CHECKUPS, []);
  const index = all.findIndex((c) => c.id === id);
  if (index !== -1) {
    all[index].status = 'cancelled';
    setItem(KEYS.CHECKUPS, all);
  }
}

// ==========================================
// REMINDERS
// ==========================================
export function getReminders(userId: string = DEMO_USER_ID): SmartReminder[] {
  const all = getItem<SmartReminder[]>(KEYS.REMINDERS, []);
  return all
    .filter((r) => r.userId === userId && !r.isDismissed)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addReminder(reminder: Omit<SmartReminder, 'id'>): SmartReminder {
  const all = getItem<SmartReminder[]>(KEYS.REMINDERS, []);
  // Prevent duplicate reminders for the same relatedId
  if (reminder.relatedId) {
    const existing = all.find((r) => r.relatedId === reminder.relatedId && r.dueDate === reminder.dueDate);
    if (existing) return existing;
  }

  const newReminder: SmartReminder = {
    ...reminder,
    id: `rem-${Date.now()}`,
  };
  all.unshift(newReminder);
  setItem(KEYS.REMINDERS, all);
  return newReminder;
}

export function markReminderRead(id: string): void {
  const all = getItem<SmartReminder[]>(KEYS.REMINDERS, []);
  const index = all.findIndex((r) => r.id === id);
  if (index !== -1) {
    all[index].isRead = true;
    setItem(KEYS.REMINDERS, all);
  }
}

export function dismissReminder(id: string): void {
  const all = getItem<SmartReminder[]>(KEYS.REMINDERS, []);
  const index = all.findIndex((r) => r.id === id);
  if (index !== -1) {
    all[index].isDismissed = true;
    setItem(KEYS.REMINDERS, all);
  }
}

// ==========================================
// APPOINTMENTS (Synced between Patient & Admin)
// ==========================================
export function getAppointments(userId?: string): DemoAppointment[] {
  const all = getItem<DemoAppointment[]>(KEYS.APPOINTMENTS, []);
  if (userId) {
    return all.filter((a) => a.userId === userId);
  }
  return all;
}

export function bookAppointment(appointment: Omit<DemoAppointment, 'id' | 'createdAt' | 'status'>): DemoAppointment {
  const all = getItem<DemoAppointment[]>(KEYS.APPOINTMENTS, []);
  const now = new Date().toISOString();
  const newAppt: DemoAppointment = {
    ...appointment,
    id: `appt-${Date.now()}`,
    status: 'Pending',
    createdAt: now,
  };
  all.unshift(newAppt);
  setItem(KEYS.APPOINTMENTS, all);

  // Add reminder
  addReminder({
    userId: newAppt.userId,
    title: `Appointment Pending with ${newAppt.doctorName}`,
    description: `Requested appointment on ${newAppt.appointmentDate} at ${newAppt.hospitalName}. Awaiting confirmation.`,
    dueDate: newAppt.appointmentDate,
    dueTime: newAppt.appointmentTime,
    category: 'appointment',
    relatedId: newAppt.id,
    isRead: false,
    isDismissed: false,
    createdAt: now,
  });

  return newAppt;
}

export function updateAppointmentStatus(
  id: string,
  status: DemoAppointment['status'],
  adminNotes?: string
): DemoAppointment {
  // Enforce admin permission check
  if (!isAdminAuthenticated()) {
    throw new Error('Unauthorized: Admin credentials required to modify appointment status');
  }

  const all = getItem<DemoAppointment[]>(KEYS.APPOINTMENTS, []);
  const index = all.findIndex((a) => a.id === id);
  if (index === -1) throw new Error('Appointment not found');

  all[index].status = status;
  if (adminNotes !== undefined) {
    all[index].adminNotes = adminNotes;
  }
  setItem(KEYS.APPOINTMENTS, all);

  // If confirmed, update the reminder
  if (status === 'Confirmed') {
    addReminder({
      userId: all[index].userId,
      title: `Appointment Confirmed: ${all[index].doctorName}`,
      description: `Your appointment on ${all[index].appointmentDate} at ${all[index].hospitalName} is confirmed!`,
      dueDate: all[index].appointmentDate,
      category: 'appointment',
      relatedId: all[index].id,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  return all[index];
}

export function cancelAppointmentByUser(id: string, userId: string = DEMO_USER_ID): void {
  const all = getItem<DemoAppointment[]>(KEYS.APPOINTMENTS, []);
  const index = all.findIndex((a) => a.id === id);
  if (index === -1) return;
  if (all[index].userId !== userId) throw new Error('Unauthorized: You can only cancel your own appointments');

  all[index].status = 'Cancelled';
  setItem(KEYS.APPOINTMENTS, all);
}

// ==========================================
// HOSPITALS & DOCTORS (Admin Management)
// ==========================================
export function getHospitals(): Hospital[] {
  return getItem<Hospital[]>(KEYS.HOSPITALS, SEED_HOSPITALS);
}

export function saveHospital(hospital: Omit<Hospital, 'id'>, id?: string): Hospital {
  if (!isAdminAuthenticated()) throw new Error('Unauthorized: Admin authorization required');
  const all = getItem<Hospital[]>(KEYS.HOSPITALS, SEED_HOSPITALS);
  
  if (id) {
    const index = all.findIndex((h) => h.id === id);
    if (index === -1) throw new Error('Hospital not found');
    const updated: Hospital = { ...all[index], ...hospital };
    all[index] = updated;
    setItem(KEYS.HOSPITALS, all);
    return updated;
  } else {
    const newHosp: Hospital = {
      ...hospital,
      id: `hosp-${Date.now()}`,
    };
    all.push(newHosp);
    setItem(KEYS.HOSPITALS, all);
    return newHosp;
  }
}

export function deleteHospital(id: string): void {
  if (!isAdminAuthenticated()) throw new Error('Unauthorized: Admin authorization required');
  const all = getItem<Hospital[]>(KEYS.HOSPITALS, SEED_HOSPITALS);
  setItem(KEYS.HOSPITALS, all.filter((h) => h.id !== id));
}

export function getDoctors(): Doctor[] {
  return getItem<Doctor[]>(KEYS.DOCTORS, SEED_DOCTORS);
}

export function saveDoctor(doctor: Omit<Doctor, 'id'>, id?: string): Doctor {
  if (!isAdminAuthenticated()) throw new Error('Unauthorized: Admin authorization required');
  const all = getItem<Doctor[]>(KEYS.DOCTORS, SEED_DOCTORS);
  
  if (id) {
    const index = all.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Doctor not found');
    const updated: Doctor = { ...all[index], ...doctor };
    all[index] = updated;
    setItem(KEYS.DOCTORS, all);
    return updated;
  } else {
    const newDoc: Doctor = {
      ...doctor,
      id: `doc-${Date.now()}`,
    };
    all.push(newDoc);
    setItem(KEYS.DOCTORS, all);
    return newDoc;
  }
}

export function deleteDoctor(id: string): void {
  if (!isAdminAuthenticated()) throw new Error('Unauthorized: Admin authorization required');
  const all = getItem<Doctor[]>(KEYS.DOCTORS, SEED_DOCTORS);
  setItem(KEYS.DOCTORS, all.filter((d) => d.id !== id));
}

// ==========================================
// MEDICATIONS & VACCINATIONS
// ==========================================
export function getMedications(userId: string = DEMO_USER_ID): MedicationItem[] {
  const all = getItem<MedicationItem[]>(KEYS.MEDICATIONS, []);
  return all.filter((m) => m.userId === userId);
}

export function saveMedication(med: Omit<MedicationItem, 'id'>, id?: string): MedicationItem {
  const all = getItem<MedicationItem[]>(KEYS.MEDICATIONS, []);
  if (id) {
    const idx = all.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Medication not found');
    all[idx] = { ...all[idx], ...med };
    setItem(KEYS.MEDICATIONS, all);
    return all[idx];
  } else {
    const newMed: MedicationItem = { ...med, id: `med-${Date.now()}` };
    all.push(newMed);
    setItem(KEYS.MEDICATIONS, all);
    return newMed;
  }
}

export function deleteMedication(id: string): void {
  const all = getItem<MedicationItem[]>(KEYS.MEDICATIONS, []);
  setItem(KEYS.MEDICATIONS, all.filter((m) => m.id !== id));
}

export function getVaccinations(userId: string = DEMO_USER_ID): VaccinationItem[] {
  const all = getItem<VaccinationItem[]>(KEYS.VACCINATIONS, []);
  return all.filter((v) => v.userId === userId);
}

export function saveVaccination(vac: Omit<VaccinationItem, 'id'>, id?: string): VaccinationItem {
  const all = getItem<VaccinationItem[]>(KEYS.VACCINATIONS, []);
  if (id) {
    const idx = all.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Vaccination not found');
    all[idx] = { ...all[idx], ...vac };
    setItem(KEYS.VACCINATIONS, all);
    return all[idx];
  } else {
    const newVac: VaccinationItem = { ...vac, id: `vac-${Date.now()}` };
    all.push(newVac);
    setItem(KEYS.VACCINATIONS, all);
    return newVac;
  }
}

export function deleteVaccination(id: string): void {
  const all = getItem<VaccinationItem[]>(KEYS.VACCINATIONS, []);
  setItem(KEYS.VACCINATIONS, all.filter((v) => v.id !== id));
}
