import React from "react";
import { Sparkles, X, Wand2, FileText } from "lucide-react";

export default function AISidebar({ isOpen, onClose, onNavigate }) {
    return (
        <aside
            className={`
                fixed right-0 top-14 bottom-0 w-80
                bg-theme-primary border-l border-theme-border
                p-5 flex flex-col justify-between
                z-20 shadow-2xl
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "translate-x-full"}
            `}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-theme-border">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />

                        <h3 className="text-sm font-bold text-theme-text">
                            Sentinel Copilot AI
                        </h3>
                    </div>

                    <button
                        onClick={onClose}
                        type="button"
                        aria-label="Close Sentinel Copilot"
                        className="p-1 rounded-md text-theme-muted hover:text-theme-text hover:bg-theme-secondary transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    <p className="text-xs text-theme-muted">
                        Select an automated action for your current issue context:
                    </p>

                    <button
                        onClick={() => {
                            onNavigate?.("generator");
                            onClose();
                        }}
                        className="w-full p-3 rounded-lg bg-theme-secondary/60 border border-theme-border hover:border-theme-text/30 text-left space-y-1 group transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-theme-text">
                                Convert Active PRD
                            </span>

                            <Wand2 className="w-3.5 h-3.5 text-theme-muted group-hover:text-theme-text" />
                        </div>

                        <p className="text-[11px] text-theme-muted">
                            Extract tasks & story points from PRD draft
                        </p>
                    </button>

                    <button
                        type="button"
                        className="w-full p-3 rounded-lg bg-theme-secondary/60 border border-theme-border hover:border-theme-text/30 text-left space-y-1 group transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-theme-text">
                                Audit Technical AC
                            </span>

                            <FileText className="w-3.5 h-3.5 text-theme-muted group-hover:text-theme-text" />
                        </div>

                        <p className="text-[11px] text-theme-muted">
                            Verify edge cases & schema completeness
                        </p>
                    </button>
                </div>
            </div>

            <div className="pt-4 border-t border-theme-border">
                <p className="text-[10px] text-theme-muted text-center">
                    Powered by Sentinel Fine-Tuned LLM
                </p>
            </div>
        </aside>
    );
}