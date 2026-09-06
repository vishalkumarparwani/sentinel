import React, { useEffect, useState } from "react";
import { getServices, deleteIssue } from "../../api";
import {
  Search,
  ArrowRight,
  Layers,
  X,
  Trash2,
} from "lucide-react";

function getStatus(critical, open) {
  if (critical > 0) {
    return {
      label: "Critical",
      color:
        "bg-rose-500/10 text-rose-400 border-rose-500/20",
    };
  }

  if (open > 0) {
    return {
      label: "Degraded",
      color:
        "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
  }

  return {
    label: "Healthy",
    color:
      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };
}

const severityColor = {
  P1: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  P2: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  P3: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  P4: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

function riskScore(issues) {
  const critical = issues.filter((i) => i.severity === "P1").length;
  const open = issues.filter((i) => i.status !== "done").length;

  return critical * 1000 + open;
}

export default function Services() {
  const [services, setServices] = useState({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError("Failed to load services. Please refresh.");
      }
    }

    fetchData();
  }, []);

  function openPanel(name) {
    setSelected(name);
    setFilter("all");

    requestAnimationFrame(() => setPanelVisible(true));
  }

  function closePanel() {
    setPanelVisible(false);

    setTimeout(() => setSelected(null), 300);
  }

  async function handleDeleteIssue(issueId) {
    const issue = selectedIssues.find((i) => i.id === issueId);

    const confirmed = window.confirm(
      `Delete "${issue?.title || `ISS-${issueId}`}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteIssue(issueId);

      setServices((prev) => {
        const updated = { ...prev };

        updated[selected] = updated[selected].filter(
          (i) => i.id !== issueId
        );

        if (updated[selected].length === 0) {
          delete updated[selected];
        }

        return updated;
      });
    } catch (err) {
      setError("Failed to delete issue. Please try again.");
    }
  }

  const serviceNames = Object.keys(services)
    .filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    )
    .sort(
      (a, b) =>
        riskScore(services[b]) - riskScore(services[a])
    );

  const selectedIssues =
    selected && services[selected]
      ? services[selected]
      : [];

  const filteredIssues =
    filter === "open"
      ? selectedIssues.filter((i) => i.status !== "done")
      : filter === "p1"
      ? selectedIssues.filter((i) => i.severity === "P1")
      : selectedIssues;

  return (
    <div className="mx-auto mt-6 max-w-7xl space-y-8 px-8 xl:px-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-theme-text sm:text-3xl">
            Services Overview
          </h1>

          <p className="mt-1 text-sm text-theme-muted">
            Health and status grouped by issue domain.
          </p>
        </div>

        <div className="relative w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
          />

          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-theme-border/80 bg-theme-secondary/60 py-2 pl-9 pr-3 text-xs text-theme-text placeholder-theme-muted outline-none transition-all focus:border-theme-border focus:bg-theme-secondary"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center rounded-lg border border-rose-500/20 bg-theme-secondary px-4 py-2.5 text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* Services */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {serviceNames.length === 0 ? (
          <div className="col-span-full rounded-xl border border-theme-border/80 bg-theme-secondary/30 py-12 text-center text-sm text-theme-muted">
            No services found.
          </div>
        ) : (
          serviceNames.map((name) => {
            const issues = services[name];

            const critical = issues.filter(
              (i) => i.severity === "P1"
            ).length;

            const open = issues.filter(
              (i) => i.status !== "done"
            ).length;

            const status = getStatus(critical, open);

            const barWidth =
              issues.length > 0
                ? Math.round((open / issues.length) * 100)
                : 0;

            const barColor =
              critical > 0
                ? "bg-rose-500"
                : open > 0
                ? "bg-amber-500"
                : "bg-emerald-500";

            return (
              <button
                key={name}
                onClick={() => openPanel(name)}
                className="space-y-4 rounded-xl border border-theme-border/80 bg-theme-secondary/50 p-5 text-left transition-all duration-200 hover:border-theme-border hover:bg-theme-secondary/90"
              >
                {/* Service Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
                      <Layers size={14} />
                    </div>

                    <span className="truncate text-sm font-semibold text-theme-text">
                      {name}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-theme-muted">
                      Open Issues
                    </p>

                    <p className="mt-1 text-lg font-semibold text-theme-text">
                      {open}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-theme-muted">
                      Critical (P1)
                    </p>

                    <p
                      className={`mt-1 text-lg font-semibold ${
                        critical > 0
                          ? "text-rose-400"
                          : "text-theme-text"
                      }`}
                    >
                      {critical}
                    </p>
                  </div>
                </div>

                {/* Severity Breakdown */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-[10px] text-theme-muted">
                    <span>Severity Breakdown</span>
                    <span>{open} Active</span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-theme-tertiary">
                    <div
                      className={`h-full rounded-full ${barColor}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 text-xs text-amber-400">
                  <span>View full telemetry</span>
                  <ArrowRight size={12} />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Service Drawer */}
      {selected !== null && (
        <div
          className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
            panelVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={closePanel}
        >
          <div
            className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-theme-border bg-theme-primary p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
              panelVisible
                ? "translate-x-0"
                : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-theme-border pb-4">
              <div className="flex min-w-0 items-center gap-2">
                <Layers
                  size={16}
                  className="shrink-0 text-amber-400"
                />

                <h2 className="truncate text-sm font-semibold text-theme-text">
                  {selected}
                </h2>
              </div>

              <button
                type="button"
                onClick={closePanel}
                aria-label="Close service panel"
                className="rounded-md p-1.5 text-theme-muted transition-colors hover:bg-theme-secondary hover:text-theme-text"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 border-b border-theme-border py-4 text-xs">
              <div>
                <p className="text-theme-muted">
                  Total Tracked
                </p>

                <p className="mt-1 text-base font-semibold text-theme-text">
                  {selectedIssues.length}
                </p>
              </div>

              <div>
                <p className="text-theme-muted">
                  Open Issues
                </p>

                <p className="mt-1 text-base font-semibold text-theme-text">
                  {
                    selectedIssues.filter(
                      (i) => i.status !== "done"
                    ).length
                  }
                </p>
              </div>

              <div>
                <p className="text-theme-muted">
                  P1 Critical
                </p>

                <p className="mt-1 text-base font-semibold text-rose-400">
                  {
                    selectedIssues.filter(
                      (i) => i.severity === "P1"
                    ).length
                  }
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 py-3">
              {[
                { key: "all", label: "All" },
                { key: "open", label: "Open Only" },
                { key: "p1", label: "P1 Only" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === tab.key
                      ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "text-theme-muted hover:bg-theme-secondary hover:text-theme-text"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Issues */}
            <div className="flex-1 space-y-2 overflow-y-auto">
              {filteredIssues.length === 0 ? (
                <p className="py-8 text-center text-xs text-theme-muted">
                  No issues match this filter.
                </p>
              ) : (
                filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="space-y-1 rounded-lg border border-theme-border bg-theme-secondary/60 p-3 transition-colors hover:bg-theme-secondary"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-theme-muted">
                          #{issue.id}
                        </span>

                        <span
                          className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${
                            severityColor[issue.severity] ||
                            severityColor.P3
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-theme-muted">
                          {issue.status}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteIssue(issue.id)
                          }
                          title="Delete issue"
                          aria-label="Delete issue"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-theme-muted transition-colors hover:bg-rose-500/10 hover:text-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-500/40"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="wrap-anywhere text-sm text-theme-text">
                      {issue.title}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}