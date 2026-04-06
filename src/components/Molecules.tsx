import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Icon } from './Atoms';
import { useLanguage } from '../lib/LanguageContext';
import { useTheme } from '../lib/ThemeContext';

export const ProfileCard = ({ name, role, avatar, location }: { name: string; role: string; avatar: string; location?: string }) => (
  <div className="flex flex-col items-center text-center p-0 relative group">
    <div className="relative mb-12">
      <div className="w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden bg-[var(--surface-variant)] border-4 border-[var(--surface-variant)] shadow-arter-lg transition-apple duration-700 group-hover:scale-[1.02] relative z-10">
        <img src={avatar} alt={`Profile picture of ${name}`} className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
      </div>
      <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-apple duration-700" />
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full border-4 border-[var(--bg)] shadow-lg z-20" aria-label="Online status" />
    </div>
    <div className="space-y-4 w-full px-4">
      <h1 className="font-extrabold tracking-tight text-4xl md:text-5xl lg:text-6xl text-[var(--on-surface)] leading-[1.1]">{name}</h1>
      <p className="text-[13px] md:text-[15px] text-primary font-bold uppercase tracking-[4px] leading-relaxed opacity-90">{role}</p>
    </div>
    {location && (
      <div className="mt-8 flex items-center gap-3 text-[12px] text-[var(--on-surface-muted)] font-semibold uppercase tracking-widest opacity-70">
        <Icon name="location_on" className="!text-sm" />
        <span>{location}</span>
      </div>
    )}
  </div>
);

export const InfoList = ({ items }: { items: { label: string; value: string; color?: string; icon?: string }[] }) => (
  <div className="grid grid-cols-1 gap-y-8 py-4">
    {items.map((item, i) => (
      <div key={i} className="flex flex-col gap-1 group/info">
        <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-[3px] opacity-80">
          {item.icon && <Icon name={item.icon} className="!text-xs" />}
          <span>{item.label}</span>
        </div>
        <span className={cn("text-[15px] md:text-[17px] text-[var(--on-surface)] font-semibold tracking-tight group-hover/info:text-primary transition-apple", item.color)}>{item.value}</span>
      </div>
    ))}
  </div>
);

export const ThemeToggle = () => {
  const { isLight, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme}
      className="w-11 h-11 flex items-center justify-center text-[var(--on-surface-muted)] hover:text-primary transition-all duration-300 hover:bg-primary/5 rounded-full group"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <Icon name={isLight ? 'dark_mode' : 'light_mode'} className="!text-xl group-hover:scale-110 transition-transform" />
    </button>
  );
};

export const DownloadPDFButton = () => {
  const { lang } = useLanguage();
  return (
    <button 
      onClick={() => window.print()}
      className="w-11 h-11 flex items-center justify-center transition-all duration-300 hover:bg-primary/5 rounded-full group text-[var(--on-surface-muted)] hover:text-primary print:hidden"
      aria-label={lang === 'en' ? 'Download PDF' : 'Descargar PDF'}
    >
      <Icon name="download" className="!text-xl group-hover:scale-110 transition-transform" />
    </button>
  );
};

