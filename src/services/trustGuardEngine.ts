import { Language } from '../types';

export interface TrustGuardResponse {
  isEmergency: boolean;
  emergencyType?: string;
  emergencyAlertEn?: string;
  emergencyAlertMr?: string;
  responseEn: string;
  responseMr: string;
  suggestedQuestionsEn?: string[];
  suggestedQuestionsMr?: string[];
  disclaimerEn: string;
  disclaimerMr: string;
}

// Deterministic Emergency Keywords Screening
// Explicitly checks for life-threatening acute symptoms
const EMERGENCY_PATTERNS = [
  {
    type: 'CARDIAC_CHEST_PAIN',
    keywords: [
      'chest pain',
      'chest tightness',
      'chest pressure',
      'pain radiating to arm',
      'pain in left arm',
      'crushing chest',
      'heart attack',
      'छातीत दुखणे',
      'छातीत कळ',
      'डाव्या हातात दुखणे',
      'हार्ट अटॅक',
    ],
    alertEn: 'POTENTIAL CARDIAC EMERGENCY DETECTED: Acute chest pain or pressure radiating to arm/jaw can be a sign of myocardial infarction (heart attack). DO NOT WAIT.',
    alertMr: 'तातडीची हृदयविकार आणीबाणी: छातीत तीव्र वेदना, दाब किंवा डाव्या हाताकडे जाणारी कळ ही हृदयविकाराच्या झटक्याची लक्षणे असू शकतात. कृपया वेळ वाया घालवू नका.',
  },
  {
    type: 'SEVERE_RESPIRATORY_DISTRESS',
    keywords: [
      'cannot breathe',
      'can\'t breathe',
      'gasping for air',
      'severe shortness of breath',
      'blue lips',
      'choking',
      'श्वास घेता येत नाही',
      'श्वास गुदमरतोय',
      'श्वास कोंडणे',
      'निळे ओठ',
    ],
    alertEn: 'ACUTE RESPIRATORY EMERGENCY: Inability to breathe or severe oxygen deprivation requires immediate emergency airway assistance.',
    alertMr: 'गंभीर श्वासोच्छ्वास आणीबाणी: श्वास घेता न येणे किंवा ऑक्सिजनची तीव्र कमतरता यासाठी त्वरित आपत्कालीन वैद्यकीय मदतीची गरज असते.',
  },
  {
    type: 'STROKE_NEUROLOGICAL',
    keywords: [
      'face drooping',
      'slurred speech',
      'arm weakness',
      'sudden paralysis',
      'sudden numbness',
      'stroke',
      'तोंड वाकडे होणे',
      'बोलता न येणे',
      'हात पाय लुळे पडणे',
      'पक्षाघात',
      'अर्धांगवायू',
    ],
    alertEn: 'POTENTIAL ACUTE STROKE (F.A.S.T.): Sudden facial weakness, speech difficulty, or arm numbness requires immediate emergency stroke care.',
    alertMr: 'पक्षाघात (स्ट्रोक) लक्षणे: चेहऱ्याचा भाग सैल पडणे, बोलण्यात अडखळणे किंवा हातपाय लुळे पडणे ही स्ट्रोकची लक्षणे आहेत. तात्काळ रुग्णालयात जा.',
  },
  {
    type: 'SEVERE_HEMORRHAGE_OR_TRAUMA',
    keywords: [
      'severe bleeding',
      'uncontrolled bleeding',
      'vomiting blood',
      'coughing blood',
      'head trauma',
      'unconscious',
      'passed out',
      'जास्त रक्तस्त्राव',
      'रक्ताची उलटी',
      'रक्ताची खोकला',
      'डोक्याला मार',
      'बेहोश',
      'शुद्ध हरपणे',
    ],
    alertEn: 'SEVERE BLEEDING OR TRAUMA: Uncontrolled hemorrhage or loss of consciousness is a critical emergency requiring immediate paramedic response.',
    alertMr: 'तीव्र रक्तस्त्राव किंवा बेशुद्धावस्था: अनियंत्रित रक्तस्त्राव किंवा शुद्ध हरपणे यासाठी तातडीने रुग्णवाहिका आणि ट्रॉमा केअरची आवश्यकता आहे.',
  },
  {
    type: 'ANAPHYLAXIS',
    keywords: [
      'throat swelling',
      'tongue swelling',
      'severe allergy',
      'anaphylaxis',
      'गळा सुजणे',
      'जीभ सुजणे',
      'तीव्र ॲलर्जी',
    ],
    alertEn: 'ANAPHYLAXIS EMERGENCY: Severe allergic reaction with airway swelling is life-threatening. Seek immediate epinephrine and emergency care.',
    alertMr: 'तीव्र ॲलर्जी (अ‍ॅनाफिलेक्सिस): श्वासनलिका किंवा जीभ सुजणे जीवघेणे ठरू शकते. त्वरित वैद्यकीय उपचार घ्या.',
  },
];

