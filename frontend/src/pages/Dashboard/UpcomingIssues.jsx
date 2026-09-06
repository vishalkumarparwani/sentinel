import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const severityColor = {
  P1: "bg-rose-950/40 text-rose-300",
  P2: "bg-amber-950/40 text-amber-300",
  P3: "bg-indigo-950/40 text-indigo-300",
  P4: "bg-emerald-950/40 text-emerald-300",
};

const statusLabel = {
  planning: "Planning",
  in_progress: "In Progress",
  done: "Done",
};

export default function UpcomingIssueCard({ issue }) {
  const navigate = useNavigate();

  function handleOpen() {
    navigate("/issues", { state: { highlightId: issue.id } });
  }

  return (
    <div className="rounded-lg border border-theme-border/60 bg-theme-primary/30 p-4 hover:border-theme-text/30 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-theme-text">
            {issue.title}
          </h4>

          <p className="mt-1 text-xs text-theme-muted">
            {issue.service}
          </p>
        </div>

        <span
          className={`rounded-md px-2 py-1 text-[10px] font-medium ${
            severityColor[issue.severity] || severityColor.P3
          }`}
        >
          {issue.severity}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-md bg-theme-tertiary/60 px-2 py-1 text-[10px] font-medium text-theme-muted">
          {statusLabel[issue.status] || issue.status}
        </span>

        <button
          onClick={handleOpen}
          className="flex items-center gap-1 text-xs text-theme-muted hover:text-theme-text transition-colors"
        >
          Open
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}