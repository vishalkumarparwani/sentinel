import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getIssues } from "../../api";
import DashboardCard from "./DashboardCard";
import UpcomingIssueCard from "./UpcomingIssues";
import Pomodoro from "./Pomodoro";

import {
  AlertTriangle,
  GitBranch,
  Boxes,
  Clock3,
  ArrowUpRight,
  Plus,
  BrainCircuit,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getIssues();
        setIssues(data);
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError("Failed to load dashboard data.");
      }
    }

    fetchData();
  }, []);

  const openIssues = issues.filter(
    (issue) => issue.status !== "done"
  );

  const criticalIssues = issues.filter(
    (issue) =>
      issue.severity === "P1" &&
      issue.status !== "done"
  );

  const servicesAffected = new Set(
    issues
      .map((issue) => issue.service)
      .filter(Boolean)
  ).size;

  /*
   * Accent colors intentionally use 500-level colors rather than
   * dark-only 950 backgrounds or very-light 200 text.
   *
   * This keeps them readable in both light and dark themes.
   */
  const stats = [
    {
      title: "Total Issues",
      value: issues.length,
      description: `${issues.length} tracked overall`,
      icon: GitBranch,
      iconStyle:
        "text-sky-500 bg-sky-500/10 border border-sky-500/20",
    },
    {
      title: "Critical Issues",
      value: criticalIssues.length,
      description: "Needing immediate attention",
      icon: AlertTriangle,
      iconStyle:
        "text-rose-500 bg-rose-500/10 border border-rose-500/20",
    },
    {
      title: "Open Issues",
      value: openIssues.length,
      description: "Not yet resolved",
      icon: Clock3,
      iconStyle:
        "text-amber-500 bg-amber-500/10 border border-amber-500/20",
    },
    {
      title: "Services Affected",
      value: servicesAffected,
      description: "Distinct services with issues",
      icon: Boxes,
      iconStyle:
        "text-violet-500 bg-violet-500/10 border border-violet-500/20",
    },
  ];

  const recentIssues = issues.slice(0, 4);

  const insightText =
    criticalIssues.length > 0
      ? `${criticalIssues.length} critical issue${
          criticalIssues.length > 1 ? "s" : ""
        } need attention. Check the Issues page to triage them.`
      : "No critical issues right now. Everything looks stable.";

  return (
    <div className="mx-auto mt-6 max-w-7xl space-y-8 px-8 xl:px-12">
      {/* ========================================================= */}
      {/* HEADER                                                    */}
      {/* ========================================================= */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-theme-text">
            Engineering Velocity Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-theme-muted">
            Monitor issue health, service risk, and engineering
            throughput across your product.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/issues")}
          className="flex items-center gap-2 rounded-xl bg-theme-text px-5 py-3 text-sm font-semibold text-theme-primary shadow-sm transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Report New Issue
        </button>
      </div>

      {/* ========================================================= */}
      {/* ERROR                                                     */}
      {/* ========================================================= */}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-2.5 text-xs text-rose-500">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* ========================================================= */}
      {/* ENGINEERING INSIGHT                                       */}
      {/* ========================================================= */}

      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-theme-secondary/50 p-5 sm:p-6">
        {/* Subtle accent glow */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative flex items-start gap-4">
          {/* Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-500">
            <BrainCircuit size={20} />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-theme-text">
                Engineering Insight
              </h3>

              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-indigo-500">
                <Sparkles className="h-2.5 w-2.5" />
                Sentinel AI
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-theme-muted">
              {insightText}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STATS                                                     */}
      {/* ========================================================= */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            iconStyle={stat.iconStyle}
          />
        ))}
      </div>

      {/* ========================================================= */}
      {/* MAIN CONTENT                                              */}
      {/* ========================================================= */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Issues */}
        <div className="rounded-2xl border border-theme-border bg-theme-secondary/30 p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-theme-border pb-5">
            <div>
              <h3 className="text-lg font-semibold text-theme-text">
                Recent Issues
              </h3>

              <p className="mt-1 text-xs text-theme-muted">
                Highest-severity issues currently open across your
                services.
              </p>
            </div>

            <Link
              to="/issues"
              className="flex items-center gap-1 text-xs font-medium text-theme-muted transition-colors hover:text-theme-text"
            >
              View all
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="mt-5 space-y-1 divide-y divide-theme-border/60">
            {recentIssues.length === 0 ? (
              <p className="py-6 text-center text-sm text-theme-muted">
                No issues reported yet.
              </p>
            ) : (
              recentIssues.map((issue) => (
                <UpcomingIssueCard
                  key={issue.id}
                  issue={issue}
                />
              ))
            )}
          </div>
        </div>

        {/* Pomodoro */}
        <div>
          <Pomodoro />
        </div>
      </div>
    </div>
  );
}