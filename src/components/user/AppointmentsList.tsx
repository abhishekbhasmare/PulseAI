import React from 'react';
import { DemoAppointment, Language } from '../../types';
import { cancelAppointmentByUser } from '../../services/storage';
import {
  CalendarDays,
  Clock,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
} from 'lucide-react';

interface AppointmentsListProps {
  appointments: DemoAppointment[];
  userId: string;
  language: Language;
  onNavigateToDirectory: () => void;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  userId,
  language,
  onNavigateToDirectory,
}) => {
  const isMr = language === 'mr';

  const userAppointments = appointments.filter((a) => a.userId === userId);

  const handleCancel = (id: string) => {
    if (window.confirm(isMr ? 'ही अपॉइंटमेंट रद्द करायची आहे का?' : 'Cancel this appointment request?')) {
      cancelAppointmentByUser(id, userId);
    }
  };

  const getStatusBadge = (status: DemoAppointment['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {isMr ? 'मंजूर (Confirmed)' : 'Confirmed'}
          </span>
        );
      case 'Pending':
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {isMr ? 'प्रलंबित (Pending)' : 'Pending'}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            {isMr ? 'रद्द (Cancelled)' : 'Cancelled'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-teal-600" />
            {isMr ? 'माझ्या अपॉइंटमेंट्स (My Appointments)' : 'My Appointments'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isMr
              ? 'तुमच्या सर्व आगामी व मागील भेटींची स्थिती पहा. प्रशासक पोर्टलशी थेट जोडलेले.'
              : 'Track the status of your demo appointment requests. Synced with the Admin Operations portal.'}
          </p>
        </div>

        <button
          onClick={onNavigateToDirectory}
          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          {isMr ? 'नवीन अपॉइंटमेंट बुक करा' : 'Book New Appointment'}
        </button>
      </div>

      {/* Real-time Sync Disclaimer */}
      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
        <span>
          {isMr
            ? 'प्रशासकाने (Admin Portal) स्थिती बदलल्यास येथे त्वरित बदल दिसतो.'
            : 'Appointments are synchronized across both patient and administrator views. Status changes in the Admin Portal appear here instantly.'}
        </span>
      </div>

      {/* Appointment Cards */}
      {userAppointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {isMr ? 'कोणतीही अपॉइंटमेंट आढळली नाही' : 'No Appointments Requested Yet'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {isMr
              ? 'रुग्णालय व डॉक्टर निर्देशिकेतून कोणत्याही तज्ज्ञ डॉक्टरकडे भेट मागू शकता.'
              : 'Browse our Maharashtra directory to request a consultation with a specialist doctor.'}
          </p>
          <button
            onClick={onNavigateToDirectory}
            className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold hover:bg-teal-800"
          >
            {isMr ? 'निर्देशिका उघडा' : 'Open Hospital Directory'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                    {appt.appointmentDate} @ {appt.appointmentTime}
                  </span>
                  {getStatusBadge(appt.status)}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{appt.doctorName}</h3>
                <p className="text-xs font-medium text-teal-700">{appt.department}</p>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {appt.hospitalName}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Patient: {appt.patientName} ({appt.patientPhone})
                  </p>
                  <p className="text-slate-500 italic mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    Reason: "{appt.reason}"
                  </p>
                </div>

                {appt.adminNotes && (
                  <div className="mt-3 p-2.5 bg-sky-50 rounded-lg border border-sky-200 text-xs text-sky-950">
                    <strong className="block text-[10px] uppercase font-bold text-sky-800">
                      Hospital Admin Desk Response:
                    </strong>
                    {appt.adminNotes}
                  </div>
                )}
              </div>

              {appt.status !== 'Cancelled' && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold"
                  >
                    {isMr ? 'अपॉइंटमेंट रद्द करा' : 'Cancel Request'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
