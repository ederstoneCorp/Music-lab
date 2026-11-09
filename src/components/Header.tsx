import React from 'react';
import { Play, Pause, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'anthem' | 'stems' | 'lyria' | 'lyrics' | 'story';
  setActiveTab: (tab: 'anthem' | 'stems' | 'lyria' | 'lyrics' | 'story') => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isPlaying,
  onTogglePlay,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('anthem');
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2.5 group"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            CM
          </span>
          <span className="font-display">CodeMtaani Anthem Studio</span>
        </a>

        {/* Zone 2: Navigation Links (Clean single-line text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('anthem')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'anthem' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Anthem Stage
          </button>
          <button
            onClick={() => setActiveTab('stems')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'stems' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Stem Mixer
          </button>
          <button
            onClick={() => setActiveTab('lyria')}
            className={`whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 transition-colors ${
              activeTab === 'lyria' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Lyria AI Studio
          </button>
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'lyrics' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Anthem Score
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'story' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            The Movement
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-all shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0 cursor-pointer"
            aria-label={isPlaying ? 'Pause anthem' : 'Play anthem'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Anthem</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Anthem</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-900 gap-4 text-xs font-medium text-slate-400 no-scrollbar">
        <button
          onClick={() => setActiveTab('anthem')}
          className={`whitespace-nowrap ${activeTab === 'anthem' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Stage
        </button>
        <button
          onClick={() => setActiveTab('stems')}
          className={`whitespace-nowrap ${activeTab === 'stems' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Mixer
        </button>
        <button
          onClick={() => setActiveTab('lyria')}
          className={`whitespace-nowrap flex items-center gap-1 ${activeTab === 'lyria' ? 'text-amber-400 font-semibold' : ''}`}
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          Lyria AI
        </button>
        <button
          onClick={() => setActiveTab('lyrics')}
          className={`whitespace-nowrap ${activeTab === 'lyrics' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Score
        </button>
        <button
          onClick={() => setActiveTab('story')}
          className={`whitespace-nowrap ${activeTab === 'story' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Movement
        </button>
      </div>
    </header>
  );
};
