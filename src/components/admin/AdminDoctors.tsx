import React, { useState } from 'react';
import { Doctor, Hospital } from '../../types';
import { saveDoctor, deleteDoctor } from '../../services/storage';
import { Modal } from '../common/Modal';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Building2,
  Clock,
  Award,
} from 'lucide-react';

interface AdminDoctorsProps {
  doctors: Doctor[];
  hospitals: Hospital[];
}

export const AdminDoctors: React.FC<AdminDoctorsProps> = ({ doctors, hospitals }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [hospitalId, setHospitalId] = useState(hospitals[0]?.id || '');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [qualifications, setQualifications] = useState('MBBS, MD');
  const [experienceYears, setExperienceYears] = useState('12');
  const [consultationFee, setConsultationFee] = useState('600');
  const [sampleSchedule, setSampleSchedule] = useState('10:00 AM - 02:00 PM');

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty))).sort();

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setName('Dr. ');
    setHospitalId(hospitals[0]?.id || '');
    setSpecialty('Cardiology');
    setQualifications('MBBS, MD');
    setExperienceYears('10');
    setConsultationFee('600');
    setSampleSchedule('10:00 AM - 02:00 PM');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setName(doc.name);
    setHospitalId(doc.hospitalId);
    setSpecialty(doc.specialty);
    setQualifications(doc.qualifications);
    setExperienceYears(String(doc.experienceYears));
    setConsultationFee(String(doc.consultationFee));
    setSampleSchedule(doc.sampleSchedule);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const hosp = hospitals.find((h) => h.id === hospitalId);

    saveDoctor(
      {
        name: name.trim(),
        hospitalId,
        hospitalName: hosp?.name || 'Selected Facility',
        city: hosp?.city || 'Pune',
        specialty: specialty.trim(),
        qualifications: qualifications.trim(),
        experienceYears: Number(experienceYears) || 5,
        consultationFee: Number(consultationFee) || 500,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        sampleSchedule: sampleSchedule.trim(),
      },
      editingDoctor ? editingDoctor.id : undefined
    );

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, docName: string) => {
    if (window.confirm(`Delete doctor record for: "${docName}"?`)) {
      deleteDoctor(id);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-sky-600" />
            Specialist Doctor Management (CRUD)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain practitioner directory across hospital departments in Maharashtra.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Specialist Doctor
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor, hospital, specialty..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Specialty:</span>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="All">All Specialties</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Doctor Name</th>
                <th className="py-3 px-4 font-semibold">Specialty</th>
                <th className="py-3 px-4 font-semibold">Hospital & City</th>
                <th className="py-3 px-4 font-semibold">Experience</th>
                <th className="py-3 px-4 font-semibold">Fee (₹)</th>
                <th className="py-3 px-4 font-semibold">OPD Schedule</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {doc.name}
                    <span className="block text-[11px] font-normal text-slate-400">
                      {doc.qualifications}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="bg-sky-50 text-sky-800 text-[11px] font-semibold px-2.5 py-0.5 rounded border border-sky-100">
                      {doc.specialty}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 max-w-xs truncate">
                    {doc.hospitalName}
                    <span className="block text-[10px] text-slate-400">{doc.city}, MH</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{doc.experienceYears} Years</td>
                  <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">₹{doc.consultationFee}</td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{doc.sampleSchedule}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(doc)}
                        className="p-1.5 text-slate-400 hover:text-sky-700 rounded hover:bg-slate-100"
                        title="Edit Doctor"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                        title="Delete Doctor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Doctor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoctor ? 'Edit Doctor Record' : 'Add New Specialist Doctor'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Deshmukh"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Affiliated Hospital *</label>
            <select
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Specialty *</label>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Cardiology"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications</label>
              <input
                type="text"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="MBBS, MD, DM"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Consultation Fee (₹)</label>
              <input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">OPD Schedule Timings</label>
            <input
              type="text"
              value={sampleSchedule}
              onChange={(e) => setSampleSchedule(e.target.value)}
              placeholder="e.g. 10:00 AM - 02:00 PM"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
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
              className="px-4 py-2 text-xs font-semibold bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
