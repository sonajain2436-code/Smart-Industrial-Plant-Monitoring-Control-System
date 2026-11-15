import React from 'react';

export function Gauge({ 
  value, 
  min = 0, 
  max = 100, 
  title, 
  unit = '', 
  warnThreshold = 75, 
  critThreshold = 90,
  size = 180,
  decimals = 1
}) {
  const clampedValue = Math.min(max, Math.max(min, value || 0));
  const percentage = (clampedValue - min) / (max - min);
  
  // Angle for 240 degree gauge (-120 to +120 deg)
  const angle = -120 + percentage * 240;

  // Determine color status
  let statusColor = '#10B981'; // Green
  let statusText = 'NOMINAL';
  if (clampedValue >= critThreshold) {
    statusColor = '#EF4444'; // Red
    statusText = 'CRITICAL';
  } else if (clampedValue >= warnThreshold) {
    statusColor = '#F59E0B'; // Amber
    statusText = 'WARNING';
  }

  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength * (1 - percentage);

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm">
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
        {title}
      </span>

      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.75 }}>
        <svg 
          width={size} 
          height={size * 0.75} 
          viewBox="0 0 160 120"
          className="overflow-visible"
        >
          {/* Background Arc */}
          <path
            d="M 25 105 A 64 64 0 1 1 135 105"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-700/60"
            strokeLinecap="round"
          />

          {/* Active Value Arc */}
          <path
            d="M 25 105 A 64 64 0 1 1 135 105"
            fill="none"
            stroke={statusColor}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />

          {/* Needle Center Pin */}
          <circle cx="80" cy="85" r="5" fill="#475569" className="dark:fill-slate-300" />

          {/* Needle Indicator */}
          <g transform={`rotate(${angle} 80 85)`} className="transition-transform duration-300 ease-out">
            <line 
              x1="80" 
              y1="85" 
              x2="80" 
              y2="28" 
              stroke={statusColor} 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
          </g>

          {/* Min & Max Labels */}
          <text x="22" y="118" fontSize="9" fill="#94A3B8" fontWeight="600" textAnchor="middle">{min}</text>
          <text x="138" y="118" fontSize="9" fill="#94A3B8" fontWeight="600" textAnchor="middle">{max}</text>
        </svg>

        {/* Digital Readout in Center */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {Number(clampedValue).toFixed(decimals)}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {unit}
            </span>
          </div>
          <span 
            className="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase"
            style={{ color: statusColor, backgroundColor: `${statusColor}18` }}
          >
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
}
