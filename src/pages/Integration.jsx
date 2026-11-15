import React, { useState } from 'react';
import { 
  GitMerge, Zap, Cog, FlaskConical, ArrowDown, ArrowRight, 
  CheckCircle2, AlertTriangle, ShieldAlert, Sliders, Activity,
  Layers, Flame, Waves, Check, RotateCcw, Info, Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Legend, Tooltip 
} from 'recharts';
import { usePlant } from '../context/PlantContext';

export function Integration() {
  const { 
    data, setMotorRpm, toggleBreaker, injectFault, 
    clearFault, emergencyStop 
  } = usePlant();
  const [selectedStep, setSelectedStep] = useState(1);
  const [activeScenario, setActiveScenario] = useState(null);

  const mech = data.mechanical;
  const chem = data.chemical;
  const elec = data.electrical;

  // Process Flow Components Data
  const flowNodes = [
    {
      id: 'step1',
      stepNum: 1,
      discipline: 'ELECTRICAL',
      deptCode: 'EE',
      title: 'Electrical Power Supply',
      equipment: '415V 3-Phase Substation Bus',
      status: elec.breaker_main_closed && elec.grid_voltage > 320 ? 'OPTIMAL' : 'DE-ENERGIZED',
      statusColor: elec.breaker_main_closed && elec.grid_voltage > 320 ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10',
      icon: Zap,
      accent: 'border-blue-500 shadow-blue-500/10',
      iconBg: 'bg-blue-500/15 text-blue-500',
      metrics: [
        { label: 'Bus Voltage', val: `${elec.grid_voltage} V` },
        { label: 'Frequency', val: `${elec.frequency} Hz` },
        { label: 'Power Factor', val: `${elec.power_factor}` },
      ],
      description: 'Feeds high-voltage alternating current through variable frequency drive to inductive machinery.'
    },
    {
      id: 'step2',
      stepNum: 2,
      discipline: 'MECHANICAL',
      deptCode: 'ME',
      title: 'Industrial Motor',
      equipment: '4-Pole Three-Phase Induction Motor',
      status: mech.motor_enabled && mech.motor_rpm > 50 ? 'RUNNING' : 'STOPPED',
      statusColor: mech.motor_enabled && mech.motor_rpm > 50 ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-500/10',
      icon: Cog,
      accent: 'border-amber-500 shadow-amber-500/10',
      iconBg: 'bg-amber-500/15 text-amber-500',
      metrics: [
        { label: 'Shaft Speed', val: `${mech.motor_rpm} RPM` },
        { label: 'Core Temp', val: `${mech.motor_temp} °C` },
        { label: 'Vibration', val: `${mech.motor_vibration} mm/s` },
      ],
      description: 'Converts electrical active power into rotational mechanical shaft torque.'
    },
    {
      id: 'step3',
      stepNum: 3,
      discipline: 'MECHANICAL',
      deptCode: 'ME',
      title: 'Mechanical Pump',
      equipment: 'Heavy-Duty Centrifugal Impeller',
      status: mech.pump_enabled && mech.pump_flow > 5 ? 'DELIVERING' : 'IDLE',
      statusColor: mech.pump_enabled && mech.pump_flow > 5 ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-500/10',
      icon: Waves,
      accent: 'border-cyan-500 shadow-cyan-500/10',
      iconBg: 'bg-cyan-500/15 text-cyan-500',
      metrics: [
        { label: 'Discharge Flow', val: `${mech.pump_flow} L/min` },
        { label: 'Head Pressure', val: `${mech.pump_pressure} bar` },
        { label: 'Efficiency', val: `${mech.pump_efficiency} %` },
      ],
      description: 'Utilizes centrifugal kinetic energy to deliver liquid reagents into process vessels.'
    },
    {
      id: 'step4',
      stepNum: 4,
      discipline: 'CHEMICAL',
      deptCode: 'CHE',
      title: 'Chemical Mixing Tanks',
      equipment: 'Raw Storage Tanks A, B & Catalyst C',
      status: chem.tank_a_level > 10 ? 'FEEDING' : 'LOW LEVEL',
      statusColor: chem.tank_a_level > 10 ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10',
      icon: FlaskConical,
      accent: 'border-emerald-500 shadow-emerald-500/10',
      iconBg: 'bg-emerald-500/15 text-emerald-500',
      metrics: [
        { label: 'Tank A Level', val: `${chem.tank_a_level} %` },
        { label: 'Tank B Level', val: `${chem.tank_b_level} %` },
        { label: 'Buffer C Level', val: `${chem.tank_c_level} %` },
      ],
      description: 'Maintains stoichiometric reagent inventory and continuous acid/base blending balance.'
    },
    {
      id: 'step5',
      stepNum: 5,
      discipline: 'CHEMICAL',
      deptCode: 'CHE',
      title: 'Chemical Reactor',
      equipment: 'Jacketed CSTR Vessel with Agitator',
      status: chem.reactor_enabled ? 'REACTING' : 'STANDBY',
      statusColor: chem.reactor_enabled ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-500/10',
      icon: Flame,
      accent: 'border-purple-500 shadow-purple-500/10',
      iconBg: 'bg-purple-500/15 text-purple-500',
      metrics: [
        { label: 'Reactor Temp', val: `${chem.reactor_temp} °C` },
        { label: 'Vapor Press', val: `${chem.reactor_pressure} bar` },
        { label: 'Medium pH', val: `${chem.reactor_ph}` },
      ],
      description: 'Exothermic Arrhenius reaction kinetics: Temperature monitored & jacket heat exchanged.'
    },
    {
      id: 'step6',
      stepNum: 6,
      discipline: 'INTEGRATED',
      deptCode: 'SYS',
      title: 'Finished Product',
      equipment: 'Certified Chemical Batch Output',
      status: chem.reaction_progress > 10 ? 'BATCH ACTIVE' : 'INITIALIZING',
      statusColor: 'text-emerald-500 bg-emerald-500/10',
      icon: CheckCircle2,
      accent: 'border-teal-500 shadow-teal-500/10',
      iconBg: 'bg-teal-500/15 text-teal-500',
      metrics: [
        { label: 'Conversion', val: `${chem.reaction_progress} %` },
        { label: 'Concentration', val: `${chem.reagent_concentration} %` },
        { label: 'Plant Yield', val: `${data.efficiencies.overall} %` },
      ],
      description: 'Final chemical compound verified to meet high purity standards.'
    }
  ];

  // Tri-Discipline Radar Comparison
  const radarData = [
    { subject: 'Electrical PF & Volts', value: Math.min(100, Math.round(data.efficiencies.electrical)) },
    { subject: 'Mechanical Motor Eff', value: Math.min(100, Math.round(mech.motor_efficiency)) },
    { subject: 'Pump Hydraulic Eff', value: Math.min(100, Math.round(mech.pump_efficiency)) },
    { subject: 'Chemical Yield', value: Math.min(100, Math.round(data.efficiencies.chemical)) },
    { subject: 'Thermal Stability', value: Math.max(0, 100 - Math.round(Math.abs(chem.reactor_temp - chem.reactor_target_temp) * 3)) },
    { subject: 'Overall Health', value: Math.min(100, Math.round(data.efficiencies.overall)) },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Core Focus of the Academic Assignment */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-[#132238] to-[#101B2D] text-white border-2 border-blue-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GitMerge className="h-64 w-64 text-blue-400" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500 text-white shadow-sm flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Primary Project Feature
            </span>
            <span className="text-xs font-mono text-blue-300">
              Electronics Design Capstone Demonstration
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Interdisciplinary Plant Integration System
          </h1>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            This module models closed-loop physical coupling across <strong className="text-blue-400">Electrical Engineering</strong> (power supply), <strong className="text-amber-400">Mechanical Engineering</strong> (motor shaft & pumps), and <strong className="text-emerald-400">Chemical Engineering</strong> (reaction kinetics & thermodynamics). Changes in one discipline dynamically modulate parameters in the other two.
          </p>
        </div>
      </div>

      {/* SECTION 1: VISUAL INDUSTRIAL PROCESS FLOW DIAGRAM */}
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-500" />
              Unified Industrial Process Flow Sequence
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live status and telemetry propagated through each node of the manufacturing chain
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Coupled Tick: Active (dt = 1.0s)
          </span>
        </div>

        {/* Responsive Grid Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {flowNodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className={`relative rounded-xl p-3.5 border bg-white dark:bg-slate-800/50 transition-all duration-200 hover:shadow-md flex flex-col justify-between ${node.accent}`}
              >
                {/* Step indicator header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] font-black font-mono px-1.5 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-700">
                    STEP {node.stepNum}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${node.statusColor}`}>
                    {node.status}
                  </span>
                </div>

                {/* Node Identity */}
                <div className="my-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${node.iconBg}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {node.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {node.deptCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Node Metrics */}
                <div className="space-y-1 py-1.5 my-1 bg-slate-50 dark:bg-slate-900/40 rounded-lg p-2 text-[10px] font-mono">
                  {node.metrics.map((m, i) => (
                    <div key={i} className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">{m.label}:</span>
                      <strong className="text-slate-900 dark:text-white">{m.val}</strong>
                    </div>
                  ))}
                </div>

                {/* Connector Arrow for desktop */}
                {index < flowNodes.length - 1 && (
                  <div className="hidden xl:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-6 w-6 rounded-full bg-blue-600 text-white items-center justify-center shadow-md">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: LIVE CROSS-DEPARTMENT PARAMETER PROPAGATION LAB */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Coupling Demonstration Sliders */}
        <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 lg:col-span-2">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-amber-500" />
              Live Cyber-Physical Parameter Propagation Experiment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag the motor speed slider and watch how electrical power, pump flow, and reactor kinetics immediately update!
            </p>
          </div>

          {/* Motor Slider Coupling */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Cog className="h-4 w-4 text-amber-500" />
                Input Variable: Industrial Motor Shaft Speed
              </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                {mech.motor_rpm} RPM
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={mech.motor_target_rpm}
              onChange={(e) => setMotorRpm(e.target.value)}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            {/* Propagated Downstream Effects Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block uppercase">
                  1. Electrical Load Reflects:
                </span>
                <p className="font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {elec.power_kw} kW ({elec.total_current} A)
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  \(P \propto \omega^3\) cubic fan/pump torque law
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold block uppercase">
                  2. Mechanical Pump Delivers:
                </span>
                <p className="font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {mech.pump_flow} L/min @ {mech.pump_pressure} bar
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Centrifugal affinity law: \(Q \propto N\)
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block uppercase">
                  3. Reactor Agitation Drives:
                </span>
                <p className="font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {chem.reactor_mixing_rpm} RPM &bull; Conv: {chem.reaction_progress}%
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Mass transfer rate k_rxn proportional to Re^0.8
                </span>
              </div>
            </div>
          </div>

          {/* Preset Interdisciplinary Cascade Demonstration Scenarios */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Interactive Academic Scenarios (Click to test inter-department chain reaction):
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <button
                onClick={() => {
                  injectFault('POWER_OUTAGE');
                  setActiveScenario('power_loss');
                }}
                className="p-3 rounded-xl border border-rose-300 dark:border-rose-900/80 bg-rose-50/50 dark:bg-rose-950/20 text-left hover:border-rose-500 transition-all"
              >
                <span className="font-bold text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Scenario A: Electrical Blackout
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  Substation loses utility feed \(\to\) Motors decelerate to 0 \(\to\) Chemical pumps stall \(\to\) Safety interlock trips.
                </p>
              </button>

              <button
                onClick={() => {
                  injectFault('PIPE_CLOG');
                  setActiveScenario('pipe_clog');
                }}
                className="p-3 rounded-xl border border-amber-300 dark:border-amber-900/80 bg-amber-50/50 dark:bg-amber-950/20 text-left hover:border-amber-500 transition-all"
              >
                <span className="font-bold text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Scenario B: Mechanical Clog
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  Discharge line clogs \(\to\) Pressure surges to 5.8 bar \(\to\) Reagent feed starves \(\to\) Chemical reaction halts.
                </p>
              </button>

              <button
                onClick={() => {
                  injectFault('REACTOR_EXOTHERM');
                  setActiveScenario('exotherm');
                }}
                className="p-3 rounded-xl border border-purple-300 dark:border-purple-900/80 bg-purple-50/50 dark:bg-purple-950/20 text-left hover:border-purple-500 transition-all"
              >
                <span className="font-bold text-xs text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5" />
                  Scenario C: Exotherm Surge
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  Chemical enthalpy spikes \(\to\) Temperature jumps to 110°C \(\to\) Cooling pumps draw surge electrical power.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Tri-Discipline Balance Radar Chart */}
        <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-500" />
              Tri-Discipline SCADA Balance Radar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluates mechanical, chemical, and electrical performance balance
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#334155" opacity={0.2} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#94A3B8' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8, fill: '#64748B' }} />
                <Radar name="Plant Metrics" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#101B2D', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-400">Coordinated Overall Plant Efficiency</span>
            <p className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
              {data.efficiencies.overall}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
