import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../stores/editorStore';
import { useVersionStore } from '../stores/versionStore';
import { useAuthStore } from '../stores/authStore';
import { FALSONE_TEMPLATE } from '../data/defaultTemplate';
import { supabase } from '../lib/supabase';
import type { CVBlock, CVPage } from '../types/cv.types';
import { BlockPropertyPanel } from '../components/BlockPropertyPanel';
import { AISettingsPanel } from '../components/AISettingsPanel';
import { BlockPalette } from '../components/BlockPalette';
import {
  PublicHero, PublicStats, PublicExperience, PublicServices,
  PublicInfoCard, PublicSkillChart, PublicAptitudes,
  PublicPortfolio, PublicRecommendations, PublicBlog, PublicFooter,
  PublicFloatingNav, PublicContact, PublicLanguages, PublicCertifications,
  PublicUXUIShowcase, PublicFrontendShowcase, PublicBackendShowcase,
} from '../components/PublicBlocks';
import { PermissionGate } from '../components/PermissionGate';
import {
  useToast, CMSPublishModal, CMSModal, CMSIconButton, CMSStatusBadge,
  CMSConfirmDialog
} from '../components/CMSAtoms';
import type { VersionSnapshot } from '../stores/versionStore';

// ─────────────────────────────────────────────
// BLOCK METADATA
// ─────────────────────────────────────────────
const BLOCK_LABELS: Record<string, string> = {
  hero: 'Inicio / Portada', 
  info_card: 'Información Personal', 
  languages: 'Idiomas',
  skills_chart: 'Benchmarking de Skills', 
  aptitudes: 'Aptitudes Principales', 
  stats: 'Métricas de Impacto',
  experience: 'Historial y Educación', 
  services: 'Especialidades / Servicios', 
  portfolio: 'Trabajos Destacados',
  recommendations: 'Testimonios / Clientes', 
  contact: 'Pregúntale al diseñador',
  blog: 'Artículos / Blog', 
  footer: 'Footer / Redes', 
  certifications: 'Certificaciones',
  uxui_showcase: 'Showcase UX/UI', 
  frontend_showcase: 'Showcase Frontend', 
  backend_showcase: 'Showcase Backend',
};

const BLOCK_ICONS: Record<string, string> = {
  hero: 'badge', info_card: 'contact_mail', languages: 'translate',
  skills_chart: 'radar', aptitudes: 'checklist', stats: 'bar_chart',
  experience: 'work_history', services: 'home_repair_service', portfolio: 'photo_library',
  recommendations: 'reviews', clients: 'business', contact: 'send',
  blog: 'article', footer: 'bottom_panel_open', certifications: 'verified',
  uxui_showcase: 'palette', frontend_showcase: 'terminal', backend_showcase: 'account_tree',
};

// ─────────────────────────────────────────────
// BLOCK GROUPS CONFIGURATION
// ─────────────────────────────────────────────
const BLOCK_GROUPS = [
  {
    id: 'identity',
    label: 'Identidad & Perfil',
    icon: 'person',
    types: ['hero', 'info_card', 'languages', 'skills_chart', 'aptitudes'],
  },
  {
    id: 'experience',
    label: 'Trayectoria',
    icon: 'work_history',
    types: ['experience', 'certifications'],
  },
  {
    id: 'portfolio',
    label: 'Portafolio & Impacto',
    icon: 'photo_library',
    types: ['services', 'portfolio', 'stats', 'uxui_showcase', 'frontend_showcase', 'backend_showcase'],
  },
  {
    id: 'social',
    label: 'Social & Feedback',
    icon: 'chat',
    types: ['recommendations', 'blog', 'contact', 'footer'],
  },
];

