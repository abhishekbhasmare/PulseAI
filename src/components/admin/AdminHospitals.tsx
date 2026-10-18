import React, { useState } from 'react';
import { Hospital } from '../../types';
import { saveHospital, deleteHospital } from '../../services/storage';
import { Modal } from '../common/Modal';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  MapPin,
  Bed,
  Phone,
  ShieldAlert,
} from 'lucide-react';

interface AdminHospitalsProps {
  hospitals: Hospital[];
}

export const AdminHospitals: React.FC<AdminHospitalsProps> = ({ hospitals }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('Pune');
  const [address, setAddress] = useState('');
  const [specialtiesStr, setSpecialtiesStr] = useState('');
  const [totalBeds, setTotalBeds] = useState('150');
  const [availableBeds, setAvailableBeds] = useState('25');
  const [contactNumber, setContactNumber] = useState('+91 20 6789 0000');
  const [description, setDescription] = useState('');
  const [sampleTimings, setSampleTimings] = useState('24 Hours Emergency | OPD: 09:00 AM - 08:00 PM');
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);

  const cities = Array.from(new Set(hospitals.map((h) => h.city))).sort();

  const handleOpenAdd = () => {
    setEditingHospital(null);
    setName('');
    setCity('Pune');
    setAddress('');
    setSpecialtiesStr('Cardiology, General Medicine, Critical Care');
    setTotalBeds('150');
    setAvailableBeds('25');
    setContactNumber('+91 20 6789 0000');
    setDescription('Fictional sample specialty hospital in Maharashtra.');
    setSampleTimings('24 Hours Emergency | OPD: 09:00 AM - 08:00 PM');
    setEmergencyAvailable(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hosp: Hospital) => {
    setEditingHospital(hosp);
    setName(hosp.name);
    setCity(hosp.city);
    setAddress(hosp.address);
    setSpecialtiesStr(hosp.specialties.join(', '));
    setTotalBeds(String(hosp.totalBeds));
    setAvailableBeds(String(hosp.availableBeds));
    setContactNumber(hosp.contactNumber);
    setDescription(hosp.description);
    setSampleTimings(hosp.sampleTimings);
    setEmergencyAvailable(hosp.emergencyAvailable);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    const specialties = specialtiesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    saveHospital(
      {
        name: name.trim(),
        city: city.trim(),
        address: address.trim(),
        specialties,
        totalBeds: Number(totalBeds) || 100,
        availableBeds: Number(availableBeds) || 10,
        contactNumber: contactNumber.trim(),
        description: description.trim(),
        sampleTimings: sampleTimings.trim(),
        emergencyAvailable,
      },
      editingHospital ? editingHospital.id : undefined
    );

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, hospName: string) => {
    if (window.confirm(`Are you sure you want to delete hospital: "${hospName}"?`)) {
      deleteHospital(id);
    }
  };

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'All' || h.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-600" />
            Hospital Directory CRUD Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain facility records across Maharashtra cities. Edits update the public patient directory.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Hospital
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
            placeholder="Search hospital name, address..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">City:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="All">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hospitals Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Hospital Name</th>
                <th className="py-3 px-4 font-semibold">City</th>
                <th className="py-3 px-4 font-semibold">Specialties</th>
                <th className="py-3 px-4 font-semibold">Beds (Avail / Total)</th>
                <th className="py-3 px-4 font-semibold">Emergency</th>
                <th className="py-3 px-4 font-semibold">Contact</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHospitals.map((hosp) => (
                <tr key={hosp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">
                    {hosp.name}
                    <span className="block text-[11px] font-normal text-slate-400 truncate">
                      {hosp.address}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium whitespace-nowrap">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">{hosp.city}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {hosp.specialties.join(', ')}
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-semibold whitespace-nowrap">
                    <span className="text-teal-700">{hosp.availableBeds}</span> / {hosp.totalBeds}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {hosp.emergencyAvailable ? (
                      <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">
                        24/7 Available
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Standard OPD</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{hosp.contactNumber}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(hosp)}
                        className="p-1.5 text-slate-400 hover:text-sky-700 rounded hover:bg-slate-100"
                        title="Edit Hospital"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(hosp.id, hosp.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                        title="Delete Hospital"
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

      {/* Add / Edit Hospital Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHospital ? 'Edit Hospital Record' : 'Add New Maharashtra Hospital'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pune Metro Specialty Center"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City (Maharashtra) *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Specialties (Comma-separated)
            </label>
            <input
              type="text"
              value={specialtiesStr}
              onChange={(e) => setSpecialtiesStr(e.target.value)}
              placeholder="Cardiology, Neurology, Pediatrics, Orthopedics"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Beds</label>
              <input
                type="number"
                value={totalBeds}
                onChange={(e) => setTotalBeds(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Available Beds</label>
              <input
                type="number"
                value={availableBeds}
                onChange={(e) => setAvailableBeds(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
            <input
              type="checkbox"
              id="adminEmergencyCheckbox"
              checked={emergencyAvailable}
              onChange={(e) => setEmergencyAvailable(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <label htmlFor="adminEmergencyCheckbox" className="text-xs text-slate-700 font-medium cursor-pointer">
              24/7 Emergency & Critical Care Department Available
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
              className="px-4 py-2 text-xs font-semibold bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors"
            >
              Save Hospital
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
