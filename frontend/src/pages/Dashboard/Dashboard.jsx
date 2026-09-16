import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getIssues } from "../../api";
import DashboardCard from "./DashboardCard";
import UpcomingIssueCard from "./UpcomingIssues";

import {
  AlertTriangle,
  GitBranch,
  Boxes,
  Clock3,
  ArrowUpRight,
  Plus,
  BrainCircuit,
  ShieldAlert,
  CheckCircle2,
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

  // --------------------------------------------------
  // Issue Statistics
  // --------------------------------------------------

  const total = issues.length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const newThisWeek = issues.filter(
    (i) => new Date(i.created_at) >= weekAgo
  ).length;

  const planning = issues.filter(
    (i) => i.status === "planning"
  ).length;

  const inProgress = issues.filter(
    (i) => i.status === "in_progress"
  ).length;

  const done = issues.filter(
    (i) => i.status === "done"
  ).length;

  const openIssues = issues.filter(
    (i) => i.status !== "done"
  );

  const openCount = openIssues.length;

  const openPercent =
    total > 0
      ? Math.round((openCount / total) * 100)
      : 0;

  const p1Open = openIssues.filter(
    (i) => i.severity === "P1"
  ).length;

  const p2Open = openIssues.filter(
    (i) => i.severity === "P2"
  ).length;

  const criticalUnresolved = p1Open + p2Open;

  // --------------------------------------------------
  // Services
  // --------------------------------------------------

  const serviceNames = [
    ...new Set(
      issues
        .map((i) => i.service)
        .filter(Boolean)
    ),
  ];

  const servicesAffected = serviceNames.length;

  const servicesWithCritical = serviceNames.filter(
    (name) =>
      issues.some(
        (i) =>
          i.service === name &&
          i.severity === "P1" &&
          i.status !== "done"
      )
  ).length;

  let mostAffected = null;
  let mostAffectedCount = 0;

  serviceNames.forEach((name) => {
    const count = issues.filter(
      (i) => i.service === name
    ).length;

    if (count > mostAffectedCount) {
      mostAffectedCount = count;
      mostAffected = name;
    }
  });

  // --------------------------------------------------
  // Dashboard Cards
  // --------------------------------------------------

  const stats = [
    {
      title: "Total Issues",
      value: total,
      trend:
        newThisWeek > 0
          ? {
              label: `+${newThisWeek} this week`,
              tone: "success",
            }
          : null,
      breakdown: `${planning} Planning · ${inProgress} In Progress · ${done} Done`,
      icon: GitBranch,

      // Theme-neutral background works in both themes.
      iconStyle:
        "text-sky-500 bg-theme-tertiary border border-theme-border",
    },

    {
      title: "Critical Issues",
      value: criticalUnresolved,

      valueColor:
        criticalUnresolved > 0
          ? "text-rose-500"
          : "text-theme-text",

      breakdown: `P1: ${p1Open} · P2: ${p2Open}`,
      icon: AlertTriangle,

      iconStyle:
        "text-rose-500 bg-theme-tertiary border border-theme-border",
    },

    {
      title: "Open Issues",
      value: openCount,

      trend:
        total > 0
          ? {
              label: `${openPercent}% of all issues`,
              tone: "success",
            }
          : null,

      breakdown: `${planning} Planning · ${inProgress} In Progress`,
      icon: Clock3,

      iconStyle:
        "text-amber-500 bg-theme-tertiary border border-theme-border",
    },

    {
      title: "Services Affected",
      value: servicesAffected,

      breakdown:
        servicesWithCritical > 0
          ? `${servicesWithCritical} with critical issues${
              mostAffected
                ? ` · Most affected: ${mostAffected}`
                : ""
            }`
          : mostAffected
          ? `Most affected: ${mostAffected}`
          : "No services affected",

      icon: Boxes,

      iconStyle:
        "text-violet-500 bg-theme-tertiary border border-theme-border",
    },
  ];

  // --------------------------------------------------
  // Recent Issues
  // --------------------------------------------------

  const severityWeight = {
    P1: 1,
    P2: 2,
    P3: 3,
    P4: 4,
  };

  const recentIssues = [...issues]
    .sort((a, b) => {
      // Open issues first
      if (a.status === "done" && b.status !== "done") {
        return 1;
      }

      if (a.status !== "done" && b.status === "done") {
        return -1;
      }

      // Then severity
      const severityA =
        severityWeight[a.severity] || 99;

      const severityB =
        severityWeight[b.severity] || 99;

      if (severityA !== severityB) {
        return severityA - severityB;
      }

      // Finally newest
      return (
        new Date(b.created_at) -
        new Date(a.created_at)
      );
    })
    .slice(0, 4);

  // --------------------------------------------------
  // Engineering Insight
  // --------------------------------------------------

  const insightText =
    criticalUnresolved > 0
      ? `${criticalUnresolved} critical issue${
          criticalUnresolved > 1 ? "s" : ""
        } need attention. Review the Issues page to triage them.`
      : openCount > 0
      ? `${openCount} open issue${
          openCount > 1 ? "s" : ""
        } currently require attention across ${
          servicesAffected
        } service${
          servicesAffected !== 1 ? "s" : ""
        }.`
      : "No open issues right now. Your engineering backlog is clear.";

  // --------------------------------------------------
  // Engineering Risk
  // --------------------------------------------------

  let riskLevel = "Low";
  let riskDescription =
    "No significant unresolved issue risk detected.";

  if (p1Open > 0) {
    riskLevel = "High";
    riskDescription =
      "Critical issues are currently unresolved and require attention.";
  } else if (p2Open > 0 || openCount >= 5) {
    riskLevel = "Moderate";
    riskDescription =
      "Several unresolved issues may require engineering attention.";
  }

  const riskColor =
    riskLevel === "High"
      ? "text-rose-500"
      : riskLevel === "Moderate"
      ? "text-amber-500"
      : "text-emerald-500";

  const riskIcon =
    riskLevel === "High"
      ? ShieldAlert
      : riskLevel === "Moderate"
      ? AlertTriangle
      : CheckCircle2;

  const RiskIcon = riskIcon;

  // --------------------------------------------------
  // Most Affected Services
  // --------------------------------------------------

  const serviceRisk = serviceNames
    .map((name) => {
      const serviceIssues = issues.filter(
        (i) =>
          i.service === name &&
          i.status !== "done"
      );

      const p1 = serviceIssues.filter(
        (i) => i.severity === "P1"
      ).length;

      const p2 = serviceIssues.filter(
        (i) => i.severity === "P2"
      ).length;

      const risk =
        p1 > 0
          ? "High"
          : p2 > 0 || serviceIssues.length >= 3
          ? "Moderate"
          : "Low";

      return {
        name,
        openCount: serviceIssues.length,
        risk,
      };
    })
    .filter((service) => service.openCount > 0)
    .sort((a, b) => {
      const riskWeight = {
        High: 1,
        Moderate: 2,
        Low: 3,
      };

      return (
        riskWeight[a.risk] -
        riskWeight[b.risk]
      );
    })
    .slice(0, 3);

  return (
    <div className="mx-auto mt-6 max-w-7xl space-y-8 px-8 xl:px-12">

      {/* ------------------------------------------------
          Header
      ------------------------------------------------ */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-theme-text">
            Engineering Overview
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

      {/* ------------------------------------------------
          Error
      ------------------------------------------------ */}

      {error && (
        <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 px-4 py-2.5 text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* ------------------------------------------------
          AI Engineering Insight
      ------------------------------------------------ */}

      <div className="flex items-start gap-4 rounded-2xl border border-theme-border bg-theme-secondary/50 p-6 shadow-sm">
        <div className="shrink-0 rounded-xl border border-theme-border bg-theme-tertiary p-3 text-indigo-500">
          <BrainCircuit size={22} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-theme-text">
              Engineering Insight
            </h3>

            <span className="rounded-md border border-theme-border bg-theme-tertiary px-1.5 py-0.5 text-[10px] font-medium text-theme-muted">
              AI
            </span>
          </div>

          <p className="mt-1 text-sm leading-6 text-theme-muted">
            {insightText}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------
          Statistics
      ------------------------------------------------ */}

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

      {/* ------------------------------------------------
          Recent Issues + Engineering Risk
      ------------------------------------------------ */}

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-2xl border border-theme-border bg-theme-secondary/30 p-6 lg:col-span-2">

          <div className="flex items-center justify-between border-b border-theme-border pb-5">
            <div>
              <h3 className="text-lg font-semibold text-theme-text">
                Recent Issues
              </h3>

              <p className="mt-1 text-xs text-theme-muted">
                Highest-priority unresolved issues across your services.
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
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-500" />

                <p className="mt-3 text-sm font-medium text-theme-text">
                  No issues reported yet.
                </p>

                <p className="mt-1 text-xs text-theme-muted">
                  New engineering issues will appear here.
                </p>
              </div>
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

                  {/* Engineering Risk */}

        <div className="rounded-2xl border border-theme-border bg-theme-secondary/30 p-6">

          <div className="flex items-center justify-between border-b border-theme-border pb-5">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg border border-theme-border bg-theme-tertiary p-2">
                <RiskIcon
                  className={`h-4 w-4 ${riskColor}`}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-theme-text">
                  Engineering Risk
                </h3>

                <p className="mt-0.5 text-[11px] text-theme-muted">
                  Current issue health
                </p>
              </div>
            </div>

            <span
              className={`rounded-md border border-theme-border bg-theme-tertiary px-2 py-1 text-[10px] font-medium ${riskColor}`}
            >
              {riskLevel}
            </span>
          </div>

          {/* Risk summary */}

          <div className="py-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-theme-muted">
                  Open issues
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-theme-text">
                  {openCount}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-theme-muted">
                  Critical
                </p>

                <p
                  className={`mt-1 text-xl font-semibold ${
                    criticalUnresolved > 0
                      ? "text-rose-500"
                      : "text-theme-text"
                  }`}
                >
                  {criticalUnresolved}
                </p>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-theme-tertiary">
              <div
                className={`h-full rounded-full ${
                  riskLevel === "High"
                    ? "w-full bg-rose-500"
                    : riskLevel === "Moderate"
                    ? "w-2/3 bg-amber-500"
                    : "w-1/3 bg-emerald-500"
                }`}
              />
            </div>

            <p className="mt-4 text-xs leading-5 text-theme-muted">
              {riskDescription}
            </p>
          </div>

          {/* Services */}

          <div className="border-t border-theme-border pt-5">

            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-theme-text">
                Service Risk
              </h4>

              <span className="text-[10px] text-theme-muted">
                {servicesAffected} total
              </span>
            </div>

            <div className="mt-4 space-y-3">

              {serviceRisk.length === 0 ? (
                <div className="rounded-lg border border-theme-border bg-theme-primary/40 px-3 py-4 text-center">
                  <p className="text-xs text-theme-muted">
                    No active service risks.
                  </p>
                </div>
              ) : (
                serviceRisk.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-theme-text">
                        {service.name}
                      </p>

                      <p className="mt-0.5 text-[10px] text-theme-muted">
                        {service.openCount} open{" "}
                        {service.openCount === 1
                          ? "issue"
                          : "issues"}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-medium ${
                        service.risk === "High"
                          ? "text-rose-500"
                          : service.risk === "Moderate"
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {service.risk}
                    </span>
                  </div>
                ))
              )}

            </div>
          </div>

          <Link
            to="/issues"
            className="mt-6 flex items-center justify-between border-t border-theme-border pt-4 text-xs font-medium text-theme-muted transition hover:text-theme-text"
          >
            <span>Review engineering issues</span>
            <ArrowUpRight size={13} />
          </Link>

        </div>
      </div>
    </div>
  );
}