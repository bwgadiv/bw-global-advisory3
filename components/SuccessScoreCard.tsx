
import React, { useState } from "react";
import { SPIResult } from "../types";

type Breakdown = { label: string; value: number; color?: string };

export default function SuccessScoreCard({
  spiResult
}: {
  spiResult: SPIResult;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const { spi, ciLow, ciHigh, breakdown, drivers } = spiResult;

  const size = 160;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, spi));
  const stroke = circumference * (1 - pct / 100);

  const getColor = (val: number) => {
      if (val >= 75) return "text-emerald-600 bg-emerald-50 border-emerald-200";
      if (val >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
      return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden w-full">
      <div className="p-6 flex flex-col md:flex-row items-center gap-8">
        {/* Radial Gauge */}
        <div className="relative flex-shrink-0">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
                <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#059669" /> {/* emerald-600 */}
                <stop offset="100%" stopColor="#10b981" /> {/* emerald-500 */}
                </linearGradient>
            </defs>
            <g transform={`translate(${size / 2}, ${size / 2})`}>
                <circle r={radius} fill="#f8fafc" />
                <circle
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={14}
                strokeLinecap="round"
                />
                <circle
                r={radius}
                fill="none"
                stroke="url(#g1)"
                strokeWidth={14}
                strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={stroke}
                transform={`rotate(-90)`}
                />
                <text y="-6" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#0f172a">
                {pct.toFixed(0)}%
                </text>
                <text y="18" textAnchor="middle" fontSize="10" fill="#64748b" className="uppercase tracking-widest">
                Probability
                </text>
            </g>
            </svg>
        </div>

        <div className="flex-1 w-full">
          <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-lg font-bold text-slate-900">Success Probability Index (SPI)</h3>
                <div className="text-xs text-slate-500 mt-1">
                    Confidence Interval: <span className="font-mono font-semibold text-slate-700">{ciLow}% — {ciHigh}%</span> (95% CI)
                </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${pct >= 70 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                {pct >= 70 ? 'High Viability' : 'Moderate Risk'}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {breakdown.map((b) => (
              <div key={b.label} className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-bold truncate mb-1">{b.label}</div>
                <div className={`font-bold text-sm ${b.value >= 70 ? 'text-green-600' : b.value >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                    {b.value.toFixed(0)}/100
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Analysis' : 'View Drivers & Mitigation'} {showDetails ? '▲' : '▼'}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-6 grid md:grid-cols-2 gap-6 animate-fade-in">
              <div>
                  <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3">Positive Drivers</h4>
                  <ul className="space-y-2">
                      {drivers.positive.map((driver, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="text-green-500 font-bold">+</span> {driver}
                          </li>
                      ))}
                  </ul>
              </div>
              <div>
                  <h4 className="text-xs font-bold text-red-700 uppercase tracking-widest mb-3">Risk Factors</h4>
                  <ul className="space-y-2">
                      {drivers.negative.map((driver, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="text-red-500 font-bold">-</span> {driver}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      )}
    </div>
  );
}
