import React, { useState } from 'react';
import { 
  Zap, Activity, ShieldAlert, Sliders, CheckCircle2, 
  Power, Flame, Gauge as GaugeIcon, AlertTriangle, Radio,
  BarChart2, Calendar, Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { usePlant } from '../context/PlantContext';
import { StatCard } from '../components/StatCard';
import { Gauge } from '../components/Gauge';

export function Electrical() {
  const { data, history, toggleBreaker, injectFault } = usePlant();
  const [energyPeriod, setEnergyPeriod] = useState('daily');

  const elec = data.electrical;

  // Mock historical energy datasets (Daily, Weekly, Monthly)
  const dailyData = [
    { time: '00:00', kwh: 32, peak: 38 },
    { time: '04:00', kwh: 28, peak: 32 },
    { time: '08:00', kwh: 52, peak: 58 },
    { time: '12:00', kwh: 64, peak: 71 },
    { time: '16:00', kwh: 59, peak: 65 },
    { time: '20:00', kwh: 45, peak: 49 },
  ];

  const weeklyData = [
    { time: 'Mon', kwh: 320, peak: 54 },
    { time: 'Tue', kwh: 345, peak: 58 },
    { time: 'Wed', kwh: 358, peak: 62 },
    { time: 'Thu', kwh: 340, peak: 56 },
    { time: 'Fri', kwh: 375, peak: 68 },
    { time: 'Sat', kwh: 240, peak: 42 },
    { time: 'Sun', kwh: 180, peak: 35 },
  ];

  const monthlyData = [
    { time: 'Week 1', kwh: 2150 },
    { time: 'Week 2', kwh: 2280 },
    { time: 'Week 3', kwh: 2310 },
    { time: 'Week 4', kwh: 2090 },
  ];

  const getActiveChartData = () => {
    if (energyPeriod === 'weekly') return weeklyData;
    if (energyPeriod === 'monthly') return monthlyData;
    return dailyData;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-[#102242] to-[#101B2D] text-white border border-blue-900/40 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Department of Electrical Engineering
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight mt-1">
            Substation Power Quality & Distribution SCADA
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Supervising 11kV/415V 500kVA step-down transformer, IEC 60034 power factor optimization, motor control center (MCC) air circuit breakers (ACB), and harmonic load currents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Electrical Efficiency</span>
            <p className="text-2xl font-black font-mono text-blue-400">{data.efficiencies.electrical}%</p>
          </div>
        </div>
      </div>

      {/* KPI SCADA Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="3-Phase Line Voltage"
          value={elec.grid_voltage}
          unit="V"
          subtitle="Nominal 415 V ±10%"
          icon={Zap}
          status={elec.grid_voltage < 370 || elec.grid_voltage > 450 ? 'critical' : 'normal'}
        />

        <StatCard
          title="Feeder Line Current"
          value={elec.total_current}
          unit="A"
          subtitle="MCC Rating: 125 A"
          icon={Activity}
          status={elec.total_current > 120 ? 'critical' : elec.total_current > 95 ? 'warning' : 'normal'}
        />

        <StatCard
          title="Total Active Power"
          value={elec.power_kw}
          unit="kW"
          subtitle="Real Power Dissipation"
          icon={GaugeIcon}
          status={elec.power_kw > 65 ? 'warning' : 'normal'}
        />

        <StatCard
          title="Displacement PF"
          value={elec.power_factor}
          unit=""
          subtitle={`Freq: ${elec.frequency} Hz`}
          icon={Radio}
          status={elec.power_factor < 0.88 ? 'warning' : 'normal'}
        />
      </div>

      {/* SECTION A: Power Monitoring Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Gauge
          title="Substation 3-Phase Bus Voltage"
          value={elec.grid_voltage}
          min={0}
          max={500}
          unit="V"
          warnThreshold={375}
          critThreshold={445}
          decimals={1}
        />
        <Gauge
          title="MCC Total Phase Current"
          value={elec.total_current}
          min={0}
          max={150}
          unit="A"
          warnThreshold={100}
          critThreshold={125}
          decimals={1}
        />
        <Gauge
          title="Substation Grid Frequency"
          value={elec.frequency}
          min={45}
          max={55}
          unit="Hz"
          warnThreshold={49.5}
          critThreshold={50.8}
          decimals={2}
        />
      </div>

      {/* SECTION B & C: Switchgear & Circuit Breakers Station */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Substation Single-Line Diagram & Breakers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Power className="h-4 w-4 text-blue-500" />
                Electrical Switchgear Protection & Circuit Breakers (SLD)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive trip / close controls for incoming ACB and outgoing feeder VCBs
              </p>
            </div>
          </div>

          {/* Interactive Breaker Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Main Breaker */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Main Incomer ACB
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  elec.breaker_main_closed ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                }`}>
                  {elec.breaker_main_closed ? 'CLOSED' : 'TRIPPED'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Controls incoming 415V supply to entire industrial plant.
              </p>
              <button
                onClick={() => toggleBreaker('main')}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                  elec.breaker_main_closed
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                }`}
              >
                {elec.breaker_main_closed ? 'TRIP BREAKER' : 'CLOSE BREAKER'}
              </button>
            </div>

            {/* Motor Breaker */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Motor Feeder VCB
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  elec.breaker_motor_closed ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                }`}>
                  {elec.breaker_motor_closed ? 'CLOSED' : 'TRIPPED'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Supplies 415V variable frequency drive to mechanical motors.
              </p>
              <button
                onClick={() => toggleBreaker('motor')}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                  elec.breaker_motor_closed
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                }`}
              >
                {elec.breaker_motor_closed ? 'TRIP BREAKER' : 'CLOSE BREAKER'}
              </button>
            </div>

            {/* Reactor Breaker */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Reactor Heater Breaker
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  elec.breaker_reactor_closed ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                }`}>
                  {elec.breaker_reactor_closed ? 'CLOSED' : 'TRIPPED'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Controls electrical heating elements for chemical reactor jacket.
              </p>
              <button
                onClick={() => toggleBreaker('reactor')}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                  elec.breaker_reactor_closed
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                }`}
              >
                {elec.breaker_reactor_closed ? 'TRIP BREAKER' : 'CLOSE BREAKER'}
              </button>
            </div>
          </div>

          {/* Fault Simulation Quick Buttons */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Simulate Substation Faults:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => injectFault('VOLTAGE_SAG')}
                className="px-2.5 py-1 rounded bg-amber-500 text-white font-bold hover:bg-amber-600"
              >
                Voltage Sag (-16%)
              </button>
              <button
                onClick={() => injectFault('OVERCURRENT')}
                className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold hover:bg-rose-700"
              >
                Overcurrent Spike
              </button>
              <button
                onClick={() => injectFault('POWER_OUTAGE')}
                className="px-2.5 py-1 rounded bg-slate-900 text-white font-bold hover:bg-black"
              >
                Grid Blackout
              </button>
            </div>
          </div>
        </div>

        {/* Right: Step-Down Transformer Health Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              11kV / 415V Transformer Health
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">500 kVA ONAN Step-Down Unit</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Insulating Oil Temp:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {elec.transformer_oil_temp} °C
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Apparent Load Ratio:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {elec.transformer_load_pct}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${elec.transformer_load_pct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">On-Load Tap Changer (OLTC):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">Tap #5 (0.00%)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Winding Hot-Spot Temp:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {(elec.transformer_oil_temp + 12.4).toFixed(1)} °C
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION D: Energy Consumption Trends (Daily, Weekly, Monthly) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-500" />
              Electrical Energy Consumption Breakdown (kWh)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auditing utility tariffs, peak shaving demand, and cumulative load
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['daily', 'weekly', 'monthly'].map(p => (
              <button
                key={p}
                onClick={() => setEnergyPeriod(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  energyPeriod === p
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getActiveChartData()} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#3B82F6' }} />
              <Tooltip contentStyle={{ backgroundColor: '#101B2D', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              <Bar dataKey="kwh" name="Energy Consumed (kWh)" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