// Predefined Educational Responses for Common Health Topics
interface EducationalTopic {
  triggers: string[];
  titleEn: string;
  titleMr: string;
  responseEn: string;
  responseMr: string;
  questionsEn: string[];
  questionsMr: string[];
}

const EDUCATIONAL_TOPICS: EducationalTopic[] = [
  {
    triggers: ['blood pressure', 'high bp', 'hypertension', 'systolic', 'diastolic', 'रक्तदाब', 'हाय बीपी'],
    titleEn: 'Understanding Blood Pressure Readings',
    titleMr: 'रक्तदाब मोजमाप समजून घेणे',
    responseEn: `Blood pressure consists of two numbers:
• Systolic (top number): Pressure when the heart beats. Normal is typically below 120 mmHg.
• Diastolic (bottom number): Pressure when the heart rests between beats. Normal is typically below 80 mmHg.

Elevated blood pressure (120-129 / <80 mmHg) and Stage 1 Hypertension (130-139 / 80-89 mmHg) often develop without obvious symptoms. In PulseAI, tracking readings across multiple weeks helps your clinician distinguish temporary stress from persistent hypertension.

Safe Next Steps:
1. Record readings at consistent times (e.g. morning after resting 5 minutes).
2. Avoid caffeine, smoking, and heavy meals 30 minutes before measuring.
3. Bring your recorded PulseAI Health Trends log to your doctor for review.`,
    responseMr: `रक्तदाब (Blood Pressure) मध्ये दोन आकडे असतात:
• सिस्टॉलिक (वरचा आकडा): हृदय आकुंचन पावत असतानाचा दाब. सामान्यतः १२० mmHg पेक्षा कमी असावा.
• डायस्टॉलिक (खालचा आकडा): दोन ठोक्यांमधील विश्रांतीच्या वेळेसचा दाब. सामान्यतः ८० mmHg पेक्षा कमी असावा.

उच्च रक्तदाब (हाय बीपी) अनेकदा कोणत्याही लक्षणांशिवाय सुरू होतो. पल्सएआय मधील ट्रेंड्स ट्रॅकरद्वारे नियमित नोंदी ठेवल्यास डॉक्टरांना अचूक निदान करणे सोपे जाते.

पुढील सुरक्षित पावले:
१. दररोज शांत बसून ५ मिनिटांनी नियमित वेळी मोजमाप घ्या.
२. मोजण्यापूर्वी चहा, कॉफी किंवा धूम्रपान टाळा.
३. पल्सएआय वरील नोंदी तुमच्या डॉक्टरांना दाखवा.`,
    questionsEn: [
      'What is my personal target blood pressure range?',
      'Are lifestyle modifications (diet/exercise) sufficient or is medication needed?',
      'How frequently should I record my readings at home?',
    ],
    questionsMr: [
      'माझ्यासाठी रक्तदाबाचे आदर्श प्रमाण काय असावे?',
      'फक्त आहार आणि व्यायामाने नियंत्रण होईल की औषधांची गरज आहे?',
      'घरी दिवसातून किंवा आठवड्यातून किती वेळा बीपी तपासावा?',
    ],
  },
  {
    triggers: ['sugar', 'glucose', 'diabetes', 'fasting', 'hba1c', 'मधुमेह', 'साखर'],
    titleEn: 'Blood Glucose & Diabetes Awareness',
    titleMr: 'रक्तातील साखर आणि मधुमेह जनजागृती',
    responseEn: `Blood sugar levels fluctuate naturally based on meals, stress, and activity:
• Fasting Blood Glucose: Typically 70 to 99 mg/dL for non-diabetic adults. Values between 100-125 mg/dL suggest impaired fasting glucose (pre-diabetes).
• Post-Prandial (2 hours after meal): Typically below 140 mg/dL.
• HbA1c: Reflects your average blood glucose over the past 3 months. Below 5.7% is considered normal.

A single high or low reading does not establish a diagnosis. Consistent trends and certified laboratory testing are essential.

Safe Next Steps:
1. Log whether your measurement was fasting or post-meal in PulseAI.
2. Note any symptoms such as excessive thirst, frequent urination, or unexplained fatigue.
3. Consult a physician or diabetologist for proper diagnostic evaluation.`,
    responseMr: `रक्तातील साखरेचे प्रमाण जेवण, ताण आणि हालचालींवर अवलंबून असते:
• फास्टिंग (उपाशीपोटी): सामान्यतः ७० ते ९९ mg/dL. १०० ते १२५ mg/dL हे प्री-डायबिटीज दर्शवू शकते.
• पोस्ट-प्रांडिअल (जेवणानंतर २ तासांनी): सामान्यतः १४० mg/dL पेक्षा कमी.
• HbA1c: गेल्या ३ महिन्यांतील साखरेची सरासरी. ५.७% पेक्षा कमी असणे सामान्य मानले जाते.

एकाच तपासणीवरून मधुमेह ठरवता येत नाही. प्रयोगशाळेतील तपासणी आवश्यक असते.

पुढील सुरक्षित पावले:
१. मोजमाप घेताना फास्टिंग की जेवणानंतर हे पल्सएआय मध्ये नोंदवा.
२. अति तहान लागणे, वारंवार लघवी होणे किंवा अशक्तपणा अशी लक्षणे असल्यास नोंद ठेवा.
३. योग्य निदानासाठी डॉक्टरांचा सल्ला घ्या.`,
    questionsEn: [
      'Do I need an oral glucose tolerance test or repeat HbA1c?',
      'What dietary changes are most effective for my glucose numbers?',
      'Should I be screening for kidney, eye, or nerve health?',
    ],
    questionsMr: [
      'मला HbA1c किंवा इतर रक्त तपासण्या पुन्हा करण्याची गरज आहे का?',
      'साखर नियंत्रणासाठी आहारात कोणते बदल करावेत?',
      'डोळे किंवा मूत्रपिंडांची तपासणी करणे आवश्यक आहे का?',
    ],
  },
  {
    triggers: ['fever', 'temperature', 'chills', 'ताप', 'थंडी वाजून ताप'],
    titleEn: 'Understanding Fever & General Precautions',
    titleMr: 'ताप आणि प्राथमिक काळजी',
    responseEn: `Fever is a natural immune response to an infection. A normal body temperature is around 98.6°F (37°C). A temperature of 100.4°F (38°C) or higher is clinically considered a fever.

Important Cautionary Signs (Seek Immediate Medical Care):
• Fever above 103°F (39.4°C) that does not respond to cooling.
• Fever accompanied by stiff neck, confusion, breathing difficulty, or rash.
• Fever persisting for more than 3 consecutive days.

Safe Supportive Measures:
1. Rest adequately and maintain consistent hydration with water, ORS, or soups.
2. Use a digital thermometer and log exact readings and times in PulseAI.
3. Consult a doctor for diagnosis before taking antibiotics or repeated medications.`,
    responseMr: `ताप ही शरीराची संसर्गाशी लढण्याची नैसर्गिक प्रतिक्रिया आहे. शरीराचे सामान्य तापमान साधारण ९८.६°F (३७°C) असते. १००.४°F (३८°C) पेक्षा जास्त तापमान असल्यास ताप मानला जातो.

तातडीने डॉक्टरांकडे जाण्याची लक्षणे:
• १०३°F पेक्षा जास्त ताप जो कमी होत नाही.
• तापासोबत मान ताठ होणे, गोंधळ उडणे, श्वास घेण्यास त्रास किंवा त्वचेवर पुरळ.
• सलग ३ दिवसांपेक्षा जास्त काळ ताप राहणे.

प्राथमिक काळजी:
१. पुरेशी विश्रांती घ्या आणि पाणी, ओआरएस किंवा पातळ द्रवपदार्थ भरपूर प्या.
२. थर्मामीटरने अचूक तापमान मोजून वेळेसह नोंद ठेवा.
३. प्रतिजैविके (अँटीबायोटिक्स) डॉक्टरांच्या सल्ल्याशिवाय घेऊ नका.`,
    questionsEn: [
      'Is diagnostic testing for malaria, dengue, or viral illness indicated?',
      'What fever-reducing medication and dosage is safe for me?',
      'At what threshold should I seek emergency evaluation?',
    ],
    questionsMr: [
      'डेंग्यू, मलेरिया किंवा इतर रक्ताच्या चाचण्या करण्याची गरज आहे का?',
      'माझ्यासाठी कोणते औषध सुरक्षित आहे?',
      'कोणत्या लक्षणांनंतर त्वरित दवाखान्यात दाखल व्हावे?',
    ],
  },
  {
    triggers: ['headache', 'migraine', 'dizziness', 'डोकेदुखी', 'चक्कर', 'मायग्रेन'],
    titleEn: 'Headaches & Dizziness Awareness',
    titleMr: 'डोकेदुखी आणि चक्कर येणे',
    responseEn: `Headaches can stem from tension, dehydration, eye strain, lack of sleep, or migraine. Dizziness can occur with dehydration, sudden standing (orthostatic), inner ear balance issues, or BP changes.

Red Flag Warning:
If a headache is sudden and described as "the worst headache of your life" (thunderclap), or comes with numbness, slurred speech, or vision loss, this is a medical emergency.

Helpful Steps for Mild Symptoms:
1. Rest in a dark, quiet room.
2. Drink a glass of water to rule out dehydration.
3. Check your blood pressure if you have a monitor at home.
4. Prepare your symptom duration in VisitReady to share with your physician.`,
    responseMr: `डोकेदुखी ही ताणतणाव, पाण्याची कमतरता, डोळ्यांवर ताण, अपुरी झोप किंवा मायग्रेनमुळे होऊ शकते. चक्कर येणे हे रक्तदाब कमी-जास्त झाल्याने किंवा डिहायड्रेशनमुळे होऊ शकते.

महत्त्वाचा इशारा:
अचानक असह्य डोकेदुखी सुरू झाल्यास, किंवा सोबत हातपाय लुळे पडणे, अंधुक दिसणे किंवा बोलण्यास अडचण आल्यास त्वरित आपत्कालीन विभागात जा.

प्राथमिक उपाय:
१. शांत आणि अंधाऱ्या खोलीत विश्रांती घ्या.
२. पुरेसे पाणी प्या.
३. घरात बीपी मशीन असल्यास रक्तदाब तपासा.
४. लक्षणे किती दिवसांपासून आहेत याची नोंद ठेवा.`,
    questionsEn: [
      'Could my headache be linked to blood pressure or vision changes?',
      'What triggers should I track in my daily routine?',
      'Do I need neurological imaging or specialized evaluation?',
    ],
    questionsMr: [
      'माझी डोकेदुखी रक्तदाब किंवा डोळ्यांच्या नंबरशी संबंधित आहे का?',
      'मी कोणत्या कारणांवर लक्ष ठेवावे?',
      'काही विशेष तपासणी (उदा. स्कॅन) करण्याची गरज आहे का?',
    ],
  },
];

