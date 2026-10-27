/* © 2025 IMRAN — All rights reserved. */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Crown, RotateCcw, PlusCircle } from 'lucide-react';
import { toBengaliNumber } from '../utils/bengali';
import { sound } from '../utils/audio';

interface EliminationBarProps {
  eliminatedNames: string[];
  activeNames: string[];
  eliminationMode: boolean;
  onRestoreName: (name: string) => void;
  onRestoreAll: () => void;
}

export const EliminationBar: React.FC<EliminationBarProps> = ({
  eliminatedNames,
  activeNames,
  eliminationMode,
  onRestoreName,
  onRestoreAll,
}) => {
  const isFinalWinner = eliminationMode && activeNames.length === 1 && eliminatedNames.length > 0;
  const finalWinnerName = isFinalWinner ? activeNames[0] : null;

  // Celebrate final champion when only 1 is left in elimination mode
  useEffect(() => {
    if (isFinalWinner && finalWinnerName) {
      sound.playWinFanfare();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'],
      });
    }
  }, [isFinalWinner, finalWinnerName]);

  if (!eliminationMode && eliminatedNames.length === 0) {
    return null;
  }

  // Final champion banner
  if (isFinalWinner && finalWinnerName) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-yellow-500/10 border-2 border-amber-300 rounded-3xl p-5 text-center shadow-lg shadow-amber-500/10"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-2 shadow-md shadow-amber-500/30">
          <Crown className="w-6 h-6 animate-bounce" />
        </div>
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
          এলিমিনেশন রাউন্ড সমাপ্ত
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 my-1">
          🏆 চূড়ান্ত বিজয়ী: <span className="text-indigo-600">{finalWinnerName}</span>
        </h3>
        <p className="text-xs text-neutral-500 mb-3.5">
          সকল প্রতিদ্বন্দীকে অতিক্রম করে শেষ পর্যন্ত অপরাজিত!
        </p>
        <button
          type="button"
          onClick={() => {
            sound.playPopSound();
            onRestoreAll();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs tracking-wide shadow-md shadow-amber-600/20 cursor-pointer transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>নতুন রাউন্ড শুরু করুন</span>
        </button>
      </motion.div>
    );
  }

  // Eliminated names bar
  if (eliminatedNames.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-neutral-100/70 border border-neutral-200/80 rounded-2xl p-3 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neutral-400" />
          বাদ পড়েছে ({toBengaliNumber(eliminatedNames.length)} জন):
        </span>
        <button
          type="button"
          onClick={() => {
            sound.playPopSound();
            onRestoreAll();
          }}
          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"
        >
          সব ফিরিয়ে আনুন
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {eliminatedNames.map((name) => (
          <span
            key={name}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/70 border border-neutral-200 text-xs text-neutral-400 line-through"
          >
            <span>{name}</span>
            <button
              type="button"
              onClick={() => {
                sound.playPopSound();
                onRestoreName(name);
              }}
              title={`${name} পুনরায় যোগ করুন`}
              className="text-neutral-400 hover:text-indigo-600 cursor-pointer"
            >
              <PlusCircle className="w-3 h-3 no-underline" />
            </button>
          </span>
        ))}
      </div>
    </motion.div>
  );
};
