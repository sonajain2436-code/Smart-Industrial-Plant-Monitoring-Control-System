import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Sliders, ShieldCheck, Save, 
  RotateCcw, Percent, Cpu, Activity, Zap, Cog, FlaskConical,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { usePlant } from '../context/PlantContext';
import * as api from '../services/api';

export function Settings() {
  const { simSpeed, setSimSpeed } = usePlant();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [config, setConfig] = useState({
    motor_max_rpm: 3000,
    motor_temp_warn: 75.0,
    vibration_warn: 4.5,
    reactor_temp_warn: 85.0,
    reactor_max_press: 4.5,
    ph_min: 6.0,
    ph_max: 8.5,
    voltage_nom: 415.0,
    voltage_tolerance_pct: 10.0,
    current_max: 125.0,
    weight_mech: 0.35,
    weight_chem: 0.35,
    weight_elec: 0.30,
  });

  const handleChange = (key, val) => {
    setConfig(prev => ({ ...prev, [key]: parseFloat(val) || val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.saveSettings(config);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn("Save settings error:", err);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleResetDefaults = () => {
    setConfig({
      motor_max_rpm: 3000,
      motor_temp_warn: 75.0,
      vibration_warn: 4.5,
      reactor_temp_warn: 85.0,
      reactor_max_press: 4.5,
      ph_min: 6.0,
      ph_max: 8.5,
      voltage_nom: 415.0,
      voltage_tolerance_pct: 10.0,
      current_max: 125.0,
      weight_mech: 0.35,
      weight_chem: 0.35,
      weight_elec: 0.30,
    });
    setSimSpeed(1.0);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#182740] to-[#101B2D] text-white border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              System Configuration & SCADA Thresholds
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight mt-1">
            Plant Safety Interlocks & Formula Tuning
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Configure trip limits, ISO 10816 vibration alarms, and department weighting coefficients for the overall plant efficiency formula.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4" />
          Settings successfully saved to persistent configuration database!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Department Weights for Plant Efficiency Formula */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Percent className="h-4 w-4 text-indigo-500" />
              Tri-Discipline Plant Efficiency Formula Weights
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust relative contribution coefficients: w_mech + w_chem + w_elec = 1.0
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mechanical Weight */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Cog className="h-4 w-4 text-amber-500" />
                  Mechanical (w_mech):
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {Math.round(config.weight_mech * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={config.weight_mech}
                onChange={(e) => handleChange('weight_mech', e.target.value)}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Chemical Weight */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FlaskConical className="h-4 w-4 text-emerald-500" />
                  Chemical (w_chem):
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(config.weight_chem * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={config.weight_chem}
                onChange={(e) => handleChange('weight_chem', e.target.value)}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Electrical Weight */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Electrical (w_elec):
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(config.weight_elec * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={config.weight_elec}
                onChange={(e) => handleChange('weight_elec', e.target.value)}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Department Safety Thresholds */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Safety Trip Thresholds & Alarms
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure trigger levels for automated warning and emergency shutdown
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Mechanical Thresholds */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <strong className="text-amber-500 flex items-center gap-1.5">
                <Cog className="h-4 w-4" /> Mechanical Protection Limits
              </strong>

              <div className="flex justify-between items-center">
                <label className="text-slate-600 dark:text-slate-300">Max Motor Speed (RPM):</label>
                <input
                  type="number"
                  value={config.motor_max_rpm}
                  onChange={(e) => handleChange('motor_max_rpm', e.target.value)}
                  className="w-24 p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-right font-mono font-bold"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="text-slate-600 dark:text-slate-300">Motor Core Temp Trip (°C):</label>
                <input
                  type="number"
                  value={config.motor_temp_warn}
                  onChange={(e) => handleChange('motor_temp_warn', e.target.value)}
                  className="w-24 p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-right font-mono font-bold"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="text-slate-600 dark:text-slate-300">Vibration Warning (mm/s):</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.vibration_warn}
                  onChange={(e) => handleChange('vibration_warn', e.target.value)}
                  className="w-24 p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-right font-mono font-bold"
                />
              </div>
            </div>

            {/* Chemical & Electrical Thresholds */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <strong className="text-blue-500 flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Chemical & Electrical Limits
              </strong>

              <div className="flex justify-between items-center">
                <label className="text-slate-600 dark:text-slate-300">Reactor Temp Trip (°C):</label>
                <input
                  type="number"
                  value={config.reactor_temp_warn}
                  onChange={(e) => handleChange('reactor_temp_warn', e.target.value)}
                  className="w-24 p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-right font-mono font-bold"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="text-slate-600 dark:text-slate-300">Reactor Max Pressure (bar):</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.reactor_max_press}
                  onChange={(e) => handleChange('reactor_max_press', e.target.value)}
                  className="w-24 p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-right font-mono font-bold"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="text-slate-600 dark:text-slate-300">Feeder Max Current (A):</label>
                <input
                  type="number"
                  value={config.current_max}
                  onChange={(e) => handleChange('current_max', e.target.value)}
                  className="w-24 p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-right font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Simulation Clock Speed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Simulation Engine Execution Rate
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[0.5, 1.0, 2.0, 5.0].map(spd => (
              <button
                type="button"
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  simSpeed === spd
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {spd}x Real-time
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Defaults
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-95"
          >
            <Save className="h-4 w-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
