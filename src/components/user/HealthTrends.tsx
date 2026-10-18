import React, { useState } from 'react';
import { HealthMeasurement, Language } from '../../types';
import { saveMeasurement, deleteMeasurement } from '../../services/storage';
import { VitalsChart } from '../common/VitalsChart';
import { Modal } from '../common/Modal';
import {
  TrendingUp,
  Plus,
  Activity,
  Heart,
  Droplet,
  Scale,
  Calendar,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface HealthTrendsProps {
  measurements: HealthMeasurement[];
  userId: string;
  language: Language;
}

export const HealthTrends: React.FC<HealthTrendsProps> = ({ measurements, userId, language }) => {
  const isMr = language === 'mr';
  const [selectedMetric, setSelectedMetric] = useState<'bp' | 'weight' | 'glucose' | 'heartRate'>('bp');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for New Measurement
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [systolicBp, setSystolicBp] = useState('125');
  const [diastolicBp, setDiastolicBp] = useState('80');
  const [weightKg, setWeightKg] = useState('77.0');
  const [bloodGlucose, setBloodGlucose] = useState('98');
  const [heartRate, setHeartRate] = useState('72');
  const [glucoseType, setGlucoseType] = useState<'fasting' | 'post-prandial' | 'random'>('fasting');
  const [notes, setNotes] = useState('Home digital monitor check');

  const handleOpenAdd = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsModalOpen(true);
  };

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();

    saveMeasurement({
      userId,
      date,
      time,
      systolicBp: systolicBp ? Number(systolicBp) : undefined,
      diastolicBp: diastolicBp ? Number(diastolicBp) : undefined,
      weightKg: weightKg ? Number(weightKg) : undefined,
      bloodGlucoseMgDl: bloodGlucose ? Number(bloodGlucose) : undefined,
      heartRateBpm: heartRate ? Number(heartRate) : undefined,
      glucoseType,
      notes: notes.trim() || undefined,
    });

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(isMr ? 'हे मोजमाप हटवायचे आहे का?' : 'Delete this measurement?')) {
      deleteMeasurement(id, userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-teal-600" />
            {isMr ? 'आरोग्य ट्रेंड्स आणि मोजमाप इतिहास' : 'Health Trends & Vitals Trajectory'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isMr
              ? 'केवळ तुम्ही नोंदवलेल्या खऱ्या मोजमापांवर आधारित विश्लेषण. कोणतेही खोटे किंवा अंदाजे दावे नाहीत.'
              : 'Objective historical trajectory based strictly on recorded vitals. No fabricated curves or diagnoses.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          {isMr ? 'मोजमाप नोंदवा' : 'Record Measurement'}
        </button>
      </div>

      {/* Metric Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedMetric('bp')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedMetric === 'bp'
              ? 'bg-teal-50 border-teal-500 shadow-2xs ring-1 ring-teal-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <Activity className="w-5 h-5 text-teal-600" />
            <span className="text-[10px] uppercase font-bold text-slate-400">mmHg</span>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2">
            {isMr ? 'रक्तदाब (BP)' : 'Blood Pressure'}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Systolic & Diastolic</p>
        </button>

        <button
          onClick={() => setSelectedMetric('weight')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedMetric === 'weight'
              ? 'bg-teal-50 border-teal-500 shadow-2xs ring-1 ring-teal-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] uppercase font-bold text-slate-400">kg</span>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2">
            {isMr ? 'वजन (Weight)' : 'Body Weight'}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Kilograms</p>
        </button>

        <button
          onClick={() => setSelectedMetric('glucose')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedMetric === 'glucose'
              ? 'bg-teal-50 border-teal-500 shadow-2xs ring-1 ring-teal-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <Droplet className="w-5 h-5 text-sky-600" />
            <span className="text-[10px] uppercase font-bold text-slate-400">mg/dL</span>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2">
            {isMr ? 'साखर (Glucose)' : 'Blood Glucose'}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Fasting & Post-meal</p>
        </button>

        <button
          onClick={() => setSelectedMetric('heartRate')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedMetric === 'heartRate'
              ? 'bg-teal-50 border-teal-500 shadow-2xs ring-1 ring-teal-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <Heart className="w-5 h-5 text-rose-600" />
            <span className="text-[10px] uppercase font-bold text-slate-400">bpm</span>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2">
            {isMr ? 'हृदयाचे ठोके' : 'Heart Rate'}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Beats per minute</p>
        </button>
      </div>

      {/* Main Interactive Responsive SVG Chart */}
      <VitalsChart measurements={measurements} metric={selectedMetric} />

      {/* Historical Measurements Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            {isMr ? 'सर्व नोंदवलेली मोजमापे' : 'Recorded Vitals History Table'} ({measurements.length})
          </h3>
          <span className="text-xs text-slate-500">Sorted by Date</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-3 font-semibold">Date & Time</th>
                <th className="py-2.5 px-3 font-semibold">BP (mmHg)</th>
                <th className="py-2.5 px-3 font-semibold">Weight (kg)</th>
                <th className="py-2.5 px-3 font-semibold">Glucose (mg/dL)</th>
                <th className="py-2.5 px-3 font-semibold">Heart Rate</th>
                <th className="py-2.5 px-3 font-semibold">Notes</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {measurements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                    {m.date} {m.time ? `@ ${m.time}` : ''}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-teal-800">
                    {m.systolicBp ? `${m.systolicBp}/${m.diastolicBp}` : '--'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">{m.weightKg ? `${m.weightKg}` : '--'}</td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {m.bloodGlucoseMgDl ? `${m.bloodGlucoseMgDl} (${m.glucoseType || 'mg/dL'})` : '--'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {m.heartRateBpm ? `${m.heartRateBpm} bpm` : '--'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">{m.notes || '--'}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Delete measurement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Measurement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isMr ? 'नवीन मोजमाप नोंदवा' : 'Record New Vitals Measurement'}
      >
        <form onSubmit={handleSaveMeasurement} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 block">Values</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  placeholder="120"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  placeholder="80"
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="75.0"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Blood Glucose (mg/dL)</label>
                <input
                  type="number"
                  placeholder="95"
                  value={bloodGlucose}
                  onChange={(e) => setBloodGlucose(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Heart Rate (bpm)</label>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Context</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Taken before breakfast, feeling well"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
              Save Measurement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
