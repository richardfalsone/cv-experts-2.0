import React from 'react';
import { useEditorStore } from '../stores/editorStore';
import type { CVBlock } from '../types/cv.types';
import { CMSInput, CMSTextarea, CMSSelect, CMSToggle, CMSSectionHeader, CMSFieldGroup, CMSIconButton, CMSDivider } from './CMSAtoms';
import { CMSMediaUploader, CMSColorPicker, CMSTextareaWithCount } from './CMSMediaUploader';

// ── INTERNAL PANEL FOR SINGLE BLOCK ──
const BlockPropertyPanelInner: React.FC<{ block: CVBlock }> = ({ block }) => {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const p = block.props as any;

  // Helper to update nested props
  const update = (key: string, value: any) => updateBlock(block.id, { [key]: value });

  const updateArrayItem = (arrayKey: string, index: number, field: string, value: any) => {
    const arr = [...(p[arrayKey] || [])];
    if (typeof arr[index] === 'object') {
      arr[index] = { ...arr[index], [field]: value };
    } else {
      arr[index] = value;
    }
    update(arrayKey, arr);
  };

  const removeArrayItem = (arrayKey: string, index: number) => {
    const arr = [...(p[arrayKey] || [])].filter((_, i) => i !== index);
    update(arrayKey, arr);
  };

  const addArrayItem = (arrayKey: string, template: any) => {
    const arr = [...(p[arrayKey] || []), template];
    update(arrayKey, arr);
  };

  const renderFields = () => {
    switch (block.type) {

      // ── BLOG ──
      case 'blog': return (
        <>
          <CMSSectionHeader title="Artículos / Blog" icon="article" />
          <CMSFieldGroup title="Contenido General">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <CMSInput label="Título de Sección" value={p.title || ''} onChange={e => update('title', e.target.value)} placeholder="Artículos / Blog" />
              <CMSTextarea label="Subtítulo (opcional)" value={p.subtitle || ''} onChange={e => update('subtitle', e.target.value)} placeholder="Descripción de la sección..." />
            </div>
          </CMSFieldGroup>
          <CMSFieldGroup title="Gestionar Artículos">
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} style={{ padding: 12, background: 'var(--cms-surface-3)', borderRadius: 10, marginBottom: 12, border: '1px solid var(--cms-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cms-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Artículo {i + 1}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <CMSIconButton icon="content_copy" size={14} onClick={() => addArrayItem('items', { ...item, id: `${Date.now()}` })} title="Duplicar" />
                    <CMSIconButton icon="delete" danger size={14} onClick={() => removeArrayItem('items', i)} title="Eliminar" />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <CMSInput label="Título" value={item.title || ''} placeholder="Título del artículo" onChange={e => updateArrayItem('items', i, 'title', e.target.value)} />
                  <CMSTextarea label="Descripción Corta" value={item.description || ''} placeholder="Breve resumen..." rows={2} onChange={e => updateArrayItem('items', i, 'description', e.target.value)} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <CMSInput label="Fecha" value={item.date || ''} placeholder="OCT 2024" onChange={e => updateArrayItem('items', i, 'date', e.target.value)} style={{ flex: 1 }} />
                    <CMSInput label="Categoría" value={item.category || ''} placeholder="UX Design" onChange={e => updateArrayItem('items', i, 'category', e.target.value)} style={{ flex: 1 }} />
                  </div>
                  <CMSMediaUploader
                    label="Imagen de Portada"
                    value={item.image || ''}
                    onChange={val => updateArrayItem('items', i, 'image', val)}
                    accept="image"
                    compact
                  />
                </div>
              </div>
            ))}
            <button className="cms-btn-primary" style={{ width: '100%', padding: '10px' }} onClick={() => addArrayItem('items', { title: 'Nuevo Artículo', description: '', date: '2024', category: 'General', image: 'https://picsum.photos/800/600' })}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span> Agregar Nuevo Artículo
            </button>
          </CMSFieldGroup>
        </>
      );

      // ── HERO ──
      case 'hero': return (
        <>
          <CMSSectionHeader title="Inicio / Portada" icon="badge" />
          <CMSFieldGroup title="Identidad">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <CMSInput label="Nombre Completo" value={p.name || ''} onChange={e => update('name', e.target.value)} placeholder="Ej. Richard Falsone" icon="person" />
              <CMSInput label="Cargo / Rol" value={p.role || ''} onChange={e => update('role', e.target.value)} placeholder="Sr UX/UI Designer" icon="work" />
              <CMSInput label="Ubicación" value={p.location || ''} onChange={e => update('location', e.target.value)} placeholder="Ciudad, País" icon="location_on" />
            </div>
          </CMSFieldGroup>
          <CMSFieldGroup title="Imágenes">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <CMSMediaUploader
                label="Foto de Perfil"
                value={p.avatar || ''}
                onChange={val => update('avatar', val)}
                accept="image"
                compact
                hint="Recomendado: cuadrada, mín 400x400px"
              />
              <CMSMediaUploader
                label="Imagen de Fondo (opcional)"
                value={p.bgImage || ''}
                onChange={val => update('bgImage', val)}
                accept="image"
                hint="Recomendado: 1920x1080px o mayor"
              />
            </div>
          </CMSFieldGroup>
        </>
      );

      // ── INFO CARD ──
      case 'info_card': return (
        <>
          <CMSSectionHeader title="Información Personal" icon="contact_mail" />
          <CMSFieldGroup title="Contacto">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <CMSInput label="Email" type="email" value={p.email || ''} onChange={e => update('email', e.target.value)} placeholder="correo@empresa.com" icon="email" />
              <CMSInput label="Teléfono" type="tel" value={p.phone || ''} onChange={e => update('phone', e.target.value)} placeholder="+52 999 000 0000" icon="call" />
              <CMSSelect
                label="Modalidad de Trabajo"
                value={p.workMode || 'Remoto'}
                onChange={e => update('workMode', e.target.value)}
                options={[
                  { value: 'Remoto', label: '🌍 Remoto' },
                  { value: 'Híbrido', label: '🏙️ Híbrido' },
                  { value: 'Presencial', label: '🏢 Presencial' },
                ]}
              />
            </div>
          </CMSFieldGroup>
        </>
      );

      // ── LANGUAGES ──
      case 'languages': return (
        <>
          <CMSSectionHeader title="Idiomas" icon="translate" />
          <CMSFieldGroup title="Lista de Idiomas">
            {(p.languages || []).map((lang: any, i: number) => (
              <div key={i} style={{ padding: 12, background: 'var(--cms-surface-3)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--cms-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--cms-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Idioma {i + 1}</span>
                  <CMSIconButton icon="delete" danger size={14} title="Eliminar" onClick={() => removeArrayItem('languages', i)} />
                </div>
                <CMSInput value={lang.name} placeholder="Español" onChange={e => updateArrayItem('languages', i, 'name', e.target.value)} />
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="range" min={0} max={100} value={lang.level} style={{ flex: 1 }} onChange={e => updateArrayItem('languages', i, 'level', parseInt(e.target.value))} aria-label={`Nivel de ${lang.name}`} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--cms-primary)', minWidth: 38, textAlign: 'right' }}>{lang.level}%</span>
                </div>
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => addArrayItem('languages', { name: 'Nuevo Idioma', level: 75 })}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Idioma
            </button>
          </CMSFieldGroup>
        </>
      );

      // ── SKILLS CHART ──
      case 'skills_chart': return (
        <>
          <CMSSectionHeader title="Benchmarking de Skills" icon="radar" />
          <CMSFieldGroup title="Contenido de Sección">
            <CMSInput label="Título de Sección" value={p.title || ''} onChange={e => update('title', e.target.value)} placeholder="Benchmarking de Habilidades" />
          </CMSFieldGroup>
          <CMSFieldGroup title="Habilidades (Tus Skills)">
            {(p.skills || []).map((skill: any, i: number) => (
              <div key={i} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CMSInput value={skill.label} placeholder="Habilidad" onChange={e => updateArrayItem('skills', i, 'label', e.target.value)} style={{ flex: 1 }} />
                <input type="range" min={0} max={100} value={skill.value} style={{ width: 80, flexShrink: 0 }} onChange={e => updateArrayItem('skills', i, 'value', parseInt(e.target.value))} aria-label={`Valor de ${skill.label}`} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cms-primary)', minWidth: 32 }}>{skill.value}</span>
                <CMSIconButton icon="close" size={14} danger onClick={() => removeArrayItem('skills', i)} title="Eliminar skill" />
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px', marginTop: 4 }} onClick={() => addArrayItem('skills', { label: 'Skill', value: 80 })}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Habilidad
            </button>
          </CMSFieldGroup>

          <CMSFieldGroup title="Estándar Senior (Comparativa)">
            <p style={{ fontSize: 11, color: 'var(--cms-muted)', marginBottom: 12 }}>Define los valores de referencia para el gráfico de araña.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {(p.skills || []).map((skill: any, i: number) => (
                <div key={i}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--cms-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>{skill.label || `Skill ${i+1}`}</label>
                  <CMSInput 
                    type="number" 
                    value={p.seniorData?.[i] ?? 80} 
                    onChange={e => {
                      const data = [...(p.seniorData || Array((p.skills || []).length).fill(80))];
                      data[i] = parseInt(e.target.value);
                      update('seniorData', data);
                    }} 
                  />
                </div>
              ))}
            </div>
          </CMSFieldGroup>
        </>
      );

      // ── APTITUDES ──
      case 'aptitudes': return (
        <>
          <CMSSectionHeader title="Aptitudes Clave" icon="checklist" />
          <CMSFieldGroup title="Competencias">
            {(p.items || []).map((item: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <CMSInput value={item} placeholder="Competencia" onChange={e => { const arr = [...p.items]; arr[i] = e.target.value; update('items', arr); }} style={{ flex: 1 }} />
                <CMSIconButton icon="close" size={14} danger onClick={() => removeArrayItem('items', i)} title="Eliminar" />
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px', marginTop: 4 }} onClick={() => addArrayItem('items', 'Nueva competencia')}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Aptitud
            </button>
          </CMSFieldGroup>
        </>
      );

      // ── CERTIFICATIONS ──
      case 'certifications': return (
        <>
          <CMSSectionHeader title="Certificaciones" icon="verified" />
          <CMSFieldGroup title="Lista de Certificaciones">
            {(p.items || []).map((cert: any, i: number) => (
              <div key={i} style={{ padding: 12, background: 'var(--cms-surface-3)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--cms-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cms-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Cert. {i + 1}</span>
                  <CMSIconButton icon="delete" danger size={14} onClick={() => removeArrayItem('items', i)} title="Eliminar" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <CMSInput value={cert.title || ''} placeholder="Título de la certificación" onChange={e => updateArrayItem('items', i, 'title', e.target.value)} />
                  <CMSInput value={cert.issuer || ''} placeholder="Institución emisora" onChange={e => updateArrayItem('items', i, 'issuer', e.target.value)} />
                  <CMSInput value={cert.date || ''} placeholder="Fecha (ej. DIC 2024)" onChange={e => updateArrayItem('items', i, 'date', e.target.value)} />
                </div>
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => addArrayItem('items', { title: '', issuer: '', date: '' })}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Certificación
            </button>
          </CMSFieldGroup>
        </>
      );

      // ── STATS ──
      case 'stats': return (
        <>
          <CMSSectionHeader title="Métricas de Impacto" icon="bar_chart" />
          <CMSFieldGroup title="Contenido de Sección">
            <CMSInput label="Título de Sección" value={p.title || ''} onChange={e => update('title', e.target.value)} placeholder="Datos Relevantes" />
          </CMSFieldGroup>
          <CMSFieldGroup title="Métricas de Impacto">
            {(p.stats || []).map((stat: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end' }}>
                <CMSInput label={i === 0 ? "Valor" : ""} value={stat.value} placeholder="+25%" onChange={e => { const stats = [...p.stats]; stats[i] = { ...stats[i], value: e.target.value }; update('stats', stats); }} style={{ width: 80, flexShrink: 0 }} />
                <CMSInput label={i === 0 ? "Etiqueta" : ""} value={stat.label} placeholder="Descripción" onChange={e => { const stats = [...p.stats]; stats[i] = { ...stats[i], label: e.target.value }; update('stats', stats); }} style={{ flex: 1 }} />
                <CMSIconButton icon="close" size={14} danger onClick={() => { const stats = p.stats.filter((_: any, idx: number) => idx !== i); update('stats', stats); }} title="Eliminar" />
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px', marginTop: 4 }} onClick={() => addArrayItem('stats', { value: '0', label: 'Nueva Métrica', icon: '' })}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Métrica
            </button>
          </CMSFieldGroup>
        </>
      );

      // ── EXPERIENCE ──
      case 'experience': return (
        <>
          <CMSSectionHeader title="Historial y Educación" icon="work_history" />
          <CMSFieldGroup title="Títulos de Sección">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <CMSInput label="Título Profesional" value={p.title || ''} onChange={e => update('title', e.target.value)} placeholder="Trayectoria Profesional" />
              <CMSInput label="Título Educación" value={p.educationTitle || ''} onChange={e => update('educationTitle', e.target.value)} placeholder="Educación" />
            </div>
          </CMSFieldGroup>
          
          <CMSFieldGroup title="Historial Laboral">
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} style={{ padding: 12, background: 'var(--cms-surface-3)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--cms-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cms-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Experiencia {i + 1}</span>
                  <CMSIconButton icon="delete" danger size={14} onClick={() => removeArrayItem('items', i)} title="Eliminar" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <CMSInput label="Cargo / Rol" value={item.role || item.title || ''} placeholder="Cargo / Rol" onChange={e => {
                    updateArrayItem('items', i, 'role', e.target.value);
                    updateArrayItem('items', i, 'title', e.target.value); // Sync for parity
                  }} icon="work" />
                  <CMSInput label="Empresa" value={item.company || item.subtitle || ''} placeholder="Empresa" onChange={e => {
                    updateArrayItem('items', i, 'company', e.target.value);
                    updateArrayItem('items', i, 'subtitle', e.target.value); // Sync for parity
                  }} icon="business" />
                  <CMSInput label="Periodo" value={item.period || item.date || ''} placeholder="2022 — Actual" onChange={e => {
                    updateArrayItem('items', i, 'period', e.target.value);
                    updateArrayItem('items', i, 'date', e.target.value); // Sync for parity
                  }} icon="calendar_month" />
                  <CMSTextarea value={item.description || ''} placeholder="Logros..." rows={3} onChange={e => updateArrayItem('items', i, 'description', e.target.value)} />
                </div>
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => addArrayItem('items', { role: 'Nuevo Cargo', title: 'Nuevo Cargo', company: 'Empresa', subtitle: 'Empresa', period: '2024 — Actual', date: '2024 — Actual', description: '', icon: 'work' })}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Experiencia
            </button>
          </CMSFieldGroup>

          <CMSDivider label="Educación" />

          <CMSFieldGroup title="Historial Académico">
            {(p.education || []).map((item: any, i: number) => (
              <div key={i} style={{ padding: 12, background: 'var(--cms-surface-3)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--cms-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cms-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Estudio {i + 1}</span>
                  <CMSIconButton icon="delete" danger size={14} onClick={() => removeArrayItem('education', i)} title="Eliminar" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <CMSInput value={item.title || ''} placeholder="Institución" onChange={e => updateArrayItem('education', i, 'title', e.target.value)} icon="school" />
                  <CMSInput value={item.subtitle || ''} placeholder="Título / Grado" onChange={e => updateArrayItem('education', i, 'subtitle', e.target.value)} icon="history_edu" />
                  <CMSInput value={item.date || ''} placeholder="2018 — 2022" onChange={e => updateArrayItem('education', i, 'date', e.target.value)} icon="calendar_today" />
                  <CMSTextarea value={item.description || ''} placeholder="Descripción..." rows={2} onChange={e => updateArrayItem('education', i, 'description', e.target.value)} />
                </div>
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => addArrayItem('education', { title: 'Nueva Institución', subtitle: 'Título', date: '2024', description: '' })}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Educación
            </button>
          </CMSFieldGroup>
        </>
      );

      // ── SERVICES ──
      case 'services': return (
        <>
          <CMSSectionHeader title="Especialidades / Servicios" icon="home_repair_service" />
          <CMSFieldGroup title="Contenido de Sección">
            <CMSInput label="Título de Sección" value={p.title || ''} onChange={e => update('title', e.target.value)} placeholder="Experiencia en:" />
          </CMSFieldGroup>
          <CMSFieldGroup title="Especialidades Ofrecidas">
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} style={{ padding: 12, background: 'var(--cms-surface-3)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--cms-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cms-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Especialidad {i + 1}</span>
                  <CMSIconButton icon="delete" danger size={14} onClick={() => removeArrayItem('items', i)} title="Eliminar" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <CMSInput value={item.title || ''} placeholder="Nombre de la especialidad" onChange={e => updateArrayItem('items', i, 'title', e.target.value)} />
                  <CMSInput value={item.icon || ''} placeholder="Ícono (ej: palette)" onChange={e => updateArrayItem('items', i, 'icon', e.target.value)} hint="Nombre de Material Symbol" />
                  <CMSTextarea value={item.description || ''} placeholder="Descripción corta" rows={2} onChange={e => updateArrayItem('items', i, 'description', e.target.value)} />
                  <CMSTextarea value={item.extendedDesc || ''} placeholder="Descripción larga (expandible)" rows={3} onChange={e => updateArrayItem('items', i, 'extendedDesc', e.target.value)} />
                </div>
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => addArrayItem('items', { title: 'Servicio', description: '', extendedDesc: '', icon: 'star' })}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Especialidad
            </button>
          </CMSFieldGroup>
        </>
      );

      // ── PORTFOLIO ──
      case 'portfolio': return (
        <>
          <CMSSectionHeader title="Trabajos Destacados" icon="photo_library" />
          <CMSFieldGroup title="Títulos de Sección">
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <CMSInput label="Título (Ej: Portafolio)" value={p.title || ''} onChange={e => update('title', e.target.value)} placeholder="Portafolio" />
              <CMSInput label="Subtítulo" value={p.subtitle || ''} onChange={e => update('subtitle', e.target.value)} placeholder="Selected Works" />
            </div>
          </CMSFieldGroup>
          <CMSFieldGroup title="Listado de Proyectos">
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} style={{ padding: 12, background: 'var(--cms-surface-3)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--cms-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cms-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Trabajo Destacado {i + 1}</span>
                  <CMSIconButton icon="delete" danger size={14} onClick={() => removeArrayItem('items', i)} title="Eliminar" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <CMSInput value={item.title || ''} placeholder="Título del proyecto" onChange={e => updateArrayItem('items', i, 'title', e.target.value)} />
                  <CMSMediaUploader
                    label="Imagen del Proyecto"
                    value={item.image || ''}
                    onChange={val => updateArrayItem('items', i, 'image', val)}
                    accept="image"
                    compact
                    hint="PNG, JPG, WebP · Máx. 5MB"
                  />
                  <CMSSelect
                    label="Categoría / Especialidad"
                    value={item.category || 'uiDesign'}
                    onChange={e => updateArrayItem('items', i, 'category', e.target.value)}
                    options={[
                      { value: 'uiDesign', label: 'UI Design' },
                      { value: 'uxDesign', label: 'UX Design' },
                      { value: 'vibeCoding', label: 'Vibe Coding' },
                      { value: 'fullstack', label: 'Full Stack' },
                    ]}
                  />
                  <CMSInput label="Métrica de Impacto (Badge)" value={item.impact || ''} placeholder="+25% Staffing" onChange={e => updateArrayItem('items', i, 'impact', e.target.value)} hint="Aparecerá en el círculo azul del proyecto" />
                  <CMSTextareaWithCount label="Descripción del Proyecto" value={item.description || ''} placeholder="Explica tu rol y el resultado..." rows={2} onChange={val => updateArrayItem('items', i, 'description', val)} maxLength={200} />
                </div>
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => addArrayItem('items', { title: 'Nuevo Trabajo', image: '', description: '', category: 'uiDesign', impact: '', tags: [] })}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Trabajo Destacado
            </button>
          </CMSFieldGroup>
        </>
      );

      // ── RECOMMENDATIONS ──
      case 'recommendations': return (
        <>
          <CMSSectionHeader title="Testimonios / Clientes" icon="reviews" />
          <CMSFieldGroup title="Gestión de Testimonios">
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} style={{ padding: 12, background: 'var(--cms-surface-3)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--cms-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cms-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Testimonio {i + 1}</span>
                  <CMSIconButton icon="delete" danger size={14} onClick={() => removeArrayItem('items', i)} title="Eliminar" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <CMSInput value={item.name || ''} placeholder="Nombre" onChange={e => updateArrayItem('items', i, 'name', e.target.value)} icon="person" />
                  <CMSInput value={item.role || ''} placeholder="Cargo @ Empresa" onChange={e => updateArrayItem('items', i, 'role', e.target.value)} icon="work" />
                  <CMSMediaUploader
                    label="Foto de perfil"
                    value={item.avatar || ''}
                    onChange={val => updateArrayItem('items', i, 'avatar', val)}
                    accept="image"
                    compact
                  />
                  <CMSTextareaWithCount value={item.text || ''} placeholder="Testimonio..." rows={3} onChange={val => updateArrayItem('items', i, 'text', val)} maxLength={300} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--cms-muted)', fontWeight: 600 }}>Rating:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => updateArrayItem('items', i, 'rating', star)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, fontSize: 18, color: star <= item.rating ? '#ffab00' : 'var(--cms-border)' }} aria-label={`${star} estrellas`}>★</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => addArrayItem('items', { name: '', role: '', text: '', avatar: '', rating: 5 })}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Testimonio
            </button>
          </CMSFieldGroup>
        </>
      );

      // ── CONTACT ──
      case 'contact': return (
        <>
          <CMSSectionHeader title="Pregúntale al diseñador" icon="send" />
          <CMSFieldGroup title="Contenido">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <CMSInput label="Email de Contacto" type="email" value={p.email || ''} onChange={e => update('email', e.target.value)} icon="email" />
              <CMSInput label="Título del CTA" value={p.headline || ''} onChange={e => update('headline', e.target.value)} placeholder="¿Trabajamos juntos?" />
              <CMSTextarea label="Subtítulo" value={p.subtext || ''} onChange={e => update('subtext', e.target.value)} placeholder="Descripción corta..." />
            </div>
          </CMSFieldGroup>
        </>
      );

      // ── FOOTER ──
      case 'footer': return (
        <>
          <CMSSectionHeader title="Footer" icon="bottom_panel_open" />
          <CMSFieldGroup title="Contenido">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <CMSInput label="Texto de Copyright" value={p.copyright || ''} onChange={e => update('copyright', e.target.value)} />
              <CMSDivider label="Links Sociales" />
              {(p.links || []).map((link: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <CMSInput value={link.label} placeholder="LinkedIn" onChange={e => updateArrayItem('links', i, 'label', e.target.value)} style={{ flex: 1 }} />
                  <CMSInput value={link.url} placeholder="https://..." onChange={e => updateArrayItem('links', i, 'url', e.target.value)} style={{ flex: 2 }} />
                  <CMSIconButton icon="close" size={14} danger onClick={() => removeArrayItem('links', i)} title="Eliminar" />
                </div>
              ))}
              <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => addArrayItem('links', { label: 'Nuevo Link', url: 'https://' })}>
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Link
              </button>
            </div>
          </CMSFieldGroup>
        </>
      );

      // ── UXUI SHOWCASE ──
      case 'uxui_showcase': return (
        <>
          <CMSSectionHeader title="Showcase UX/UI" icon="palette">
            <span style={{ fontSize: 9, background: 'rgba(0,164,255,0.2)', color: 'var(--cms-primary)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>PHASE 2</span>
          </CMSSectionHeader>
          <CMSFieldGroup title="Embed de Figma">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <CMSInput label="URL del Prototipo Figma" value={p.figmaUrl || ''} onChange={e => update('figmaUrl', e.target.value)} placeholder="https://www.figma.com/file/..." icon="link" hint="URL pública compartida de Figma" />
              <CMSInput label="Título del Caso de Estudio" value={p.figmaTitle || ''} onChange={e => update('figmaTitle', e.target.value)} placeholder="Ej. Rediseño de Plataforma SaaS" />
            </div>
          </CMSFieldGroup>
          <CMSFieldGroup title="Sliders Antes/Después">
            {(p.sliderItems || []).map((item: any, i: number) => (
              <div key={i} style={{ padding: 12, background: 'var(--cms-surface-3)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--cms-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cms-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Slider {i + 1}</span>
                  <CMSIconButton icon="delete" danger size={14} onClick={() => removeArrayItem('sliderItems', i)} title="Eliminar" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <CMSInput value={item.label || ''} placeholder="Etiqueta (ej. Rediseño de Dashboard)" onChange={e => updateArrayItem('sliderItems', i, 'label', e.target.value)} />
                  <CMSInput value={item.before || ''} placeholder="URL Imagen ANTES" onChange={e => updateArrayItem('sliderItems', i, 'before', e.target.value)} icon="image" />
                  <CMSInput value={item.after || ''} placeholder="URL Imagen DESPUÉS" onChange={e => updateArrayItem('sliderItems', i, 'after', e.target.value)} icon="image" />
                </div>
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => addArrayItem('sliderItems', { label: '', before: '', after: '' })}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Slider
            </button>
          </CMSFieldGroup>
        </>
      );

      // ── FRONTEND SHOWCASE ──
      case 'frontend_showcase': return (
        <>
          <CMSSectionHeader title="Showcase Frontend" icon="code">
            <span style={{ fontSize: 9, background: 'rgba(0,164,255,0.2)', color: 'var(--cms-primary)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>PHASE 2</span>
          </CMSSectionHeader>
          <CMSFieldGroup title="Sandbox Interactivo">
            <CMSInput label="URL del Sandbox" value={p.sandboxUrl || ''} onChange={e => update('sandboxUrl', e.target.value)} placeholder="https://codesandbox.io/embed/..." icon="link" hint="CodeSandbox, StackBlitz o similar" />
          </CMSFieldGroup>
          <CMSFieldGroup title="Lighthouse Scores">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(['performance', 'accessibility', 'bestPractices', 'seo'] as const).map(key => (
                <div key={key}>
                  <label className="cms-label" style={{ textTransform: 'capitalize' }}>{key === 'bestPractices' ? 'Best Practices' : key}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="range" min={0} max={100} value={p.lighthouse?.[key] || 0} onChange={e => update('lighthouse', { ...p.lighthouse, [key]: parseInt(e.target.value) })} style={{ flex: 1 }} aria-label={key} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: (p.lighthouse?.[key] || 0) >= 90 ? '#00c853' : '#ffab00', minWidth: 28 }}>{p.lighthouse?.[key] || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </CMSFieldGroup>
          <CMSFieldGroup title="Stack Tecnológico">
            {(p.techStack || []).map((tech: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <CMSInput value={tech} placeholder="React" onChange={e => { const arr = [...p.techStack]; arr[i] = e.target.value; update('techStack', arr); }} style={{ flex: 1 }} />
                <CMSIconButton icon="close" size={14} danger onClick={() => { const arr = p.techStack.filter((_: any, idx: number) => idx !== i); update('techStack', arr); }} title="Eliminar" />
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => update('techStack', [...(p.techStack || []), ''])}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Tecnología
            </button>
          </CMSFieldGroup>
        </>
      );

      // ── BACKEND SHOWCASE ──
      case 'backend_showcase': return (
        <>
          <CMSSectionHeader title="Showcase Backend" icon="account_tree">
            <span style={{ fontSize: 9, background: 'rgba(0,164,255,0.2)', color: 'var(--cms-primary)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>PHASE 2</span>
          </CMSSectionHeader>
          <CMSFieldGroup title="Arquitectura">
            <CMSTextarea label="Diagrama Mermaid" value={p.mermaidDiagram || ''} onChange={e => update('mermaidDiagram', e.target.value)} placeholder="graph TD; A-->B;" rows={5} hint="Sintaxis de Mermaid.js" />
          </CMSFieldGroup>
          <CMSFieldGroup title="Código">
            <CMSTextarea label="Snippet de Código" value={p.codeSnippet || ''} onChange={e => update('codeSnippet', e.target.value)} placeholder="const server = express()..." rows={6} />
            <div style={{ marginTop: 10 }}>
              <CMSSelect
                label="Lenguaje"
                value={p.language || 'typescript'}
                onChange={e => update('language', e.target.value)}
                options={[
                  { value: 'typescript', label: 'TypeScript' },
                  { value: 'javascript', label: 'JavaScript' },
                  { value: 'python', label: 'Python' },
                  { value: 'go', label: 'Go' },
                  { value: 'rust', label: 'Rust' },
                  { value: 'sql', label: 'SQL' },
                  { value: 'bash', label: 'Bash' },
                ]}
              />
            </div>
          </CMSFieldGroup>
          <CMSFieldGroup title="Métricas del Sistema">
            {(p.metrics || []).map((metric: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <CMSInput value={metric.label} placeholder="Latencia" onChange={e => updateArrayItem('metrics', i, 'label', e.target.value)} style={{ flex: 2 }} />
                <CMSInput value={metric.value} placeholder="45ms" onChange={e => updateArrayItem('metrics', i, 'value', e.target.value)} style={{ flex: 1 }} />
                <CMSIconButton icon="close" size={14} danger onClick={() => removeArrayItem('metrics', i)} title="Eliminar" />
              </div>
            ))}
            <button className="cms-btn-ghost" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => addArrayItem('metrics', { label: 'Métrica', value: '0' })}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Agregar Métrica
            </button>
          </CMSFieldGroup>
        </>
      );

      default:
        return (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--cms-border)', display: 'block', marginBottom: 12 }}>settings_suggest</span>
            <p style={{ color: 'var(--cms-muted)', fontSize: 13 }}>Panel de edición para <strong>{block.type}</strong> en construcción.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ height: '100%', paddingBottom: 40 }}>
      {renderFields()}
    </div>
  );
};

// ── GLOBAL CONFIG PANEL ──
const GlobalConfigPanel: React.FC = () => {
  const { page, updateMeta } = useEditorStore();
  if (!page) return null;
  const meta = page.meta;

  const updateNav = (key: string, label: string) => {
    updateMeta({ navigationLabels: { ...(meta.navigationLabels || {}), [key]: label } });
  };

  return (
    <>
      <CMSSectionHeader title="Configuración Global" icon="settings" />
      <CMSFieldGroup title="Nombres de Navegación">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(meta.navigationLabels || {}).map(([key, label]) => (
            <CMSInput 
              key={key} 
              label={`Sección: ${key.charAt(0).toUpperCase() + key.slice(1)}`} 
              value={label} 
              onChange={e => updateNav(key, e.target.value)} 
              placeholder={`Nombre para ${key}`}
            />
          ))}
        </div>
      </CMSFieldGroup>

      <CMSFieldGroup title="Ajustes de Cabecera">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <CMSToggle 
            label="Cabecera Sticky (Fija)" 
            checked={!!meta.headerConfig?.sticky} 
            onChange={val => updateMeta({ headerConfig: { ...(meta.headerConfig || {}), sticky: val } as any })} 
          />
          <CMSToggle 
            label="Mostrar Navegación" 
            checked={!!meta.headerConfig?.showNav} 
            onChange={val => updateMeta({ headerConfig: { ...(meta.headerConfig || {}), showNav: val } as any })} 
          />
          <CMSToggle 
            label="Mostrar Redes Sociales" 
            checked={!!meta.headerConfig?.showSocial} 
            onChange={val => updateMeta({ headerConfig: { ...(meta.headerConfig || {}), showSocial: val } as any })} 
          />
        </div>
      </CMSFieldGroup>

      <CMSFieldGroup title="Diseño & Colores">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <CMSColorPicker 
            label="Color Primario" 
            value={meta.primaryColor} 
            onChange={val => updateMeta({ primaryColor: val })} 
          />
          <CMSSelect 
            label="Tipografía Principal"
            value={meta.fontFamily}
            onChange={e => updateMeta({ fontFamily: e.target.value })}
            options={[
              { value: "'Inter', sans-serif", label: 'Inter' },
              { value: "'Outfit', sans-serif", label: 'Outfit' },
              { value: "'Roboto', sans-serif", label: 'Roboto' },
              { value: "'Space Grotesk', sans-serif", label: 'Space Grotesk' },
            ]}
          />
        </div>
      </CMSFieldGroup>
    </>
  );
};

// ── EXPORTED PROPERTY PANEL (Router) ──
export const BlockPropertyPanel: React.FC<{ selectedId: string | null }> = ({ selectedId }) => {
  const { page } = useEditorStore();
  
  if (!page || !selectedId) return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--cms-muted)' }}>
      <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 16, opacity: 0.2 }}>select_window_2</span>
      <p style={{ fontSize: 13, fontWeight: 500 }}>Selecciona un grupo o bloque en la barra lateral para editar sus propiedades.</p>
    </div>
  );

  // 1. Caso: Configuración Global
  if (selectedId === 'global-config') {
    return <GlobalConfigPanel />;
  }

  // 2. Caso: Grupo de bloques
  if (selectedId.startsWith('group:')) {
    const groupId = selectedId.replace('group:', '');
    const groupTypes = {
      identity: ['hero', 'info_card', 'languages', 'skills_chart', 'aptitudes'],
      experience: ['experience', 'certifications'],
      portfolio: ['services', 'portfolio', 'stats', 'uxui_showcase', 'frontend_showcase', 'backend_showcase'],
      social: ['recommendations', 'blog', 'contact', 'footer'],
    }[groupId] || [];

    const groupBlocks = page.blocks.filter(b => groupTypes.includes(b.type));

    return (
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <CMSSectionHeader title={`Editando Grupo: ${groupId.toUpperCase()}`} icon="category" />
        <div style={{ padding: '0 0 100px' }}>
          {groupBlocks.map(block => (
            <div key={block.id} style={{ borderBottom: '8px solid var(--cms-bg)', background: 'var(--cms-surface)' }}>
              <BlockPropertyPanelInner block={block} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Caso: Bloque individual
  const block = page.blocks.find(b => b.id === selectedId);
  if (!block) return null;

  return <BlockPropertyPanelInner block={block} />;
};
