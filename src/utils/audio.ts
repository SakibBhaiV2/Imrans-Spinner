/* © 2025 IMRAN — All rights reserved. */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private musicInterval: number | null = null;
  private musicGainNode: GainNode | null = null;

  constructor() {
    // Read initial settings from localStorage if available
    try {
      const savedSfx = localStorage.getItem('imran_spinner_sfx') ?? localStorage.getItem('sakib_spinner_sfx');
      if (savedSfx !== null) {
        this.sfxEnabled = savedSfx === 'true';
      }
      const savedMusic = localStorage.getItem('imran_spinner_music') ?? localStorage.getItem('sakib_spinner_music');
      if (savedMusic !== null) {
        this.musicEnabled = savedMusic === 'true';
      }
    } catch {
      // Fallback to defaults
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
    try {
      localStorage.setItem('imran_spinner_sfx', String(enabled));
    } catch {
      // Ignore
    }
    if (enabled) {
      this.playTapSound();
    }
  }

  public getMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    try {
      localStorage.setItem('imran_spinner_music', String(enabled));
    } catch {
      // Ignore
    }
    if (!enabled && this.musicInterval !== null) {
      this.stopSpinMusic();
    } else if (enabled) {
      this.playTapSound();
    }
  }

  /**
   * Mechanical ratchet tick sound as wheel slices cross pointer
   */
  public playTickSound(speedRatio: number = 1): void {
    if (!this.sfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch scales slightly with spin speed for realism
      const clampedRatio = Math.max(0.1, Math.min(1.8, speedRatio));
      const baseFreq = 1000 + clampedRatio * 400;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.025);

      const volume = Math.min(0.22, 0.08 + clampedRatio * 0.12);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.028);
    } catch {
      // AudioContext could be blocked by browser policy
    }
  }

  /**
   * Launch / Whoosh sound when user taps SPIN
   */
  public playWhooshSound(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.45);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.52);
    } catch {
      // AudioContext safe
    }
  }

  /**
   * Celebratory chime and fanfare when winner is revealed
   */
  public playWinFanfare(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Arpeggio notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const noteStart = now + idx * 0.11;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(0.24, noteStart + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.75);
      });

      // Warm backing chord for the grand finish
      const chordStart = now + 0.45;
      const chordNotes = [261.63, 329.63, 392.00, 523.25];
      chordNotes.forEach((freq) => {
        const chordOsc = ctx.createOscillator();
        const chordGain = ctx.createGain();

        chordOsc.type = 'sine';
        chordOsc.frequency.setValueAtTime(freq, chordStart);

        chordGain.gain.setValueAtTime(0.0001, chordStart);
        chordGain.gain.linearRampToValueAtTime(0.12, chordStart + 0.08);
        chordGain.gain.exponentialRampToValueAtTime(0.0001, chordStart + 1.2);

        chordOsc.connect(chordGain);
        chordGain.connect(ctx.destination);

        chordOsc.start(chordStart);
        chordOsc.stop(chordStart + 1.25);
      });
    } catch {
      // AudioContext safe
    }
  }

  /**
   * Bubble pop sound when adding a name
   */
  public playPopSound(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.07);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // AudioContext safe
    }
  }

  /**
   * Swish sound on removing a name
   */
  public playRemoveSound(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(560, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.09);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // AudioContext safe
    }
  }

  /**
   * Subtle click for buttons
   */
  public playTapSound(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Safe
    }
  }

  /**
   * Procedural background arpeggio music that plays during spin
   * Fades in smoothly and loops pleasantly
   */
  public startSpinMusic(): void {
    if (!this.musicEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.stopSpinMusic(); // clear any existing

    try {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);
      masterGain.connect(ctx.destination);
      this.musicGainNode = masterGain;

      // Pentatonic / uplifting scale: C4, D4, E4, G4, A4, C5
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00];
      let step = 0;

      const scheduleNote = () => {
        if (!this.ctx || !this.musicGainNode) return;
        const now = this.ctx.currentTime;
        const freq = notes[step % notes.length];
        step++;

        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.2, now + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(noteGain);
        noteGain.connect(this.musicGainNode);

        osc.start(now);
        osc.stop(now + 0.18);
      };

      // Play every 160ms for a brisk, pleasant tempo
      scheduleNote();
      this.musicInterval = window.setInterval(scheduleNote, 160);
    } catch {
      // Safe
    }
  }

  /**
   * Stop background spin music with a smooth 600ms fadeout
   */
  public stopSpinMusic(): void {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    if (this.musicGainNode && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.musicGainNode.gain.cancelScheduledValues(now);
        this.musicGainNode.gain.setValueAtTime(this.musicGainNode.gain.value, now);
        this.musicGainNode.gain.linearRampToValueAtTime(0.0001, now + 0.6);
        setTimeout(() => {
          this.musicGainNode = null;
        }, 650);
      } catch {
        this.musicGainNode = null;
      }
    }
  }
}

export const sound = new SoundEngine();
