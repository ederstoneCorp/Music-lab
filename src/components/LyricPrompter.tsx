import React, { useEffect, useRef } from 'react';
import { ANTHEM_SECTIONS, LyricLine, SongSection, formatTime } from '../utils/anthemData';
import { Mic2, Users, Volume2 } from 'lucide-react';

interface LyricPrompterProps {
  currentTime: number;
  onSeek: (seconds: number) => void;
  isPlaying: boolean;
}

export const LyricPrompter: React.FC<LyricPrompterProps> = ({
  currentTime,
  onSeek,
  isPlaying,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active lyric
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentTime]);

  const getSpeakerColor = (speaker: LyricLine['speaker']) => {
    switch (speaker) {
      case 'Narrator':
        return 'text-amber-300';
      case 'Male Lead':
        return 'text-cyan-400';
      case 'Female Lead':
        return 'text-emerald-400';
      case 'African Choir':
        return 'text-purple-400';
      case 'Full Ensemble':
      case 'Lead Duet':
      default:
        return 'text-amber-400 font-semibold';
    }
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col h-[420px] shadow-lg">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Mic2 className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-white">Live Synchronized Score</span>
          <span aria-hidden="true">·</span>
          <span>Click line to seek</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Current Time:</span>
          <span className="font-mono text-amber-400 tabular-nums font-semibold">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-2 space-y-6 scroll-smooth"
      >
        {ANTHEM_SECTIONS.map((section: SongSection) => {
          const isSectionActive = currentTime >= section.startTime && currentTime < section.endTime;

          return (
            <div
              key={section.id}
              className={`transition-all rounded-lg p-2.5 ${
                isSectionActive
                  ? 'bg-amber-500/10 border border-amber-500/30'
                  : 'bg-transparent border border-transparent'
              }`}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => onSeek(section.startTime)}
                  className="group flex items-center gap-2 text-left"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 group-hover:underline">
                    {section.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    [{formatTime(section.startTime)}]
                  </span>
                </button>
                <span className="text-[11px] text-slate-400 italic hidden sm:inline">
                  {section.vocalArrangement}
                </span>
              </div>

              {/* Lines in Section */}
              <div className="space-y-2">
                {section.lines.map((line) => {
                  const isLineActive =
                    currentTime >= line.time && currentTime < line.time + line.duration;

                  return (
                    <div
                      key={line.id}
                      ref={isLineActive ? activeLineRef : null}
                      onClick={() => onSeek(line.time)}
                      className={`cursor-pointer group flex items-start gap-3 p-2 rounded-md transition-all ${
                        isLineActive
                          ? 'bg-slate-800/90 text-white shadow-sm ring-1 ring-amber-400/50'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-slate-500 tabular-nums pt-1 w-8 shrink-0">
                        {formatTime(line.time)}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[11px] font-medium ${getSpeakerColor(line.speaker)}`}>
                            {line.speaker}
                          </span>
                          {line.subtext && (
                            <span className="text-[10px] text-slate-500 italic">
                              ({line.subtext})
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm leading-relaxed ${
                            isLineActive
                              ? 'text-white font-medium'
                              : 'text-slate-300 group-hover:text-slate-100'
                          }`}
                        >
                          {line.text}
                        </p>
                      </div>

                      {isLineActive && isPlaying && (
                        <div className="shrink-0 flex items-center gap-1 pt-1">
                          <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
                          <span className="w-1 h-4 bg-amber-300 animate-pulse delay-75 rounded-full" />
                          <span className="w-1 h-2 bg-amber-500 animate-pulse delay-150 rounded-full" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
