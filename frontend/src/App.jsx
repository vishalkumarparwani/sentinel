import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import Dashboard from "./pages/Dashboard/Dashboard";
import Issues from "./pages/Issues/Issues";
import Services from "./pages/Services/Services";
import Triage from "./pages/Triage/Triage";
import Settings from "./pages/Settings/Settings";
import AIAssistantPage from "./pages/AIAssistant/AIAssistantPage";

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="issues" element={<Issues />} />
        <Route path="services" element={<Services />} />
        <Route path="triage" element={<Triage />} />
        <Route path="ai" element={<AIAssistantPage />} />
        <Route path="settings" element={<Settings />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}