/* © 2025 IMRAN — All rights reserved. */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Loader2, UserPlus } from 'lucide-react';
import { getSliceColors, getContrastColor } from '../utils/palette';
import { sound } from '../utils/audio';

interface SpinnerWheelProps {
  names: string[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinEnd: (winnerName: string, winnerIndex: number) => void;
}

export const SpinnerWheel: React.FC<SpinnerWheelProps> = ({
  names,
  isSpinning,
  onSpinStart,
  onSpinEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  // Wheel size state
  const [wheelSize, setWheelSize] = useState<number>(340);

  // Wheel rotation angle in radians
  const currentAngleRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastSliceTickRef = useRef<number>(-1);

  // Colors for active names
  const colors = getSliceColors(names.length);

  // Sizing responsiveness (ResizeObserver)
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const calculated = Math.max(260, Math.min(width, 380));
      setWheelSize(calculated);
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Pointer tick kick animation with throttle for high slice counts
  const lastTickTimeRef = useRef<number>(0);
  const triggerPointerTick = useCallback((velocityRatio: number) => {
    const now = performance.now();
    if (now - lastTickTimeRef.current >= 30) {
      lastTickTimeRef.current = now;
      sound.playTickSound(velocityRatio);
    }
    if (pointerRef.current) {
      pointerRef.current.style.transform = 'translateX(-50%) rotate(-12deg)';
      pointerRef.current.style.transition = 'transform 0.03s ease-out';
      setTimeout(() => {
        if (pointerRef.current) {
          pointerRef.current.style.transform = 'translateX(-50%) rotate(0deg)';
          pointerRef.current.style.transition = 'transform 0.06s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }
      }, 35);
    }
  }, []);

  // Draw wheel on canvas
  const drawWheel = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const size = wheelSize;
      const center = size / 2;
      const radius = center - 8;
      const count = names.length;

      // Reset transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      // When 0 names: Draw an elegant empty wheel outline with soft slices
      if (count === 0) {
        ctx.save();

        // 8 soft placeholder segments
        const ghostSlices = 8;
        const ghostAngle = (2 * Math.PI) / ghostSlices;
        const ghostColors = [
          '#F8FAFC', '#F1F5F9', '#F8FAFC', '#F1F5F9',
          '#F8FAFC', '#F1F5F9', '#F8FAFC', '#F1F5F9',
        ];

        for (let i = 0; i < ghostSlices; i++) {
          ctx.beginPath();
          ctx.moveTo(center, center);
          ctx.arc(center, center, radius, i * ghostAngle, (i + 1) * ghostAngle);
          ctx.closePath();
          ctx.fillStyle = ghostColors[i];
          ctx.fill();
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Outer rim
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 10;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(center, center, radius + 2, 0, 2 * Math.PI);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#E2E8F0';
        ctx.shadowBlur = 0;
        ctx.stroke();

        // Center Hub
        const hubRadius = radius * 0.32;
        ctx.beginPath();
        ctx.arc(center, center, hubRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(center, center, hubRadius * 0.85, 0, 2 * Math.PI);
        ctx.fillStyle = '#F8FAFC';
        ctx.shadowBlur = 0;
        ctx.fill();
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Hub text
        ctx.font = '600 13px "Hind Siliguri", sans-serif';
        ctx.fillStyle = '#64748B';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('টপিক যোগ করুন', center, center);

        ctx.restore();
        return;
      }

      // When 1 name: Draw full circle for that single slice
      if (count === 1) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, 2 * Math.PI);
        ctx.fillStyle = colors[0] || '#6366F1';
        ctx.fill();

        const textColor = getContrastColor(colors[0] || '#6366F1');
        ctx.font = '700 16px "Hind Siliguri", sans-serif';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(names[0], center, center - radius * 0.45);

        // Outer rim
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Hub
        const hubRadius = radius * 0.26;
        ctx.beginPath();
        ctx.arc(center, center, hubRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.font = '700 13px "Hind Siliguri", sans-serif';
        ctx.fillStyle = '#4F46E5';
        ctx.fillText('১টি টপিক', center, center);

        ctx.restore();
        return;
      }

      // Normal multi-slice wheel (count >= 2)
      const sliceAngle = (2 * Math.PI) / count;

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(rotation);

      // Draw slices
      for (let i = 0; i < count; i++) {
        const startAngle = i * sliceAngle;
        const endAngle = (i + 1) * sliceAngle;
        const color = colors[i] || '#6366F1';

        // Slice wedge
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Slice border - fine hairline for 30+ slices
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = count > 30 ? 0.75 : count > 18 ? 1 : 1.5;
        ctx.stroke();

        // Draw Name text
        ctx.save();
        const midAngle = startAngle + sliceAngle / 2;
        ctx.rotate(midAngle);

        const textColor = getContrastColor(color);
        ctx.fillStyle = textColor;
        const fontSize = count > 30 ? 9.5 : count > 22 ? 11 : count > 12 ? 12.5 : 14;
        const fontWeight = count > 30 ? '700' : '600';
        ctx.font = `${fontWeight} ${fontSize}px "Hind Siliguri", "Inter", sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        const hubRadius = count > 30 ? radius * 0.22 : radius * 0.26;
        const maxTextWidth = radius - hubRadius - 14;

        let rawName = names[i];
        if (ctx.measureText(rawName).width > maxTextWidth) {
          while (rawName.length > 1 && ctx.measureText(rawName + '…').width > maxTextWidth) {
            rawName = rawName.slice(0, -1);
          }
          rawName += '…';
        }

        ctx.fillText(rawName, radius - 12, 0);
        ctx.restore();
      }

      // Outer Rim / Bezel
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
      ctx.shadowBlur = 12;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(center, center, radius + 2, 0, 2 * Math.PI);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)';
      ctx.shadowBlur = 0;
      ctx.stroke();

      // Center Hub (adaptively scaled for 36+ slices)
      const hubRadius = count > 30 ? radius * 0.22 : radius * 0.26;
      ctx.beginPath();
      ctx.arc(center, center, hubRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 2;
      ctx.fill();

      // Center Hub inner gradient ring
      ctx.beginPath();
      ctx.arc(center, center, hubRadius * 0.82, 0, 2 * Math.PI);
      const hubGrad = ctx.createLinearGradient(center - hubRadius, center - hubRadius, center + hubRadius, center + hubRadius);
      hubGrad.addColorStop(0, '#EEF2FF');
      hubGrad.addColorStop(1, '#E0E7FF');
      ctx.fillStyle = hubGrad;
      ctx.shadowBlur = 0;
      ctx.fill();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Hub center text
      ctx.font = '700 13px "Hind Siliguri", sans-serif';
      ctx.fillStyle = '#4F46E5';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('স্পিন', center, center);

      ctx.restore();
    },
    [names, colors, wheelSize]
  );

  // Redraw when names, colors, or wheelSize change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = wheelSize * dpr;
    canvas.height = wheelSize * dpr;
    drawWheel(currentAngleRef.current);
  }, [names, colors, wheelSize, drawWheel]);

  // Execute Spin Animation
  const startSpin = useCallback(() => {
    if (isSpinning || names.length < 2) return;

    onSpinStart();
    sound.playWhooshSound();
    sound.startSpinMusic();

    const count = names.length;
    const sliceAngle = (2 * Math.PI) / count;

    // Pick winner randomly before animation starts
    const winnerIndex = Math.floor(Math.random() * count);
    const winnerName = names[winnerIndex];

    // Jitter: small random offset within slice (±35% of half-slice)
    const maxJitter = (sliceAngle / 2) * 0.7;
    const jitter = (Math.random() - 0.5) * 2 * maxJitter;

    // Pointer is at 12 o'clock = 3*PI/2
    const targetMod = (3 * Math.PI / 2 - (winnerIndex * sliceAngle + sliceAngle / 2) + jitter) % (2 * Math.PI);
    const normalizedTargetMod = targetMod < 0 ? targetMod + 2 * Math.PI : targetMod;

    const currentMod = currentAngleRef.current % (2 * Math.PI);
    const normalizedCurrentMod = currentMod < 0 ? currentMod + 2 * Math.PI : currentMod;

    let deltaAngle = normalizedTargetMod - normalizedCurrentMod;
    if (deltaAngle < 0) {
      deltaAngle += 2 * Math.PI;
    }

    const fullSpins = 7 + Math.floor(Math.random() * 2);
    const totalAngleDelta = fullSpins * 2 * Math.PI + deltaAngle;

    const startAngle = currentAngleRef.current;
    const finalAngle = startAngle + totalAngleDelta;

    const startTime = performance.now();
    const mainDuration = 3800;
    const bounceDuration = 220;
    const totalDuration = mainDuration + bounceDuration;

    lastSliceTickRef.current = -1;

    const easeOutCubicBezier = (t: number): number => {
      return 1 - Math.pow(1 - t, 4.2);
    };

    const animate = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < mainDuration) {
        const progress = elapsed / mainDuration;
        const eased = easeOutCubicBezier(progress);
        const currentRot = startAngle + totalAngleDelta * eased;
        currentAngleRef.current = currentRot;

        const pointerPos = (3 * Math.PI / 2 - currentRot) % (2 * Math.PI);
        const normalizedPointerPos = pointerPos < 0 ? pointerPos + 2 * Math.PI : pointerPos;
        const currentSliceUnderPointer = Math.floor(normalizedPointerPos / sliceAngle);

        if (currentSliceUnderPointer !== lastSliceTickRef.current) {
          lastSliceTickRef.current = currentSliceUnderPointer;
          const velocity = (1 - progress);
          triggerPointerTick(velocity);
        }

        drawWheel(currentRot);
        animFrameRef.current = requestAnimationFrame(animate);
      } else if (elapsed < totalDuration) {
        const bounceProgress = (elapsed - mainDuration) / bounceDuration;
        const bounceAmount = Math.sin(bounceProgress * Math.PI) * 0.028 * (1 - bounceProgress);
        const currentRot = finalAngle - bounceAmount;
        currentAngleRef.current = currentRot;

        drawWheel(currentRot);
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        currentAngleRef.current = finalAngle;
        drawWheel(finalAngle);
        sound.stopSpinMusic();
        onSpinEnd(winnerName, winnerIndex);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isSpinning, names, onSpinStart, onSpinEnd, drawWheel, triggerPointerTick]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full max-w-[390px] mx-auto select-none"
    >
      {/* Ambient background glow behind the wheel */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-200/50 via-purple-200/40 to-pink-200/40 blur-3xl" />
      </div>

      {/* Pointer Needle (SVG) */}
      <div
        ref={pointerRef}
        className="absolute top-0 left-1/2 z-20 -mt-2.5 pointer-events-none transform -translate-x-1/2 origin-top transition-transform"
        style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.18))' }}
      >
        <svg
          width="34"
          height="42"
          viewBox="0 0 34 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 40L6 10C5 7.5 6.8 5 9.5 5H24.5C27.2 5 29 7.5 28 10L17 40Z"
            fill="url(#pointer_gradient)"
          />
          <path
            d="M17 35L8.5 10C8 8.8 8.9 7.5 10.2 7.5H23.8C25.1 7.5 26 8.8 25.5 10L17 35Z"
            fill="white"
            fillOpacity="0.4"
          />
          <circle cx="17" cy="8" r="4.5" fill="#FFFFFF" />
          <circle cx="17" cy="8" r="2.5" fill="#4F46E5" />

          <defs>
            <linearGradient id="pointer_gradient" x1="6" y1="5" x2="28" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4F46E5" />
              <stop offset="1" stopColor="#9333EA" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Canvas container with idle breathing when ready to spin */}
      <div
        className={`relative cursor-pointer transition-transform duration-300 ${
          !isSpinning && names.length >= 2 ? 'animate-idle-wheel hover:scale-[1.01]' : ''
        }`}
        onClick={names.length >= 2 ? startSpin : undefined}
        title={names.length >= 2 ? 'টপিক স্পিন করতে ক্লিক করুন' : 'স্পিন করতে অন্তত ২টি টপিক যোগ করুন'}
      >
        <canvas
          ref={canvasRef}
          style={{ width: `${wheelSize}px`, height: `${wheelSize}px` }}
          className="rounded-full shadow-[0_12px_45px_-12px_rgba(79,70,229,0.18)]"
        />
      </div>

      {/* Main Spin CTA Button */}
      <div className="mt-5 w-full max-w-[280px]">
        <button
          type="button"
          onClick={startSpin}
          disabled={isSpinning || names.length < 2}
          aria-label={isSpinning ? 'ঘুরছে...' : names.length < 2 ? 'টপিক যোগ করুন' : 'টপিক স্পিন করুন'}
          className={`relative w-full h-12 rounded-2xl font-bold text-base tracking-wide flex items-center justify-center gap-2 overflow-hidden shadow-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${
            isSpinning
              ? 'bg-neutral-800 text-white shadow-neutral-900/20'
              : names.length < 2
              ? 'bg-neutral-200 text-neutral-500'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]'
          }`}
        >
          {/* Shimmer sweep effect when ready */}
          {!isSpinning && names.length >= 2 && (
            <div className="absolute inset-0 animate-shimmer-sweep pointer-events-none" />
          )}

          {isSpinning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>ঘুরছে...</span>
            </>
          ) : names.length === 0 ? (
            <>
              <UserPlus className="w-5 h-5 text-neutral-500" />
              <span>আগে টপিক যোগ করুন</span>
            </>
          ) : names.length === 1 ? (
            <>
              <UserPlus className="w-5 h-5 text-neutral-500" />
              <span>আরেকটি টপিক দিন</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>টপিক স্পিন করুন!</span>
            </>
          )}
        </button>

        {names.length < 2 && (
          <p className="text-center text-xs text-amber-600 font-medium mt-1.5">
            {names.length === 0
              ? 'স্পিন করার জন্য নিচে আপনার পছন্দমতো টপিক যোগ করুন'
              : 'স্পিন করতে অন্তত ২টি টপিক প্রয়োজন (আরও ১টি দিন)'}
          </p>
        )}
      </div>
    </div>
  );
};
