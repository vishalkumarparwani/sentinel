import React from 'react';

export default function DashboardCard(props) {
  const Icon = props.icon;

  return (
    <div className="group rounded-2xl border border-theme-border bg-theme-secondary/30 p-5 transition-all duration-300 hover:border-theme-text/30 hover:bg-theme-secondary/50">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-theme-muted">
            {props.title}
          </p>

          <h3 className="pt-2 text-3xl font-bold tracking-tight text-theme-text transition-transform duration-300 group-hover:translate-x-0.5">
            {props.value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border ${props.iconStyle}`}
        >
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-5 border-t border-theme-border/70 pt-4">
        <p className="text-xs leading-5 text-theme-muted">
          {props.description}
        </p>
      </div>
    </div>
  );
}