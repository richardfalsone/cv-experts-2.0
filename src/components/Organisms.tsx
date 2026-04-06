import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  Icon, 
  Button, 
  CircularProgress, 
  LinearProgress, 
  SpiderChart,
  InteractiveSlider,
  LighthouseBadge,
  CodeSnippet,
  LiveBadge 
} from './Atoms';
import { ProfileCard, InfoList, ServiceCard, PortfolioItem, HistoryItem, MobileCarousel } from './Molecules';
import { useLanguage } from '../lib/LanguageContext';

export const ArterHero = () => {
  const { t, lang } = useLanguage();
  const [text, setText] = React.useState('');
  const fullText = t('heroText');
  const [index, setIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    setText('');
    setIndex(0);
    setIsDeleting(false);
  }, [lang]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting && index < fullText.length) {
        setText(prev => prev + fullText[index]);
        setIndex(prev => prev + 1);
      } else if (isDeleting && index > 0) {
        setText(prev => prev.slice(0, -1));
        setIndex(prev => prev - 1);
      } else if (!isDeleting && index === fullText.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [index, isDeleting, fullText]);

  return (
    <div id="home" className="relative w-full min-h-[480px] bg-[var(--surface-variant)] overflow-hidden group rounded-[var(--radius-lg)] shadow-arter-lg border border-[var(--border)]">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://ais-dev-2gvmeatgq3wpakpdr2qcel-518479397297.us-east1.run.app/image_1.png" 
          alt="" 
          className="w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-[2000ms]" 
          referrerPolicy="no-referrer"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface-variant)] via-[var(--surface-variant)]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-variant)]/60 via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24 w-full">
        <div className="space-y-4 md:space-y-6 mb-8 md:mb-10 max-w-4xl">
          <h1 className="font-bold leading-[1.1] tracking-tight">
            <div className="text-left text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-[var(--on-surface-muted)] mb-2">{t('heroTitle')}</div>
            <div className="text-primary text-left drop-shadow-sm text-4xl md:text-5xl lg:text-6xl xl:text-7xl">{t('heroSubtitle')}</div>
          </h1>
        </div>
        <div className="flex items-start justify-start gap-4 text-sm md:text-base lg:text-lg font-mono mb-12 md:mb-16 min-h-[1.5rem] text-[var(--on-surface-muted)] max-w-3xl">
          <span className="text-[var(--on-surface)] font-semibold tracking-tight break-words max-w-full">{text}</span>
          <span className="animate-pulse bg-primary w-2.5 h-7 md:w-3 md:h-8 ml-1 rounded-[var(--radius-sm)] shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.6)] shrink-0 mt-1" aria-hidden="true" />
        </div>
        <Button 
          size="lg"
          className="w-full sm:w-fit self-start shadow-arter-lg hover:scale-105 transition-transform" 
          onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Explore my portfolio"
        >
          {t('exploreNow')}
        </Button>
      </div>
    </div>
  );
};

const AnimatedNumber = ({ value }: { value: string }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  
  const numMatch = value.match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0]) : 0;
  const prefix = value.replace(/\d+.*/, '');
  const suffix = value.replace(/.*\d+/, '');

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number;
          const duration = 2500;
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeProgress * num));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [num]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
};

