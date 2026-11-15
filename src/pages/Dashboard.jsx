import React from 'react';
import { 
  Activity, Zap, Cog, FlaskConical, AlertTriangle, ShieldCheck, 
  Play, Square, AlertOctagon, TrendingUp, Gauge, Server, CheckCircle2,
  Layers, ArrowUpRight, Cpu
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { usePlant } from '../context/PlantContext';
import { StatCard } from '../components/StatCard';
import { AlertPanel } from '../components/AlertPanel';

export function Dashboard({ setActivePage, onOpenFaultModal }) {
  const { 
    data, history, alerts, startPlant, stopPlant, 
    emergencyStop, resetSystem 
  } = usePlant();

  const isRunning = data.status === 'RUNNING';
  const isEStop = data.status === 'EMERGENCY_STOP';
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Plant Overview & Operational Master Switch */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#132238] to-[#101B2D] text-white shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Plant Supervisory Control & Data Acquisition (SCADA)
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight mt-1">
            Smart Industrial Plant Overview
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Coordinated cyber-physical automation unifying <span className="text-amber-400 font-semibold">Mechanical</span> machinery, <span className="text-emerald-400 font-semibold">Chemical</span> thermodynamics, and <span className="text-blue-400 font-semibold">Electrical</span> 415V power distribution.
          </p>
        </div>

        {/* Master Control Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={startPlant}
            disabled={isEStop}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
              isRunning
                ? 'bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            <Play className="h-4 w-4 fill-current" />
            <span>START PLANT</span>
          </button>

          <button
            onClick={stopPlant}
            disabled={isEStop}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 border border-slate-600"
          >
            <Square className="h-4 w-4 fill-current" />
            <span>STOP PLANT</span>
          </button>

          <button
            onClick={emergencyStop}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all active:scale-95 border border-rose-500"
          >
            <AlertOctagon className="h-4 w-4" />
            <span>E-STOP</span>
          </button>
        </div>
      </div>

      {/* 8 Metric KPI SCADA Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Machines"
          value={data.plant_health.total_machines}
          subtitle="Monitored Subsystems"
          icon={Server}
          department="ME · CHE · EE"
        />

        <StatCard
          title="Running Units"
          value={data.plant_health.running_machines}
          subtitle={`Stopped: ${data.plant_health.stopped_machines}`}
          icon={CheckCircle2}
          status={data.plant_health.running_machines >= 5 ? 'normal' : 'warning'}
        />

        <StatCard
          title="Reactor Status"
          value={data.chemical.reactor_temp}
          unit="°C"
          subtitle={`Set: ${data.chemical.reactor_target_temp}°C | ${data.chemical.reactor_pressure} bar`}
          icon={FlaskConical}
          department="CHE"
          status={data.chemical.reactor_temp > 85 ? 'critical' : data.chemical.reactor_temp > 78 ? 'warning' : 'normal'}
          onClick={() => setActivePage('chemical')}
        />

        <StatCard
          title="Grid Power Draw"
          value={data.electrical.power_kw}
          unit="kW"
          subtitle={`Current: ${data.electrical.total_current} A @ 415V`}
          icon={Zap}
          department="EE"
          status={data.electrical.power_kw > 65 ? 'warning' : 'normal'}
          onClick={() => setActivePage('electrical')}
        />

        <StatCard
          title="Energy Consumed"
          value={data.electrical.energy_kwh}
          unit="kWh"
          subtitle={`PF: ${data.electrical.power_factor} | 50.0 Hz`}
          icon={Activity}
          department="EE"
          onClick={() => setActivePage('electrical')}
        />

        <StatCard
          title="Motor Speed"
          value={data.mechanical.motor_rpm}
          unit="RPM"
          subtitle={`Vib: ${data.mechanical.motor_vibration} mm/s RMS`}
          icon={Cog}
          department="ME"
          status={data.mechanical.motor_vibration > 4.5 ? 'critical' : 'normal'}
          onClick={() => setActivePage('mechanical')}
        />

        <StatCard
          title="Active Warnings"
          value={activeAlertsCount}
          subtitle={activeAlertsCount === 0 ? 'All parameters within limits' : 'Attention required'}
          icon={AlertTriangle}
          status={activeAlertsCount > 0 ? (activeAlertsCount > 2 ? 'critical' : 'warning') : 'normal'}
          onClick={() => setActivePage('alerts')}
        />

        <StatCard
          title="Plant Efficiency"
          value={data.efficiencies.overall}
          unit="%"
          subtitle={`ME: ${data.efficiencies.mechanical}% | CHE: ${data.efficiencies.chemical}%`}
          icon={TrendingUp}
          status={data.efficiencies.overall >= 88 ? 'normal' : 'warning'}
          onClick={() => setActivePage('analytics')}
        />
      </div>

      {/* Real-time SCADA Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Real-time Machine Performance (Motor RPM & Pump Flow) */}
        <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cog className="h-4 w-4 text-amber-500" />
                Mechanical Equipment Dynamic Response
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Motor Shaft Rotation (RPM) vs Centrifugal Pump Flow Rate (L/min)
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
              ME Live
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis yAxisId="rpm" domain={[0, 3000]} tick={{ fontSize: 10, fill: '#F59E0B' }} />
                <YAxis yAxisId="flow" orientation="right" domain={[0, 100]} tick={{ fontSize: 10, fill: '#06B6D4' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#101B2D', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line yAxisId="rpm" type="monotone" dataKey="motor_rpm" name="Motor Speed (RPM)" stroke="#F59E0B" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="flow" type="monotone" dataKey="pump_flow" name="Pump Flow (L/min)" stroke="#06B6D4" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Electrical Energy Consumption Graph */}
        <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                Active Power Demand & Substation Load
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantaneous 3-Phase Power Draw (kW) & Feeder Current (A)
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
              EE Live
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis domain={[0, 80]} tick={{ fontSize: 10, fill: '#3B82F6' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#101B2D', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Area type="monotone" dataKey="power_kw" name="Total Power (kW)" stroke="#3B82F6" fillOpacity={1} fill="url(#powerGrad)" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Chemical Process Monitoring Graph */}
        <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-emerald-500" />
                Chemical Process & Reactor Thermodynamics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Core Reactor Vessel Temperature (°C) Real-time Tracking
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              CHE Live
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis domain={[20, 110]} tick={{ fontSize: 10, fill: '#10B981' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#101B2D', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="reactor_temp" name="Reactor Core Temp (°C)" stroke="#10B981" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Department & Overall Plant Efficiency Graph */}
        <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                Tri-Discipline Plant Efficiency Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mechanical, Chemical, Electrical & Overall Weighted Yield (%)
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              Integration Live
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#6366F1' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#101B2D', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="overall_eff" name="Overall Plant (%)" stroke="#6366F1" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="mech_eff" name="Mechanical (%)" stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="4 4" isAnimationActive={false} />
                <Line type="monotone" dataKey="chem_eff" name="Chemical (%)" stroke="#10B981" strokeWidth={1.5} dot={false} strokeDasharray="4 4" isAnimationActive={false} />
                <Line type="monotone" dataKey="elec_eff" name="Electrical (%)" stroke="#3B82F6" strokeWidth={1.5} dot={false} strokeDasharray="4 4" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Industrial Alerts Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Recent Plant SCADA Alarms & Audit Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Coordinated fault detection with real-time acknowledgment and resolution
            </p>
          </div>
          <button
            onClick={() => setActivePage('alerts')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Open Annunciator Console</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <AlertPanel embedded={true} />
      </div>
    </div>
  );
}
