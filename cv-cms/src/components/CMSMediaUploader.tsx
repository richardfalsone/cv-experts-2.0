/**
 * CMSMediaUploader.tsx — Room of Experts CMS
 * Drag & drop media uploader: images, PDFs, videos.
 * Stores as dataURL in localStorage (no backend needed).
 */
import React, { useRef, useState, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type MediaType = 'image' | 'pdf' | 'video' | 'any';

interface CMSMediaUploaderProps {
  /** Current value — can be a dataURL or a remote URL */
  value?: string;
  /** Called when file is uploaded or cleared */
  onChange: (dataUrl: string) => void;
  /** Label shown above the uploader */
  label?: string;
  /** Which file types to accept */
  accept?: MediaType;
  /** Hint text below */
  hint?: string;
  /** Max file size in MB (default 8) */
  maxMB?: number;
  /** Show a small inline preview */
  compact?: boolean;
}

const ACCEPT_MAP: Record<MediaType, string> = {
  image: 'image/*',
  pdf: 'application/pdf',
  video: 'video/*',
  any: 'image/*,application/pdf,video/*',
};

const MAX_BYTES: Record<MediaType, number> = {
  image: 8 * 1024 * 1024,
  pdf: 20 * 1024 * 1024,
  video: 50 * 1024 * 1024,
  any: 50 * 1024 * 1024,
};

function getFileType(file: File): 'image' | 'pdf' | 'video' | 'other' {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('video/')) return 'video';
  return 'other';
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export const CMSMediaUploader: React.FC<CMSMediaUploaderProps> = ({
  value,
  onChange,
  label,
  accept = 'image',
  hint,
  maxMB,
  compact = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const uid = useId();

  const maxBytes = maxMB ? maxMB * 1024 * 1024 : MAX_BYTES[accept];

  const processFile = useCallback((file: File) => {
    setError(null);
    const type = getFileType(file);

    // Size check
    if (file.size > maxBytes) {
      setError(`Archivo demasiado grande. Máximo: ${maxMB ? maxMB : maxBytes / 1024 / 1024}MB`);
      return;
    }

    // Type check
    if (accept === 'image' && type !== 'image') { setError('Solo se permiten imágenes'); return; }
    if (accept === 'pdf' && type !== 'pdf') { setError('Solo se permiten archivos PDF'); return; }
    if (accept === 'video' && type !== 'video') { setError('Solo se permiten videos'); return; }

    setIsProcessing(true);
    setProgress(0);

    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 80));
    };

    reader.onload = () => {
      setProgress(100);
      setTimeout(() => {
        onChange(reader.result as string);
        setIsProcessing(false);
        setProgress(0);
      }, 200);
    };

    reader.onerror = () => {
      setError('Error al leer el archivo. Inténtalo de nuevo.');
      setIsProcessing(false);
      setProgress(0);
    };

    reader.readAsDataURL(file);
  }, [accept, maxBytes, maxMB, onChange]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handlePasteUrl = () => {
    const url = prompt('Ingresa la URL del archivo:');
    if (url?.trim()) onChange(url.trim());
  };

  // Determine current media type from value
  const currentType = value
    ? value.startsWith('data:image') ? 'image'
      : value.startsWith('data:video') ? 'video'
      : value.startsWith('data:application/pdf') ? 'pdf'
      : value.startsWith('http') ? 'url'
      : 'unknown'
    : null;

  const ACCEPT_LABEL: Record<MediaType, string> = {
    image: 'PNG, JPG, GIF, WebP, SVG',
    pdf: 'PDF',
    video: 'MP4, WebM, MOV',
    any: 'Imagen, PDF o Video',
  };

  const ACCEPT_ICON: Record<MediaType, string> = {
    image: 'image',
    pdf: 'picture_as_pdf',
    video: 'movie',
    any: 'perm_media',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label className="cms-label" htmlFor={uid}>{label}</label>
      )}

      {/* ── COMPACT PREVIEW MODE ── */}
      {compact && value && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--cms-surface-2)', borderRadius: 10, border: '1px solid var(--cms-border)' }}>
          {currentType === 'image' || currentType === 'url' ? (
            <img src={value} alt="Preview" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} onError={e => (e.target as HTMLImageElement).style.opacity = '0.3'} />
          ) : currentType === 'video' ? (
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--cms-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--cms-primary)', fontSize: 22 }}>movie</span>
            </div>
          ) : currentType === 'pdf' ? (
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,77,109,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--cms-danger)', fontSize: 22 }}>picture_as_pdf</span>
            </div>
          ) : null}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--cms-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentType === 'url' ? value.split('/').pop() || 'URL externa' : 'Archivo subido'}
            </p>
            <p style={{ fontSize: 10, color: 'var(--cms-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>{currentType?.toUpperCase()}</p>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => inputRef.current?.click()} title="Reemplazar archivo" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--cms-muted)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>swap_horiz</span>
            </button>
            <button onClick={handleClear} title="Eliminar" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--cms-danger)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
            </button>
          </div>
        </div>
      )}

      {/* ── DROP ZONE (full size or when no value in compact) ── */}
      {(!compact || !value) && (
        <div
          id={uid}
          role="button"
          tabIndex={0}
          aria-label={`Subir ${ACCEPT_LABEL[accept]}`}
          onClick={() => !isProcessing && inputRef.current?.click()}
          onKeyDown={e => e.key === 'Enter' && !isProcessing && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          style={{
            position: 'relative',
            borderRadius: 12,
            border: `2px dashed ${error ? 'var(--cms-danger)' : isDragOver ? 'var(--cms-primary)' : 'var(--cms-border)'}`,
            background: isDragOver ? 'rgba(0,164,255,0.05)' : 'var(--cms-surface-2)',
            cursor: isProcessing ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
            overflow: 'hidden',
          }}
        >
          {/* Full image preview */}
          {value && !compact && (currentType === 'image' || currentType === 'url') && (
            <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
              <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.target as HTMLImageElement).style.opacity = '0.3'} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
              >
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: 8 }}>Reemplazar</span>
              </div>
            </div>
          )}

          {/* Video preview */}
          {value && !compact && currentType === 'video' && (
            <video src={value} controls style={{ width: '100%', borderRadius: 10 }} />
          )}

          {/* PDF preview */}
          {value && !compact && currentType === 'pdf' && (
            <div style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--cms-danger)' }}>picture_as_pdf</span>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--cms-text)', margin: 0, fontSize: 14 }}>PDF adjunto</p>
                <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--cms-primary)' }}>Ver PDF</a>
              </div>
            </div>
          )}

          {/* Empty state / upload prompt */}
          {!value && (
            <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(0,164,255,0.2)', borderTopColor: 'var(--cms-primary)', animation: 'cms-spin 0.65s linear infinite' }} />
                    <span style={{ fontSize: 12, color: 'var(--cms-muted)', fontWeight: 600 }}>Procesando... {progress}%</span>
                    <div style={{ width: '80%', height: 4, background: 'var(--cms-surface-3)', borderRadius: 4, overflow: 'hidden' }}>
                      <motion.div style={{ height: '100%', background: 'var(--cms-primary)', borderRadius: 4 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.15 }} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: isDragOver ? 'rgba(0,164,255,0.15)' : 'var(--cms-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 26, color: isDragOver ? 'var(--cms-primary)' : 'var(--cms-muted)' }}>
                        {isDragOver ? 'download' : ACCEPT_ICON[accept]}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: isDragOver ? 'var(--cms-primary)' : 'var(--cms-text)', margin: 0 }}>
                      {isDragOver ? '¡Suelta aquí!' : 'Arrastra o haz clic'}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--cms-muted)', margin: 0 }}>
                      {ACCEPT_LABEL[accept]} · Máx. {maxMB || (maxBytes / 1024 / 1024).toFixed(0)}MB
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Processing overlay */}
          <AnimatePresence>
            {isProcessing && value && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', animation: 'cms-spin 0.65s linear infinite' }} />
                <div style={{ width: 160, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div style={{ height: '100%', background: 'var(--cms-primary)', borderRadius: 4 }} animate={{ width: `${progress}%` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Clear + URL paste actions (when has value in full mode) */}
      {value && !compact && (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="cms-btn-ghost" style={{ flex: 1, padding: '6px 10px', fontSize: 11 }} onClick={() => inputRef.current?.click()}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>swap_horiz</span>Reemplazar
          </button>
          <button className="cms-btn-ghost" style={{ padding: '6px 10px', fontSize: 11 }} onClick={handleClear}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--cms-danger)' }}>delete</span>Eliminar
          </button>
        </div>
      )}

      {/* URL paste option */}
      {!value && (
        <button className="cms-btn-ghost" style={{ width: '100%', padding: '6px', fontSize: 11 }} onClick={handlePasteUrl}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>link</span>
          Usar URL externa
        </button>
      )}

      {/* Error */}
      {error && (
        <p style={{ fontSize: 11, color: 'var(--cms-danger)', display: 'flex', alignItems: 'center', gap: 4, margin: 0 }} role="alert">
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>{error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p style={{ fontSize: 11, color: 'var(--cms-muted)', margin: 0 }}>{hint}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
        aria-hidden="true"
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// COLOR PICKER WIDGET
// ─────────────────────────────────────────────
export const CMSColorPicker: React.FC<{
  label?: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}> = ({ label, value, onChange, presets = ['#00a4ff', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'] }) => {
  const uid = useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && <label className="cms-label" htmlFor={uid}>{label}</label>}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <input
            id={uid}
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{ width: 38, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer', padding: 2, background: 'var(--cms-surface-2)' }}
            aria-label={`${label || 'Color'}: ${value}`}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="cms-input"
          style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: '0.05em', flex: 1 }}
          placeholder="#00a4ff"
          aria-label="Código HEX del color"
        />
      </div>
      {/* Presets */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {presets.map(preset => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            title={preset}
            style={{
              width: 24, height: 24, borderRadius: 6, border: '2px solid',
              borderColor: value === preset ? '#fff' : 'transparent',
              background: preset, cursor: 'pointer', flexShrink: 0,
              transform: value === preset ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.15s',
            }}
            aria-label={`Color ${preset}`}
            aria-pressed={value === preset}
          />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// CHARACTER COUNTER TEXTAREA
// ─────────────────────────────────────────────
export const CMSTextareaWithCount: React.FC<{
  label?: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
  hint?: string;
}> = ({ label, value, onChange, rows = 3, maxLength, placeholder, hint }) => {
  const uid = useId();
  const isNearLimit = maxLength && value.length > maxLength * 0.85;
  const isOverLimit = maxLength && value.length > maxLength;

  return (
    <div>
      {label && <label htmlFor={uid} className="cms-label">{label}</label>}
      <textarea
        id={uid}
        className="cms-input"
        style={{ resize: 'vertical', minHeight: rows * 24, borderColor: isOverLimit ? 'var(--cms-danger)' : undefined }}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={isOverLimit ? true : undefined}
        aria-describedby={`${uid}-count`}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {hint && <p style={{ fontSize: 11, color: 'var(--cms-muted)', margin: 0 }}>{hint}</p>}
        {maxLength && (
          <p
            id={`${uid}-count`}
            style={{ fontSize: 11, margin: '0 0 0 auto', fontWeight: 600,
              color: isOverLimit ? 'var(--cms-danger)' : isNearLimit ? 'var(--cms-warning)' : 'var(--cms-muted)'
            }}
            aria-live="polite"
          >
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};
