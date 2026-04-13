import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Icon, Button, CircularProgress, SpiderChart, ScrollReveal } from './Atoms';
import { ProfileCard, NavButton, ServiceCard, RecommendationCard, ThemeToggle, LanguageSwitch, DownloadPDFButton, MobileCarousel, InfoList, ImageModal, AIAssistant } from './Molecules';
import { PrintableCV } from './PrintableCV';
import { StatsGrid, PortfolioGrid, HistorySection, CertificationsSection, ContactForm, ClientsSection } from './Organisms';
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
    { id: 'trends-2025', title: lang === 'en' ? 'Design Trends 2025' : 'Tendencias de Diseño 2025', category: 'uxDesign', image: 'https://picsum.photos/seed/blog1/800/600', description: lang === 'en' ? 'Exploring AI and Spatial UI shifts.' : 'Explorando IA y cambios de UI espacial.', date: 'Oct 2024' },
    { id: 'trends-2026', title: lang === 'en' ? 'Design Trends 2026' : 'Tendencias de Diseño 2026', category: 'technology', image: 'https://picsum.photos/seed/blog1/800/600', description: lang === 'en' ? 'The future of seamless human-computer interaction.' : 'El futuro de la interacción humano-computadora fluida.', date: 'Dec 2025' },
    { id: 'portfolio-guide', title: lang === 'en' ? 'How to build your portfolio' : 'Cómo armar tu portfolio', category: 'career', image: 'https://picsum.photos/seed/blog1/800/600', description: lang === 'en' ? 'A comprehensive guide for junior and senior designers.' : 'Una guía completa para diseñadores junior y senior.', date: 'Feb 2024' },
    { id: 'design-systems', title: lang === 'en' ? 'Guide to Design Systems' : 'Guía de Design Systems', category: 'uxDesign', image: 'https://picsum.photos/seed/blog1/800/600', description: lang === 'en' ? 'Scaling your UI with tokens and atomic components.' : 'Escalando tu UI con tokens y componentes atómicos.', date: 'May 2024' },
    { id: 'vibe-coding', title: lang === 'en' ? 'Vibe Coding' : 'Vibe Coding', category: 'technology', image: 'https://picsum.photos/seed/blog1/800/600', description: lang === 'en' ? 'Marrying intuition and generative code paradigms.' : 'Fusionando intuición y paradigmas de código generativo.', date: 'Aug 2024' }
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
        <nav className="flex gap-8 text-[12px] font-bold uppercase tracking-[2px]" aria-label="Blog filters">
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
                <p className="text-sm text-[var(--on-surface-muted)] line-clamp-3">
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
    const handleCMSMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CMS_SELECT_BLOCK') {
        const blockId = event.data.blockId;
        const element = document.getElementById(blockId);
        if (element) {
          // Tell CMS where this block is located
          window.parent.postMessage({
            type: 'BLOCK_POSITION',
            blockId,
            offsetTop: element.offsetTop
          }, '*');
        }
      }
    };

    window.addEventListener('message', handleCMSMessage);
    return () => window.removeEventListener('message', handleCMSMessage);
  }, []);

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

  const getBlockProps = (type: string) => {
    return cmsData?.blocks?.find((b: any) => b.type === type)?.props || {};
  };

  const heroProps = getBlockProps('hero');
  const infoProps = getBlockProps('info_card');
  const langProps = getBlockProps('languages');
  const skillsProps = getBlockProps('skills_chart');
  const aptitudesProps = getBlockProps('aptitudes');
  const statsProps = getBlockProps('stats');
  const servicesProps = getBlockProps('services');
  const portfolioProps = getBlockProps('portfolio');
  const recommendationsProps = getBlockProps('recommendations');
  const historyProps = getBlockProps('experience');

  const servicesList = servicesProps.items || [
    { title: "UX Design", description: lang === 'en' ? 'User-centered design focusing on usability and accessibility.' : 'Diseño centrado en el usuario enfocado en usabilidad y accesibilidad.', icon: "person" },
    { title: "UI Design", description: lang === 'en' ? 'Creating visually stunning and intuitive interfaces.' : 'Creando interfaces visualmente impresionantes e intuitivas.', icon: "palette" },
    { title: t('interactiveDesign') as string, description: t('interactiveDesc') as string, icon: "touch_app" },
    { title: t('serviceDesign') as string, description: t('serviceDesc') as string, icon: "support_agent" },
    { title: "Vibe Coding", description: lang === 'en' ? 'Building cohesive and memorable brand experiences.' : 'Construyendo experiencias de marca cohesivas y memorables.', icon: "auto_awesome" }
  ];

  return (
    <div className="h-screen w-full bg-[var(--bg)] text-[var(--on-surface)] font-sans overflow-hidden relative selection:bg-primary/30 selection:text-primary print:h-auto print:overflow-visible print:bg-white print:text-black">
      <div className="h-full w-full flex flex-col relative print:hidden">
        <nav className={cn(
          "flex lg:hidden fixed top-6 left-6 right-6 md:left-10 md:right-10 max-w-[1352px] mx-auto h-16 bg-[var(--surface)]/90 backdrop-blur-md shadow-arter z-[100] rounded-full px-2 items-center justify-between border border-[var(--border)] transition-all duration-500 print:hidden",
          cmsData?.meta?.headerConfig?.showNav === false && "hidden"
        )}>
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={cn("flex items-center gap-3 px-5 py-2.5 transition-apple group relative rounded-full border border-transparent", isSidebarOpen ? "text-[var(--on-surface)] glass shadow-sm !border-primary" : "text-[var(--on-surface)] hover:bg-[var(--surface-variant)]/50")}>
              <Icon name={isSidebarOpen ? "close" : "menu"} className="!text-xl" />
              <span className="text-[12px] font-semibold">{lang === 'en' ? 'Menu' : 'Menú'}</span>
            </button>
          </div>
          <div className="flex items-center gap-1 shrink-0 pr-2">
            <LanguageSwitch />
            <DownloadPDFButton />
            <ThemeToggle />
          </div>
        </nav>

        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-[90] lg:hidden backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} className="fixed top-[100px] left-6 right-6 md:left-10 md:right-10 max-w-[1352px] mx-auto bg-[var(--surface)]/95 backdrop-blur-xl shadow-arter-lg z-[100] rounded-[32px] border border-[var(--border)] flex flex-col p-6 print:hidden overflow-hidden">
                <nav className="flex flex-col space-y-2">
                  <h4 className="text-[var(--on-surface-muted)] font-bold uppercase tracking-[4px] text-[10px] mb-4 pl-4">{cmsData?.meta?.navigationLabels?.home || t('home')}</h4>
                  <ul className="space-y-1">
                    {[
                      { id: 'home', label: cmsData?.meta?.navigationLabels?.home || t('home'), icon: 'home' }, 
                      { id: 'portfolio', label: cmsData?.meta?.navigationLabels?.portfolio || t('portfolio'), icon: 'work' }, 
                      { id: 'history', label: cmsData?.meta?.navigationLabels?.history || t('history'), icon: 'history_edu' }, 
                      { id: 'contact', label: cmsData?.meta?.navigationLabels?.contact || t('contact'), icon: 'mail' }, 
                      { id: 'blog', label: cmsData?.meta?.navigationLabels?.blog || t('blog'), icon: 'article' }
                    ].map((item) => (
                      <li key={item.id}>
                        <button onClick={() => scrollTo(item.id)} className={cn("flex items-center gap-4 w-full text-left px-4 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-[2px] transition-all", activeSection === item.id ? "bg-primary/10 text-primary" : "text-[var(--on-surface-muted)] hover:bg-[var(--surface-variant)] hover:text-[var(--on-surface)]")}>
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

        <nav className={cn(
          "hidden lg:flex fixed left-1/2 -translate-x-1/2 h-16 bg-[var(--surface)]/90 backdrop-blur-md shadow-arter z-[100] rounded-full px-4 items-center gap-2 border border-[var(--border)] transition-all duration-500 print:hidden",
          cmsData?.meta?.headerConfig?.sticky === false ? "absolute top-10" : "fixed top-10",
          cmsData?.meta?.headerConfig?.showNav === false && "hidden"
        )}>
          <div className="flex items-center gap-1 shrink-0">
            <NavButton icon="home" label={cmsData?.meta?.navigationLabels?.home || t('home')} active={activeSection === 'home'} onClick={() => scrollTo('home')} />
            <NavButton icon="work" label={cmsData?.meta?.navigationLabels?.portfolio || t('portfolio')} active={activeSection === 'portfolio'} onClick={() => scrollTo('portfolio')} />
            <NavButton icon="history_edu" label={cmsData?.meta?.navigationLabels?.history || t('history')} active={activeSection === 'history'} onClick={() => scrollTo('history')} />
            <NavButton icon="article" label={cmsData?.meta?.navigationLabels?.blog || t('blog')} active={activeSection === 'blog'} onClick={() => scrollTo('blog')} />
            <NavButton icon="mail" label={cmsData?.meta?.navigationLabels?.contact || t('contact')} active={activeSection === 'contact'} onClick={() => scrollTo('contact')} />
          </div>
          <div className="h-8 w-px bg-[var(--border)] mx-2 shrink-0" />
          <div className="flex items-center gap-1 shrink-0 pr-1">
            <LanguageSwitch />
            <DownloadPDFButton />
            <ThemeToggle />
          </div>
        </nav>

        <main id="main-content" className="flex-1 lg:h-full overflow-y-auto scrollbar-hide relative mt-0 scroll-smooth bg-[var(--surface)] shadow-arter print:overflow-visible print:h-auto print:mt-0 print:shadow-none" tabIndex={-1}>
          <div className="w-full relative px-6 md:px-10 lg:px-14 pt-28 lg:pt-32 pb-16 max-w-[1400px] mx-auto">
            <AnimatePresence mode="wait">
              {activeBlogView === 'index' && <BlogIndexPage key="blog-index" onPostClick={setActiveBlogView} onBack={() => setActiveBlogView(null)} />}
              {typeof activeBlogView === 'string' && activeBlogView !== 'index' && <BlogPostPage key="blog-page" postId={activeBlogView} onBack={() => setActiveBlogView('index')} />}
            </AnimatePresence>

            <div className={cn("space-y-20 md:space-y-28 lg:space-y-36 transition-all duration-700", activeBlogView ? "hidden opacity-0 h-0 overflow-hidden" : "opacity-100 block")}>
              <section id={cmsData?.blocks?.find((b: any) => b.type === 'hero')?.id || 'home'} className="relative w-full min-h-[700px] bg-[var(--surface)] overflow-hidden rounded-[40px] shadow-arter-lg border border-[var(--border)] group">
                <div className="absolute inset-0 z-0">
                  <img src={heroProps.bgImage || "https://ais-dev-2gvmeatgq3wpakpdr2qcel-518479397297.us-east1.run.app/image_1.png"} alt="" className="w-full h-full object-cover opacity-10 group-hover:scale-105 transition-apple duration-[3000ms]" referrerPolicy="no-referrer" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface)]/80 to-[var(--surface)]" />
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 lg:p-24 space-y-16">
                  <div className="w-full max-w-4xl mx-auto">
                    <ProfileCard 
                      name={heroProps.name || heroProps.fullName || "CV Expert"} 
                      role={heroProps.role || "Professional"} 
                      avatar={heroProps.avatar || "/perfil.jpeg"} 
                      location={heroProps.location || ""}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
                    <div id={cmsData?.blocks?.find((b: any) => b.type === 'info_card')?.id} className="glass p-10 rounded-[40px] border border-[var(--border)] shadow-arter space-y-8 text-left">
                      <h4 className="w-full text-left text-[11px] font-extrabold uppercase tracking-[4px] text-primary">{infoProps.title || t('personalInfoTitle')}</h4>
                      <InfoList items={[
                        { label: t('personalEmail'), value: infoProps.email || heroProps.email || '', icon: 'mail' },
                        { label: t('personalPhone'), value: infoProps.phone || heroProps.phone || '', icon: 'phone' },
                        { label: t('personalWorkMode'), value: infoProps.workMode || heroProps.workMode || '', icon: 'laptop_mac' }
                      ]} />
                    </div>

                    <div id={cmsData?.blocks?.find((b: any) => b.type === 'languages')?.id} className="glass p-10 rounded-[40px] border border-[var(--border)] shadow-arter flex flex-col items-center justify-center gap-12">
                      <h4 className="w-full text-left text-[11px] font-extrabold uppercase tracking-[4px] text-primary">{langProps.title || (lang === 'en' ? 'Languages' : 'Idiomas')}</h4>
                      <div className="flex gap-12">
                        {((langProps.languages || heroProps.languages) || [
                          { name: 'Spanish', level: 100 },
                          { name: 'English', level: 90 }
                        ]).map((l: any, idx: number) => (
                          <CircularProgress key={idx} value={l.level ?? l.value ?? 0} label={l.name || l.label || ''} size={90} />
                        ))}
                      </div>
                    </div>

                    <div id={cmsData?.blocks?.find((b: any) => b.type === 'skills_chart')?.id} className="glass p-10 rounded-[40px] border border-[var(--border)] shadow-arter flex flex-col items-center justify-center gap-8">
                      <h4 className="w-full text-left text-[11px] font-extrabold uppercase tracking-[4px] text-primary">{skillsProps.title || t('benchmarking')}</h4>
                      <SpiderChart 
                        labels={(skillsProps.skills?.map((s: any) => s.label) || heroProps.skillsLabels) || ['UX', 'UI', 'RES', 'STR', 'SYS', 'AGI']} 
                        data={(skillsProps.skills?.map((s: any) => s.value) || heroProps.skillsData) || [95, 90, 85, 92, 88, 80]} 
                        seniorData={(skillsProps.seniorData || heroProps.seniorSkillsData) || [80, 80, 75, 85, 80, 75]} 
                        size={160} 
                      />
                    </div>

                    <div id={cmsData?.blocks?.find((b: any) => b.type === 'aptitudes')?.id} className="md:col-span-2 lg:col-span-3 glass p-10 rounded-[40px] border border-[var(--border)] shadow-arter space-y-8">
                      <h4 className="w-full text-left text-[11px] font-extrabold uppercase tracking-[4px] text-primary">{aptitudesProps.title || t('mainAptitudes')}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {((aptitudesProps.items || heroProps.aptitudes) || ['Atomic Design', 'Design Systems', 'User Research', 'Prototyping']).map((skill: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 text-[14px] text-[var(--on-surface)] font-medium text-left">
                            <Icon name="check_circle" className="text-primary !text-[16px]" />
                            <span className="truncate">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <ScrollReveal>
                <div id={cmsData?.blocks?.find((b: any) => b.type === 'stats')?.id || 'stats'}>
                  <StatsGrid data={statsProps.stats || statsProps.items} title={statsProps.title} />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <section id={cmsData?.blocks?.find((b: any) => b.type === 'services')?.id || 'services'} className="space-y-12 md:space-y-16 section-spacing">
                  <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-[3px] text-primary">{servicesProps.title || t('experienceIn')}</h3>
                    <div className="h-1.5 w-12 bg-primary rounded-full" />
                  </div>
                  <MobileCarousel className="md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                    {servicesList.map((service: any, i: number) => (
                      <ServiceCard key={i} title={service.title} description={service.description} extendedDesc={service.extendedDesc} icon={service.icon} />
                    ))}
                  </MobileCarousel>
                </section>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <div id={cmsData?.blocks?.find((b: any) => b.type === 'portfolio')?.id || 'portfolio'}>
                  <PortfolioGrid 
                    projects={portfolioProps.items || portfolioProps.projects} 
                    title={portfolioProps.title}
                    subtitle={portfolioProps.subtitle}
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <div id={cmsData?.blocks?.find((b: any) => b.type === 'experience')?.id || 'experience'}>
                  <HistorySection 
                    work={historyProps.items} 
                    education={historyProps.education} 
                    title={historyProps.title}
                    educationTitle={historyProps.educationTitle}
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <div id={cmsData?.blocks?.find((b: any) => b.type === 'certifications')?.id || 'certifications'}>
                  <CertificationsSection 
                    title={getBlockProps('certifications').title} 
                    items={getBlockProps('certifications').items} 
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <section id={cmsData?.blocks?.find((b: any) => b.type === 'recommendations')?.id || 'recommendations'} className="space-y-12 md:space-y-16 section-spacing">
                  <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-[3px] text-primary">{recommendationsProps.title || t('recommendations')}</h3>
                    <div className="h-1.5 w-12 bg-primary rounded-full" />
                  </div>
                  <MobileCarousel className="md:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-12">
                    {(recommendationsProps.items || [
                      { name: "Paulina G.", role: "Product Manager @ NTT DATA", text: lang === 'en' ? "Richard is an exceptional designer with a keen eye for detail." : "Richard es un diseñador excepcional con un gran ojo para los detalles.", avatar: "https://i.pravatar.cc/150?u=paulina", rating: 5 },
                      { name: "Carlos R.", role: "Lead Developer @ DaCodes", text: lang === 'en' ? "Working with Richard was a great experience. His designs are top-notch." : "Trabajar con Richard fue una gran experiencia. Sus diseños son de primer nivel.", avatar: "https://i.pravatar.cc/150?u=carlos", rating: 5 },
                      { name: "Elena M.", role: "CEO @ Addinteli", text: lang === 'en' ? "Richard transformed our product with his innovative design approach." : "Richard transformó nuestro producto con su enfoque de diseño innovador.", avatar: "https://i.pravatar.cc/150?u=elena", rating: 5 }
                    ]).map((rec: any, i: number) => (
                      <RecommendationCard key={i} name={rec.name} role={rec.role} text={rec.text} avatar={rec.avatar} rating={rec.rating} />
                    ))}
                  </MobileCarousel>
                </section>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <ClientsSection />
              </ScrollReveal>
              
              <ScrollReveal delay={0.05}>
                <section id={cmsData?.blocks?.find((b: any) => b.type === 'blog')?.id || 'blog'} className="space-y-12 md:space-y-16 section-spacing">
                  <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-[3px] text-primary">{getBlockProps('blog').title || t('blog')}</h3>
                    <div className="h-1.5 w-12 bg-primary rounded-full" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                    {(getBlockProps('blog').items || []).map((item: any, i: number) => (
                      <div key={i} className="arter-card !p-0 group overflow-hidden flex flex-col h-full border border-[var(--border)] cursor-pointer" onClick={() => setActiveBlogView(item.id || 'index')}>
                        <div className="h-48 overflow-hidden relative">
                           <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-8 space-y-4 flex-1 flex flex-col">
                           <h4 className="font-bold text-xl group-hover:text-primary transition-colors">{item.title}</h4>
                           <p className="text-sm text-[var(--on-surface-muted)] line-clamp-2">{item.description}</p>
                           <Button variant="ghost" size="sm" className="mt-auto self-start text-primary group-hover:gap-3 transition-all">LEER MÁS</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <div id={cmsData?.blocks?.find((b: any) => b.type === 'contact')?.id || 'contact'}>
                  <ContactForm />
                </div>
              </ScrollReveal>

              <footer className="pt-20 pb-10 border-t border-[var(--border)] text-center space-y-8">
                <p className="text-xs font-bold uppercase tracking-[3px] text-[var(--on-surface-muted)]">© 2024 Richard Falsone. {lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
              </footer>
            </div>
          </div>
        </main>
        
        <AnimatePresence>
          {selectedCert && <ImageModal isOpen={!!selectedCert} onClose={() => setSelectedCert(null)} image={selectedCert.image} title={selectedCert.title} />}
        </AnimatePresence>

        {(cmsData?.meta?.aiConfig?.enabled !== false) && (
          <AIAssistant config={cmsData?.meta?.aiConfig || { enabled: true, systemPrompt: '', welcomeMessage: '' }} />
        )}
      </div>
      <PrintableCV />
    </div>
  );
};
