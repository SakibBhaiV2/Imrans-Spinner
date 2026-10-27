/* © 2025 IMRAN — All rights reserved. */

import React, { useState } from 'react';
import { History, ChevronDown, ChevronUp, Trash2, Mic } from 'lucide-react';
import { toBengaliNumber } from '../utils/bengali';
import { sound } from '../utils/audio';

export interface HistoryItem {
  id: string;
  name: string;
  timeFormatted: string;
  timestamp: number;
}

interface SpinHistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
}

export const SpinHistory: React.FC<SpinHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-3xl p-4 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-neutral-200/60 transition-all">
      <button
        type="button"
        onClick={() => {
          sound.playTapSound();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-neutral-800">
            নির্বাচিত টপিকের ইতিহাস ({toBengaliNumber(history.length)})
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-400">
          <span className="text-xs font-medium">
            {isOpen ? 'লুকান' : 'দেখুন'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-col gap-2 animate-fadeIn">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-neutral-400 font-medium">
              সর্বশেষ ১০টি নির্বাচিত টপিক
            </span>
            <button
              type="button"
              onClick={() => {
                sound.playRemoveSound();
                onClearHistory();
              }}
              className="text-[11px] text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>ইতিহাস মুছুন</span>
            </button>
          </div>

          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-50/80 border border-neutral-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-[10px]">
                    {toBengaliNumber(index + 1)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-semibold text-neutral-800">
                      {item.name}
                    </span>
                  </div>
                </div>
                <span className="text-neutral-400 text-[11px]">
                  {item.timeFormatted}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
