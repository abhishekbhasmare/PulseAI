import React, { useState } from 'react';
import { HealthRecord, RecordCategory, Language } from '../../types';
import { saveHealthRecord, deleteHealthRecord } from '../../services/storage';
import { Modal } from '../common/Modal';
import {
  FolderHeart,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Activity,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

interface HealthMemoryProps {
  records: HealthRecord[];
  userId: string;
  language: Language;
}

const CATEGORIES: RecordCategory[] = [
  'Routine checkup',
  'Doctor consultation',
  'Laboratory report',
  'Medication record',
  'Vaccination',
  'Follow-up',
  'Other',
];

export const HealthMemory: React.FC<HealthMemoryProps> = ({ records, userId, language }) => {
  const isMr = language === 'mr';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<HealthRecord | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RecordCategory>('Routine checkup');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [provider, setProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [systolicBp, setSystolicBp] = useState<string>('');
  const [diastolicBp, setDiastolicBp] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [bloodGlucose, setBloodGlucose] = useState<string>('');

  const handleOpenCreate = () => {
    setEditingRecord(null);
    setTitle('');
    setCategory('Routine checkup');
    setDate(new Date().toISOString().split('T')[0]);
    setProvider('');
    setNotes('');
    setFollowUpDate('');
    setSystolicBp('');
    setDiastolicBp('');
    setHeartRate('');
    setWeightKg('');
    setBloodGlucose('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: HealthRecord) => {
    setEditingRecord(rec);
    setTitle(rec.title);
    setCategory(rec.category);
    setDate(rec.date);
    setProvider(rec.provider || '');
    setNotes(rec.notes);
    setFollowUpDate(rec.followUpDate || '');
    setSystolicBp(rec.measurements?.systolicBp ? String(rec.measurements.systolicBp) : '');
    setDiastolicBp(rec.measurements?.diastolicBp ? String(rec.measurements.diastolicBp) : '');
    setHeartRate(rec.measurements?.heartRate ? String(rec.measurements.heartRate) : '');
    setWeightKg(rec.measurements?.weightKg ? String(rec.measurements.weightKg) : '');
    setBloodGlucose(rec.measurements?.bloodGlucose ? String(rec.measurements.bloodGlucose) : '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !notes.trim()) {
      alert(isMr ? 'कृपया शीर्षक आणि नोंदी भरा.' : 'Please enter title and notes.');
      return;
    }

    const measurements = {
      systolicBp: systolicBp ? Number(systolicBp) : undefined,
      diastolicBp: diastolicBp ? Number(diastolicBp) : undefined,
      heartRate: heartRate ? Number(heartRate) : undefined,
      weightKg: weightKg ? Number(weightKg) : undefined,
      bloodGlucose: bloodGlucose ? Number(bloodGlucose) : undefined,
    };

    saveHealthRecord(
      {
        userId,
        title: title.trim(),
        category,
        date,
        provider: provider.trim() || undefined,
        notes: notes.trim(),
        followUpDate: followUpDate || undefined,
        measurements:
          measurements.systolicBp || measurements.weightKg || measurements.bloodGlucose
            ? measurements
            : undefined,
      },
      editingRecord ? editingRecord.id : undefined
    );

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const msg = isMr
      ? 'तुम्हाला ही नोंद खरोखर हटवायची आहे का?'
      : 'Are you sure you want to delete this health record?';
    if (window.confirm(msg)) {
      deleteHealthRecord(id, userId);
      if (viewingRecord?.id === id) setViewingRecord(null);
    }
  };

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.provider && rec.provider.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || rec.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderHeart className="w-6 h-6 text-teal-600" />
            {isMr ? 'आरोग्य नोंदवही (Health Memory Vault)' : 'Health Memory Vault'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isMr
              ? 'तुमचे वैयक्तिक वैद्यकीय अहवाल, तपासणी चिठ्ठ्या आणि डॉक्टरांच्या नोंदी व्यवस्थित ठेवा.'
              : 'Create, search, and manage your personal medical records, lab reports, and consultations.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          {isMr ? 'नवीन वैद्यकीय नोंद जोडा' : 'Add Health Record'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isMr ? 'शीर्षक, नोंदी किंवा डॉक्टर शोधा...' : 'Search records, notes, doctor...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 shrink-0">{isMr ? 'वर्गवारी:' : 'Category:'}</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">{isMr ? 'सर्व वर्गवारी (All)' : 'All Categories'}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FolderHeart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {isMr ? 'कोणतीही नोंद आढळली नाही' : 'No Health Records Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {isMr
              ? 'नवीन नोंद जोडण्यासाठी वरील बटणावर क्लिक करा. येथे जोडलेली मोजमापे थेट ट्रेंड्समध्ये दिसतील.'
              : 'Add your first medical record, doctor note, or lab report to begin building your continuity timeline.'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 text-xs font-semibold bg-teal-50 text-teal-800 px-4 py-2 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            {isMr ? 'पहिली नोंद तयार करा' : 'Create First Record'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-100">
                    {rec.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {rec.date}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3 line-clamp-2">{rec.title}</h3>

                {rec.provider && (
                  <p className="text-xs text-teal-700 font-medium mt-1 flex items-center gap-1 truncate">
                    <User className="w-3 h-3 shrink-0" /> {rec.provider}
                  </p>
                )}

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">{rec.notes}</p>

                {/* Attached Measurements Pills */}
                {rec.measurements && (
                  <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {rec.measurements.systolicBp && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        BP: {rec.measurements.systolicBp}/{rec.measurements.diastolicBp} mmHg
                      </span>
                    )}
                    {rec.measurements.weightKg && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        Weight: {rec.measurements.weightKg} kg
                      </span>
                    )}
                    {rec.measurements.bloodGlucose && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        Glucose: {rec.measurements.bloodGlucose} mg/dL
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setViewingRecord(rec)}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {isMr ? 'तपशील' : 'Details'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(rec)}
                    className="p-1.5 text-slate-400 hover:text-teal-700 rounded-md hover:bg-slate-100 transition-colors"
                    title="Edit record"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Record Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingRecord
            ? isMr
              ? 'नोंद संपादित करा'
              : 'Edit Health Record'
            : isMr
            ? 'नवीन आरोग्य नोंद तयार करा'
            : 'Create New Health Record'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isMr ? 'नोंद शीर्षक *' : 'Record Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isMr ? 'उदा. वार्षिक आरोग्य तपासणी अहवाल' : 'e.g. Annual Blood Work & Consultation'}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'वर्गवारी *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RecordCategory)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMr ? 'तारीख *' : 'Date *'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isMr ? 'आरोग्य केंद्र / डॉक्टर (ऐच्छिक)' : 'Healthcare Provider / Doctor (Optional)'}
            </label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. Dr. Deshmukh / Sahyadri Specialty Hospital"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isMr ? 'वैद्यकीय नोंदी व निष्कर्ष *' : 'Clinical Notes & Findings *'}
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isMr
                  ? 'डॉक्टरांचा सल्ला, अहवाल निष्कर्ष किंवा घरगुती निरीक्षणे नोंदवा...'
                  : 'Enter diagnosis, prescribed advice, test results, or doctor recommendations...'
              }
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Optional Measurements Fields */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              {isMr ? 'मोजमापे (ऐच्छिक - ट्रेंड्सशी आपोआप जोडले जाईल)' : 'Vitals Measurements (Optional — Auto-synced to Trends)'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  placeholder="120"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  placeholder="80"
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Blood Glucose (mg/dL)</label>
                <input
                  type="number"
                  placeholder="100"
                  value={bloodGlucose}
                  onChange={(e) => setBloodGlucose(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Heart Rate (bpm)</label>
                <input
                  type="number"
                  placeholder="72"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isMr ? 'पुढील फॉलो-अप तारीख (स्मार्ट रिमाइंडर तयार करेल)' : 'Follow-up Date (Auto-creates Smart Reminder)'}
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
            >
              {isMr ? 'जतन करा' : 'Save Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Record Details Modal */}
      {viewingRecord && (
        <Modal
          isOpen={!!viewingRecord}
          onClose={() => setViewingRecord(null)}
          title={viewingRecord.title}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-teal-50 text-teal-800">
                {viewingRecord.category}
              </span>
              <span className="text-xs text-slate-500">Date: {viewingRecord.date}</span>
            </div>

            {viewingRecord.provider && (
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Healthcare Provider</span>
                <p className="text-sm font-medium text-slate-800">{viewingRecord.provider}</p>
              </div>
            )}

            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Clinical Notes</span>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {viewingRecord.notes}
              </p>
            </div>

            {viewingRecord.measurements && (
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase mb-1.5">
                  Recorded Measurements
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {viewingRecord.measurements.systolicBp && (
                    <div className="p-2.5 bg-teal-50/50 rounded-lg border border-teal-100">
                      <span className="text-[10px] text-teal-800 block">Blood Pressure</span>
                      <span className="text-sm font-bold text-teal-900">
                        {viewingRecord.measurements.systolicBp}/{viewingRecord.measurements.diastolicBp} mmHg
                      </span>
                    </div>
                  )}
                  {viewingRecord.measurements.weightKg && (
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Weight</span>
                      <span className="text-sm font-bold text-slate-800">{viewingRecord.measurements.weightKg} kg</span>
                    </div>
                  )}
                  {viewingRecord.measurements.bloodGlucose && (
                    <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-100">
                      <span className="text-[10px] text-sky-700 block">Glucose</span>
                      <span className="text-sm font-bold text-sky-900">{viewingRecord.measurements.bloodGlucose} mg/dL</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {viewingRecord.followUpDate && (
              <div className="p-3 bg-teal-50 rounded-lg text-xs text-teal-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span>Follow-up Scheduled for: <strong>{viewingRecord.followUpDate}</strong></span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setViewingRecord(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
