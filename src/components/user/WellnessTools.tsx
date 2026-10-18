import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import {
  Sparkles,
  Scale,
  Droplet,
  CheckSquare,
  Square,
  Plus,
  AlertCircle,
  Info,
} from 'lucide-react';

interface WellnessToolsProps {
  language: Language;
}

export const WellnessTools: React.FC<WellnessToolsProps> = ({ language }) => {
  const isMr = language === 'mr';

  // BMI State
  const [heightCm, setHeightCm] = useState('172');
  const [weightKg, setWeightKg] = useState('72');
  const [calculatedBmi, setCalculatedBmi] = useState<number | null>(24.3);
  const [bmiCategory, setBmiCategory] = useState<string>('Normal Weight');

  // Hydration State
  const [hydrationGoalMl, setHydrationGoalMl] = useState(2500);
  const [currentHydrationMl, setCurrentHydrationMl] = useState(() => {
    const saved = localStorage.getItem('pulseai_hydration_today');
    return saved ? Number(saved) : 1750;
  });

  // Wellness Goals State
  const [goals, setGoals] = useState<{ id: string; text: string; done: boolean }[]>(() => {
    const saved = localStorage.getItem('pulseai_wellness_goals');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', text: 'Brisk walking for 30 minutes 4 days this week', done: true },
      { id: '2', text: 'Log morning blood pressure reading twice a week', done: true },
      { id: '3', text: 'Limit dietary sodium and processed snacks', done: false },
      { id: '4', text: 'Review monthly checkup questions in VisitReady', done: false },
    ];
  });
  const [newGoalText, setNewGoalText] = useState('');

  // Calculate BMI
  const handleCalculateBmi = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number(heightCm);
    const w = Number(weightKg);

    if (h > 50 && h < 250 && w > 20 && w < 300) {
      const heightM = h / 100;
      const bmi = Number((w / (heightM * heightM)).toFixed(1));
      setCalculatedBmi(bmi);

      if (bmi < 18.5) {
        setBmiCategory(isMr ? 'कमी वजन (Underweight)' : 'Underweight');
      } else if (bmi <= 24.9) {
        setBmiCategory(isMr ? 'सामान्य वजन (Normal Weight)' : 'Normal Weight');
      } else if (bmi <= 29.9) {
        setBmiCategory(isMr ? 'जास्त वजन (Overweight)' : 'Overweight');
      } else {
        setBmiCategory(isMr ? 'लठ्ठपणा (Obesity Range)' : 'Obesity Range');
      }
    }
  };

  // Add Water
  const handleAddWater = (amount: number) => {
    const updated = Math.min(hydrationGoalMl * 2, currentHydrationMl + amount);
    setCurrentHydrationMl(updated);
    localStorage.setItem('pulseai_hydration_today', String(updated));
  };

  const handleResetWater = () => {
    setCurrentHydrationMl(0);
    localStorage.setItem('pulseai_hydration_today', '0');
  };

  // Goals
  const handleToggleGoal = (id: string) => {
    const updated = goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g));
    setGoals(updated);
    localStorage.setItem('pulseai_wellness_goals', JSON.stringify(updated));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal = {
      id: `goal-${Date.now()}`,
      text: newGoalText.trim(),
      done: false,
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    localStorage.setItem('pulseai_wellness_goals', JSON.stringify(updated));
    setNewGoalText('');
  };

  const hydrationPercent = Math.min(100, Math.round((currentHydrationMl / hydrationGoalMl) * 100));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-teal-600" />
          {isMr ? 'आरोग्य व जीवनशैली साधने' : 'Wellness & Preventative Lifestyle Tools'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isMr
            ? 'बीएमआय मोजणी, दैनंदिन पाणी पिण्याचे उद्दिष्ट आणि वैयक्तिक आरोग्य ध्येयांचा मागोवा घ्या.'
            : 'Track body mass index, daily hydration targets, and self-managed preventative wellness goals.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool 1: BMI Calculator */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-800">
                  {isMr ? 'बीएमआय कॅल्क्युलेटर' : 'BMI Screening Calculator'}
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">WHO Screening</span>
            </div>

            <form onSubmit={handleCalculateBmi} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isMr ? 'उंची (सेंटीमीटर)' : 'Height (cm)'}
                </label>
                <input
                  type="number"
                  min="60"
                  max="240"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isMr ? 'वजन (किलो)' : 'Weight (kg)'}
                </label>
                <input
                  type="number"
                  min="20"
                  max="250"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                {isMr ? 'बीएमआय मोजा' : 'Calculate BMI'}
              </button>
            </form>

            {calculatedBmi && (
              <div className="mt-4 p-3.5 bg-teal-50/70 rounded-xl border border-teal-200 text-center">
                <span className="text-xs text-teal-800 font-medium block">Calculated BMI</span>
                <span className="text-3xl font-extrabold text-teal-900 mt-1 block">
                  {calculatedBmi}
                </span>
                <span className="text-xs font-bold text-teal-700 block mt-0.5">
                  Category: {bmiCategory}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-start gap-1.5">
            <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
            <span>
              BMI is a general screening indicator, not an individual clinical diagnosis. Muscle mass and age are not evaluated.
            </span>
          </div>
        </div>

        {/* Tool 2: Hydration Tracker */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-800">
                  {isMr ? 'हायड्रेशन ट्रॅकर' : 'Daily Hydration Tracker'}
                </h3>
              </div>
              <span className="text-xs font-bold text-sky-700">{hydrationPercent}%</span>
            </div>

            <div className="mt-4 text-center">
              <div className="text-3xl font-extrabold text-slate-900">
                {currentHydrationMl}{' '}
                <span className="text-sm font-normal text-slate-500">/ {hydrationGoalMl} ml</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentHydrationMl >= hydrationGoalMl
                  ? '🎉 Daily target reached!'
                  : `${hydrationGoalMl - currentHydrationMl} ml remaining today`}
              </p>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-sky-500 to-teal-500 h-full transition-all duration-300"
                  style={{ width: `${hydrationPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Log Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddWater(250)}
                className="py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-xs rounded-xl border border-sky-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                +250 ml (Glass)
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-xs rounded-xl border border-sky-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                +500 ml (Bottle)
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Resets daily</span>
            <button
              onClick={handleResetWater}
              className="text-slate-400 hover:text-slate-600 text-[11px]"
            >
              Reset today
            </button>
          </div>
        </div>

        {/* Tool 3: Wellness Goals Planner */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-800">
                  {isMr ? 'आरोग्य उद्दिष्टे' : 'Personal Wellness Goals'}
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700">
                {goals.filter((g) => g.done).length}/{goals.length} Done
              </span>
            </div>

            {/* Goals Checklist */}
            <div className="mt-4 space-y-2 max-h-52 overflow-y-auto pr-1">
              {goals.map((g) => (
                <div
                  key={g.id}
                  onClick={() => handleToggleGoal(g.id)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                    g.done
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-500 line-through'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-white'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 text-emerald-600">
                    {g.done ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                  </div>
                  <span className="flex-1 leading-snug">{g.text}</span>
                </div>
              ))}
            </div>

            {/* Add Goal Input */}
            <form onSubmit={handleAddGoal} className="mt-4 flex gap-1.5">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder={isMr ? 'नवीन ध्येय लिहा...' : 'Add a new wellness habit...'}
                className="flex-1 text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg shrink-0"
              >
                Add
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
            Personal preventative goals • Not an automated clinical mandate
          </div>
        </div>
      </div>
    </div>
  );
};
