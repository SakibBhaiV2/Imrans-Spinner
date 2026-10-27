/* © 2025 IMRAN — All rights reserved. */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Trash2, MessageSquare, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { toBengaliNumber } from '../utils/bengali';
import { sound } from '../utils/audio';

interface NameManagerProps {
  names: string[];
  onAddNames: (newNames: string[]) => void;
  onRemoveName: (name: string) => void;
  onClearAll: () => void;
  onShowToast: (message: string, type?: 'info' | 'error' | 'success') => void;
}

export const NameManager: React.FC<NameManagerProps> = ({
  names,
  onAddNames,
  onRemoveName,
  onClearAll,
  onShowToast,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleAdd = () => {
    const raw = inputValue.trim();
    if (!raw) {
      setInputError(true);
      onShowToast('দয়া করে কোনো টপিক লিখুন', 'error');
      setTimeout(() => setInputError(false), 600);
      return;
    }

    // Split by comma or newline
    const items = raw
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (items.length === 0) return;

    // Check max 100 topics
    if (names.length + items.length > 100) {
      setInputError(true);
      onShowToast(
        `সর্বোচ্চ ১০০টি টপিক যোগ করা যাবে (বাকি আছে ${toBengaliNumber(Math.max(0, 100 - names.length))} টি)`,
        'error'
      );
      setTimeout(() => setInputError(false), 600);
      return;
    }

    // Check duplicates
    const duplicates: string[] = [];
    const validToAdd: string[] = [];

    items.forEach((item) => {
      if (names.includes(item) || validToAdd.includes(item)) {
        duplicates.push(item);
      } else {
        validToAdd.push(item);
      }
    });

    if (duplicates.length > 0) {
      setInputError(true);
      setTimeout(() => setInputError(false), 600);
      onShowToast(`"${duplicates.slice(0, 2).join(', ')}" ইতোমধ্যে তালিকায় রয়েছে`, 'error');
    }

    if (validToAdd.length > 0) {
      sound.playPopSound();
      onAddNames(validToAdd);
      setInputValue('');
      onShowToast(
        validToAdd.length === 1
          ? `"${validToAdd[0]}" টপিক যোগ করা হয়েছে`
          : `${toBengaliNumber(validToAdd.length)} টি টপিক যোগ করা হয়েছে`,
        'success'
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-neutral-200/60 transition-all">
      {/* Header with Topic Count */}
      <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-neutral-800">আলোচনার টপিকসমূহ</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100/70 text-indigo-700">
            {toBengaliNumber(names.length)} টি
          </span>
        </div>

        <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          স্থায়ীভাবে সংরক্ষিত
        </span>
      </div>

      {/* Input Field + Add Button */}
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="আপনার আলোচনার টপিক লিখুন (কমা দিয়ে একাধিক)..."
            inputMode="text"
            className={`w-full h-11 px-3.5 bg-neutral-50/80 hover:bg-neutral-50 focus:bg-white rounded-xl text-sm text-neutral-800 placeholder-neutral-400 border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
              inputError
                ? 'border-rose-400 bg-rose-50/50 animate-shake'
                : 'border-neutral-200/80'
            }`}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          aria-label="টপিক যোগ করুন"
          className="h-11 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>টপিক যোগ</span>
        </button>
      </div>

      {/* Helper caption */}
      <p className="text-[11px] text-neutral-400 mb-3 px-0.5">
        🔒 যে টপিকটি একবার যুক্ত করবেন তা ব্রাউজারে সুরক্ষিত থাকবে। আপনি নিজে থেকে না মুছলে কখনোই মুছবে না।
      </p>

      {/* Chips Container */}
      <div className="min-h-[85px] max-h-60 overflow-y-auto p-2 rounded-xl bg-neutral-50/50 border border-neutral-100 flex flex-wrap gap-1.5 content-start">
        <AnimatePresence mode="popLayout">
          {names.map((topic) => (
            <motion.div
              key={topic}
              layout
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0, x: -10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 350 }}
              className="group flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-neutral-200/70 text-xs font-medium text-neutral-700 shadow-xs hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
            >
              <BookOpen className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="truncate max-w-[150px]">{topic}</span>
              <button
                type="button"
                onClick={() => {
                  sound.playRemoveSound();
                  onRemoveName(topic);
                }}
                aria-label={`${topic} মুছে ফেলুন`}
                title={`${topic} মুছুন`}
                className="w-4 h-4 rounded-full flex items-center justify-center text-neutral-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {names.length === 0 && (
          <div className="w-full py-5 flex flex-col items-center justify-center text-center px-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-1.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-neutral-700">
              কোনো আলোচনার টপিক যুক্ত নেই
            </span>
            <span className="text-[11px] text-neutral-400 mt-0.5">
              উপরে আপনার ইচ্ছামতো আলোচনার বিষয়গুলো লিখুন বা কমা দিয়ে পেস্ট করুন
            </span>
          </div>
        )}
      </div>

      {/* Action Footer: Clear All (if names exist) */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
        <span className="text-[11px] text-neutral-500 font-medium">
          {names.length === 0
            ? 'সর্বোচ্চ ১০০টি টপিক সমর্থন করে'
            : `তালিকায় মোট: ${toBengaliNumber(names.length)}টি টপিক`}
        </span>

        {names.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>সব টপিক মুছুন</span>
          </button>
        )}
      </div>

      {/* Clear All Confirmation Dialog */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/30 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs bg-white rounded-2xl p-5 shadow-2xl border border-neutral-100 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-neutral-800 mb-1">
                সব টপিক মুছে ফেলতে চান?
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                এটি করলে আপনার তালিকার সকল টপিক মুছে যাবে।
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 h-9 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                >
                  না, থাক
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playRemoveSound();
                    onClearAll();
                    setShowClearConfirm(false);
                    onShowToast('সকল টপিক মুছে ফেলা হয়েছে', 'info');
                  }}
                  className="flex-1 h-9 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                >
                  হ্যাঁ, মুছুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
