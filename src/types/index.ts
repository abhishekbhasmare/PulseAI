export type Language = 'en' | 'mr';

export type UserRole = 'patient' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  city?: string;
  age?: number;
  bloodGroup?: string;
}

export type RecordCategory =
  | 'Routine checkup'
  | 'Doctor consultation'
  | 'Laboratory report'
  | 'Medication record'
  | 'Vaccination'
  | 'Follow-up'
  | 'Other';

export interface HealthMeasurement {
  id: string;
  userId: string;
  date: string; // ISO date YYYY-MM-DD
  time?: string;
  weightKg?: number;
  systolicBp?: number;
  diastolicBp?: number;
  heartRateBpm?: number;
  bloodGlucoseMgDl?: number;
  glucoseType?: 'fasting' | 'post-prandial' | 'random';
  customType?: string;
  customValue?: number;
  customUnit?: string;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  userId: string;
  title: string;
  category: RecordCategory;
  date: string; // YYYY-MM-DD
  provider?: string;
  notes: string;
  measurements?: {
    systolicBp?: number;
    diastolicBp?: number;
    heartRate?: number;
    weightKg?: number;
    bloodGlucose?: number;
  };
  followUpDate?: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

export type CheckupStatus = 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';

export interface MonthlyCheckup {
  id: string;
  userId: string;
  title: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  status: CheckupStatus;
  provider?: string;
  location?: string;
  notes?: string;
  isRecurring: boolean;
  recurrenceDayOfMonth?: number;
  recordedMeasurements?: {
    systolicBp?: number;
    diastolicBp?: number;
    weightKg?: number;
    bloodGlucose?: number;
    heartRate?: number;
  };
  completedAt?: string;
  reminderSent?: boolean;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface DemoAppointment {
  id: string;
  userId: string;
  patientName: string;
  patientPhone: string;
  hospitalId: string;
  hospitalName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
  status: AppointmentStatus;
  reason: string;
  adminNotes?: string;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  city: string; // One of 10 Maharashtra cities
  address: string;
  specialties: string[];
  totalBeds: number;
  availableBeds: number;
  contactNumber: string;
  description: string;
  sampleTimings: string;
  emergencyAvailable: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  hospitalId: string;
  hospitalName: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  city: string;
  consultationFee: number;
  availableDays: string[];
  sampleSchedule: string;
}

export interface SmartReminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime?: string;
  category: 'checkup' | 'appointment' | 'medication' | 'vaccination' | 'follow-up';
  relatedId?: string;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
}

export interface MedicationItem {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string; // e.g. "Twice a day after food"
  instructions: string;
  startDate: string;
  endDate?: string;
  reminderTime?: string;
  isActive: boolean;
}

export interface VaccinationItem {
  id: string;
  userId: string;
  vaccineName: string;
  doseNumber: number;
  vaccinationDate: string;
  nextRecommendedDate?: string;
  notes: string;
}

export interface WellnessData {
  userId: string;
  hydrationGoalMl: number;
  currentHydrationMl: number;
  hydrationLogs: { date: string; amountMl: number }[];
  wellnessGoals: { id: string; goal: string; completed: boolean; targetDate?: string }[];
}

export interface VisitReadySummary {
  id: string;
  userId: string;
  appointmentId?: string;
  doctorName?: string;
  consultationDate: string;
  mainConcern: string;
  symptoms: string;
  symptomDuration: string;
  relevantRecords: string[]; // Record IDs or titles
  patientNotes: string;
  questionsForDoctor: string[];
  unknowns: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  textMr?: string;
  isEmergencyAlert?: boolean;
  emergencyType?: string;
  suggestedQuestions?: string[];
  timestamp: string;
}
