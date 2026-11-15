import React from 'react';
import { 
  FlaskConical, Flame, Waves, AlertTriangle, Play, Square, 
  Sliders, ShieldCheck, CheckCircle2, RotateCw, Activity,
  Info, Beaker, Droplets
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { usePlant } from '../context/PlantContext';
import { StatCard } from '../components/StatCard';
import { Gauge } from '../components/Gauge';

export function Chemical() {
  const { 
    data, history, setReactorTemp, setMixingSpeed, 
    toggleReactor, injectFault 
  } = usePlant();

  const chem = data.chemical;
  const isReactorOn = chem.reactor_enabled && chem.reactor_mixing_rpm > 5;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#132822] to-[#101B2D] text-white border border-emerald-900/40 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Department of Chemical Engineering
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight mt-1">
            Continuous Reactor Kinetics & Reagent Inventory
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Supervising continuous stirred-tank reactor (CSTR) mass/energy balances, Arrhenius reaction kinetics, jacketed heat exchanger cooling, and acid/base stoichiometry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Chemical Yield</span>
            <p className="text-2xl font-black font-mono text-emerald-400">{data.efficiencies.chemical}%</p>
          </div>
        </div>
      </div>

      {/* Educational Simulation Notice */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Academic Simulation Notice:</strong> Chemical reaction rate is dynamically evaluated via the Arrhenius equation k(T) = A &times; exp(-Ea / RT). Fluid inventory levels and thermodynamics update automatically based on mechanical pump feed rates and electrical jacket heaters.
        </p>
      </div>

      {/* KPI SCADA Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Reactor Core Temp"
          value={chem.reactor_temp}
          unit="°C"
          subtitle={`Setpoint: ${chem.reactor_target_temp} °C`}
          icon={Flame}
          status={chem.reactor_temp > 85 ? 'critical' : chem.reactor_temp > 78 ? 'warning' : 'normal'}
        />

        <StatCard
          title="Reactor Vapor Pressure"
          value={chem.reactor_pressure}
          unit="bar"
          subtitle="Relief Valve: 4.5 bar"
          icon={Activity}
          status={chem.reactor_pressure > 4.0 ? 'critical' : 'normal'}
        />

        <StatCard
          title="Acidity Balance"
          value={chem.reactor_ph}
          unit="pH"
          subtitle="Target: 6.8 - 7.6 pH"
          icon={Beaker}
          status={chem.reactor_ph < 5.5 || chem.reactor_ph > 8.5 ? 'warning' : 'normal'}
        />

        <StatCard
          title="Reaction Progress"
          value={chem.reaction_progress}
          unit="%"
          subtitle={`Concentration: ${chem.reagent_concentration}%`}
          icon={Droplets}
          status={chem.reaction_progress > 90 ? 'normal' : 'normal'}
        />
      </div>

      {/* SECTION A: Three Animated Chemical Storage Tanks */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Droplets className="h-4 w-4 text-emerald-500" />
          Chemical Raw Material Storage Tanks (Animated Liquid Inventories)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tank A: Reagent A (Acid) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tank A: Reagent Alpha (Acidic Precursor)
            </span>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5">
              Temp: {chem.tank_a_temp} °C | Concentration: 92%
            </span>

            {/* Graphical Tank Vessel */}
            <div className="relative w-36 h-48 my-3 rounded-2xl border-4 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/80 overflow-hidden flex flex-col justify-end shadow-inner">
              {/* Level Ruler Ticks */}
              <div className="absolute left-1 top-2 bottom-2 flex flex-col justify-between text-[8px] font-mono text-slate-400 z-10 select-none">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* Liquid Column with Wave Animation */}
              <div 
                className="w-full bg-gradient-to-t from-purple-700 to-indigo-500 transition-all duration-700 relative overflow-hidden"
                style={{ height: `${chem.tank_a_level}%` }}
              >
                <div className="absolute inset-0 bg-white/15 opacity-40 animate-pulse" />
              </div>

              {/* Digital Level Readout */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-lg font-black font-mono text-white drop-shadow-md">
                  {chem.tank_a_level}%
                </span>
              </div>
            </div>

            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Flow Rate: ~{(chem.tank_a_level * 0.4).toFixed(1)} L/min
            </span>
          </div>

          {/* Tank B: Reagent B (Basic Reactant) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tank B: Reagent Beta (Alkaline Neutralizer)
            </span>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5">
              Temp: {chem.tank_b_temp} °C | Concentration: 88%
            </span>

            <div className="relative w-36 h-48 my-3 rounded-2xl border-4 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/80 overflow-hidden flex flex-col justify-end shadow-inner">
              <div className="absolute left-1 top-2 bottom-2 flex flex-col justify-between text-[8px] font-mono text-slate-400 z-10 select-none">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              <div 
                className="w-full bg-gradient-to-t from-amber-600 to-orange-400 transition-all duration-700 relative overflow-hidden"
                style={{ height: `${chem.tank_b_level}%` }}
              >
                <div className="absolute inset-0 bg-white/15 opacity-40 animate-pulse" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-lg font-black font-mono text-white drop-shadow-md">
                  {chem.tank_b_level}%
                </span>
              </div>
            </div>

            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Flow Rate: ~{(chem.tank_b_level * 0.35).toFixed(1)} L/min
            </span>
          </div>

          {/* Tank C: Catalyst & Buffer Solution */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tank C: Catalyst & Buffer Solution
            </span>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5">
              Temp: {chem.tank_c_temp} °C | Aqueous Buffer
            </span>

            <div className="relative w-36 h-48 my-3 rounded-2xl border-4 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/80 overflow-hidden flex flex-col justify-end shadow-inner">
              <div className="absolute left-1 top-2 bottom-2 flex flex-col justify-between text-[8px] font-mono text-slate-400 z-10 select-none">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              <div 
                className="w-full bg-gradient-to-t from-teal-600 to-emerald-400 transition-all duration-700 relative overflow-hidden"
                style={{ height: `${chem.tank_c_level}%` }}
              >
                <div className="absolute inset-0 bg-white/15 opacity-40 animate-pulse" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-lg font-black font-mono text-white drop-shadow-md">
                  {chem.tank_c_level}%
                </span>
              </div>
            </div>

            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              Flow Rate: ~{(chem.tank_c_level * 0.15).toFixed(1)} L/min
            </span>
          </div>
        </div>
      </div>

      {/* SECTION B: Industrial Chemical Reactor Simulation & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Gauges for Reactor Temp & Pressure */}
        <div className="space-y-4">
          <Gauge
            title="Reactor Vessel Core Temperature"
            value={chem.reactor_temp}
            min={20}
            max={120}
            unit="°C"
            warnThreshold={80}
            critThreshold={95}
            decimals={1}
          />
          <Gauge
            title="Reactor Internal Pressure"
            value={chem.reactor_pressure}
            min={0}
            max={6}
            unit="bar"
            warnThreshold={3.8}
            critThreshold={4.8}
            decimals={2}
          />
        </div>

        {/* Right: Interactive Reactor Supervisory Controls */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-emerald-500" />
                CSTR Reactor Control & Thermal Jacket Station
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Continuous agitator speed modulation and jacket setpoint heating
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              chem.reactor_enabled ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {chem.reactor_enabled ? 'HEATING & MIXING' : 'REACTOR OFF'}
            </span>
          </div>

          {/* Temperature Setpoint Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-rose-500" />
                Reactor Temperature Setpoint:
              </span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                {chem.reactor_target_temp} °C
              </span>
            </div>

            <input
              type="range"
              min="30"
              max="110"
              step="1"
              value={chem.reactor_target_temp}
              onChange={(e) => setReactorTemp(e.target.value)}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />

            <div className="flex items-center gap-2">
              {[45, 65, 75, 85, 95].map(t => (
                <button
                  key={t}
                  onClick={() => setReactorTemp(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    chem.reactor_target_temp === t
                      ? 'bg-rose-500 text-white font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {t} °C
                </button>
              ))}
            </div>
          </div>

          {/* Agitator Mixing Speed */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <RotateCw className="h-4 w-4 text-emerald-500" />
                Agitator Impeller Speed:
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {chem.reactor_mixing_rpm} RPM
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleReactor}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  chem.reactor_enabled
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {chem.reactor_enabled ? 'STOP REACTION' : 'START REACTION'}
              </button>

              <button
                onClick={() => injectFault('REACTOR_EXOTHERM')}
                className="px-3 py-2 rounded-xl text-xs font-bold border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                Simulate Exothermic Surge
              </button>
            </div>
          </div>

          {/* Reaction Kinetics & Progress Bar */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                Batch Conversion Progress
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {chem.reaction_progress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${chem.reaction_progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
