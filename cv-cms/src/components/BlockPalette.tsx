import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../stores/editorStore';
import type { CVBlock } from '../types/cv.types';
import { CMSSearchInput } from './CMSAtoms';

interface BlockDef {
  type: string;
  label: string;
  icon: string;
  desc: string;
  category: string;
  isPhase2?: boolean;
}

const BLOCK_CATEGORIES = [
  { id: 'estructura', label: 'Estructura', icon: 'space_dashboard' },
  { id: 'personal', label: 'Perfil', icon: 'person' },
  { id: 'showcase', label: 'Showcases', icon: 'star', isPhase2: true },
  { id: 'interaccion', label: 'Interacción', icon: 'send' },
];

const ALL_BLOCKS: BlockDef[] = [
  // Estructura
  { type: 'hero', label: 'Hero / Portada', icon: 'badge', desc: 'Nombre, foto y título principal del perfil', category: 'estructura' },
  { type: 'stats', label: 'Estadísticas', icon: 'bar_chart', desc: 'Métricas de impacto: proyectos, años, eficiencia', category: 'estructura' },
  { type: 'footer', label: 'Footer', icon: 'bottom_panel_open', desc: 'Copyright y links sociales', category: 'estructura' },

  // Perfil
  { type: 'info_card', label: 'Información Personal', icon: 'contact_mail', desc: 'Email, teléfono y modalidad de trabajo', category: 'personal' },
  { type: 'languages', label: 'Idiomas', icon: 'translate', desc: 'Gráficos circulares de niveles de idioma', category: 'personal' },
  { type: 'skills_chart', label: 'Spider Chart de Skills', icon: 'radar', desc: 'Visualización de habilidades en gráfico araña', category: 'personal' },
  { type: 'aptitudes', label: 'Aptitudes Clave', icon: 'checklist', desc: 'Lista de competencias principales', category: 'personal' },
  { type: 'certifications', label: 'Certificaciones', icon: 'verified', desc: 'Cursos y títulos certificados', category: 'personal' },
  { type: 'experience', label: 'Experiencia Laboral', icon: 'work_history', desc: 'Timeline interactivo de empleos', category: 'personal' },
  { type: 'services', label: 'Servicios', icon: 'home_repair_service', desc: 'Cards expandibles de servicios ofrecidos', category: 'personal' },
  { type: 'portfolio', label: 'Portafolio', icon: 'photo_library', desc: 'Galería visual de proyectos con impacto', category: 'personal' },
  { type: 'recommendations', label: 'Recomendaciones', icon: 'reviews', desc: 'Testimonios reales de clientes y colegas', category: 'personal' },

  // Showcases Phase 2
  { type: 'uxui_showcase', label: 'Showcase UX/UI', icon: 'palette', desc: 'Sliders de rediseño + embed vivo de Figma', category: 'showcase', isPhase2: true },
  { type: 'frontend_showcase', label: 'Showcase Frontend', icon: 'code', desc: 'Sandbox interactivo + métricas de Lighthouse', category: 'showcase', isPhase2: true },
  { type: 'backend_showcase', label: 'Showcase Backend', icon: 'account_tree', desc: 'Diagramas de arquitectura + snippets técnicos', category: 'showcase', isPhase2: true },

  // Interacción
  { type: 'clients', label: 'Clientes', icon: 'business', desc: 'Carrusel de logos de empresas clientes', category: 'interaccion' },
  { type: 'contact', label: 'Contacto', icon: 'send', desc: 'CTA de contacto con email directo', category: 'interaccion' },
  { type: 'blog', label: 'Artículos', icon: 'article', desc: 'Grid de artículos o publicaciones recientes', category: 'interaccion' },
];

const DEFAULT_PROPS: Record<string, object> = {
  hero: { name: 'Nombre Apellido', role: 'Cargo / Posición', location: 'Ciudad, País', avatar: '', bgImage: '' },
  info_card: { email: 'email@ejemplo.com', phone: '+52 000 000 0000', workMode: 'Remoto' },
  languages: { languages: [{ name: 'Español', level: 100 }, { name: 'Inglés', level: 85 }] },
  skills_chart: { skills: [{ label: 'UX', value: 90 }, { label: 'UI', value: 85 }, { label: 'Research', value: 80 }] },
  aptitudes: { items: ['Atomic Design', 'Design Systems', 'User Research', 'Prototyping'] },
  certifications: { items: [{ title: 'Certificación', issuer: 'Institución', date: '2024' }] },
  stats: { stats: [{ value: '5+', label: 'Años de Experiencia', icon: 'workspace_premium' }] },
  experience: { items: [{ role: 'Cargo', company: 'Empresa', period: '2024 — Actual', description: 'Descripción del rol', icon: 'work' }] },
  services: { items: [{ title: 'Servicio', description: 'Descripción corta', extendedDesc: 'Descripción larga', icon: 'star' }] },
  portfolio: { items: [{ title: 'Proyecto', image: 'https://picsum.photos/seed/p1/800/600', description: 'Descripción', category: 'uiDesign', impact: '', tags: [] }] },
  recommendations: { items: [{ name: 'Nombre', role: 'Cargo', text: 'Recomendación...', avatar: '', rating: 5 }] },
  clients: { clients: [{ name: 'Cliente', logo: '' }] },
  contact: { email: 'email@ejemplo.com', headline: '¿Trabajamos juntos?', subtext: 'Estoy disponible para nuevas oportunidades.' },
  blog: { posts: [{ title: 'Artículo', image: '', excerpt: '', content: '' }] },
  footer: { copyright: '© 2024 Nombre. Todos los derechos reservados.', links: [{ label: 'LinkedIn', url: '#' }] },
  uxui_showcase: { figmaUrl: '', figmaTitle: '', sliderItems: [{ before: '', after: '', label: 'Antes y Después' }] },
  frontend_showcase: { sandboxUrl: '', lighthouse: { performance: 95, accessibility: 100, bestPractices: 90, seo: 100 }, techStack: ['React', 'TypeScript'] },
  backend_showcase: { mermaidDiagram: 'graph TD; A-->B;', codeSnippet: 'const x = 10;', language: 'typescript', metrics: [{ label: 'Latencia', value: '50ms' }] },
};

