# PulseAI — Smarter Healthcare, Simplified
### AI-Powered Healthcare Continuity Platform for Maharashtra & India
**National-Level Hackathon MVP

---

## 1. Executive Summary & Problem-Solution Fit

**The Problem:** Patients frequently lose track of medical records, forget routine chronic checkups, miss post-consultation follow-ups, and struggle to organize clinical history before seeing a doctor. Healthcare interactions remain fragmented, isolated events without context.

**The PulseAI Solution:** PulseAI connects health memory, a personal timeline, checkup scheduling, reminders, recorded vitals measurements, and consultation preparation in one unified, accessible platform.

**Core Innovation — The PulseAI Continuity Engine:**
1. A user saves a health record (e.g. lab report or consultation note).
2. The record automatically appears in the Unified Health Timeline.
3. The user schedules an upcoming monthly checkup.
4. PulseAI displays the upcoming checkup and its active in-app reminder.
5. The user records new measurements during or after the checkup.
6. PulseAI compares actual recorded measurements across dates (Health Trends).
7. The user prepares a structured summary and questions for their clinician using **VisitReady™**.

---

## 2. Two Distinct Operating Portals

| Portal | Route | Key Modules & Capabilities |
| :--- | :--- | :--- |
| **Patient User Portal** | `/user` | Continuity Dashboard, Health Memory Vault (CRUD), Unified Timeline, Monthly Checkups, Smart Reminders, Health Trends (SVG charts with deltas), AI Health Navigator (TrustGuard), VisitReady Consultation Prep, Maharashtra Hospital & Doctor Directory, Appointment Tracking, Meds & Vaccines, Wellness Tools, Privacy Settings. |
| **Admin Operations Portal** | `/admin/login`<br>`/admin` | Operational analytics (total hospitals, doctors, appointments, bed occupancy %, city coverage), Hospital Management (CRUD), Doctor Management (CRUD), Demo Appointments triage (Pending, Confirmed, Cancelled) with real-time bidirectional synchronization. |

---

## 3. Responsible AI & Safety Protocol (PulseAI TrustGuard)


- **Deterministic Emergency Screening:** Pre-screens user input for acute life-threatening symptoms (e.g. crushing chest pain radiating to arm, acute respiratory failure, sudden facial drooping/slurred speech, severe hemorrhage, anaphylaxis) **before** any AI or query processing.
- **Immediate India Helplines:** Immediately presents **112 (National Emergency Helpline)** and **108 (Ambulance Service)** with instant call triggers.
- **Clinical Boundaries:** Does not claim to diagnose, prescribe medications, or replace a licensed healthcare practitioner.
- **Bilingual Interface:** Instant toggle between English and Marathi (मराठी) across the entire platform.

---

## 4. Maharashtra Healthcare Directory

- **15 Demonstration Hospitals** across **10 Maharashtra Cities**:
  - Mumbai, Pune, Nagpur, Nashik, Chhatrapati Sambhajinagar, Thane, Solapur, Kolhapur, Amravati, Nanded.
- **18+ Specialist Doctors** across Cardiology, Neurology, General Medicine, Pediatrics, Orthopedics, Endocrinology, and Nephrology.
- Search and filter by city, specialty, and hospital name.
- Direct demo appointment request with immediate synchronization into Admin triage.

---

## 5. Acceptance Tests & Verification Results

All 13 automated acceptance tests executed and passed (100%):

