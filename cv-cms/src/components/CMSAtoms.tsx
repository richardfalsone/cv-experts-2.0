/**
 * CMSAtoms.tsx — Room of Experts CMS Design System
 * Atomic components: Toast, Modal, Select, Toggle, Badge, Input
 */
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────
// TOAST SYSTEM
// ─────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}
interface ToastContextValue {
  add: (message: string, type?: ToastType, duration?: number) => void;
}
const ToastContext = createContext<ToastContextValue>({ add: () => {} });

export const useToast = () => useContext(ToastContext);

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
  warning: 'warning',
};
const TOAST_COLORS: Record<ToastType, string> = {
  success: 'var(--cms-success)',
  error: 'var(--cms-danger)',
  info: 'var(--cms-primary)',
  warning: 'var(--cms-warning)',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const add = useCallback((message: string, type: ToastType = 'info', duration = 3500) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => remove(id), duration);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      {/* Toast Container */}
      <div
        role="region"
        aria-label="Notificaciones"
        aria-live="polite"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none'
        }}
      >
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ x: 80, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 80, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              role="alert"
              style={{
                pointerEvents: 'auto',
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px',
                background: 'var(--cms-surface)',
                border: `1px solid ${TOAST_COLORS[toast.type]}30`,
                borderLeft: `3px solid ${TOAST_COLORS[toast.type]}`,
                borderRadius: 12,
                boxShadow: 'var(--cms-shadow-lg)',
                backdropFilter: 'blur(20px)',
                minWidth: 280, maxWidth: 380,
                cursor: 'pointer',
              }}
              onClick={() => remove(toast.id)}
            >
              <span className="material-symbols-outlined" style={{ color: TOAST_COLORS[toast.type], fontSize: 20, flexShrink: 0 }}>
                {TOAST_ICONS[toast.type]}
              </span>
              <p style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--cms-text)', margin: 0, lineHeight: 1.4 }}>
                {toast.message}
              </p>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--cms-muted)', flexShrink: 0 }}
                aria-label="Cerrar notificación"
                onClick={(e) => { e.stopPropagation(); remove(toast.id); }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────

interface CMSModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  icon?: string;
}

export const CMSModal: React.FC<CMSModalProps> = ({ open, onClose, title, children, width = 480, icon }) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={backdropRef}
          className="cms-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.target === backdropRef.current && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="cms-card"
            style={{ width, maxWidth: 'calc(100vw - 48px)', padding: 32, maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              {icon && (
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,164,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--cms-primary)', fontSize: 20 }}>{icon}</span>
                </div>
              )}
              <h2 id="modal-title" style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--cms-text)', flex: 1 }}>{title}</h2>
              <button
                onClick={onClose}
                className="cms-btn-ghost"
                style={{ padding: '6px 8px', flexShrink: 0 }}
                aria-label="Cerrar modal"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────
// INPUT WITH LABEL & ERROR
// ─────────────────────────────────────────────

interface CMSInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: string;
}

