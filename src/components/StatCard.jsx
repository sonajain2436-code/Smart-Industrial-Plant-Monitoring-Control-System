import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';

export function StatCard({ 
  title, 
  value, 
  unit = '', 
  icon: Icon, 
  status = 'normal', // 'normal', 'warning', 'critical'
  subtitle = '',
  trend = null, // e.g. '+2.4%'
  department = null, // 'ME', 'CHE', 'EE'
  onClick = null
}) {
  const getStatusStyles = () => {
    switch (status) {
      case 'critical':
        return {
          border: 'border-rose-500/40 dark:border-rose-500/40',
          badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30',
          text: 'Trip / Alert',
          iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
        };
      case 'warning':
        return {
          border: 'border-amber-500/40 dark:border-amber-500/40',
          badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30',
          text: 'Warning',
          iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
        };
      default:
        return {
          border: 'border-slate-200 dark:border-slate-800',
          badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
          text: 'Nominal',
          iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        };
    }
  };

  const statusStyle = getStatusStyles();

  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl bg-white dark:bg-[#182740] p-4 border ${statusStyle.border} shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-blue-400' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
              {title}
            </span>
            {department && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-300 font-bold">
                {department}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {unit}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl ${statusStyle.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <span className="text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
          {subtitle}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle.badge}`}>
          {statusStyle.text}
        </span>
      </div>
    </div>
  );
}
