import { Language } from '../types';

export const translations = {
  en: {
    appTitle: 'PulseAI',
    appTagline: 'Smarter Healthcare, Simplified',
    appSubhead: 'AI-Powered Healthcare Continuity Platform for Maharashtra & India',
    zeroCostBadge: '₹0 Zero Mandatory Cost | Hackathon MVP',
    
    // Portal navigation
    patientPortal: 'Patient Portal',
    adminPortal: 'Admin Operations',
    enterPatientPortal: 'Launch Patient Portal',
    enterAdminPortal: 'Launch Admin Portal',
    
    // User sidebar
    dashboard: 'Continuity Dashboard',
    healthMemory: 'Health Memory',
    healthTimeline: 'Health Timeline',
    monthlyCheckups: 'Monthly Checkups',
    smartReminders: 'Smart Reminders',
    healthTrends: 'Health Trends',
    aiNavigator: 'AI Health Navigator',
    visitReady: 'VisitReady Prep',
    hospitalDirectory: 'Hospitals & Doctors',
    appointments: 'My Appointments',
    medications: 'Meds & Vaccines',
    wellness: 'Wellness & Vitals',
    privacySettings: 'Storage & Privacy',
    logout: 'Logout',
    
    // Admin nav
    adminDashboard: 'Operations Analytics',
    hospitalManagement: 'Hospital Directory',
    doctorManagement: 'Doctor Directory',
    appointmentManagement: 'Demo Appointments',
    adminExit: 'Exit Admin',

    // Emergency Banner
    emergencyAlert: 'MEDICAL EMERGENCY NOTICE',
    emergencyText: 'If you or someone near you is experiencing severe chest pain, shortness of breath, sudden numbness, or heavy bleeding, call 112 (National Emergency) or 108 (Ambulance) immediately in India. PulseAI does not provide emergency triage.',
    emergencyNumber: 'Emergency Helpline: 112 | Ambulance: 108',
    
    // Common Actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search...',
    filter: 'Filter',
    all: 'All',
    viewDetails: 'View Details',
    close: 'Close',
    print: 'Print / Export',
    addNew: 'Add New',
    confirm: 'Confirm',
    status: 'Status',
    actions: 'Actions',
    date: 'Date',
    time: 'Time',
    notes: 'Notes',
    provider: 'Healthcare Provider / Clinic',
    category: 'Category',
    title: 'Title',
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    
    // Health Memory
    memoryTitle: 'Health Memory Vault',
    memorySubtitle: 'Organize and search your personal medical records, lab reports, and consultations.',
    newRecord: 'Create Health Record',
    noRecords: 'No health records found. Add your first medical record or consultation note to begin building your continuity timeline.',
    
    // Timeline
    timelineTitle: 'Unified Health Timeline',
    timelineSubtitle: 'Your chronological medical journey — connecting past records, scheduled checkups, and vitals.',
    allEvents: 'All Events',
    recordsOnly: 'Records Only',
    checkupsOnly: 'Checkups Only',
    appointmentsOnly: 'Appointments Only',
    
    // Monthly Checkups
    checkupTitle: 'Monthly Routine Checkups',
    checkupSubtitle: 'Stay ahead of chronic conditions with scheduled recurring checkups and in-app reminders.',
    scheduleCheckup: 'Schedule Checkup',
    upcomingCheckups: 'Upcoming Checkups',
    pastCheckups: 'Completed & Past Checkups',
    markCompleted: 'Mark as Completed',
    recordVitals: 'Record Measurements',
    
    // Trends
    trendsTitle: 'Health Trends & Vitals History',
    trendsSubtitle: 'Real trends derived strictly from your entered measurements. No fabricated clinical claims.',
    bloodPressure: 'Blood Pressure',
    heartRate: 'Heart Rate',
    weight: 'Body Weight',
    glucose: 'Blood Glucose',
    latestValue: 'Latest Value',
    previousValue: 'Previous Value',
    changeDelta: 'Change Delta',
    noTrendData: 'Not enough data points. Record at least 2 measurements to view historical trend comparisons.',
    
    // TrustGuard
    trustguardTitle: 'AI Health Navigator — TrustGuard',
    trustguardSubtitle: 'Bilingual health educational information with instant deterministic emergency screening.',
    askPrompt: 'Ask a health question in English or Marathi (e.g., "What does high BP mean?" or "मला चक्कर येत आहे काय करावे?")...',
    send: 'Send Question',
    trustguardDisclaimer: 'PulseAI TrustGuard provides educational information only. It is not a diagnostic tool or a substitute for medical professionals.',
    
    // VisitReady
    visitReadyTitle: 'VisitReady — Doctor Consultation Prep',
    visitReadySubtitle: 'Prepare an organized, concise medical summary and targeted questions for your doctor visit.',
    generateSummary: 'Generate Consultation Brief',
    mainConcernLabel: 'Primary Reason for Visit',
    symptomsLabel: 'Symptoms in Your Own Words',
    durationLabel: 'Duration (e.g., 3 days, 2 weeks)',
    questionsLabel: 'Questions You Want to Ask the Doctor',
    
    // Directory
    directoryTitle: 'Maharashtra Healthcare Directory',
    directorySubtitle: '15 Fictional demonstration hospitals across 10 Maharashtra cities with 18+ specialists.',
    searchPlaceholder: 'Search by hospital, doctor name, city, or specialty...',
    allCities: 'All Cities',
    allSpecialties: 'All Specialties',
    bookDemoAppt: 'Request Demo Appointment',
    demoNotice: 'Demo Notice: All facilities, doctors, schedules, and bed numbers are fictional demonstration samples.',

    // Language Toggle
    currentLanguage: 'Language',
  },
  mr: {
    appTitle: 'पल्सएआय (PulseAI)',
    appTagline: 'स्मार्ट आरोग्यसेवा, अधिक सुलभ',
    appSubhead: 'महाराष्ट्रासाठी एआय-सक्षम आरोग्य सातत्य आणि रेकॉर्ड व्यवस्थापन व्यासपीठ',
    zeroCostBadge: '₹० शून्य अनिवार्य खर्च | हॅकाथॉन एमव्हीपी',
    
    // Portal navigation
    patientPortal: 'रुग्ण पोर्टल (Patient Portal)',
    adminPortal: 'प्रशासक ऑपरेशन्स (Admin)',
    enterPatientPortal: 'रुग्ण पोर्टल उघडा',
    enterAdminPortal: 'प्रशासक पोर्टल उघडा',
    
    // User sidebar
    dashboard: 'सातत्य डॅशबोर्ड',
    healthMemory: 'आरोग्य नोंदवही (Memory)',
    healthTimeline: 'आरोग्य कालक्रम (Timeline)',
    monthlyCheckups: 'मासिक तपासण्या (Checkups)',
    smartReminders: 'स्मार्ट स्मरणपत्रे (Reminders)',
    healthTrends: 'आरोग्य ट्रेंड्स (Trends)',
    aiNavigator: 'एआय आरोग्य मार्गदर्शक',
    visitReady: 'डॉक्टर भेट तयारी (VisitReady)',
    hospitalDirectory: 'रुग्णालये आणि डॉक्टर्स',
    appointments: 'माझ्या भेटी (Appointments)',
    medications: 'औषधे आणि लसीकरण',
    wellness: 'आरोग्य साधने (Wellness)',
    privacySettings: 'डेटा गोपनीयता आणि स्टोरेज',
    logout: 'बाहेर पडा (Logout)',
    
    // Admin nav
    adminDashboard: 'ऑपरेशन्स आकडेवारी',
    hospitalManagement: 'रुग्णालय व्यवस्थापन',
    doctorManagement: 'डॉक्टर व्यवस्थापन',
    appointmentManagement: 'डेमो अपॉइंटमेंट्स',
    adminExit: 'प्रशासक पोर्टल बंद करा',

    // Emergency Banner
    emergencyAlert: 'तात्काळ वैद्यकीय सूचना (आणीबाणी)',
    emergencyText: 'जर तुम्हाला किंवा जवळच्या व्यक्तीला छातीत तीव्र दुखणे, श्वास घेण्यास त्रास, अचानक अशक्तपणा किंवा जास्त रक्तस्त्राव होत असल्यास, त्वरित ११२ (राष्ट्रीय आणीबाणी) किंवा १०८ (रुग्णवाहिका) वर संपर्क साधा. पल्सएआय आणीबाणीच्या उपचारांसाठी नाही.',
    emergencyNumber: 'आपत्कालीन मदत: ११२ | रुग्णवाहिका: १०८',
    
    // Common Actions
    save: 'जतन करा',
    cancel: 'रद्द करा',
    edit: 'संपादित करा',
    delete: 'हटवा',
    search: 'शोधा...',
    filter: 'फिल्टर',
    all: 'सर्व',
    viewDetails: 'तपशील पहा',
    close: 'बंद करा',
    print: 'प्रिंट / एक्सपोर्ट',
    addNew: 'नवीन जोडा',
    confirm: 'पुष्टी करा',
    status: 'स्थिती',
    actions: 'क्रिया',
    date: 'तारीख',
    time: 'वेळ',
    notes: 'नोंदी',
    provider: 'आरोग्य केंद्र / डॉक्टर',
    category: 'वर्गवारी',
    title: 'शीर्षक',
    pending: 'प्रलंबित (Pending)',
    confirmed: 'मंजूर (Confirmed)',
    cancelled: 'रद्द (Cancelled)',
    
    // Health Memory
    memoryTitle: 'वैयक्तिक आरोग्य नोंदवही',
    memorySubtitle: 'तुमचे वैद्यकीय अहवाल, डॉक्टरांच्या चिठ्ठ्या आणि तपासणी नोंदी सुरक्षितपणे व्यवस्थापित करा.',
    newRecord: 'नवीन नोंद तयार करा',
    noRecords: 'कोणतीही नोंद आढळली नाही. तुमची पहिली वैद्यकीय नोंद जोडून सुरुवात करा.',
    
    // Timeline
    timelineTitle: 'एकत्रित आरोग्य कालक्रम',
    timelineSubtitle: 'तुमचा संपूर्ण आरोग्य प्रवास — मागील नोंदी, नियोजित तपासण्या आणि मोजमाप एकाच ठिकाणी.',
    allEvents: 'सर्व घटना',
    recordsOnly: 'फक्त नोंदी',
    checkupsOnly: 'फक्त तपासण्या',
    appointmentsOnly: 'फक्त भेटी',
    
    // Monthly Checkups
    checkupTitle: 'नियमित मासिक तपासण्या',
    checkupSubtitle: 'नियमित मासिक तपासण्या आणि वेळेवर स्मरणपत्रांसह आपले आरोग्य सुदृढ ठेवा.',
    scheduleCheckup: 'तपासणी नियोजित करा',
    upcomingCheckups: 'आगामी तपासण्या',
    pastCheckups: 'पूर्ण झालेल्या तपासण्या',
    markCompleted: 'पूर्ण झाली म्हणून नोंदवा',
    recordVitals: 'मोजमाप नोंदवा',
    
    // Trends
    trendsTitle: 'आरोग्य कल आणि मोजमाप इतिहास',
    trendsSubtitle: 'केवळ तुम्ही नोंदवलेल्या खऱ्या मोजमापांवर आधारित विश्लेषण. कोणतेही खोटे दावे नाहीत.',
    bloodPressure: 'रक्तदाब (BP)',
    heartRate: 'हृदयाचे ठोके',
    weight: 'वजन (किलो)',
    glucose: 'रक्तातील साखर (Glucose)',
    latestValue: 'नवीनतम मूल्य',
    previousValue: 'मागील मूल्य',
    changeDelta: 'बदल फरक',
    noTrendData: 'तौलनिक कल पाहण्यासाठी किमान दोन नोंदी आवश्यक आहेत.',
    
    // TrustGuard
    trustguardTitle: 'एआय आरोग्य मार्गदर्शक — ट्रस्टगार्ड',
    trustguardSubtitle: 'तातडीच्या लक्षणांची त्वरित ओळख आणि सोप्या भाषेतील आरोग्य शिक्षण (मराठी आणि इंग्रजी).',
    askPrompt: 'मराठी किंवा इंग्रजीत आरोग्याविषयी प्रश्न विचारा (उदा. "रक्तदाब वाढल्यास काय करावे?" किंवा "मला डोकेदुखी आहे")...',
    send: 'प्रश्न विचारा',
    trustguardDisclaimer: 'पल्सएआय ट्रस्टगार्ड केवळ शैक्षणिक माहितीसाठी आहे. हे वैद्यकीय निदान किंवा डॉक्टरांच्या सल्ल्याचा पर्याय नाही.',
    
    // VisitReady
    visitReadyTitle: 'व्हिजिट-रेडी — डॉक्टर भेट पूर्वतयारी',
    visitReadySubtitle: 'डॉक्टरांच्या भेटीसाठी तुमची लक्षणे, मागील नोंदी आणि महत्वाचे प्रश्न संकलित करा.',
    generateSummary: 'तयारी सारांश तयार करा',
    mainConcernLabel: 'भेटीचे मुख्य कारण',
    symptomsLabel: 'तुमच्या शब्दांत लक्षणे',
    durationLabel: 'कालावधी (उदा. ३ दिवस, १ आठवडा)',
    questionsLabel: 'डॉक्टरांना विचारायचे प्रश्न',
    
    // Directory
    directoryTitle: 'महाराष्ट्र आरोग्य निर्देशिका',
    directorySubtitle: 'महाराष्ट्रातील १० शहरांमधील १५ नमुना रुग्णालये आणि १८+ तज्ज्ञ डॉक्टर्स.',
    searchPlaceholder: 'रुग्णालय, डॉक्टर, शहर किंवा विशेषज्ञांद्वारे शोधा...',
    allCities: 'सर्व शहरे',
    allSpecialties: 'सर्व विशेषज्ञ',
    bookDemoAppt: 'डेमो अपॉइंटमेंट विनंती करा',
    demoNotice: 'डेमो सूचना: सर्व रुग्णालये, डॉक्टर्स आणि खाटांची संख्या ही केवळ प्रात्यक्षिकासाठी काल्पनिक माहिती आहे.',

    // Language Toggle
    currentLanguage: 'भाषा',
  }
};

export function getTranslation(lang: Language, key: keyof typeof translations['en']): string {
  return translations[lang]?.[key] || translations['en'][key] || key;
}
