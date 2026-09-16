import React, { useState, useEffect } from "react";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";

export default function Pomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [goal, setGoal] = useState("");

  function handleStart() {
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setMinutes(25);
    setSeconds(0);
    setIsRunning(false);
  }

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      } else if (minutes > 0) {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
      } else {
        setIsRunning(false);
        setCompletedSessions((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, minutes, seconds]);

  const totalFocusMinutes = completedSessions * 25;
  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusMinutesRemainder = totalFocusMinutes % 60;

  return (
    <div className="rounded-2xl border border-theme-border/80 bg-theme-secondary/30 p-6">
      <div className="flex items-center justify-between border-b border-theme-border pb-4">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-indigo-400" />

          <h3 className="text-sm font-semibold text-theme-text">
            Deep Work Session
          </h3>
        </div>

        <span className="rounded-md border border-indigo-900/40 bg-indigo-950/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-300">
          Focus
        </span>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-6xl font-bold tracking-tight text-theme-text">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </h2>

        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="What are you focusing on?"
          className="mt-3 w-full bg-transparent text-center text-xs text-theme-muted placeholder-theme-muted focus:outline-none"
        />

        <div className="mt-8 flex gap-3">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`rounded-xl p-3 transition-all ${
              isRunning
                ? "cursor-not-allowed bg-theme-tertiary text-theme-muted"
                : "bg-theme-tertiary text-theme-text hover:bg-theme-secondary"
            }`}
          >
            <Play size={18} />
          </button>

          <button
            onClick={handlePause}
            disabled={!isRunning}
            className={`rounded-xl p-3 transition-all ${
              !isRunning
                ? "cursor-not-allowed bg-theme-tertiary text-theme-muted"
                : "bg-theme-secondary text-theme-text hover:bg-theme-tertiary"
            }`}
          >
            <Pause size={18} />
          </button>

          <button
            onClick={handleReset}
            className="rounded-xl bg-theme-secondary p-3 text-theme-text transition-all hover:bg-theme-tertiary"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4 border-t border-theme-border pt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-theme-muted">
            Completed Sessions
          </span>

          <span className="text-sm font-semibold text-theme-text">
            {completedSessions}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-theme-muted">
            Today's Focus Time
          </span>

          <span className="text-sm font-semibold text-theme-text">
            {focusHours}h {focusMinutesRemainder}m
          </span>
        </div>

        {goal && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-theme-muted">
              Current Goal
            </span>

            <span className="text-xs font-medium text-indigo-300 truncate max-w-140px">
              {goal}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}