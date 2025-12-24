'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Share2
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  club: string;
  x: number; // percentage
  y: number; // percentage
  role?: 'C' | 'V';
  colors: [string, string]; // Left and right colors for the jersey circle
  isSub?: boolean;
  subLabel?: string;
  points?: string;
}

const PitchPreview: React.FC = () => {
  // Initial players matching the screenshot's lineup
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: "Raya", club: "WOL", x: 50, y: 15, colors: ["#ef4444", "#ef4444"] },
    { id: '2', name: "Cash", club: "WHU", x: 30, y: 35, colors: ["#7c2d12", "#7dd3fc"] },
    { id: '3', name: "Guéhi", club: "MCI", x: 50, y: 35, colors: ["#ef4444", "#3b82f6"] },
    { id: '4', name: "Virgil", club: "6", x: 70, y: 35, colors: ["#ef4444", "#ef4444"] },
    { id: '5', name: "Eze", club: "WOL", x: 20, y: 55, colors: ["#ef4444", "#ef4444"] },
    { id: '6', name: "Wilson", club: "BUR", x: 40, y: 55, colors: ["#ffffff", "#000000"] },
    { id: '7', name: "Semenyo", club: "MUN", x: 60, y: 55, colors: ["#450a0a", "#000000"] },
    { id: '8', name: "Bruno G.", club: "SUN", x: 80, y: 55, colors: ["#ffffff", "#000000"] },
    { id: '9', name: "Haaland", club: "CRY", x: 30, y: 75, role: 'V', colors: ["#93c5fd", "#93c5fd"] },
    { id: '10', name: "Ekitiké", club: "39", x: 50, y: 75, role: 'C', colors: ["#ef4444", "#ef4444"] },
    { id: '11', name: "Thiago", club: "LEE", x: 70, y: 75, colors: ["#ffffff", "#ef4444"] },
  ]);

  const [subs] = useState<Player[]>([
    { id: 's1', name: "Dúbravka", club: "FUL", x: 0, y: 0, isSub: true, subLabel: "GKP", colors: ["#93c5fd", "#450a0a"] },
    { id: 's2', name: "Van de Ven", club: "NFO", x: 0, y: 0, isSub: true, subLabel: "1.DEF", colors: ["#ffffff", "#ffffff"] },
    { id: 's3', name: "Mukiele", club: "NEW", x: 0, y: 0, isSub: true, subLabel: "2.DEF", colors: ["#ef4444", "#ffffff"] },
    { id: 's4', name: "Enzo", club: "3", x: 0, y: 0, isSub: true, subLabel: "3.MID", colors: ["#1d4ed8", "#1d4ed8"] },
  ]);

  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const pitchRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (id: string) => setActivePlayerId(id);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activePlayerId || !pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPlayers(prev => prev.map(p => 
      p.id === activePlayerId ? { ...p, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) } : p
    ));
  };

  const handlePointerUp = () => setActivePlayerUp(null);

  const setActivePlayerUp = (val: null) => setActivePlayerId(val);

  const renderPlayer = (p: Player) => (
    <div 
      key={p.id}
      onPointerDown={() => !p.isSub && handlePointerDown(p.id)}
      className={`${p.isSub ? 'relative' : 'absolute -translate-x-1/2 -translate-y-1/2'} flex flex-col items-center select-none ${activePlayerId === p.id ? 'z-50 cursor-grabbing' : 'z-10 cursor-grab'}`}
      style={!p.isSub ? { left: `${p.x}%`, top: `${p.y}%` } : {}}
    >
      <div className="relative mb-1">
        {/* Jersey Circle - Split Design */}
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden flex shadow-sm border border-black/5">
          <div style={{ backgroundColor: p.colors[0] }} className="flex-1"></div>
          <div style={{ backgroundColor: p.colors[1] }} className="flex-1"></div>
        </div>

        {/* Badge (C or V) */}
        {p.role && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ffee00] text-black font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {p.role}
          </div>
        )}
      </div>

      {/* Name and Pill Section */}
      <div className="flex flex-col items-center">
        <span className="text-black text-[10px] md:text-[11px] font-black leading-none mb-1 whitespace-nowrap drop-shadow-sm">{p.name}</span>
        <div className="bg-white rounded-full px-3 py-0.5 shadow-sm border border-zinc-100 flex items-center justify-center min-w-[50px]">
          <span className="text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-tight">{p.club}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden text-black border border-zinc-200">
      {/* Dynamic Header */}
      <div className="p-6 relative flex flex-col items-center bg-white border-b border-zinc-100">
        <button className="absolute right-6 top-6 p-2 text-zinc-400 hover:bg-zinc-50 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-4 mt-2">
          <h2 className="text-xl font-black mb-0.5 tracking-tight text-zinc-900">Stick to the plan FC</h2>
          <p className="text-zinc-400 text-sm font-medium">Adil Mahmood</p>
        </div>

        <div className="bg-[#ffee00] px-10 py-2.5 rounded-full text-black font-black text-xs uppercase tracking-[0.1em] shadow-sm mb-8">
          Triple captain
        </div>

        <div className="text-center">
          <span className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.2em] mb-1 block">GW 16</span>
          <div className="text-[72px] font-black leading-none tracking-tighter text-zinc-900">45</div>
        </div>
      </div>

      {/* FPL Style Pitch */}
      <div 
        ref={pitchRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative aspect-[3/4] bg-[#a7d9b9] overflow-hidden touch-none"
      >
        {/* Subtle Pitch Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Halfway / Penalty area boxes */}
          <div className="absolute inset-x-8 top-0 h-28 border-x border-b border-white/40"></div>
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/40"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-white/40"></div>
        </div>

        {/* Toolbar Overlay */}
        <div className="absolute top-6 left-6 flex flex-col gap-3 z-40">
           <button className="p-2.5 bg-white/95 backdrop-blur rounded-full shadow-lg hover:bg-white active:scale-90 transition-all">
             <Download className="w-4 h-4 text-zinc-600" />
           </button>
           <button className="p-2.5 bg-white/95 backdrop-blur rounded-full shadow-lg hover:bg-white active:scale-90 transition-all">
             <Share2 className="w-4 h-4 text-zinc-600" />
           </button>
        </div>

        {/* Render Starting XI */}
        {players.map(p => renderPlayer(p))}
      </div>

      {/* Bench Section */}
      <div className="bg-[#f3f4f6] p-6 pb-12 border-t border-zinc-200">
        <div className="flex justify-between items-start max-w-sm mx-auto px-2">
          {subs.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{s.subLabel}</span>
              <div className="scale-90 opacity-90">
                {renderPlayer(s)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="p-4 bg-white border-t border-zinc-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] flex justify-center">
        <button className="w-full max-w-xs py-4 bg-zinc-900 text-white font-black rounded-2xl text-sm tracking-widest shadow-xl hover:bg-black transition-all active:scale-95 uppercase">
          Confirm Lineup
        </button>
      </div>
    </div>
  );
};

export default PitchPreview;
