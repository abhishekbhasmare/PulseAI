import React, { useState } from 'react';
import { HealthMeasurement } from '../../types';
import { Activity, AlertCircle, Info } from 'lucide-react';

interface VitalsChartProps {
  measurements: HealthMeasurement[];
  metric: 'bp' | 'weight' | 'glucose' | 'heartRate';
}

export const VitalsChart: React.FC<VitalsChartProps> = ({ measurements, metric }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    value: string;
    notes?: string;
    x: number;
    y: number;
  } | null>(null);

  // Extract points based on selected metric
  const points = measurements
    .map((m) => {
      let val1: number | undefined;
      let val2: number | undefined; // For BP (diastolic)
      let label = '';
      let unit = '';

      if (metric === 'bp') {
        val1 = m.systolicBp;
        val2 = m.diastolicBp;
        label = 'Blood Pressure';
        unit = 'mmHg';
      } else if (metric === 'weight') {
        val1 = m.weightKg;
        label = 'Body Weight';
        unit = 'kg';
      } else if (metric === 'glucose') {
        val1 = m.bloodGlucoseMgDl;
        label = 'Blood Glucose';
        unit = 'mg/dL';
      } else if (metric === 'heartRate') {
        val1 = m.heartRateBpm;
        label = 'Heart Rate';
        unit = 'bpm';
      }

      return {
        id: m.id,
        date: m.date,
        val1,
        val2,
        label,
        unit,
        notes: m.notes,
      };
    })
    .filter((p) => p.val1 !== undefined && p.val1 !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (points.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-slate-700">No Recorded Measurements</h4>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          No records found for this vitals metric. Enter measurements in your Health Memory or during a checkup to generate trend data.
        </p>
      </div>
    );
  }

  const latest = points[points.length - 1];
  const previous = points.length > 1 ? points[points.length - 2] : null;

  // Single-record state
  if (points.length === 1) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">{latest.label}</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {metric === 'bp' ? `${latest.val1}/${latest.val2}` : latest.val1}{' '}
              <span className="text-sm font-normal text-slate-500">{latest.unit}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Recorded on: {latest.date}</p>
          </div>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Single Data Point
          </span>
        </div>
        <div className="mt-5 p-4 bg-slate-50 rounded-lg text-sm text-slate-600 flex items-start gap-3 border border-slate-200/80">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-slate-800">Trend requires multiple measurements</p>
            <p className="text-xs text-slate-500 mt-1">
              PulseAI strictly avoids fabricating intermediate curve points. To see a calculated trajectory and comparison delta, record your next reading during your routine monthly checkup.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate numerical deltas honestly
  const deltaVal1 = previous && latest.val1 !== undefined && previous.val1 !== undefined
    ? Number((latest.val1 - previous.val1).toFixed(1))
    : 0;
  const deltaVal2 = metric === 'bp' && previous && latest.val2 !== undefined && previous.val2 !== undefined
    ? Number((latest.val2 - previous.val2).toFixed(1))
    : 0;

  // SVG Chart geometry
  const width = 640;
  const height = 240;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Determine min and max Y
  const allYValues: number[] = [];
  points.forEach((p) => {
    if (p.val1 !== undefined) allYValues.push(p.val1);
    if (p.val2 !== undefined) allYValues.push(p.val2);
  });

  const minY = Math.floor(Math.min(...allYValues) * 0.9);
  const maxY = Math.ceil(Math.max(...allYValues) * 1.1);
  const rangeY = maxY - minY || 1;

  const getX = (index: number) => {
    if (points.length <= 1) return padLeft + chartW / 2;
    return padLeft + (index / (points.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    return padTop + chartH - ((val - minY) / rangeY) * chartH;
  };

  // Generate SVG path strings
  const path1 = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.val1!)}`)
    .join(' ');

  const path2 = metric === 'bp'
    ? points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.val2!)}`)
        .join(' ')
    : '';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      {/* Metrics Header Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-100">
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Latest Recorded</span>
          <div className="text-2xl font-bold text-teal-700 mt-1">
            {metric === 'bp' ? `${latest.val1}/${latest.val2}` : latest.val1}{' '}
            <span className="text-sm font-normal text-slate-600">{latest.unit}</span>
          </div>
          <span className="text-xs text-slate-400">{latest.date}</span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Previous Recorded</span>
          <div className="text-2xl font-bold text-slate-700 mt-1">
            {previous ? (metric === 'bp' ? `${previous.val1}/${previous.val2}` : previous.val1) : '--'}{' '}
            <span className="text-sm font-normal text-slate-600">{latest.unit}</span>
          </div>
          <span className="text-xs text-slate-400">{previous ? previous.date : '--'}</span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recorded Delta</span>
          <div className="text-2xl font-bold text-slate-800 mt-1 flex items-center gap-1.5">
            {metric === 'bp' ? (
              <span>
                {deltaVal1 >= 0 ? `+${deltaVal1}` : deltaVal1} / {deltaVal2 >= 0 ? `+${deltaVal2}` : deltaVal2}
              </span>
            ) : (
              <span>{deltaVal1 >= 0 ? `+${deltaVal1}` : deltaVal1}</span>
            )}
            <span className="text-sm font-normal text-slate-600">{latest.unit}</span>
          </div>
          <span className="text-xs text-slate-500">Numerical diff between dates</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="mt-5 relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-64 overflow-visible">
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const yVal = Math.round(minY + ratio * rangeY);
            const yPos = getY(yVal);
            return (
              <g key={ratio}>
                <line
                  x1={padLeft}
                  y1={yPos}
                  x2={width - padRight}
                  y2={yPos}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text x={padLeft - 8} y={yPos + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                  {yVal}
                </text>
              </g>
            );
          })}

          {/* Primary Metric Line (Systolic or Single Value) */}
          <path d={path1} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Secondary Metric Line (Diastolic for BP) */}
          {metric === 'bp' && (
            <path d={path2} fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Points & Interactive Tooltip triggers */}
          {points.map((p, i) => {
            const cx = getX(i);
            const cy1 = getY(p.val1!);
            const cy2 = p.val2 !== undefined ? getY(p.val2) : null;

            return (
              <g key={p.id}>
                {/* Vertical guideline */}
                <line x1={cx} y1={padTop} x2={cx} y2={height - padBottom} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />

                {/* X axis Date label */}
                <text x={cx} y={height - padBottom + 16} textAnchor="middle" fontSize="10" fill="#64748b">
                  {p.date.slice(5)}
                </text>

                {/* Primary Point */}
                <circle
                  cx={cx}
                  cy={cy1}
                  r="5"
                  fill="#0d9488"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer hover:r-6 transition-all"
                  onMouseEnter={() =>
                    setHoveredPoint({
                      date: p.date,
                      value: metric === 'bp' ? `Systolic: ${p.val1} ${p.unit}` : `${p.val1} ${p.unit}`,
                      notes: p.notes,
                      x: cx,
                      y: cy1,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* Secondary Point for BP */}
                {cy2 !== null && (
                  <circle
                    cx={cx}
                    cy={cy2}
                    r="5"
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        date: p.date,
                        value: `Diastolic: ${p.val2} ${p.unit}`,
                        notes: p.notes,
                        x: cx,
                        y: cy2,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute bg-slate-900 text-white text-xs rounded-md p-2 shadow-lg pointer-events-none z-10 -translate-x-1/2 -translate-y-full mb-2"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
            }}
          >
            <div className="font-semibold">{hoveredPoint.value}</div>
            <div className="text-slate-300 text-[10px] mt-0.5">{hoveredPoint.date}</div>
            {hoveredPoint.notes && <div className="text-slate-400 text-[10px] italic mt-1">{hoveredPoint.notes}</div>}
          </div>
        )}
      </div>

      {/* Chart Legend & Safety Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-600 inline-block"></span>
            {metric === 'bp' ? 'Systolic BP (mmHg)' : latest.label}
          </span>
          {metric === 'bp' && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-600 inline-block"></span>
              Diastolic BP (mmHg)
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 italic">
          * Strictly shows user-recorded data. Not an automated medical diagnosis.
        </div>
      </div>
    </div>
  );
};
