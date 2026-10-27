/* © 2025 IMRAN — All rights reserved. */

import React from 'react';
import { Volume2, VolumeX, Music, Mic } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  sfxEnabled: boolean;
  onToggleSfx: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sfxEnabled,
  onToggleSfx,
  musicEnabled,
  onToggleMusic,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-neutral-200/60 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-4xl mx-auto px-4 h-15 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Mic className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-imran-brand">
                IMRAN
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                PRO
              </span>
            </div>
            <span className="text-[11px] font-medium text-neutral-400 leading-tight">
              টপিক স্পিনার
            </span>
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-1.5">
          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={() => {
              onToggleSfx();
            }}
            aria-label={sfxEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
            title={sfxEnabled ? 'সাউন্ড প্রভাব চালু আছে' : 'সাউন্ড বন্ধ'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              sfxEnabled
                ? 'bg-indigo-50/80 text-indigo-700 border border-indigo-200/80 shadow-xs'
                : 'bg-neutral-100/80 text-neutral-400 border border-neutral-200/50'
            }`}
          >
            {sfxEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">সাউন্ড</span>
          </button>

          {/* Background Music Toggle */}
          <button
            type="button"
            onClick={() => {
              onToggleMusic();
            }}
            aria-label={musicEnabled ? 'স্পিন মিউজিক বন্ধ করুন' : 'স্পিন মিউজিক চালু করুন'}
            title={musicEnabled ? 'স্পিন ব্যাকগ্রাউন্ড মিউজিক চালু' : 'স্পিন ব্যাকগ্রাউন্ড মিউজিক বন্ধ'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              musicEnabled
                ? 'bg-purple-50/90 text-purple-700 border border-purple-200/80 shadow-xs'
                : 'bg-neutral-100/80 text-neutral-400 border border-neutral-200/50'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${musicEnabled ? 'text-purple-600' : ''}`} />
            <span className="hidden sm:inline">মিউজিক</span>
            {musicEnabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
