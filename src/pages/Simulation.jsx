import React from 'react';
import { 
  Factory, Play, Square, AlertOctagon, RotateCcw, Zap, 
  Cog, FlaskConical, Waves, Flame, Activity, CheckCircle2,
  Info, Sparkles, RefreshCw
} from 'lucide-react';
import { usePlant } from '../context/PlantContext';

export function Simulation() {
  const { 
    data, startPlant, stopPlant, emergencyStop, resetSystem, 
    setMotorRpm, togglePump, toggleReactor, toggleBreaker 
  } = usePlant();

  const isRunning = data.status === 'RUNNING';
  const isEStop = data.status === 'EMERGENCY_STOP';
  const isStopped = data.status === 'STOPPED';

  const mech = data.mechanical;
  const chem = data.chemical;
  const elec = data.electrical;

  const motorActive = mech.motor_enabled && mech.motor_rpm > 50;
  const pumpActive = mech.pump_enabled && mech.pump_flow > 5;
  const reactorActive = chem.reactor_enabled && chem.reactor_mixing_rpm > 5;
  const powerActive = elec.breaker_main_closed && elec.grid_voltage > 320;

  // Pipeline flow speed class
  const getPipeClass = () => {
    if (!pumpActive) return 'stroke-slate-300 dark:stroke-slate-700';
    if (mech.pump_flow > 70) return 'stroke-cyan-500 pipe-flow-fast';
    if (mech.pump_flow > 30) return 'stroke-cyan-500 pipe-flow-active';
    return 'stroke-cyan-500 pipe-flow-slow';
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Plant Simulation Station */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#132238] to-[#101B2D] text-white border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Interactive SCADA Digital Twin Simulation
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight mt-1">
            2D Industrial Factory Floor Schematic
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Real-time animated physical process diagram with live fluid movement, motor rotation, power delivery, and chemical vessel thermodynamics.
          </p>
        </div>

        {/* Master Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={startPlant}
            disabled={isEStop}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              isRunning 
                ? 'bg-emerald-600/40 text-emerald-300 border border-emerald-500/30' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            <Play className="h-4 w-4 fill-current" />
            <span>START PLANT</span>
          </button>

          <button
            onClick={stopPlant}
            disabled={isEStop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all shadow-md active:scale-95 border border-slate-600"
          >
            <Square className="h-4 w-4 fill-current" />
            <span>STOP PLANT</span>
          </button>

          <button
            onClick={emergencyStop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 active:scale-95 border border-rose-500"
          >
            <AlertOctagon className="h-4 w-4" />
            <span>EMERGENCY STOP</span>
          </button>

          <button
            onClick={resetSystem}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
          >
            <RotateCcw className="h-4 w-4" />
            <span>RESET SYSTEM</span>
          </button>
        </div>
      </div>

      {/* Main Interactive SCADA Canvas Schematic */}
      <div className="p-4 md:p-6 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${isRunning ? 'bg-emerald-500 led-green' : isEStop ? 'bg-rose-500 led-red' : 'bg-slate-400'}`} />
            Plant Operating Status: <strong className="text-slate-900 dark:text-white uppercase">{data.status}</strong>
          </span>
          <span className="font-mono">Real-time SCADA Vector Animation</span>
        </div>

        {/* 2D Factory Vector Canvas */}
        <div className="relative w-full h-[520px] rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
            {/* Grid background lines */}
            <defs>
              <pattern id="scadaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.6"/>
              </pattern>
              {/* Fluid Gradients */}
              <linearGradient id="fluidAcid" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="fluidBase" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="fluidReactor" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            <rect width="1000" height="500" fill="url(#scadaGrid)" />

            {/* 1. ELECTRICAL DISTRIBUTION SUBSTATION (Top-Left) */}
            <g transform="translate(60, 40)">
              <rect width="180" height="110" rx="10" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
              <text x="90" y="24" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">11kV/415V SUBSTATION</text>
              <circle cx="25" cy="20" r="5" fill={powerActive ? '#10b981' : '#ef4444'} className={powerActive ? 'led-green' : ''} />
              
              <text x="20" y="52" fill="#94a3b8" fontSize="10" fontFamily="monospace">Bus: {elec.grid_voltage} V</text>
              <text x="20" y="70" fill="#94a3b8" fontSize="10" fontFamily="monospace">Load: {elec.power_kw} kW</text>
              <text x="20" y="88" fill="#94a3b8" fontSize="10" fontFamily="monospace">Freq: {elec.frequency} Hz</text>

              {/* Status pill */}
              <rect x="100" y="72" width="70" height="22" rx="4" fill={elec.breaker_main_closed ? '#1e3a8a' : '#7f1d1d'} />
              <text x="135" y="87" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                {elec.breaker_main_closed ? 'ACB ON' : 'TRIPPED'}
              </text>
            </g>

            {/* Electrical Busbar Line (Blue Glowing Power Conduit) */}
            <path
              d="M 150 150 L 150 260 L 260 260"
              fill="none"
              stroke={powerActive ? '#3b82f6' : '#475569'}
              strokeWidth="4"
              strokeDasharray={powerActive ? '6,4' : 'none'}
              className={powerActive ? 'pipe-flow-fast' : ''}
            />

            {/* 2. INDUSTRIAL MOTOR (Center-Left) */}
            <g transform="translate(260, 210)">
              <rect width="140" height="100" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              <text x="70" y="22" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">INDUCTION MOTOR</text>
              
              {/* Spinning Motor Shaft SVG */}
              <circle cx="70" cy="55" r="22" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <g transform={`rotate(${motorActive ? (Date.now() / 5) % 360 : 0} 70 55)`}>
                <line x1="70" y1="35" x2="70" y2="75" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="55" x2="90" y2="55" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
              </g>

              <text x="70" y="90" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {mech.motor_rpm} RPM
              </text>
            </g>

            {/* Mechanical Coupling Shaft */}
            <rect x="400" y="252" width="40" height="16" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            <line x1="400" y1="260" x2="440" y2="260" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />

            {/* 3. CENTRIFUGAL PUMP (Center) */}
            <g transform="translate(440, 215)">
              <circle cx="45" cy="45" r="40" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
              <text x="45" y="20" fill="#22d3ee" fontSize="10" fontWeight="bold" textAnchor="middle">PUMP #1</text>
              
              {/* Rotating Impeller */}
              <g transform={`rotate(${pumpActive ? (Date.now() / 4) % 360 : 0} 45 45)`}>
                <circle cx="45" cy="45" r="15" fill="#0891b2" />
                <path d="M 45 45 L 35 30 M 45 45 L 60 38 M 45 45 L 45 62 M 45 45 L 30 52" stroke="#ffffff" strokeWidth="2" />
              </g>

              <text x="45" y="75" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {mech.pump_flow} L/min
              </text>
            </g>

            {/* 4. RAW MATERIAL STORAGE TANKS (Top-Right) */}
            {/* Tank A */}
            <g transform="translate(600, 30)">
              <rect width="80" height="110" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
              <rect x="5" y={105 - (chem.tank_a_level * 0.95)} width="70" height={chem.tank_a_level * 0.95} rx="4" fill="url(#fluidAcid)" />
              <text x="40" y="20" fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle">TANK A</text>
              <text x="40" y="65" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {chem.tank_a_level}%
              </text>
            </g>

            {/* Tank B */}
            <g transform="translate(710, 30)">
              <rect width="80" height="110" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <rect x="5" y={105 - (chem.tank_b_level * 0.95)} width="70" height={chem.tank_b_level * 0.95} rx="4" fill="url(#fluidBase)" />
              <text x="40" y="20" fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle">TANK B</text>
              <text x="40" y="65" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {chem.tank_b_level}%
              </text>
            </g>

            {/* Connecting Pipes from Tanks into Pump */}
            <path
              d="M 640 140 L 640 180 L 485 180 L 485 215"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="4"
              className={pumpActive ? 'pipe-flow-active' : ''}
            />
            <path
              d="M 750 140 L 750 190 L 510 190 L 510 215"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              className={pumpActive ? 'pipe-flow-active' : ''}
            />

            {/* Delivery Pipeline from Pump into Chemical Reactor */}
            <path
              d="M 525 260 L 680 260 L 680 270"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="5"
              className={getPipeClass()}
            />

            {/* 5. CHEMICAL CSTR REACTOR (Bottom-Right) */}
            <g transform="translate(680, 240)">
              {/* Outer Heating Jacket */}
              <rect width="180" height="170" rx="16" fill="#111827" stroke={chem.reactor_temp > 85 ? '#ef4444' : '#10b981'} strokeWidth="3" />
              
              {/* Liquid Reaction Medium */}
              <rect x="15" y="55" width="150" height="100" rx="8" fill="url(#fluidReactor)" />
              
              {/* Animated Bubbles inside reactor */}
              {reactorActive && (
                <g opacity="0.6">
                  <circle cx="50" cy="90" r="3" fill="#ffffff" className="animate-ping" />
                  <circle cx="120" cy="110" r="4" fill="#ffffff" className="animate-ping" />
                  <circle cx="85" cy="130" r="2.5" fill="#ffffff" className="animate-pulse" />
                </g>
              )}

              {/* Mixing Impeller Agitator Shaft */}
              <line x1="90" y1="30" x2="90" y2="135" stroke="#94a3b8" strokeWidth="4" />
              <g transform={`rotate(${reactorActive ? (Date.now() / 4) % 360 : 0} 90 135)`}>
                <line x1="60" y1="135" x2="120" y2="135" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                <line x1="70" y1="142" x2="110" y2="128" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              </g>

              {/* Reactor Title & Metrics */}
              <text x="90" y="24" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">CSTR REACTOR #1</text>
              <text x="90" y="75" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {chem.reactor_temp} °C
              </text>
              <text x="90" y="95" fill="#d1fae5" fontSize="10" fontFamily="monospace" textAnchor="middle">
                {chem.reactor_pressure} bar &bull; pH {chem.reactor_ph}
              </text>

              {/* Batch Conversion Badge */}
              <rect x="40" y="145" width="100" height="16" rx="4" fill="#065f46" />
              <text x="90" y="157" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                BATCH: {chem.reaction_progress}%
              </text>
            </g>

            {/* 6. FINISHED PRODUCT DISCHARGE LINE (To Right) */}
            <path
              d="M 860 325 L 960 325"
              fill="none"
              stroke="#10b981"
              strokeWidth="5"
              className={reactorActive ? 'pipe-flow-active' : ''}
            />
            <g transform="translate(920, 290)">
              <rect width="60" height="60" rx="6" fill="#047857" stroke="#10b981" strokeWidth="2" />
              <text x="30" y="26" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">FINISHED</text>
              <text x="30" y="42" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">PRODUCT</text>
            </g>
          </svg>
        </div>

        {/* Legend & Operation Tips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-300">Electrical 415V Bus</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-300">Motor Shaft & Drive</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-500" />
            <span className="text-slate-600 dark:text-slate-300">Centrifugal Fluid Flow</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">CSTR Reaction Medium</span>
          </div>
        </div>
      </div>
    </div>
  );
}
