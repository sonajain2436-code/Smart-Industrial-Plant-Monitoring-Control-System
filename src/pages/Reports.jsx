import React, { useState } from 'react';
import { 
  FileText, Download, FileSpreadsheet, CheckCircle2, Clock, 
  ShieldCheck, AlertTriangle, Printer, Eye, Share2, Layers
} from 'lucide-react';
import { usePlant } from '../context/PlantContext';
import { generateClientPdf } from '../services/exportPdf';
import { generateClientCsv } from '../services/exportCsv';

export function Reports() {
  const { data, alerts, history, isLiveBackend } = usePlant();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      if (isLiveBackend) {
        window.open('/api/reports/pdf', '_blank');
      } else {
        generateClientPdf(data, alerts);
      }
    } catch (err) {
      console.warn("Backend PDF error, falling back to client PDF:", err);
      generateClientPdf(data, alerts);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      if (isLiveBackend) {
        window.open('/api/reports/csv', '_blank');
      } else {
        generateClientCsv(history);
      }
    } catch (err) {
      console.warn("Backend CSV error, falling back to client CSV:", err);
      generateClientCsv(history);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#182740] to-[#101B2D] text-white border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Audit & Report Generation Console
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight mt-1">
            Plant Operational Reports & Regulatory Compliance
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Generate verifiable technical audit reports integrating Mechanical ISO 10816 vibration data, Chemical CSTR thermodynamic logs, and Electrical 415V energy billing.
          </p>
        </div>

        {/* Quick Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? 'Compiling PDF...' : 'Download PDF Report'}</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Report Ref</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
              ISO 50001
            </span>
          </div>
          <p className="text-xl font-black font-mono text-slate-900 dark:text-white">
            SIP-AUDIT-{new Date().getFullYear()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated cyber-physical audit document with digital sign-offs
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telemetric Samples</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
              Live Buffer
            </span>
          </div>
          <p className="text-xl font-black font-mono text-slate-900 dark:text-white">
            {history.length} Real-Time Points
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Synchronized at 1.5s resolution across 24 channels
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alarms Documented</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold">
              SCADA Log
            </span>
          </div>
          <p className="text-xl font-black font-mono text-slate-900 dark:text-white">
            {alerts.length} Incidents
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Categorized by Mechanical, Chemical, and Electrical departments
          </p>
        </div>
      </div>

      {/* Document Preview Sheet */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              Interactive Executive Document Preview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live dynamic preview of compiled industrial audit report
            </p>
          </div>

          <button
            onClick={handleDownloadPdf}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Generate Official PDF</span>
          </button>
        </div>

        {/* Paper Layout Mockup */}
        <div className="p-6 md:p-8 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-5 shadow-inner">
          {/* Header */}
          <div className="border-b-2 border-blue-600 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              SMART INDUSTRIAL PLANT MONITORING & CONTROL SYSTEM
            </h2>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-sans mt-0.5">
              Interdisciplinary Engineering Audit Report &bull; Electronics Design Suite
            </p>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Generated: {new Date().toLocaleString()} &bull; Operator: Chief Plant Engineer
            </p>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase font-sans text-xs">
              1. Executive Performance Summary
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] p-2.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400 block">Overall Health:</span>
                <strong>{data.efficiencies.overall}%</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Plant Status:</span>
                <strong>{data.status}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Active Power:</span>
                <strong>{data.electrical.power_kw} kW</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Cumulative Energy:</span>
                <strong>{data.electrical.energy_kwh} kWh</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Department Highlights */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase font-sans text-xs">
              2. Discipline Performance Audit
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <strong className="text-amber-500 font-sans block">Mechanical (ME)</strong>
                <p>Speed: {data.mechanical.motor_rpm} RPM</p>
                <p>Pump Flow: {data.mechanical.pump_flow} L/min</p>
                <p>Vibration: {data.mechanical.motor_vibration} mm/s</p>
                <p>Efficiency: {data.efficiencies.mechanical}%</p>
              </div>

              <div className="p-2.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <strong className="text-emerald-500 font-sans block">Chemical (CHE)</strong>
                <p>Reactor: {data.chemical.reactor_temp} °C</p>
                <p>Pressure: {data.chemical.reactor_pressure} bar</p>
                <p>Acidity: {data.chemical.reactor_ph} pH</p>
                <p>Yield: {data.efficiencies.chemical}%</p>
              </div>

              <div className="p-2.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <strong className="text-blue-500 font-sans block">Electrical (EE)</strong>
                <p>Voltage: {data.electrical.grid_voltage} V</p>
                <p>Current: {data.electrical.total_current} A</p>
                <p>Power Factor: {data.electrical.power_factor}</p>
                <p>Efficiency: {data.efficiencies.electrical}%</p>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-3 text-center text-[10px] font-sans">
            <div className="p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800">
              <p className="font-bold">Mechanical Engineering Lead</p>
              <p className="text-emerald-500 mt-1 font-mono font-bold">[ VERIFIED ]</p>
            </div>
            <div className="p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800">
              <p className="font-bold">Chemical Process Lead</p>
              <p className="text-emerald-500 mt-1 font-mono font-bold">[ VERIFIED ]</p>
            </div>
            <div className="p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800">
              <p className="font-bold">Electrical Substation Lead</p>
              <p className="text-emerald-500 mt-1 font-mono font-bold">[ VERIFIED ]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
