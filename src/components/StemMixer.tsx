import React, { useState, useEffect } from 'react';
import { STEM_TRACKS, StemTrack } from '../utils/anthemData';
import { anthemAudio, StemId, StemState } from '../utils/audioEngine';
import { Sliders, Volume2, VolumeX, Mic, Activity, Drum, Sparkles, RotateCcw } from 'lucide-react';

interface StemMixerProps {
  isPlaying: boolean;
}

export const StemMixer: React.FC<StemMixerProps> = ({ isPlaying }) => {
  const [stemStates, setStemStates] = useState<Record<StemId, StemState>>(
    anthemAudio.getStemStates()
  );
  const [stadiumReverb, setStadiumReverb] = useState(true);
  const [filterCutoff, setFilterCutoff] = useState(20000);

  // Sync state periodically when playing to reflect live values
  useEffect(() => {
    setStemStates(anthemAudio.getStemStates());
  }, []);

  const handleVolumeChange = (id: StemId, val: number) => {
    anthemAudio.setStemVolume(id, val);
    setStemStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], volume: val },
    }));
  };

  const handleToggleMute = (id: StemId) => {
    anthemAudio.toggleMute(id);
    setStemStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], muted: !prev[id].muted },
    }));
  };

  const handleToggleSolo = (id: StemId) => {
    anthemAudio.toggleSolo(id);
    setStemStates(anthemAudio.getStemStates());
  };

  const handleResetMix = () => {
    STEM_TRACKS.forEach((t) => {
      anthemAudio.setStemVolume(t.id, t.defaultVolume);
      if (stemStates[t.id].muted) anthemAudio.toggleMute(t.id);
      if (stemStates[t.id].soloed) anthemAudio.toggleSolo(t.id);
    });
    anthemAudio.setStadiumReverb(true);
    anthemAudio.setFilterCutoff(20000);
    setStadiumReverb(true);
    setFilterCutoff(20000);
    setStemStates(anthemAudio.getStemStates());
  };

  const getTrackIcon = (id: StemId) => {
    switch (id) {
      case 'vocals':
        return <Mic className="w-4 h-4 text-amber-400" />;
      case 'drums':
        return <Drum className="w-4 h-4 text-red-400" />;
      case 'synths':
        return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'orchestra':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Title & Top Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white font-display">
              Studio Stem Mixing Console
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Shape individual production layers of the CodeMtaani anthem in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetMix}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Studio Default</span>
          </button>
        </div>
      </div>

      {/* 4 Stems Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STEM_TRACKS.map((track: StemTrack) => {
          const state = stemStates[track.id] || { volume: 0.8, muted: false, soloed: false };
          const anySolo = Object.values(stemStates).some((s) => s.soloed);
          const isAudible = !state.muted && (!anySolo || state.soloed);

          return (
            <div
              key={track.id}
              className={`rounded-xl p-4 flex flex-col justify-between transition-all border ${
                isAudible
                  ? 'bg-slate-950/80 border-slate-800 shadow-md'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              {/* Channel Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800">
                      {getTrackIcon(track.id)}
                    </div>
                    <span className="font-semibold text-sm text-white">
                      {track.name}
                    </span>
                  </div>

                  {/* Level indicator */}
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {Math.round(state.volume * 100)}%
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-1 font-medium">{track.role}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {track.description}
                </p>
              </div>

              {/* Fader & Controls */}
              <div>
                {/* Volume Slider */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span>-inf dB</span>
                    <span>0 dB</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={state.volume}
                    onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
                    aria-label={`${track.name} volume`}
                  />
                </div>

                {/* Solo / Mute Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleToggleSolo(track.id)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all border ${
                      state.soloed
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                    }`}
                  >
                    SOLO
                  </button>
                  <button
                    onClick={() => handleToggleMute(track.id)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all border flex items-center justify-center gap-1 ${
                      state.muted
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                    }`}
                  >
                    {state.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>MUTE</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Master Processing Rack */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Master Audio Rack</h4>
            <p className="text-xs text-slate-400">
              Stadium spatial acoustics, filter sweeps, and radio-ready limiting.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
          {/* Stadium Reverb Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = !stadiumReverb;
                setStadiumReverb(next);
                anthemAudio.setStadiumReverb(next);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                stadiumReverb
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Stadium Echo & Reverb: {stadiumReverb ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Master Lowpass Filter */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <span className="text-xs text-slate-400 whitespace-nowrap">Filter Cutoff:</span>
            <input
              type="range"
              min="500"
              max="20000"
              step="100"
              value={filterCutoff}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFilterCutoff(val);
                anthemAudio.setFilterCutoff(val);
              }}
              className="w-28 h-2 bg-slate-800 rounded-lg cursor-pointer"
              aria-label="Master filter cutoff"
            />
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {filterCutoff >= 1000 ? `${(filterCutoff / 1000).toFixed(1)}k` : `${filterCutoff}`}Hz
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
