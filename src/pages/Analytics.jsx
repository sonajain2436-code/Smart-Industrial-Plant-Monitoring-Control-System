import React, { useState } from 'react';
import { 
  LineChart as LineChartIcon, TrendingUp, BarChart2, Calendar, 
  Activity, Zap, Cog, FlaskConical, CheckCircle2, Info,
  Percent, ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area, 
  ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { usePlant } from '../context/PlantContext';
import { StatCard } from '../components/StatCard';

export function Analytics() {
  const { data, history } = usePlant();
  const [timeframe, setTimeframe] = useState('24h');

  // Multi-day mock dataset for 7d and 30d views
  const data24h = history;

  const data7d = [
    { time: 'Day 1', overall: 91.2, mech: 89.5, chem: 93.0, elec: 94.2, kwh: 1040, batches: 18 },
    { time: 'Day 2', overall: 92.5, mech: 90.2, chem: 94.1, elec: 94.8, kwh: 1080, batches: 19 },
    { time: 'Day 3', overall: 89.8, mech: 88.0, chem: 91.5, elec: 93.1, kwh: 990, batches: 16 },
    { time: 'Day 4', overall: 93.1, mech: 91.4, chem: 94.8, elec: 95.0, kwh: 1120, batches: 20 },
    { time: 'Day 5', overall: 92.0, mech: 89.9, chem: 93.5, elec: 94.5, kwh: 1060, batches: 18 },
    { time: 'Day 6', overall: 94.2, mech: 92.5, chem: 95.2, elec: 95.8, kwh: 1150, batches: 21 },
    { time: 'Day 7', overall: 91.9, mech: 89.6, chem: 92.4, elec: 94.1, kwh: 1070, batches: 19 },
  ];

  const data30d = [
    { time: 'Wk 1', overall: 91.8, mech: 89.4, chem: 93.2, elec: 94.2, kwh: 7450 },
    { time: 'Wk 2', overall: 92.4, mech: 90.1, chem: 94.0, elec: 94.9, kwh: 7620 },
    { time: 'Wk 3', overall: 90.5, mech: 88.6, chem: 92.1, elec: 93.5, kwh: 7180 },
    { time: 'Wk 4', overall: 93.2, mech: 91.2, chem: 94.9, elec: 95.4, kwh: 7810 },
  ];

  const getChartData = () => {
    if (timeframe === '7d') return data7d;
    if (timeframe === '30d') return data30d;
    return data24h;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Performance Analytics */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-[#191e38] to-[#101B2D] text-white border border-indigo-900/40 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Smart Analytics & Yield Engineering
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight mt-1">
            Plant Efficiency & OEE Performance Analytics
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Mathematical auditing of mechanical shaft friction, chemical stoichiometric yield, and electrical power quality metrics.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-700 text-xs">
          {['24h', '7d', '30d'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timeframe === tf
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf === '24h' ? 'Last 24 Hours' : tf === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Efficiency Formula Card with Clear Math Explanation */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Percent className="h-4 w-4 text-blue-500" />
            Supervisory Overall Plant Efficiency Weighted Formula
          </span>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Current: {data.efficiencies.overall}%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 font-mono text-xs md:text-sm text-center text-slate-800 dark:text-slate-200 shadow-inner">
          η_overall = (w_mech × η_mech) + (w_chem × η_chem) + (w_elec × η_elec)
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-sans">
            Where weights are configured as: <strong className="text-amber-500">w_mech = 0.35</strong>, <strong className="text-emerald-500">w_chem = 0.35</strong>, and <strong className="text-blue-500">w_elec = 0.30</strong>
          </div>
        </div>
      </div>

      {/* KPI SCADA Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Overall Plant Health"
          value={data.efficiencies.overall}
          unit="%"
          subtitle="Tri-Discipline Score"
          icon={TrendingUp}
          status="normal"
        />

        <StatCard
          title="Mechanical Efficiency"
          value={data.efficiencies.mechanical}
          unit="%"
          subtitle="Motor & Pump Index"
          icon={Cog}
          department="ME"
          status="normal"
        />

        <StatCard
          title="Chemical Process Yield"
          value={data.efficiencies.chemical}
          unit="%"
          subtitle="Conversion & Stoichiometry"
          icon={FlaskConical}
          department="CHE"
          status="normal"
        />

        <StatCard
          title="Electrical Efficiency"
          value={data.efficiencies.electrical}
          unit="%"
          subtitle="PF & Loss Correction"
          icon={Zap}
          department="EE"
          status="normal"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Historical Efficiency Comparison */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              Department Efficiency Trajectory ({timeframe.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing Mechanical, Chemical, and Electrical efficiencies over selected timeframe
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis domain={[65, 100]} tick={{ fontSize: 10, fill: '#6366F1' }} />
                <Tooltip contentStyle={{ backgroundColor: '#101B2D', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey={timeframe === '24h' ? 'overall_eff' : 'overall'} name="Overall Plant" stroke="#6366F1" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey={timeframe === '24h' ? 'mech_eff' : 'mech'} name="Mechanical" stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="3 3" isAnimationActive={false} />
                <Line type="monotone" dataKey={timeframe === '24h' ? 'chem_eff' : 'chem'} name="Chemical" stroke="#10B981" strokeWidth={1.5} dot={false} strokeDasharray="3 3" isAnimationActive={false} />
                <Line type="monotone" dataKey={timeframe === '24h' ? 'elec_eff' : 'elec'} name="Electrical" stroke="#3B82F6" strokeWidth={1.5} dot={false} strokeDasharray="3 3" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Energy Consumption vs Output Production */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              Power Demand vs Equipment Utilization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Specific Energy Consumption (SEC) and throughput
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {timeframe === '7d' ? (
                <BarChart data={data7d} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis yAxisId="kwh" tick={{ fontSize: 10, fill: '#3B82F6' }} />
                  <YAxis yAxisId="batches" orientation="right" tick={{ fontSize: 10, fill: '#10B981' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#101B2D', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar yAxisId="kwh" dataKey="kwh" name="Energy Consumed (kWh)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="batches" dataKey="batches" name="Completed Batches" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaElec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#3B82F6' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#101B2D', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Area type="monotone" dataKey="power_kw" name="Power Demand (kW)" stroke="#3B82F6" fill="url(#areaElec)" strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* OEE Breakdown Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Overall Equipment Effectiveness (OEE) Industrial Audit
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calculated as: Availability (96.4%) &times; Performance (94.2%) &times; Quality (98.6%) = 89.5% OEE
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <span className="text-slate-400 font-medium">Availability Rate</span>
            <p className="text-xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">96.4%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Uptime vs Scheduled Run Hours</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <span className="text-slate-400 font-medium">Performance Rate</span>
            <p className="text-xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">94.2%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Operating speed vs nameplate maximum</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <span className="text-slate-400 font-medium">Quality Rate</span>
            <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">98.6%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Reagent conversion meeting chemical specs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
