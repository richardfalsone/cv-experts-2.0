import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { ExecutiveLayout } from './components/Templates';
import { LanguageProvider } from './lib/LanguageContext';
import { ThemeProvider } from './lib/ThemeContext';
import { PageIntro } from './components/PageIntro';
import { supabase } from './lib/supabase';

// ── COMPONENTE CARGADOR DINÁMICO ──
const CVLoader: React.FC<{ isPreview?: boolean }> = ({ isPreview }) => {
  const { slug } = useParams<{ slug: string }>();
  const [cmsData, setCmsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Escuchar actualizaciones en vivo del CMS (PostMessage)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Permitir mensajes desde el mismo origen o desde la URL del CMS configurada
      const CMS_URL = import.meta.env.VITE_CMS_URL;
      
      // En desarrollo o previsualización, somos un poco más flexibles con el origen si el tipo es correcto
      if (event.data?.type === 'CMS_UPDATE_PAGE') {
        setCmsData(event.data.page);
        setLoading(false);
        setError(null);
      }
    };

    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 2. Carga desde Supabase: Solo para rutas públicas (con slug)
  useEffect(() => {
    if (isPreview) return;

    const fetchData = async () => {
      try {
        const targetSlug = slug || 'richard-falsone';

        // Step 1: Find expert by slug
        const { data: expert, error: expertErr } = await supabase
          .from('experts')
          .select('id, full_name, slug')
          .eq('slug', targetSlug)
          .maybeSingle(); // maybeSingle() returns null instead of error when not found

        if (expertErr) throw new Error(`DB Error: ${expertErr.message}`);
        if (!expert) throw new Error(`Perfil "${targetSlug}" no encontrado`);

        // Step 2: Load the page for this expert
        const { data: page, error: pageErr } = await supabase
          .from('pages')
          .select('blocks, meta')
          .eq('expert_id', expert.id)
          .maybeSingle();

        if (pageErr) throw new Error(`DB Error: ${pageErr.message}`);
        if (!page) throw new Error(`No hay página publicada para "${expert.full_name}"`);

        setCmsData(page);
      } catch (err: any) {
        console.error('[CVLoader] Error cargando CV:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, isPreview]);

  // UI DE CARGA / ERROR (Público)
  if (error && !cmsData && !isPreview) {
    const isConfigMissing = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="text-6xl font-bold italic tracking-tighter uppercase opacity-20">404</div>
          <div className="space-y-2">
            <div className="text-sm opacity-80 uppercase tracking-[0.3em] font-bold text-red-500">Error de Configuración</div>
            <div className="text-[12px] opacity-60 leading-relaxed">
              {isConfigMissing 
                ? "Las llaves de Supabase no están configuradas en el entorno (Vercel/Env). Contacta al administrador." 
                : `No se pudo encontrar el perfil "${slug || 'richard-falsone'}". Asegúrate de que el slug sea correcto.`}
            </div>
          </div>
          
          {/* Solo visible para ayudar al debug sin exponer llaves reales */}
          <div className="pt-8 border-t border-white/5 space-y-1">
            <div className="text-[8px] opacity-30 uppercase tracking-widest font-bold">Estado Técnico</div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1.5 grayscale opacity-50">
                <div className={`w-1.5 h-1.5 rounded-full ${import.meta.env.VITE_SUPABASE_URL ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-[7px] font-bold uppercase tracking-tighter text-white/40">URL</span>
              </div>
              <div className="flex items-center gap-1.5 grayscale opacity-50">
                <div className={`w-1.5 h-1.5 rounded-full ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-[7px] font-bold uppercase tracking-tighter text-white/40">KEY</span>
              </div>
              <div className="flex items-center gap-1.5 grayscale opacity-50">
                <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="text-[7px] font-bold uppercase tracking-tighter text-white/40">Query</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de espera para el Editor (Modo Preview)
  if (isPreview && !cmsData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white overflow-hidden pointer-events-none">
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-400 opacity-80 animate-pulse">Sincronización Activa</span>
            <span className="text-[8px] font-medium tracking-[0.2em] uppercase text-white/30">Esperando datos desde el Editor CMS...</span>
          </div>
        </div>
      </div>
    );
  }

  // Cargador estándar (para el público)
  if (loading && !cmsData && !isPreview) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white">
        <div className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/20 animate-pulse">
          Desplegando Entorno Impecable
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg)]">
      {isPreview && (
        <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-full">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-blue-400">Preview Live</span>
          </div>
        </div>
      )}
      <PageIntro />
      <ExecutiveLayout cmsData={cmsData} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CVLoader />} />
            <Route path="/cv/:slug" element={<CVLoader />} />
            <Route path="/preview" element={<CVLoader isPreview />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