// Fallback Educational Guidance for general inquiries
function getGenericEducationalResponse(query: string, lang: Language): TrustGuardResponse {
  const isMr = lang === 'mr';
  return {
    isEmergency: false,
    responseEn: `Thank you for sharing your inquiry regarding: "${query}".

PulseAI TrustGuard provides verified healthcare education:
• Objective Tracking: Tracking symptoms, dates, and vitals helps doctors reach faster, safer clinical conclusions.
• Safe Consultation: Non-urgent health concerns are best evaluated through an in-person physical examination and validated lab tests.
• Preparation: You can use the "VisitReady" module to compile your symptoms and historical records into an organized summary for your doctor.

Remember: PulseAI is an informational assistant and does not replace a clinical examination or provide prescriptions.`,
    responseMr: `आपल्या प्रश्नाबद्दल धन्यवाद: "${query}".

पल्सएआय ट्रस्टगार्ड आरोग्य शिक्षण मार्गदर्शन:
• अचूक नोंदी: लक्षणे, कालावधी आणि मोजमाप नोंदवून ठेवल्यास डॉक्टरांना योग्य निदान करणे सुलभ होते.
• सुरक्षित सल्ला: कोणत्याही आजाराचे अचूक निदान प्रत्यक्ष तपासणी आणि प्रयोगशाळा चाचण्यांनंतरच शक्य असते.
• भेट पूर्वतयारी: आपण "VisitReady" साधनाद्वारे आपल्या लक्षणांचा सारांश तयार करून डॉक्टरांना दाखवू शकता.

लक्षात ठेवा: पल्सएआय हे केवळ शैक्षणिक मार्गदर्शक आहे आणि डॉक्टरांच्या प्रत्यक्ष तपासणीचा पर्याय नाही.`,
    suggestedQuestionsEn: [
      'What potential causes should I discuss with my physician?',
      'What home observations or measurements will be most helpful to track?',
      'What symptoms would warrant urgent medical attention?',
    ],
    suggestedQuestionsMr: [
      'या लक्षणांबद्दल मी डॉक्टरांशी काय चर्चा करावी?',
      'मी घरात कोणती मोजमापे किंवा नोंदी ठेवाव्यात?',
      'कोणती लक्षणे दिसल्यास त्वरित दवाखान्यात जावे?',
    ],
    disclaimerEn: 'Educational information only. Does not constitute medical diagnosis or advice. Always consult a qualified physician.',
    disclaimerMr: 'केवळ शैक्षणिक माहिती. हे वैद्यकीय निदान किंवा सल्ला नाही. नेहमी पात्र डॉक्टरांचा सल्ला घ्या.',
  };
}

