import React, { useState, useEffect } from 'react';

const emptyForm = {
    title: "",
    service: "",
    due_date: "",
    severity: "P3",
    reproduction_steps: "",
    description: "",
};

const SEVERITY_OPTIONS = [
    {
        id: "P1",
        label: "P1 - Critical",
        active: "bg-red-500/20 border-red-500 text-red-400 ring-1 ring-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.2)]",
        inactive: "hover:border-red-500/40 hover:bg-red-500/10 text-theme-muted",
    },
    {
        id: "P2",
        label: "P2 - High",
        active: "bg-amber-500/20 border-amber-500 text-amber-400 ring-1 ring-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
        inactive: "hover:border-amber-500/40 hover:bg-amber-500/10 text-theme-muted",
    },
    {
        id: "P3",
        label: "P3 - Medium",
        active: "bg-sky-500/20 border-sky-500 text-sky-400 ring-1 ring-sky-500/50 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
        inactive: "hover:border-sky-500/40 hover:bg-sky-500/10 text-theme-muted",
    },
    {
        id: "P4",
        label: "P4 - Low",
        active: "bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        inactive: "hover:border-emerald-500/40 hover:bg-emerald-500/10 text-theme-muted",
    },
];

export default function IssueForm({ initialValues, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        if (initialValues) {
            setFormData({
                ...emptyForm,
                ...initialValues,
            });
        } else {
            setFormData(emptyForm);
        }
    }, [initialValues]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!formData.title.trim()) return;

        onSubmit({
            ...formData,
            description: formData.description || "",
            status: formData.status || "planning",
            due_date: formData.due_date || null,
        });
    }

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3.5 bg-theme-secondary/70 border border-theme-border/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md transition-all"
        >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-theme-border/60">
                <div>
                    <h3 className="text-sm font-semibold text-theme-text flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        {initialValues ? "Edit Issue" : "Report New Issue"}
                    </h3>
                    <p className="text-[11px] text-theme-muted mt-0.5">
                        Provide the core details needed to track this issue.
                    </p>
                </div>
            </div>

            {/* Title Field Container */}
            <div className="group rounded-xl border border-theme-border/70 bg-theme-primary/40 p-3 transition-all duration-300 focus-within:border-sky-500/70 focus-within:ring-2 focus-within:ring-sky-500/20 hover:border-theme-border">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-1">
                    Issue Title <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    placeholder="e.g. App crashes when uploading large files"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full bg-transparent text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none"
                    required
                />
            </div>

            {/* Severity Pill Selector (Replaces Dropdown) */}
            <div className="rounded-xl border border-theme-border/70 bg-theme-primary/40 p-3 transition-all duration-300 hover:border-theme-border">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-muted mb-2">
                    Severity Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SEVERITY_OPTIONS.map((option) => {
                        const isSelected = formData.severity === option.id;
                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleChange("severity", option.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 transform active:scale-95 ${
                                    isSelected
                                        ? option.active
                                        : `border-theme-border/60 bg-theme-secondary/30 ${option.inactive}`
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grid Row: Service & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Service Field Container */}
                <div className="group rounded-xl border border-theme-border/70 bg-theme-primary/40 p-3 transition-all duration-300 focus-within:border-sky-500/70 focus-within:ring-2 focus-within:ring-sky-500/20 hover:border-theme-border">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-muted mb-1">
                        Service
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Checkout flow"
                        value={formData.service}
                        onChange={(e) => handleChange("service", e.target.value)}
                        className="w-full bg-transparent text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none"
                    />
                </div>

                {/* Due Date Field Container */}
                <div className="group rounded-xl border border-theme-border/70 bg-theme-primary/40 p-3 transition-all duration-300 focus-within:border-sky-500/70 focus-within:ring-2 focus-within:ring-sky-500/20 hover:border-theme-border">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-muted mb-1">
                        Due Date
                    </label>
                    <input
                        type="date"
                        value={formData.due_date || ""}
                        onChange={(e) => handleChange("due_date", e.target.value)}
                        className="w-full bg-transparent text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none cursor-pointer"
                    />
                </div>
            </div>

            {/* Description Field Container */}
            <div className="group rounded-xl border border-theme-border/70 bg-theme-primary/40 p-3 transition-all duration-300 focus-within:border-sky-500/70 focus-within:ring-2 focus-within:ring-sky-500/20 hover:border-theme-border">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-1">
                    Description
                </label>
                <textarea
                    rows={2}
                    placeholder="Briefly describe the issue and what is happening..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="w-full bg-transparent text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none resize-y"
                />
            </div>

            {/* Reproduction Steps Field Container */}
            <div className="group rounded-xl border border-theme-border/70 bg-theme-primary/40 p-3 transition-all duration-300 focus-within:border-sky-500/70 focus-within:ring-2 focus-within:ring-sky-500/20 hover:border-theme-border">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-muted mb-1">
                    Reproduction Steps
                </label>
                <textarea
                    rows={2}
                    placeholder={"Upload a file over 500MB\nSwitch tabs mid-upload\nApp becomes unresponsive"}
                    value={formData.reproduction_steps}
                    onChange={(e) => handleChange("reproduction_steps", e.target.value)}
                    className="w-full bg-transparent text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none font-mono resize-y"
                />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-theme-border/60">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-theme-muted hover:text-theme-text hover:bg-theme-tertiary transition-all duration-200 active:scale-95"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-sky-500/20 transition-all duration-200 active:scale-95"
                >
                    {initialValues ? "Save Changes" : "Add Issue"}
                </button>
            </div>
        </form>
    );
}