import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Icon, Button, CircularProgress, SpiderChart, ScrollReveal } from './Atoms';
import { ProfileCard, NavButton, ServiceCard, RecommendationCard, ThemeToggle, LanguageSwitch, DownloadPDFButton, MobileCarousel, InfoList, ImageModal, AIAssistant } from './Molecules';
import { PrintableCV } from './PrintableCV';
import { StatsGrid, PortfolioGrid, HistorySection, ContactForm, ClientsSection } from './Organisms';
import { useLanguage } from '../lib/LanguageContext';

export const BlogPostPage: React.FC<{ postId: string, onBack: () => void }> = ({ postId, onBack }) => {
  const { lang, t } = useLanguage();
  
  React.useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const article = {
    title: lang === 'en' ? 'Design Trends 2025' : 'Tendencias de Diseño 2025',
    date: 'Oct 12, 2024',
    readTime: lang === 'en' ? '5 min read' : '5 min de lectura',
    image: 'https://picsum.photos/seed/blog2/1600/900',
    content: lang === 'en' ? (
      <>
        <p className="text-xl md:text-2xl text-[var(--on-surface)] mb-10 leading-relaxed font-light">The landscape of digital design is shifting faster than ever. As we look towards 2025, the convergence of AI, spatial computing, and hyper-personalization is redefining how we interact with technology.</p>
        
        <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--on-surface)] mt-16 mb-6 tracking-tight">1. AI-Driven Hyperpersonalization</h3>
        <p className="text-base md:text-lg mb-8 leading-relaxed text-[var(--on-surface-muted)]">Interfaces are no longer static. By 2025, UI components will dynamically adapt to individual user behaviors, cognitive loads, and emotional states in real-time. Designers will shift from creating fixed layouts to designing "logic systems" that assemble interfaces on the fly.</p>
        
        <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--on-surface)] mt-16 mb-6 tracking-tight">2. Spatial UI & Neumorphism 2.0</h3>
        <p className="text-base md:text-lg mb-8 leading-relaxed text-[var(--on-surface-muted)]">With the mainstream adoption of mixed reality headsets, screen-bound 2D interfaces are breaking into the Z-axis. Depth, atmospheric lighting, and glass-like translucency (Apple Vision Pro style) are becoming the standard for premium software, replacing the flat design era completely.</p>
        
        <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--on-surface)] mt-16 mb-6 tracking-tight">3. Micro-Interactions as Feedback Loops</h3>
        <p className="text-base md:text-lg mb-8 leading-relaxed text-[var(--on-surface-muted)]">Static brutalism is out; organic fluid motion is in. Buttons that physically breathe, swipe gestures that carry tactile visual weight, and loading states that entertain rather than stall will dominate the interactive landscape.</p>
        
        <blockquote className="border-l-4 border-primary pl-8 py-4 my-16 italic text-[var(--on-surface)] text-xl md:text-2xl font-serif bg-[var(--surface-variant)]/30 rounded-r-3xl">
          "The best interface is the one that predicts your intent before you even touch the screen."
        </blockquote>
      </>
    ) : (
      <>
        <p className="text-xl md:text-2xl text-[var(--on-surface)] mb-10 leading-relaxed font-light">El panorama del diseño digital está cambiando más rápido que nunca. A medida que nos acercamos a 2025, la convergencia de la IA, la computación espacial y la hiperpersonalización está redefiniendo cómo interactuamos con la tecnología.</p>
        
        <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--on-surface)] mt-16 mb-6 tracking-tight">1. Hiperpersonalización Impulsada por IA</h3>
        <p className="text-base md:text-lg mb-8 leading-relaxed text-[var(--on-surface-muted)]">Las interfaces ya no son estáticas. Para 2025, los componentes UI se adaptarán dinámicamente a los comportamientos individuales, la carga cognitiva y los estados emocionales en tiempo real. Los diseñadores pasarán de crear layouts fijos a diseñar "sistemas lógicos" que ensamblan interfaces sobre la marcha.</p>
        
        <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--on-surface)] mt-16 mb-6 tracking-tight">2. UI Espacial y Neumorfismo 2.0</h3>
        <p className="text-base md:text-lg mb-8 leading-relaxed text-[var(--on-surface-muted)]">Con la adopción generalizada de los visores de realidad mixta, las interfaces 2D confinadas a la pantalla están rompiendo hacia el eje Z. La profundidad, la iluminación atmosférica y la translucidez similar al vidrio (estilo Apple Vision Pro) se están convirtiendo en el estándar para el software premium, reemplazando por completo la era del diseño plano (flat design).</p>
        
        <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--on-surface)] mt-16 mb-6 tracking-tight">3. Microinteracciones como Bucles de Retroalimentación</h3>
        <p className="text-base md:text-lg mb-8 leading-relaxed text-[var(--on-surface-muted)]">El brutalismo estático está fuera; el movimiento fluido y orgánico está de vuelta. Botones que "respiran" físicamente, gestos de deslizamiento que conllevan peso visual táctil y estados de carga que entretienen en lugar de estancar dominarán el panorama interactivo.</p>
        
        <blockquote className="border-l-4 border-primary pl-8 py-4 my-16 italic text-[var(--on-surface)] text-xl md:text-2xl font-serif bg-[var(--surface-variant)]/30 rounded-r-3xl">
          "La mejor interfaz es la que predice tu intención antes de que siquiera toques la pantalla."
        </blockquote>
      </>
    )
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-[900px] mx-auto py-4 px-0 space-y-12 pb-32"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-3 text-[11px] md:text-[12px] font-bold uppercase tracking-[3px] text-[var(--on-surface-muted)] hover:text-primary transition-colors group mb-8 md:mb-12 outline-none"
      >
        <div className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all">
          <Icon name="arrow_back" className="!text-sm group-hover:-translate-x-0.5 transition-transform" />
        </div>
        {t('back') || (lang === 'en' ? 'Back to Portfolio' : 'Volver al Portafolio')}
      </button>

      <header className="space-y-8">
        <div className="flex items-center gap-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[3px] text-primary">
          <span className="bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">{article.date}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
          <span className="text-[var(--on-surface-muted)]">{article.readTime}</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[var(--on-surface)] leading-[1.1]">
          {article.title}
        </h1>
      </header>

      <div className="aspect-[16/10] md:aspect-[2/1] rounded-[40px] overflow-hidden shadow-arter border border-[var(--border)] w-full relative group">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
      </div>

      <div className="pt-8 w-full max-w-[800px] mx-auto">
        {article.content}
      </div>
    </motion.article>
  );
};

