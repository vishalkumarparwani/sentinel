import React from 'react';

export default function DashboardCard({ title, value, valueColor, icon: Icon, iconStyle, trend, breakdown }) {
  return (
    <div className="group rounded-2xl border border-theme-border bg-theme-secondary/30 p-5 transition-all duration-300 hover:border-theme-text/30 hover:bg-theme-secondary/50">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-theme-muted">
            {title}
          </p>

          <div className="flex items-baseline gap-2 pt-2">
            <h3 className={`text-3xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-0.5 ${valueColor || "text-theme-text"}`}>
              {value}
            </h3>

            {trend && (
              <span className={`text-[10px] font-semibold ${trend.tone === "danger" ? "text-rose-400" : "text-emerald-400"}`}>
                {trend.label}
              </span>
            )}
          </div>
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border ${iconStyle}`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-5 border-t border-theme-border/70 pt-4">
        <p className="text-xs leading-5 text-theme-muted">
          {breakdown}
        </p>
      </div>
    </div>
  );
}