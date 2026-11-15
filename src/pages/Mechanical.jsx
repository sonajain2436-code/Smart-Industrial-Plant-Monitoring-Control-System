import React from 'react';
import { 
  Cog, Activity, Thermometer, Waves, Gauge as GaugeIcon, 
  Play, Square, Sliders, AlertTriangle, ShieldCheck, 
  RotateCw, RefreshCw, BarChart2, CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { usePlant } from '../context/PlantContext';
import { StatCard } from '../components/StatCard';
import { Gauge } from '../components/Gauge';

export function Mechanical() {
  const { 
    data, history, setMotorRpm, toggleMotor, 
    setPumpFlow, togglePump, injectFault, clearFault 
  } = usePlant();

  const mech = data.mechanical;
  const isMotorOn = mech.motor_enabled && mech.motor_rpm > 10;
  const isPumpOn = mech.pump_enabled && mech.pump_flow > 2;

  // Pump Head-Flow (H-Q) operating points data for curve rendering
  const hqData = [
    { flow: 0, head: 5.5, operating: mech.pump_flow === 0 ? mech.pump_pressure : null },
    { flow: 20, head: 5.2, operating: Math.abs(mech.pump_flow - 20) < 10 ? mech.pump_pressure : null },
    { flow: 40, head: 4.7, operating: Math.abs(mech.pump_flow - 40) < 10 ? mech.pump_pressure : null },
    { flow: 60, head: 4.0, operating: Math.abs(mech.pump_flow - 60) < 10 ? mech.pump_pressure : null },
    { flow: 80, head: 3.1, operating: Math.abs(mech.pump_flow - 80) < 10 ? mech.pump_pressure : null },
    { flow: 100, head: 1.8, operating: Math.abs(mech.pump_flow - 100) < 10 ? mech.pump_pressure : null },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950 via-[#1e1e24] to-[#101B2D] text-white border border-amber-900/40 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Cog className="h-5 w-5 text-amber-400 animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Department of Mechanical Engineering
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight mt-1">
            Rotating Machinery & Fluid Dynamics SCADA
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Supervising continuous 4-pole three-phase induction motor, drive end / non-drive end hydrodynamic bearings, ISO 10816 vibration severity, and centrifugal chemical delivery pump.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Subsystem Efficiency</span>
            <p className="text-2xl font-black font-mono text-amber-400">{data.efficiencies.mechanical}%</p>
          </div>
        </div>
      </div>

      {/* KPI SCADA Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Motor Shaft Speed"
          value={mech.motor_rpm}
          unit="RPM"
          subtitle={`Setpoint: ${mech.motor_target_rpm} RPM`}
          icon={RotateCw}
          status={mech.motor_rpm > 2800 ? 'warning' : 'normal'}
        />

        <StatCard
          title="Motor Core Temp"
          value={mech.motor_temp}
          unit="°C"
          subtitle="Limit: 75.0 °C (Class F)"
          icon={Thermometer}
          status={mech.motor_temp > 75 ? 'critical' : mech.motor_temp > 68 ? 'warning' : 'normal'}
        />

        <StatCard
          title="Bearing Vibration"
          value={mech.motor_vibration}
          unit="mm/s"
          subtitle="ISO 10816-3 Zone B"
          icon={Activity}
          status={mech.motor_vibration > 4.5 ? 'critical' : mech.motor_vibration > 3.0 ? 'warning' : 'normal'}
        />

        <StatCard
          title="Pump Delivery Flow"
          value={mech.pump_flow}
          unit="L/min"
          subtitle={`Pressure: ${mech.pump_pressure} bar`}
          icon={Waves}
          status={mech.pump_flow > 85 ? 'warning' : 'normal'}
        />
      </div>

      {/* Gauges & Interactive Equipment Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 2 Gauges (Motor Speed & Pump Pressure) */}
        <div className="space-y-4">
          <Gauge
            title="Induction Motor Tachometer"
            value={mech.motor_rpm}
            min={0}
            max={3000}
            unit="RPM"
            warnThreshold={2400}
            critThreshold={2850}
            decimals={0}
          />
          <Gauge
            title="Centrifugal Pump Discharge Head"
            value={mech.pump_pressure}
            min={0}
            max={8}
            unit="bar"
            warnThreshold={5.0}
            critThreshold={6.5}
            decimals={2}
          />
        </div>

        {/* Center: Equipment Control Station */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-500" />
                Mechanical Actuator & Speed Modulation Station
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct VFD frequency modulation and flow throttling
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              isMotorOn ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {isMotorOn ? 'VFD ENERGIZED' : 'STANDBY'}
            </span>
          </div>

          {/* Motor Speed Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Cog className="h-4 w-4 text-amber-500" />
                Motor Target RPM Setpoint:
              </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                {mech.motor_target_rpm} RPM
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={mech.motor_target_rpm}
              onChange={(e) => setMotorRpm(e.target.value)}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[0, 750, 1480, 2200, 3000].map(rpm => (
                <button
                  key={rpm}
                  onClick={() => setMotorRpm(rpm)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    mech.motor_target_rpm === rpm
                      ? 'bg-amber-500 text-white font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {rpm === 0 ? 'OFF (0)' : `${rpm} RPM`}
                </button>
              ))}
            </div>
          </div>

          {/* Pump Flow Control */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Waves className="h-4 w-4 text-cyan-500" />
                Centrifugal Delivery Target Flow:
              </span>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                {mech.pump_flow} L/min
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={togglePump}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mech.pump_enabled
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {mech.pump_enabled ? 'PUMP ACTIVE' : 'PUMP ISOLATED'}
              </button>

              <button
                onClick={toggleMotor}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mech.motor_enabled
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {mech.motor_enabled ? 'MOTOR ENERGIZED' : 'MOTOR STOPPED'}
              </button>
            </div>
          </div>

          {/* Bearing Health & Mechanical Tribology Panel */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-slate-400 font-medium">Bearing DE Temp</span>
              <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {mech.bearing_temp} °C
              </p>
              <span className="text-[10px] text-emerald-500 font-semibold">&bull; Hydrodynamic OK</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-slate-400 font-medium">Pump Mech Efficiency</span>
              <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {mech.pump_efficiency} %
              </p>
              <span className="text-[10px] text-cyan-500 font-semibold">&bull; Hydraulic Best Point</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-slate-400 font-medium">Motor Efficiency</span>
              <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {mech.motor_efficiency} %
              </p>
              <span className="text-[10px] text-amber-500 font-semibold">&bull; IE3 Premium Class</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Dynamic Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thermal History: Motor Core vs Bearing Temperature */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-rose-500" />
              Thermal Dissipation Trend (°C)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Motor Stator Winding Temperature vs Drive End (DE) Bearing
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis domain={[20, 100]} tick={{ fontSize: 10, fill: '#F43F5E' }} />
                <Tooltip contentStyle={{ backgroundColor: '#101B2D', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="reactor_temp" name="Motor Stator Core (°C)" stroke="#F43F5E" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pump Head vs Flow Characteristic Curve */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-cyan-500" />
              Centrifugal Pump Head vs Flow (H-Q) Characteristic
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Euler head capacity curve with live duty point indicator
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hqData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="flow" name="Flow (L/min)" unit=" L/m" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis domain={[0, 7]} name="Pressure (bar)" unit=" bar" tick={{ fontSize: 10, fill: '#06B6D4' }} />
                <Tooltip contentStyle={{ backgroundColor: '#101B2D', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="natural" dataKey="head" name="Pump Characteristic H-Q" stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