export const BlockPalette: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const addBlock = useEditorStore((s) => s.addBlock);
  const page = useEditorStore((s) => s.page);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let blocks = ALL_BLOCKS;
    if (search.trim()) {
      const q = search.toLowerCase();
      blocks = blocks.filter(b => b.label.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q));
    } else if (activeCategory) {
      blocks = blocks.filter(b => b.category === activeCategory);
    }
    return blocks;
  }, [search, activeCategory]);

  const handleAdd = (type: string) => {
    const newBlock: CVBlock = {
      id: `block-${type}-${Date.now()}`,
      type: type as CVBlock['type'],
      order: page?.blocks.length || 0,
      visible: true,
      props: DEFAULT_PROPS[type] || {},
    } as CVBlock;
    addBlock(newBlock);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      style={{ borderBottom: '1px solid var(--cms-border)', background: 'var(--cms-surface)', maxHeight: 480, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ padding: '12px 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--cms-muted)' }}>Agregar Bloque</span>
        <button onClick={onClose} className="cms-btn-ghost" style={{ padding: '4px 6px' }} aria-label="Cerrar paleta">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '0 12px 10px', flexShrink: 0 }}>
        <CMSSearchInput value={search} onChange={setSearch} placeholder="Buscar bloque..." />
      </div>

      {/* Category Pills */}
      {!search && (
        <div style={{ padding: '0 12px 10px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
              border: '1px solid',
              borderColor: !activeCategory ? 'var(--cms-primary)' : 'var(--cms-border)',
              color: !activeCategory ? 'var(--cms-primary)' : 'var(--cms-muted)',
              background: !activeCategory ? 'rgba(0,164,255,0.08)' : 'transparent',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}
          >
            Todos
          </button>
          {BLOCK_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              style={{
                padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                border: '1px solid',
                borderColor: activeCategory === cat.id ? 'var(--cms-primary)' : 'var(--cms-border)',
                color: activeCategory === cat.id ? 'var(--cms-primary)' : 'var(--cms-muted)',
                background: activeCategory === cat.id ? 'rgba(0,164,255,0.08)' : 'transparent',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              {cat.label}
              {cat.isPhase2 && <span style={{ fontSize: 8, background: 'var(--cms-primary)', color: '#000', padding: '1px 4px', borderRadius: 3, fontWeight: 800 }}>P2</span>}
            </button>
          ))}
        </div>
      )}

      {/* Block List */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '0 6px 10px' }}>
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--cms-muted)', fontSize: 12 }}>
              No se encontraron bloques para "{search}"
            </div>
          ) : (
            filtered.map((block, i) => (
              <motion.button
                key={block.type}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => handleAdd(block.type)}
                style={{
                  width: '100%', background: 'none', border: '1px solid transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 10, transition: 'all 0.15s', textAlign: 'left',
                  marginBottom: 2,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--cms-surface-2)';
                  e.currentTarget.style.borderColor = 'var(--cms-border)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
                aria-label={`Agregar bloque ${block.label}`}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: block.isPhase2 ? 'rgba(0,164,255,0.15)' : 'var(--cms-surface-2)',
                  border: `1px solid ${block.isPhase2 ? 'rgba(0,164,255,0.3)' : 'var(--cms-border)'}`,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: block.isPhase2 ? 'var(--cms-primary)' : 'var(--cms-muted)' }}>{block.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--cms-text)', margin: 0 }}>{block.label}</p>
                    {block.isPhase2 && <span style={{ fontSize: 8, background: 'rgba(0,164,255,0.2)', color: 'var(--cms-primary)', padding: '1px 5px', borderRadius: 3, fontWeight: 800, letterSpacing: 0.5, flexShrink: 0 }}>PHASE 2</span>}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--cms-muted)', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{block.desc}</p>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--cms-border)', flexShrink: 0 }}>add</span>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
