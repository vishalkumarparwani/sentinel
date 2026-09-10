import React from "react";
import {
  Clock,
  CircleDot,
  CheckCircle2,
  Trash2,
  Pencil,
  ChevronRight,
  Calendar,
} from "lucide-react";

const statusConfig = {
  planning: {
    label: "Planning",
    color:
      "text-theme-muted border-theme-border bg-theme-tertiary/40 hover:bg-theme-tertiary/80",
  },
  in_progress: {
    label: "In Progress",
    color:
      "text-amber-600 border-amber-500/20 bg-amber-200/10 hover:bg-amber-500/20",
  },
  done: {
    label: "Done",
    color:
      "text-emerald-500 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20",
  },
};

const severityConfig = {
  P1: {
    label: "P1",
    color: "text-rose-400 border-rose-500/20 bg-rose-500/10",
  },
  P2: {
    label: "P2",
    color: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  },
  P3: {
    label: "P3",
    color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
  },
  P4: {
    label: "P4",
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  },
};

const statusIcons = {
  planning: CircleDot,
  in_progress: Clock,
  done: CheckCircle2,
};

export default function IssueRow({
  item,
  isHighlighted,
  onToggleStatus,
  onEdit,
  onDelete,
}) {
  const status = statusConfig[item.status] || statusConfig.planning;
  const StatusIcon = statusIcons[item.status] || CircleDot;

  const severity = severityConfig[item.severity] || severityConfig.P3;

  const stepsList = (item.reproduction_steps || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "ISS-${item.id}: ${item.title}"?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      onDelete();
    }
  }

  return (
    <div
      className={`group relative rounded-xl border p-4 transition-all duration-300 ${isHighlighted
        ? "border-amber-500/60 bg-amber-500/10 ring-1 ring-amber-500/40"
        : "border-theme-border/80 bg-theme-secondary/50 hover:border-theme-border hover:bg-theme-secondary/90"
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="wrap-anywhere text-[14px] font-semibold leading-snug tracking-tight text-theme-text">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 rounded-lg border border-theme-border bg-theme-primary/80 p-1">
            <button
              type="button"
              onClick={onEdit}
              title="Edit issue"
              aria-label="Edit issue"
              className="flex h-7 items-center gap-1.5 rounded-md px-2 text-theme-muted transition-colors hover:bg-theme-tertiary hover:text-theme-text focus:outline-none focus:ring-1 focus:ring-theme-border"
            >
              <Pencil size={12} />
              <span className="text-[11px] font-medium">Edit</span>
            </button>

            <div className="h-4 w-px bg-theme-border" />

            <button
              type="button"
              onClick={handleDelete}
              title="Delete issue"
              aria-label="Delete issue"
              className="flex h-7 items-center gap-1.5 rounded-md px-2 text-theme-muted transition-colors hover:bg-rose-500/10 hover:text-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-500/40"
            >
              <Trash2 size={12} />
              <span className="text-[11px] font-medium">Delete</span>
            </button>
          </div>

          <div className="relative shrink-0">
            <StatusIcon
              size={12}
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
            />

            <select
              value={item.status}
              onChange={(e) => onToggleStatus(e.target.value)}
              className={`appearance-none flex shrink-0 items-center rounded-md border py-1.5 pl-7 pr-7 font-mono text-[10px] font-medium transition-all ${status.color}`}
            >
              <option
                value="planning"
                className="bg-white text-yellow-600 dark:bg-gray-900 dark:text-yellow-400"
              >
                Planning
              </option>

              <option
                value="in_progress"
                className="bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-400"
              >
                In Progress
              </option>

              <option
                value="done"
                className="bg-white text-green-600 dark:bg-gray-900 dark:text-green-400"
              >
                Done
              </option>
            </select>

            <ChevronRight
              size={12}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-theme-muted"
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span className="cursor-pointer font-mono text-[11px] font-semibold text-theme-muted transition-colors hover:text-theme-text">
          ISS-{item.id}
        </span>

        <span className="select-none text-theme-border">•</span>

        {item.service && (
          <span className="wrap-anywhere rounded-md border border-theme-border/40 bg-theme-tertiary/50 px-2 py-0.5 font-mono text-xs font-medium text-theme-muted">
            {item.service}
          </span>
        )}

        <span
          className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${severity.color}`}
        >
          {severity.label}
        </span>

        {item.due_date && (
          <span className="inline-flex items-center gap-1 rounded-md border border-theme-border/40 bg-theme-tertiary/50 px-2 py-0.5 font-mono text-[10px] text-theme-muted">
            <Calendar size={10} />
            {item.due_date}
          </span>
        )}
      </div>

      {stepsList.length > 0 && (
        <div className="mt-3.5 border-t border-theme-border/50 pt-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-theme-muted">
            <span>Reproduction Steps</span>
          </div>

          <ul className="mt-2 space-y-1.5">
            {stepsList.map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs leading-relaxed text-theme-muted"
              >
                <ChevronRight
                  size={12}
                  className="mt-0.5 shrink-0 text-theme-muted"
                />
                <span className="wrap-anywhere">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}