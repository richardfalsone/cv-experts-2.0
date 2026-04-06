import React from 'react';
import { ExecutiveLayout } from './components/Templates';
import { LanguageProvider } from './lib/LanguageContext';
import { ThemeProvider } from './lib/ThemeContext';
import { PageIntro } from './components/PageIntro';

export default function App() {
  const [cmsData, setCmsData] = React.useState<any>(null);

  // ── PUENTE DE COMUNICACIÓN CON EL CMS ──
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const CMS_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:5174';
      // Solo aceptamos mensajes del origen del CMS o del mismo origen
      const isAuthorized = event.origin === CMS_URL || event.origin === window.location.origin;
      if (!isAuthorized) return;
      
      if (event.data?.type === 'CMS_UPDATE_PAGE') {
        setCmsData(event.data.page);
      }
    };

    window.addEventListener('message', handleMessage);
    // Notificamos al CMS que el iframe está listo para recibir datos
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="relative min-h-screen bg-[var(--bg)]">
          <PageIntro />
          <ExecutiveLayout cmsData={cmsData} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
