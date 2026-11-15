import React from 'react';
import { 
  X, AlertTriangle, Zap, Cog, FlaskConical, ShieldAlert, 
  RotateCcw, Check, Flame, Waves, Gauge 
} from 'lucide-react';
import { usePlant } from '../context/PlantContext';

export function FaultModal({ isOpen, onClose }) {
  const { activeFaults, injectFault, clearFault } = usePlant();

  if (!isOpen) return null;

  const faultCatalog = [
    {
      id: 'BEARING_FAULT',
      dept: 'ME',
      deptName: 'Mechanical Engineering',
      title: 'Motor Bearing Vibration Defect',
      desc: 'Simulates inner race bearing spalling. ISO 10816 vibration surges past 6.5 mm/s and bearing temperature spikes.',
      severity: 'CRITICAL',
      icon: Cog,
      iconColor: 'text-amber-500 bg-amber-500/10'
    },
    {
      id: 'PIPE_CLOG',
      dept: 'ME',
      deptName: 'Mechanical Engineering',
      title: 'Centrifugal Pump Line Restriction',
      desc: 'Simulates pipe deposit buildup. Discharge pressure spikes to 5.8 bar while delivery flow drops by 35%.',
      severity: 'WARNING',
      icon: Waves,
      iconColor: 'text-amber-500 bg-amber-500/10'
    },
    {
      id: 'REACTOR_EXOTHERM',
      dept: 'CHE',
      deptName: 'Chemical Engineering',
      title: 'Chemical Reactor Thermal Runaway',
      desc: 'Simulates uncontrolled Arrhenius reaction heat generation exceeding jacket coolant heat removal capacity.',
      severity: 'CRITICAL',
      icon: Flame,
      iconColor: 'text-rose-500 bg-rose-500/10'
    },
    {
      id: 'PH_ACID_SPIKE',
      dept: 'CHE',
      deptName: 'Chemical Engineering',
      title: 'Acid Inflow Imbalance (pH Drop)',
      desc: 'Simulates reagent stoichiometric imbalance causing severe medium acidification (pH drops to 4.1).',
      severity: 'WARNING',
      icon: FlaskConical,
      iconColor: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      id: 'VOLTAGE_SAG',
      dept: 'EE',
      deptName: 'Electrical Engineering',
      title: '3-Phase Grid Voltage Sag (348V)',
      desc: 'Simulates utility transmission fault causing -16% grid under-voltage. Motor draws higher current to maintain torque.',
      severity: 'WARNING',
      icon: Zap,
      iconColor: 'text-blue-500 bg-blue-500/10'
    },
    {
      id: 'OVERCURRENT',
      dept: 'EE',
      deptName: 'Electrical Engineering',
      title: 'MCC Panel Feeder Overcurrent',
      desc: 'Simulates equipment overload pushing phase current past 135A rating, testing protective relay trip curves.',
      severity: 'CRITICAL',
      icon: Gauge,
      iconColor: 'text-blue-500 bg-blue-500/10'
    },
    {
      id: 'POWER_OUTAGE',
      dept: 'EE',
      deptName: 'Electrical Engineering',
      title: 'Total Substation Grid Loss',
      desc: 'Simulates utility blackout. Coordinated cascade: Motors stop, pumps shut down, chemical reaction bypass activates.',
      severity: 'CRITICAL',
      icon: ShieldAlert,
      iconColor: 'text-rose-500 bg-rose-500/10'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Fault Injection & Scenario Simulator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trigger real-time engineering faults to demonstrate cross-department SCADA response
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Fault List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {faultCatalog.map((fault) => {
            const isActive = activeFaults.includes(fault.id);
            const Icon = fault.icon;

            return (
              <div
                key={fault.id}
                className={`flex items-start justify-between p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-blue-400/50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${fault.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {fault.title}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300">
                        {fault.dept}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        fault.severity === 'CRITICAL' 
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' 
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      }`}>
                        {fault.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {fault.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isActive) clearFault(fault.id);
                    else injectFault(fault.id);
                  }}
                  className={`flex-shrink-0 ml-4 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                >
                  {isActive ? 'Clear Fault' : 'Inject'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Active Scenarios: <strong className="text-slate-900 dark:text-white">{activeFaults.length}</strong>
          </span>

          <div className="flex gap-2">
            {activeFaults.length > 0 && (
              <button
                onClick={() => clearFault(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear All Faults
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
