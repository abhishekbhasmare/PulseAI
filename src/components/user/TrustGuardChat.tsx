import React, { useState } from 'react';
import { Language, ChatMessage } from '../../types';
import { evaluateHealthQuery } from '../../services/trustGuardEngine';
import {
  Bot,
  ShieldAlert,
  Send,
  PhoneCall,
  Info,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  User,
} from 'lucide-react';

interface TrustGuardChatProps {
  language: Language;
}

export const TrustGuardChat: React.FC<TrustGuardChatProps> = ({ language }) => {
  const isMr = language === 'mr';
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am PulseAI TrustGuard, your bilingual healthcare educational navigator. 

You can ask questions about common vitals (like blood pressure or blood glucose), routine symptoms, or how to prepare questions for your doctor in English or Marathi.

⚠️ Safety Notice: I do not provide medical diagnosis, prescribe drugs, or replace a doctor. In a medical emergency, immediately call 112 or 108 in India.`,
      textMr: `नमस्कार! मी पल्सएआय ट्रस्टगार्ड आहे, तुमचा द्विभाषिक आरोग्य शिक्षण मार्गदर्शक.

तुम्ही रक्तदाब, रक्तातील साखर, सामान्य लक्षणे किंवा डॉक्टरांना विचारायचे प्रश्न याबद्दल मराठी किंवा इंग्रजीत विचारू शकता.

⚠️ सुरक्षेची सूचना: मी वैद्यकीय निदान करत नाही किंवा औषधे देत नाही. आणीबाणीच्या परिस्थितीत त्वरित ११२ किंवा १०८ वर संपर्क साधा.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Sample prompt chips for instant 1-click evaluation by judges
  const samplePrompts = [
    {
      labelEn: '⚠️ Test Emergency Alert (Chest Pain)',
      labelMr: '⚠️ आणीबाणी चाचणी (छातीत तीव्र दुखणे)',
      query: isMr ? 'माझ्या छातीत तीव्र कळ आणि डाव्या हातात वेदना होत आहेत' : 'I have severe crushing chest pain radiating to left arm',
      isEmergency: true,
    },
    {
      labelEn: 'Understanding High Blood Pressure',
      labelMr: 'रक्तदाब वाढल्यास काय करावे?',
      query: isMr ? 'रक्तदाब वाढल्यास काय काळजी घ्यावी आणि आहारातील बदल काय असावेत?' : 'What does a blood pressure reading of 138/88 mmHg mean?',
      isEmergency: false,
    },
    {
      labelEn: 'Fasting Blood Sugar Levels',
      labelMr: 'उपाशीपोटी रक्तातील साखरेचे प्रमाण',
      query: isMr ? 'उपाशीपोटी रक्तातील साखरेचे सामान्य प्रमाण किती असावे?' : 'What are normal fasting blood glucose numbers and pre-diabetes range?',
      isEmergency: false,
    },
    {
      labelEn: 'Fever & Headaches Precaution',
      labelMr: 'ताप आणि डोकेदुखी',
      query: isMr ? 'मला २ दिवसांपासून ताप आणि डोकेदुखी आहे' : 'I have a mild fever for 2 days and headache, what should I track?',
      isEmergency: false,
    },
  ];

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || query).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Evaluate with deterministic safety engine
    const result = evaluateHealthQuery(q, language);

    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'assistant',
      text: isMr ? result.responseMr : result.responseEn,
      textMr: result.responseMr,
      isEmergencyAlert: result.isEmergency,
      emergencyType: result.emergencyType,
      suggestedQuestions: isMr ? result.suggestedQuestionsMr : result.suggestedQuestionsEn,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setQuery('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-teal-600" />
            {isMr ? 'एआय आरोग्य मार्गदर्शक — ट्रस्टगार्ड' : 'AI Health Navigator — TrustGuard'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isMr
              ? 'मराठी व इंग्रजी द्विभाषिक आरोग्य शिक्षण आणि तात्काळ आणीबाणी लक्षण तपासणी.'
              : 'Bilingual health education with deterministic emergency keyword screening.'}
          </p>
        </div>

        {/* Engine Transparency Badge */}
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full text-xs text-teal-800 font-medium self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Local Rule Engine • Zero API Cost</span>
        </div>
      </div>

      {/* Emergency Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">
            {isMr ? 'वैद्यकीय आणीबाणी सूचना (Emergency Protocol):' : 'Emergency Safety Protocol (India):'}
          </strong>{' '}
          {isMr
            ? 'जर तुम्हाला छातीत तीव्र दुखणे, श्वास गुदमरणे, पक्षाघाताची लक्षणे किंवा बेशुद्धी जाणवत असेल, तर ताबडतोब ११२ (राष्ट्रीय आणीबाणी) किंवा १०८ (रुग्णवाहिका) वर कॉल करा.'
            : 'For sudden chest pain, breathing difficulty, stroke symptoms, or severe bleeding, dial 112 or 108 immediately. PulseAI deterministic screening checks emergency keywords prior to processing.'}
        </div>
      </div>

      {/* 1-Click Sample Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">
          {isMr ? 'नमुना प्रश्न:' : 'Quick Tests:'}
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.query)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
              p.isEmergency
                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {isMr ? p.labelMr : p.labelEn}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-slate-800 text-white'
                      : msg.isEmergencyAlert
                      ? 'bg-red-600 text-white animate-bounce'
                      : 'bg-teal-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2 max-w-xl">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-slate-800 text-white rounded-tr-xs'
                        : msg.isEmergencyAlert
                        ? 'bg-red-50 border-2 border-red-500 text-red-950 rounded-tl-xs shadow-md'
                        : 'bg-slate-100/90 text-slate-800 rounded-tl-xs border border-slate-200/60'
                    }`}
                  >
                    {/* Emergency Alert Header inside message */}
                    {msg.isEmergencyAlert && (
                      <div className="pb-3 mb-3 border-b border-red-200 flex items-center justify-between text-red-700 font-bold text-xs uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-red-600" />
                          Emergency Safety Alert
                        </span>
                        <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px]">
                          Call 112 / 108
                        </span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Immediate Call Action Button for Emergencies */}
                    {msg.isEmergencyAlert && (
                      <div className="mt-4 pt-3 border-t border-red-200 flex flex-wrap gap-2">
                        <a
                          href="tel:112"
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-xs transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          Call National Emergency (112)
                        </a>
                        <a
                          href="tel:108"
                          className="bg-red-800 hover:bg-red-900 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-xs transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          Call Ambulance (108)
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Suggested Clinician Questions */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3 text-xs text-teal-950 space-y-1.5">
                      <div className="font-semibold text-teal-900 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                        {isMr ? 'डॉक्टरांना विचारण्यासाठी सुचवलेले प्रश्न:' : 'Questions to Ask Your Doctor:'}
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-teal-900">
                        {msg.suggestedQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block px-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isMr
                  ? 'मराठी किंवा इंग्रजीत आरोग्यविषयक प्रश्न विचारा...'
                  : 'Ask about blood pressure, sugar, vitals, or symptoms in English or Marathi...'
              }
              className="flex-1 text-xs sm:text-sm p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white p-3 rounded-xl transition-colors shadow-2xs shrink-0"
              aria-label="Send health question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <Info className="w-3 h-3" />
            <span>
              {isMr
                ? 'पल्सएआय ट्रस्टगार्ड शैक्षणिक माहिती प्रदान करते. हे वैद्यकीय निदान किंवा उपचारांचा पर्याय नाही.'
                : 'PulseAI TrustGuard provides educational information. It is not a clinical diagnostic tool.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
