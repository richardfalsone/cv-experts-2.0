import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useVersionStore } from '../stores/versionStore';
import type { Employee } from '../types/cv.types';
import { FALSONE_TEMPLATE } from '../data/defaultTemplate';
import {
  useToast, CMSModal, CMSInput, CMSStatusBadge,
  CMSConfirmDialog, CMSSearchInput, CMSSelect, CMSIconButton,
} from '../components/CMSAtoms';
import { PermissionGate } from '../components/PermissionGate';

const getEmployees = (): Employee[] => {
  const stored = localStorage.getItem('cms_employees');
  if (stored) return JSON.parse(stored);
  const defaults: Employee[] = [
    {
      id: 'emp-001',
      fullName: 'Richard Falsone',
      slug: 'richard-falsone',
      email: 'hola@richardfalsone.com',
      avatarUrl: 'https://i.pravatar.cc/150?u=richard',
      isPublished: true,
      role: 'talent',
      specialization: 'ux_ui',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem('cms_employees', JSON.stringify(defaults));
  return defaults;
};

const saveEmployees = (employees: Employee[]) =>
  localStorage.setItem('cms_employees', JSON.stringify(employees));

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const signOut = useAuthStore(s => s.signOut);
  const user = useAuthStore(s => s.user);
  const toast = useToast();
  const { getSnapshots } = useVersionStore();

  const [employees, setEmployees] = useState<Employee[]>(getEmployees);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('ux_ui');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');

  // Filtered & sorted employees
  const displayed = useMemo(() => {
    let list = [...employees];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.fullName.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q) || e.slug.includes(q)
      );
    }

    // Status filter
    if (filter === 'published') list = list.filter(e => e.isPublished);
    if (filter === 'draft') list = list.filter(e => !e.isPublished);

    // Sort
    if (sortBy === 'name') list.sort((a, b) => a.fullName.localeCompare(b.fullName));
    if (sortBy === 'date') list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    if (sortBy === 'status') list.sort((a, b) => Number(b.isPublished) - Number(a.isPublished));

    return list;
  }, [employees, search, filter, sortBy]);

  const createEmployee = () => {
    if (!newName.trim()) { toast.add('El nombre es requerido', 'error'); return; }
    const slug = newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (employees.some(e => e.slug === slug)) { toast.add('Ya existe un empleado con ese nombre', 'error'); return; }

    const emp: Employee = {
      id: `emp-${Date.now()}`,
      fullName: newName.trim(),
      slug,
      email: newEmail.trim(),
      isPublished: false,
      role: 'talent',
      specialization: newRole as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Clone Falsone template for this employee
    const page = { ...FALSONE_TEMPLATE, id: `page-${Date.now()}`, employeeId: emp.id };
    const pages = JSON.parse(localStorage.getItem('cms_pages') || '{}');
    pages[emp.id] = page;
    localStorage.setItem('cms_pages', JSON.stringify(pages));

    const updated = [...employees, emp];
    setEmployees(updated);
    saveEmployees(updated);
    toast.add(`CV de ${emp.fullName} creado exitosamente`, 'success');
    setShowNewModal(false);
    setNewName('');
    setNewEmail('');
    setNewRole('ux_ui');

    // Navigate to editor
    navigate(`/editor/${emp.id}`);
  };

  const deleteEmployee = (id: string) => {
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    saveEmployees(updated);
    toast.add('CV eliminado', 'info');
    setShowDeleteConfirm(null);
  };

  const togglePublish = (id: string) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    const updated = employees.map(e =>
      e.id === id ? { ...e, isPublished: !e.isPublished, updatedAt: new Date().toISOString() } : e
    );
    setEmployees(updated);
    saveEmployees(updated);
    toast.add(emp.isPublished ? 'CV despublicado' : `CV de ${emp.fullName} publicado`, emp.isPublished ? 'info' : 'success');
  };

  const duplicateEmployee = (emp: Employee) => {
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`,
      fullName: `${emp.fullName} (copia)`,
      slug: `${emp.slug}-copy-${Date.now()}`,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Copy page
    const pages = JSON.parse(localStorage.getItem('cms_pages') || '{}');
    if (pages[emp.id]) pages[newEmp.id] = { ...pages[emp.id], id: `page-${Date.now()}`, employeeId: newEmp.id };
    localStorage.setItem('cms_pages', JSON.stringify(pages));

    const updated = [...employees, newEmp];
    setEmployees(updated);
    saveEmployees(updated);
    toast.add(`CV duplicado como "${newEmp.fullName}"`, 'success');
  };

  const stats = {
    total: employees.length,
    published: employees.filter(e => e.isPublished).length,
    drafts: employees.filter(e => !e.isPublished).length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cms-bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── TOP NAV ── */}
      <header style={{
        borderBottom: '1px solid var(--cms-border)', padding: '0 32px',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--cms-surface)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--cms-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: '#000', fontSize: 20 }}>hub</span>
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--cms-text)', margin: 0, lineHeight: 1 }}>Room of Experts</p>
            <p style={{ fontSize: 10, color: 'var(--cms-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: 2 }}>CMS Phase 2</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--cms-text)', margin: 0 }}>{user?.email}</p>
            <p style={{ fontSize: 10, color: 'var(--cms-muted)', margin: 0, textTransform: 'capitalize' }}>{user?.role || 'Admin'}</p>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cms-surface-2)', border: '1px solid var(--cms-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--cms-muted)' }}>person</span>
          </div>
          <button className="cms-btn-ghost" onClick={async () => { await signOut(); navigate('/login'); }} style={{ fontSize: 12 }}>
            Salir
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '40px 32px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', color: 'var(--cms-text)' }}>
              CVs del Equipo
            </h1>
            <p style={{ color: 'var(--cms-muted)', fontSize: 14, margin: 0 }}>
              Gestiona, personaliza y publica los perfiles de tu equipo Room of Experts
            </p>
          </div>
          <PermissionGate allowedRoles={['admin']}>
            <button className="cms-btn-primary" onClick={() => setShowNewModal(true)} style={{ padding: '9px 18px', fontSize: 13, flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              Nuevo CV
            </button>
          </PermissionGate>
        </div>

        {/* ── STATS CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total CVs', value: stats.total, icon: 'badge', color: 'var(--cms-primary)' },
            { label: 'Publicados', value: stats.published, icon: 'public', color: 'var(--cms-success)' },
            { label: 'Borradores', value: stats.drafts, icon: 'draft', color: 'var(--cms-muted)' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="cms-card"
              style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${stat.color}25` }}>
                <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: 22 }}>{stat.icon}</span>
              </div>
              <div>
                <p style={{ fontSize: 30, fontWeight: 800, color: 'var(--cms-text)', margin: 0, lineHeight: 1 }}>{stat.value}</p>
                <p style={{ fontSize: 11, color: 'var(--cms-muted)', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── FILTERS & SEARCH ── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <CMSSearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre o email..." />
          </div>

          {/* Status filter pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'published', 'draft'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: '1px solid',
                  borderColor: filter === f ? 'var(--cms-primary)' : 'var(--cms-border)',
                  color: filter === f ? 'var(--cms-primary)' : 'var(--cms-muted)',
                  background: filter === f ? 'rgba(0,164,255,0.08)' : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                {f === 'all' ? 'Todos' : f === 'published' ? 'Publicados' : 'Borradores'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            className="cms-select"
            style={{ width: 'auto', minWidth: 160 }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            aria-label="Ordenar por"
          >
            <option value="date">Más reciente</option>
            <option value="name">Nombre A–Z</option>
            <option value="status">Publicados primero</option>
          </select>
        </div>

        {/* ── EMPLOYEE GRID ── */}
        {displayed.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--cms-muted)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56, display: 'block', marginBottom: 16, opacity: 0.3 }}>search_off</span>
            <p style={{ fontSize: 16, fontWeight: 600 }}>No se encontraron CVs</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Prueba a cambiar los filtros o crea un nuevo CV</p>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            <AnimatePresence>
              {displayed.map((emp, i) => {
                const snapshots = getSnapshots(emp.id);
                const draftCount = snapshots.filter(s => s.isDraft).length;
                const versionCount = snapshots.length;
                const lastUpdated = emp.updatedAt
                  ? new Date(emp.updatedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—';

                return (
                  <motion.div
                    key={emp.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    className="cms-card"
                    style={{ padding: 0, overflow: 'hidden' }}
                  >
                    {/* Card header */}
                    <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <img
                        src={emp.avatarUrl || `https://i.pravatar.cc/150?u=${emp.slug}`}
                        alt={emp.fullName}
                        style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--cms-border)', flexShrink: 0 }}
                        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}&background=0d1b35&color=00a4ff&bold=true`; }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <p style={{ fontWeight: 700, fontSize: 15, margin: 0, color: 'var(--cms-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {emp.fullName}
                          </p>
                          <CMSStatusBadge published={emp.isPublished} />
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--cms-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {emp.email || 'Sin email asignado'}
                        </p>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div style={{ padding: '0 24px 16px', display: 'flex', gap: 16 }}>
                      {[
                        { icon: 'history', label: `${versionCount} versiones` },
                        { icon: 'draft', label: `${draftCount} borradores` },
                        { icon: 'schedule', label: lastUpdated },
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 13, color: 'var(--cms-muted)' }}>{item.icon}</span>
                          <span style={{ fontSize: 11, color: 'var(--cms-muted)', fontWeight: 500 }}>{item.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: 'var(--cms-border)' }} />

                    {/* Actions */}
                    <div style={{ padding: '14px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        className="cms-btn-primary"
                        style={{ flex: 1, fontSize: 12, padding: '8px 12px' }}
                        onClick={() => navigate(`/editor/${emp.id}`)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
                        Editar
                      </button>
                      <button
                        className="cms-btn-ghost"
                        style={{ flex: 1, fontSize: 12, padding: '8px 12px' }}
                        onClick={() => window.open(`/cv/${emp.slug}`, '_blank')}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>visibility</span>
                        Ver CV
                      </button>

                      {/* More actions */}
                      <CMSIconButton
                        icon={emp.isPublished ? 'public_off' : 'public'}
                        onClick={() => togglePublish(emp.id)}
                        title={emp.isPublished ? 'Despublicar' : 'Publicar'}
                        color={emp.isPublished ? 'var(--cms-success)' : 'var(--cms-muted)'}
                      />
                      <PermissionGate allowedRoles={['admin']}>
                        <CMSIconButton
                          icon="content_copy"
                          onClick={() => duplicateEmployee(emp)}
                          title="Duplicar CV"
                          color="var(--cms-muted)"
                        />
                        <CMSIconButton
                          icon="delete"
                          onClick={() => setShowDeleteConfirm(emp.id)}
                          title="Eliminar CV"
                          danger
                        />
                      </PermissionGate>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* ── CREATE CV MODAL ── */}
      <CMSModal open={showNewModal} onClose={() => setShowNewModal(false)} title="Crear Nuevo CV" icon="person_add" width={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <CMSInput
            label="Nombre Completo *"
            placeholder="Ej. Ana García López"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            icon="person"
            autoFocus
          />
          <CMSInput
            label="Correo Electrónico"
            type="email"
            placeholder="ana@empresa.com"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            icon="email"
          />
          <CMSSelect
            label="Especialización"
            value={newRole}
            onChange={e => setNewRole(e.target.value)}
            options={[
              { value: 'ux_ui', label: '🎨 UX/UI Designer' },
              { value: 'frontend', label: '💻 Frontend Developer' },
              { value: 'backend', label: '⚙️ Backend Developer' },
            ]}
          />
          <p style={{ fontSize: 12, color: 'var(--cms-muted)', margin: 0, padding: '12px 14px', background: 'var(--cms-surface-2)', borderRadius: 10, lineHeight: 1.6 }}>
            Se creará automáticamente el perfil con la plantilla estándar de Room of Experts. Podrás personalizar todos los bloques desde el editor.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="cms-btn-primary" style={{ flex: 1, padding: '10px' }} onClick={createEmployee}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_circle</span>
              Crear e Ir al Editor
            </button>
            <button className="cms-btn-ghost" style={{ flex: 1, padding: '10px' }} onClick={() => setShowNewModal(false)}>Cancelar</button>
          </div>
        </div>
      </CMSModal>

      {/* ── DELETE CONFIRM ── */}
      <CMSConfirmDialog
        open={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && deleteEmployee(showDeleteConfirm)}
        title="Eliminar CV"
        message="¿Estás seguro de que deseas eliminar este CV? Se perderán todos los datos y el historial de versiones. Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar"
        danger
      />
    </div>
  );
};
