/* © 2025 IMRAN — All rights reserved. */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Mic, Play, Pause, RotateCcw, Check, Sparkles, Trash2, Timer } from 'lucide-react';
import { toBengaliNumber } from '../utils/bengali';
import { sound } from '../utils/audio';

interface WinnerModalProps {
  isOpen: boolean;
  winnerName: string;
  totalTopicsCount: number;
  onClose: () => void;
  onSpinAgain: () => void;
  onRemoveTopic: (topic: string) => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  winnerName,
  totalTopicsCount,
  onClose,
  onSpinAgain,
  onRemoveTopic,
}) => {
  // Speech timer states
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [initialDuration, setInitialDuration] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Reset timer whenever a new topic is selected
  useEffect(() => {
    if (isOpen) {
      setTimerSeconds(60);
      setInitialDuration(60);
      setIsTimerRunning(false);
      setShowDeleteConfirm(false);

      try {
        sound.playWinFanfare();
      } catch {
        // Safe
      }

      // Celebratory confetti burst
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.55 },
            colors: ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#3B82F6'],
            zIndex: 99999,
          });
        }
      } catch {
        // Safe
      }
    }
  }, [isOpen, winnerName]);

  // Speech countdown timer interval
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            sound.playPopSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Keyboard shortcut: Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const setTimerPreset = (secs: number) => {
    sound.playTapSound();
    setInitialDuration(secs);
    setTimerSeconds(secs);
    setIsTimerRunning(false);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${toBengaliNumber(mins)}:${toBengaliNumber(secs.toString().padStart(2, '0'))}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="winner-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="topic-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Modal Card */}
          <motion.div
            key="winner-modal-card"
            initial={{ scale: 0.85, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)] border border-neutral-100 flex flex-col items-center text-center my-auto"
          >
            {/* Screen reader announcement */}
            <div aria-live="assertive" className="sr-only">
              নির্বাচিত আলোচনার বিষয়: {winnerName}
            </div>

            {/* Speaking Mic Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/35 mb-3 animate-bounce">
              <Mic className="w-8 h-8 drop-shadow-sm" />
            </div>

            {/* Label */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>🎙️ নির্বাচিত আলোচনার বিষয়</span>
            </div>

            {/* Big Selected Topic Name */}
            <h2
              id="topic-title"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 my-2 break-words max-w-full px-2"
            >
              &ldquo;<span className="text-indigo-600">{winnerName}</span>&rdquo;
            </h2>

            {/* Speaking Call to Action Box */}
            <div className="w-full bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-indigo-50/90 border border-indigo-200/70 rounded-2xl p-3.5 my-2.5 text-center shadow-xs">
              <p className="text-xs font-bold text-indigo-900 flex items-center justify-center gap-1 mb-1">
                <span>📢 বক্তব্যের নির্দেশনা:</span>
              </p>
              <p className="text-xs sm:text-sm font-semibold text-neutral-800 leading-snug">
                এবার <span className="text-indigo-600 font-extrabold underline decoration-indigo-300 underline-offset-2">&ldquo;{winnerName}&rdquo;</span> টপিকের ওপর আপনার বক্তব্য বা আলোচনা শুরু করুন!
              </p>
            </div>

            {/* Optional Speaking Timer */}
            <div className="w-full bg-neutral-50 border border-neutral-200/60 rounded-2xl p-3 my-1.5 flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1">
                  <Timer className="w-3 h-3 text-indigo-600" />
                  বক্তব্যের টাইমার
                </span>
                <span className="text-xs font-extrabold text-neutral-800 tracking-wider">
                  {formatTimer(timerSeconds)}
                </span>
              </div>

              {/* Preset buttons */}
              <div className="flex items-center gap-1.5 mb-2">
                {[60, 120, 180].map((secs) => (
                  <button
                    key={secs}
                    type="button"
                    onClick={() => setTimerPreset(secs)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                      initialDuration === secs
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-neutral-600 border border-neutral-200'
                    }`}
                  >
                    {toBengaliNumber(secs / 60)} মিনিট
                  </button>
                ))}
              </div>

              {/* Timer control */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTapSound();
                    setIsTimerRunning(!isTimerRunning);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isTimerRunning
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>পজ করুন</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>{timerSeconds === 0 ? 'আবার শুরু' : 'টাইমার চালু'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playTapSound();
                    setIsTimerRunning(false);
                    setTimerSeconds(initialDuration);
                  }}
                  title="রিসেট"
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2 mt-2">
              {/* Button 1: Spin Again (Topic is preserved!) */}
              <button
                type="button"
                onClick={() => {
                  sound.playTapSound();
                  onSpinAgain();
                }}
                disabled={totalTopicsCount < 2}
                aria-label="পরবর্তী টপিক স্পিন করুন"
                className="w-full h-11 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>পরবর্তী টপিক স্পিন করুন</span>
              </button>

              {/* Button 2: Okay / Start Speech */}
              <button
                type="button"
                onClick={() => {
                  sound.playTapSound();
                  onClose();
                }}
                aria-label="পপআপ বন্ধ করুন"
                className="w-full h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm tracking-wide bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>ঠিক আছে, বক্তব্য শুরু করছি</span>
              </button>

              {/* Optional delete button (only if user explicitly clicks) */}
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-[11px] text-neutral-400 hover:text-rose-500 transition-colors pt-1 cursor-pointer flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>এই টপিকটি তালিকা থেকে মুছতে চান?</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-[11px] text-rose-600 font-medium">নিশ্চিত?</span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playRemoveSound();
                      onRemoveTopic(winnerName);
                      onClose();
                    }}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    হ্যাঁ, মুছুন
                  </button>
                  <span className="text-neutral-300">•</span>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-[11px] text-neutral-500 hover:underline cursor-pointer"
                  >
                    না
                  </button>
                </div>
              )}
            </div>

            {/* IMRAN Branding line on modal bottom */}
            <div className="mt-4 pt-3 border-t border-neutral-100 w-full flex items-center justify-center">
              <span className="text-[11px] text-neutral-400 font-medium tracking-wide">
                © <span className="font-bold text-neutral-600">IMRAN</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
