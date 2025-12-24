'use client';

import React, { useState, useRef, useCallback } from 'react';
import { 
  X, Download, Share2, Palette, Save, Zap, 
  Trophy, Grid3x3, Eye, Type, Building,
  CheckSquare, Square, Edit2, Edit3, Settings,
  PenTool, User
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  club: string;
  x: number;
  y: number;
  role?: 'C' | 'V';
  colors: [string, string];
  position: 'GKP' | 'DEF' | 'MID' | 'FWD';
  showName?: boolean;
  showClub?: boolean;
}

interface Formation {
  id: string;
  name: string;
  positions: [number, number][];
  description: string;
}

const PitchPreview: React.FC = () => {
  // Team State
  const [teamName, setTeamName] = useState('Stick to the plan FC');
  const [managerName, setManagerName] = useState('Adil Mahmood');
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [isEditingManagerName, setIsEditingManagerName] = useState(false);
  
  // Pitch State
  const [pitchTheme, setPitchTheme] = useState<'green' | 'blue' | 'classic' | 'dark'>('green');
  const [showGrid, setShowGrid] = useState(false);
  
  // Display Settings
  const [globalShowNames, setGlobalShowNames] = useState(true);
  const [globalShowClubs, setGlobalShowClubs] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  
  // Players State
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: "Raya", club: "WOL", x: 50, y: 15, colors: ["#ef4444", "#ef4444"], position: 'GKP', showName: true, showClub: true },
    { id: '2', name: "Cash", club: "WHU", x: 30, y: 35, colors: ["#7c2d12", "#7dd3fc"], position: 'DEF', showName: true, showClub: true },
    { id: '3', name: "Guéhi", club: "MCI", x: 50, y: 35, colors: ["#ef4444", "#3b82f6"], position: 'DEF', showName: true, showClub: true },
    { id: '4', name: "Virgil", club: "6", x: 70, y: 35, colors: ["#ef4444", "#ef4444"], position: 'DEF', showName: true, showClub: true },
    { id: '5', name: "Eze", club: "WOL", x: 20, y: 55, colors: ["#ef4444", "#ef4444"], position: 'MID', showName: true, showClub: true },
    { id: '6', name: "Wilson", club: "BUR", x: 40, y: 55, colors: ["#ffffff", "#000000"], position: 'MID', showName: true, showClub: true },
    { id: '7', name: "Semenyo", club: "MUN", x: 60, y: 55, colors: ["#450a0a", "#000000"], position: 'MID', showName: true, showClub: true },
    { id: '8', name: "Bruno G.", club: "SUN", x: 80, y: 55, colors: ["#ffffff", "#000000"], position: 'MID', showName: true, showClub: true },
    { id: '9', name: "Haaland", club: "CRY", x: 30, y: 75, role: 'V', colors: ["#93c5fd", "#93c5fd"], position: 'FWD', showName: true, showClub: true },
    { id: '10', name: "Ekitiké", club: "39", x: 50, y: 75, role: 'C', colors: ["#ef4444", "#ef4444"], position: 'FWD', showName: true, showClub: true },
    { id: '11', name: "Thiago", club: "LEE", x: 70, y: 75, colors: ["#ffffff", "#ef4444"], position: 'FWD', showName: true, showClub: true },
  ]);

  // Available Formations
  const [formations] = useState<Formation[]>([
    { id: '4-4-2', name: '4-4-2 Classic', positions: [[30,35],[50,35],[70,35],[90,35],[20,55],[40,55],[60,55],[80,55],[35,75],[65,75]], description: 'Balanced' },
    { id: '4-3-3', name: '4-3-3 Attacking', positions: [[30,35],[50,35],[70,35],[90,35],[30,55],[50,55],[70,55],[30,75],[50,75],[70,75]], description: 'Offensive' },
    { id: '3-5-2', name: '3-5-2 Wing Play', positions: [[30,35],[50,35],[70,35],[15,55],[35,55],[50,55],[65,55],[85,55],[35,75],[65,75]], description: 'Midfield Control' },
    { id: '5-3-2', name: '5-3-2 Defensive', positions: [[15,35],[30,35],[50,35],[70,35],[85,35],[30,55],[50,55],[70,55],[35,75],[65,75]], description: 'Solid Defense' },
  ]);

  const [selectedFormation, setSelectedFormation] = useState<string>('4-4-2');
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  const pitchRef = useRef<HTMLDivElement>(null);

  // Apply formation
  const applyFormation = useCallback((formationId: string) => {
    const formation = formations.find(f => f.id === formationId);
    if (!formation) return;

    const updatedPlayers = [...players];
    formation.positions.forEach((pos, index) => {
      if (updatedPlayers[index]) {
        updatedPlayers[index] = {
          ...updatedPlayers[index],
          x: pos[0],
          y: pos[1]
        };
      }
    });
    setPlayers(updatedPlayers);
    setSelectedFormation(formationId);
  }, [players, formations]);

  // Handle player movement
  const handlePointerDown = (id: string) => {
    setActivePlayerId(id);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!activePlayerId || !pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPlayers(prev => prev.map(p => 
      p.id === activePlayerId ? { 
        ...p, 
        x: Math.max(5, Math.min(95, x)), 
        y: Math.max(5, Math.min(95, y)) 
      } : p
    ));
  }, [activePlayerId]);

  const handlePointerUp = () => {
    setActivePlayerId(null);
  };

  // Toggle global display settings
  const toggleGlobalNames = () => {
    const newState = !globalShowNames;
    setGlobalShowNames(newState);
    setPlayers(prev => prev.map(p => ({ ...p, showName: newState })));
  };

  const toggleGlobalClubs = () => {
    const newState = !globalShowClubs;
    setGlobalShowClubs(newState);
    setPlayers(prev => prev.map(p => ({ ...p, showClub: newState })));
  };

  // Update player name or club
  const updatePlayerName = (playerId: string, newName: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, name: newName } : p
    ));
  };

  const updatePlayerClub = (playerId: string, newClub: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, club: newClub } : p
    ));
  };

  // Swap players
  const swapPlayers = (player1Id: string, player2Id: string) => {
    setPlayers(prev => {
      const player1 = prev.find(p => p.id === player1Id);
      const player2 = prev.find(p => p.id === player2Id);
      
      if (!player1 || !player2) return prev;
      
      return prev.map(p => {
        if (p.id === player1Id) return { ...player2, x: player1.x, y: player1.y };
        if (p.id === player2Id) return { ...player1, x: player2.x, y: player2.y };
        return p;
      });
    });
  };

  // Customize player jersey
  const customizeJersey = (playerId: string, colors: [string, string]) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, colors } : p
    ));
  };

  // Set player role
  const setPlayerRole = (playerId: string, role: 'C' | 'V' | undefined) => {
    setPlayers(prev => prev.map(p => 
      p.role === role ? { ...p, role: undefined } : 
      p.id === playerId ? { ...p, role } : 
      p
    ));
  };

  // Render player component
  const renderPlayer = (p: Player) => {
    const shouldShowName = p.showName !== undefined ? p.showName : globalShowNames;
    const shouldShowClub = p.showClub !== undefined ? p.showClub : globalShowClubs;

    return (
      <div 
        key={p.id}
        onPointerDown={() => handlePointerDown(p.id)}
        className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none group
          ${activePlayerId === p.id ? 'z-50 cursor-grabbing' : 'z-10 cursor-grab'}`}
        style={{ left: `${p.x}%`, top: `${p.y}%` }}
      >
        <div className="relative mb-1">
          {/* Jersey Circle */}
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex shadow-xl border-2 border-white/30 group-hover:scale-110 transition-transform duration-200">
            <div style={{ backgroundColor: p.colors[0] }} className="flex-1"></div>
            <div style={{ backgroundColor: p.colors[1] }} className="flex-1"></div>
            
            {/* Position Badge */}
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white/95 text-black text-[9px] font-black rounded-full flex items-center justify-center border border-zinc-300 shadow-md">
              {p.position}
            </div>
          </div>

          {/* Captain/Vice Badge */}
          {p.role && (
            <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center border-3 border-white shadow-lg
              ${p.role === 'C' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
              <span className="text-white text-sm font-black drop-shadow-sm">{p.role}</span>
            </div>
          )}
        </div>

        {/* Name and Club */}
        <div className="flex flex-col items-center gap-1">
          {/* Player Name - Editable */}
          {shouldShowName ? (
            editingPlayer === p.id ? (
              <div className="relative">
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => updatePlayerName(p.id, e.target.value)}
                  onBlur={() => setEditingPlayer(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingPlayer(null)}
                  className="text-black text-[11px] md:text-[12px] font-black leading-none bg-white/90 backdrop-blur-sm border-2 border-blue-400 rounded-lg px-2 py-1 text-center min-w-[60px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                  autoFocus
                  maxLength={15}
                />
                <PenTool className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-pulse" />
              </div>
            ) : (
              <div className="relative group/name">
                <span 
                  onClick={() => setEditingPlayer(p.id)}
                  className="text-black text-[11px] md:text-[12px] font-black leading-none whitespace-nowrap drop-shadow-md hover:text-blue-600 cursor-pointer transition-colors bg-white/70 backdrop-blur-sm px-3 py-1 rounded-lg"
                  title="Click to edit name"
                >
                  {p.name}
                </span>
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/name:opacity-100 transition-opacity">
                  <Edit2 className="w-3 h-3 text-blue-500" />
                </div>
              </div>
            )
          ) : null}

          {/* Club Badge - Editable */}
          {shouldShowClub ? (
            editingPlayer === `${p.id}-club` ? (
              <div className="relative">
                <input
                  type="text"
                  value={p.club}
                  onChange={(e) => updatePlayerClub(p.id, e.target.value)}
                  onBlur={() => setEditingPlayer(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingPlayer(null)}
                  className="text-zinc-700 text-[10px] md:text-[11px] font-bold uppercase tracking-tight bg-white/90 backdrop-blur-sm border-2 border-blue-400 rounded-full px-3 py-1.5 text-center min-w-[60px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                  autoFocus
                  maxLength={10}
                />
                <PenTool className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-pulse" />
              </div>
            ) : (
              <div className="relative group/club">
                <div 
                  onClick={() => setEditingPlayer(`${p.id}-club`)}
                  className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-zinc-200 flex items-center justify-center min-w-[60px] group-hover:shadow-xl transition-all duration-200 hover:border-blue-300 hover:bg-white cursor-pointer"
                  title="Click to edit club"
                >
                  <span className="text-zinc-700 text-[10px] md:text-[11px] font-bold uppercase tracking-tight hover:text-blue-600 transition-colors">
                    {p.club}
                  </span>
                </div>
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/club:opacity-100 transition-opacity">
                  <Edit3 className="w-3 h-3 text-blue-500" />
                </div>
              </div>
            )
          ) : null}
        </div>

        {/* Player Actions (on hover) */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
          <button 
            onClick={() => setPlayerRole(p.id, p.role === 'C' ? undefined : 'C')}
            className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl hover:scale-110"
            title="Make Captain"
          >
            <Trophy className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setPlayerRole(p.id, p.role === 'V' ? undefined : 'V')}
            className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-110"
            title="Make Vice"
          >
            <Type className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              const randomColors: [string, string] = [
                `#${Math.floor(Math.random()*16777215).toString(16)}`,
                `#${Math.floor(Math.random()*16777215).toString(16)}`
              ];
              customizeJersey(p.id, randomColors);
            }}
            className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-110"
            title="Random Jersey"
          >
            <Palette className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Pitch themes
  const pitchThemes = {
    green: 'bg-gradient-to-b from-[#a7d9b9] to-[#8bc9a6]',
    blue: 'bg-gradient-to-b from-[#93c5fd] to-[#60a5fa]',
    classic: 'bg-gradient-to-b from-[#d4d4d4] to-[#a3a3a3]',
    dark: 'bg-gradient-to-b from-[#1f2937] to-[#111827]'
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-white to-zinc-50 rounded-[40px] shadow-2xl overflow-hidden text-black border border-zinc-200">
      {/* Header with Controls */}
      <div className="p-8 relative flex flex-col items-center bg-white border-b border-zinc-100">
        {/* Top Right Controls */}
        <div className="absolute right-8 top-8 flex items-center gap-3">
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className="p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors shadow-sm hover:shadow-md"
            title="Toggle Grid"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button className="p-3 text-zinc-400 hover:bg-zinc-50 rounded-full transition-colors shadow-sm hover:shadow-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Left Settings Icon */}
        <div className="absolute left-8 top-8">
          <Settings className="w-6 h-6 text-zinc-400" />
        </div>

        {/* Team Header - Manager name BELOW team name */}
        <div className="text-center max-w-xl">
          {/* Team Name */}
          {isEditingTeamName ? (
            <div className="relative mb-2">
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                onBlur={() => setIsEditingTeamName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTeamName(false)}
                className="text-4xl font-black text-center bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 pb-2 w-full"
                autoFocus
                maxLength={40}
              />
              <PenTool className="absolute -right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 animate-pulse" />
            </div>
          ) : (
            <h2 
              onClick={() => setIsEditingTeamName(true)}
              className="text-4xl font-black mb-2 tracking-tight text-zinc-900 hover:text-blue-700 cursor-pointer transition-colors group relative inline-block"
            >
              {teamName}
              <Edit2 className="absolute -right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
          )}

          {/* Manager Name - Now BELOW team name */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <User className="w-5 h-5 text-zinc-400" />
            {isEditingManagerName ? (
              <div className="relative">
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  onBlur={() => setIsEditingManagerName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingManagerName(false)}
                  className="text-xl text-center bg-transparent border-b border-blue-400 focus:outline-none focus:border-blue-600 pb-1 w-48"
                  autoFocus
                  maxLength={30}
                />
                <PenTool className="absolute -right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-pulse" />
              </div>
            ) : (
              <p 
                onClick={() => setIsEditingManagerName(true)}
                className="text-zinc-600 text-xl font-medium hover:text-blue-600 cursor-pointer transition-colors group relative"
              >
                {managerName}
                <Edit3 className="absolute -right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            )}
          </div>

          {/* Edit Hint */}
          <div className="mt-6">
            <span className="text-sm text-zinc-400 font-medium">
              Click team name or manager to edit
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Main Pitch Area */}
        <div className="flex-1 p-8">
          {/* Formation Selector */}
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            {formations.map(f => (
              <button
                key={f.id}
                onClick={() => applyFormation(f.id)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg ${selectedFormation === f.id ? 'bg-gradient-to-r from-zinc-900 to-black text-white shadow-lg scale-105' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
              >
                {f.id}
              </button>
            ))}
          </div>

          {/* FPL Style Pitch */}
          <div 
            ref={pitchRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`relative aspect-[3/4] ${pitchThemes[pitchTheme]} overflow-hidden touch-none rounded-3xl shadow-2xl border-8 border-white/60`}
          >
            {/* Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 10 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="absolute left-0 right-0 top-1/4 h-px bg-white/20" style={{ top: `${25 + i * 5}%` }} />
                    <div className="absolute top-0 bottom-0 left-1/4 w-px bg-white/20" style={{ left: `${25 + i * 5}%` }} />
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Pitch Lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border-3 border-white/50 rounded-2xl"></div>
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/50"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-white/50"></div>
              <div className="absolute inset-x-10 top-6 h-24 border-x-2 border-b-2 border-white/50 rounded-b-xl"></div>
              <div className="absolute inset-x-10 bottom-6 h-24 border-x-2 border-t-2 border-white/50 rounded-t-xl"></div>
            </div>

            {/* Toolbar Overlay */}
            <div className="absolute top-8 left-8 flex flex-col gap-4 z-40">
              <button className="p-3 bg-white/95 backdrop-blur rounded-full shadow-xl hover:bg-white active:scale-90 transition-all duration-200 hover:shadow-2xl">
                <Download className="w-5 h-5 text-zinc-600" />
              </button>
              <button className="p-3 bg-white/95 backdrop-blur rounded-full shadow-xl hover:bg-white active:scale-90 transition-all duration-200 hover:shadow-2xl">
                <Share2 className="w-5 h-5 text-zinc-600" />
              </button>
              <button className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl active:scale-90 transition-all duration-200">
                <Save className="w-5 h-5" />
              </button>
            </div>

            {/* Pitch Theme Selector */}
            <div className="absolute top-8 right-8 flex flex-col gap-3 z-40 bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-xl">
              <div className="text-xs font-bold text-zinc-600 mb-1">Pitch Theme</div>
              {Object.entries(pitchThemes).map(([theme, _]) => (
                <button
                  key={theme}
                  onClick={() => setPitchTheme(theme as any)}
                  className={`w-10 h-10 rounded-full border-3 transition-all ${pitchTheme === theme ? 'border-white shadow-lg scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ 
                    background: theme === 'green' ? '#a7d9b9' : 
                               theme === 'blue' ? '#93c5fd' : 
                               theme === 'classic' ? '#d4d4d4' : '#1f2937' 
                  }}
                  title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                />
              ))}
            </div>

            {/* Render Starting XI */}
            {players.map(p => renderPlayer(p))}

            {/* Position Labels */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-12 text-white/80 text-sm font-black backdrop-blur-sm bg-black/20 px-6 py-2 rounded-full">
              <span>DEF</span>
              <span>MID</span>
              <span>ATT</span>
            </div>
          </div>
        </div>

        {/* Side Panel - Display Settings */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-zinc-200 bg-white p-8">
          {/* Display Controls */}
          <div className="mb-8">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-zinc-900">
              <Eye className="w-6 h-6" />
              Display Settings
            </h3>
            
            <div className="space-y-4">
              {/* Player Names Toggle */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-zinc-50 to-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Type className="w-6 h-6 text-zinc-700" />
                  </div>
                  <div>
                    <div className="font-bold text-base text-zinc-900">Player Names</div>
                    <div className="text-sm text-zinc-500">Show/hide all player names</div>
                  </div>
                </div>
                <button 
                  onClick={toggleGlobalNames}
                  className={`p-3 rounded-xl transition-all duration-300 shadow-sm ${globalShowNames ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'bg-gradient-to-r from-zinc-300 to-zinc-400 hover:from-zinc-400 hover:to-zinc-500'}`}
                >
                  {globalShowNames ? (
                    <CheckSquare className="w-6 h-6 text-white" />
                  ) : (
                    <Square className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>

              {/* Club Names Toggle */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-zinc-50 to-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Building className="w-6 h-6 text-zinc-700" />
                  </div>
                  <div>
                    <div className="font-bold text-base text-zinc-900">Club Badges</div>
                    <div className="text-sm text-zinc-500">Show/hide all club names</div>
                  </div>
                </div>
                <button 
                  onClick={toggleGlobalClubs}
                  className={`p-3 rounded-xl transition-all duration-300 shadow-sm ${globalShowClubs ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'bg-gradient-to-r from-zinc-300 to-zinc-400 hover:from-zinc-400 hover:to-zinc-500'}`}
                >
                  {globalShowClubs ? (
                    <CheckSquare className="w-6 h-6 text-white" />
                  ) : (
                    <Square className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Current Settings Status */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-sm font-bold text-blue-900 mb-2">Current Settings:</div>
              <div className="grid grid-cols-2 gap-2">
                <div className={`px-3 py-2 rounded-lg text-center text-sm font-medium ${globalShowNames ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Names: {globalShowNames ? 'ON' : 'OFF'}
                </div>
                <div className={`px-3 py-2 rounded-lg text-center text-sm font-medium ${globalShowClubs ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Clubs: {globalShowClubs ? 'ON' : 'OFF'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-black mb-4 text-zinc-900">Quick Actions</h3>
            
            <button 
              onClick={() => {
                const newPlayers = [...players];
                newPlayers.forEach(p => {
                  p.x = 20 + Math.random() * 60;
                  p.y = 20 + Math.random() * 60;
                });
                setPlayers(newPlayers);
              }}
              className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Zap className="w-5 h-5" />
              Randomize Positions
            </button>
            
            <button 
              onClick={() => {
                if (players.length >= 2) {
                  const i1 = Math.floor(Math.random() * players.length);
                  let i2 = Math.floor(Math.random() * players.length);
                  while (i2 === i1) i2 = Math.floor(Math.random() * players.length);
                  swapPlayers(players[i1].id, players[i2].id);
                }
              }}
              className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Palette className="w-5 h-5" />
              Swap Random Players
            </button>
          </div>

          {/* Instructions */}
          <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <h4 className="font-bold text-base mb-3 text-blue-900 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              How to Use
            </h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Drag players to position them</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Click player name or club to edit directly</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Hover players for captain/vice actions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Use toggles to show/hide names & clubs</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Click team name or manager to customize</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="p-6 bg-gradient-to-r from-white to-zinc-50 border-t border-zinc-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] flex justify-center">
        <button className="w-full max-w-sm py-5 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white font-black rounded-2xl text-base tracking-widest shadow-2xl hover:shadow-3xl transition-all duration-300 active:scale-95 uppercase flex items-center justify-center gap-3">
          <Save className="w-5 h-5" />
          Save & Export Lineup
        </button>
      </div>
    </div>
  );
};

export default PitchPreview;