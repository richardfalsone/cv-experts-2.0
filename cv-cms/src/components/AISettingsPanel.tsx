import React from 'react';
import { useEditorStore } from '../stores/editorStore';
import { CMSSectionHeader, CMSFieldGroup, CMSToggle, CMSTextarea } from './CMSAtoms';
import { CMSTextareaWithCount } from './CMSMediaUploader';

export const AISettingsPanel: React.FC = () => {
  const page = useEditorStore((s) => s.page);
  const updateMeta = useEditorStore((s) => s.updateMeta);

  if (!page) return null;

  const config = page.meta.aiConfig || {
    enabled: false,
    welcomeMessage: '¡Hola! ¿En qué puedo ayudarte?',
    systemPrompt: '',
  };

  const updateAI = (updates: Partial<typeof config>) => {
    updateMeta({
      aiConfig: { ...config, ...updates }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--cms-border)', flexShrink: 0 }}>
        <CMSSectionHeader title="Asistente IA / Chat" icon="auto_awesome" />
        <p style={{ fontSize: 11, color: 'var(--cms-muted)', marginTop: 4, lineHeight: 1.5 }}>
          Configura el comportamiento del chat inteligente para este experto. La IA usará estos datos para responder a los visitantes.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 32px' }}>
        <CMSFieldGroup title="Estado del Servicio">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <CMSToggle
              label="Habilitar Chat Inteligente"
              checked={config.enabled}
              onChange={(checked) => updateAI({ enabled: checked })}
            />
            <p style={{ fontSize: 11, color: 'var(--cms-muted)', margin: '0 0 0 32px' }}>
              Muestra u oculta el botón de chat en el portafolio público.
            </p>
          </div>
        </CMSFieldGroup>

        <CMSFieldGroup title="Mensajes e Identidad">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CMSTextarea
              label="Mensaje de Bienvenida"
              value={config.welcomeMessage || ''}
              onChange={(e) => updateAI({ welcomeMessage: e.target.value })}
              placeholder="Ej: ¡Hola! Soy el asistente de Richard..."
              hint="Este mensaje aparece al abrir el chat."
            />
            
            <CMSTextareaWithCount
              label="Instrucciones del Sistema (Cerebro)"
              value={config.systemPrompt || ''}
              onChange={(val) => updateAI({ systemPrompt: val })}
              placeholder="Escribe quién es el experto, su experiencia y cómo debe responder..."
              hint="Define la personalidad y conocimientos de la IA. Sé específico."
              rows={12}
            />
          </div>
        </CMSFieldGroup>
        
        <div style={{ padding: '0 12px', marginTop: 12 }}>
          <div style={{ 
            padding: 12, 
            background: 'rgba(0,164,255,0.05)', 
            border: '1px solid rgba(0,164,255,0.1)', 
            borderRadius: 12,
            display: 'flex',
            gap: 12
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--cms-primary)', fontSize: 20 }}>info</span>
            <p style={{ fontSize: 11, color: 'var(--cms-text-muted)', lineHeight: 1.4, margin: 0 }}>
              <strong>Tip:</strong> Indica a la IA que responda siempre en primera persona y que no mencione datos confidenciales si no están en el CV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
