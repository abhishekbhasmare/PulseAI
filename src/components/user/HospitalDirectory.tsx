import React, { useState } from 'react';
import { Hospital, Doctor, Language } from '../../types';
import { bookAppointment } from '../../services/storage';
import { Modal } from '../common/Modal';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Phone,
  Bed,
  Clock,
  UserCheck,
  CalendarCheck,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface HospitalDirectoryProps {
  hospitals: Hospital[];
  doctors: Doctor[];
  userId: string;
  userName: string;
  userPhone?: string;
  language: Language;
  onAppointmentBooked?: () => void;
}

export const HospitalDirectory: React.FC<HospitalDirectoryProps> = ({
  hospitals,
  doctors,
  userId,
  userName,
  userPhone = '+91 98220 12345',
  language,
  onAppointmentBooked,
}) => {
  const isMr = language === 'mr';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // Modal State for Viewing Hospital / Booking
  const [viewingHospital, setViewingHospital] = useState<Hospital | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingHospital, setBookingHospital] = useState<Hospital | null>(null);

  // Booking Form State
  const [patientName, setPatientName] = useState(userName);
  const [patientPhone, setPatientPhone] = useState(userPhone);
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState('11:00 AM');
  const [reason, setReason] = useState('Routine consultation for blood pressure and wellness review');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Cities extracted
  const cities = Array.from(new Set(hospitals.map((h) => h.city))).sort();

  // Specialties extracted
  const specialties = Array.from(
    new Set(hospitals.flatMap((h) => h.specialties))
  ).sort();

  // Filtered Hospitals
  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doctors
        .filter((d) => d.hospitalId === h.id)
        .some((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = selectedCity === 'All' || h.city === selectedCity;
    const matchesSpec = selectedSpecialty === 'All' || h.specialties.includes(selectedSpecialty);

    return matchesSearch && matchesCity && matchesSpec;
  });

  const handleOpenBooking = (doc: Doctor, hosp?: Hospital) => {
    const hospital = hosp || hospitals.find((h) => h.id === doc.hospitalId);
    setBookingDoctor(doc);
    setBookingHospital(hospital || null);
    setPatientName(userName);
    setPatientPhone(userPhone);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor || !bookingHospital) return;

    bookAppointment({
      userId,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      hospitalId: bookingHospital.id,
      hospitalName: bookingHospital.name,
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      department: bookingDoctor.specialty,
      appointmentDate,
      appointmentTime,
      reason: reason.trim(),
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingDoctor(null);
      setBookingHospital(null);
      if (onAppointmentBooked) onAppointmentBooked();
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Title & Hackathon Disclaimers */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-teal-600" />
            {isMr ? 'महाराष्ट्र आरोग्य निर्देशिका' : 'Maharashtra Healthcare Directory'}
          </h2>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold border border-slate-200 self-start sm:self-auto">
            15 Hospitals • 10 Cities • 18+ Specialists
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isMr
            ? 'महाराष्ट्रातील १० शहरांमधील प्रात्यक्षिक रुग्णालये आणि तज्ज्ञ डॉक्टर्स शोधा व डेमो अपॉइंटमेंट विनंती करा.'
            : 'Explore demonstration hospitals and specialist doctors across 10 Maharashtra cities. Request simulated appointments.'}
        </p>
      </div>

      {/* Prominent Fictional Data Disclosure Notice */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Demonstration Notice:</strong> All hospital names, doctors, contact numbers, schedules, and bed counts are fictional sample records for hackathon demonstration. Demo appointment requests are processed within the platform database and do not contact real facilities.
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isMr ? 'रुग्णालय, डॉक्टर, शहर किंवा विशेषज्ञांद्वारे शोधा...' : 'Search hospital, doctor, city, specialty...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* City Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">{isMr ? 'सर्व १० शहरे (All Cities)' : 'All 10 Cities'}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">{isMr ? 'सर्व विशेष विभाग (All Specialties)' : 'All Specialties'}</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHospitals.map((hosp) => {
          const hospDoctors = doctors.filter((d) => d.hospitalId === hosp.id);

          return (
            <div
              key={hosp.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between p-5"
            >
              <div>
                {/* Header: City Tag & Emergency Badge */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {hosp.city}, MH
                  </span>
                  {hosp.emergencyAvailable ? (
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-rose-500" /> 24/7 Emergency
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Daycare OPD
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2.5 leading-snug">{hosp.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{hosp.address}</p>

                {/* Specialties tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {hosp.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Operational Details (Sample Beds & Timings) */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-teal-600" />
                    <span>
                      Beds: <strong>{hosp.availableBeds}</strong> / {hosp.totalBeds}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span className="truncate">{hosp.contactNumber}</span>
                  </div>
                </div>

                {/* Available Doctors at this facility */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Specialist Doctors ({hospDoctors.length})
                  </span>
                  <div className="space-y-2">
                    {hospDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                          <p className="text-[11px] text-teal-700 truncate">{doc.specialty}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            ₹{doc.consultationFee} • {doc.sampleSchedule}
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenBooking(doc, hosp)}
                          className="bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-md shadow-2xs transition-colors shrink-0"
                        >
                          {isMr ? 'अपॉइंटमेंट' : 'Book Demo'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[10px]">{hosp.sampleTimings}</span>
                <button
                  onClick={() => setViewingHospital(hosp)}
                  className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {isMr ? 'तपशील' : 'Details'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hospital Detail Modal */}
      {viewingHospital && (
        <Modal
          isOpen={!!viewingHospital}
          onClose={() => setViewingHospital(null)}
          title={viewingHospital.name}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-teal-50 text-teal-800">
                {viewingHospital.city}, Maharashtra
              </span>
              <span className="text-xs text-slate-500">
                Sample Beds: {viewingHospital.availableBeds} / {viewingHospital.totalBeds}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Address & Location</span>
              <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5">{viewingHospital.address}</p>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Clinical Description</span>
              <p className="text-xs sm:text-sm text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {viewingHospital.description}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase mb-1">Departments</span>
              <div className="flex flex-wrap gap-1.5">
                {viewingHospital.specialties.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-teal-50 text-teal-800 text-xs font-medium rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-900 border border-amber-200">
              * Fictional demonstration facility record. Bed availability and timings are sample simulations.
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setViewingHospital(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Book Demo Appointment Modal */}
      {bookingDoctor && bookingHospital && (
        <Modal
          isOpen={!!bookingDoctor}
          onClose={() => {
            setBookingDoctor(null);
            setBookingHospital(null);
          }}
          title={isMr ? 'डेमो अपॉइंटमेंट विनंती' : 'Request Demo Appointment'}
        >
          {bookingSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {isMr ? 'अपॉइंटमेंट विनंती यशस्वीपणे नोंदवली!' : 'Demo Appointment Request Submitted!'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your request with <strong>{bookingDoctor.name}</strong> at <strong>{bookingHospital.name}</strong> is now Pending in the Admin Operations portal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              {/* Doctor and Hospital Header Card */}
              <div className="p-3.5 bg-teal-50/70 rounded-xl border border-teal-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-950 text-sm">{bookingDoctor.name}</span>
                  <span className="font-bold text-teal-800">Fee: ₹{bookingDoctor.consultationFee}</span>
                </div>
                <p className="text-teal-800 font-medium">
                  {bookingDoctor.specialty} • {bookingDoctor.qualifications}
                </p>
                <p className="text-slate-500 text-[11px]">{bookingHospital.name}, {bookingHospital.city}</p>
                <p className="text-slate-500 text-[11px]">Available: {bookingDoctor.sampleSchedule}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot *</label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="09:30 AM">09:30 AM (Morning OPD)</option>
                  <option value="11:00 AM">11:00 AM (Morning OPD)</option>
                  <option value="02:30 PM">02:30 PM (Afternoon OPD)</option>
                  <option value="05:00 PM">05:00 PM (Evening OPD)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit *</label>
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Follow-up on blood pressure and general checkup"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500">
                Notice: This creates a demo appointment visible in your patient dashboard and the Admin Operations portal. Does not make external phone calls or bookings.
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBookingDoctor(null);
                    setBookingHospital(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
                >
                  Submit Demo Request
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
