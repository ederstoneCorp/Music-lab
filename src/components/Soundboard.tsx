import React, { useState } from 'react';
import { SOUNDBOARD_DROPS, SoundboardDrop } from '../utils/anthemData';
import { anthemAudio } from '../utils/audioEngine';
import { Megaphone, Zap } from 'lucide-react';

export const Soundboard: React.FC = () => {
  const [activeDrop, setActiveDrop] = useState<string | null>(null);

  const handleTrigger = (drop: SoundboardDrop) => {
    setActiveDrop(drop.id);
    anthemAudio.playSoundboardDrop(drop.id, drop.frequencyBase);
    setTimeout(() => {
      setActiveDrop(null);
    }, 600);
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Stadium Soundboard Drops
          </h3>
        </div>
        <span className="text-[11px] text-slate-500">
          Instant audio triggers for rallies & hackathons
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {SOUNDBOARD_DROPS.map((drop) => {
          const isTriggered = activeDrop === drop.id;

          return (
            <button
              key={drop.id}
              onClick={() => handleTrigger(drop)}
              className={`p-3 rounded-lg text-left transition-all border flex flex-col justify-between active:scale-95 cursor-pointer ${
                isTriggered
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Zap
                  className={`w-3 h-3 ${isTriggered ? 'text-slate-950' : 'text-amber-400'}`}
                />
                <span
                  className={`text-[9px] uppercase font-mono tracking-wider ${
                    isTriggered ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {drop.category}
                </span>
              </div>
              <div
                className={`text-xs font-bold leading-tight ${
                  isTriggered ? 'text-slate-950' : 'text-white'
                }`}
              >
                {drop.label}
              </div>
              <div
                className={`text-[10px] mt-1 truncate ${
                  isTriggered ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {drop.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
