import React, { useState } from 'react';
import {
  HealthRecord,
  MonthlyCheckup,
  DemoAppointment,
  HealthMeasurement,
  MedicationItem,
  VaccinationItem,
  Language,
} from '../../types';
import { Modal } from '../common/Modal';
import {
  GitCommit,
  FolderHeart,
  CalendarCheck2,
  CalendarDays,
  TrendingUp,
  Pill,
  ShieldAlert,
  Clock,
  Filter,
  Eye,
} from 'lucide-react';

interface HealthTimelineProps {
  records: HealthRecord[];
  checkups: MonthlyCheckup[];
  appointments: DemoAppointment[];
  measurements: HealthMeasurement[];
  medications: MedicationItem[];
  vaccinations: VaccinationItem[];
  language: Language;
}

interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  type: 'record' | 'checkup' | 'appointment' | 'measurement' | 'medication' | 'vaccination';
  title: string;
  subtitle?: string;
  status?: string;
  description: string;
  rawItem: any;
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({
  records,
  checkups,
  appointments,
  measurements,
  medications,
  vaccinations,
  language,
}) => {
  const isMr = language === 'mr';
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // Compile all user-owned items into unified timeline
  const events: TimelineEvent[] = [];

  // 1. Health Records
  records.forEach((r) => {
    events.push({
      id: `timeline-rec-${r.id}`,
      date: r.date,
      type: 'record',
      title: r.title,
      subtitle: r.provider || (isMr ? 'वैद्यकीय नोंद' : 'Health Record'),
      status: r.category,
      description: r.notes,
      rawItem: r,
    });
  });

  // 2. Checkups
  checkups.forEach((c) => {
    events.push({
      id: `timeline-chk-${c.id}`,
      date: c.scheduledDate,
      time: c.scheduledTime,
      type: 'checkup',
      title: c.title,
      subtitle: c.provider || (isMr ? 'नियमित तपासणी' : 'Routine Checkup'),
      status: c.status === 'completed' ? 'Completed' : 'Upcoming',
      description: c.notes || 'Routine checkup visit',
      rawItem: c,
    });
  });

  // 3. Appointments
  appointments.forEach((a) => {
    events.push({
      id: `timeline-appt-${a.id}`,
      date: a.appointmentDate,
      time: a.appointmentTime,
      type: 'appointment',
      title: `${isMr ? 'अपॉइंटमेंट:' : 'Appointment:'} ${a.doctorName}`,
      subtitle: a.hospitalName,
      status: a.status,
      description: `Reason: ${a.reason}. Admin notes: ${a.adminNotes || 'Under processing'}`,
      rawItem: a,
    });
  });

  // 4. Standalone Vitals
  measurements.forEach((m) => {
    const summary = [
      m.systolicBp ? `BP: ${m.systolicBp}/${m.diastolicBp} mmHg` : '',
      m.weightKg ? `Weight: ${m.weightKg} kg` : '',
      m.bloodGlucoseMgDl ? `Glucose: ${m.bloodGlucoseMgDl} mg/dL` : '',
      m.heartRateBpm ? `HR: ${m.heartRateBpm} bpm` : '',
    ]
      .filter(Boolean)
      .join(' • ');

    events.push({
      id: `timeline-meas-${m.id}`,
      date: m.date,
      time: m.time,
      type: 'measurement',
      title: isMr ? 'मोजमाप नोंद' : 'Vitals Measurement Recorded',
      subtitle: summary,
      status: 'Recorded',
      description: m.notes || summary,
      rawItem: m,
    });
  });

  // 5. Vaccinations
  vaccinations.forEach((v) => {
    events.push({
      id: `timeline-vac-${v.id}`,
      date: v.vaccinationDate,
      type: 'vaccination',
      title: `${isMr ? 'लसीकरण:' : 'Vaccination:'} ${v.vaccineName}`,
      subtitle: `Dose #${v.doseNumber}`,
      status: 'Administered',
      description: v.notes || 'Routine vaccination',
      rawItem: v,
    });
  });

  // Sort strictly chronological descending
  const sortedEvents = events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredEvents = sortedEvents.filter((e) => {
    if (filterType === 'All') return true;
    return e.type === filterType;
  });

  const getEventBadge = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'record':
        return {
          icon: <FolderHeart className="w-4 h-4 text-teal-600" />,
          bg: 'bg-teal-50 border-teal-200 text-teal-800',
          label: isMr ? 'वैद्यकीय नोंद' : 'Health Record',
        };
      case 'checkup':
        return {
          icon: <CalendarCheck2 className="w-4 h-4 text-sky-600" />,
          bg: 'bg-sky-50 border-sky-200 text-sky-800',
          label: isMr ? 'मासिक तपासणी' : 'Monthly Checkup',
        };
      case 'appointment':
        return {
          icon: <CalendarDays className="w-4 h-4 text-indigo-600" />,
          bg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
          label: isMr ? 'अपॉइंटमेंट' : 'Appointment',
        };
      case 'measurement':
        return {
          icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          label: isMr ? 'मोजमाप' : 'Vitals Measurement',
        };
      case 'vaccination':
        return {
          icon: <ShieldAlert className="w-4 h-4 text-purple-600" />,
          bg: 'bg-purple-50 border-purple-200 text-purple-800',
          label: isMr ? 'लसीकरण' : 'Vaccine',
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-slate-600" />,
          bg: 'bg-slate-50 border-slate-200 text-slate-800',
          label: 'Event',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GitCommit className="w-6 h-6 text-teal-600" />
            {isMr ? 'एकत्रित आरोग्य कालक्रम (Unified Timeline)' : 'Unified Health Timeline'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isMr
              ? 'तुमच्या सर्व आरोग्य घटना कालक्रमानुसार — नोंदी, तपासण्या, भेटी आणि मोजमाप.'
              : 'Chronological timeline combining your stored records, scheduled checkups, vitals, and appointments.'}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 shrink-0" />
          {['All', 'record', 'checkup', 'appointment', 'measurement'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize shrink-0 ${
                filterType === type
                  ? 'bg-teal-700 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {type === 'All' ? (isMr ? 'सर्व (All)' : 'All') : type}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <GitCommit className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {isMr ? 'कालक्रमात कोणत्याही घटना नाहीत' : 'No Events in Timeline'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {isMr
              ? 'वैद्यकीय नोंद किंवा तपासणी जोडल्यावर ती आपोआप येथे कालक्रमानुसार दिसेल.'
              : 'As you save health records, schedule checkups, and record vitals, they will assemble chronologically here.'}
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          <div className="space-y-6">
            {filteredEvents.map((event) => {
              const badge = getEventBadge(event.type);
              const isFuture = new Date(event.date).getTime() > new Date().getTime();

              return (
                <div key={event.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                      isFuture ? 'border-sky-500' : 'border-teal-600'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  </div>

                  {/* Event Card */}
                  <div
                    onClick={() => setSelectedEvent(event)}
                    className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:border-teal-300 hover:shadow-xs transition-all cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${badge.bg}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                        {event.status && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              event.status === 'Confirmed' || event.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : event.status === 'Pending' || event.status === 'Upcoming'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {event.status}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.date}</span>
                        {event.time && <span className="text-slate-400 font-normal">@ {event.time}</span>}
                      </div>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {event.title}
                      </h3>
                      {event.subtitle && (
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{event.subtitle}</p>
                      )}
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-medium">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {isMr ? 'तपशील पहा' : 'View event record'}
                      </span>
                      <span className="text-slate-400 text-[10px]">Real stored data</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded">
                {selectedEvent.type}
              </span>
              <span className="text-xs text-slate-500">
                {selectedEvent.date} {selectedEvent.time || ''}
              </span>
            </div>

            {selectedEvent.subtitle && (
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Context / Provider</span>
                <p className="text-sm font-medium text-slate-800">{selectedEvent.subtitle}</p>
              </div>
            )}

            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Details</span>
              <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {selectedEvent.description}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
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
