/* © 2025 IMRAN — All rights reserved. */

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-neutral-200/50 text-center select-none">
      <div className="max-w-md mx-auto px-4 flex flex-col items-center justify-center gap-1.5">
        <p className="text-xs text-neutral-500 font-normal tracking-wide flex items-center justify-center gap-1">
          <span>© 2025</span>
          <span className="font-extrabold tracking-wider bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-imran-brand px-0.5">
            IMRAN
          </span>
          <span>. All rights reserved.</span>
        </p>
        <p className="text-[11px] text-neutral-400">
          প্রিমিয়াম টপিক স্পিনার হুইল • বক্তব্য ও প্রেজেন্টেশনের জন্য
        </p>
      </div>
    </footer>
  );
};
