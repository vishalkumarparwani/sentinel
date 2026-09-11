import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIssue, runTriage } from "../../api";
import {
  Sparkles, AlertTriangle, Check, ArrowRight, Terminal, Layers,
  ShieldAlert, RotateCcw, XCircle, Pencil, Save, Brain, ChevronDown,
} from "lucide-react";

const severityStyles = {
  P1: "text-rose-400 border-rose-500/20 bg-rose-500/10",
  P2: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  P3: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
  P4: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
};

const defaultIssue = { title: "", description: "", service: "", severity: "P3", reproduction_steps: [] };

function normalizeSteps(steps) {
  if (Array.isArray(steps)) return steps.filter(Boolean).map((s) => String(s).trim());
  if (typeof steps === "string") return steps.split("\n").map((s) => s.trim()).filter(Boolean);
  return [];
}

function normalizeIssue(data) {
  return {
    ...defaultIssue,
    ...data,
    title: data?.title || "",
    description: data?.description || "",
    service: data?.service || "",
    severity: data?.severity || "P3",
    reproduction_steps: normalizeSteps(data?.reproduction_steps),
  };
}

export default function Triage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState(null);
  const [editedIssue, setEditedIssue] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleRunTriage() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setSaved(false);
    setError(null);
    setIssue(null);
    setEditedIssue(null);
    setIsEditing(false);

    try {
      const result = await runTriage(text);
      const normalized = normalizeIssue(result);
      setIssue(normalized);
      setEditedIssue(normalized);
    } catch (err) {
      setError(err?.message || "Failed to parse issue log. Please check the input and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setText("");
    setIssue(null);
    setEditedIssue(null);
    setSaved(false);
    setError(null);
    setIsEditing(false);
  }

  function handleEdit() {
    if (!issue) return;
    setEditedIssue(normalizeIssue(issue));
    setIsEditing(true);
    setSaved(false);
  }

  function handleCancelEdit() {
    setEditedIssue(normalizeIssue(issue));
    setIsEditing(false);
  }

  function handleSaveEdit() {
    if (!editedIssue?.title?.trim()) {
      setError("Issue title cannot be empty.");
      return;
    }
    setError(null);
    setIssue(normalizeIssue(editedIssue));
    setIsEditing(false);
  }

  function updateField(field, value) {
    setEditedIssue((prev) => ({ ...prev, [field]: value }));
  }

  function updateStep(index, value) {
    setEditedIssue((prev) => {
      const steps = [...prev.reproduction_steps];
      steps[index] = value;
      return { ...prev, reproduction_steps: steps };
    });
  }

  function addStep() {
    setEditedIssue((prev) => ({ ...prev, reproduction_steps: [...prev.reproduction_steps, ""] }));
  }

  function removeStep(index) {
    setEditedIssue((prev) => ({
      ...prev,
      reproduction_steps: prev.reproduction_steps.filter((_, i) => i !== index),
    }));
  }

  async function handleCreateIssue() {
    if (!issue?.title?.trim()) {
      setError("Issue title is required.");
      return;
    }
    try {
      setError(null);
      const payload = {
        ...issue,
        title: issue.title.trim(),
        description: issue.description?.trim() || "",
        service: issue.service?.trim() || "",
        reproduction_steps: normalizeSteps(issue.reproduction_steps).join("\n"),
        severity: issue.severity || "P3",
        status: issue.status || "planning",
        due_date: issue.due_date || null,
      };
      await createIssue(payload);
      setSaved(true);
    } catch (err) {
      setError("Failed to save issue. Please try again.");
    }
  }

  const noIssueFound = issue?.title === "No issue reported";
  const steps = normalizeSteps(issue?.reproduction_steps);
  const confidence = typeof issue?.ai_confidence === "number" ? Math.round(issue.ai_confidence * 100) : null;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-theme-text">AI Issue Triage</h1>
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-400">
            LLM PARSER v1.0
          </span>
        </div>
        <p className="mt-1 max-w-3xl text-xs text-theme-muted">
          Paste raw bug reports, Slack logs, or customer emails to extract structured, actionable issues.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-xs text-rose-400">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-0.5 text-rose-400/80">{error}</p>
          </div>
          <button type="button" onClick={() => setError(null)} className="ml-auto shrink-0 rounded-md p-1 text-rose-400/70 hover:bg-rose-500/10 hover:text-rose-400" aria-label="Dismiss error">
            <XCircle className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col justify-between space-y-4 rounded-xl border border-theme-border/80 bg-theme-secondary/60 p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-theme-text">
                <Terminal className="h-4 w-4 text-theme-muted" />
                Raw Bug Log / Customer Ticket
              </label>
              {text.trim() && <span className="text-[10px] text-theme-muted">{text.length.toLocaleString()} characters</span>}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a raw error message, stack trace, customer report, or bug description here..."
              rows={14}
              disabled={loading}
              className="w-full resize-none rounded-lg border border-theme-border/80 bg-theme-primary p-3 font-mono text-xs leading-relaxed text-theme-text placeholder-theme-muted outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 disabled:opacity-60"
            />
            <div className="flex items-start gap-2 rounded-lg border border-theme-border/60 bg-theme-primary/40 px-3 py-2.5">
              <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
              <p className="text-[10px] leading-relaxed text-theme-muted">
                Sentinel will extract the issue title, description, service, severity, and reproduction steps. You can review and edit the result before creating the issue.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-theme-border/60 pt-3">
            <button type="button" onClick={handleReset} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-theme-muted hover:bg-theme-tertiary hover:text-theme-text">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
            <button type="button" onClick={handleRunTriage} disabled={loading || !text.trim()} className="flex items-center gap-2 rounded-lg bg-theme-text px-4 py-2 text-xs font-semibold text-theme-primary shadow-sm hover:opacity-90 disabled:opacity-40">
              <Sparkles className={`h-4 w-4 text-amber-500 ${loading ? "animate-spin" : "fill-amber-500"}`} />
              <span>{loading ? "Parsing Log..." : "Run AI Triage"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-theme-border/80 bg-theme-secondary/60 p-5">
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-theme-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-semibold text-theme-text">Structured Issue Preview</span>
              </div>
              {issue && !loading && !noIssueFound && (
                <div className="flex items-center gap-2">
                  <span className="hidden rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-mono text-amber-400 sm:inline-flex">
                    AI GENERATED
                  </span>
                  {!isEditing && (
                    <button type="button" onClick={handleEdit} className="flex items-center gap-1.5 rounded-md border border-theme-border bg-theme-primary px-2.5 py-1.5 text-[11px] font-medium text-theme-muted hover:bg-theme-tertiary hover:text-theme-text">
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>

            {!issue && !loading && !error && (
              <div className="flex h-72 flex-col items-center justify-center space-y-2 p-6 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-theme-border bg-theme-tertiary/50 text-theme-muted">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-theme-text">No Issue Extracted Yet</p>
                <p className="max-w-xs text-[11px] leading-relaxed text-theme-muted">
                  Paste a bug report on the left and click "Run AI Triage" to analyze it.
                </p>
              </div>
            )}

            {error && !issue && !loading && (
              <div className="flex h-72 flex-col items-center justify-center space-y-2 p-6 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
                  <XCircle className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-rose-400">Triage Failed</p>
                <p className="max-w-xs text-[11px] leading-relaxed text-theme-muted">Check your input and try running the triage again.</p>
              </div>
            )}

            {loading && (
              <div className="flex h-72 flex-col items-center justify-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                  <Sparkles className="h-6 w-6 animate-pulse text-amber-400" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-theme-text">Analyzing issue</p>
                  <p className="mt-1 font-mono text-[10px] text-theme-muted">Extracting structured issue details...</p>
                </div>
              </div>
            )}

            {issue && !loading && noIssueFound && (
              <div className="flex h-72 flex-col items-center justify-center space-y-2 p-6 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-theme-tertiary/50 text-theme-muted">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-theme-text">No Issue Detected</p>
                <p className="max-w-xs text-[11px] leading-relaxed text-theme-muted">
                  This text doesn't appear to describe a bug or problem. Try providing a more specific issue report.
                </p>
              </div>
            )}

            {issue && !loading && !noIssueFound && isEditing && editedIssue && (
              <div className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-theme-muted">Issue Title</label>
                  <input
                    type="text"
                    value={editedIssue.title || ""}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full rounded-lg border border-theme-border bg-theme-primary px-3 py-2 text-sm font-semibold text-theme-text outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/10"
                    placeholder="Issue title"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-theme-muted">Description</label>
                  <textarea
                    rows={3}
                    value={editedIssue.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="w-full resize-y rounded-lg border border-theme-border bg-theme-primary px-3 py-2 text-xs leading-relaxed text-theme-text outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/10"
                    placeholder="Describe the issue..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-theme-muted">Service</label>
                    <input
                      type="text"
                      value={editedIssue.service || ""}
                      onChange={(e) => updateField("service", e.target.value)}
                      className="w-full rounded-lg border border-theme-border bg-theme-primary px-3 py-2 text-xs text-theme-text outline-none focus:border-sky-500/50"
                      placeholder="Service"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-theme-muted">Severity</label>
                    <div className="relative">
                      <select
                        value={editedIssue.severity || "P3"}
                        onChange={(e) => updateField("severity", e.target.value)}
                        className="w-full appearance-none rounded-lg border border-theme-border bg-theme-primary px-3 py-2 pr-8 text-xs text-theme-text outline-none focus:border-sky-500/50"
                      >
                        <option value="P1">P1 - Critical</option>
                        <option value="P2">P2 - High</option>
                        <option value="P3">P3 - Medium</option>
                        <option value="P4">P4 - Low</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-theme-muted" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-theme-muted">Reproduction Steps</label>
                    <button type="button" onClick={addStep} className="text-[10px] font-medium text-sky-400 hover:text-sky-300">+ Add step</button>
                  </div>
                  <div className="space-y-2">
                    {editedIssue.reproduction_steps.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-theme-border px-3 py-4 text-center text-[11px] text-theme-muted">No reproduction steps.</div>
                    ) : (
                      editedIssue.reproduction_steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-5 shrink-0 text-center font-mono text-[10px] text-theme-muted">{index + 1}.</span>
                          <input
                            type="text"
                            value={step || ""}
                            onChange={(e) => updateStep(index, e.target.value)}
                            className="min-w-0 flex-1 rounded-lg border border-theme-border bg-theme-primary px-3 py-2 text-xs text-theme-text outline-none focus:border-sky-500/50"
                            placeholder={`Step ${index + 1}`}
                          />
                          <button type="button" onClick={() => removeStep(index)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-theme-muted hover:bg-rose-500/10 hover:text-rose-400" aria-label={`Remove step ${index + 1}`}>
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-theme-border/60 pt-3">
                  <button type="button" onClick={handleCancelEdit} className="rounded-lg px-3 py-1.5 text-xs font-medium text-theme-muted hover:bg-theme-tertiary hover:text-theme-text">Cancel</button>
                  <button type="button" onClick={handleSaveEdit} className="flex items-center gap-1.5 rounded-lg bg-theme-text px-3.5 py-1.5 text-xs font-semibold text-theme-primary hover:opacity-90">
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {issue && !loading && !noIssueFound && !isEditing && (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {issue.severity && (
                    <span className={`flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${severityStyles[issue.severity] || "border-theme-border bg-theme-tertiary text-theme-muted"}`}>
                      <AlertTriangle className="h-3 w-3" />
                      Severity {issue.severity}
                    </span>
                  )}
                  {issue.service && (
                    <span className="rounded border border-theme-border bg-theme-tertiary/60 px-2 py-0.5 font-mono text-[10px] text-theme-muted">{issue.service}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="wrap-anywhere text-sm font-bold leading-snug text-theme-text">{issue.title || "Untitled Issue"}</h3>
                  {confidence !== null && (
                    <span className="text-[10px] text-theme-muted">
                      AI confidence: <span className="font-semibold text-emerald-500">{confidence}%</span>
                    </span>
                  )}
                </div>

                {issue.ai_summary && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-theme-muted">AI Summary</span>
                    <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-theme-muted">{issue.ai_summary}</p>
                  </div>
                )}

                {issue.description && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-theme-muted">Description</span>
                    <p className="rounded-lg border border-theme-border/60 bg-theme-primary/40 p-3 text-xs leading-relaxed text-theme-muted">{issue.description}</p>
                  </div>
                )}

                {issue.ai_severity_reason && (
                  <details className="group rounded-lg border border-theme-border/60 bg-theme-primary/30">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-[10px] font-semibold text-theme-muted hover:text-theme-text">
                      <span className="flex items-center gap-1.5">
                        <Brain className="h-3.5 w-3.5 text-amber-400" />
                        Why this severity?
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="border-t border-theme-border/60 px-3 py-3">
                      <p className="text-[10px] leading-relaxed text-theme-muted">{issue.ai_severity_reason}</p>
                    </div>
                  </details>
                )}

                {steps.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-theme-muted">Reproduction Steps</span>
                    <ul className="space-y-1.5">
                      {steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs leading-relaxed text-theme-muted">
                          <span className="mt-0.5 w-4 shrink-0 text-right font-mono text-[10px] text-theme-muted">{index + 1}.</span>
                          <span className="wrap-anywhere">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {issue && !loading && !noIssueFound && !isEditing && (
            <div className="mt-6 flex flex-col gap-3 border-t border-theme-border/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {saved ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-500">
                    <Check className="h-3.5 w-3.5" />
                    Issue created successfully.
                  </div>
                ) : (
                  <p className="text-[10px] text-theme-muted">Review the AI output before creating the issue.</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {saved ? (
                  <button type="button" onClick={() => navigate("/issues")} className="flex items-center gap-1.5 rounded-lg border border-theme-border bg-theme-primary px-3.5 py-2 text-xs font-semibold text-theme-text hover:bg-theme-tertiary">
                    View Issues
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={handleEdit} className="flex items-center gap-1.5 rounded-lg border border-theme-border bg-theme-primary px-3.5 py-2 text-xs font-medium text-theme-muted hover:bg-theme-tertiary hover:text-theme-text">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Issue
                    </button>
                    <button type="button" onClick={handleCreateIssue} className="flex items-center gap-1.5 rounded-lg bg-theme-text px-3.5 py-2 text-xs font-semibold text-theme-primary hover:opacity-90">
                      <Check className="h-3.5 w-3.5" />
                      Create Issue
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}