export function evaluateHealthQuery(query: string, lang: Language): TrustGuardResponse {
  const lowerQuery = query.toLowerCase().trim();

  // 1. DETERMINISTIC EMERGENCY CHECK FIRST
  // Runs before ANY processing and never waits for an external service
  for (const emergency of EMERGENCY_PATTERNS) {
    for (const keyword of emergency.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        return {
          isEmergency: true,
          emergencyType: emergency.type,
          emergencyAlertEn: emergency.alertEn,
          emergencyAlertMr: emergency.alertMr,
          responseEn: `🚨 CRITICAL SAFETY NOTICE: Your query contains terms associated with a potential medical emergency (${emergency.type.replace(/_/g, ' ')}).
          
DO NOT rely on this application or wait for online responses.

IMMEDIATE ACTIONS FOR INDIA:
1. Dial 112 (National Unified Emergency Services) or 108 (Emergency Medical Ambulance).
2. Go to the nearest Hospital Emergency Department immediately.
3. If with someone, notify them immediately so they can assist you.

PulseAI uses a deterministic safety screening filter. While this filter assists in identifying dangerous keywords, it is not a clinically validated emergency triage device. Always prioritize immediate emergency medical services.`,
          responseMr: `🚨 गंभीर वैद्यकीय इशारा: आपल्या प्रश्नामध्ये तातडीच्या आणीबाणीशी संबंधित लक्षणे आढळली आहेत (${emergency.alertMr}).

कृपया या ॲपवर अवलंबून राहू नका किंवा उत्तराची वाट पाहू नका.

तातडीची कृती (महाराष्ट्र / भारत):
१. त्वरित ११२ (आपत्कालीन सेवा) किंवा १०८ (रुग्णवाहिका) वर कॉल करा.
२. जवळच्या रुग्णालयाच्या अतिदक्षता / आणीबाणी विभागात (Emergency/Casualty) त्वरित जा.
३. जवळ असणाऱ्या व्यक्तीला लगेच सांगा जेणेकरून ते मदत करू शकतील.

पल्सएआय तात्काळ सुरक्षेसाठी हे दाखवत आहे. थेट डॉक्टरांशी किंवा रुग्णालयाशी संपर्क साधा.`,
          disclaimerEn: 'EMERGENCY ALERT: Immediate physical emergency evaluation required. Do not wait.',
          disclaimerMr: 'आपत्कालीन सूचना: त्वरित प्रत्यक्ष वैद्यकीय मदतीची आवश्यकता आहे.',
        };
      }
    }
  }

  // 2. CHECK PREDEFINED EDUCATIONAL TOPICS
  for (const topic of EDUCATIONAL_TOPICS) {
    for (const trigger of topic.triggers) {
      if (lowerQuery.includes(trigger.toLowerCase())) {
        return {
          isEmergency: false,
          responseEn: topic.responseEn,
          responseMr: topic.responseMr,
          suggestedQuestionsEn: topic.questionsEn,
          suggestedQuestionsMr: topic.questionsMr,
          disclaimerEn: 'PulseAI TrustGuard provides educational information only. It is not a diagnostic tool and does not prescribe treatments.',
          disclaimerMr: 'पल्सएआय ट्रस्टगार्ड केवळ शैक्षणिक माहितीसाठी आहे. हे वैद्यकीय निदान किंवा औषधोपचार देत नाही.',
        };
      }
    }
  }

  // 3. GENERIC EDUCATIONAL GUIDANCE
  return getGenericEducationalResponse(query, lang);
}
