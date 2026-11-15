import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle2, Clock, Filter, Check, 
  RotateCcw, ShieldAlert, AlertCircle, Info, ChevronRight,
  BellRing
} from 'lucide-react';
import { usePlant } from '../context/PlantContext';

export function AlertPanel({ embedded = false }) {
  const { alerts, acknowledgeAlert, resolveAlert } = usePlant();
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredAlerts = alerts.filter(a => {
    const matchesDept = filterDept === 'ALL' || a.department === filterDept;
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    return matchesDept && matchesStatus;
  });

  const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const ackCount = alerts.filter(a => a.status === 'ACKNOWLEDGED').length;
  const resCount = alerts.filter(a => a.status === 'RESOLVED').length;

  return (
    <div className={`space-y-4 ${embedded ? '' : 'p-6'}`}>
      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Alarms</span>
            <p className="text-xl font-black font-mono text-slate-900 dark:text-white">{alerts.length}</p>
          </div>
          <BellRing className="h-6 w-6 text-slate-400 opacity-60" />
        </div>

        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Active Alarms</span>
            <p className="text-xl font-black font-mono text-rose-600 dark:text-rose-400">{activeCount}</p>
          </div>
          <AlertTriangle className="h-6 w-6 text-rose-500" />
        </div>

        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Acknowledged</span>
            <p className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">{ackCount}</p>
          </div>
          <Clock className="h-6 w-6 text-amber-500" />
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Resolved</span>
            <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">{resCount}</p>
          </div>
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Department:</span>
          {['ALL', 'MECHANICAL', 'CHEMICAL', 'ELECTRICAL', 'INTEGRATED'].map(dept => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterDept === dept
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Status:</span>
          {['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alarm Log Table */}
      <div className="rounded-2xl bg-white dark:bg-[#182740] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Alarm Description</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Operator Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No alarms match the specified filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => {
                  const isCrit = alert.severity === 'CRITICAL';
                  const isWarn = alert.severity === 'WARNING';
                  const isAct = alert.status === 'ACTIVE';
                  const isAck = alert.status === 'ACKNOWLEDGED';

                  return (
                    <tr 
                      key={alert.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        isAct && isCrit ? 'bg-rose-500/5' : isAct && isWarn ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          isCrit 
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30' 
                            : isWarn
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isCrit ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          {alert.severity}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {alert.department}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-md">
                        <p className="font-bold text-slate-900 dark:text-white">{alert.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{alert.message}</p>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(alert.created_at).toLocaleTimeString()}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isAct 
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' 
                            : isAck 
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' 
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}>
                          {alert.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isAct && (
                            <button
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] shadow-sm transition-all"
                            >
                              ACK
                            </button>
                          )}
                          {alert.status !== 'RESOLVED' && (
                            <button
                              onClick={() => resolveAlert(alert.id)}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm transition-all"
                            >
                              Resolve
                            </button>
                          )}
                          {alert.status === 'RESOLVED' && (
                            <span className="text-slate-400 text-[11px] flex items-center justify-end gap-1">
                              <Check className="h-3 w-3 text-emerald-500" />
                              Cleared
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
