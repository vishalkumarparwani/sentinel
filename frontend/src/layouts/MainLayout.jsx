import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const isAIAssistantPage =
        location.pathname === "/ai";

    return (
        <div className="flex h-screen bg-theme-primary text-theme-text overflow-hidden">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {!isAIAssistantPage && (
                    <Navbar
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        onToggleAI={() => {}}
                    />
                )}

                <main
                    className={
                        isAIAssistantPage
                            ? "flex-1 min-h-0 overflow-hidden"
                            : "flex-1 overflow-y-auto p-6"
                    }
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}