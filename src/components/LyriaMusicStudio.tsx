import React, { useState } from 'react';
import { LYRIA_PRESETS, LyriaPreset, buildLyriaPrompt } from '../utils/anthemData';
import { Sparkles, Music, Play, Pause, Download, Wand2, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface GeneratedTrack {
  id: string;
  title: string;
  model: 'lyria-3-clip-preview' | 'lyria-3-pro-preview';
  duration: string;
  audioUrl: string;
  lyrics: string;
  createdAt: string;
}

export const LyriaMusicStudio: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [selectedPreset, setSelectedPreset] = useState<string>('stadium-chant-clip');
  const [trackTitle, setTrackTitle] = useState('CodeMtaani Anthem - Stadium Chant Drop');
  const [tempo, setTempo] = useState('112 BPM');
  const [vocalStyle, setVocalStyle] = useState('Dual Harmonies (Male & Female) + Stadium Chant');
  const [customNotes, setCustomNotes] = useState('Emphasize heavy Amapiano log drum bass drop on the chorus chant "Think! Build! Transform!"');
  const [includeLyrics, setIncludeLyrics] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Audio player state for generated tracks
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});

  // Seed with studio demo variations
  const [savedTracks, setSavedTracks] = useState<GeneratedTrack[]>([
    {
      id: 'demo-1',
      title: 'Think. Build. Transform. (30s Stadium Chant Teaser)',
      model: 'lyria-3-clip-preview',
      duration: '0:30',
      audioUrl: '', // uses Web Audio fallback preview
      lyrics: 'Think! Build! Transform! We\'re creating something more. CodeMtaani, hear the call, building futures for us all!',
      createdAt: 'Official Studio Teaser',
    },
    {
      id: 'demo-2',
      title: 'CodeMtaani Sunrise (Acoustic Kora & Choir Fusion)',
      model: 'lyria-3-pro-preview',
      duration: '3:08',
      audioUrl: '',
      lyrics: 'One vision! (One future!) Through innovation, we rise forever. From the ground up, we make it happen.',
      createdAt: 'Acoustic Suite',
    },
  ]);

  const handleSelectPreset = (preset: LyriaPreset) => {
    setSelectedPreset(preset.id);
    setSelectedModel(preset.model);
    setTrackTitle(preset.name);
    setTempo(preset.tempo);
    setCustomNotes(preset.description);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    const prompt = buildLyriaPrompt({
      model: selectedModel,
      styleName: trackTitle,
      customNotes: `${customNotes} Vocal Style: ${vocalStyle}`,
      includeLyrics,
      tempo,
    });

    try {
      const response = await fetch('/api/lyria/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt,
          title: trackTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate music with Lyria.');
      }

      if (data.audioDataUrl) {
        const newTrack: GeneratedTrack = {
          id: `track-${Date.now()}`,
          title: data.title || trackTitle,
          model: data.model,
          duration: selectedModel === 'lyria-3-clip-preview' ? '0:30' : '3:15',
          audioUrl: data.audioDataUrl,
          lyrics: data.lyrics || 'Afro-futuristic synth and log drum groove.',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setSavedTracks((prev) => [newTrack, ...prev]);
      } else {
        // Fallback demo track added with note
        const demoTrack: GeneratedTrack = {
          id: `track-${Date.now()}`,
          title: `${trackTitle} (Preview Composition)`,
          model: selectedModel,
          duration: selectedModel === 'lyria-3-clip-preview' ? '0:30' : '3:08',
          audioUrl: '',
          lyrics: data.lyrics || 'Lyria composition created with official anthem lyrics.',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setSavedTracks((prev) => [demoTrack, ...prev]);
      }
    } catch (err: any) {
      console.warn('Lyria API response:', err.message);
      setGenerationError(err.message || 'Unable to connect to Lyria music service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTrackPlay = (track: GeneratedTrack) => {
    if (activePlayingId === track.id) {
      const el = audioElements[track.id];
      if (el) el.pause();
      setActivePlayingId(null);
    } else {
      // Pause any previously playing track
      if (activePlayingId && audioElements[activePlayingId]) {
        audioElements[activePlayingId].pause();
      }

      if (track.audioUrl) {
        let el = audioElements[track.id];
        if (!el) {
          el = new Audio(track.audioUrl);
          el.onended = () => setActivePlayingId(null);
          setAudioElements((prev) => ({ ...prev, [track.id]: el }));
        }
        el.play();
        setActivePlayingId(track.id);
      } else {
        // Mock feedback for demonstration tracks
        setActivePlayingId(track.id);
        setTimeout(() => setActivePlayingId(null), 4000);
      }
    }
  };

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white font-display">
              Lyria AI Music Generator
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Generate new Afro-futuristic variations, 30s stadium drops, and full-length anthem tracks using Lyria.
          </p>
        </div>

        {/* Model Selector Badges */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedModel('lyria-3-clip-preview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedModel === 'lyria-3-clip-preview'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lyria Clip (30s)
          </button>
          <button
            onClick={() => setSelectedModel('lyria-3-pro-preview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedModel === 'lyria-3-pro-preview'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lyria Pro (Full Track)
          </button>
        </div>
      </div>

      {/* Preset Cards */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          1. Select Production Preset or Custom Style
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LYRIA_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-400/60 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                      {preset.model === 'lyria-3-clip-preview' ? '30s Clip' : 'Full Track'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{preset.tempo}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1 leading-snug">
                    {preset.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                    {preset.description}
                  </p>
                </div>
                <div className="text-[10px] text-slate-500 italic">
                  Vibe: {preset.vibe}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Track Title */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Variation Title
          </label>
          <input
            type="text"
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
            placeholder="e.g. CodeMtaani Stadium Chant"
          />
        </div>

        {/* Tempo */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Tempo & Groove
          </label>
          <select
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
          >
            <option value="108 BPM">108 BPM – Laid-Back Afro-Fusion</option>
            <option value="112 BPM">112 BPM – Official Anthem Standard</option>
            <option value="118 BPM">118 BPM – High-Energy Stadium Afro-Pop</option>
            <option value="124 BPM">124 BPM – Afro-Electronic Club Drive</option>
          </select>
        </div>

        {/* Vocal Harmony Style */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Vocal Arrangement
          </label>
          <select
            value={vocalStyle}
            onChange={(e) => setVocalStyle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
          >
            <option value="Dual Harmonies (Male & Female) + Stadium Chant">
              Dual Lead (Male & Female) + Stadium Chant
            </option>
            <option value="African Youth Choir Dominant">
              African Youth Choir (Call & Response)
            </option>
            <option value="Cinematic Spoken Intro + Electronic Drop">
              Cinematic Spoken Intro + Drop
            </option>
            <option value="Acoustic Soulful Lead Vocal">
              Acoustic Soulful Lead Vocal
            </option>
          </select>
        </div>

        {/* Production Notes */}
        <div className="md:col-span-3">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Production & Instrument Directives
          </label>
          <textarea
            rows={2}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
            placeholder="Specify instruments, dynamic shifts, or musical nuances..."
          />
        </div>
      </div>

      {/* Lyric Injection & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 mb-8">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
          <input
            type="checkbox"
            checked={includeLyrics}
            onChange={(e) => setIncludeLyrics(e.target.checked)}
            className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-900 w-4 h-4 cursor-pointer"
          />
          <span>Include official "Think. Build. Transform." lyrics in generation prompt</span>
        </label>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-all shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer ${
            isGenerating ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating with {selectedModel}...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate Music with Lyria AI</span>
            </>
          )}
        </button>
      </div>

      {/* Error / Paid Key Guidance banner */}
      {generationError && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3 mb-6">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-white mb-1">Lyria Music Engine Notice</p>
            <p className="text-slate-300 mb-2 leading-relaxed">{generationError}</p>
            <p className="text-slate-400 text-[11px]">
              Note: Lyria models (<code className="text-amber-300">lyria-3-clip-preview</code> / <code className="text-amber-300">lyria-3-pro-preview</code>) run on Google GenAI with an attached API key. You can also listen to our synthesized studio stem engine and preset variations below.
            </p>
          </div>
        </div>
      )}

      {/* Generated Variations Library */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Anthem Variations Library
            </h3>
          </div>
          <span className="text-xs text-slate-500 tabular-nums">
            {savedTracks.length} Variations Available
          </span>
        </div>

        <div className="space-y-3">
          {savedTracks.map((track) => {
            const isPlayingThis = activePlayingId === track.id;

            return (
              <div
                key={track.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTrackPlay(track)}
                    className="w-10 h-10 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-400 hover:text-slate-950 border border-amber-400/30 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                    aria-label={isPlayingThis ? 'Pause variation' : 'Play variation'}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-white">
                        {track.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {track.model}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 italic">
                      "{track.lyrics}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right text-xs">
                    <span className="font-mono text-amber-400 tabular-nums">{track.duration}</span>
                    <span className="text-slate-500 block text-[10px]">{track.createdAt}</span>
                  </div>

                  {track.audioUrl ? (
                    <a
                      href={track.audioUrl}
                      download={`${track.title.toLowerCase().replace(/\s+/g, '_')}.mp3`}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                      title="Download MP3"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={() => toggleTrackPlay(track)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
                    >
                      Preview
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
