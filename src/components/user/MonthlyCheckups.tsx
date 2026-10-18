import React, { useState } from 'react';
import { MonthlyCheckup, Language } from '../../types';
import { saveCheckup, markCheckupCompleted, cancelCheckup } from '../../services/storage';
import { Modal } from '../common/Modal';
import {
  CalendarCheck2,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertCircle,
  RotateCw,
  Activity,
} from 'lucide-react';

interface MonthlyCheckupsProps {
  checkups: MonthlyCheckup[];
  userId: string;
  language: Language;
}

export const MonthlyCheckups: React.FC<MonthlyCheckupsProps> = ({ checkups, userId, language }) => {
  const isMr = language === 'mr';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedCheckup, setSelectedCheckup] = useState<MonthlyCheckup | null>(null);

  // Form State for Scheduling
  const [title, setTitle] = useState('Monthly Routine BP & Health Checkup');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 2 weeks ahead by default
    return d.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('10:30');
  const [provider, setProvider] = useState('Dr. Aarav Deshmukh / Primary Care Physician');
  const [location, setLocation] = useState('Sahyadri Pulse Multi-Specialty Hospital, Pune');
  const [notes, setNotes] = useState('Routine monthly monitoring for blood pressure and wellness review.');
  const [isRecurring, setIsRecurring] = useState(true);

  // Form State for Mark Completed & Recording Vitals
  const [completeSystolic, setCompleteSystolic] = useState('128');
  const [completeDiastolic, setCompleteDiastolic] = useState('82');
  const [completeWeight, setCompleteWeight] = useState('77.5');
  const [completeGlucose, setCompleteGlucose] = useState('102');
  const [completeHeartRate, setCompleteHeartRate] = useState('74');

  const upcomingCheckups = checkups.filter((c) => c.status === 'upcoming');
  const pastCheckups = checkups.filter((c) => c.status !== 'upcoming');

  const handleOpenSchedule = () => {
    setSelectedCheckup(null);
    setTitle('Monthly Preventative Checkup');
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setScheduledDate(d.toISOString().split('T')[0]);
    setScheduledTime('11:00');
    setProvider('');
    setLocation('');
    setNotes('');
    setIsRecurring(true);
    setIsModalOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !scheduledDate) return;

    const dayOfMonth = new Date(scheduledDate).getDate();

    saveCheckup({
      userId,
      title: title.trim(),
      scheduledDate,
      scheduledTime,
      status: 'upcoming',
      provider: provider.trim() || undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      isRecurring,
      recurrenceDayOfMonth: isRecurring ? dayOfMonth : undefined,
    });

    setIsModalOpen(false);
  };

  const handleOpenCompleteModal = (chk: MonthlyCheckup) => {
    setSelectedCheckup(chk);
    setIsCompleteModalOpen(true);
  };

  const handleConfirmComplete = () => {
    if (!selectedCheckup) return;

    markCheckupCompleted(selectedCheckup.id, {
      systolicBp: completeSystolic ? Number(completeSystolic) : undefined,
      diastolicBp: completeDiastolic ? Number(completeDiastolic) : undefined,
      weightKg: completeWeight ? Number(completeWeight) : undefined,
      bloodGlucose: completeGlucose ? Number(completeGlucose) : undefined,
      heartRate: completeHeartRate ? Number(completeHeartRate) : undefined,
    });

    setIsCompleteModalOpen(false);
    setSelectedCheckup(null);
  };

  const handleCancelCheckup = (id: string) => {
    const msg = isMr
      ? 'तुम्हाला ही तपासणी खरोखर रद्द करायची आहे का?'
      : 'Are you sure you want to cancel this scheduled checkup?';
    if (window.confirm(msg)) {
      cancelCheckup(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-teal-600" />
            {isMr ? 'नियमित मासिक तपासण्या (Monthly Checkups)' : 'Monthly Routine Checkups'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isMr
              ? 'दरमहा नियमित तपासणी शेड्यूल करा. पूर्ण झाल्यावर नवीन मोजमापे नोंदवा आणि ऐतिहासिक ट्रेंड्स पहा.'
              : 'Schedule recurring monthly checkups, trigger smart in-app reminders, and record vitals.'}
          </p>
        </div>

        <button
          onClick={handleOpenSchedule}
          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          {isMr ? 'तपासणी शेड्यूल करा' : 'Schedule Checkup'}
        </button>
      </div>

      {/* Continuity Banner */}
      <div className="bg-teal-50 border border-teal-200/80 rounded-xl p-4 flex items-start gap-3">
        <RotateCw className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 leading-relaxed">
          <strong className="font-semibold">{isMr ? 'स्वयंचलित मासिक सातत्य:' : 'Automated Monthly Continuity:'}</strong>{' '}
          {isMr
            ? 'जेव्हा तुम्ही आवर्ती (recurring) तपासणी पूर्ण म्हणून नोंदवता, तेव्हा पल्सएआय आपोआप पुढील महिन्याची योग्य तारीख आणि इन-ॲप स्मरणपत्र तयार करते. Asia/Kolkata वेळेनुसार अचूक व्यवस्थापन होते.'
            : 'When you mark a recurring checkup as completed and log measurements, PulseAI records the vitals into Health Trends and automatically schedules the next occurrence for the following month.'}
        </div>
      </div>

      {/* Upcoming Checkups Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600" />
          {isMr ? 'आगामी नियोजित तपासण्या' : 'Upcoming Checkups'} ({upcomingCheckups.length})
        </h3>

        {upcomingCheckups.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <CalendarCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              {isMr ? 'कोणतीही आगामी तपासणी नियोजित नाही.' : 'No upcoming checkups scheduled.'}
            </p>
            <button
              onClick={handleOpenSchedule}
              className="mt-3 text-xs font-semibold text-teal-700 hover:underline"
            >
              {isMr ? 'नवीन तपासणी जोडा' : 'Schedule your monthly checkup'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingCheckups.map((chk) => (
              <div
                key={chk.id}
                className="bg-white rounded-xl border-2 border-teal-500/30 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                      {chk.scheduledDate} @ {chk.scheduledTime} (IST)
                    </span>
                    {chk.isRecurring && (
                      <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded flex items-center gap-1 border border-sky-100">
                        <RotateCw className="w-3 h-3" /> Monthly Recur
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mt-3">{chk.title}</h4>

                  {chk.provider && (
                    <p className="text-xs font-medium text-teal-700 mt-1">{chk.provider}</p>
                  )}
                  {chk.location && (
                    <p className="text-xs text-slate-500 mt-0.5">{chk.location}</p>
                  )}
                  {chk.notes && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{chk.notes}"
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenCompleteModal(chk)}
                    className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isMr ? 'पूर्ण झाली (मोजमाप नोंदवा)' : 'Mark Done & Log Vitals'}
                  </button>

                  <button
                    onClick={() => handleCancelCheckup(chk.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1"
                  >
                    {isMr ? 'रद्द करा' : 'Cancel'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past / Completed Checkups Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {isMr ? 'पूर्ण झालेल्या व मागील तपासण्या' : 'Past & Completed Checkups'} ({pastCheckups.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastCheckups.map((chk) => (
            <div
              key={chk.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs opacity-90"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-500">
                <span>{chk.scheduledDate}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    chk.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {chk.status}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mt-2">{chk.title}</h4>
              <p className="text-[11px] text-slate-500">{chk.provider || 'Care Physician'}</p>

              {chk.recordedMeasurements && (
                <div className="mt-2.5 p-2 bg-slate-50 rounded text-[11px] text-slate-700 font-medium space-y-0.5">
                  {chk.recordedMeasurements.systolicBp && (
                    <div>BP: {chk.recordedMeasurements.systolicBp}/{chk.recordedMeasurements.diastolicBp} mmHg</div>
                  )}
                  {chk.recordedMeasurements.weightKg && (
                    <div>Weight: {chk.recordedMeasurements.weightKg} kg</div>
                  )}
                  {chk.recordedMeasurements.bloodGlucose && (
                    <div>Glucose: {chk.recordedMeasurements.bloodGlucose} mg/dL</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Checkup Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isMr ? 'मासिक तपासणी शेड्यूल करा' : 'Schedule Monthly Routine Checkup'}
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isMr ? 'तपासणी नाव *' : 'Checkup Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monthly BP & Heart Monitoring"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'तारीख (Asia/Kolkata) *' : 'Date (Asia/Kolkata) *'}
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'वेळ *' : 'Time *'}
              </label>
              <input
                type="time"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isMr ? 'डॉक्टर / तपासणी केंद्र' : 'Doctor / Clinic'}
            </label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. Dr. Aarav Deshmukh / Sahyadri OPD"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isMr ? 'पत्ता / स्थान' : 'Location / Address'}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Senapati Bapat Road, Pune"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isMr ? 'नोंदी व उद्दिष्टे' : 'Notes & Objectives'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fasting blood test and consultation for medication renewal"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-200 flex items-center gap-2">
            <input
              type="checkbox"
              id="recurringCheckbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="recurringCheckbox" className="text-xs text-teal-900 font-medium cursor-pointer">
              {isMr
                ? 'मासिक आवर्ती वेळापत्रक (ही तपासणी पूर्ण झाल्यावर पुढील महिन्याची तारीख आपोआप तयार करा)'
                : 'Repeat monthly (Automatically schedule next month’s date when marked completed)'}
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
            >
              Schedule Checkup
            </button>
          </div>
        </form>
      </Modal>

      {/* Mark Completed & Record Measurements Modal */}
      {selectedCheckup && (
        <Modal
          isOpen={isCompleteModalOpen}
          onClose={() => setIsCompleteModalOpen(false)}
          title={isMr ? 'तपासणी पूर्ण झाली — मोजमाप नोंदवा' : 'Checkup Completed — Record Vitals'}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              {isMr
                ? `"${selectedCheckup.title}" पूर्ण झाली म्हणून चिन्हांकित करत आहात. तपासणीदरम्यान घेतलेली मोजमापे नोंदवा जेणेकरून ट्रेंड्स आपोआप अपडेट होतील.`
                : `Recording completion for "${selectedCheckup.title}". Enter measurements taken during this visit to automatically update your historical vitals trajectory.`}
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Recorded Vitals at Visit
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={completeSystolic}
                    onChange={(e) => setCompleteSystolic(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={completeDiastolic}
                    onChange={(e) => setCompleteDiastolic(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={completeWeight}
                    onChange={(e) => setCompleteWeight(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={completeGlucose}
                    onChange={(e) => setCompleteGlucose(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={completeHeartRate}
                    onChange={(e) => setCompleteHeartRate(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>
            </div>

            {selectedCheckup.isRecurring && (
              <div className="p-3 bg-teal-50 rounded-lg text-xs text-teal-900 flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  PulseAI will automatically schedule the next monthly cycle for this recurring checkup!
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCompleteModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                className="px-4 py-2 text-xs font-semibold bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
              >
                Confirm Completion & Save Vitals
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
