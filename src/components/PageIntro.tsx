import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const letters = ['R', 'I', 'C', 'H', 'A', 'R', 'D'];
const subtitle = 'SR UX/UI DESIGNER';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.8, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.7, delay: 1.1, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const overlayExit = {
  opacity: 0,
  scale: 1.04,
  transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
};

export const PageIntro: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after letters animate in + short hold
    const timer = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-intro"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'var(--bg, #010610)' }}
          initial={{ opacity: 1 }}
          exit={overlayExit}
        >
          {/* Ambient glow blob */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(circle, #00a4ff 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -60%)',
              filter: 'blur(80px)',
            }}
          />

          {/* Name cascade */}
          <motion.div
            className="flex gap-1 md:gap-2 relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {letters.map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white"
                style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* Accent line */}
          <motion.div
            className="h-0.5 w-48 md:w-64 bg-[#00a4ff] mt-4 origin-left"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />

          {/* Subtitle */}
          <motion.p
            className="mt-4 text-xs md:text-sm font-bold uppercase tracking-[5px] text-[#7a96c2]"
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
          >
            {subtitle}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