export const BlogIndexPage: React.FC<{ onPostClick: (id: string) => void, onBack: () => void }> = ({ onPostClick, onBack }) => {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState('all');

  const posts = [
    { id: 'trends-2024', title: lang === 'en' ? 'Design Trends 2024' : 'Tendencias de Diseño 2024', category: 'uxDesign', image: 'https://picsum.photos/seed/blog1/800/600', description: lang === 'en' ? 'Reflecting on the UI changes that shaped 2024.' : 'Reflexionando sobre los cambios de UI que moldearon el 2024.', date: 'Jan 2024' },
    { id: 'trends-2025', title: lang === 'en' ? 'Design Trends 2025' : 'Tendencias de Diseño 2025', category: 'uxDesign', image: 'https://picsum.photos/seed/blog2/800/600', description: lang === 'en' ? 'Exploring AI and Spatial UI shifts.' : 'Explorando IA y cambios de UI espacial.', date: 'Oct 2024' },
    { id: 'trends-2026', title: lang === 'en' ? 'Design Trends 2026' : 'Tendencias de Diseño 2026', category: 'technology', image: 'https://picsum.photos/seed/blog3/800/600', description: lang === 'en' ? 'The future of seamless human-computer interaction.' : 'El futuro de la interacción humano-computadora fluida.', date: 'Dec 2025' },
    { id: 'portfolio-guide', title: lang === 'en' ? 'How to build your portfolio' : 'Cómo armar tu portfolio', category: 'career', image: 'https://picsum.photos/seed/blog4/800/600', description: lang === 'en' ? 'A comprehensive guide for junior and senior designers.' : 'Una guía completa para diseñadores junior y senior.', date: 'Feb 2024' },
    { id: 'design-systems', title: lang === 'en' ? 'Guide to Design Systems' : 'Guía de Design Systems', category: 'uxDesign', image: 'https://picsum.photos/seed/blog5/800/600', description: lang === 'en' ? 'Scaling your UI with tokens and atomic components.' : 'Escalando tu UI con tokens y componentes atómicos.', date: 'May 2024' },
    { id: 'vibe-coding', title: lang === 'en' ? 'Vibe Coding' : 'Vibe Coding', category: 'technology', image: 'https://picsum.photos/seed/blog6/800/600', description: lang === 'en' ? 'Marrying intuition and generative code paradigms.' : 'Fusionando intuición y paradigmas de código generativo.', date: 'Aug 2024' }
  ];

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.category === filter);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-[1352px] mx-auto py-4 space-y-16 pb-32"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-3 text-[11px] md:text-[12px] font-bold uppercase tracking-[3px] text-[var(--on-surface-muted)] hover:text-primary transition-colors group mb-8 md:mb-12 outline-none"
      >
        <div className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all">
          <Icon name="arrow_back" className="!text-sm group-hover:-translate-x-0.5 transition-transform" />
        </div>
        {t('back') || (lang === 'en' ? 'Back to Portfolio' : 'Volver al Portafolio')}
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-[var(--border)] pb-8">
        <div className="space-y-4">
          <h3 className="text-[13px] font-bold uppercase tracking-[4px] text-primary">{t('blog')}</h3>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--on-surface)]">{lang === 'en' ? 'All Articles' : 'Todos los Artículos'}</h2>
        </div>
        <nav className="flex flex-wrap gap-8 text-[12px] font-bold uppercase tracking-[2px]" aria-label="Blog filters">
          {['all', 'uxDesign', 'technology', 'career'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "transition-apple relative py-2", 
                filter === cat ? "text-primary" : "text-[var(--on-surface-muted)] hover:text-[var(--on-surface)]"
              )}
            >
              {cat === 'all' ? t('allCategories') || 'TODOS' : t(cat as any) || cat}
              {filter === cat && (
                <motion.div 
                  layoutId="blog-filter"
                  className="absolute -bottom-8 left-0 right-0 h-1 bg-primary rounded-full hidden md:block"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={post.id}
              className="arter-card !p-0 group overflow-hidden flex flex-col h-full border border-[var(--border)]"
            >
              <div className="h-52 md:h-60 overflow-hidden shrink-0 relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-8 md:p-10 space-y-5 flex-1 flex flex-col items-start text-left bg-[var(--surface)]">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[2px] px-3 py-1 rounded-[var(--radius-sm)] bg-primary/5 border border-primary/10">
                  {t(post.category as any) || post.category}
                </span>
                <h4 className="font-bold text-lg md:text-xl group-hover:text-primary transition-colors leading-tight">{post.title}</h4>
                <p className="text-sm text-[var(--on-surface-muted)] line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
                <div className="mt-auto pt-6 flex items-center justify-between w-full border-t border-[var(--border)]">
                  <span className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--on-surface-muted)]">{post.date}</span>
                  <Button size="sm" className="min-w-[120px]" onClick={() => onPostClick(post.id)}>
                    {t('readMore') || (lang === 'en' ? 'Read More' : 'Leer Más')}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const ExecutiveLayout = ({ children, cmsData }: { children?: React.ReactNode, cmsData?: any }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCert, setSelectedCert] = useState<{ title: string; image: string } | null>(null);
  const [activeBlogView, setActiveBlogView] = useState<'index' | string | null>(null);
  const { t, lang } = useLanguage();

  const previousBlogView = React.useRef(activeBlogView);

  useEffect(() => {
    const prev = previousBlogView.current;
    previousBlogView.current = activeBlogView;

    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    if (activeBlogView === null && prev !== null) {
      setTimeout(() => {
        const blogSection = document.getElementById('blog');
        if (blogSection) {
          mainContent.scrollTo({ 
            top: blogSection.offsetTop - 100, 
            behavior: 'auto' 
          });
        }
      }, 50);
    } else if (activeBlogView !== null && prev !== activeBlogView) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeBlogView]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'portfolio', 'history', 'contact', 'blog'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -100 && rect.top <= 300;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[var(--bg)] text-[var(--on-surface)] font-sans overflow-hidden relative selection:bg-primary/30 selection:text-primary print:h-auto print:overflow-visible print:bg-white print:text-black">
      {/* Skip to Content for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-full focus:shadow-arter transition-all"
      >
        {lang === 'en' ? 'Skip to main content' : 'Saltar al contenido principal'}
      </a>

      <div className="h-full w-full flex flex-col relative print:hidden">
        {/* Mobile Floating Pill Navigation (Hamburger) */}
        <nav 
          className="flex lg:hidden fixed top-6 left-6 right-6 md:left-10 md:right-10 max-w-[1352px] mx-auto h-16 bg-[var(--surface)]/90 backdrop-blur-md shadow-arter z-[100] rounded-full px-2 items-center justify-between border border-[var(--border)] transition-all duration-500 print:hidden"
        >
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "flex items-center gap-3 px-5 py-2.5 transition-apple group relative rounded-full border border-transparent",
                isSidebarOpen ? "text-[var(--on-surface)] glass shadow-sm !border-primary" : "text-[var(--on-surface)] hover:bg-[var(--surface-variant)]/50"
              )}
              aria-label={isSidebarOpen ? (lang === 'en' ? 'Close menu' : 'Cerrar menú') : (lang === 'en' ? 'Open menu' : 'Abrir menú')}
            >
              <Icon name={isSidebarOpen ? "close" : "menu"} className="!text-xl transition-apple group-hover:scale-105" />
              <span className="text-[12px] font-semibold tracking-tight transition-apple">
                {lang === 'en' ? 'Menu' : 'Menú'}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-1 shrink-0 pr-2">
            <LanguageSwitch />
            <DownloadPDFButton />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Navigation Dropdown (Floating Glass) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-[90] lg:hidden backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="fixed top-[100px] left-6 right-6 md:left-10 md:right-10 max-w-[1352px] mx-auto bg-[var(--surface)]/95 backdrop-blur-xl shadow-arter-lg z-[100] rounded-[32px] border border-[var(--border)] flex flex-col p-6 print:hidden overflow-hidden"
              >
                <nav className="flex flex-col space-y-2">
                  <h4 className="text-[var(--on-surface-muted)] font-bold uppercase tracking-[4px] text-[10px] mb-4 pl-4">{t('home')}</h4>
                  <ul className="space-y-1">
                    {[
                      { id: 'home', label: t('home'), icon: 'home' },
                      { id: 'portfolio', label: t('portfolio'), icon: 'work' },
                      { id: 'history', label: t('history'), icon: 'history_edu' },
                      { id: 'contact', label: t('contact'), icon: 'mail' },
                      { id: 'blog', label: t('blog'), icon: 'article' }
                    ].map((item) => (
                      <li key={item.id}>
                        <button 
                          onClick={() => scrollTo(item.id)}
                          className={cn(
                            "flex items-center gap-4 w-full text-left px-4 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-[2px] transition-all",
                            activeSection === item.id 
                              ? "bg-primary/10 text-primary" 
                              : "text-[var(--on-surface-muted)] hover:bg-[var(--surface-variant)] hover:text-[var(--on-surface)]"
                          )}
                        >
                          <Icon name={item.icon} className="!text-xl" />
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Floating Navigation */}
        <nav 
          className="hidden lg:flex fixed top-10 left-1/2 -translate-x-1/2 h-16 bg-[var(--surface)]/90 backdrop-blur-md shadow-arter z-[100] rounded-full px-4 items-center gap-2 border border-[var(--border)] transition-all duration-500 print:hidden"
          aria-label={lang === 'en' ? 'Main Navigation' : 'Navegación Principal'}
        >
          <div className="flex items-center gap-1 shrink-0">
            <NavButton icon="home" label={t('home')} active={activeSection === 'home'} onClick={() => scrollTo('home')} />
            <NavButton icon="work" label={t('portfolio')} active={activeSection === 'portfolio'} onClick={() => scrollTo('portfolio')} />
            <NavButton icon="history_edu" label={t('history')} active={activeSection === 'history'} onClick={() => scrollTo('history')} />
            <NavButton icon="mail" label={t('contact')} active={activeSection === 'contact'} onClick={() => scrollTo('contact')} />
            <NavButton icon="article" label={t('blog')} active={activeSection === 'blog'} onClick={() => scrollTo('blog')} />
          </div>
          <div className="h-8 w-px bg-[var(--border)] mx-2 shrink-0" />
          <div className="flex items-center gap-1 shrink-0 pr-1">
            <LanguageSwitch />
            <DownloadPDFButton />
            <ThemeToggle />
          </div>
        </nav>

        {/* Main Content Area */}
        <main 
          id="main-content"
          className="flex-1 lg:h-full overflow-y-auto scrollbar-hide relative mt-0 scroll-smooth bg-[var(--surface)] shadow-arter print:overflow-visible print:h-auto print:mt-0 print:shadow-none"
          tabIndex={-1}
        >
          <div className="w-full relative px-6 md:px-10 lg:px-14 pt-28 lg:pt-32 pb-16 max-w-[1400px] mx-auto">
            <AnimatePresence mode="wait">
              {activeBlogView === 'index' && (
                <BlogIndexPage key="blog-index" onPostClick={setActiveBlogView} onBack={() => setActiveBlogView(null)} />
              )}
              {typeof activeBlogView === 'string' && activeBlogView !== 'index' && (
                <BlogPostPage key="blog-page" postId={activeBlogView} onBack={() => setActiveBlogView('index')} />
              )}
            </AnimatePresence>

            <div className={cn("space-y-20 md:space-y-28 lg:space-y-36 transition-all duration-700", activeBlogView ? "hidden opacity-0 h-0 overflow-hidden" : "opacity-100 block")}>
              {/* Unified Master Hero Section */}
              <section id="home" className="relative w-full min-h-[700px] bg-[var(--surface)] overflow-hidden rounded-[40px] shadow-arter-lg border border-[var(--border)] group">
              {/* Background Image & Gradients */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://ais-dev-2gvmeatgq3wpakpdr2qcel-518479397297.us-east1.run.app/image_1.png" 
                  alt="" 
                  className="w-full h-full object-cover opacity-10 group-hover:scale-105 transition-apple duration-[3000ms]" 
                  referrerPolicy="no-referrer"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface)]/80 to-[var(--surface)]" />
              </div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 lg:p-24 space-y-16">
                {/* Main Profile Info */}
                <div className="w-full max-w-4xl mx-auto">
                  <ProfileCard 
                    name="Richard Falsone" 
                    role="SR UX/UI DESIGNER EN NTT DATA EUROPE & LATAM" 
                    avatar="/perfil.jpeg" 
                    location="MÉRIDA, YUCATÁN, MÉXICO"
                  />
                </div>

                {/* Bento Grid of Stats & Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
                  {/* Info Card */}
                  <div className="glass p-10 rounded-[40px] border border-[var(--border)] shadow-arter space-y-8">
                    <h4 className="w-full text-left text-[11px] font-extrabold uppercase tracking-[4px] text-primary">{t('personalInfoTitle')}</h4>
                    <InfoList items={[
                      { label: t('personalEmail'), value: 'hola@richardfalsone.com', icon: 'mail' },
                      { label: t('personalPhone'), value: '+52 999 000 0000', icon: 'phone' },
                      { label: t('personalWorkMode'), value: t('personalRemote'), icon: 'laptop_mac' }
                    ]} />
                  </div>

                  {/* Languages Card */}
                  <motion.div
                    className="glass p-10 rounded-[40px] border border-[var(--border)] shadow-arter flex flex-col items-center justify-center gap-12 cursor-default"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(0,164,255,0.4)', boxShadow: '0 0 40px 0 rgba(0,164,255,0.15)' }}
                    transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <h4 className="w-full text-left text-[11px] font-extrabold uppercase tracking-[4px] text-primary">{lang === 'en' ? 'Languages' : 'Idiomas'}</h4>
                    <div className="flex gap-12">
                      <motion.div whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 12px rgba(0,164,255,0.6))' }} transition={{ duration: 0.3 }}>
                        <CircularProgress value={100} label="Spanish" size={90} />
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 12px rgba(0,164,255,0.6))' }} transition={{ duration: 0.3 }}>
                        <CircularProgress value={90} label="English" size={90} />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Benchmarking Card */}
                  <motion.div
                    className="glass p-10 rounded-[40px] border border-[var(--border)] shadow-arter flex flex-col items-center justify-center gap-8 cursor-default"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(0,164,255,0.4)', boxShadow: '0 0 48px 0 rgba(0,164,255,0.18)' }}
                    transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <h4 className="w-full text-left text-[11px] font-extrabold uppercase tracking-[4px] text-primary">{t('benchmarking')}</h4>
                    <motion.div
                      whileHover={{ scale: 1.08, filter: 'drop-shadow(0 0 16px rgba(0,164,255,0.5))' }}
                      transition={{ duration: 0.4 }}
                    >
                      <SpiderChart 
                        labels={['UX', 'UI', 'RESEARCH', 'STRATEGY', 'SYSTEMS', 'AGILE']}
                        data={[95, 90, 85, 92, 88, 80]}
                        seniorData={[80, 80, 75, 85, 80, 75]}
                        size={160}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Aptitudes Card (Full Width) */}
                  <div className="md:col-span-2 lg:col-span-3 glass p-10 rounded-[40px] border border-[var(--border)] shadow-arter space-y-8">
                    <h4 className="w-full text-left text-[11px] font-extrabold uppercase tracking-[4px] text-primary">{t('mainAptitudes')}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                      {[
                        lang === 'en' ? 'Design Tools' : 'Herramientas de diseño',
                        lang === 'en' ? 'Mobile Apps' : 'Aplicaciones móviles',
                        lang === 'en' ? 'Relationship Building' : 'Creación de relaciones',
                        'Atomic Design', 
                        'Design Systems', 
                        'User Research', 
                        'Prototyping', 
                        'Agile / Scrum'
                      ].map((skill, i) => (
                        <div key={i} className="flex items-center gap-3 text-[14px] text-[var(--on-surface)] font-medium group/item">
                          <Icon name="check_circle" className="text-primary !text-[16px] opacity-60 group-hover/item:opacity-100 transition-apple" />
                          <span className="truncate">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications Card (Full Width) */}
                  <div className="md:col-span-2 lg:col-span-3 glass p-10 rounded-[40px] border border-[var(--border)] shadow-arter flex flex-col hover:border-primary/30 transition-apple">
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-[11px] font-bold uppercase tracking-[4px] text-primary opacity-80">{t('certifications')}</h4>
                      <span className="text-[10px] font-bold text-[var(--on-surface-muted)] bg-[var(--surface-variant)] px-2 py-1 rounded-md">15</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4 max-h-[240px] overflow-y-auto pr-4 scrollbar-hide">
                      {[
                        { title: 'AI Foundations & Design Thinking', issuer: 'AI CERTS®', date: 'Mar 2026', image: '/image_4.png' },
                        { title: 'Generative AI: Prompt Engineering Basics', issuer: 'IBM', date: 'Aug 2025', image: '/image_5.png' },
                        { title: 'Ask Questions to Make Data-Driven Decisions', issuer: 'Google', date: 'Jul 2025', image: '/certificate.jpg' },
                        { title: 'Foundations: Data, Data, Everywhere', issuer: 'Google', date: 'Jul 2025' },
                        { title: 'Generative AI: Intro and Applications', issuer: 'IBM', date: 'Jul 2025' },
                        { title: 'Google Prompting Essentials', issuer: 'Google', date: 'Apr 2025' },
                        { title: 'Introduction to Generative AI - Español', issuer: 'Google', date: 'Apr 2025' },
                        { title: 'Workshop Variables', issuer: 'Interface School', date: 'May 2024' },
                        { title: 'English certificate (B2 Upper-Intermediate)', issuer: 'International English Test', date: 'May 2024' },
                        { title: 'Fundamentos para la gestión ágil de proyectos', issuer: 'soylider.net', date: 'May 2024' },
                        { title: 'Estrategia de UX: Organizaciones centradas en personas', issuer: 'Somos Edison', date: 'Sep 2023' },
                        { title: 'Scrum Fundamentals Certified (SFC)', issuer: 'Vabro.ai / VMEdu.com', date: 'Oct 2022' },
                        { title: 'UX: Máster en Diseño web y Experiencia de Usuario', issuer: 'Udemy', date: 'Aug 2022' },
                        { title: 'Google - Foundations of UX Design', issuer: 'Coursera', date: 'Nov 2022' },
                        { title: 'Google - Start the UX Design Process', issuer: 'Coursera', date: 'Nov 2022' }
                      ].map((cert, i) => (
                        <button 
                          key={i} 
                          onClick={() => cert.image && setSelectedCert({ title: cert.title, image: cert.image })}
                          className={cn(
                            "flex items-start gap-3 group/item w-full text-left p-2 rounded-xl transition-apple border border-transparent",
                            cert.image ? "hover:bg-primary/5 hover:border-primary/10 cursor-pointer" : "cursor-default opacity-80"
                          )}
                          disabled={!cert.image}
                        >
                          <Icon name="verified" className={cn("text-primary !text-[16px] shrink-0 opacity-60 transition-apple mt-1", cert.image && "group-hover/item:opacity-100")} />
                          <div className="flex flex-col gap-0.5">
                            <span className={cn("text-[13px] text-[var(--on-surface)] font-semibold line-clamp-2 transition-apple", cert.image && "group-hover/item:text-primary")}>{cert.title}</span>
                            <div className="flex items-center gap-2 text-[10px] text-[var(--on-surface-muted)] font-medium uppercase tracking-wider">
                              <span>{cert.issuer}</span>
                              <span className="opacity-30">•</span>
                              <span>{cert.date}</span>
                            </div>
                          </div>
                          {cert.image && (
                            <Icon name="visibility" className="!text-xs text-primary opacity-0 group-hover/item:opacity-100 transition-apple ml-auto self-center" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <ScrollReveal>
              <StatsGrid />
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <section id="services" className="space-y-12 md:space-y-16 section-spacing">
              <div className="space-y-4">
                <h3 className="font-bold uppercase tracking-[3px] text-primary">{t('experienceIn')}</h3>
                <div className="h-1.5 w-12 bg-primary rounded-full" />
              </div>
              <MobileCarousel className="md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                <ServiceCard 
                  title="UX Design" 
                  description={lang === 'en' ? 'User-centered design focusing on usability and accessibility.' : 'Diseño centrado en el usuario enfocado en usabilidad y accesibilidad.'}
                  extendedDesc={t('uxDesignExtended') as string}
                  icon="person"
                />
                <ServiceCard 
                  title="UI Design" 
                  description={lang === 'en' ? 'Creating visually stunning and intuitive interfaces.' : 'Creando interfaces visualmente impresionantes e intuitivas.'}
                  extendedDesc={t('uiDesignExtended') as string}
                  icon="palette"
                />
                <ServiceCard 
                  title={t('interactiveDesign') as string} 
                  description={t('interactiveDesc') as string}
                  extendedDesc={t('interactiveExtended') as string}
                  icon="touch_app"
                />
                <ServiceCard 
                  title={t('serviceDesign') as string} 
                  description={t('serviceDesc') as string}
                  extendedDesc={t('serviceExtended') as string}
                  icon="support_agent"
                />
                <ServiceCard 
                  title="Vibe Coding" 
                  description={lang === 'en' ? 'Building cohesive and memorable brand experiences.' : 'Construyendo experiencias de marca cohesivas y memorables.'}
                  extendedDesc={t('vibeExtended') as string}
                  icon="auto_awesome"
                />
              </MobileCarousel>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <PortfolioGrid />
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <HistorySection />
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <section id="recommendations" className="space-y-12 md:space-y-16 section-spacing">
              <div className="space-y-4">
                <h3 className="font-bold uppercase tracking-[3px] text-primary">{t('recommendations')}</h3>
                <div className="h-1.5 w-12 bg-primary rounded-full" />
              </div>
              <MobileCarousel className="md:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-12">
                <RecommendationCard 
                  name="Paulina G." 
                  role="Product Manager @ NTT DATA" 
                  text={lang === 'en' ? "Richard is an exceptional designer with a keen eye for detail." : "Richard es un diseñador excepcional con un gran ojo para los detalles."}
                  avatar="https://i.pravatar.cc/150?u=paulina"
                  rating={5}
                />
                <RecommendationCard 
                  name="Carlos R." 
                  role="Lead Developer @ DaCodes" 
                  text={lang === 'en' ? "Working with Richard was a great experience. His designs are top-notch." : "Trabajar con Richard fue una gran experiencia. Sus diseños son de primer nivel."}
                  avatar="https://i.pravatar.cc/150?u=carlos"
                  rating={5}
                />
                <RecommendationCard 
                  name="Elena M." 
                  role="CEO @ Addinteli" 
                  text={lang === 'en' ? "Richard transformed our product with his innovative design approach." : "Richard transformó nuestro producto con su enfoque de diseño innovador."}
                  avatar="https://i.pravatar.cc/150?u=elena"
                  rating={5}
                />
              </MobileCarousel>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <ClientsSection />
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <ContactForm />
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <section id="blog" className="space-y-12 md:space-y-16 section-spacing">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
                <div className="space-y-4">
                  <h3 className="font-bold uppercase tracking-[3px] text-primary">{t('blog')}</h3>
                  <div className="h-1.5 w-12 bg-primary rounded-full" />
                </div>
                <div className="flex items-center">
                  <span 
                    onClick={() => setActiveBlogView('index')}
                    className="cursor-pointer text-xs md:text-sm font-bold uppercase tracking-[2px] text-[var(--on-surface-muted)] hover:text-primary transition-colors flex items-center gap-2"
                  >
                    {t('viewAll') || (lang === 'en' ? 'View All' : 'Ver Todos')} <Icon name="arrow_forward" className="!text-sm" />
                  </span>
                </div>
              </div>
              <MobileCarousel className="md:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="arter-card !p-0 group overflow-hidden flex flex-col h-full border border-[var(--border)]">
                    <div className="h-52 md:h-60 overflow-hidden shrink-0 relative">
                      <img 
                        src={`https://picsum.photos/seed/blog${i}/800/600`} 
                        alt="Blog post" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-8 md:p-10 space-y-5 flex-1 flex flex-col items-start text-left bg-[var(--surface)]">
                      <h4 className="font-bold text-lg md:text-xl group-hover:text-primary transition-colors leading-tight">{lang === 'en' ? `Design Trends 202${i+3}` : `Tendencias de Diseño 202${i+3}`}</h4>
                      <p className="text-sm text-[var(--on-surface-muted)] line-clamp-3">
                        {lang === 'en' 
                          ? 'Exploring the latest shifts in user experience and interface design for the upcoming years.' 
                          : 'Explorando los últimos cambios en la experiencia del usuario y el diseño de interfaces para los próximos años.'}
                      </p>
                      <div className="mt-auto pt-4 flex items-center justify-between w-full">
                        <Button size="sm" className="min-w-[120px]" onClick={() => setActiveBlogView(`trends-202${i+3}`)}>
                          {t('readMore') || (lang === 'en' ? 'Read More' : 'Leer Más')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </MobileCarousel>
              </section>
            </ScrollReveal>

            <footer className="pt-20 pb-10 border-t border-[var(--border)] text-center space-y-8">
              <p className="text-xs font-bold uppercase tracking-[3px] text-[var(--on-surface-muted)]">
                © 2024 Richard Falsone. {lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}
              </p>
              <div className="flex justify-center gap-10 text-[11px] font-bold uppercase tracking-[2px] text-[var(--on-surface-muted)]">
                <a href="#" className="hover:text-primary transition-colors relative group">
                  LinkedIn
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </a>
                <a href="#" className="hover:text-primary transition-colors relative group">
                  Behance
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </a>
                <a href="#" className="hover:text-primary transition-colors relative group">
                  Dribbble
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </a>
              </div>
            </footer>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {selectedCert && (
            <ImageModal 
              isOpen={!!selectedCert} 
              onClose={() => setSelectedCert(null)}
              image={selectedCert.image}
              title={selectedCert.title}
            />
          )}
        </AnimatePresence>

        {(cmsData?.meta?.aiConfig?.enabled !== false) && (
          <AIAssistant config={cmsData?.meta?.aiConfig || { enabled: true, systemPrompt: '', welcomeMessage: '' }} />
        )}
      </div>

      <PrintableCV />
    </div>
  );
};
