import React, { useState } from 'react';
import { DemoAppointment } from '../../types';
import { updateAppointmentStatus } from '../../services/storage';
import { Modal } from '../common/Modal';
import {
  CalendarDays,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Building2,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

interface AdminAppointmentsProps {
  appointments: DemoAppointment[];
}

export const AdminAppointments: React.FC<AdminAppointmentsProps> = ({ appointments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedAppt, setSelectedAppt] = useState<DemoAppointment | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const handleUpdateStatus = (id: string, status: DemoAppointment['status']) => {
    try {
      updateAppointmentStatus(id, status);
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleOpenNotesModal = (appt: DemoAppointment) => {
    setSelectedAppt(appt);
    setAdminNotes(appt.adminNotes || '');
    setIsNotesModalOpen(true);
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;

    try {
      updateAppointmentStatus(selectedAppt.id, selectedAppt.status, adminNotes.trim());
      setIsNotesModalOpen(false);
      setSelectedAppt(null);
    } catch (err: any) {
      alert(err.message || 'Error saving notes');
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || a.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-sky-600" />
          Demo Appointments Triage & Management
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review patient demo requests, change status to Confirmed or Cancelled, and add hospital notes.
        </p>
      </div>

      {/* Sync Disclaimer */}
      <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-2.5 text-xs text-sky-950">
        <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Shared Data Layer Active:</strong> Status updates executed here synchronize in real-time with the patient's portal view and in-app reminders. Fictional demonstration data.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, doctor, hospital..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="All">All Statuses ({appointments.length})</option>
            <option value="Pending">Pending Review</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Patient</th>
                <th className="py-3 px-4 font-semibold">Doctor & Specialty</th>
                <th className="py-3 px-4 font-semibold">Hospital</th>
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Reason</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No demo appointments match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {appt.patientName}
                      <span className="block text-[11px] font-normal text-slate-400">
                        {appt.patientPhone}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">{appt.doctorName}</span>
                      <span className="text-[10px] text-teal-700 font-medium">{appt.department}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                      {appt.hospitalName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800">
                      {appt.appointmentDate}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {appt.appointmentTime}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {appt.reason}
                      {appt.adminNotes && (
                        <span className="block text-[10px] text-sky-700 font-semibold truncate">
                          Note: {appt.adminNotes}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          appt.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : appt.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {appt.status !== 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'Confirmed')}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold px-2 py-1 rounded shadow-2xs"
                            title="Confirm Booking"
                          >
                            Confirm
                          </button>
                        )}
                        {appt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'Cancelled')}
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-semibold px-2 py-1 rounded"
                            title="Cancel Booking"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenNotesModal(appt)}
                          className="p-1 text-slate-400 hover:text-sky-700 rounded hover:bg-slate-100"
                          title="Add Admin Remarks"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Admin Notes Modal */}
      {selectedAppt && (
        <Modal
          isOpen={isNotesModalOpen}
          onClose={() => {
            setIsNotesModalOpen(false);
            setSelectedAppt(null);
          }}
          title={`Admin Instructions: ${selectedAppt.patientName}`}
        >
          <form onSubmit={handleSaveNotes} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
              <p>
                <strong>Doctor:</strong> {selectedAppt.doctorName} ({selectedAppt.department})
              </p>
              <p>
                <strong>Facility:</strong> {selectedAppt.hospitalName}
              </p>
              <p>
                <strong>Date:</strong> {selectedAppt.appointmentDate} @ {selectedAppt.appointmentTime}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin / OPD Desk Notes for Patient
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Confirmed. Please arrive 15 minutes prior for vitals registration at Desk B."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsNotesModalOpen(false);
                  setSelectedAppt(null);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors"
              >
                Save Remarks
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
