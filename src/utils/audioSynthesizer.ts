// Web Audio Synthesizer Engine for Cinematic Birthday Journey
// Playing "A Thousand Years - Piano Instrumental" CONTINUOUSLY from loading to finale!

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private songTimer: number | null = null;
  private audioEl: HTMLAudioElement | null = null;

  constructor() {
    try {
      // Direct high-quality piano stream for A Thousand Years / romantic piano
      this.audioEl = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112185.mp3');
      this.audioEl.loop = true;
      this.audioEl.volume = 0.75;
    } catch {
      // Audio element fallback handled gracefully
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxFunc = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxFunc();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.pauseContinuousMusic();
    } else {
      this.startContinuousMusic();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.08, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.65);
    });
  }

  public playFireworkSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    const thudOsc = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thudOsc.type = 'triangle';
    thudOsc.frequency.setValueAtTime(160, now);
    thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.25);

    thudGain.gain.setValueAtTime(0.35, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    thudOsc.connect(thudGain);
    thudGain.connect(this.ctx.destination);

    thudOsc.start(now);
    thudOsc.stop(now + 0.25);

    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const popTime = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, popTime);
      filter.Q.setValueAtTime(3.5, popTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, popTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.35);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(popTime);
      whiteNoise.stop(popTime + 0.35);
    }, 120);
  }

  public playWhoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.25);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.5);
  }

  public playPageFlip() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // START CONTINUOUS MUSIC: Plays "A Thousand Years - Piano Instrumental" smoothly from loading to end
  public startContinuousMusic() {
    if (this.isMuted || this.isPlaying) return;
    this.initCtx();
    this.isPlaying = true;

    if (this.audioEl) {
      this.audioEl.play().catch(() => {
        this.synthesizeAThousandYears();
      });
    } else {
      this.synthesizeAThousandYears();
    }
  }

  public pauseContinuousMusic() {
    this.isPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.songTimer !== null) {
      clearInterval(this.songTimer);
      this.songTimer = null;
    }
  }

  // Web Audio Synthesizer for "A Thousand Years" Piano arrangement (fallback)
  private synthesizeAThousandYears() {
    if (!this.ctx || this.isMuted) return;

    const loopMelody = () => {
      if (this.isMuted || !this.ctx || !this.isPlaying) return;

      const notes = [
        { f: 392.00, d: 0.45, t: 0.0 }, // G4
        { f: 392.00, d: 0.45, t: 0.5 }, // G4
        { f: 440.00, d: 0.45, t: 1.0 }, // A4
        { f: 440.00, d: 0.45, t: 1.5 }, // A4
        { f: 392.00, d: 0.45, t: 2.0 }, // G4
        { f: 349.23, d: 0.90, t: 2.5 }, // F4

        { f: 523.25, d: 0.55, t: 3.8 }, // C5
        { f: 523.25, d: 0.55, t: 4.4 }, // C5
        { f: 523.25, d: 0.55, t: 5.0 }, // C5
        { f: 493.88, d: 0.55, t: 5.6 }, // B4
        { f: 440.00, d: 0.55, t: 6.2 }, // A4
        { f: 392.00, d: 1.10, t: 6.8 }, // G4

        { f: 523.25, d: 0.55, t: 8.2 }, // C5
        { f: 523.25, d: 0.55, t: 8.8 }, // C5
        { f: 523.25, d: 0.55, t: 9.4 }, // C5
        { f: 493.88, d: 0.55, t: 10.0 },// B4
        { f: 440.00, d: 0.55, t: 10.6 },// A4
        { f: 392.00, d: 0.55, t: 11.2 },// G4
        { f: 329.63, d: 1.20, t: 11.8 },// E4

        { f: 698.46, d: 0.55, t: 13.4 },// F5
        { f: 659.25, d: 0.55, t: 14.0 },// E5
        { f: 587.33, d: 0.55, t: 14.6 },// D5
        { f: 523.25, d: 0.55, t: 15.2 },// C5
        { f: 523.25, d: 0.55, t: 15.8 },// C5
        { f: 493.88, d: 0.55, t: 16.4 },// B4
        { f: 440.00, d: 0.55, t: 17.0 },// A4
        { f: 392.00, d: 1.40, t: 17.6 },// G4

        { f: 698.46, d: 0.55, t: 19.4 },// F5
        { f: 659.25, d: 0.55, t: 20.0 },// E5
        { f: 587.33, d: 0.55, t: 20.6 },// D5
        { f: 523.25, d: 2.20, t: 21.2 },// C5
      ];

      const startTime = this.ctx.currentTime;
      notes.forEach((item) => {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.f, startTime + item.t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, startTime + item.t);

        gain.gain.setValueAtTime(0.001, startTime + item.t);
        gain.gain.linearRampToValueAtTime(0.12, startTime + item.t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + item.t + item.d + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime + item.t);
        osc.stop(startTime + item.t + item.d + 0.45);
      });
    };

    loopMelody();
    if (this.songTimer !== null) clearInterval(this.songTimer);
    this.songTimer = window.setInterval(loopMelody, 24000);
  }

  public playChapterSound(_chapterId: string) {
    // Keep continuous music playing seamlessly without restart or interruption
    if (this.isMuted) return;
    this.startContinuousMusic();
  }

  public playAThousandYears() {
    this.startContinuousMusic();
  }

  public startAmbient() {
    this.startContinuousMusic();
  }

  public stopAmbient() {
    this.pauseContinuousMusic();
  }
}

export const soundManager = new SoundManager();
