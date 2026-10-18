import React, { useState } from 'react';
import {
  HealthRecord,
  DemoAppointment,
  MonthlyCheckup,
  HealthMeasurement,
  Language,
} from '../../types';
import {
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  Calendar,
  User,
  HelpCircle,
  AlertCircle,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface VisitReadyProps {
  records: HealthRecord[];
  appointments: DemoAppointment[];
  checkups: MonthlyCheckup[];
  measurements: HealthMeasurement[];
  language: Language;
}

export const VisitReady: React.FC<VisitReadyProps> = ({
  records,
  appointments,
  checkups,
  measurements,
  language,
}) => {
  const isMr = language === 'mr';

  // Step 1: Input Form State
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(
    appointments[0]?.id || ''
  );
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>(
    records.slice(0, 2).map((r) => r.id)
  );
  const [mainConcern, setMainConcern] = useState(
    'Routine follow-up on blood pressure control and lifestyle modifications'
  );
  const [symptoms, setSymptoms] = useState(
    'Occasional mild lightheadedness in the morning after waking up; otherwise feeling energetic.'
  );
  const [duration, setDuration] = useState('Last 2 weeks (intermittent)');
  const [lifestyleNotes, setLifestyleNotes] = useState(
    'Walking 30 minutes 4 days/week. Reduced salt intake as advised.'
  );
  const [questions, setQuestions] = useState<string[]>([
    'Is my systolic blood pressure trending in the safe target zone?',
    'Should I continue my current 20mg Telmisartan dosage or adjust timing?',
    'When should my next routine lipid and kidney panel be repeated?',
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [unknowns, setUnknowns] = useState(
    'Unsure if the lightheadedness is related to morning posture or medication timing.'
  );

  // Generated Summary State (Fully editable)
  const [isGenerated, setIsGenerated] = useState(true);
  const [copied, setCopied] = useState(false);

  // Toggle record selection
  const handleToggleRecord = (id: string) => {
    setSelectedRecordIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const selectedAppt = appointments.find((a) => a.id === selectedAppointmentId);
  const selectedRecordsList = records.filter((r) => selectedRecordIds.includes(r.id));
  const latestVitals = measurements[measurements.length - 1];

  const handleCopy = () => {
    const textToCopy = `PULSEAI VISITREADY CONSULTATION BRIEF
Prepared: ${new Date().toLocaleDateString()}
--------------------------------------------------
DOCTOR / APPOINTMENT: ${selectedAppt ? `${selectedAppt.doctorName} (${selectedAppt.hospitalName})` : 'General Clinical Consultation'}
DATE: ${selectedAppt ? selectedAppt.appointmentDate : 'Upcoming'}

1. MAIN CONCERN:
${mainConcern}

2. USER-REPORTED SYMPTOMS & DURATION:
• Symptoms: ${symptoms}
• Duration: ${duration}

3. LATEST RECORDED VITALS (Objective measurements):
${latestVitals ? `• Blood Pressure: ${latestVitals.systolicBp}/${latestVitals.diastolicBp} mmHg (Date: ${latestVitals.date})
• Body Weight: ${latestVitals.weightKg || '--'} kg
• Blood Glucose: ${latestVitals.bloodGlucoseMgDl || '--'} mg/dL` : 'No vitals logged'}

4. SELECTED HISTORICAL RECORDS ATTACHED:
${selectedRecordsList.map((r) => `• [${r.date}] ${r.title} (${r.category}) - ${r.notes}`).join('\n')}

5. RELEVANT USER-ENTERED NOTES / LIFESTYLE:
${lifestyleNotes}

6. QUESTIONS FOR THE HEALTHCARE PROFESSIONAL:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

7. WHAT REMAINS UNKNOWN / UNCERTAIN:
${unknowns}

--------------------------------------------------
NOTICE: Prepared by user via PulseAI. This summary strictly reflects user-entered observations and stored records. It is not an automated medical diagnosis or prescription.`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-teal-600" />
            {isMr ? 'व्हिजिट-रेडी — डॉक्टर भेट पूर्वतयारी' : 'VisitReady — Doctor Consultation Prep'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isMr
              ? 'डॉक्टरांच्या भेटीसाठी तुमची लक्षणे, मागील नोंदी आणि महत्त्वाचे प्रश्न संकलित करून छापील सारांश तयार करा.'
              : 'Prepare an organized, concise medical summary and targeted questions for your doctor visit.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (isMr ? 'कॉपी झाले!' : 'Copied!') : (isMr ? 'कॉपी करा' : 'Copy Text')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{isMr ? 'प्रिंट / PDF' : 'Print / Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Setup Inputs on Left, Real-time Printable Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Builder (Hidden in print) */}
        <div className="lg:col-span-5 space-y-4 no-print">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              {isMr ? 'पूर्वतयारी तपशील' : 'Consultation Setup'}
            </h3>

            {/* Select Appointment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'संबंधित अपॉइंटमेंट निवडा' : 'Select Scheduled Appointment'}
              </label>
              <select
                value={selectedAppointmentId}
                onChange={(e) => setSelectedAppointmentId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="">{isMr ? '-- स्वतंत्र भेट (अपॉइंटमेंट नाही) --' : '-- General / Walk-in Consultation --'}</option>
                {appointments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.doctorName} ({a.appointmentDate} @ {a.hospitalName})
                  </option>
                ))}
              </select>
            </div>

            {/* Main Concern */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'भेटीचे मुख्य कारण *' : 'Primary Concern / Reason for Visit *'}
              </label>
              <input
                type="text"
                value={mainConcern}
                onChange={(e) => setMainConcern(e.target.value)}
                placeholder="e.g. Follow-up on blood pressure and review medication"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Symptoms in Own Words */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'तुमच्या शब्दांत लक्षणे *' : 'Symptoms in Your Own Words *'}
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe how you feel, when it occurs, what makes it better/worse..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'लक्षणांचा कालावधी' : 'Duration / Frequency'}
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. Past 10 days, mostly mornings"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Relevant Health Records to attach */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'जोडण्यासाठी मागील नोंदी निवडा' : 'Attach Relevant Stored Records'}
              </label>
              <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 rounded-lg p-2 bg-slate-50/50">
                {records.map((r) => (
                  <label
                    key={r.id}
                    className="flex items-start gap-2 p-1.5 rounded hover:bg-white text-xs cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRecordIds.includes(r.id)}
                      onChange={() => handleToggleRecord(r.id)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-slate-800 block truncate">{r.title}</span>
                      <span className="text-[10px] text-slate-500">
                        {r.date} • {r.category}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Lifestyle / Patient Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'जीवनशैली व इतर माहिती' : 'Lifestyle Habits / Context You Wish to Share'}
              </label>
              <input
                type="text"
                value={lifestyleNotes}
                onChange={(e) => setLifestyleNotes(e.target.value)}
                placeholder="e.g. Diet, physical activity, stressors..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Questions for Doctor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'डॉक्टरांना विचारायचे प्रश्न' : 'Questions for the Doctor'}
              </label>
              <div className="space-y-1.5 mb-2">
                {questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-200"
                  >
                    <span className="truncate pr-2">
                      {idx + 1}. {q}
                    </span>
                    <button
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-red-500 hover:text-red-700 text-xs px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder={isMr ? 'नवीन प्रश्न लिहा...' : 'Type another question...'}
                  className="flex-1 text-xs p-2 border border-slate-300 rounded-lg"
                />
                <button
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg shrink-0"
                >
                  {isMr ? 'जोडा' : 'Add'}
                </button>
              </div>
            </div>

            {/* Unknowns */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'अजून काय समजलेले नाही / अज्ञात' : 'What Remains Unknown / Questions You Are Unsure About'}
              </label>
              <input
                type="text"
                value={unknowns}
                onChange={(e) => setUnknowns(e.target.value)}
                placeholder="e.g. Unsure if my symptoms correlate with meal times"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Editable Printable Consultation Brief Document */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
            {/* Document Header */}
            <div className="border-b-2 border-teal-700 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-slate-900">PulseAI VisitReady™</span>
                    <span className="text-[10px] uppercase font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                      Consultation Brief
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Structured Clinical Preparation Summary • Patient Self-Report & Verified Continuity Records
                  </p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <span>Prepared: {new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                </div>
              </div>

              {/* Consultation Target Info */}
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Consultation With</span>
                  <span className="font-bold text-slate-800">
                    {selectedAppt ? selectedAppt.doctorName : 'Attending Healthcare Professional'}
                  </span>
                  <span className="text-slate-500 block text-[11px]">
                    {selectedAppt ? selectedAppt.hospitalName : 'OPD / Clinic Visit'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Scheduled Date</span>
                  <span className="font-bold text-slate-800">
                    {selectedAppt ? `${selectedAppt.appointmentDate} @ ${selectedAppt.appointmentTime}` : 'Upcoming Walk-in'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 1: Main Concern */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                1. Primary Reason for Visit
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 bg-slate-50/70 p-3 rounded-lg border border-slate-100 font-medium">
                {mainConcern || 'Not specified'}
              </p>
            </div>

            {/* Section 2: Symptoms & Duration */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                2. Patient-Reported Symptoms & Duration
              </h4>
              <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100 text-xs sm:text-sm space-y-1">
                <p className="text-slate-800">
                  <strong>Symptoms:</strong> {symptoms || 'None reported'}
                </p>
                <p className="text-slate-600">
                  <strong>Duration / Pattern:</strong> {duration || 'Unspecified'}
                </p>
              </div>
            </div>

            {/* Section 3: Latest Stored Objective Vitals */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                3. Recent Objective Vitals (Stored in PulseAI Continuity Engine)
              </h4>
              {latestVitals ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-teal-50/50 rounded-lg border border-teal-100">
                    <span className="text-[10px] text-teal-800 block">Blood Pressure</span>
                    <span className="font-bold text-teal-950">
                      {latestVitals.systolicBp}/{latestVitals.diastolicBp} mmHg
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{latestVitals.date}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Body Weight</span>
                    <span className="font-bold text-slate-800">{latestVitals.weightKg || '--'} kg</span>
                  </div>

                  <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-100">
                    <span className="text-[10px] text-sky-700 block">Blood Glucose</span>
                    <span className="font-bold text-sky-950">
                      {latestVitals.bloodGlucoseMgDl || '--'} mg/dL
                    </span>
                  </div>

                  <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-100">
                    <span className="text-[10px] text-rose-700 block">Heart Rate</span>
                    <span className="font-bold text-rose-950">{latestVitals.heartRateBpm || '--'} bpm</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No recent vitals on file.</p>
              )}
            </div>

            {/* Section 4: Attached Historical Records */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                4. Selected Historical Records Attached
              </h4>
              {selectedRecordsList.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No historical records attached.</p>
              ) : (
                <div className="space-y-2">
                  {selectedRecordsList.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rec.title}</span>
                        <span className="text-[10px] text-slate-500">
                          {rec.date} ({rec.category})
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] line-clamp-2">{rec.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 5: Relevant Lifestyle Habits */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                5. Relevant Lifestyle Notes
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                {lifestyleNotes || 'None specified'}
              </p>
            </div>

            {/* Section 6: Questions for Clinician */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                6. Questions Prepared for the Healthcare Professional
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 bg-teal-50/40 p-3 rounded-lg border border-teal-100 text-xs sm:text-sm text-teal-950">
                {questions.map((q, idx) => (
                  <li key={idx} className="font-medium">
                    {q}
                  </li>
                ))}
              </ol>
            </div>

            {/* Section 7: What Remains Unknown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                7. What Remains Unknown / Unclear
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50/70 p-3 rounded-lg border border-slate-100 italic">
                "{unknowns || 'No unknowns specified'}"
              </p>
            </div>

            {/* Document Footer Disclaimer */}
            <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed">
              <strong>Medical Disclaimer:</strong> This document is generated for consultation preparation purposes only based on patient-entered information and stored personal records. It is not an automated medical diagnosis, clinical prescription, or triage report. Always review in consultation with a licensed healthcare provider.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
