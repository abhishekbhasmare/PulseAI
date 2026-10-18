import React, { useState } from 'react';
import { MedicationItem, VaccinationItem, Language } from '../../types';
import {
  saveMedication,
  deleteMedication,
  saveVaccination,
  deleteVaccination,
} from '../../services/storage';
import { Modal } from '../common/Modal';
import {
  Pill,
  ShieldCheck,
  Plus,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface MedicationTrackerProps {
  medications: MedicationItem[];
  vaccinations: VaccinationItem[];
  userId: string;
  language: Language;
}

export const MedicationTracker: React.FC<MedicationTrackerProps> = ({
  medications,
  vaccinations,
  userId,
  language,
}) => {
  const isMr = language === 'mr';
  const [activeSubTab, setActiveSubTab] = useState<'meds' | 'vaccines'>('meds');

  // Medication Modal Form State
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [instructions, setInstructions] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminderTime, setReminderTime] = useState('08:30');

  // Vaccine Modal Form State
  const [isVacModalOpen, setIsVacModalOpen] = useState(false);
  const [vacName, setVacName] = useState('');
  const [doseNumber, setDoseNumber] = useState('1');
  const [vaccinationDate, setVaccinationDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDate, setNextDate] = useState('');
  const [vacNotes, setVacNotes] = useState('');

  const handleSaveMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    saveMedication({
      userId,
      name: medName.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      instructions: instructions.trim(),
      startDate,
      reminderTime,
      isActive: true,
    });

    setIsMedModalOpen(false);
    setMedName('');
    setDosage('');
    setFrequency('');
    setInstructions('');
  };

  const handleSaveVac = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacName.trim()) return;

    saveVaccination({
      userId,
      vaccineName: vacName.trim(),
      doseNumber: Number(doseNumber) || 1,
      vaccinationDate,
      nextRecommendedDate: nextDate || undefined,
      notes: vacNotes.trim(),
    });

    setIsVacModalOpen(false);
    setVacName('');
    setNextDate('');
    setVacNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-6 h-6 text-teal-600" />
            {isMr ? 'औषधे आणि लसीकरण नोंदवही' : 'Medication & Vaccination Trackers'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isMr
              ? 'तुमची सक्रिय औषधे, डोस वेळापत्रक आणि लसीकरणाचा इतिहास एका सुरक्षित ठिकाणी ठेवा.'
              : 'Keep track of active prescriptions, daily dosage schedules, and past vaccination records.'}
          </p>
        </div>

        <button
          onClick={() => (activeSubTab === 'meds' ? setIsMedModalOpen(true) : setIsVacModalOpen(true))}
          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          {activeSubTab === 'meds'
            ? isMr
              ? 'औषध नोंद जोडा'
              : 'Add Medication'
            : isMr
            ? 'लस नोंद जोडा'
            : 'Add Vaccine Record'}
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <span>
          <strong>Clinical Safety Notice:</strong> PulseAI strictly manages user-entered prescription records and does not prescribe drugs, alter dosages, or generate medical schedules. Always follow instructions from a licensed doctor.
        </span>
      </div>

      {/* Sub tabs: Medications vs Vaccinations */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('meds')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === 'meds'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Pill className="w-4 h-4" />
          {isMr ? 'सक्रिय औषधे' : 'Active Medications'} ({medications.length})
        </button>

        <button
          onClick={() => setActiveSubTab('vaccines')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === 'vaccines'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          {isMr ? 'लसीकरण नोंदी' : 'Vaccination Records'} ({vaccinations.length})
        </button>
      </div>

      {/* Medications View */}
      {activeSubTab === 'meds' && (
        <div className="space-y-4">
          {medications.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No medications recorded. Click "Add Medication" to track active prescriptions.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        {med.dosage}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                        Active
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-2">{med.name}</h3>
                    <p className="text-xs font-semibold text-slate-700 mt-1">{med.frequency}</p>
                    <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{med.instructions}"
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>Started: {med.startDate}</span>
                      {med.reminderTime && (
                        <span className="flex items-center gap-1 text-teal-700 font-medium">
                          <Clock className="w-3.5 h-3.5" /> {med.reminderTime}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => deleteMedication(med.id)}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vaccinations View */}
      {activeSubTab === 'vaccines' && (
        <div className="space-y-4">
          {vaccinations.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No vaccination records. Click "Add Vaccine Record" to log immunizations.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vaccinations.map((vac) => (
                <div
                  key={vac.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                        Dose #{vac.doseNumber}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {vac.vaccinationDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-2">{vac.vaccineName}</h3>
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {vac.notes}
                    </p>

                    {vac.nextRecommendedDate && (
                      <div className="mt-3 p-2 bg-teal-50 rounded-lg text-xs text-teal-800 font-medium flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                        Next Recommended: <strong>{vac.nextRecommendedDate}</strong>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => deleteVaccination(vac.id)}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Medication Modal */}
      <Modal
        isOpen={isMedModalOpen}
        onClose={() => setIsMedModalOpen(false)}
        title={isMr ? 'औषध नोंद जोडा' : 'Add Medication Record'}
      >
        <form onSubmit={handleSaveMed} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Medication Name *</label>
            <input
              type="text"
              required
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              placeholder="e.g. Telmisartan or Metformin"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dosage</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 20 mg"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Schedule</label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g. Once daily after breakfast"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor's Instructions</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Prescribed for mild hypertension. Check BP weekly."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reminder Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsMedModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
            >
              Save Medication
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Vaccine Modal */}
      <Modal
        isOpen={isVacModalOpen}
        onClose={() => setIsVacModalOpen(false)}
        title={isMr ? 'लसीकरण नोंद जोडा' : 'Add Vaccination Record'}
      >
        <form onSubmit={handleSaveVac} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Vaccine Name *</label>
            <input
              type="text"
              required
              value={vacName}
              onChange={(e) => setVacName(e.target.value)}
              placeholder="e.g. Hepatitis B or Influenza Quadrivalent"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dose Number</label>
              <input
                type="number"
                min="1"
                value={doseNumber}
                onChange={(e) => setDoseNumber(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vaccination Date</label>
              <input
                type="date"
                required
                value={vaccinationDate}
                onChange={(e) => setVaccinationDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Next Recommended Dose Date (Optional)
            </label>
            <input
              type="date"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Administration Notes</label>
            <textarea
              rows={2}
              value={vacNotes}
              onChange={(e) => setVacNotes(e.target.value)}
              placeholder="e.g. Administered at City Center Hospital"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsVacModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
            >
              Save Vaccine
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
