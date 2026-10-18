import React from 'react';
import { Hospital, Doctor, DemoAppointment } from '../../types';
import { AdminTab } from './AdminSidebar';
import {
  Building2,
  UserCheck,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Bed,
  MapPin,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardProps {
  hospitals: Hospital[];
  doctors: Doctor[];
  appointments: DemoAppointment[];
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  hospitals,
  doctors,
  appointments,
  onSelectTab,
}) => {
  // Dynamically calculated stats
  const totalHospitals = hospitals.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;

  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  const totalBeds = hospitals.reduce((sum, h) => sum + h.totalBeds, 0);
  const availableBeds = hospitals.reduce((sum, h) => sum + h.availableBeds, 0);
  const occupiedBeds = totalBeds - availableBeds;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Group hospitals by city
  const cityCounts: Record<string, number> = {};
  hospitals.forEach((h) => {
    cityCounts[h.city] = (cityCounts[h.city] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-300 text-xs px-2.5 py-1 rounded-full mb-2 font-medium border border-sky-400/30">
              <span>Operational Statistics Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Operations & Healthcare Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Dynamically derived from active data models. Manage directory listings, doctor availability schedules, and demo appointment triage.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('appointments')}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Manage Demo Bookings</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Hospitals */}
        <div
          onClick={() => onSelectTab('hospitals')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Hospitals
            </span>
            <div className="p-2 bg-sky-50 text-sky-700 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalHospitals}</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>Across 10 Maharashtra cities</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </p>
        </div>

        {/* Total Doctors */}
        <div
          onClick={() => onSelectTab('doctors')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Specialist Doctors
            </span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalDoctors}</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>Cardiology, Neuro, Pediatrics</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </p>
        </div>

        {/* Total Appointments */}
        <div
          onClick={() => onSelectTab('appointments')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Demo Bookings
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalAppointments}</div>
          <p className="text-xs text-amber-700 mt-1 font-semibold flex items-center gap-1">
            <span>{pendingCount} Pending triage</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </p>
        </div>

        {/* Bed Capacity Occupancy */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sample Bed Capacity
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {occupancyRate}%{' '}
            <span className="text-xs font-normal text-slate-500">Occupancy</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {availableBeds} available of {totalBeds} total
          </p>
        </div>
      </div>

      {/* Appointment Triage Breakdown Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>Appointment Status Breakdown</span>
          <span className="text-xs font-normal text-slate-400">Real-time sync</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-800">Pending Review</span>
              <div className="text-2xl font-extrabold text-amber-900 mt-1">{pendingCount}</div>
            </div>
            <Clock className="w-8 h-8 text-amber-500 opacity-60" />
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800">Confirmed</span>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">{confirmedCount}</div>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-60" />
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-700">Cancelled</span>
              <div className="text-2xl font-extrabold text-slate-800 mt-1">{cancelledCount}</div>
            </div>
            <XCircle className="w-8 h-8 text-slate-400 opacity-60" />
          </div>
        </div>
      </div>

      {/* Two Column Grid: City Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              Maharashtra City Network Coverage (10 Cities)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {Object.entries(cityCounts).map(([city, count]) => (
              <div
                key={city}
                className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-800">{city}</span>
                <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {count} {count === 1 ? 'Hospital' : 'Hospitals'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Appointment Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-sky-600" />
                Recent Demo Appointment Activity
              </h3>
              <button
                onClick={() => onSelectTab('appointments')}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {appointments.slice(0, 4).map((a) => (
                <div key={a.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{a.doctorName}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      Patient: {a.patientName} • {a.appointmentDate}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      a.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : a.status === 'Pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            * All counts are computed dynamically from stored records.
          </div>
        </div>
      </div>
    </div>
  );
};
