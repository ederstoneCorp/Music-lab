import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AudioVisualizer } from './components/AudioVisualizer';
import { LyricPrompter } from './components/LyricPrompter';
import { StemMixer } from './components/StemMixer';
import { LyriaMusicStudio } from './components/LyriaMusicStudio';
import { Soundboard } from './components/Soundboard';
import { FullLyricsView } from './components/FullLyricsView';
import { CommunityStory } from './components/CommunityStory';
import { anthemAudio } from './utils/audioEngine';
import {
  ANTHEM_SECTIONS,
  TOTAL_DURATION,
  formatTime,
  getActiveSection,
} from './utils/anthemData';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Share2,
  Music4,
  Layers,
  Sparkles,
  FileText,
  Info,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'anthem' | 'stems' | 'lyria' | 'lyrics' | 'story'>('anthem');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [masterVolume, setMasterVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize and check ?autostart=1 query parameter
  useEffect(() => {
    anthemAudio.onTimeUpdate((time) => {
      setCurrentTime(time);
    });

    anthemAudio.onEnded(() => {
      setIsPlaying(false);
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      anthemAudio.play().then(() => {
        setIsPlaying(true);
      });
    }
  }, []);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      anthemAudio.pause();
      setIsPlaying(false);
    } else {
      await anthemAudio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (seconds: number) => {
    anthemAudio.seek(seconds);
    setCurrentTime(seconds);
  };

  const handleSkip = (delta: number) => {
    handleSeek(currentTime + delta);
  };

  const handleVolumeChange = (val: number) => {
    setMasterVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
    anthemAudio.setMasterVolume(val);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      anthemAudio.setMasterVolume(masterVolume);
    } else {
      setIsMuted(true);
      anthemAudio.setMasterVolume(0);
    }
  };

  const activeSection = getActiveSection(currentTime);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Master Player Deck Card */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Album Artwork */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center gap-6">
              <div className="relative group w-48 sm:w-56 lg:w-full aspect-square max-w-[280px] rounded-xl overflow-hidden border border-amber-500/30 shadow-xl shadow-amber-500/5 bg-slate-950">
                <img
                  src="/src/assets/images/album_cover_art_1794252615131.jpg"
                  alt="CodeMtaani Think. Build. Transform. Official Album Artwork"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={handleTogglePlay}
                  className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                  aria-label={isPlaying ? 'Pause anthem' : 'Play anthem'}
                >
                  <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                  </div>
                </button>
              </div>

              {/* Quick stats unboxed metadata */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
                <span>112 BPM</span>
                <span aria-hidden="true">·</span>
                <span>F# Minor</span>
                <span aria-hidden="true">·</span>
                <span>Afropop Anthem</span>
                <span aria-hidden="true">·</span>
                <span>4 Stems Active</span>
              </div>
            </div>

            {/* Right: Master Transport & Spectrum Controls */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
              {/* Title & Section Tracker */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                    Official Anthem Master
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Current Section:</span>
                    <span className="text-xs font-bold text-white px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30">
                      {activeSection.name}
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
                  Think. Build. Transform.
                </h1>
                <p className="text-sm text-slate-300 mt-1">
                  CodeMtaani x Afro-Future Collective · Radio-Ready Studio Master
                </p>
              </div>

              {/* Live Audio Visualizer */}
              <AudioVisualizer isPlaying={isPlaying} />

              {/* Progress Scrub Bar */}
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={TOTAL_DURATION}
                    step="0.5"
                    value={currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                    aria-label="Seek anthem timeline"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 tabular-nums">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-slate-500">
                    {activeSection.lines.length > 0 ? activeSection.musicalFocus : 'Radio Anthem'}
                  </span>
                  <span>{formatTime(TOTAL_DURATION)}</span>
                </div>
              </div>

              {/* Transport Buttons & Volume */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
                {/* Left: Quick Section Jump Dropdown */}
                <div className="flex items-center gap-2">
                  <label htmlFor="section-jump" className="text-xs text-slate-400 whitespace-nowrap">
                    Jump:
                  </label>
                  <select
                    id="section-jump"
                    value={activeSection.id}
                    onChange={(e) => {
                      const sec = ANTHEM_SECTIONS.find((s) => s.id === e.target.value);
                      if (sec) handleSeek(sec.startTime);
                    }}
                    className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    {ANTHEM_SECTIONS.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name} ({formatTime(sec.startTime)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Center: Playback Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSkip(-10)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title="Rewind 10 seconds"
                    aria-label="Rewind 10 seconds"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleTogglePlay}
                    className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20 cursor-pointer"
                    aria-label={isPlaying ? 'Pause anthem' : 'Play anthem'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleSkip(10)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title="Forward 10 seconds"
                    aria-label="Forward 10 seconds"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Master Volume Control */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleMute}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || masterVolume === 0 ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : masterVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 sm:w-24 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    aria-label="Master output volume"
                  />
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums w-8">
                    {isMuted ? '0%' : `${Math.round(masterVolume * 100)}%`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation Content Switcher */}
        {activeTab === 'anthem' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Synchronized Teleprompter */}
              <div className="lg:col-span-8">
                <LyricPrompter
                  currentTime={currentTime}
                  onSeek={handleSeek}
                  isPlaying={isPlaying}
                />
              </div>

              {/* Quick Stem & Production Highlights */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Production Highlights
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('stems')}
                      className="text-xs text-amber-400 hover:underline font-medium"
                    >
                      Open Mixer &rarr;
                    </button>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                      <span className="text-amber-400 font-semibold block mb-0.5">
                        Stadium Chant Drop
                      </span>
                      "Think! Build! Transform!" chorus recorded with stadium call-and-response ensemble and explosive brass.
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                      <span className="text-purple-400 font-semibold block mb-0.5">
                        African Choir Breakdown
                      </span>
                      Soulful 4-part choir singing "One vision, one future, together" over organic djembe heartbeat.
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                      <span className="text-cyan-400 font-semibold block mb-0.5">
                        Afro-Electronic Fusion
                      </span>
                      Amapiano log drum pitch-bends interwoven with cybernetic 16th-note arpeggiators.
                    </div>
                  </div>
                </div>

                {/* Direct Lyria Generator Teaser Callout */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Lyria Music AI Engine</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Generate Custom Variations
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Create personalized 30s clips (<code className="text-amber-300">lyria-3-clip-preview</code>) or full tracks (<code className="text-amber-300">lyria-3-pro-preview</code>) with Google Lyria.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('lyria')}
                    className="w-full py-2 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
                  >
                    Open Lyria Generator &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Stadium Soundboard */}
            <Soundboard />
          </div>
        )}

        {/* Tab 2: Full Stem Mixer */}
        {activeTab === 'stems' && (
          <div className="space-y-6">
            <StemMixer isPlaying={isPlaying} />
            <Soundboard />
          </div>
        )}

        {/* Tab 3: Lyria AI Music Studio */}
        {activeTab === 'lyria' && (
          <div className="space-y-6">
            <LyriaMusicStudio />
          </div>
        )}

        {/* Tab 4: Full Anthem Score & Lyrics */}
        {activeTab === 'lyrics' && (
          <div className="space-y-6">
            <FullLyricsView />
          </div>
        )}

        {/* Tab 5: The Movement & Community Story */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            <CommunityStory />
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CodeMtaani</span>
            <span aria-hidden="true">·</span>
            <span>Think. Build. Transform.</span>
            <span aria-hidden="true">·</span>
            <span>Nairobi, Kenya & Global Tech Community</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Afro-Futuristic Afropop Production</span>
            <span aria-hidden="true">·</span>
            <span>Powered by Lyria AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
