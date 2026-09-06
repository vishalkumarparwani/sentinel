import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    ListTodo,
    FolderKanban,
    Wand2,
    Settings as SettingsIcon,
    Sparkles,
    X
} from "lucide-react";

export default function Sidebar(props) {
    const navItems = [
        { title: "Dashboard", path: "/", icon: LayoutDashboard },
        { title: "Issues", path: "/issues", icon: ListTodo },
        { title: "Services", path: "/services", icon: FolderKanban },
        { title: "Triage", path: "/triage", icon: Wand2 },
        { title: "Settings", path: "/settings", icon: SettingsIcon },
    ];

    const handleNavClick = () => {
        if (window.innerWidth < 768 && props.setIsSidebarOpen) {
            props.setIsSidebarOpen(false);
        }
    };

    return (
        <>
            {props.isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => props.setIsSidebarOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed md:static inset-y-0 left-0 z-50
                    w-64 bg-theme-primary border-r border-theme-border
                    flex flex-col justify-between p-4 h-full shrink-0 select-none
                    transition-transform duration-300 ease-in-out
                    ${props.isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:hidden"
                    }
                `}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2 py-1">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-theme-text text-theme-primary flex items-center justify-center font-bold shrink-0">
                                <Sparkles className="w-4 h-4 fill-current" />
                            </div>

                            <div className="overflow-hidden">
                                <h2 className="text-sm font-bold text-theme-text tracking-tight truncate">
                                    SENTINEL
                                </h2>

                                <p className="text-[10px] text-theme-muted font-mono truncate">
                                    SERVICE-TO-ISSUE v2.2
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                props.setIsSidebarOpen &&
                                props.setIsSidebarOpen(false)
                            }
                            className="p-1 rounded-md text-theme-muted hover:text-theme-text hover:bg-theme-secondary md:hidden"
                            title="Close sidebar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === "/"}
                                    onClick={handleNavClick}
                                    className={({ isActive }) =>
                                        `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                            isActive
                                                ? "bg-theme-tertiary text-theme-text border border-theme-border shadow-sm"
                                                : "text-theme-muted hover:text-theme-text hover:bg-theme-secondary border border-transparent"
                                        }`
                                    }
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    <span className="truncate">
                                        {item.title}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-3 bg-theme-secondary rounded-xl border border-theme-border space-y-1 text-xs">
                    <p className="text-theme-text font-medium truncate">
                        Acme Corp Engineering
                    </p>

                    <p className="text-[11px] text-theme-muted truncate">
                        Connected to Linear & GitHub
                    </p>
                </div>
            </aside>
        </>
    );
}