export const CMSInput: React.FC<CMSInputProps> = ({ label, error, hint, icon, id, ...props }) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;
  return (
    <div style={{ marginBottom: 0 }}>
      {label && <label htmlFor={inputId} className="cms-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span className="material-symbols-outlined" style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            fontSize: 18, color: 'var(--cms-muted)', pointerEvents: 'none'
          }}>{icon}</span>
        )}
        <input
          id={inputId}
          className="cms-input"
          style={{ paddingLeft: icon ? 36 : 12, borderColor: error ? 'var(--cms-danger)' : undefined, ...(props.style) }}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
      </div>
      {error && <p id={`${inputId}-error`} style={{ fontSize: 11, color: 'var(--cms-danger)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span> {error}
      </p>}
      {hint && !error && <p id={`${inputId}-hint`} style={{ fontSize: 11, color: 'var(--cms-muted)', marginTop: 4 }}>{hint}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────
// TEXTAREA
// ─────────────────────────────────────────────

interface CMSTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const CMSTextarea: React.FC<CMSTextareaProps> = ({ label, error, hint, id, ...props }) => {
  const inputId = id || `textarea-${label?.toLowerCase().replace(/\s/g, '-')}`;
  return (
    <div>
      {label && <label htmlFor={inputId} className="cms-label">{label}</label>}
      <textarea
        id={inputId}
        className="cms-input"
        style={{ resize: 'vertical', minHeight: 80, borderColor: error ? 'var(--cms-danger)' : undefined }}
        aria-invalid={!!error}
        {...props}
      />
      {hint && !error && <p style={{ fontSize: 11, color: 'var(--cms-muted)', marginTop: 4 }}>{hint}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────
// SELECT DROPDOWN
// ─────────────────────────────────────────────

interface CMSSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

export const CMSSelect: React.FC<CMSSelectProps> = ({ label, options, error, id, ...props }) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s/g, '-')}`;
  return (
    <div>
      {label && <label htmlFor={selectId} className="cms-label">{label}</label>}
      <select id={selectId} className="cms-select" {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p style={{ fontSize: 11, color: 'var(--cms-danger)', marginTop: 4 }}>{error}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────
// TOGGLE SWITCH
// ─────────────────────────────────────────────

interface CMSToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}

export const CMSToggle: React.FC<CMSToggleProps> = ({ checked, onChange, label, id, disabled }) => {
  const toggleId = id || `toggle-${Date.now()}`;
  return (
    <label
      htmlFor={toggleId}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        role="switch"
        aria-checked={checked}
        style={{
          position: 'relative', width: 40, height: 22,
          background: checked ? 'var(--cms-primary)' : 'var(--cms-surface-3)',
          borderRadius: 11, transition: 'background 0.2s ease',
          border: `1px solid ${checked ? 'var(--cms-primary)' : 'var(--cms-border)'}`,
          flexShrink: 0,
        }}
      >
        <input
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={e => !disabled && onChange(e.target.checked)}
          style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', margin: 0 }}
        />
        <div style={{
          position: 'absolute', top: 2, left: checked ? 20 : 2,
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s cubic-bezier(0.2,0.8,0.2,1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </div>
      {label && <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--cms-text)' }}>{label}</span>}
    </label>
  );
};

// ─────────────────────────────────────────────
// SECTION HEADER (for Property Panel)
// ─────────────────────────────────────────────

export const CMSSectionHeader: React.FC<{ title: string; icon: string; children?: React.ReactNode }> = ({ title, icon, children }) => (
  <div style={{
    padding: '14px 20px',
    borderBottom: '1px solid var(--cms-border)',
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'var(--cms-surface)',
    position: 'sticky', top: 0, zIndex: 2,
  }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,164,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span className="material-symbols-outlined" style={{ color: 'var(--cms-primary)', fontSize: 18 }}>{icon}</span>
    </div>
    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cms-text)', flex: 1 }}>{title}</span>
    {children}
  </div>
);

// ─────────────────────────────────────────────
// COLLAPSIBLE FIELD GROUP
// ─────────────────────────────────────────────

export const CMSFieldGroup: React.FC<{ title: string; defaultOpen?: boolean; children: React.ReactNode }> = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--cms-border)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '10px 20px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--cms-muted)'
        }}
        aria-expanded={open}
      >
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--cms-muted)' }}>{title}</span>
        <span className="material-symbols-outlined" style={{ fontSize: 16, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '8px 20px 20px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────
// DIVIDER
// ─────────────────────────────────────────────
export const CMSDivider: React.FC<{ label?: string }> = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
    <div style={{ flex: 1, height: 1, background: 'var(--cms-border)' }} />
    {label && <span style={{ fontSize: 10, color: 'var(--cms-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>{label}</span>}
    {label && <div style={{ flex: 1, height: 1, background: 'var(--cms-border)' }} />}
  </div>
);

// ─────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────
export const CMSStatusBadge: React.FC<{ published: boolean }> = ({ published }) => (
  <span className={`cms-badge ${published ? 'cms-badge-published' : 'cms-badge-draft'}`}>
    <span className={`cms-live-dot`} style={{ width: 6, height: 6, borderRadius: '50%', background: published ? 'var(--cms-success)' : 'var(--cms-muted)', display: 'inline-block' }} />
    {published ? 'Publicado' : 'Borrador'}
  </span>
);

// ─────────────────────────────────────────────
// ICON BUTTON
// ─────────────────────────────────────────────
export const CMSIconButton: React.FC<{
  icon: string; onClick?: () => void; title?: string;
  color?: string; size?: number; danger?: boolean; disabled?: boolean;
}> = ({ icon, onClick, title, color, size = 16, danger, disabled }) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    aria-label={title}
    style={{
      background: danger ? 'rgba(255,77,109,0.08)' : 'none',
      border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center',
      color: color || (danger ? 'var(--cms-danger)' : 'var(--cms-muted)'),
      transition: 'all 0.15s ease', opacity: disabled ? 0.4 : 1,
    }}
    onMouseEnter={e => !disabled && (e.currentTarget.style.background = danger ? 'rgba(255,77,109,0.15)' : 'var(--cms-surface-2)')}
    onMouseLeave={e => !disabled && (e.currentTarget.style.background = danger ? 'rgba(255,77,109,0.08)' : 'none')}
  >
    <span className="material-symbols-outlined" style={{ fontSize: size }}>{icon}</span>
  </button>
);

// ─────────────────────────────────────────────
// SEARCH INPUT
// ─────────────────────────────────────────────
export const CMSSearchInput: React.FC<{ value: string; onChange: (val: string) => void; placeholder?: string }> = ({ value, onChange, placeholder = 'Buscar...' }) => (
  <div style={{ position: 'relative' }}>
    <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--cms-muted)', pointerEvents: 'none' }}>search</span>
    <input
      type="search"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="cms-input"
      style={{ paddingLeft: 34 }}
      aria-label={placeholder}
    />
    {value && (
      <button onClick={() => onChange('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cms-muted)', padding: 2 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
      </button>
    )}
  </div>
);

// ─────────────────────────────────────────────
// CONFIRM DIALOG
// ─────────────────────────────────────────────
export const CMSConfirmDialog: React.FC<{
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; confirmLabel?: string; danger?: boolean;
}> = ({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmar', danger }) => (
  <CMSModal open={open} onClose={onClose} title={title} icon={danger ? 'warning' : 'help'} width={400}>
    <p style={{ color: 'var(--cms-muted)', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>{message}</p>
    <div style={{ display: 'flex', gap: 10 }}>
      {danger
        ? <button className="cms-btn-danger" style={{ flex: 1 }} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
        : <button className="cms-btn-primary" style={{ flex: 1 }} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
      }
      <button className="cms-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
    </div>
  </CMSModal>
);

// ─────────────────────────────────────────────
// PUBLISH MODAL — Premium confirm for publishing
// ─────────────────────────────────────────────
export const CMSPublishModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onPublish: () => void;
  employeeName?: string;
  slug?: string;
  blocksCount?: number;
  lastSaved?: string;
  isPublished?: boolean;
}> = ({ open, onClose, onPublish, employeeName, slug, blocksCount, lastSaved, isPublished }) => (
  <CMSModal open={open} onClose={onClose} title={isPublished ? 'Actualizar CV Publicado' : 'Publicar CV'} icon="public" width={500}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: 16, background: 'var(--cms-surface-2)', borderRadius: 12, border: '1px solid var(--cms-border)' }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--cms-muted)', margin: '0 0 12px' }}>Resumen del CV</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: 'person', label: 'Empleado', value: employeeName || '—' },
            { icon: 'link', label: 'URL Pública', value: slug ? `/cv/${slug}` : '—' },
            { icon: 'widgets', label: 'Bloques activos', value: `${blocksCount || 0} bloques` },
            { icon: 'schedule', label: 'Última edición', value: lastSaved ? new Date(lastSaved).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) : '—' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--cms-primary)' }}>{item.icon}</span>
              <span style={{ fontSize: 12, color: 'var(--cms-muted)', minWidth: 110 }}>{item.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--cms-text)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--cms-muted)', margin: 0, lineHeight: 1.6 }}>
        {isPublished
          ? 'Los cambios se publicarán inmediatamente y serán visibles para los reclutadores.'
          : 'El CV estará disponible públicamente en la URL indicada y será visible para los reclutadores.'}
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="cms-btn-success" style={{ flex: 1, padding: '10px 16px', fontSize: 14 }} onClick={() => { onPublish(); onClose(); }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>rocket_launch</span>
          {isPublished ? 'Actualizar & Publicar' : 'Publicar Ahora'}
        </button>
        <button className="cms-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  </CMSModal>
);
