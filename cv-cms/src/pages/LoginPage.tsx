import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@re.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const err = await signIn(email, password);
    if (!err) {
      navigate('/dashboard');
    } else {
      setError(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--cms-bg)' }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,164,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="cms-card w-full max-w-sm p-10 relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--cms-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: '#000', fontSize: 22 }}>hub</span>
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--cms-text)', margin: 0 }}>Room of Experts</p>
            <p style={{ fontSize: 11, color: 'var(--cms-muted)', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>Phase 2 CMS</p>
          </div>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: 'var(--cms-text)' }}>Iniciar Sesión</h1>
        <div style={{ color: 'var(--cms-muted)', fontSize: 12, marginBottom: 32, lineHeight: 1.6 }}>
          <p className="mb-2">Utiliza las credenciales de demo para probar los roles:</p>
          <ul className="space-y-1">
            <li><code style={{ color: 'var(--cms-primary)' }}>admin@re.com</code> / <code style={{ color: 'var(--cms-primary)' }}>admin123</code></li>
            <li><code style={{ color: 'var(--cms-primary)' }}>talent@re.com</code> / <code style={{ color: 'var(--cms-primary)' }}>talent123</code></li>
            <li><code style={{ color: 'var(--cms-primary)' }}>sales@re.com</code> / <code style={{ color: 'var(--cms-primary)' }}>sales123</code></li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="cms-label" htmlFor="email">Correo Electrónico</label>
            <input className="cms-input" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="cms-label" htmlFor="password">Contraseña</label>
            <input className="cms-input" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && (
            <div style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ff4d6d', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button className="cms-btn-primary" type="submit" disabled={loading} style={{ marginTop: 8, height: 44, fontSize: 13, fontWeight: 800 }}>
            {loading ? 'Entrando...' : 'ACCEDER AL PANEL'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
