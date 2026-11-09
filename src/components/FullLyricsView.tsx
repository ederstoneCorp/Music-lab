import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Music2 } from 'lucide-react';

export const FullLyricsView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const fullText = `# CODEMTAANI – THINK. BUILD. TRANSFORM.
Official Community Anthem

[Intro – Spoken, cinematic]
From an idea to a vision,
From a vision to creation.
The future isn't somewhere we wait for.
It's something we build.
CodeMtaani!

[Verse 1]
We came with a dream and a reason to rise,
A world full of problems, we see possibilities.
From the streets to the screens, let the innovation flow,
Every line of code takes us where we want to go.

Different minds, one ambition,
Turning challenges into innovation.
No limits to the things we can create,
We are the generation shaping tomorrow's fate.

[Pre-Chorus]
We think beyond the ordinary,
Build what others only imagine.
Every setback, every challenge,
Is another chance to make it happen.

[Chorus – Big, catchy, anthemic]
Think! Build! Transform!
We're creating something more.
CodeMtaani, hear the call,
Building futures for us all.

Think! Build! Transform!
Let innovation lead the way.
From Africa to the world,
We're the change of a new day!

[Verse 2]
Ideas becoming reality,
Technology driving possibility.
Young innovators, fearless minds,
Breaking barriers, redefining times.

We don't just follow, we create the way,
Building solutions for a better day.
One community, one purpose, one dream,
Together we're stronger than we've ever been.

[Pre-Chorus]
We think beyond the ordinary,
Build what others only imagine.
Every setback, every challenge,
Is another chance to make it happen.

[Chorus – Repeat, stronger vocals]
Think! Build! Transform!
We're creating something more.
CodeMtaani, hear the call,
Building futures for us all.

Think! Build! Transform!
Let innovation lead the way.
From Africa to the world,
We're the change of a new day!

[Bridge – African choir / emotional build-up]
One vision! (One future!)
One mission! (Together!)
Through innovation,
We rise forever.

From the ground up,
We make it happen.
The future is ours,
And we're not backing down!

[Final Chorus – Explosive, layered vocals]
Think! Build! Transform!
Let the whole world know our name.
CodeMtaani, we're moving forward,
Innovation is our flame.

Think! Build! Transform!
Every dream can find its way.
From Africa to the world,
We're building a brighter day!

[Outro – Spoken with echo]
This is more than technology.
This is a movement.
This is a generation.
CodeMtaani.

Think. Build. Transform.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CodeMtaani_Anthem_Think_Build_Transform_Lyrics.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-display">
              CODEMTAANI – THINK. BUILD. TRANSFORM.
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Official Afropop Anthem Score & Musical Arrangement Guide
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Lyrics'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Score (.txt)</span>
          </button>
        </div>
      </div>

      {/* Production Metadata Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-8 text-xs">
        <div>
          <span className="text-slate-500 block">Tempo & Key</span>
          <span className="font-semibold text-white">112 BPM · F# Minor</span>
        </div>
        <div>
          <span className="text-slate-500 block">Genre Blend</span>
          <span className="font-semibold text-white">Afro-Fusion / Afropop Anthem</span>
        </div>
        <div>
          <span className="text-slate-500 block">Vocal Delivery</span>
          <span className="font-semibold text-white">Dual Harmonies & African Choir</span>
        </div>
        <div>
          <span className="text-slate-500 block">Core Identity</span>
          <span className="font-semibold text-amber-400">Think. Build. Transform.</span>
        </div>
      </div>

      {/* Structured Lyrics Sections */}
      <div className="space-y-8 max-w-3xl mx-auto text-slate-200">
        {/* Intro */}
        <section className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              [Intro – Spoken, cinematic]
            </span>
          </div>
          <p className="leading-relaxed text-sm text-slate-300 italic">
            From an idea to a vision,<br />
            From a vision to creation.<br />
            The future isn't somewhere we wait for.<br />
            It's something we build.<br />
            <strong className="text-amber-400 font-bold not-italic">CodeMtaani!</strong>
          </p>
        </section>

        {/* Verse 1 */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              [Verse 1]
            </span>
            <span className="text-[11px] text-slate-500">· Male lead with female counter-melody</span>
          </div>
          <p className="leading-relaxed text-sm text-slate-200">
            We came with a dream and a reason to rise,<br />
            A world full of problems, we see possibilities.<br />
            From the streets to the screens, let the innovation flow,<br />
            Every line of code takes us where we want to go.<br /><br />
            Different minds, one ambition,<br />
            Turning challenges into innovation.<br />
            No limits to the things we can create,<br />
            We are the generation shaping tomorrow's fate.
          </p>
        </section>

        {/* Pre-Chorus */}
        <section className="border-l-2 border-amber-500/40 pl-4 py-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              [Pre-Chorus]
            </span>
            <span className="text-[11px] text-slate-500">· Rising energy and arpeggiators</span>
          </div>
          <p className="leading-relaxed text-sm text-slate-200">
            We think beyond the ordinary,<br />
            Build what others only imagine.<br />
            Every setback, every challenge,<br />
            Is another chance to make it happen.
          </p>
        </section>

        {/* Chorus 1 */}
        <section className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-300">
              [Chorus – Big, catchy, anthemic]
            </span>
          </div>
          <p className="leading-relaxed text-base font-medium text-white">
            <strong className="text-amber-400 font-bold">Think! Build! Transform!</strong><br />
            We're creating something more.<br />
            CodeMtaani, hear the call,<br />
            Building futures for us all.<br /><br />
            <strong className="text-amber-400 font-bold">Think! Build! Transform!</strong><br />
            Let innovation lead the way.<br />
            From Africa to the world,<br />
            We're the change of a new day!
          </p>
        </section>

        {/* Verse 2 */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              [Verse 2]
            </span>
            <span className="text-[11px] text-slate-500">· Female lead with male callouts</span>
          </div>
          <p className="leading-relaxed text-sm text-slate-200">
            Ideas becoming reality,<br />
            Technology driving possibility.<br />
            Young innovators, fearless minds,<br />
            Breaking barriers, redefining times.<br /><br />
            We don't just follow, we create the way,<br />
            Building solutions for a better day.<br />
            One community, one purpose, one dream,<br />
            Together we're stronger than we've ever been.
          </p>
        </section>

        {/* Pre-Chorus 2 */}
        <section className="border-l-2 border-amber-500/40 pl-4 py-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              [Pre-Chorus]
            </span>
          </div>
          <p className="leading-relaxed text-sm text-slate-200">
            We think beyond the ordinary,<br />
            Build what others only imagine.<br />
            Every setback, every challenge,<br />
            Is another chance to make it happen.
          </p>
        </section>

        {/* Chorus 2 */}
        <section className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-300">
              [Chorus – Repeat, stronger vocals]
            </span>
          </div>
          <p className="leading-relaxed text-base font-medium text-white">
            <strong className="text-amber-400 font-bold">Think! Build! Transform!</strong><br />
            We're creating something more.<br />
            CodeMtaani, hear the call,<br />
            Building futures for us all.<br /><br />
            <strong className="text-amber-400 font-bold">Think! Build! Transform!</strong><br />
            Let innovation lead the way.<br />
            From Africa to the world,<br />
            We're the change of a new day!
          </p>
        </section>

        {/* Bridge */}
        <section className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-purple-300">
              [Bridge – African choir / emotional build-up]
            </span>
          </div>
          <p className="leading-relaxed text-base text-slate-100">
            One vision! <span className="text-purple-300 italic">(One future!)</span><br />
            One mission! <span className="text-purple-300 italic">(Together!)</span><br />
            Through innovation,<br />
            We rise forever.<br /><br />
            From the ground up,<br />
            We make it happen.<br />
            The future is ours,<br />
            And we're not backing down!
          </p>
        </section>

        {/* Final Chorus */}
        <section className="p-6 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-400/50 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-300">
              [Final Chorus – Explosive, layered vocals]
            </span>
          </div>
          <p className="leading-relaxed text-lg font-bold text-white">
            <span className="text-amber-400">Think! Build! Transform!</span><br />
            Let the whole world know our name.<br />
            CodeMtaani, we're moving forward,<br />
            Innovation is our flame.<br /><br />
            <span className="text-amber-400">Think! Build! Transform!</span><br />
            Every dream can find its way.<br />
            From Africa to the world,<br />
            We're building a brighter day!
          </p>
        </section>

        {/* Outro */}
        <section className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              [Outro – Spoken with echo]
            </span>
          </div>
          <p className="leading-relaxed text-sm text-slate-300 italic">
            This is more than technology.<br />
            This is a movement.<br />
            This is a generation.<br />
            CodeMtaani.<br /><br />
            <strong className="text-white font-display text-base uppercase tracking-widest not-italic block">
              Think. Build. Transform.
            </strong>
          </p>
        </section>
      </div>
    </div>
  );
};
