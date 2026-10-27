/* © 2025 IMRAN — All rights reserved. */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SpinnerWheel } from './components/SpinnerWheel';
import { NameManager } from './components/NameManager';
import { WinnerModal } from './components/WinnerModal';
import { SpinHistory, HistoryItem } from './components/SpinHistory';
import { Toast, ToastMessage } from './components/Toast';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Mic } from 'lucide-react';
import { sound } from './utils/audio';
import { formatBengaliTime } from './utils/bengali';

export default function App() {
  // 1. Topics state (permanently persisted - will NEVER be removed unless user explicitly deletes)
  const [topics, setTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('imran_spinner_topics') || localStorage.getItem('sakib_spinner_names');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  // 2. Spin history state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('imran_spinner_history') || localStorage.getItem('sakib_spinner_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  // 3. Audio settings state
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(sound.getSfxEnabled());
  const [musicEnabled, setMusicEnabled] = useState<boolean>(sound.getMusicEnabled());

  // 4. Spinning & Topic modal state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [topicModalOpen, setTopicModalOpen] = useState<boolean>(false);
  const [currentTopic, setCurrentTopic] = useState<string>('');

  // 5. Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist topics permanently in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('imran_spinner_topics', JSON.stringify(topics));
    } catch {
      // Ignore
    }
  }, [topics]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('imran_spinner_history', JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  // Toast dispatcher
  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  // Audio toggles
  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    sound.setSfxEnabled(next);
    showToast(next ? 'সাউন্ড প্রভাব চালু' : 'সাউন্ড প্রভাব বন্ধ', 'info');
  };

  const handleToggleMusic = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    sound.setMusicEnabled(next);
    showToast(next ? 'ব্যাকগ্রাউন্ড মিউজিক চালু' : 'ব্যাকগ্রাউন্ড মিউজিক বন্ধ', 'info');
  };

  // Topic management handlers (Only user action can add or delete topics)
  const handleAddTopics = (newTopics: string[]) => {
    setTopics((prev) => [...prev, ...newTopics]);
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics((prev) => prev.filter((t) => t !== topicToRemove));
    if (currentTopic === topicToRemove) {
      setCurrentTopic('');
    }
    showToast(`"${topicToRemove}" তালিকা থেকে মুছে ফেলা হয়েছে`, 'info');
  };

  const handleClearAll = () => {
    setTopics([]);
    setCurrentTopic('');
  };

  // Clear spin history
  const handleClearHistory = () => {
    setHistory([]);
    showToast('টপিক নির্বাচনের ইতিহাস মুছে ফেলা হয়েছে', 'info');
  };

  // Spin lifecycle
  const handleSpinStart = () => {
    setIsSpinning(true);
    setTopicModalOpen(false);
  };

  const handleSpinEnd = useCallback((selectedTopic: string) => {
    setIsSpinning(false);
    setCurrentTopic(selectedTopic);
    setTopicModalOpen(true);

    // Record into history
    const newItem: HistoryItem = {
      id: `${Date.now()}`,
      name: selectedTopic,
      timeFormatted: formatBengaliTime(new Date()),
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 9)]);

    showToast(`🎙️ নির্বাচিত টপিক: ${selectedTopic}!`, 'success');
  }, [showToast]);

  // Topic modal actions
  const handleCloseModal = () => {
    setTopicModalOpen(false);
  };

  const handleSpinAgain = () => {
    setTopicModalOpen(false);
    setTimeout(() => {
      const spinBtn = document.querySelector('button[aria-label="টপিক স্পিন করুন"]') as HTMLButtonElement | null;
      if (spinBtn) {
        spinBtn.click();
      }
    }, 200);
  };

  // Global keyboard shortcut: Enter to spin (when not focused on input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement;
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
        if (!isInput && !isSpinning && !topicModalOpen && topics.length >= 2) {
          e.preventDefault();
          const spinBtn = document.querySelector('button[aria-label="টপিক স্পিন করুন"]') as HTMLButtonElement | null;
          if (spinBtn) spinBtn.click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, topicModalOpen, topics.length]);

  return (
    <div className="min-h-screen flex flex-col justify-between relative text-slate-800">
      {/* Background ambient lighting and subtle particles */}
      <BackgroundEffects />

      {/* Top Glassy Header */}
      <Header
        sfxEnabled={sfxEnabled}
        onToggleSfx={handleToggleSfx}
        musicEnabled={musicEnabled}
        onToggleMusic={handleToggleMusic}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-4 sm:py-6 flex flex-col gap-6 items-center">
        {/* Intro Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900">
            র্টপিক স্পিনার হুইল
          </h1>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">
            বক্তব্য, প্রেজেন্টেশন ও আলোচনার বিষয় নির্বাচনের সহজ মাধ্যম
          </p>
        </motion.div>

        {/* Latest Selected Topic Banner */}
        {currentTopic && !isSpinning && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 to-purple-50/90 border border-indigo-200/80 text-indigo-950 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider leading-none">
                  নির্বাচিত আলোচনার বিষয়
                </span>
                <span className="text-sm font-extrabold text-neutral-900 leading-tight">
                  &ldquo;{currentTopic}&rdquo;
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTopicModalOpen(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1 rounded-lg border border-indigo-100 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              পপআপ দেখুন
            </button>
          </motion.div>
        )}

        {/* The Interactive Canvas 2D Spinner Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full flex justify-center"
        >
          <SpinnerWheel
            names={topics}
            isSpinning={isSpinning}
            onSpinStart={handleSpinStart}
            onSpinEnd={handleSpinEnd}
          />
        </motion.div>

        {/* Topic Management Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="w-full"
        >
          <NameManager
            names={topics}
            onAddNames={handleAddTopics}
            onRemoveName={handleRemoveTopic}
            onClearAll={handleClearAll}
            onShowToast={showToast}
          />
        </motion.div>

        {/* Collapsible Spin History */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="w-full"
        >
          <SpinHistory history={history} onClearHistory={handleClearHistory} />
        </motion.div>
      </main>

      {/* Selected Topic Speaking Modal */}
      <WinnerModal
        isOpen={topicModalOpen}
        winnerName={currentTopic}
        totalTopicsCount={topics.length}
        onClose={handleCloseModal}
        onSpinAgain={handleSpinAgain}
        onRemoveTopic={handleRemoveTopic}
      />

      {/* Spring Animated Toasts */}
      <Toast toasts={toasts} />

      {/* IMRAN Footer */}
      <Footer />
    </div>
  );
}
