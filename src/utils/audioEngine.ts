/**
 * Web Audio Engine for CodeMtaani Anthem
 * Afro-futuristic synthesis, 4-track stem mixing, stadium reverb, and audio spectrum analysis
 */

import { ANTHEM_SECTIONS, STEM_TRACKS, TOTAL_DURATION } from './anthemData';

export type StemId = 'vocals' | 'drums' | 'synths' | 'orchestra';

export interface StemState {
  volume: number;
  muted: boolean;
  soloed: boolean;
}

export class AnthemAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTime = 0;
  private startTime = 0;
  private pauseTime = 0;
  private timerId: number | null = null;

  // Audio Nodes
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;

  // Stem Gains
  private stemGains: Record<StemId, GainNode | null> = {
    vocals: null,
    drums: null,
    synths: null,
    orchestra: null,
  };

  // State
  private stemStates: Record<StemId, StemState> = {
    vocals: { volume: 0.9, muted: false, soloed: false },
    drums: { volume: 0.85, muted: false, soloed: false },
    synths: { volume: 0.8, muted: false, soloed: false },
    orchestra: { volume: 0.85, muted: false, soloed: false },
  };

  private masterVolume = 0.85;
  private stadiumReverb = true;
  private filterCutoff = 20000; // open

  // Callbacks
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;

  // Active oscillator schedules
  private schedulerTimer: number | null = null;
  private nextBeatTime = 0;
  private currentBeat = 0;
  private readonly BPM = 112;
  private readonly SECONDS_PER_BEAT = 60 / 112;

  constructor() {
    // Lazy AudioContext initialization on first user gesture
  }

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

    // Filter
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(this.filterCutoff, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.5, this.ctx.currentTime);

    // Analyser for visualizer
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    // Delay / Stadium Echo
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(this.SECONDS_PER_BEAT * 0.75, this.ctx.currentTime); // dotted eighth note
    this.delayGain = this.ctx.createGain();
    this.delayGain.gain.setValueAtTime(this.stadiumReverb ? 0.28 : 0, this.ctx.currentTime);

    // Stem Gain nodes
    STEM_TRACKS.forEach((track) => {
      if (!this.ctx) return;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.stemStates[track.id].volume, this.ctx.currentTime);
      gain.connect(this.filterNode!);
      this.stemGains[track.id] = gain;
    });

    // Routing: Filter -> Master -> Analyser -> Destination
    // Delay feedback loop
    this.filterNode.connect(this.masterGain);
    this.filterNode.connect(this.delayNode);
    this.delayNode.connect(this.delayGain);
    this.delayGain.connect(this.delayNode);
    this.delayGain.connect(this.masterGain);

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  public async play(): Promise<void> {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) return;

    this.isPlaying = true;
    this.startTime = this.ctx.currentTime - this.currentTime;
    this.nextBeatTime = this.ctx.currentTime;
    this.currentBeat = Math.floor((this.currentTime / this.SECONDS_PER_BEAT) * 4);

    this.startScheduler();
    this.startTimeTracking();
  }

  public pause(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.pauseTime = this.ctx ? this.ctx.currentTime - this.startTime : this.currentTime;
    this.currentTime = this.pauseTime;

    this.stopScheduler();
    this.stopTimeTracking();
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public seek(seconds: number): void {
    const target = Math.max(0, Math.min(seconds, TOTAL_DURATION));
    this.currentTime = target;
    if (this.ctx && this.isPlaying) {
      this.startTime = this.ctx.currentTime - target;
      this.nextBeatTime = this.ctx.currentTime;
      this.currentBeat = Math.floor((target / this.SECONDS_PER_BEAT) * 4);
    }
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime);
    }
  }

  public onTimeUpdate(cb: (time: number) => void): void {
    this.onTimeUpdateCallback = cb;
  }

  public onEnded(cb: () => void): void {
    this.onEndedCallback = cb;
  }

  public getAnalyserData(dataArray: Uint8Array): void {
    if (this.analyser) {
      // Cast to any to satisfy TS 5.7+ Uint8Array<ArrayBuffer> vs ArrayBufferLike requirement
      (this.analyser.getByteFrequencyData as (arr: Uint8Array) => void)(dataArray);
    } else {
      dataArray.fill(0);
    }
  }

  public getWaveformData(dataArray: Uint8Array): void {
    if (this.analyser) {
      (this.analyser.getByteTimeDomainData as (arr: Uint8Array) => void)(dataArray);
    } else {
      dataArray.fill(128);
    }
  }

  public setMasterVolume(val: number): void {
    this.masterVolume = Math.max(0, Math.min(val, 1));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public setStemVolume(id: StemId, val: number): void {
    this.stemStates[id].volume = Math.max(0, Math.min(val, 1));
    this.applyStemGains();
  }

  public toggleMute(id: StemId): void {
    this.stemStates[id].muted = !this.stemStates[id].muted;
    this.applyStemGains();
  }

  public toggleSolo(id: StemId): void {
    this.stemStates[id].soloed = !this.stemStates[id].soloed;
    this.applyStemGains();
  }

  public setStadiumReverb(active: boolean): void {
    this.stadiumReverb = active;
    if (this.delayGain && this.ctx) {
      this.delayGain.gain.setValueAtTime(active ? 0.32 : 0, this.ctx.currentTime);
    }
  }

  public setFilterCutoff(freq: number): void {
    this.filterCutoff = Math.max(200, Math.min(freq, 20000));
    if (this.filterNode && this.ctx) {
      this.filterNode.frequency.setValueAtTime(this.filterCutoff, this.ctx.currentTime);
    }
  }

  public getStemStates(): Record<StemId, StemState> {
    return { ...this.stemStates };
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private applyStemGains(): void {
    if (!this.ctx) return;
    const anySolo = Object.values(this.stemStates).some((s) => s.soloed);
    for (const [idStr, state] of Object.entries(this.stemStates)) {
      const id = idStr as StemId;
      const gainNode = this.stemGains[id];
      if (!gainNode) continue;

      let effectiveGain = state.volume;
      if (state.muted) {
        effectiveGain = 0;
      } else if (anySolo && !state.soloed) {
        effectiveGain = 0;
      }
      gainNode.gain.setValueAtTime(effectiveGain, this.ctx.currentTime);
    }
  }

  // Time Tracker
  private startTimeTracking(): void {
    this.stopTimeTracking();
    const update = () => {
      if (!this.isPlaying || !this.ctx) return;
      this.currentTime = this.ctx.currentTime - this.startTime;
      if (this.currentTime >= TOTAL_DURATION) {
        this.currentTime = TOTAL_DURATION;
        this.pause();
        if (this.onEndedCallback) this.onEndedCallback();
      }
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentTime);
      }
      this.timerId = window.requestAnimationFrame(update);
    };
    this.timerId = window.requestAnimationFrame(update);
  }

  private stopTimeTracking(): void {
    if (this.timerId !== null) {
      window.cancelAnimationFrame(this.timerId);
      this.timerId = null;
    }
  }

  // Musical Event Scheduler (Afrobeats Grooves, Synth Chords, Vocals, Orchestra)
  private startScheduler(): void {
    this.stopScheduler();
    const lookahead = 25.0; // milliseconds
    const scheduleAheadTime = 0.15; // seconds

    const step = () => {
      if (!this.isPlaying || !this.ctx) return;
      while (this.nextBeatTime < this.ctx.currentTime + scheduleAheadTime) {
        this.scheduleBeat(this.currentBeat, this.nextBeatTime);
        const sixteenthTime = this.SECONDS_PER_BEAT / 4;
        this.nextBeatTime += sixteenthTime;
        this.currentBeat++;
      }
      this.schedulerTimer = window.setTimeout(step, lookahead);
    };
    step();
  }

  private stopScheduler(): void {
    if (this.schedulerTimer !== null) {
      window.clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  /**
   * Schedule audio synthesis for a 16th-note subdivision
   */
  private scheduleBeat(stepIndex: number, time: number): void {
    if (!this.ctx) return;

    const curSongTime = this.currentTime + (time - this.ctx.currentTime);
    const beatInBar = stepIndex % 16; // 16 sixteenths per bar
    const barIndex = Math.floor(stepIndex / 16);

    // Active Section
    const isIntro = curSongTime < 16;
    const isVerse = (curSongTime >= 16 && curSongTime < 38) || (curSongTime >= 84 && curSongTime < 108);
    const isPreChorus = (curSongTime >= 38 && curSongTime < 56);
    const isChorus = (curSongTime >= 56 && curSongTime < 84) || (curSongTime >= 136 && curSongTime < 168);
    const isBridge = (curSongTime >= 108 && curSongTime < 136);
    const isOutro = curSongTime >= 168;

    // 1. DRUMS STEM
    if (!isIntro && !isOutro && this.stemGains.drums) {
      // Afrobeats Kick pattern (Four on floor with syncopation)
      if (beatInBar === 0 || beatInBar === 10 || (isChorus && beatInBar === 6)) {
        this.triggerKick(time);
      }

      // Snare / Rimshot on Afrobeats syncopated hits (beats 4, 12, and 14)
      if (beatInBar === 4 || beatInBar === 12 || beatInBar === 14) {
        this.triggerSnare(time, beatInBar === 14 ? 0.4 : 0.7);
      }

      // Shekere / Shaker on 16th notes with accent pattern
      const shakerVel = [0.8, 0.3, 0.6, 0.4, 0.9, 0.3, 0.7, 0.4, 0.8, 0.3, 0.6, 0.4, 0.9, 0.3, 0.7, 0.5][beatInBar];
      this.triggerShaker(time, shakerVel * 0.45);

      // Amapiano Log Drum on Chorus & Pre-Chorus
      if ((isChorus || isPreChorus) && (beatInBar === 0 || beatInBar === 3 || beatInBar === 8 || beatInBar === 11)) {
        const rootFreq = beatInBar === 8 ? 65.41 : 48.99; // C2 or G1 pitch
        this.triggerLogDrum(time, rootFreq);
      }
    } else if (isIntro && beatInBar === 0 && barIndex % 2 === 0) {
      // Gentle ethnic drum heartbeat in intro
      this.triggerKick(time, 0.4);
    }

    // 2. SYNTHS STEM (Afro-Futuristic Chords & Arpeggios)
    if (this.stemGains.synths) {
      // F# minor pentatonic notes: F#3 (185Hz), A3 (220Hz), B3 (246.9Hz), C#4 (277.2Hz), E4 (329.6Hz), F#4 (370Hz)
      const scale = [185.0, 220.0, 246.94, 277.18, 329.63, 369.99, 440.0, 554.37];
      
      // Arpeggiator on every 16th note
      if (!isIntro || barIndex >= 2) {
        const arpIndex = (stepIndex * 3) % scale.length;
        const arpFreq = scale[arpIndex];
        const vel = isChorus ? 0.35 : 0.22;
        this.triggerKalimbaArp(time, arpFreq, vel);
      }

      // Atmospheric Pad on bar downbeats (beat 0)
      if (beatInBar === 0) {
        const chordRoots = isChorus ? [185.0, 146.83, 164.81, 220.0] : [185.0, 220.0, 146.83, 164.81];
        const chordRoot = chordRoots[barIndex % chordRoots.length];
        this.triggerSynthPad(time, chordRoot, isChorus ? 0.3 : 0.18);
      }
    }

    // 3. ORCHESTRA & SUB-BASS STEM
    if (this.stemGains.orchestra) {
      // Deep 808 Sub Bass on downbeat
      if ((isVerse || isChorus) && (beatInBar === 0 || beatInBar === 8)) {
        const bassFreq = beatInBar === 8 ? 55.0 : 46.25; // A1 or F#1
        this.triggerSubBass(time, bassFreq, isChorus ? 0.7 : 0.5);
      }

      // Brass Fanfare during Chorus & Bridge Climax
      if (isChorus && (beatInBar === 0 || beatInBar === 6 || beatInBar === 12)) {
        this.triggerStadiumBrass(time, 277.18, 0.4); // C#4 brass stab
      }
    }

    // 4. VOCALS STEM (Choral & Chants synthesized tones)
    if (this.stemGains.vocals) {
      if (isChorus && (beatInBar === 0 || beatInBar === 8)) {
        // Stadium Chant backing tone ("Think! Build! Transform!")
        this.triggerChoirTone(time, 370.0, 0.35); // F#4
      } else if (isBridge && beatInBar === 0) {
        // Layered African choir resonance chord
        this.triggerChoirTone(time, 220.0, 0.3); // A3
        this.triggerChoirTone(time, 277.18, 0.25); // C#4
      }
    }
  }

  // Instrument Voice Synthesizers
  private triggerKick(time: number, velocity = 0.8): void {
    if (!this.ctx || !this.stemGains.drums) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.stemGains.drums);

    osc.start(time);
    osc.stop(time + 0.35);
  }

  private triggerSnare(time: number, velocity = 0.6): void {
    if (!this.ctx || !this.stemGains.drums) return;

    // Noise component
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1200, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.7, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.stemGains.drums);

    // Tonal body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(90, time + 0.08);

    oscGain.gain.setValueAtTime(velocity * 0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.stemGains.drums);

    noise.start(time);
    osc.start(time);
    noise.stop(time + 0.15);
    osc.stop(time + 0.1);
  }

  private triggerShaker(time: number, velocity = 0.3): void {
    if (!this.ctx || !this.stemGains.drums) return;
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(6500, time);
    bandpass.Q.setValueAtTime(2.0, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.stemGains.drums);

    noise.start(time);
    noise.stop(time + 0.06);
  }

  private triggerLogDrum(time: number, freq: number): void {
    if (!this.ctx || !this.stemGains.drums) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Classic Amapiano pitch drop with punch
    osc.frequency.setValueAtTime(freq * 1.8, time);
    osc.frequency.exponentialRampToValueAtTime(freq, time + 0.04);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.9, time + 0.3);

    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    osc.connect(gain);
    gain.connect(this.stemGains.drums);

    osc.start(time);
    osc.stop(time + 0.4);
  }

  private triggerKalimbaArp(time: number, freq: number, velocity = 0.25): void {
    if (!this.ctx || !this.stemGains.synths) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Metallic chime: sine with harmonics
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(this.stemGains.synths);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  private triggerSynthPad(time: number, freq: number, velocity = 0.2): void {
    if (!this.ctx || !this.stemGains.synths) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.006, time); // detuned chorus

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.Q.setValueAtTime(2, time);

    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(velocity, time + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.stemGains.synths);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 1.8);
    osc2.stop(time + 1.8);
  }

  private triggerSubBass(time: number, freq: number, velocity = 0.6): void {
    if (!this.ctx || !this.stemGains.orchestra) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.9);

    osc.connect(gain);
    gain.connect(this.stemGains.orchestra);

    osc.start(time);
    osc.stop(time + 0.9);
  }

  private triggerStadiumBrass(time: number, freq: number, velocity = 0.4): void {
    if (!this.ctx || !this.stemGains.orchestra) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.linearRampToValueAtTime(3200, time + 0.08); // brass bite
    filter.frequency.exponentialRampToValueAtTime(1200, time + 0.45);

    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.stemGains.orchestra);

    osc.start(time);
    osc.stop(time + 0.45);
  }

  private triggerChoirTone(time: number, freq: number, velocity = 0.3): void {
    if (!this.ctx || !this.stemGains.vocals) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const formantFilter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    formantFilter.type = 'bandpass';
    formantFilter.frequency.setValueAtTime(850, time); // "Ah" vocal vowel formant
    formantFilter.Q.setValueAtTime(3.5, time);

    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(velocity, time + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

    osc.connect(formantFilter);
    formantFilter.connect(gain);
    gain.connect(this.stemGains.vocals);

    osc.start(time);
    osc.stop(time + 0.8);
  }

  /**
   * Soundboard immediate trigger
   */
  public playSoundboardDrop(dropId: string, frequencyBase = 330): void {
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(frequencyBase, now);
    osc2.frequency.setValueAtTime(frequencyBase * 1.5, now); // Fifth harmony

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(2.5, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.7);
    osc2.stop(now + 0.7);
  }
}

// Singleton audio engine instance
export const anthemAudio = new AnthemAudioEngine();