export const StatsGrid = () => {
  const { t } = useLanguage();
  return (
    <section className="py-16 border-b border-[var(--border)] space-y-12">
      <div className="space-y-4">
        <h3 className="font-bold uppercase tracking-[3px] text-primary">{t('relevantData') || 'Relevant Data'}</h3>
        <div className="h-1.5 w-12 bg-primary rounded-full" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
        {[
          { value: '30%', label: t('staffingEfficiency') || 'Staffing Efficiency' },
          { value: '10+', label: t('projectsDone') },
          { value: '15%', label: t('conversionRate') || 'Conversion Rate' },
          { value: '5+', label: t('awards') }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-4 text-center group">
            <span className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[var(--on-surface)] transition-apple group-hover:text-primary group-hover:scale-105">
              <AnimatedNumber value={stat.value} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[3px] text-[var(--on-surface-muted)] group-hover:text-[var(--on-surface)] transition-apple max-w-[140px] leading-relaxed">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export const PortfolioGrid = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = React.useState('all');
  
  const projects = [
    { title: 'NTT DATA Platform', category: 'uxDesign', image: 'https://picsum.photos/seed/ntt/800/600', impact: '+25% Staffing' },
    { title: 'Fintech App', category: 'uiDesign', image: 'https://picsum.photos/seed/fintech/800/600', impact: '+15% Conversion' },
    { title: 'E-commerce Redesign', category: 'uxDesign', image: 'https://picsum.photos/seed/shop/800/600', impact: '-20% Bounce' },
    { title: 'Brand Identity', category: 'branding', image: 'https://picsum.photos/seed/brand/800/600', impact: '100% NPS' },
    { title: 'Mobile Wallet', category: 'uiDesign', image: 'https://picsum.photos/seed/wallet/800/600', impact: '+40% Retention' },
    { title: 'SaaS Dashboard', category: 'uxDesign', image: 'https://picsum.photos/seed/saas/800/600', impact: '-30% Task Time' },
  ];

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="space-y-16 section-spacing">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-[var(--border)] pb-8">
        <div className="space-y-4">
          <h3 className="text-[13px] font-bold uppercase tracking-[4px] text-primary">{t('portfolioTitle')}</h3>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--on-surface)]">{t('selectedWorks') || 'Selected Works'}</h2>
        </div>
        <nav className="flex gap-8 text-[12px] font-bold uppercase tracking-[2px]" aria-label="Portfolio filters">
          {['all', 'uiDesign', 'uxDesign', 'branding'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "transition-apple relative py-2", 
                filter === cat ? "text-primary" : "text-[var(--on-surface-muted)] hover:text-[var(--on-surface)]"
              )}
              aria-pressed={filter === cat}
            >
              {cat === 'all' ? t('allCategories') : t(cat as any)}
              {filter === cat && (
                <motion.div 
                  layoutId="portfolio-filter"
                  className="absolute -bottom-8 left-0 right-0 h-1 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredProjects.map((project, i) => (
          <PortfolioItem 
            key={i} 
            title={project.title} 
            category={t(project.category as any)} 
            image={project.image} 
            impact={project.impact} 
            onClick={() => window.open('https://www.linkedin.com/in/richard-falsone-896159144/', '_blank', 'noreferrer')}
          />
        ))}
      </div>
    </section>
  );
};

