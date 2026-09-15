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
        setError("Failed to load dashboard data.");
      }
    }
    fetchData();
  }, []);

  const total = issues.length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const newThisWeek = issues.filter((i) => new Date(i.created_at) >= weekAgo).length;

  const planning = issues.filter((i) => i.status === "planning").length;
  const inProgress = issues.filter((i) => i.status === "in_progress").length;
  const done = issues.filter((i) => i.status === "done").length;

  const openIssues = issues.filter((i) => i.status !== "done");
  const openCount = openIssues.length;
  const openPercent = total > 0 ? Math.round((openCount / total) * 100) : 0;

  const p1Open = openIssues.filter((i) => i.severity === "P1").length;
  const p2Open = openIssues.filter((i) => i.severity === "P2").length;
  const criticalUnresolved = p1Open + p2Open;

  const serviceNames = [...new Set(issues.map((i) => i.service))];
  const servicesAffected = serviceNames.length;

  const servicesWithCritical = serviceNames.filter((name) =>
    issues.some((i) => i.service === name && i.severity === "P1" && i.status !== "done")
  ).length;

  let mostAffected = null;
  let mostAffectedCount = 0;
  serviceNames.forEach((name) => {
    const count = issues.filter((i) => i.service === name).length;
    if (count > mostAffectedCount) {
      mostAffectedCount = count;
      mostAffected = name;
    }
  });

  const stats = [
    {
      title: "Total Issues",
      value: total,
      trend: newThisWeek > 0 ? { label: `+${newThisWeek} this week`, tone: "success" } : null,
      breakdown: `${planning} Planning · ${inProgress} In Progress · ${done} Done`,
      icon: GitBranch,
      iconStyle: "text-sky-400 bg-sky-950/50",
    },
    {
      title: "Critical Issues",
      value: criticalUnresolved,
      valueColor: criticalUnresolved > 0 ? "text-rose-400" : "text-theme-text",
      breakdown: `P1: ${p1Open} · P2: ${p2Open}`,
      icon: AlertTriangle,
      iconStyle: "text-rose-400 bg-rose-950/50",
    },
    {
      title: "Open Issues",
      value: openCount,
      trend: total > 0 ? { label: `${openPercent}% of all issues`, tone: "success" } : null,
      breakdown: `${planning} Planning · ${inProgress} In Progress`,
      icon: Clock3,
      iconStyle: "text-amber-400 bg-amber-950/50",
    },
    {
      title: "Services Affected",
      value: servicesAffected,
      breakdown:
        servicesWithCritical > 0
          ? `${servicesWithCritical} with critical issues${mostAffected ? ` · Most affected: ${mostAffected}` : ""}`
          : mostAffected
          ? `Most affected: ${mostAffected}`
          : "No services affected",
      icon: Boxes,
      iconStyle: "text-violet-400 bg-violet-950/50",
    },
  ];

  const recentIssues = issues.slice(0, 4);

  const insightText =
    criticalUnresolved > 0
      ? `${criticalUnresolved} critical issue${criticalUnresolved > 1 ? "s" : ""} need attention. Check the Issues page to triage them.`
      : "No critical issues right now. Everything looks stable.";

  return (
    <div className="mx-auto mt-6 max-w-7xl space-y-8 px-8 xl:px-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-theme-text">
            Engineering Velocity Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-theme-muted">
            Monitor issue health, service risk, and engineering throughput across your product.
          </p>
        </div>

        <button
          onClick={() => navigate("/issues")}
          className="flex items-center gap-2 rounded-xl bg-theme-text px-5 py-3 text-sm font-semibold text-theme-primary transition hover:opacity-90"
        >
          <Plus size={16} />
          Report New Issue
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 px-4 py-2.5 text-xs text-rose-400">
          {error}
        </div>
      )}

      <div className="flex items-start gap-4 rounded-2xl border border-indigo-900/40 bg-linear-to-r from-indigo-950/40 via-theme-secondary to-theme-secondary p-6">
        <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
          <BrainCircuit size={22} />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-indigo-200">
            Engineering Insight
          </h3>

          <p className="mt-1 text-sm leading-6 text-theme-muted">
            {insightText}
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            valueColor={stat.valueColor}
            trend={stat.trend}
            breakdown={stat.breakdown}
            icon={stat.icon}
            iconStyle={stat.iconStyle}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-theme-border bg-theme-secondary/30 p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-theme-border pb-5">
            <div>
              <h3 className="text-lg font-semibold text-theme-text">
                Recent Issues
              </h3>

              <p className="mt-1 text-xs text-theme-muted">
                Highest-severity issues currently open across your services.
              </p>
            </div>

            <Link
              to="/issues"
              className="flex items-center gap-1 text-xs font-medium text-theme-muted transition hover:text-theme-text"
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
                <UpcomingIssueCard key={issue.id} issue={issue} />
              ))
            )}
          </div>
        </div>

        <div>
          <Pomodoro />
        </div>
      </div>
    </div>
  );
}