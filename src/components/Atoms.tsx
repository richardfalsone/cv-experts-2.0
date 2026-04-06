import React from 'react';
import * as d3 from 'd3';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

// Reusable scroll-triggered reveal wrapper
export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}> = ({ children, className, delay = 0, direction = 'up' }) => {
  const yOffset = direction === 'up' ? 80 : 0;
  const xOffset = direction === 'left' ? -60 : direction === 'right' ? 60 : 0;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: yOffset, x: xOffset, scale: 0.97, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center transition-apple font-bold uppercase tracking-[2px] focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 rounded-full";
    
    const sizes = {
      sm: "px-6 py-2.5 text-[11px] min-h-[36px]",
      md: "px-8 py-3.5 text-[13px] min-h-[44px]",
      lg: "px-10 lg:px-12 py-4 lg:py-5 text-[14px] min-h-[56px]",
      icon: "p-3 min-h-[44px] min-w-[44px]"
    };

    const variants = {
      primary: "bg-[var(--on-surface)] text-[var(--bg)] hover:opacity-90 shadow-arter",
      secondary: "bg-[var(--surface-variant)] text-[var(--on-surface)] hover:bg-[var(--border)] border border-[var(--border)]",
      icon: "hover:bg-[var(--surface-variant)] transition-apple border border-[var(--border)]"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizes[size], variants[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const CircularProgress = ({ value, label, size = 60 }: { value: number; label: string; size?: number }) => {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[var(--surface-variant)]"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--on-surface)]">
          {value}%
        </span>
      </div>
      <span className="text-[11px] font-semibold text-[var(--on-surface-muted)] uppercase tracking-wider">{label}</span>
    </div>
  );
};

export const LinearProgress = ({ value, label }: { value: number; label: string }) => (
  <div className="w-full space-y-2" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
    <div className="flex justify-between text-[12px] font-medium">
      <span className="text-[var(--on-surface)]">{label}</span>
      <span className="text-[var(--on-surface-muted)]">{value}%</span>
    </div>
    <div className="arter-progress-bg" aria-hidden="true">
      <div className="arter-progress-fill" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export const Icon = ({ name, className, ...props }: { name: string; className?: string } & React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("material-symbols-outlined select-none", className)} aria-hidden="true" {...props}>{name}</span>
);

export const SpiderChart = ({ 
  data, 
  size = 200, 
  labels,
  seniorData
}: { 
  data: number[]; 
  size?: number; 
  labels: string[];
  seniorData?: number[];
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = 30;
    const radius = (size - margin * 2) / 2;
    const angleStep = (Math.PI * 2) / labels.length;

    const g = svg.append("g")
      .attr("transform", `translate(${size / 2}, ${size / 2})`);

    // Draw axes
    labels.forEach((label, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "var(--border)")
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "4,4");

      // Labels
      const labelX = Math.cos(angle) * (radius + 25);
      const labelY = Math.sin(angle) * (radius + 25);
      
      g.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "var(--on-surface-muted)")
        .attr("font-size", "9px")
        .attr("font-weight", "bold")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "1px")
        .text(label);
    });

    // Draw concentric circles
    [0.2, 0.4, 0.6, 0.8, 1].forEach(tick => {
      const r = radius * tick;
      g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "var(--border)")
        .attr("stroke-dasharray", "2,2")
        .attr("stroke-width", 0.5);
    });

    const lineGenerator = d3.lineRadial<number>()
      .angle((_, i) => i * angleStep)
      .radius(d => radius * (d / 100))
      .curve(d3.curveLinearClosed);

    // Senior Standard (Background)
    if (seniorData) {
      g.append("path")
        .attr("d", lineGenerator(seniorData))
        .attr("fill", "var(--on-surface-muted)")
        .attr("fill-opacity", 0.05)
        .attr("stroke", "var(--on-surface-muted)")
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,2");
    }

    // User Data
    g.append("path")
      .attr("d", lineGenerator(data))
      .attr("fill", "rgba(var(--color-primary-rgb), 0.2)")
      .attr("stroke", "var(--color-primary)")
      .attr("stroke-width", 2)
      .attr("class", "transition-all duration-1000");

    // Points
    data.forEach((val, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = Math.cos(angle) * radius * (val / 100);
      const y = Math.sin(angle) * radius * (val / 100);

      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 3)
        .attr("fill", "var(--color-primary)");
    });

  }, [data, labels, size, seniorData]);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg ref={svgRef} width={size} height={size} className="overflow-visible" />
    </div>
  );
};

// --- Phase 2 Atoms ---

export const InteractiveSlider = ({ before, after, label }: { before: string; after: string; label?: string }) => {
  const [position, setPosition] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newPos = ((x - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, newPos)));
  };

  return (
    <div className="flex flex-col gap-4">
      {label && <h5 className="text-[10px] font-bold text-primary uppercase tracking-[2px]">{label}</h5>}
      <div 
        ref={containerRef}
        className="relative aspect-video rounded-[32px] overflow-hidden cursor-ew-resize border border-white/10 select-none"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        <img src={after} className="absolute inset-0 w-full h-full object-cover" alt="After" />
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img src={before} className="absolute inset-0 w-full h-full object-cover" alt="Before" />
        </div>
        
        {/* Slider Handle */}
        <div 
          className="absolute inset-y-0 w-1 bg-white shadow-lg pointer-events-none group"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-arter-lg">
             <Icon name="unfold_more" className="text-black rotate-90 !text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const LighthouseBadge = ({ value, label }: { value: number; label: string }) => {
  const color = value >= 90 ? '#00c853' : value >= 50 ? '#ffab00' : '#ff5252';
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="36" fill="transparent" stroke="white" strokeWidth="4" className="opacity-5" />
          <circle 
            cx="40" cy="40" r="36" fill="transparent" stroke={color} strokeWidth="4"
            strokeDasharray={226} strokeDashoffset={226 - (value / 100) * 226}
            strokeLinecap="round" className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-bold text-lg" style={{ color }}>{value}</span>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-[2px] text-[var(--on-surface-muted)]">{label}</span>
    </div>
  );
};

export const CodeSnippet = ({ code, language }: { code: string; language: string }) => (
  <div className="relative group">
    <div className="absolute top-4 right-4 text-[9px] font-bold text-primary/40 uppercase tracking-[2px]">{language}</div>
    <pre className="p-8 rounded-[32px] bg-[var(--surface-variant)] border border-white/5 overflow-x-auto scrollbar-hide text-sm font-mono text-white/80 leading-relaxed shadow-inner">
      <code>{code}</code>
    </pre>
    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--surface-variant)] to-transparent pointer-events-none opacity-50" />
  </div>
);

export const LiveBadge = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
    <span className="text-[9px] font-bold text-green-500 uppercase tracking-[1px]">{label}</span>
  </div>
);
