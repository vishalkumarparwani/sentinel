import React, { useState, useEffect } from 'react';

const emptyForm = {
    title: "",
    service: "",
    due_date: "",
    severity: "P3",
    reproduction_steps: "",
    description: "",
};

export default function IssueForm({ initialValues, onSubmit, onCancel }) {

    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        if (initialValues) {
            setFormData({
                ...emptyForm,
                ...initialValues,
            });
        }
    }, [initialValues]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!formData.title.trim()) return;

        onSubmit({
            ...formData,
            description: formData.description || "",
            priority: formData.priority || "Medium",
            status: formData.status || "planning",
            due_date: formData.due_date || null,
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-theme-secondary/60 border border-theme-border rounded-xl p-4"
        >
            <div>
                <h3 className="text-sm font-semibold text-theme-text">
                    {initialValues ? "Edit Issue" : "Report New Issue"}
                </h3>

                <p className="text-[11px] text-theme-muted mt-0.5">
                    Provide the core details needed to track this issue.
                </p>
            </div>

            {/* Title */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-sky-400">
                    Issue Title
                </label>

                <input
                    type="text"
                    placeholder="e.g. App crashes when uploading large files"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            title: e.target.value,
                        })
                    }
                    className="w-full bg-theme-primary border border-theme-border rounded-lg px-3 py-1.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none focus:border-sky-500/40 transition-colors"
                />
            </div>

            {/* Description */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-sky-400">
                    Description
                </label>

                <textarea
                    rows={2}
                    placeholder="Briefly describe the issue and what is happening..."
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                    className="w-full bg-theme-primary border border-theme-border rounded-lg px-3 py-1.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none focus:border-sky-500/40 transition-colors resize-y"
                />
            </div>

            {/* Service / Severity / Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* Service */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-theme-muted">
                        Service
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Checkout flow"
                        value={formData.service}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                service: e.target.value,
                            })
                        }
                        className="w-full bg-theme-primary border border-theme-border rounded-lg px-3 py-1.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none focus:border-sky-500/40 transition-colors"
                    />
                </div>

                {/* Severity */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-theme-muted">
                        Severity
                    </label>

                    <select
                        value={formData.severity}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                severity: e.target.value,
                            })
                        }
                        className="w-full bg-theme-primary border border-theme-border rounded-lg px-3 py-1.5 text-sm text-theme-text focus:outline-none focus:border-sky-500/40 transition-colors"
                    >
                        <option value="P1">P1 - Critical</option>
                        <option value="P2">P2 - High</option>
                        <option value="P3">P3 - Medium</option>
                        <option value="P4">P4 - Low</option>
                    </select>
                </div>

                {/* Due Date */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-theme-muted">
                        Due Date
                    </label>

                    <input
                        type="date"
                        value={formData.due_date || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                due_date: e.target.value,
                            })
                        }
                        className="w-full bg-theme-primary border border-theme-border rounded-lg px-3 py-1.5 text-sm text-theme-text focus:outline-none focus:border-sky-500/40 transition-colors"
                    />
                </div>
            </div>

            {/* Reproduction Steps */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-theme-muted">
                    Reproduction Steps
                </label>

                <textarea
                    rows={2}
                    placeholder={
                        "Upload a file over 500MB\nSwitch tabs mid-upload\nApp becomes unresponsive"
                    }
                    value={formData.reproduction_steps}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            reproduction_steps: e.target.value,
                        })
                    }
                    className="w-full bg-theme-primary border border-theme-border rounded-lg px-3 py-1.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none focus:border-sky-500/40 transition-colors font-mono resize-y"
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-1 border-t border-theme-border">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-1.5 rounded-lg text-sm text-theme-muted hover:text-theme-text hover:bg-theme-tertiary transition-colors"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="bg-theme-text text-theme-primary hover:opacity-90 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                    {initialValues ? "Save Changes" : "Add Issue"}
                </button>
            </div>
        </form>
    );
}