```text
TEST 1: Exactly 15 Hospitals and 10 Maharashtra Cities in Seed Directory ... ✅ PASSED
TEST 2: At least 18 Specialist Doctors represented across facilities ... ✅ PASSED
TEST 3: Deterministic Emergency Alert triggers immediately on acute symptoms (Chest Pain) ... ✅ PASSED
TEST 4: Deterministic Emergency Alert triggers in Marathi on acute shortness of breath ... ✅ PASSED
TEST 5: TrustGuard provides non-emergency educational guidance with suggested questions ... ✅ PASSED
TEST 6: Multi-user record isolation: User cannot access another user records ... ✅ PASSED
TEST 7: Unauthorized record deletion/tampering across user boundaries throws error ... ✅ PASSED
TEST 8: Health Record with vitals automatically syncs to historical Measurements ... ✅ PASSED
TEST 9: Recurring Checkup completion schedules next month occurrence and updates Vitals ... ✅ PASSED
TEST 10: Smart Reminders prevent duplicate creation for the same event and due date ... ✅ PASSED
TEST 11: Admin Authorization: Unauthorized management operations are strictly blocked ... ✅ PASSED
TEST 12: Shared Data Layer: Patient Demo Appointment appears in Admin triage and status syncs ... ✅ PASSED
TEST 13: Bilingual Translations: English and Marathi dictionaries are intact ... ✅ PASSED
```

---

## 6. Exact Windows Commands to Run

### Install Dependencies:
```powershell
npm.cmd install
```

### Run Automated Acceptance Suite:
```powershell
npm.cmd test
```

### Build for Production:
```powershell
npm.cmd run build
```

### Launch Development Server:
```powershell
npm.cmd run dev
```
*(Open browser at `http://localhost:5173/`)*

---

## 7. Hackathon 3-Minute Demonstration Script

1. **Problem & Landing Page (`/`):**
   - Point out the dual portal buttons ("Patient Portal" & "Admin Operations").
   - The 112/108 emergency banner.
   - Switch language to **मराठी** and back to **English** to demonstrate bilingual readiness.

2. **Continuity Engine in Action (`/user`):**
   - **Step 1 (Memory):** Open Health Memory. Create or view a health record with attached BP measurements (e.g., 128/82 mmHg) and a follow-up date.
   - **Step 2 (Timeline):** Show how the record instantly appears in the Unified Health Timeline along with checkups and appointments.
   - **Step 3 (Checkups & Reminders):** Open Monthly Checkups. Schedule or mark a monthly recurring checkup as completed. Watch the next monthly occurrence automatically generate and trigger an in-app reminder in the top bell icon!
   - **Step 4 (Trends):** Open Health Trends. View the responsive SVG Blood Pressure curve comparing past vs current readings, calculating the exact numerical delta (+4 / +2 mmHg) without fabricating any data points.

3. **TrustGuard Safety (`/user` -> AI Navigator):**
   - Click the prompt chip: *"⚠️ Test Emergency Alert (Chest Pain)"*.
   - Show how the deterministic filter instantly catches acute cardiac symptoms and displays the 112 / 108 emergency card with direct call links before any AI delays.
   - Click *"Understanding High Blood Pressure"* to demonstrate educational guidance and suggested questions for the clinician.

4. **VisitReady Doctor Consultation Prep (`/user` -> VisitReady Prep):**
   - Attach stored records and enter symptoms and duration in user words.
   - Show the auto-compiled, editable brief with prepared questions.
   - Click *"Copy Text"* or *"Print / Export PDF"*.

5. **Appointment Booking & Admin Triage (`/user` -> Hospitals & Doctors):**
   - Book a demo appointment with Dr. Aarav Deshmukh at Sahyadri Pulse Hospital, Pune.
   - Notice the status starts as "Pending".
   - Navigate to `/admin/login` (Passcode: `pulseai2026`).
   - Open Demo Appointments triage. Change status to **Confirmed** and add OPD notes.
   - Navigate back to `/user` -> My Appointments. Show that the status is now **Confirmed** with the hospital notes visible in real-time!

---

## 8. Honest Limitations & Production Roadmap

- **Demonstration Storage vs Production DB:**  In production, this maps to PostgreSQL with Row Level Security (RLS) via Supabase/PostgREST. Real patient medical data should never be stored in plaintext browser local storage.
- **Clinical Boundaries:** PulseAI is an informational organization and preparation tool. It does not provide medical diagnoses, clinical triage, or drug prescriptions.
