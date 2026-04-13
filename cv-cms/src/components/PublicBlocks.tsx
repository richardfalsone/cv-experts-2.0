import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  Icon, 
  Button, 
  CircularProgress, 
  SpiderChart,
  InteractiveSlider,
  LighthouseBadge,
  CodeSnippet,
  LiveBadge
} from './PublicAtoms';

// --- Reusable Utilities ---

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="space-y-4 mb-16">
    <h3 className="font-bold uppercase tracking-[3px] text-primary text-[11px] md:text-[13px]">
      {title}
    </h3>
    <div className="h-1.5 w-12 bg-primary rounded-full" />
    {subtitle && <p className="text-[var(--on-surface-muted)] max-w-2xl mt-6 font-medium leading-relaxed">{subtitle}</p>}
  </div>
);

const AnimatedNumber = ({ value }: { value: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const numMatch = value.match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0]) : 0;
  const prefix = value.replace(/\d+.*/, '');
  const suffix = value.replace(/.*\d+/, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / 2500, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeProgress * num));
            if (progress < 1) window.requestAnimationFrame(step);
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [num]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

// --- Bit-for-Bit Components ---

export const PublicHero: React.FC<{ props: any }> = ({ props }) => {
  return (
    <div id="home" className="relative w-full min-h-[500px] bg-[#010610] overflow-hidden group rounded-[44px] shadow-arter-lg border border-[var(--border)] mb-12 flex flex-col items-center justify-center text-center px-6">
      <div className="absolute inset-0 z-0">
        <img 
          src={props.backgroundImage || "https://ais-dev-2gvmeatgq3wpakpdr2qcel-518479397297.us-east1.run.app/image_1.png"} 
          alt="" 
          className="w-full h-full object-cover opacity-20 blur-sm scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010610]/40 via-[#010610]/80 to-[#010610]" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-8">
         <div className="relative">
           <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-[#0d1b35] shadow-2xl transition-apple">
             <img src={props.avatar || "/perfil.jpeg"} className="w-full h-full object-cover" alt={props.name} />
           </div>
           <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-[#0d1b35] shadow-lg animate-pulse" />
         </div>
         
         <div className="space-y-4">
             <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                {props.name}
             </h1>
             <p className="text-[#00a4ff] font-bold uppercase tracking-[5px] text-xs md:text-sm">
                {props.role}
             </p>
             <div className="flex items-center justify-center gap-2 text-[var(--on-surface-muted)] text-sm md:text-base">
                <Icon name="location_on" className="!text-sm" />
                <span className="uppercase tracking-widest">{props.location}</span>
             </div>
         </div>
      </div>
    </div>
  );
};

export const PublicInfoCard: React.FC<{ props: any }> = ({ props }) => (
  <div className="arter-card p-10 h-full flex flex-col justify-between space-y-10 group">
     <div className="space-y-1">
        <h4 className="text-[10px] font-bold text-[#00a4ff] uppercase tracking-[3px]">Información Personal</h4>
     </div>
     
     <div className="space-y-10">
       {[
         { label: 'CORREO', value: props.email, icon: 'mail' },
         { label: 'NÚMERO DE TELÉFONO', value: props.phone, icon: 'phone' },
         { label: 'MODALIDAD DE TRABAJO', value: props.workMode, icon: 'laptop_mac' }
       ].map((item, i) => (
         <div key={i} className="flex flex-col gap-2">
           <div className="flex items-center gap-3 text-[10px] font-bold text-[#00a4ff] uppercase tracking-[2px]">
             <Icon name={item.icon} className="!text-sm" />
             <span>{item.label}</span>
           </div>
           <span className="text-xl text-white font-bold tracking-tight group-hover:text-[#00a4ff] transition-apple">
              {item.value}
           </span>
         </div>
       ))}
     </div>
  </div>
);

export const PublicLanguages: React.FC<{ props: any }> = ({ props }) => (
  <div className="arter-card p-10 h-full flex flex-col justify-between space-y-10 group">
    <div className="space-y-1">
      <h4 className="text-[10px] font-bold text-[#00a4ff] uppercase tracking-[3px]">Idiomas</h4>
    </div>
    <div className="flex justify-around items-center flex-1">
       {props.languages?.map((lang: any, i: number) => (
         <CircularProgress key={i} value={lang.level} label={lang.name} size={100} />
       ))}
    </div>
  </div>
);

export const PublicSkillChart: React.FC<{ props: any }> = ({ props }) => {
  const labels = props.skills?.map((s: any) => s.label) || ['UX', 'UI', 'Research', 'Strategy', 'Systems', 'Agile'];
  const data = props.skills?.map((s: any) => s.value) || [95, 90, 85, 92, 88, 80];
  const seniorData = props.seniorData || [80, 80, 75, 85, 80, 75];
  
  return (
    <div className="arter-card p-10 h-full flex flex-col justify-between space-y-10 group">
      <div className="space-y-1">
        <h4 className="text-[10px] font-bold text-[#00a4ff] uppercase tracking-[3px]">
          {props.title || "Benchmarking de Habilidades"}
        </h4>
      </div>
      <div className="flex justify-center items-center flex-1 -mt-4">
        <SpiderChart 
          labels={labels}
          data={data}
          seniorData={seniorData}
          size={240}
        />
      </div>
    </div>
  );
};

export const PublicAptitudes: React.FC<{ props: any }> = ({ props }) => (
  <div className="arter-card p-12 mb-12 space-y-12">
    <h4 className="text-[10px] font-bold text-[#00a4ff] uppercase tracking-[3px]">
      {props.title || "Aptitudes Principales"}
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-12">
      {(props.items || []).map((item: string, i: number) => (
        <div key={i} className="flex items-center gap-6 group">
           <div className="w-5 h-5 rounded-full bg-[#00a4ff]/10 flex items-center justify-center group-hover:bg-[#00a4ff]/20 transition-colors border border-[#00a4ff]/20">
              <Icon name="check" className="text-[#00a4ff] !text-[10px] font-bold" />
           </div>
           <span className="text-[15px] font-bold text-white transition-colors tracking-tight">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

export const PublicCertifications: React.FC<{ props: any }> = ({ props }) => (
  <div className="arter-card p-12 mb-12 space-y-12 relative overflow-hidden">
    <div className="flex items-center justify-between">
      <h4 className="text-[10px] font-bold text-[#00a4ff] uppercase tracking-[3px]">
        {props.title || "Certificaciones"}
      </h4>
      <div className="bg-[#0d1b35] px-3 py-1 rounded-full border border-[var(--border)] text-[9px] font-bold text-[var(--on-surface-muted)]">
        {(props.items || []).length}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-12">
      {props.items?.map((cert: any, i: number) => (
        <div key={i} className="flex flex-col gap-3 group">
           <div className="flex items-center gap-5">
             <div className="w-5 h-5 rounded-full bg-[#00a4ff]/10 flex items-center justify-center transition-colors border border-[#00a4ff]/20">
                <Icon name="check" className="text-[#00a4ff] !text-[10px] font-bold" />
             </div>
             <h5 className="text-[15px] font-bold text-white tracking-tight group-hover:text-[#00a4ff] transition-colors">{cert.title}</h5>
           </div>
           <div className="pl-10 flex items-center gap-3 text-[10px] font-bold text-[var(--on-surface-muted)] uppercase tracking-[1px]">
             <span>{cert.issuer}</span>
             <span className="w-1 h-1 bg-[var(--border)] rounded-full" />
             <span>{cert.date}</span>
           </div>
        </div>
      ))}
    </div>
  </div>
);

export const PublicStats: React.FC<{ props: any }> = ({ props }) => (
  <section className="py-24 border-b border-[var(--border)] space-y-16">
    <div className="space-y-4">
      <h3 className="text-4xl font-bold tracking-tight text-[#00a4ff] uppercase">
        {props.title || "Datos Relevantes"}
      </h3>
      <div className="h-2 w-16 bg-[#00a4ff] rounded-full" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
      {props.stats.map((stat: any, i: number) => (
        <div key={i} className="flex flex-col items-center gap-4 text-center group">
          <span className="text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white transition-apple group-hover:text-[#00a4ff] group-hover:scale-105">
            <AnimatedNumber value={stat.value} />
          </span>
          <span className="text-xs font-bold uppercase tracking-[4px] text-[var(--on-surface-muted)] group-hover:text-white transition-apple max-w-[140px] leading-relaxed">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  </section>
);

export const PublicServices: React.FC<{ props: any }> = ({ props }) => (
  <section className="section-spacing !my-24">
    <SectionHeader title={props.title || "Experiencia en:"} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {props.items.map((item: any, i: number) => (
        <ServiceFlipCard key={i} item={item} />
      ))}
    </div>
  </section>
);

const ServiceFlipCard = ({ item }: { item: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="w-full relative min-h-[340px] md:min-h-[380px]" style={{ perspective: 1000 }}>
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 w-full h-full group" style={{ backfaceVisibility: 'hidden' }}>
          <div className="absolute inset-x-0 bottom-0 top-6 arter-card !backdrop-blur-none border-b-4 border-b-transparent group-hover:border-b-primary group-hover:-translate-y-2 bg-[var(--surface)] shadow-arter transition-all" style={{ borderRadius: '44px' }} />
          <div className="absolute top-0 left-8 w-16 h-16 rounded-full bg-[#010610] border border-[var(--border)] flex items-center justify-center shadow-arter group-hover:scale-110 group-hover:border-primary/30 transition-all z-20">
            <Icon name={item.icon} className="!text-3xl text-primary" />
          </div>
          <div className="absolute inset-x-0 bottom-0 top-6 px-10 py-12 pt-16 flex flex-col z-10 group-hover:-translate-y-2 transition-all">
            <h4 className="font-bold tracking-tight group-hover:text-primary transition-colors text-2xl mb-4">{item.title}</h4>
            <p className="text-base leading-relaxed text-[var(--on-surface-muted)] font-medium line-clamp-5">{item.description}</p>
            <button onClick={() => setIsFlipped(true)} className="mt-auto pt-6 border-t border-[var(--border)] flex items-center gap-3 text-xs font-bold uppercase tracking-[3px] text-primary group-hover:gap-5 transition-all outline-none">
              VER MÁS <Icon name="arrow_forward" className="!text-sm" />
            </button>
          </div>
        </div>
        <div className="absolute inset-0 w-full h-full group" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="absolute inset-x-0 bottom-0 top-6 arter-card !backdrop-blur-none bg-[var(--surface-variant)]/40 shadow-arter border-primary/20 transition-all" style={{ borderRadius: '44px' }} />
          <div className="absolute inset-x-0 bottom-0 top-6 px-10 py-12 pt-16 flex flex-col z-10">
            <h4 className="font-bold tracking-tight text-[var(--on-surface)] text-2xl mb-6">{item.title}</h4>
            <p className="text-base leading-relaxed text-[var(--on-surface)] font-medium overflow-y-auto pr-2 scrollbar-hide flex-1">
              {item.extendedDesc || item.description}
            </p>
            <button onClick={() => setIsFlipped(false)} className="mt-auto pt-6 border-t border-[var(--border)] flex items-center gap-3 text-xs font-bold uppercase tracking-[3px] text-[var(--on-surface-muted)] hover:text-white transition-all outline-none">
              <Icon name="arrow_back" className="!text-sm" /> VOLVER
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const PublicExperience: React.FC<{ props: any }> = ({ props }) => (
  <section id="history" className="section-spacing !my-24">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div className="space-y-12">
        <SectionHeader title={props.educationTitle || "Educación"} />
        <div className="space-y-0">
          {(props.education || []).map((item: any, i: number) => (
            <div key={i} className="relative pb-10 pl-10">
              {i !== props.education.length - 1 && <div className="absolute left-[7px] top-4 bottom-0 w-[2px] bg-[var(--border)]" />}
              <div className="absolute left-0 top-3 w-[16px] h-[16px] rounded-full bg-[#010610] border-4 border-[#00a4ff] shadow-md z-10" />
              <div className="arter-card !py-6 !px-8 hover:border-primary/30 transition-all duration-500">
                <h5 className="font-bold tracking-tight text-xl mb-1">{item.title}</h5>
                <p className="text-[10px] font-bold text-primary/80 uppercase tracking-[2px] mb-4">{item.subtitle} | {item.date}</p>
                <p className="text-sm leading-relaxed text-[var(--on-surface-muted)] font-medium">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-12">
        <SectionHeader title={props.title || "Trayectoria Profesional"} />
        <div className="space-y-0">
          {(props.items || []).map((item: any, i: number) => (
            <div key={i} className="relative pb-12 pl-10">
              {i !== props.items.length - 1 && <div className="absolute left-[7px] top-4 bottom-0 w-[2px] bg-[var(--border)]" />}
              <div className="absolute left-0 top-3 w-[16px] h-[16px] rounded-full bg-[#010610] border-4 border-[#00a4ff] shadow-md z-10" />
              <div className="arter-card !py-8 !px-10 hover:border-primary/30 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                  <div className="space-y-1">
                    <h5 className="font-bold tracking-tight text-xl">{item.role}</h5>
                    <p className="text-[10px] font-bold text-primary/80 uppercase tracking-[2px]">{item.company}</p>
                  </div>
                  <span className="text-[10px] bg-[#0d1b35] px-4 py-2 rounded-full text-white h-fit font-bold border border-[var(--border)] uppercase tracking-[2px]">
                    {item.period}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--on-surface-muted)] font-medium">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const PublicPortfolio: React.FC<{ props: any }> = ({ props }) => (
  <section id="portfolio" className="section-spacing !my-24">
    <SectionHeader title={props.title || "Portafolio"} subtitle={props.subtitle || "Selected Works"} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {props.items.map((item: any, i: number) => (
        <div key={i} className="group relative overflow-hidden arter-card p-2 cursor-pointer rounded-[44px] border-[var(--border)]">
          <div className="aspect-[16/11] overflow-hidden relative rounded-[32px]">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-apple duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-apple duration-500" />
          </div>
          {item.impact && <div className="absolute top-6 left-6 z-20 bg-[#00a4ff] text-black text-[10px] font-bold uppercase tracking-[3px] px-5 py-2.5 rounded-full shadow-lg border border-white/10">{item.impact}</div>}
          <div className="absolute inset-0 bg-[#0d1b35]/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-apple duration-500 p-10 text-center space-y-6 backdrop-blur-md rounded-[44px]">
            <h5 className="font-bold text-white tracking-tight text-2xl">{item.title}</h5>
            <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#00a4ff]">{item.category}</p>
            <div className="w-14 h-14 rounded-full bg-[#00a4ff] flex items-center justify-center shadow-arter-lg hover:scale-110 transition-apple">
              <Icon name="add" className="text-black !text-3xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const PublicRecommendations: React.FC<{ props: any }> = ({ props }) => (
  <section className="section-spacing !my-24">
    <SectionHeader title={props.title || "Recomendaciones"} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {props.items.map((r: any, i: number) => (
        <div key={i} className="arter-card p-12 flex flex-col h-full group relative overflow-hidden">
          <div className="absolute top-6 right-8 opacity-5 pointer-events-none">
            <Icon name="format_quote" className="!text-7xl text-[#00a4ff]" />
          </div>
          <div className="flex items-center gap-8 mb-10 relative z-10">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-[#010610]">
              <img src={r.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold tracking-tight text-xl group-hover:text-primary transition-colors">{r.name}</h5>
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-primary/70">{r.role}</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed text-[var(--on-surface-muted)] italic font-medium relative z-10 flex-1">"{r.text}"</p>
          <div className="flex gap-2 p-3 bg-[#010610] rounded-full w-fit border border-[var(--border)] shadow-inner mt-10 relative z-10">
            {[...Array(5)].map((_, j) => (
              <Icon key={j} name="star" className={cn("!text-xs", j < (r.rating || 5) ? "text-[#00a4ff]" : "text-[var(--on-surface-muted)]/10")} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const PublicBlog: React.FC<{ props: any }> = ({ props }) => (
  <section id="blog" className="section-spacing !my-24">
    <SectionHeader title={props.title || "Artículos / Blog"} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
      {(props.items || []).map((item: any, i: number) => (
        <div key={i} className="arter-card !p-0 group overflow-hidden flex flex-col h-full border border-[var(--border)] cursor-pointer">
          <div className="h-48 overflow-hidden relative">
             <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="p-8 space-y-4 flex-1 flex flex-col bg-[var(--surface)]">
             <div className="flex items-center justify-between text-[9px] font-bold text-primary uppercase tracking-[2px]">
               <span>{item.category || 'General'}</span>
               <span>{item.date}</span>
             </div>
             <h4 className="font-bold text-xl group-hover:text-primary transition-colors">{item.title}</h4>
             <p className="text-sm text-[var(--on-surface-muted)] line-clamp-2 leading-relaxed">{item.description}</p>
             <Button variant="secondary" size="sm" className="mt-auto self-start text-primary group-hover:gap-3 transition-all !px-0">
               LEER MÁS
             </Button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const PublicContact: React.FC<{ props: any }> = ({ props }) => (
  <section id="contact" className="section-spacing !my-24 text-center flex flex-col items-center">
    <SectionHeader title={props.title || "¿Hablamos?"} />
    <div className="arter-card !p-16 md:!p-24 !rounded-[60px] w-full max-w-5xl space-y-16">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">{props.headline}</h2>
        <p className="text-xl md:text-2xl text-[var(--on-surface-muted)] max-w-3xl mx-auto font-medium leading-relaxed">{props.subtext}</p>
        <Button size="lg" className="w-full md:w-fit px-24 py-6 text-lg" onClick={() => window.location.href = `mailto:${props.email}`}>
          {props.email}
        </Button>
    </div>
  </section>
);

export const PublicFooter: React.FC<{ props: any }> = ({ props }) => (
  <footer className="pt-24 pb-12 border-t border-[var(--border)] text-center space-y-10 mt-24">
    <p className="text-xs font-bold uppercase tracking-[5px] text-[var(--on-surface-muted)]">
      {props.copyright}
    </p>
    <div className="flex justify-center gap-12 text-xs font-bold uppercase tracking-[3px] text-[var(--on-surface-muted)]">
      {props.links?.map((link: any, i: number) => (
        <a key={i} href={link.url} className="hover:text-[#00a4ff] transition-colors relative group">
          {link.label}
          <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#00a4ff] transition-all group-hover:w-full" />
        </a>
      ))}
    </div>
  </footer>
);

export const PublicFloatingNav: React.FC<{ labels?: Record<string, string>; config?: any }> = ({ labels, config }) => {
  const [active, setActive] = useState('home');
  
  if (config?.showNav === false) return null;

  const navItems = [
    { icon: 'home', label: labels?.home || 'Inicio', id: 'home' },
    { icon: 'work', label: labels?.portfolio || 'Trabajos', id: 'portfolio' },
    { icon: 'history_edu', label: labels?.history || 'Historia', id: 'history' },
    { icon: 'mail', label: labels?.contact || 'Contacto', id: 'contact' },
    { icon: 'article', label: labels?.blog || 'Blog', id: 'blog' }
  ];

  return (
    <nav className={cn(
      "fixed left-1/2 -translate-x-1/2 h-20 bg-[#0d1b35]/80 backdrop-blur-xl shadow-2xl z-[110] rounded-full px-6 flex items-center gap-4 border border-white/5 transition-all duration-500",
      config?.sticky === false ? "absolute top-8" : "fixed top-8"
    )}>
      <div className="flex items-center gap-2">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => {
              setActive(item.id);
              const el = document.getElementById(item.id);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={cn(
              "flex items-center gap-4 px-6 py-3 transition-apple group relative rounded-full",
              active === item.id ? "text-white bg-white/10 shadow-lg border border-white/10" : "text-[var(--on-surface-muted)] hover:text-white hover:bg-white/5"
            )}
          >
            <Icon name={item.icon} className={cn("!text-2xl transition-apple", active === item.id ? "scale-105 text-[#00a4ff]" : "group-hover:scale-105")} />
            <span className={cn(
              "hidden lg:block text-sm font-bold tracking-tight transition-apple overflow-hidden",
              active === item.id ? "w-auto opacity-100" : "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      {(config?.showSocial !== false) && (
        <>
          <div className="h-10 w-px bg-white/10 mx-2 shrink-0" />
          <div className="flex items-center gap-6 px-4">
             <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[var(--on-surface-muted)]">EN</span>
                <div className="w-10 h-5 bg-[#00a4ff] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                </div>
                <span className="text-xs font-bold text-[#00a4ff]">ES</span>
             </div>
             <Icon name="download" className="!text-2xl text-[var(--on-surface-muted)] hover:text-[#00a4ff] cursor-pointer transition-colors" />
             <Icon name="light_mode" className="!text-2xl text-[var(--on-surface-muted)] hover:text-[#00a4ff] cursor-pointer transition-colors" />
          </div>
        </>
      )}
    </nav>
  );
};

// --- Phase 2: Specialized Showcase Blocks ---

export const PublicUXUIShowcase: React.FC<{ props: any }> = ({ props }) => (
  <section className="section-spacing !my-24">
    <SectionHeader title={props.title || "UX/UI Case Study"} subtitle={props.figmaTitle || "Design Process & Interactive Prototypes"} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
       <div className="space-y-12">
          {props.sliderItems?.map((item: any, i: number) => (
            <InteractiveSlider key={i} before={item.before} after={item.after} label={item.label} />
          ))}
       </div>
       <div className="arter-card p-2 rounded-[44px] overflow-hidden border-[var(--border)] min-h-[500px] relative">
          <div className="absolute top-8 left-8 z-20">
             <LiveBadge label="Figma Live Prototype" />
          </div>
          <iframe 
            src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(props.figmaUrl)}`}
            className="w-full h-full rounded-[36px] border-none"
            allowFullScreen
            loading="lazy"
          />
       </div>
    </div>
  </section>
);

export const PublicFrontendShowcase: React.FC<{ props: any }> = ({ props }) => (
  <section className="section-spacing !my-24">
    <SectionHeader title="Frontend Engineering" subtitle="Live Components & Performance Benchmarks" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
       <div className="lg:col-span-2 arter-card p-2 rounded-[44px] overflow-hidden border-[var(--border)] min-h-[600px] relative">
          <div className="absolute top-8 left-8 z-20">
             <LiveBadge label="Interactive Sandbox" />
          </div>
          <iframe 
            src={props.sandboxUrl}
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
                <LighthouseBadge value={props.lighthouse?.performance || 0} label="Performance" />
                <LighthouseBadge value={props.lighthouse?.accessibility || 0} label="Accessibility" />
                <LighthouseBadge value={props.lighthouse?.bestPractices || 0} label="Best Practices" />
                <LighthouseBadge value={props.lighthouse?.seo || 0} label="SEO" />
             </div>
          </div>
          <div className="arter-card p-10 space-y-6">
             <h4 className="text-[10px] font-bold text-primary uppercase tracking-[3px]">Stack Tecnológico</h4>
             <div className="flex flex-wrap gap-3">
                {props.techStack?.map((tech: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-white uppercase tracking-[1px]">
                    {tech}
                  </span>
                ))}
             </div>
          </div>
       </div>
    </div>
  </section>
);

export const PublicBackendShowcase: React.FC<{ props: any }> = ({ props }) => (
  <section className="section-spacing !my-24">
    <SectionHeader title="Backend & Architecture" subtitle="System Design & Optimization Metrics" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
       <div className="space-y-12">
          <div className="arter-card p-10 space-y-8">
             <h4 className="text-[10px] font-bold text-primary uppercase tracking-[3px]">Arquitectura del Sistema</h4>
             <div className="bg-[#010610] p-8 rounded-[32px] border border-white/5 overflow-hidden">
                {/* Mermaid or custom diagram rendering would go here */}
                <pre className="text-xs font-mono text-primary/60">{props.mermaidDiagram}</pre>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
             {props.metrics?.map((metric: any, i: number) => (
               <div key={i} className="arter-card p-8 flex flex-col items-center text-center gap-2">
                  <span className="text-3xl font-bold text-white">{metric.value}</span>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-[2px]">{metric.label}</span>
               </div>
             ))}
          </div>
       </div>
       <div className="arter-card p-10 space-y-8">
          <h4 className="text-[10px] font-bold text-primary uppercase tracking-[3px]">Implementación Crítica</h4>
          <CodeSnippet code={props.codeSnippet} language={props.language} />
       </div>
    </div>
  </section>
);

