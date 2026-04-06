import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { CVPublicPage } from './pages/CVPublicPage';
import { ToastProvider } from './components/CMSAtoms';
import './index.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--cms-bg)', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--cms-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1.5s ease infinite' }}>
        <span className="material-symbols-outlined" style={{ color: '#000', fontSize: 22 }}>hub</span>
      </div>
      <p style={{ color: 'var(--cms-muted)', fontSize: 13, fontWeight: 600 }}>Cargando Room of Experts...</p>
    </div>
  );

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/editor/:employeeId" element={<PrivateRoute><EditorPage /></PrivateRoute>} />
        <Route path="/cv/:slug" element={<CVPublicPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ToastProvider>
  );
}
