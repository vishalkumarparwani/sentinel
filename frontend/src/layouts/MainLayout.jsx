import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AISidebar from "../components/AISidebar";

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAIOpen, setIsAIOpen] = useState(false);

    return (
        <div className="flex h-screen bg-theme-primary text-theme-text overflow-hidden">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    onToggleAI={() => setIsAIOpen((prev) => !prev)}
                />

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>

                <AISidebar
                    isOpen={isAIOpen}
                    onClose={() => setIsAIOpen(false)}
                />
            </div>
        </div>
    );
}