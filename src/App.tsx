import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { ExecutiveLayout } from './components/Templates';
import { LanguageProvider } from './lib/LanguageContext';
import { ThemeProvider } from './lib/ThemeContext';
import { PageIntro } from './components/PageIntro';
import { supabase } from './lib/supabase';

// ── COMPONENTE CARGADOR DINÁMICO ──
const CVLoader: React.FC<{ initialData?: any }> = ({ initialData }) => {
  const { slug } = useParams<{ slug: string }>();
  const [cmsData, setCmsData] = useState<any>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  // 1. Escuchar actualizaciones en vivo del CMS (PostMessage)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const CMS_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:5174';
      if (event.origin !== CMS_URL && event.origin !== window.location.origin) return;
      
      if (event.data?.type === 'CMS_UPDATE_PAGE') {
        setCmsData(event.data.page);
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 2. Cargar datos desde Supabase si NO estamos en previsualización viva
  useEffect(() => {
    // Si ya tenemos datos (ej. por postMessage), no cargamos de DB
    if (cmsData && !loading) return;

    const fetchData = async () => {
      try {
        const targetSlug = slug || 'richard-falsone'; // Richard por defecto si no hay slug
        
        // Buscamos el experto por su slug
        const { data: expert, error: expertErr } = await supabase
          .from('experts')
          .select('id')
          .eq('slug', targetSlug)
          .single();

        if (expertErr || !expert) throw new Error('Experto no encontrado');

        // Traemos el contenido de su página técnica
        const { data: page, error: pageErr } = await supabase
          .from('pages')
          .select('blocks, meta')
          .eq('expert_id', expert.id)
          .single();

        if (pageErr || !page) throw new Error('Página no encontrada');

        setCmsData(page);
      } catch (err: any) {
        console.error('Error cargando CV:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
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
            {/* Ruta raíz: Carga a Richard por defecto o lo que definamos */}
            <Route path="/" element={<CVLoader />} />
            {/* Ruta dinámica: Para Luisa y otros expertos (/cv/luisa-diseno) */}
            <Route path="/cv/:slug" element={<CVLoader />} />
            {/* Ruta para el editor (cuando vive dentro del iframe) */}
            <Route path="/preview" element={<CVLoader />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
