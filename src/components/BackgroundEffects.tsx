/* © 2025 IMRAN — All rights reserved. */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export const BackgroundEffects: React.FC = () => {
  // Generate 14 subtle ambient floating micro-particles
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: `${(i * 19) % 100}%`,
      y: `${(i * 23) % 100}%`,
      size: 4 + (i % 4) * 2,
      duration: 15 + (i % 6) * 4,
      delay: (i % 5) * 1.5,
      color: i % 3 === 0 ? '#6366F1' : i % 3 === 1 ? '#EC4899' : '#8B5CF6',
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none">
      {/* Soft off-white radial backdrop */}
      <div className="absolute inset-0 bg-[#FAFAFC]" />

      {/* Slow drifting subtle gradient blobs */}
      <motion.div
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[10%] -left-[10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-br from-indigo-200/25 to-purple-200/20 blur-[100px]"
      />

      <motion.div
        animate={{
          x: [0, -30, 25, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.92, 1.06, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] max-w-[450px] max-h-[450px] rounded-full bg-gradient-to-bl from-pink-200/20 to-amber-200/15 blur-[110px]"
      />

      {/* Floating subtle particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: p.color,
            opacity: 0.18,
          }}
          animate={{
            y: ['0px', '-40px', '0px'],
            opacity: [0.12, 0.28, 0.12],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Very subtle mesh/vignette glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.04),transparent_60%)]" />
    </div>
  );
};
