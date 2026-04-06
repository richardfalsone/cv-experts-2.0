/**
 * CVPublicPage.tsx — Room of Experts CMS
 * Renders the public CV using the ORIGINAL portfolio (localhost:3000) via iframe
 * This guarantees 100% visual parity — same code, same styles, same animations.
 *
 * Architecture decision: Instead of maintaining a parallel reimplementation,
 * we directly embed the running portfolio. In production, this would point
 * to the deployed portfolio URL.
 */
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Employee } from '../types/cv.types';
import { useAuthStore } from '../stores/authStore';

// ─────────────────────────────────────────────
// CONFIG — portfolio origin
// ─────────────────────────────────────────────
const PORTFOLIO_ORIGIN = 'http://localhost:3000';

// ─────────────────────────────────────────────
// DEVICE FRAME
// ─────────────────────────────────────────────
type DeviceMode = 'desktop' | 'tablet' | 'mobile';
const DEVICE_WIDTHS: Record<DeviceMode, number | string> = {
  desktop: '100%',
  tablet: 768,
  mobile: 390,
};

// ─────────────────────────────────────────────
// CMS ADMIN BAR — only visible when logged in
// ─────────────────────────────────────────────
const CMSAdminBar: React.FC<{
  employee: Employee | null;
  isPublished: boolean;
  onPublish: () => void;
  onEdit: () => void;
}> = ({ employee, isPublished, onPublish, onEdit }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail
    }
  };

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.3 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 48,
        background: 'rgba(1, 6, 16, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,164,255,0.15)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 8,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Back to editor */}
      <button
        onClick={onEdit}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 8,
          border: '1px solid rgba(0,164,255,0.2)',
          background: 'transparent', color: '#7a96c2',
          fontSize: 11, fontWeight: 700, cursor: 'pointer',
          letterSpacing: '0.05em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
        Editar
      </button>

      <div style={{ width: 1, height: 20, background: 'rgba(0,164,255,0.15)' }} />

      {/* Employee name + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#e8f0ff' }}>
          {employee?.fullName || 'CV Public'}
        </span>
        {isPublished && (
          <span style={{
            fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
            padding: '2px 8px', borderRadius: 20,
            background: 'rgba(0,229,160,0.12)', color: '#00e5a0',
            border: '1px solid rgba(0,229,160,0.25)',
          }}>
            Publicado
          </span>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Device switcher */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 2, gap: 2 }}>
        {(['desktop', 'tablet', 'mobile'] as DeviceMode[]).map(d => {
          const icons: Record<DeviceMode, string> = { desktop: 'desktop_windows', tablet: 'tablet_mac', mobile: 'smartphone' };
          return (
            <button
              key={d}
              onClick={() => setDeviceMode(d)}
              title={d}
              style={{
                padding: '3px 7px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: deviceMode === d ? '#00a4ff' : 'transparent',
                color: deviceMode === d ? '#000' : '#7a96c2',
                transition: 'all 0.15s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{icons[d]}</span>
            </button>
          );
        })}
      </div>

      <div style={{ width: 1, height: 20, background: 'rgba(0,164,255,0.15)' }} />

      {/* Copy link */}
      <button
        onClick={handleCopy}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 8,
          border: '1px solid rgba(0,164,255,0.2)',
          background: 'transparent',
          color: copied ? '#00e5a0' : '#7a96c2',
          fontSize: 11, fontWeight: 600, cursor: 'pointer',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{copied ? 'check' : 'share'}</span>
        {copied ? 'Copiado' : 'Compartir'}
      </button>

      {/* Publish */}
      <button
        onClick={onPublish}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 16px', borderRadius: 10,
          border: 'none', background: '#00e5a0', color: '#000',
          fontSize: 11, fontWeight: 800, cursor: 'pointer',
          letterSpacing: '0.05em',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>rocket_launch</span>
        {isPublished ? 'Actualizar' : 'Publicar CV'}
      </button>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// MAIN PUBLIC PAGE
// ─────────────────────────────────────────────
export const CVPublicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isLoggedIn = !!user;

  useEffect(() => {
    try {
      const employees: Employee[] = JSON.parse(localStorage.getItem('cms_employees') || '[]');
      const emp = employees.find(e => e.slug === slug);
      if (!emp) {
        setError('Perfil no encontrado');
        setLoading(false);
        return;
      }
      setEmployee(emp);
      setIsPublished(emp.isPublished);
    } catch {
      setError('Error cargando el perfil');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const handlePublish = () => {
    if (!employee) return;
    try {
      const employees: Employee[] = JSON.parse(localStorage.getItem('cms_employees') || '[]');
      const updated = employees.map(e =>
        e.id === employee.id ? { ...e, isPublished: true, updatedAt: new Date().toISOString() } : e
      );
      localStorage.setItem('cms_employees', JSON.stringify(updated));
      setIsPublished(true);
      setEmployee({ ...employee, isPublished: true });
    } catch {
      // silently fail
    }
  };

  const handleEdit = () => {
    navigate(`/editor/${employee?.id}`);
  };

  // ── Loading ──
  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#010610', flexDirection: 'column', gap: 16, fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, background: '#00a4ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'spin 1s linear infinite',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#000', fontSize: 26 }}>hub</span>
        </div>
        <p style={{ color: '#7a96c2', fontSize: 14, fontWeight: 600, margin: 0 }}>Cargando perfil...</p>
        <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#010610', flexDirection: 'column', gap: 16, fontFamily: "'Inter', sans-serif",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <span className="material-symbols-outlined" style={{ fontSize: 56, color: 'rgba(0,164,255,0.3)' }}>search_off</span>
        <h1 style={{ color: '#e8f0ff', fontWeight: 800, fontSize: 24, margin: 0 }}>{error}</h1>
        <p style={{ color: '#7a96c2', fontSize: 14, margin: 0 }}>Verifica la URL o contacta al administrador</p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginTop: 16, padding: '10px 20px', borderRadius: 10,
            border: '1px solid rgba(0,164,255,0.3)', background: 'transparent',
            color: '#00a4ff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  const adminBarHeight = isLoggedIn ? 48 : 0;

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#010610' }}>
      {/* Material Symbols for admin bar */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />

      {/* ── CMS Admin Bar (only when logged in) ── */}
      <AnimatePresence>
        {isLoggedIn && (
          <CMSAdminBar
            employee={employee}
            isPublished={isPublished}
            onPublish={handlePublish}
            onEdit={handleEdit}
          />
        )}
      </AnimatePresence>

      {/* ── Portfolio iframe (100% parity) ── */}
      <div
        style={{
          flex: 1,
          marginTop: adminBarHeight,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          background: '#010610',
        }}
      >
        <iframe
          ref={iframeRef}
          src={PORTFOLIO_ORIGIN}
          title={`CV de ${employee?.fullName || slug}`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="eager"
          allow="clipboard-write"
        />
      </div>
    </div>
  );
};

export default CVPublicPage;
