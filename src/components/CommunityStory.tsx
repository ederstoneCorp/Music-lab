import React from 'react';
import { Compass, Cpu, Globe2, Lightbulb, Hammer, Rocket } from 'lucide-react';

export const CommunityStory: React.FC = () => {
  return (
    <div className="w-full space-y-12">
      {/* Hero Narrative Section */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div className="relative h-72 sm:h-96 w-full">
          <img
            src="/src/assets/images/hero_anthem_codemtaani_1794252600120.jpg"
            alt="Young African innovators and musicians in creative technology hub"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-2">
              <span>The CodeMtaani Movement</span>
              <span aria-hidden="true">·</span>
              <span>Nairobi to the World</span>
              <span aria-hidden="true">·</span>
              <span>Afro-Futurism & Tech</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight text-balance">
              From the Streets to the Screens
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl text-balance">
              "Mtaani" is the Swahili word for the neighbourhood, the streets, the grassroots community. CodeMtaani bridges the vibrant energy of youth culture with world-class engineering.
            </p>
          </div>
        </div>
      </div>

      {/* The Three Pillars: Think. Build. Transform. */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Core Philosophy
          </span>
          <h3 className="text-2xl font-bold text-white font-display">
            The Three Inviolable Pillars
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            The musical and cultural DNA woven into every chord, beat, and vocal harmony of the anthem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Think */}
          <div className="rounded-xl p-6 bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white font-display mb-2">
                01. Think
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                We reject conventional boundaries. We look at complex challenges in healthcare, finance, climate, and education and perceive fertile ground for radical technological invention.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-amber-400 font-medium">
              "We think beyond the ordinary, build what others only imagine."
            </div>
          </div>

          {/* Pillar 2: Build */}
          <div className="rounded-xl p-6 bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-4">
                <Hammer className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white font-display mb-2">
                02. Build
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Crafting robust, production-grade applications, distributed systems, AI architectures, and open protocols. Precision engineering anchored in relentless iteration and craft.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-cyan-400 font-medium">
              "Every line of code takes us where we want to go."
            </div>
          </div>

          {/* Pillar 3: Transform */}
          <div className="rounded-xl p-6 bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400 mb-4">
                <Rocket className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white font-display mb-2">
                03. Transform
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Elevating entire communities from consumers to world-class creators. Transforming local grassroots talent into global software architects, founders, and leaders.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-purple-400 font-medium">
              "From Africa to the world, we're the change of a new day."
            </div>
          </div>
        </div>
      </div>

      {/* Stadium Celebration & Sonic Identity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 flex flex-col justify-between p-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Sonic Architecture
            </span>
            <h4 className="text-xl font-bold text-white font-display mb-3">
              Radio-Ready Afropop Mastery
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              The CodeMtaani anthem blends contemporary Afrobeats groove (syncopated shekere, heavy 808 sub-bass, and organic talking drum accents) with atmospheric cinematic synthesizers and an uplifting African choir bridge.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Engineered with stadium-sized dynamics that transition seamlessly from a reflective cinematic spoken prologue to an explosive festival chant that unites thousands of innovators in unison.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-400">
            <div>
              <span className="text-slate-500 block">Tempo</span>
              <span className="text-white font-medium">112 BPM</span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-500 block">Studio Key</span>
              <span className="text-white font-medium">F# Minor (Triadic)</span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-500 block">Master Format</span>
              <span className="text-white font-medium">24-bit / 48kHz Radio Master</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-800 relative h-72 lg:h-auto">
          <img
            src="/src/assets/images/stadium_crowd_choir_1794252630685.jpg"
            alt="Stadium choir and thousands of African tech creators"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6">
            <p className="text-xs text-white font-medium">
              "One vision! One future! One mission! Together! Through innovation, we rise forever."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
