import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertTriangle, Bell, Clock, Cpu, Moon, Sun, 
  Power, ShieldAlert, CheckCircle2, AlertOctagon, RotateCcw,
  Radio, Wrench
} from 'lucide-react';
import { usePlant } from '../context/PlantContext';

export function Navbar({ onOpenFaultModal, onOpenAlertsModal }) {
  const { 
    data, alerts, theme, toggleTheme, emergencyStop, 
    resetSystem, isLiveBackend, activeFaults 
  } = usePlant();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const criticalCount = activeAlerts.filter(a => a.severity === 'CRITICAL').length;

  const getStatusBadge = () => {
    switch (data.status) {
      case 'RUNNING':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
          dot: 'bg-emerald-500 led-green',
          text: 'PLANT RUNNING'
        };
      case 'EMERGENCY_STOP':
        return {
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400',
          dot: 'bg-rose-500 led-red',
          text: 'EMERGENCY STOPPED'
        };
      case 'FAULT':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400',
          dot: 'bg-amber-500 led-amber',
          text: 'SYSTEM FAULT TRIP'
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
          dot: 'bg-amber-500',
          text: 'DEGRADED WARNING'
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400',
          dot: 'bg-slate-400',
          text: 'PLANT STOPPED'
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#101B2D]/95 backdrop-blur px-4 md:px-6 shadow-sm transition-colors duration-200">
      {/* Brand & Academic Label */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
          <Cpu className="h-6 w-6 animate-pulse-subtle" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 dark:text-white">
              SIP-MCS
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              ME &bull; CHE &bull; EE
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700" title={isLiveBackend ? "Connected to Python Flask REST API" : "Autonomous Client Simulation Engine"}>
              <Radio className={`h-3 w-3 ${isLiveBackend ? "text-emerald-500 animate-pulse" : "text-sky-400"}`} />
              <span className="hidden lg:inline">{isLiveBackend ? "Flask API 5000" : "Client Engine"}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
            Smart Industrial Plant Monitoring & Control System
          </p>
        </div>
      </div>

      {/* Center: Plant Operational Status Pill */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide shadow-sm ${statusBadge.bg}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${statusBadge.dot}`} />
          <span>{statusBadge.text}</span>
        </div>

        {/* Fault Injection Button */}
        <button
          onClick={onOpenFaultModal}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            activeFaults.length > 0 
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400'
          }`}
          title="Inject industrial faults to test interdisciplinary safety interlocks"
        >
          <Wrench className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Fault Sim</span>
          {activeFaults.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
              {activeFaults.length}
            </span>
          )}
        </button>

        {/* Emergency Stop Button */}
        {data.emergency_stopped ? (
          <button
            onClick={resetSystem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all transform active:scale-95"
            title="Reset Emergency Stop and restore safety interlocks"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>RESET E-STOP</span>
          </button>
        ) : (
          <button
            onClick={emergencyStop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all transform active:scale-95 border border-rose-700"
            title="Immediate emergency shutdown of all plant machinery"
          >
            <AlertOctagon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">E-STOP</span>
          </button>
        )}
      </div>

      {/* Right: Clock, Alerts, Theme Switcher, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <Clock className="h-3.5 w-3.5 text-blue-500" />
          <span>{currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          <span className="font-bold">{currentTime.toLocaleTimeString()}</span>
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowAlertDropdown(!showAlertDropdown)}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Plant Alarm Annunciator"
          >
            <Bell className="h-4 w-4" />
            {activeAlerts.length > 0 && (
              <span className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${
                criticalCount > 0 ? 'bg-rose-600 animate-bounce' : 'bg-amber-500'
              }`}>
                {activeAlerts.length}
              </span>
            )}
          </button>

          {/* Quick Alert Dropdown */}
          {showAlertDropdown && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182740] shadow-xl z-50 p-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Active Industrial Alerts ({activeAlerts.length})
                </span>
                <button
                  onClick={() => {
                    setShowAlertDropdown(false);
                    onOpenAlertsModal();
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="mt-2 max-h-64 overflow-y-auto space-y-2">
                {activeAlerts.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-400">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1 opacity-70" />
                    All department systems normal. No active alarms.
                  </div>
                ) : (
                  activeAlerts.slice(0, 4).map(alert => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded-lg border text-xs ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{alert.title}</span>
                        <span className="text-[10px] uppercase font-mono px-1 rounded bg-black/10 dark:bg-white/10">
                          {alert.department}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5 opacity-90 line-clamp-2">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </button>

        {/* User Profile / SCADA Role */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-500/30">
            CE
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold leading-tight text-slate-800 dark:text-slate-200">Eng. S. Jain</p>
            <p className="text-[10px] text-slate-400 font-mono">Lead SCADA Engineer</p>
          </div>
        </div>
      </div>
    </header>
  );
}
