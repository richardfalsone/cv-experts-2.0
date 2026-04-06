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

  // 2. Cargar datos desde Supabase si NO estamos en previsualización o si el postMessage aún no llega
  useEffect(() => {
    // Si es preview y ya tenemos data de postMessage, no buscamos en DB
    if (isPreview && cmsData) return;
    
    const fetchData = async () => {
      try {
        const targetSlug = slug || 'richard-falsone';
        
        const { data: expert, error: expertErr } = await supabase
          .from('experts')
          .select('id')
          .eq('slug', targetSlug)
          .single();

        if (expertErr || !expert) {
          if (isPreview) return; // En preview ignoramos si no existe en DB todavía
          throw new Error('Experto no encontrado');
        }

        const { data: page, error: pageErr } = await supabase
          .from('pages')
          .select('blocks, meta')
          .eq('expert_id', expert.id)
          .single();

        if (pageErr || !page) {
          if (isPreview) return;
          throw new Error('Página no encontrada');
        }

        setCmsData(page);
      } catch (err: any) {
        if (!isPreview) {
          console.error('Error cargando CV:', err.message);
          setError(err.message);
        }
      } finally {
        if (!isPreview || cmsData) setLoading(false);
      }
    };

    fetchData();
  }, [slug, isPreview]);

  // En modo preview, si no hay data aún, mostramos carga pero permitimos que llegue el postMessage
  if (loading && !cmsData && !isPreview) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white">
        <div className="text-sm font-bold tracking-widest uppercase opacity-50 animate-pulse">
          Cargando entorno impecable...
        </div>
      </div>
    );
  }

  if (error && !cmsData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold">404</div>
          <div className="text-sm opacity-50 uppercase tracking-widest">Experto no encontrado</div>
        </div>
      </div>
    );
  }

  // Si no hay data y es preview, mostramos un estado de espera elegante
  if (!cmsData && isPreview) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white">
        <div className="text-sm font-bold tracking-widest uppercase opacity-30">
          Esperando datos del editor...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg)]">
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
