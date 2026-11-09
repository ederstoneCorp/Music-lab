import React, { useEffect, useRef, useState } from 'react';
import { anthemAudio } from '../utils/audioEngine';
import { BarChart3, Disc3 } from 'lucide-react';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visualMode, setVisualMode] = useState<'spectrum' | 'mandala'>('spectrum');
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(128);

    const render = () => {
      anthemAudio.getAnalyserData(dataArray);

      // Handle canvas resolution
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle glow
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      if (visualMode === 'spectrum') {
        // Draw 64 Frequency Bars
        const barCount = 64;
        const barWidth = width / barCount - 1.5;
        let x = 0;

        for (let i = 0; i < barCount; i++) {
          const val = isPlaying ? dataArray[i * 2] : Math.sin(Date.now() * 0.003 + i * 0.2) * 8 + 12;
          const barHeight = Math.max(3, (val / 255) * (height - 20));

          // Gradient: Warm Amber to Electric Cyan
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, '#f59e0b'); // amber-500
          gradient.addColorStop(0.5, '#fbbf24'); // amber-400
          gradient.addColorStop(1, '#06b6d4'); // cyan-500

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, Math.max(2, barWidth), barHeight, [2, 2, 0, 0]);
          ctx.fill();

          // Peak dot
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(x, Math.max(0, height - barHeight - 3), Math.max(2, barWidth), 1.5);

          x += barWidth + 1.5;
        }
      } else {
        // Draw Afro-Futuristic Mandala Radar
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(centerX, centerY) - 20;

        // Calculate average energy
        let sum = 0;
        for (let i = 0; i < 32; i++) {
          sum += dataArray[i];
        }
        const avg = isPlaying ? sum / 32 : 25;
        const pulse = (avg / 255) * 18;

        const time = Date.now() * 0.0015;

        // Concentric geometric circles
        for (let r = 20; r <= maxRadius; r += 28) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, r + pulse * (r / maxRadius), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.15 + (r / maxRadius) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Diamond fractals & rays
        const spokes = 16;
        for (let i = 0; i < spokes; i++) {
          const angle = (i * Math.PI * 2) / spokes + time * 0.2;
          const binVal = isPlaying ? dataArray[(i * 4) % 64] / 255 : 0.2;
          const rayLength = 30 + binVal * (maxRadius - 30);

          const x1 = centerX + Math.cos(angle) * 20;
          const y1 = centerY + Math.sin(angle) * 20;
          const x2 = centerX + Math.cos(angle) * rayLength;
          const y2 = centerY + Math.sin(angle) * rayLength;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = i % 2 === 0 ? '#f59e0b' : '#06b6d4';
          ctx.lineWidth = i % 2 === 0 ? 2 : 1;
          ctx.stroke();

          // Outer vertex diamond
          if (binVal > 0.3) {
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(x2, y2, 2.5 + binVal * 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Center core
        ctx.beginPath();
        ctx.arc(centerX, centerY, 16 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, 8 + pulse * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#030712';
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, visualMode]);

  return (
    <div className="relative w-full rounded-xl bg-slate-900/60 border border-slate-800 p-3 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-slate-300">Live Audio Visualizer</span>
          <span aria-hidden="true">·</span>
          <span>112 BPM Afrobeats Master</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">64 Bands</span>
        </div>

        {/* Mode switch */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setVisualMode('spectrum')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              visualMode === 'spectrum' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
            title="Frequency Spectrum View"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Spectrum</span>
          </button>
          <button
            onClick={() => setVisualMode('mandala')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              visualMode === 'mandala' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
            title="Afro-Futuristic Geometric Mandala"
          >
            <Disc3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mandala</span>
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={700}
        height={130}
        className="w-full h-32 rounded-lg block"
      />
    </div>
  );
};