// ─────────────────────────────────────────────
// SORTABLE BLOCK ROW (Refactored for groups)
// ─────────────────────────────────────────────
const SortableBlockRow: React.FC<{
  block: CVBlock; isSelected: boolean;
  onSelect: () => void; onRemove: () => void; onToggle: () => void;
  onDuplicate: () => void;
}> = ({ block, isSelected, onSelect, onRemove, onToggle, onDuplicate }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 };
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      style={{
        ...style,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px', borderRadius: 8, marginBottom: 2,
        background: isSelected ? 'rgba(0,164,255,0.08)' : 'transparent',
        cursor: 'pointer',
        border: `1px solid ${isSelected ? 'rgba(0,164,255,0.2)' : 'transparent'}`,
        transition: 'all 0.1s',
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div {...listeners} {...attributes} style={{ cursor: 'grab', opacity: 0.3 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>drag_indicator</span>
      </div>
      <span className="material-symbols-outlined" style={{ fontSize: 16, color: isSelected ? 'var(--cms-primary)' : 'var(--cms-muted)', opacity: block.visible ? 1 : 0.4 }}>
        {BLOCK_ICONS[block.type] || 'widgets'}
      </span>
      <span style={{ 
        flex: 1, fontSize: 11, fontWeight: 600, 
        color: isSelected ? 'var(--cms-text)' : 'var(--cms-muted)',
        opacity: block.visible ? 1 : 0.5,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' 
      }}>
        {BLOCK_LABELS[block.type] || block.type}
      </span>

      <div style={{ display: 'flex', gap: 2, opacity: showActions || isSelected ? 1 : 0 }}>
        <CMSIconButton icon={block.visible ? 'visibility' : 'visibility_off'} size={12} onClick={onToggle} />
        <CMSIconButton icon="delete" size={12} danger onClick={onRemove} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// BLOCK OVERLAY ZONE — clickable region over iframe
// Maps visual sections of localhost:3000 to CMS groups/blocks
// ─────────────────────────────────────────────
const BlockOverlayZone: React.FC<{
  label: string;
  blockType: string;
  top: number;
  height: number;
  blocks: CVBlock[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ label, blockType, top, height, blocks, selectedId, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const block = blocks.find(b => b.type === blockType);
  if (!block) return null;

  const group = BLOCK_GROUPS.find(g => g.types.includes(blockType));
  const groupId = group ? `group:${group.id}` : block.id;
  const isSelected = selectedId === block.id || selectedId === groupId;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(groupId); }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: 0, right: 0,
        top, height,
        pointerEvents: 'auto',
        cursor: 'pointer',
        border: `2px solid ${isSelected ? 'rgba(0,164,255,0.9)' : isHovered ? 'rgba(0,164,255,0.5)' : 'transparent'}`,
        borderRadius: 8,
        background: isSelected ? 'rgba(0,164,255,0.06)' : isHovered ? 'rgba(0,164,255,0.03)' : 'transparent',
        transition: 'all 0.15s ease',
        zIndex: 1,
      }}
      title={`Clic para editar grupo: ${group?.label || label}`}
    >
      {(isSelected || isHovered) && (
        <div style={{
          position: 'absolute',
          top: 8, left: 8,
          background: isSelected ? '#00a4ff' : 'rgba(0,164,255,0.15)',
          backdropFilter: 'blur(8px)',
          color: isSelected ? '#000' : '#00a4ff',
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '3px 10px',
          borderRadius: 6,
          border: isSelected ? 'none' : '1px solid rgba(0,164,255,0.4)',
          fontFamily: "'Inter', sans-serif",
        }}>
          {isSelected ? `✏ Editando ${group?.label || 'Bloque'}` : label}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// VERSIONS PANEL
// ─────────────────────────────────────────────
const VersionsPanel: React.FC<{
  expertId: string;
  onRestore: (blocks: CVBlock[]) => void;
  onClose: () => void;
}> = ({ expertId, onRestore, onClose }) => {
  const { snapshots, deleteSnapshot, fetchSnapshots } = useVersionStore();
  const toast = useToast();

  const handleRestore = (snap: VersionSnapshot) => {
    onRestore(snap.blocks);
    toast.add(`Versión "${snap.label}" restaurada localmente. ¡No olvides guardar!`, 'success');
    onClose();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--cms-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--cms-primary)', fontSize: 18 }}>history</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cms-text)', flex: 1 }}>Historial de Versiones</span>
        <button onClick={onClose} className="cms-btn-ghost" style={{ padding: '4px 6px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {snapshots.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--cms-muted)', fontSize: 13, padding: 40 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 12, opacity: 0.3 }}>history</span>
            Sin versiones guardadas aún
          </div>
        ) : (
          snapshots.map((snap, i) => (
            <div
              key={snap.id}
              style={{
                padding: '12px', borderRadius: 10, marginBottom: 6,
                background: snap.is_published ? 'rgba(0,229,160,0.05)' : 'var(--cms-surface-2)',
                border: `1px solid ${snap.is_published ? 'rgba(0,229,160,0.2)' : 'var(--cms-border)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cms-text)' }}>{snap.label}</span>
                    {snap.is_published && <span style={{ fontSize: 9, background: 'rgba(0,229,160,0.15)', color: 'var(--cms-success)', padding: '1px 6px', borderRadius: 4, fontWeight: 800, letterSpacing: 0.5 }}>PUBLICADO</span>}
                    {snap.is_draft && <span style={{ fontSize: 9, background: 'rgba(107,136,181,0.15)', color: 'var(--cms-muted)', padding: '1px 6px', borderRadius: 4, fontWeight: 800, letterSpacing: 0.5 }}>BORRADOR</span>}
                    {i === 0 && <span style={{ fontSize: 9, background: 'rgba(0,164,255,0.15)', color: 'var(--cms-primary)', padding: '1px 6px', borderRadius: 4, fontWeight: 800, letterSpacing: 0.5 }}>RECIENTE</span>}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--cms-muted)', margin: 0 }}>
                    {new Date(snap.created_at).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                    {' · '}{snap.blocks.filter(b => b.visible).length} bloques
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button
                    onClick={() => handleRestore(snap)}
                    className="cms-btn-ghost"
                    style={{ padding: '4px 10px', fontSize: 11 }}
                    title="Restaurar esta versión"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>restore</span>
                    Restaurar
                  </button>
                  {!snap.is_published && (
                    <CMSIconButton icon="delete" danger size={15} title="Eliminar versión" onClick={() => deleteSnapshot(snap.id)} />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// DEVICE FRAME WIDTHS
// ─────────────────────────────────────────────
const DEVICE_WIDTHS = { desktop: '100%', tablet: 768, mobile: 390 } as const;
type DeviceMode = keyof typeof DEVICE_WIDTHS;

// Production URL: set VITE_PORTFOLIO_URL in env, or falls back to known Vercel URL
const PORTFOLIO_URL = import.meta.env.VITE_PORTFOLIO_URL 
  || (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
      ? 'https://cv-experts-2-0.vercel.app'
      : 'http://localhost:3000');

export const EditorPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useAuthStore(s => s.user);

  const {
    page, setPage, selectedBlockId, selectBlock, moveBlock,
    toggleBlockVisibility, removeBlock, addBlock, markSaved, isDirty, undo, redo,
  } = useEditorStore();

  const { saveSnapshot, markAsPublished, getPublishedSnapshot, fetchSnapshots } = useVersionStore();

  // Device / zoom state
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [canvasZoom, setCanvasZoom] = useState(100);
  const canvasRef = useRef<HTMLElement>(null);
  const blockRowRefs = useRef<Record<string, HTMLDivElement | null>>({}); 

  const [isSaving, setIsSaving] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [employee, setEmployee] = useState<any | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // ── CARGAR DATOS DESDE SUPABASE ──
    const loadInitialData = async () => {
      if (!employeeId) return;
      try {
        // 1. Cargar el experto
        const { data: exp, error: expErr } = await supabase
          .from('experts')
          .select('*')
          .eq('id', employeeId)
          .single();

        if (expErr) throw expErr;
        setEmployee({
          id: exp.id,
          fullName: exp.full_name,
          slug: exp.slug,
          email: exp.email,
          isPublished: exp.is_published
        });

        // 2. Cargar la página
        const { data: p, error: pErr } = await supabase
          .from('pages')
          .select('*')
          .eq('expert_id', employeeId)
          .single();

        if (pErr) throw pErr;

        let finalBlocks = [...p.blocks];
        
        // --- AUTO-REPAIR: Inyectar bloques faltantes ---
        const existingTypes = p.blocks.map((b: any) => b.type);
        const missingBlocks = FALSONE_TEMPLATE.blocks.filter(b => !existingTypes.includes(b.type));
        
        if (missingBlocks.length > 0) {
          console.log(`[CMS] Inyectando ${missingBlocks.length} bloques faltantes:`, missingBlocks.map(b => b.type));
          missingBlocks.forEach(mb => {
            // Benchmarking (skills_chart) should always be visible by default
            const isVisibleByDefault = mb.type === 'skills_chart';
            finalBlocks.push({ ...mb, id: `${mb.type}-${Date.now()}`, visible: isVisibleByDefault });
          });
        }

        // --- FORCE VISIBILITY & DATA REPAIR: Asegurar que Benchmarking esté visible y tenga datos válidos ---
        finalBlocks = finalBlocks.map(b => {
          if (b.type === 'skills_chart') {
            const hasSkills = b.props?.skills && b.props.skills.length > 0;
            return { 
              ...b, 
              visible: true, 
              props: { 
                ...b.props, 
                skills: hasSkills ? b.props.skills : (FALSONE_TEMPLATE.blocks.find(fb => fb.type === 'skills_chart')?.props.skills || [])
              } 
            };
          }
          if (b.type === 'certifications' && (!b.props?.items || b.props.items.length === 0)) {
            return {
              ...b,
              props: {
                ...b.props,
                items: FALSONE_TEMPLATE.blocks.find(fb => fb.type === 'certifications')?.props.items || []
              }
            };
          }
          return b;
        });

        setPage({
          id: p.id,
          employeeId: p.expert_id,
          blocks: finalBlocks,
          meta: p.meta,
          templateId: 'falsone',
          version: 1
        } as CVPage);

        // 3. Cargar versiones desde Supabase
        await fetchSnapshots(employeeId);
      } catch (err: any) {
        toast.add(`Error cargando el editor: ${err.message}`, 'error');
      }
    };

    loadInitialData();
  }, [employeeId, setPage]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) moveBlock(String(active.id), String(over.id));
  };

  const handleSave = useCallback(async (isAutoSave = false) => {
    if (!page || !employeeId) return;
    setIsSaving(true);
    try {
      // ── GUARDAR EN SUPABASE ──
      const { error } = await supabase
        .from('pages')
        .update({
          blocks: page.blocks,
          meta: page.meta,
          updated_at: new Date().toISOString()
        })
        .eq('expert_id', employeeId);

      if (error) throw error;

      // También actualizamos el objeto 'updated_at' del experto
      await supabase
        .from('experts')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', employeeId);

      // Save version snapshot to Supabase (historical record)
      await saveSnapshot(employeeId, page.blocks, isAutoSave ? undefined : `Guardado manual ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`, false);

      markSaved();
      if (!isAutoSave) toast.add('Cambios guardados e impecablemente sincronizados', 'success');
    } catch (err: any) {
      toast.add(`Error al guardar: ${err.message}`, 'error');
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [page, employeeId, saveSnapshot, markSaved, toast]);

  const handleSaveDraft = async () => {
    if (!page || !employeeId) return;
    try {
      await handleSave();
      await saveSnapshot(employeeId, page.blocks, `Borrador ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`, true);
      toast.add('Borrador guardado en la nube', 'info');
    } catch {
      toast.add('Error al guardar borrador', 'error');
    }
  };

  const handlePublish = async () => {
    if (!page || !employeeId) return;
    try {
      // 1. Guardar cambios primero
      const { error: pageErr } = await supabase
        .from('pages')
        .update({
          blocks: page.blocks,
          meta: page.meta,
          updated_at: new Date().toISOString()
        })
        .eq('expert_id', employeeId);

      if (pageErr) throw pageErr;

      // 2. Marcar como publicado en la tabla de expertos
      const { error: expErr } = await supabase
        .from('experts')
        .update({ 
          is_published: true, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', employeeId);

      if (expErr) throw expErr;

      // 3. Crear snapshot de versión en Supabase
      const snapId = await saveSnapshot(employeeId, page.blocks, `Publicado ${new Date().toLocaleDateString('es-MX', { dateStyle: 'short' })}`, false);
      if (snapId) await markAsPublished(snapId, employeeId);

      // Actualizar estado local para UI
      setEmployee((prev: any) => ({ ...prev, isPublished: true }));
      markSaved();

      toast.add(`¡CV de ${employee?.fullName || 'experto'} publicado e impecable en la nube!`, 'success', 5000);
    } catch (err: any) {
      toast.add(`Error al publicar: ${err.message}`, 'error');
    }
  };

  const handleRestoreVersion = (blocks: CVBlock[]) => {
    if (!page) return;
    setPage({ ...page, blocks });
  };

  const handleRemoveBlock = (blockId: string) => {
    setShowDeleteConfirm(blockId);
  };

  // ── Sincronización de Scroll Inteligente ──
  useEffect(() => {
    if (selectedBlockId && !previewMode) {
      console.log(`[CMS] Solicitando scroll a bloque: ${selectedBlockId}`);
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'CMS_SELECT_BLOCK',
            blockId: selectedBlockId
          }, '*');
        }
      });
    }
  }, [selectedBlockId, previewMode]);

  // ── PUENTE DE DATOS HACIA EL PORTAFOLIO (iframe) ──
  // Envía datos al iframe SIEMPRE que `page` cambia (sin límite de tiempo)
  useEffect(() => {
    if (!page) return;

    const syncData = () => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'CMS_UPDATE_PAGE', page }, '*');
        }
      });
    };

    // Enviar inmediatamente cuando page cambia
    syncData();

    // Mantener envío periódico durante los primeros 10 segundos para asegurar
    // que el iframe esté listo (puede tardar en cargar)
    const interval = setInterval(syncData, 500);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    const handlePortfolioMessage = (event: MessageEvent) => {
      // Cuando el iframe está listo, enviar datos inmediatamente
      if (event.data?.type === 'IFRAME_READY') {
        syncData();
      }
      // Escuchar posición de bloque para scroll preciso
      if (event.data?.type === 'BLOCK_POSITION' && canvasRef.current) {
        (canvasRef.current as HTMLElement).scrollTo({
          top: event.data.offsetTop,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('message', handlePortfolioMessage);

    return () => {
      window.removeEventListener('message', handlePortfolioMessage);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [page]); // Se re-ejecuta CADA VEZ que page cambia

  // Auto-save every 60 seconds when dirty
  useEffect(() => {
    if (!isDirty || !page || !employeeId) return;
    const timer = setTimeout(() => {
      handleSave(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, [isDirty, page, employeeId, handleSave]);

  const confirmRemoveBlock = (blockId: string) => {
    removeBlock(blockId);
    toast.add('Bloque eliminado', 'info');
  };

  // Duplicate a block — clones it with a new id right after
  const handleDuplicateBlock = (blockId: string) => {
    if (!page) return;
    const src = page.blocks.find((b: CVBlock) => b.id === blockId);
    if (!src) return;
    const newBlock = {
      ...src,
      id: `${src.type}-${Date.now()}`,
      order: src.order + 0.1,
      props: { ...(src.props as Record<string, unknown>) },
    } as CVBlock;
    addBlock(newBlock);
    selectBlock(newBlock.id);
    toast.add(`Bloque "${BLOCK_LABELS[src.type] || src.type}" duplicado`, 'success');
  };

  // Share link
  const handleShareLink = async () => {
    const url = `${PORTFOLIO_URL}/cv/${employee?.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      toast.add('URL copiada al portapapeles', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.add(`URL: ${url}`, 'info', 6000);
    }
  };

  const isPublished = !!getPublishedSnapshot(employeeId || '');

  if (!page) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--cms-bg)' }}>
      <div style={{ textAlign: 'center', color: 'var(--cms-muted)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12, opacity: 0.4 }}>pending</span>
        <p style={{ fontSize: 14 }}>Cargando editor...</p>
      </div>
    </div>
  );

  const selectedBlock = page.blocks.find((b: CVBlock) => b.id === selectedBlockId);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--cms-bg)' }}>
      {/* ── TOP TOOLBAR ── */}
      <header style={{
        background: 'var(--cms-surface)', borderBottom: '1px solid var(--cms-border)',
        padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        {/* Back */}
        <button className="cms-btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => navigate('/dashboard')}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Dashboard
        </button>

        <div style={{ width: 1, height: 20, background: 'var(--cms-border)', flexShrink: 0 }} />

        {/* CV Name + Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cms-text)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {employee?.fullName || 'Editor de CV'}
          </span>
          <CMSStatusBadge published={employee?.isPublished || false} />
          {isDirty && (
            <span style={{ fontSize: 10, color: 'var(--cms-warning)', background: 'rgba(255,171,0,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, letterSpacing: 0.5, border: '1px solid rgba(255,171,0,0.2)' }}>
              SIN GUARDAR
            </span>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {/* Undo / Redo */}
          <CMSIconButton icon="undo" onClick={undo} title="Deshacer (Ctrl+Z)" />
          <CMSIconButton icon="redo" onClick={redo} title="Rehacer (Ctrl+Y)" />

          <div style={{ width: 1, height: 20, background: 'var(--cms-border)', margin: '0 2px' }} />

          {/* Versions */}
          <button
            className="cms-btn-ghost"
            style={{ padding: '5px 10px', fontSize: 12 }}
            onClick={() => setShowVersions(!showVersions)}
            aria-pressed={showVersions}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>history</span>
            Versiones
          </button>

          {/* Preview */}
          <button
            className="cms-btn-ghost"
            style={{ padding: '5px 10px', fontSize: 12, color: previewMode ? 'var(--cms-primary)' : undefined }}
            onClick={() => setPreviewMode(!previewMode)}
            aria-pressed={previewMode}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{previewMode ? 'edit' : 'visibility'}</span>
            {previewMode ? 'Editar' : 'Preview'}
          </button>

          <div style={{ width: 1, height: 20, background: 'var(--cms-border)', margin: '0 2px' }} />

          {/* Save Draft */}
          <button className="cms-btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={handleSaveDraft}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>draft</span>
            Borrador
          </button>

          {/* Save */}
          <button
            className="cms-btn-ghost"
            style={{ padding: '5px 12px', fontSize: 12 }}
            onClick={() => handleSave()}
            disabled={isSaving || !isDirty}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{isSaving ? 'sync' : 'save'}</span>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>

          {/* Publish */}
          <button className="cms-btn-success" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => setShowPublishModal(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>rocket_launch</span>
            {isPublished ? 'Actualizar' : 'Publicar'}
          </button>
        </div>
      </header>

      {/* ── CANVAS TOOLBAR (device + zoom + share) ── */}
      {!previewMode && (
        <div style={{
          background: 'var(--cms-surface)', borderBottom: '1px solid var(--cms-border)',
          padding: '0 16px', height: 40, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
        }}>
          {/* Device switcher */}
          <div style={{ display: 'flex', background: 'var(--cms-surface-2)', borderRadius: 8, padding: 2, gap: 2 }}>
            {(['desktop', 'tablet', 'mobile'] as DeviceMode[]).map(d => {
              const icons: Record<DeviceMode, string> = { desktop: 'desktop_windows', tablet: 'tablet_mac', mobile: 'smartphone' };
              const labels: Record<DeviceMode, string> = { desktop: 'Escritorio', tablet: 'Tablet (768px)', mobile: 'Móvil (390px)' };
              return (
                <button key={d} title={labels[d]} onClick={() => setDeviceMode(d)}
                  style={{ padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', background: deviceMode === d ? 'var(--cms-primary)' : 'transparent', color: deviceMode === d ? '#000' : 'var(--cms-muted)', transition: 'all 0.15s' }}
                  aria-pressed={deviceMode === d}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{icons[d]}</span>
                </button>
              );
            })}
          </div>

          {/* Zoom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
            <button onClick={() => setCanvasZoom(z => Math.max(50, z - 10))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cms-muted)', padding: '2px 4px', borderRadius: 4 }} title="Reducir zoom"><span className="material-symbols-outlined" style={{ fontSize: 15 }}>remove</span></button>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--cms-muted)', minWidth: 36, textAlign: 'center', cursor: 'pointer' }} onClick={() => setCanvasZoom(100)} title="Restaurar 100%">{canvasZoom}%</span>
            <button onClick={() => setCanvasZoom(z => Math.min(150, z + 10))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cms-muted)', padding: '2px 4px', borderRadius: 4 }} title="Aumentar zoom"><span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span></button>
          </div>

          <div style={{ flex: 1 }} />

          {/* Share link */}
          <button className="cms-btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={handleShareLink} title="Copiar URL pública">
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: isCopied ? 'var(--cms-success)' : undefined }}>{isCopied ? 'check' : 'share'}</span>
            {isCopied ? 'Copiado' : 'Compartir'}
          </button>

          {/* Open public */}
          <button className="cms-btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => window.open(`${PORTFOLIO_URL}/cv/${employee?.slug}`, '_blank')} title="Ver CV público">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
            Ver público
          </button>

          {/* Visible blocks count */}
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cms-muted)', textTransform: 'uppercase', letterSpacing: 1, padding: '2px 8px', background: 'var(--cms-surface-2)', borderRadius: 6 }}>
            {page.blocks.filter(b => b.visible).length}/{page.blocks.length} visibles
          </span>
        </div>
      )}

      {/* ── MAIN LAYOUT — 3 columns, each independently scrollable ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* LEFT SIDEBAR — Blocks */}
        <AnimatePresence>
          {!previewMode && !showVersions && (
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                width: 256, borderRight: '1px solid var(--cms-border)',
                background: 'var(--cms-surface)', display: 'flex',
                flexDirection: 'column', flexShrink: 0,
                height: '100%', overflow: 'hidden',
              }}
            >
              {/* Groups & Global Config */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                
                {/* GLOBAL CONFIG SECTION */}
                <div style={{ padding: '16px 12px 12px', borderBottom: '1px solid var(--cms-border)' }}>
                  <h5 style={{ fontSize: 9, fontWeight: 800, color: 'var(--cms-muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 }}>General</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button
                      onClick={() => selectBlock('global-config')}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                        background: selectedBlockId === 'global-config' ? 'rgba(0,164,255,0.12)' : 'transparent',
                        border: `1px solid ${selectedBlockId === 'global-config' ? 'var(--cms-primary)' : 'transparent'}`,
                        color: selectedBlockId === 'global-config' ? 'var(--cms-primary)' : 'var(--cms-text)',
                        cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>settings</span>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Configuración Global</span>
                    </button>
                    <button
                      onClick={() => selectBlock('ai-settings')}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                        background: selectedBlockId === 'ai-settings' ? 'rgba(0,164,255,0.12)' : 'transparent',
                        border: `1px solid ${selectedBlockId === 'ai-settings' ? 'var(--cms-primary)' : 'transparent'}`,
                        color: selectedBlockId === 'ai-settings' ? 'var(--cms-primary)' : 'var(--cms-text)',
                        cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>auto_awesome</span>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Asistente IA</span>
                    </button>
                  </div>
                </div>

                {/* LOGICAL GROUPS */}
                <div style={{ padding: '16px 4px' }}>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    {BLOCK_GROUPS.map((group) => {
                      const groupBlocks = page.blocks.filter(b => group.types.includes(b.type));
                      // IMPROVEMENT: Group stays open if any of its child blocks are selected
                      const isChildSelected = selectedBlockId && groupBlocks.some(b => b.id === selectedBlockId);
                      const isGroupHeaderSelected = selectedBlockId === `group:${group.id}`;
                      const isGroupSelected = isGroupHeaderSelected || isChildSelected;
                      
                      return (
                        <div key={group.id} style={{ marginBottom: 4 }}>
                          <button
                            onClick={() => {
                              // If a child is selected and we click the group, we toggle the group state
                              // If it's open, clicking group header closes it.
                              selectBlock(isGroupSelected ? null : `group:${group.id}`);
                            }}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                              background: isGroupSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                              color: isGroupSelected ? 'var(--cms-primary)' : 'var(--cms-text)',
                              cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', border: 'none'
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: isGroupSelected ? 'var(--cms-primary)' : 'var(--cms-muted)' }}>{group.icon}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, flex: 1 }}>{group.label}</span>
                            <span className="material-symbols-outlined" style={{ fontSize: 16, transition: 'transform 0.2s', transform: isGroupSelected ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                          </button>
                          
                          <AnimatePresence>
                            {isGroupSelected && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden', padding: '4px 8px 12px 32px' }}
                              >
                                <SortableContext items={groupBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                  {groupBlocks.map((block) => (
                                    <SortableBlockRow
                                      key={block.id}
                                      block={block}
                                      isSelected={selectedBlockId === block.id}
                                      onSelect={() => selectBlock(block.id)}
                                      onRemove={() => handleRemoveBlock(block.id)}
                                      onToggle={() => toggleBlockVisibility(block.id)}
                                      onDuplicate={() => handleDuplicateBlock(block.id)}
                                    />
                                  ))}
                                </SortableContext>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </DndContext>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* LEFT SIDEBAR — Versions (replaces block list) */}
        <AnimatePresence>
          {showVersions && !previewMode && (
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: 300, borderRight: '1px solid var(--cms-border)', background: 'var(--cms-surface)', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%', overflow: 'hidden' }}
            >
              <VersionsPanel
                expertId={employeeId!}
                onRestore={handleRestoreVersion}
                onClose={() => setShowVersions(false)}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* CENTER — Canvas (independently scrollable) */}
        <main
          ref={canvasRef as React.RefObject<HTMLElement>}
          id="editor-canvas"
          style={{
            flex: 1,
            overflowY: previewMode ? 'hidden' : 'auto',
            overflowX: 'auto',
            background: 'var(--cms-bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: previewMode ? 0 : '0 20px', // Quitamos padding vertical para que scroll sea exacto
            paddingTop: previewMode ? 0 : 80,    // Margen para el header
            position: 'relative',
            height: '100%',
            scrollBehavior: 'smooth',
          }}
          aria-label="Canvas del editor"
        >
          {/* ── PREVIEW MODE: iframe del portafolio original ── */}
          {previewMode ? (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Device frame wrapper */}
              <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflow: 'hidden',
                background: 'var(--cms-bg)',
              }}>
                <div style={{
                  width: deviceMode === 'mobile' ? 390 : deviceMode === 'tablet' ? 768 : '100%',
                  height: '100%',
                  maxWidth: '100%',
                  borderLeft: deviceMode !== 'desktop' ? '1px solid var(--cms-border)' : 'none',
                  borderRight: deviceMode !== 'desktop' ? '1px solid var(--cms-border)' : 'none',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'width 0.3s ease',
                }}>
                  <iframe
                    src={`${PORTFOLIO_URL}/preview`}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      display: 'block',
                      transform: canvasZoom !== 100 ? `scale(${canvasZoom / 100})` : undefined,
                      transformOrigin: 'top left',
                    }}
                    title="Vista Previa del Portafolio"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Preview floating bar */}
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(10, 22, 40, 0.92)', backdropFilter: 'blur(24px)',
                  border: '1px solid var(--cms-border)', borderRadius: 20,
                  padding: '10px 20px', zIndex: 200,
                  display: 'flex', alignItems: 'center', gap: 12,
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                  whiteSpace: 'nowrap',
                }}
                role="toolbar"
                aria-label="Acciones de preview"
              >
                {/* Device switcher mini */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 2, gap: 2 }}>
                  {(['desktop', 'tablet', 'mobile'] as const).map(d => {
                    const icons = { desktop: 'desktop_windows', tablet: 'tablet_mac', mobile: 'smartphone' };
                    return (
                      <button key={d} onClick={() => setDeviceMode(d)}
                        style={{ padding: '4px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', background: deviceMode === d ? 'var(--cms-primary)' : 'transparent', color: deviceMode === d ? '#000' : 'var(--cms-muted)', transition: 'all 0.15s' }}
                        title={d}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{icons[d]}</span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ width: 1, height: 16, background: 'var(--cms-border)' }} />

                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(0,164,255,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e5a0', display: 'inline-block' }} />
                  Vista Previa Live
                </span>

                <div style={{ width: 1, height: 16, background: 'var(--cms-border)' }} />

                <button className="cms-btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => setPreviewMode(false)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
                  Editar
                </button>
                <button
                  className="cms-btn-ghost"
                  style={{ padding: '5px 12px', fontSize: 12 }}
                  onClick={() => window.open(PORTFOLIO_URL, '_blank')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                  Abrir
                </button>
                <button className="cms-btn-success" style={{ padding: '6px 16px', fontSize: 12 }} onClick={() => setShowPublishModal(true)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>rocket_launch</span>
                  {isPublished ? 'Actualizar' : 'Publicar CV'}
                </button>
              </motion.div>
            </div>
          ) : (
            /* ── EDIT MODE: iframe del portafolio real + overlay de selección ── */
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              {/* Wrapper de device — sin 'height: 100%' y 'overflow: hidden' para permitir scroll natural en el main */}
              <div style={{
                width: deviceMode === 'mobile' ? 390 : deviceMode === 'tablet' ? 768 : '100%',
                maxWidth: '100%',
                position: 'relative',
                transition: 'width 0.3s ease',
                borderLeft: deviceMode !== 'desktop' ? '1px solid var(--cms-border)' : 'none',
                borderRight: deviceMode !== 'desktop' ? '1px solid var(--cms-border)' : 'none',
                background: '#010610',
                boxShadow: 'var(--cms-shadow-lg)',
                marginBottom: 100, // Espacio al final
              }}>
                {/* Portfolio iframe — Altura fija grande para mostrar todo el contenido y dejar que el CMS haga scroll */}
                <iframe
                  src={`${PORTFOLIO_URL}/preview`}
                  style={{
                    width: '100%',
                    height: 12000, // Altura extendida para soportar todo el contenido real (~11000px + margen)
                    border: 'none',
                    display: 'block',
                    transform: canvasZoom !== 100 ? `scale(${canvasZoom / 100})` : undefined,
                    transformOrigin: 'top center',
                  }}
                  title="Portafolio — Vista de Edición"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  loading="eager"
                  scrolling="no" // El scroll lo hace el CMS
                />

                {/* Overlay de selección de bloques — semi-transparente */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    pointerEvents: 'none', // solo las zonas de bloque son clickeables
                  }}
                >
                  {/* Zona Hero */}
                  <BlockOverlayZone
                    label="Inicio / Portada"
                    blockType="hero"
                    top={0} height={400}
                    selectedId={selectedBlockId}
                    blocks={page.blocks}
                    onSelect={(id: string) => selectBlock(id)}
                  />
                  {/* Zona Identidad (Info, Lang, Skills) */}
                  <BlockOverlayZone
                    label="Información y Habilidades"
                    blockType="skills_chart"
                    top={400} height={500}
                    selectedId={selectedBlockId}
                    blocks={page.blocks}
                    onSelect={(id: string) => selectBlock(id)}
                  />
                  {/* Zona Aptitudes */}
                  <BlockOverlayZone
                    label="Aptitudes Principales"
                    blockType="aptitudes"
                    top={900} height={400}
                    selectedId={selectedBlockId}
                    blocks={page.blocks}
                    onSelect={(id: string) => selectBlock(id)}
                  />
                  {/* Zona Estadísticas */}
                  <BlockOverlayZone
                    label="Métricas de Impacto"
                    blockType="stats"
                    top={1300} height={300}
                    selectedId={selectedBlockId}
                    blocks={page.blocks}
                    onSelect={(id: string) => selectBlock(id)}
                  />
                  {/* Zona Servicios */}
                  <BlockOverlayZone
                    label="Especialidades / Servicios"
                    blockType="services"
                    top={1600} height={600}
                    selectedId={selectedBlockId}
                    blocks={page.blocks}
                    onSelect={(id: string) => selectBlock(id)}
                  />
                  {/* Zona Portfolio */}
                  <BlockOverlayZone
                    label="Proyectos / Trabajos Destacados"
                    blockType="portfolio"
                    top={2200} height={1000}
                    selectedId={selectedBlockId}
                    blocks={page.blocks}
                    onSelect={(id: string) => selectBlock(id)}
                  />
                  {/* Zona Experiencia */}
                  <BlockOverlayZone
                    label="Historial y Educación"
                    blockType="experience"
                    top={3200} height={1000}
                    selectedId={selectedBlockId}
                    blocks={page.blocks}
                    onSelect={(id: string) => selectBlock(id)}
                  />
                  {/* Zona Certificaciones */}
                  <BlockOverlayZone
                    label="Certificaciones"
                    blockType="certifications"
                    top={4200} height={500}
                    selectedId={selectedBlockId}
                    blocks={page.blocks}
                    onSelect={(id: string) => selectBlock(id)}
                  />
                  {/* Zona Recomendaciones */}
                  <BlockOverlayZone
                    label="Testimonios / Clientes"
                    blockType="recommendations"
                    top={4700} height={800}
                    selectedId={selectedBlockId}
                    blocks={page.blocks}
                    onSelect={(id: string) => selectBlock(id)}
                  />
                  {/* Zona Blog */}
                  <BlockOverlayZone
                    label="Artículos y Blog"
                    blockType="blog"
                    top={5500} height={800}
                    selectedId={selectedBlockId}
                    blocks={page.blocks}
                    onSelect={(id: string) => selectBlock(id)}
                  />
                  {/* Zona Contacto */}
                  <BlockOverlayZone
                    label="Pregúntale al diseñador"
                    blockType="contact"
                    top={6300} height={800}
                    selectedId={selectedBlockId}
                    blocks={page.blocks}
                    onSelect={(id: string) => selectBlock(id)}
                  />
                </div>
              </div>

              {/* Hint flotante: editar desde panel lateral */}
              {!selectedBlockId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: 80,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0,164,255,0.3)',
                    borderRadius: 12,
                    padding: '8px 16px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#00a4ff',
                    zIndex: 20,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  ← Selecciona un bloque del panel para editar
                </motion.div>
              )}
            </div>
          )}
        </main>

          {/* RIGHT SIDEBAR — Properties (independently scrollable) */}
          <AnimatePresence>
            {!previewMode && (
              <motion.aside
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ width: 300, borderLeft: '1px solid var(--cms-border)', background: 'var(--cms-surface)', flexShrink: 0, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
              >
                <AnimatePresence mode="wait">
                  {selectedBlockId === 'ai-settings' ? (
                    <motion.div key="ai-settings" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }} style={{ height: '100%' }}>
                      <AISettingsPanel />
                    </motion.div>
                  ) : (
                    <motion.div key={selectedBlockId || 'empty'} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }} style={{ height: '100%' }}>
                      <BlockPropertyPanel selectedId={selectedBlockId} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

      {/* MODALS */}
      <CMSPublishModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublish}
        employeeName={employee?.fullName}
        slug={employee?.slug}
        blocksCount={page.blocks.filter((b: CVBlock) => b.visible).length}
        lastSaved={page.updatedAt || page.createdAt}
        isPublished={isPublished}
      />

      <CMSConfirmDialog
        open={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && confirmRemoveBlock(showDeleteConfirm)}
        title="Eliminar bloque"
        message="¿Estás seguro de que deseas eliminar este bloque? Esta acción se puede deshacer con Ctrl+Z."
        confirmLabel="Eliminar"
        danger
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// CV PREVIEW CANVAS (inner)
// ─────────────────────────────────────────────
const CVPreviewCanvas: React.FC<{
  blocks: CVBlock[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
}> = ({ blocks, selectedId, onSelect }) => {
  const visible = blocks.filter(b => b.visible).sort((a, b) => a.order - b.order);
  const gridBlockTypes = ['info_card', 'languages', 'skills_chart'];
  const rendered: React.ReactNode[] = [];
  let currentGrid: CVBlock[] = [];

  const flushGrid = () => {
    if (currentGrid.length > 0) {
      rendered.push(
        <div key={`grid-${rendered.length}`} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {currentGrid.map(b => renderBlock(b))}
        </div>
      );
      currentGrid = [];
    }
  };

  const renderBlock = (block: CVBlock) => (
    <div
      key={block.id}
      data-block-id={block.id}
      onClick={e => { e.stopPropagation(); onSelect?.(block.id); }}
      style={{
        cursor: onSelect ? 'pointer' : 'default',
        outline: selectedId === block.id ? '2px solid #00a4ff' : 'none',
        outlineOffset: 2, position: 'relative', borderRadius: 4,
        transition: 'outline 0.1s',
        scrollMarginTop: 80,
      }}
      title={onSelect ? 'Clic para editar' : ''}
    >
      {selectedId === block.id && onSelect && (
        <div style={{
          position: 'absolute', top: 6, right: 6, zIndex: 10,
          background: '#00a4ff', color: '#000', fontSize: 9, fontWeight: 800,
          padding: '2px 8px', borderRadius: 4, letterSpacing: 1, textTransform: 'uppercase',
        }}>
          Editando
        </div>
      )}
      <BlockPreview block={block} />
    </div>
  );

  visible.forEach(block => {
    if (gridBlockTypes.includes(block.type)) {
      currentGrid.push(block);
    } else {
      flushGrid();
      rendered.push(renderBlock(block));
    }
  });
  flushGrid();

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#e8f0ff', background: '#010610' }}>
      {rendered}
    </div>
  );
};

// ─────────────────────────────────────────────
// BLOCK PREVIEW SWITCHER
// ─────────────────────────────────────────────
const BlockPreview: React.FC<{ block: CVBlock }> = ({ block }) => {
  switch (block.type) {
    case 'hero': return <PublicHero props={block.props} />;
    case 'stats': return <PublicStats props={block.props} />;
    case 'experience': return <PublicExperience props={block.props} />;
    case 'services': return <PublicServices props={block.props} />;
    case 'info_card': return <PublicInfoCard props={block.props} />;
    case 'languages': return <PublicLanguages props={block.props} />;
    case 'skills_chart': return <PublicSkillChart props={block.props} />;
    case 'certifications': return <PublicCertifications props={block.props} />;
    case 'aptitudes': return <PublicAptitudes props={block.props} />;
    case 'portfolio': return <PublicPortfolio props={block.props} />;
    case 'recommendations': return <PublicRecommendations props={block.props} />;
    case 'blog': return <PublicBlog props={block.props} />;
    case 'contact': return <PublicContact props={block.props} />;
    case 'footer': return <PublicFooter props={block.props} />;
    case 'uxui_showcase': return <PublicUXUIShowcase props={block.props} />;
    case 'frontend_showcase': return <PublicFrontendShowcase props={block.props} />;
    case 'backend_showcase': return <PublicBackendShowcase props={block.props} />;
    default: return (
      <div style={{ padding: '32px 24px', opacity: 0.4, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#00a4ff', margin: '0 0 8px' }}>{block.type}</p>
        <p style={{ fontSize: 13, color: '#7a96c2', margin: 0 }}>Vista previa no disponible</p>
      </div>
    );
  }
};
