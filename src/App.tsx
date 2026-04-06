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
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold italic tracking-tighter uppercase opacity-30">404</div>
          <div className="text-sm opacity-50 uppercase tracking-[0.3em] font-medium">Perfil no Encontrado</div>
          <div className="text-[10px] opacity-20 uppercase">Verifica la URL o contacta al administrador</div>
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
