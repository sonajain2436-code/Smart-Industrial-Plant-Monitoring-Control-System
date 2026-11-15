import React from 'react';
import { 
  LayoutDashboard, Cog, FlaskConical, Zap, Factory, 
  GitMerge, LineChart, AlertTriangle, FileText, Settings,
  Gauge, Activity, ArrowRight, ShieldCheck
} from 'lucide-react';
import { usePlant } from '../context/PlantContext';

export function Sidebar({ activePage, setActivePage }) {
  const { data, alerts } = usePlant();
  const unreadAlerts = alerts.filter(a => a.status === 'ACTIVE').length;

  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'mechanical', label: 'Mechanical Engineering', icon: Cog, dept: 'ME', color: 'text-amber-500' },
    { id: 'chemical', label: 'Chemical Engineering', icon: FlaskConical, dept: 'CHE', color: 'text-emerald-500' },
    { id: 'electrical', label: 'Electrical Engineering', icon: Zap, dept: 'EE', color: 'text-blue-500' },
    { 
      id: 'integration', 
      label: 'Plant Integration', 
      icon: GitMerge, 
      highlight: true,
      badge: 'Core Focus' 
    },
    { id: 'simulation', label: 'Plant Simulation', icon: Factory },
    { id: 'analytics', label: 'Performance Analytics', icon: LineChart },
    { 
      id: 'alerts', 
      label: 'Faults & Alerts', 
      icon: AlertTriangle, 
      badge: unreadAlerts > 0 ? `${unreadAlerts}` : null,
      badgeColor: 'bg-rose-500 text-white' 
    },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'settings', label: 'Settings & Config', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101B2D] flex flex-col justify-between select-none">
      <div className="p-4 space-y-6">
        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            SCADA Supervision
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                      : item.highlight
                      ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/15 border border-blue-500/30'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color || 'text-slate-400 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-tight ${
                      item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Real-time Department Status Cards */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Discipline Subsystems
          </p>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
            {/* ME Status */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Mechanical (ME)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {data.mechanical.motor_rpm} RPM
              </span>
            </div>

            {/* CHE Status */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Chemical (CHE)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {data.chemical.reactor_temp}°C
              </span>
            </div>

            {/* EE Status */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Electrical (EE)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {data.electrical.power_kw} kW
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Overall Health Indicator */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Plant Health Score</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
            {data.efficiencies.overall}%
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-emerald-500"
            style={{ width: `${Math.min(100, Math.max(5, data.efficiencies.overall))}%` }}
          />
        </div>
        <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 text-center font-mono">
          Electronics Design Academic Suite v2.0
        </p>
      </div>
    </aside>
  );
}