export const HistorySection = () => {
  const { t, lang } = useLanguage();
  
  const education = [
    {
      title: 'UMOV Academy',
      subtitle: lang === 'en' ? 'Bachelor in Experience Design Engineering & Innovation' : 'Licenciatura en Ingeniería en Diseño de Experiencias e Innovación',
      date: '2023 - 2026',
      description: lang === 'en' ? 'Focusing on innovation and user-centered design methodologies.' : 'Enfocado en innovación y metodologías de diseño centradas en el usuario.'
    },
    {
      title: 'Instituto Universitario de Nuevas Profesiones (IUNP)',
      subtitle: lang === 'en' ? 'Higher Technician in Advertising' : 'Técnico Superior en Publicidad',
      date: '2010 - 2014',
      description: lang === 'en' ? 'Foundations of visual communication and marketing strategies.' : 'Bases de comunicación visual y estrategias de marketing.'
    }
  ];

  const work = [
    {
      title: 'NTT DATA Europe & Latam',
      subtitle: 'Sr UX/UI Designer',
      date: '2022 - Present',
      description: lang === 'en' ? 'Leading design projects from user research to final visual design. Specialized in Design Systems and Atomic Design.' : 'Liderando proyectos de diseño desde la investigación hasta el diseño visual final. Especializado en Sistemas de Diseño y Diseño Atómico.'
    },
    {
      title: 'NTT DATA Europe & Latam',
      subtitle: 'UX/UI Designer',
      date: '2021 - 2022',
      description: lang === 'en' ? 'Designed intuitive solutions for complex needs. Focused on interactive prototyping and usability testing.' : 'Diseñé soluciones intuitivas para necesidades complejas. Enfocado en prototipado interactivo y pruebas de usabilidad.'
    },
    {
      title: 'DaCodes',
      subtitle: 'UX/UI Designer',
      date: '2021 - 2021',
      description: lang === 'en' ? 'Understanding product specifications and user psychology. Concept and usability testing.' : 'Entender las especificaciones del producto y la psicología del usuario. Pruebas de concepto y usabilidad.'
    },
    {
      title: 'Addinteli Mx',
      subtitle: 'Jr UX/UI Designer',
      date: '2018 - 2020',
      description: lang === 'en' ? 'Developed page layouts and prototypes based on client needs.' : 'Desarrollé esquemas de páginas y prototipos basados en las necesidades del cliente.'
    },
    {
      title: 'Fuera de La Caja',
      subtitle: lang === 'en' ? 'Graphic Designer' : 'Diseñador Gráfico',
      date: '2015 - 2017',
      description: lang === 'en' ? 'Print design, logos, and corporate identity.' : 'Diseño de impresión, logotipos e identidad corporativa.'
    }
  ];

  return (
    <section id="history" className="grid grid-cols-1 gap-16 md:gap-20 lg:gap-24 section-spacing">
      <div className="space-y-10 md:space-y-12 lg:space-y-14">
        <div className="space-y-4">
          <h3 className="font-bold uppercase tracking-[3px] text-primary">{t('education')}</h3>
          <div className="h-1.5 w-12 bg-primary rounded-full" />
        </div>
        <div className="space-y-0">
          {education.map((item, i) => (
            <HistoryItem key={i} {...item} isLast={i === education.length - 1} />
          ))}
        </div>
      </div>
      <div className="space-y-10 md:space-y-12 lg:space-y-14">
        <div className="space-y-4">
          <h3 className="font-bold uppercase tracking-[3px] text-primary">{t('workHistory')}</h3>
          <div className="h-1.5 w-12 bg-primary rounded-full" />
        </div>
        <div className="space-y-0">
          {work.map((item, i) => (
            <HistoryItem key={i} {...item} isLast={i === work.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const ClientsSection = () => {
  const { t } = useLanguage();
  const logos = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png',
  ];

  return (
    <section id="clients" className="space-y-10 md:space-y-12 section-spacing overflow-hidden">
      <h3 className="font-bold uppercase tracking-[2px] md:tracking-[2.5px] text-primary">{t('clients')}</h3>
      <div className="relative flex overflow-x-hidden group py-8 md:py-10">
        <div className="animate-marquee flex gap-16 md:gap-24 items-center">
          {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
            <div key={i} className="w-32 md:w-40 h-20 md:h-24 flex items-center justify-center grayscale opacity-25 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 shrink-0 hover:scale-110">
              <img src={logo} alt="Client Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactForm = () => {
  const { t, lang } = useLanguage();
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 1500);
  };

  return (
    <section id="contact" className="space-y-12 md:space-y-16 section-spacing">
      <div className="space-y-4">
        <h3 className="font-bold uppercase tracking-[3px] text-primary">{t('contactTitle')}</h3>
        <div className="h-1.5 w-12 bg-primary rounded-full" />
      </div>
      <div className="arter-card !p-8 md:!p-12 !rounded-[44px] md:!rounded-[60px] shadow-arter-lg">
        {status === 'sent' ? (
          <div className="text-center py-20 md:py-24 space-y-10 md:space-y-12" role="status" aria-live="polite">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-12 md:mb-16 border border-primary/20 shadow-lg">
              <Icon name="check" className="text-primary !text-6xl md:!text-7xl" />
            </div>
            <div className="space-y-4">
              <h4 className="font-bold tracking-tight text-2xl md:text-3xl">{t('questionSent')}</h4>
              <p className="text-sm md:text-base text-[var(--on-surface-muted)] max-w-lg mx-auto leading-relaxed font-medium">
                {t('questionSentDesc')}
              </p>
            </div>
            <Button size="lg" onClick={() => setStatus('idle')} className="mt-16 md:mt-20">
              {t('askAnother')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-8 md:space-y-12">
                <div className="relative group">
                  <label htmlFor="name" className="sr-only">{t('nameLabel')}</label>
                  <input 
                    id="name"
                    type="text" 
                    required
                    placeholder={t('nameLabel')}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] p-6 md:p-7 pl-16 md:pl-20 text-sm md:text-base focus:ring-2 focus:ring-primary/50 transition-all outline-none rounded-[var(--radius-md)] hover:border-primary/40 shadow-inner font-medium"
                  />
                  <Icon name="person" className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-[var(--on-surface-muted)] group-focus-within:text-primary !text-xl md:!text-2xl transition-colors" />
                </div>
                <div className="relative group">
                  <label htmlFor="companyEmail" className="sr-only">{t('companyEmailLabel')}</label>
                  <input 
                    id="companyEmail"
                    type="email" 
                    required
                    placeholder={t('companyEmailLabel')}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] p-6 md:p-7 pl-16 md:pl-20 text-sm md:text-base focus:ring-2 focus:ring-primary/50 transition-all outline-none rounded-[var(--radius-md)] hover:border-primary/40 shadow-inner font-medium"
                  />
                  <Icon name="business" className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-[var(--on-surface-muted)] group-focus-within:text-primary !text-xl md:!text-2xl transition-colors" />
                </div>
              </div>
              <div className="relative group flex flex-col h-full">
                <label htmlFor="message" className="sr-only">{t('messageLabel')}</label>
                <textarea 
                  id="message"
                  required
                  placeholder={t('questionPlaceholder')}
                  className="w-full flex-1 bg-[var(--bg)] border border-[var(--border)] p-6 md:p-7 pl-16 md:pl-20 text-sm md:text-base focus:ring-2 focus:ring-primary/50 transition-all outline-none rounded-[var(--radius-md)] hover:border-primary/40 shadow-inner resize-none font-medium"
                />
                <Icon name="help_outline" className="absolute left-6 md:left-8 top-8 md:top-10 text-[var(--on-surface-muted)] group-focus-within:text-primary !text-xl md:!text-2xl transition-colors" />
              </div>
            </div>
            <Button 
              type="submit" 
              size="lg"
              className="w-full shadow-arter-lg hover:scale-[1.01] transition-transform"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? t('sending') : t('sendButton')}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};


export const SidebarContent = () => {
  const { t, lang } = useLanguage();
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-8">
      <InfoList items={[
        { label: t('residence'), value: t('residenceValue'), icon: 'public' },
        { label: t('city'), value: t('cityValue'), icon: 'location_on' },
        { label: t('age'), value: '35', icon: 'person' }
      ]} />
      
      <div className="h-[1px] bg-[var(--border)]" />
      
      <div className="grid grid-cols-2 gap-8">
        <CircularProgress value={100} label="Spanish" />
        <CircularProgress value={90} label="English" />
      </div>
      
      <div className="h-[1px] bg-[var(--border)]" />
      
      <div className="space-y-8">
        <h4 className="text-[13px] font-bold uppercase tracking-[1.5px] text-[var(--on-surface)]">{t('benchmarking')}</h4>
        <div className="bg-[var(--surface-variant)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-inner">
          <SpiderChart 
            labels={['UX', 'UI', 'Research', 'Strategy', 'Systems', 'Agile']}
            data={[95, 90, 85, 92, 88, 80]}
            seniorData={[80, 80, 75, 85, 80, 75]}
            size={180}
          />
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-[1px]">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-sm" />
              <span className="text-primary">{t('role')}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 bg-white/10 rounded-full border border-white/30" />
              <span className="text-[var(--on-surface-muted)]">{t('seniorStandard')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-[1px] bg-[var(--border)]" />
      
      <div className="space-y-6">
        <h4 className="text-[13px] font-bold uppercase tracking-[1.5px] text-[var(--on-surface)]">{t('mainAptitudes')}</h4>
        <div className="space-y-4">
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
            <div key={i} className="flex items-center gap-4 text-[13px] text-[var(--on-surface-muted)] group">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon name="check" className="text-primary !text-[10px]" />
              </div>
              <span className="group-hover:text-[var(--on-surface)] transition-colors">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-[var(--border)]" />

      <div className="space-y-6">
        <h4 className="text-[13px] font-bold uppercase tracking-[1.5px] text-[var(--on-surface)]">{t('certifications')}</h4>
        <div className="space-y-4">
          {[
            'UX: Máster en Diseño web y Experiencia de Usuario',
            'Generative AI: Introduction and Applications',
            'AI Foundations & Design Thinking',
            'Workshop Variables',
            'Ask Questions to Make Data-Driven Decisions'
          ].map((cert, i) => (
            <div key={i} className="flex items-start gap-4 text-[12px] text-[var(--on-surface-muted)] leading-relaxed group">
              <Icon name="verified" className="text-primary !text-sm shrink-0 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-[var(--on-surface)] transition-colors">{cert}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-[var(--border)]" />
      
      <Button variant="secondary" className="w-full gap-4 group mt-6">
        {t('downloadCv')} <Icon name="download" className="!text-sm group-hover:translate-y-0.5 transition-transform" />
      </Button>
    </div>
  );
};

// --- Phase 2: Specialized Showcase Organisms ---

export const UXUIShowcase = ({ 
  figmaUrl, 
  figmaTitle, 
  sliderItems 
}: { 
  figmaUrl: string; 
  figmaTitle?: string; 
  sliderItems: Array<{ before: string; after: string; label: string }> 
}) => {
  const { t } = useLanguage();
  return (
    <section className="section-spacing">
      <div className="space-y-4 mb-16">
        <h3 className="font-bold uppercase tracking-[3px] text-primary">{t('uxDesign') || 'UX/UI Case Study'}</h3>
        <div className="h-1.5 w-12 bg-primary rounded-full" />
        <p className="text-[var(--on-surface-muted)] max-w-2xl mt-6 font-medium leading-relaxed">
          {figmaTitle || "Design Process & Interactive Prototypes"}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <div className="space-y-12">
            {sliderItems?.map((item, i) => (
              <InteractiveSlider key={i} {...item} />
            ))}
         </div>
         <div className="arter-card p-2 rounded-[44px] overflow-hidden border-[var(--border)] min-h-[500px] relative">
            <div className="absolute top-8 left-8 z-20">
               <LiveBadge label="Figma Live Prototype" />
            </div>
            <iframe 
              src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`}
              className="w-full h-full rounded-[36px] border-none"
              allowFullScreen
              loading="lazy"
            />
         </div>
      </div>
    </section>
  );
};

export const FrontendShowcase = ({ 
  sandboxUrl, 
  lighthouse, 
  techStack 
}: { 
  sandboxUrl: string; 
  lighthouse: { performance: number; accessibility: number; bestPractices: number; seo: number }; 
  techStack: string[] 
}) => {
  const { t } = useLanguage();
  return (
    <section className="section-spacing">
      <div className="space-y-4 mb-16">
        <h3 className="font-bold uppercase tracking-[3px] text-primary">{t('frontendDevelopment') || 'Frontend Engineering'}</h3>
        <div className="h-1.5 w-12 bg-primary rounded-full" />
        <p className="text-[var(--on-surface-muted)] max-w-2xl mt-6 font-medium leading-relaxed">
          Live Components & Performance Benchmarks
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 arter-card p-2 rounded-[44px] overflow-hidden border-[var(--border)] min-h-[600px] relative">
            <div className="absolute top-8 left-8 z-20">
               <LiveBadge label="Interactive Sandbox" />
            </div>
            <iframe 
              src={sandboxUrl}
              className="w-full h-full rounded-[36px] border-none"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              loading="lazy"
            />
         </div>
         <div className="space-y-12">
            <div className="arter-card p-10 space-y-8">
               <h4 className="text-[10px] font-bold text-primary uppercase tracking-[3px]">Core Web Vitals</h4>
               <div className="grid grid-cols-2 gap-8">
                  <LighthouseBadge value={lighthouse.performance} label="Performance" />
                  <LighthouseBadge value={lighthouse.accessibility} label="Accessibility" />
                  <LighthouseBadge value={lighthouse.bestPractices} label="Best Practices" />
                  <LighthouseBadge value={lighthouse.seo} label="SEO" />
               </div>
            </div>
            <div className="arter-card p-10 space-y-6">
               <h4 className="text-[10px] font-bold text-primary uppercase tracking-[3px]">Stack Tecnológico</h4>
               <div className="flex flex-wrap gap-3">
                  {techStack.map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-[var(--on-surface)] uppercase tracking-[1px]">
                      {tech}
                    </span>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </section>
  );
};

export const BackendShowcase = ({ 
  mermaidDiagram, 
  codeSnippet, 
  language, 
  metrics 
}: { 
  mermaidDiagram: string; 
  codeSnippet: string; 
  language: string; 
  metrics: Array<{ label: string; value: string }> 
}) => {
  const { t } = useLanguage();
  return (
    <section className="section-spacing">
      <div className="space-y-4 mb-16">
        <h3 className="font-bold uppercase tracking-[3px] text-primary">{t('backendDevelopment') || 'Backend & Architecture'}</h3>
        <div className="h-1.5 w-12 bg-primary rounded-full" />
        <p className="text-[var(--on-surface-muted)] max-w-2xl mt-6 font-medium leading-relaxed">
          System Design & Optimization Metrics
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <div className="space-y-12">
            <div className="arter-card p-10 space-y-8">
               <h4 className="text-[10px] font-bold text-primary uppercase tracking-[3px]">Arquitectura del Sistema</h4>
               <div className="bg-[var(--surface-variant)] p-8 rounded-[32px] border border-white/5 overflow-hidden">
                  <pre className="text-xs font-mono text-primary/60">{mermaidDiagram}</pre>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
               {metrics.map((metric, i) => (
                 <div key={i} className="arter-card p-8 flex flex-col items-center text-center gap-2">
                    <span className="text-3xl font-bold text-[var(--on-surface)]">{metric.value}</span>
                    <span className="text-[9px] font-bold text-primary uppercase tracking-[2px]">{metric.label}</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="arter-card p-10 space-y-8">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-[3px]">Implementación Crítica</h4>
            <CodeSnippet code={codeSnippet} language={language} />
         </div>
      </div>
    </section>
  );
};