export const NavButton = ({ icon, label, active, onClick }: { icon: string; label: string; active?: boolean; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    aria-label={label}
    aria-current={active ? 'page' : undefined}
    className={cn(
      "flex items-center gap-3 px-5 py-2.5 transition-apple group relative rounded-full border border-transparent",
      active ? "text-[var(--on-surface)] glass shadow-sm !border-primary" : "text-[var(--on-surface-muted)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-variant)]/50"
    )}
  >
    <Icon name={icon} className={cn("!text-xl transition-apple", active ? "scale-105 text-primary" : "group-hover:scale-105")} />
    <span className={cn(
      "text-[12px] font-semibold tracking-tight transition-apple",
      active ? "opacity-100" : "opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto"
    )}>
      {label}
    </span>
  </button>
);

export const ServiceCard = ({ icon, title, meta, description, extendedDesc }: { icon: string; title: string; meta?: string; description: string; extendedDesc?: string }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const { lang, t } = useLanguage();

  return (
    <div className="w-full relative min-h-[340px] md:min-h-[380px]" style={{ perspective: 1000 }}>
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 w-full h-full group"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Card Background Layer */}
          <div className="absolute inset-x-0 bottom-0 top-6 arter-card !backdrop-blur-none border-b-4 border-b-transparent group-hover:border-b-primary group-hover:-translate-y-2 focus-within:-translate-y-2 bg-[var(--surface)] shadow-arter transition-all" style={{ borderRadius: 'var(--radius-3xl, 32px)' }} />
          
          {/* Floating Icon Layer */}
          <div 
            className="absolute top-0 left-6 md:left-8 w-14 h-14 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center shadow-arter group-hover:scale-110 group-hover:border-primary/30 group-hover:-translate-y-2 transition-all duration-500 z-20"
            style={{ transform: 'translateZ(10px)' }}
          >
            <Icon name={icon} className="!text-2xl text-primary" />
          </div>

          {/* Content Layer */}
          <div className="absolute inset-x-0 bottom-0 top-6 px-6 md:px-8 py-8 md:py-10 pt-16 md:pt-16 flex flex-col z-10 group-hover:-translate-y-2 transition-all pointer-events-none">
            <div className="space-y-4 mb-6 md:mb-8 flex-1 flex flex-col">
              <h4 className="font-bold tracking-tight group-hover:text-primary transition-colors text-lg md:text-xl">{title}</h4>
              {meta && <p className="text-[9px] font-bold text-primary uppercase tracking-[2px] bg-primary/5 w-fit px-3 py-1 rounded-[var(--radius-sm)] border border-primary/10 leading-tight">{meta}</p>}
              <p className="text-sm leading-relaxed text-[var(--on-surface-muted)] font-medium line-clamp-5 group-hover:text-[var(--on-surface)] transition-colors mt-2">{description}</p>
            </div>
            <button 
              onClick={() => setIsFlipped(true)}
              className="mt-auto pt-6 border-t border-[var(--border)] flex items-center gap-3 text-[10px] md:text-[11px] font-bold uppercase tracking-[2px] text-primary group-hover:gap-5 transition-all outline-none w-full text-left pointer-events-auto"
            >
              {t('seeMore') || 'VER MÁS'} <Icon name="arrow_forward" className="!text-xs md:!text-sm" />
            </button>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 w-full h-full group"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Card Background Layer */}
          <div className="absolute inset-x-0 bottom-0 top-6 arter-card !backdrop-blur-none border-b-4 border-b-transparent hover:border-b-primary hover:-translate-y-2 focus-within:-translate-y-2 bg-[var(--surface-variant)]/40 shadow-arter border-primary/20 transition-all" style={{ borderRadius: 'var(--radius-3xl, 32px)' }} />

          {/* Floating Icon Layer */}
          <div 
            className="absolute top-0 left-6 md:left-8 w-14 h-14 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center shadow-arter group-hover:scale-110 group-hover:border-primary/30 group-hover:-translate-y-2 transition-all duration-500 z-20"
            style={{ transform: 'translateZ(10px)' }}
          >
            <Icon name={icon} className="!text-2xl text-primary" />
          </div>

          {/* Content Layer */}
          <div className="absolute inset-x-0 bottom-0 top-6 px-6 md:px-8 py-8 md:py-10 pt-16 md:pt-16 flex flex-col z-10 group-hover:-translate-y-2 transition-all pointer-events-none">
            <div className="flex items-center gap-4 mb-6 shrink-0 mt-2">
              <h4 className="font-bold tracking-tight text-[var(--on-surface)] text-lg md:text-xl line-clamp-1">{title}</h4>
            </div>
            <p className="text-sm leading-relaxed text-[var(--on-surface)] font-medium overflow-y-auto pr-2 scrollbar-hide flex-1 pointer-events-auto">
              {extendedDesc}
            </p>
            <button 
              onClick={() => setIsFlipped(false)}
              className="mt-auto pt-6 border-t border-[var(--border)] flex items-center gap-3 text-[10px] md:text-[11px] font-bold uppercase tracking-[2px] text-[var(--on-surface-muted)] hover:text-white transition-all outline-none w-full text-left pointer-events-auto"
            >
              <Icon name="arrow_back" className="!text-xs md:!text-sm" /> {t('back') || 'VOLVER'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const RecommendationCard = ({ name, role, text, avatar, rating }: { name: string; role: string; text: string; avatar: string; rating: number }) => (
  <div className="arter-card flex flex-col h-full group relative overflow-hidden">
    {/* Decorative Quote Icon */}
    <div className="absolute top-6 right-8 opacity-5 pointer-events-none">
      <Icon name="format_quote" className="!text-6xl md:!text-7xl text-primary" />
    </div>

    <div className="flex items-center gap-4 md:gap-6 mb-8 relative z-10">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-arter shrink-0 bg-[var(--bg)]">
        <img src={avatar} alt={`Portrait of ${name}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
      </div>
      <div className="space-y-1">
        <h5 className="font-bold tracking-tight text-base md:text-lg group-hover:text-primary transition-colors">{name}</h5>
        <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[1.5px] text-primary/70">{role}</p>
      </div>
    </div>
    
    <div className="relative mb-8 flex-1 z-10">
      <p className="text-sm md:text-base leading-relaxed text-[var(--on-surface-muted)] italic font-medium">
        "{text}"
      </p>
    </div>

    <div className="flex gap-2 p-3 bg-[var(--bg)] rounded-full w-fit border border-[var(--border)] shadow-inner relative z-10" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Icon key={i} name="star" className={cn("!text-[10px] md:!text-xs", i < rating ? "text-primary" : "text-[var(--on-surface-muted)]/10")} />
      ))}
    </div>
  </div>
);

export const PortfolioItem: React.FC<{ title: string; category: string; image: string; impact?: string; onClick?: () => void }> = ({ title, category, image, impact, onClick }) => (
  <div 
    className="group relative overflow-hidden arter-card p-2 cursor-pointer focus-within:ring-2 focus-within:ring-primary rounded-[32px] shadow-arter hover:shadow-arter-lg border-[var(--border)]" 
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    aria-label={`View project: ${title}`}
  >
    <div className="aspect-[16/11] overflow-hidden relative rounded-[24px] transition-apple">
      <img src={image} alt={title} className="w-full h-full object-cover transition-apple duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-apple duration-500" />
    </div>
    {impact && (
      <div className="absolute top-5 left-5 z-20 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-[2px] px-4 py-2 rounded-full shadow-lg border border-on-primary/10">
        {impact}
      </div>
    )}
    <div className="absolute inset-0 bg-[var(--surface)]/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-apple duration-500 p-6 md:p-8 text-center space-y-6 backdrop-blur-md rounded-[32px]">
      <div className="space-y-3">
        <h5 className="font-bold text-[var(--on-surface)] tracking-tight text-lg">{title}</h5>
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-primary">{category}</p>
      </div>
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-arter-lg hover:scale-110 transition-apple">
        <Icon name="add" className="text-on-primary !text-2xl" />
      </div>
    </div>
  </div>
);

export const HistoryItem: React.FC<{ title: string; subtitle: string; date: string; description: string; isLast?: boolean; inCarousel?: boolean }> = ({ title, subtitle, date, description, isLast, inCarousel }) => (
  <div className={cn("relative pb-12 md:pb-16", inCarousel ? "pl-0 md:pl-12" : "pl-10 md:pl-12")}>
    {!isLast && <div className={cn("absolute left-[9px] top-4 bottom-0 w-[2px] bg-[var(--border)]", inCarousel && "hidden md:block")} aria-hidden="true" />}
    <div className={cn("absolute left-0 top-3 w-[20px] h-[20px] rounded-full bg-[var(--bg)] border-4 border-primary shadow-md z-10 transition-transform group-hover:scale-125", inCarousel && "hidden md:block")} aria-hidden="true" />
    <div className="arter-card py-8 md:py-10 px-8 md:px-10 space-y-8 md:space-y-10 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10 relative z-10">
        <div className="space-y-3">
          <h5 className="font-bold tracking-tight group-hover:text-primary transition-colors text-lg md:text-xl">{title}</h5>
          <p className="text-xs md:text-sm font-bold text-primary/80 uppercase tracking-[2px]">{subtitle}</p>
        </div>
        <span className="text-[10px] md:text-[11px] bg-[var(--surface-variant)] px-5 md:px-7 py-2.5 md:py-3.5 rounded-full text-[var(--on-surface)] h-fit font-bold whitespace-nowrap border border-[var(--border)] shadow-inner uppercase tracking-[2px] md:tracking-[2.5px]">{date}</span>
      </div>
      <p className="text-sm md:text-base leading-relaxed text-[var(--on-surface-muted)] relative z-10 font-medium">{description}</p>
    </div>
  </div>
);

export const LanguageSwitch = ({ vertical = false }: { vertical?: boolean }) => {
  const { lang, setLang } = useLanguage();
  const isEn = lang === 'en';

  return (
    <div className={cn("flex items-center gap-4 px-4 py-2", vertical && "flex-col px-0 py-6")}>
      <span className={cn("text-[10px] font-bold uppercase tracking-[1.5px] transition-colors duration-300", isEn ? "text-primary" : "text-[var(--on-surface-muted)]")}>EN</span>
      <button
        onClick={() => setLang(isEn ? 'es' : 'en')}
        className={cn(
          "relative w-12 h-6 bg-[var(--surface-variant)] rounded-full transition-all duration-500 focus-visible:ring-2 focus-visible:ring-primary outline-none border border-[var(--border)] shadow-inner group",
          vertical && "w-6 h-12"
        )}
        aria-label={isEn ? 'Switch to Spanish' : 'Switch to English'}
        role="switch"
        aria-checked={!isEn}
      >
        <div 
          className={cn(
            "absolute w-4 h-4 bg-primary rounded-full transition-all duration-500 shadow-arter group-hover:scale-110",
            vertical 
              ? (isEn ? "top-1 left-1" : "top-7 left-1")
              : (isEn ? "top-1 left-1" : "top-1 left-7")
          )} 
        />
      </button>
      <span className={cn("text-[10px] font-bold uppercase tracking-[1.5px] transition-colors duration-300", !isEn ? "text-primary" : "text-[var(--on-surface-muted)]")}>ES</span>
    </div>
  );
};

export const MobileCarousel = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const childrenArray = React.Children.toArray(children);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(index);
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollTo({
      left: index * clientWidth,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-8 px-8 gap-8 pt-10 pb-0 md:grid md:overflow-visible md:snap-none md:mx-0 md:px-0 md:pt-10 md:pb-0",
          className
        )}
      >
        {childrenArray.map((child, i) => (
          <div key={i} className="min-w-full sm:min-w-[48%] md:min-w-0 snap-center h-full">
            {child}
          </div>
        ))}
      </div>
      
      {/* Navigation Dots (Mobile Only) */}
      <div className="flex justify-center gap-3 md:hidden mt-8">
        {childrenArray.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              activeIndex === i 
                ? "bg-primary w-6" 
                : "bg-[var(--on-surface-muted)] opacity-30 hover:opacity-100"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

import { GoogleGenAI } from "@google/genai";

export const AIAssistant = ({ config }: { config?: { enabled: boolean; systemPrompt: string; welcomeMessage?: string } }) => {
  // If not enabled, don't render anything
  if (!config?.enabled) return null;

  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { lang, t } = useLanguage();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: config.systemPrompt || `Responde en el idioma: ${lang}`,
        },
      });

      const aiText = response.text || (lang === 'en' ? "I'm sorry, I couldn't process that." : "Lo siento, no pude procesar eso.");
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: lang === 'en' ? "Error connecting to AI. Please check your API key." : "Error al conectar con la IA. Por favor, verifica tu API key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[110] print:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[320px] md:w-[380px] h-[500px] glass rounded-[40px] shadow-arter-lg border border-white/20 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            <div className="p-6 border-b border-white/10 bg-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Icon name="auto_awesome" className="text-on-primary !text-sm" />
                </div>
                <span className="font-bold text-sm tracking-tight">{t('aiAssistantTitle')}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--on-surface-muted)] hover:text-primary transition-colors">
                <Icon name="close" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.length === 0 && (
                <div className="text-center space-y-4 mt-10">
                  <Icon name="chat" className="!text-4xl text-primary/20" />
                  <p className="text-xs text-[var(--on-surface-muted)] font-medium px-8">
                    {config.welcomeMessage || t('aiAssistantEmptyText')}
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
                    m.role === 'user' ? "bg-primary text-on-primary rounded-tr-none" : "bg-[var(--surface-variant)] text-[var(--on-surface)] rounded-tl-none"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--surface-variant)] p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('aiAssistantPlaceholder') as string}
                  className="flex-1 bg-[var(--surface-variant)] border border-white/10 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-arter hover:scale-105 transition-apple disabled:opacity-50"
                >
                  <Icon name="send" className="!text-sm" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-arter-lg hover:scale-110 transition-apple relative group",
          isOpen && "rotate-90"
        )}
        aria-label="AI Assistant"
      >
        <Icon name={isOpen ? "close" : "auto_awesome"} className="!text-2xl" />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[var(--bg)] animate-pulse" />
        )}
      </button>
    </div>
  );
};

export const ImageModal = ({ isOpen, onClose, image, title }: { isOpen: boolean; onClose: () => void; image: string; title: string }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative max-w-5xl w-full max-h-full flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-primary transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
        >
          <span>Cerrar</span>
          <Icon name="close" className="!text-2xl" />
        </button>
        <div className="w-full h-full overflow-hidden rounded-[var(--radius-lg)] shadow-2xl bg-white/5 border border-white/10">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-auto max-h-[80vh] object-contain mx-auto"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-white font-bold text-lg md:text-xl tracking-tight">{title}</h3>
          <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};

