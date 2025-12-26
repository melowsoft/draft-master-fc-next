'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { formations, getFormationById } from '../lib/formations';
import type { FormationPosition, Player } from '../utils/types';
import { JERSEY_COLORS } from '../lib/jersey-color-data';
import { 
  X, Download, Share2, Palette, Save, Zap, 
  Trophy, Grid3x3, Eye, Type, Building,
  CheckSquare, Square, Edit2, Edit3, Settings,
  PenTool, User, Camera, Goal, Menu, ChevronLeft,
  Palette as ColorPalette, Text, UserPlus
} from 'lucide-react';
import { toPng, toJpeg, toBlob } from 'html-to-image';



interface Formation {
  id: string;
  name: string;
  positions: [number, number][];
  description: string;
}

const PitchPreview: React.FC = () => {
  // Team State
  const [teamName, setTeamName] = useState('Team Name Here');
  const [managerName, setManagerName] = useState('Manager Name Here');
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [isEditingManagerName, setIsEditingManagerName] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  
  // Mobile State
  const [isMobile, setIsMobile] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  
  // Pitch State
  const [pitchTheme, setPitchTheme] = useState<'green' | 'blue' | 'classic' | 'dark'>('green');
  const [showGrid, setShowGrid] = useState(false);
  
  // Display Settings
  const [globalShowNames, setGlobalShowNames] = useState(true);
  const [globalShowClubs, setGlobalShowClubs] = useState(false);
  const [showTeamInfo, setShowTeamInfo] = useState(false); // NEW: Toggle for team/manager name
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  
  // Color Picker State
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
  
  // Players State - Updated to single color
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: "Raya", club: "WOL", x: 50, y: 15, color: "#ef4444", position: 'GKP', showName: true, showClub: true },
    { id: '2', name: "Cash", club: "WHU", x: 30, y: 35, color: "#ef4444", position: 'DEF', showName: true, showClub: true },
    { id: '3', name: "Guéhi", club: "MCI", x: 50, y: 35, color: "#3b82f6", position: 'DEF', showName: true, showClub: true },
    { id: '4', name: "Virgil", club: "6", x: 70, y: 35, color: "#ef4444", position: 'DEF', showName: true, showClub: true },
    { id: '5', name: "Eze", club: "WOL", x: 20, y: 55, color: "#ef4444", position: 'MID', showName: true, showClub: true },
    { id: '6', name: "Wilson", club: "BUR", x: 40, y: 55, color: "#000000", position: 'MID', showName: true, showClub: true },
    { id: '7', name: "Semenyo", club: "MUN", x: 60, y: 55, color: "#450a0a", position: 'MID', showName: true, showClub: true },
    { id: '8', name: "Bruno G.", club: "SUN", x: 80, y: 55, color: "#000000", position: 'MID', showName: true, showClub: true },
    { id: '9', name: "Haaland", club: "CRY", x: 30, y: 75, role: 'V', color: "#3b82f6", position: 'FWD', showName: true, showClub: true },
    { id: '10', name: "Ekitiké", club: "39", x: 50, y: 75, role: 'C', color: "#ef4444", position: 'FWD', showName: true, showClub: true },
    { id: '11', name: "Thiago", club: "LEE", x: 70, y: 75, color: "#ef4444", position: 'FWD', showName: true, showClub: true },
  ]);

  const [selectedFormation, setSelectedFormation] = useState<string>('3-5-2');
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [isDraggingPlayer, setIsDraggingPlayer] = useState(false);

  const pitchRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update the applyFormation function:
  const applyFormation = useCallback((formationId: string) => {
  const formation = getFormationById(formationId);
  if (!formation) return;

  const updatedPlayers = [...players];
  formation.positions.forEach((pos: FormationPosition, index: number) => {
    if (updatedPlayers[index]) {
      updatedPlayers[index] = {
        ...updatedPlayers[index],
        x: pos.x,
        y: pos.y,
        position: pos.position
      };
    }
  });
  setPlayers(updatedPlayers);
  setSelectedFormation(formationId);
}, [players]);

  // Handle player movement
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setActivePlayerId(id);
    setIsDraggingPlayer(true);
    setColorPickerOpen(null); // Close color picker when dragging
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!activePlayerId || !pitchRef.current || !isDraggingPlayer) return;
    
    e.preventDefault();
    e.stopPropagation();
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
  }, [activePlayerId, isDraggingPlayer]);

  const handlePointerUp = useCallback(() => {
    setActivePlayerId(null);
    setIsDraggingPlayer(false);
  }, []);

  // Handle touch events
  const handleTouchStart = useCallback((e: React.TouchEvent, id: string) => {
    e.stopPropagation();
    setActivePlayerId(id);
    setIsDraggingPlayer(true);
    setColorPickerOpen(null);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!activePlayerId || !pitchRef.current || !isDraggingPlayer) return;
    
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const rect = pitchRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setPlayers(prev => prev.map(p => 
      p.id === activePlayerId ? { 
        ...p, 
        x: Math.max(5, Math.min(95, x)), 
        y: Math.max(5, Math.min(95, y)) 
      } : p
    ));
  }, [activePlayerId, isDraggingPlayer]);

  const handleTouchEnd = useCallback(() => {
    setActivePlayerId(null);
    setIsDraggingPlayer(false);
  }, []);

  // Clean up event listeners on unmount
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setActivePlayerId(null);
      setIsDraggingPlayer(false);
    };

    document.addEventListener('pointerup', handleGlobalPointerUp);
    document.addEventListener('touchend', handleGlobalPointerUp);
    
    return () => {
      document.removeEventListener('pointerup', handleGlobalPointerUp);
      document.removeEventListener('touchend', handleGlobalPointerUp);
    };
  }, []);

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

  // NEW: Toggle team info display
  const toggleTeamInfo = () => {
    setShowTeamInfo(!showTeamInfo);
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

  // Update player color
  const updatePlayerColor = (playerId: string, newColor: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, color: newColor } : p
    ));
  };

  // Set random color for player
  const setRandomColor = (playerId: string) => {
    const randomColor = JERSEY_COLORS[Math.floor(Math.random() * JERSEY_COLORS.length)];
    updatePlayerColor(playerId, randomColor);
  };

  // Set player role
  const setPlayerRole = (playerId: string, role: 'C' | 'V' | undefined) => {
    setPlayers(prev => prev.map(p => 
      p.role === role ? { ...p, role: undefined } : 
      p.id === playerId ? { ...p, role } : 
      p
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

  // Realistic Goal Component
  const GoalPost = ({ position = 'top' }: { position: 'top' | 'bottom' }) => (
    <div className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-1/2 -translate-x-1/2 w-[90%] h-16 md:h-24 pointer-events-none z-0`}>
      {/* Goal Box - 6-yard box */}
      <div className={`absolute ${position === 'top' ? 'top-16 md:top-24' : 'bottom-16 md:bottom-24'} left-1/2 -translate-x-1/2 w-[40%] h-10 md:h-16 border-2 border-white/50 ${position === 'top' ? 'border-t-0 rounded-b-lg' : 'border-b-0 rounded-t-lg'}`}>
        {/* Box lines */}
        <div className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-1/2 -translate-x-1/2 w-1 h-3 md:h-4 bg-white/50`}></div>
      </div>
      
      {/* Penalty Spot */}
      <div className={`absolute ${position === 'top' ? 'top-28 md:top-40' : 'bottom-28 md:bottom-40'} left-1/2 -translate-x-1/2 w-2 md:w-3 h-2 md:h-3 bg-white rounded-full shadow-lg`}></div>
      
      {/* D-arc (penalty arc) */}
      <div className={`absolute ${position === 'top' ? 'top-24 md:top-36' : 'bottom-24 md:bottom-36'} left-1/2 -translate-x-1/2 w-24 md:w-32 h-12 md:h-16 border-2 border-white/30 ${position === 'top' ? 'border-t-0 rounded-b-full' : 'border-b-0 rounded-t-full'}`}></div>
    </div>
  );

  // Color Picker Component
  const ColorPicker = ({ playerId, currentColor, onClose }: { 
    playerId: string; 
    currentColor: string; 
    onClose: () => void;
  }) => {
    const handleColorSelect = (color: string) => {
      updatePlayerColor(playerId, color);
      onClose();
    };

    // Calculate position to avoid going off screen
    const getPickerPosition = () => {
      const player = players.find(p => p.id === playerId);
      if (!player) return 'bottom';
      
      // If player is in bottom half of pitch, show picker above
      if (player.y > 50) return 'top';
      return 'bottom';
    };

    const position = getPickerPosition();

    return (
      <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 z-50`}>
        <div className="bg-white rounded-xl shadow-2xl p-4 border border-zinc-200 min-w-[200px]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-zinc-800">Jersey Color</h4>
            <button 
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {JERSEY_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 rounded-full border-2 ${currentColor === color ? 'border-blue-500 scale-110' : 'border-zinc-200 hover:scale-105'} transition-all`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                const customColor = prompt('Enter hex color (e.g., #FF5733):', currentColor);
                if (customColor && /^#[0-9A-F]{6}$/i.test(customColor)) {
                  handleColorSelect(customColor);
                } else if (customColor) {
                  alert('Please enter a valid hex color (e.g., #FF5733)');
                }
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Custom Color...
            </button>
            <button
              onClick={() => setRandomColor(playerId)}
              className="text-sm font-medium text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Random Color
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Create a clean version of ONLY the pitch area for download
  const createDownloadElement = () => {
    const container = document.createElement('div');
    
    const width = 900;
    const height = 1200;
    
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.background = pitchTheme === 'green' ? 'linear-gradient(to bottom, #10b981, #059669)' : 
                                 pitchTheme === 'blue' ? 'linear-gradient(to bottom, #3b82f6, #1d4ed8)' : 
                                 pitchTheme === 'classic' ? 'linear-gradient(to bottom, #9ca3af, #6b7280)' : 
                                 'linear-gradient(to bottom, #1f2937, #111827)';
    container.style.position = 'relative';
    container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    container.style.color = '#111827';
    container.style.overflow = 'hidden';
    
    const sanitizedTeamName = teamName || 'My Team';
    const sanitizedManagerName = managerName || 'My Manager';
    
    container.innerHTML = `
      <div style="width: 100%; height: 100%; position: relative;">
        <!-- Pitch Outline -->
        <div style="position: absolute; inset: 40px; border: 4px solid rgba(255,255,255,0.7); border-radius: 24px;"></div>
        
        <!-- Center Line -->
        <div style="position: absolute; left: 0; right: 0; top: 50%; height: 2px; background: rgba(255,255,255,0.7);"></div>
        
        <!-- Center Circle -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 250px; height: 250px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.7);"></div>
        
        <!-- Center Spot -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: white; border-radius: 50%; border: 2px solid rgba(0,0,0,0.3); box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
        
        <!-- TOP Goal Area -->
        <div style="position: absolute; top: 40px; left: 50%; transform: translateX(-50%); width: 85%; height: 90px;">
          <!-- Penalty Area -->
          <div style="position: absolute; top: 90px; left: 50%; transform: translateX(-50%); width: 70%; height: 110px; border: 3px solid rgba(255,255,255,0.7); border-top: none; border-radius: 0 0 20px 20px;"></div>
          
          <!-- Penalty Spot -->
          <div style="position: absolute; top: 200px; left: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: white; border-radius: 50%; border: 2px solid rgba(0,0,0,0.3); box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
          
          <!-- D-arc -->
          <div style="position: absolute; top: 200px; left: 50%; transform: translateX(-50%); width: 200px; height: 100px; border: 3px solid rgba(255,255,255,0.7); border-top: none; border-radius: 0 0 100px 100px;"></div>
        </div>
        
        <!-- BOTTOM Goal Area -->
        <div style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); width: 85%; height: 90px;">
          <!-- Penalty Area -->
          <div style="position: absolute; bottom: 90px; left: 50%; transform: translateX(-50%); width: 70%; height: 110px; border: 3px solid rgba(255,255,255,0.7); border-bottom: none; border-radius: 20px 20px 0 0;"></div>
          
          <!-- Penalty Spot -->
          <div style="position: absolute; bottom: 200px; left: 50%; transform: translate(-50%, 50%); width: 12px; height: 12px; background: white; border-radius: 50%; border: 2px solid rgba(0,0,0,0.3); box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
          
          <!-- D-arc -->
          <div style="position: absolute; bottom: 200px; left: 50%; transform: translateX(-50%); width: 200px; height: 100px; border: 3px solid rgba(255,255,255,0.7); border-bottom: none; border-radius: 100px 100px 0 0;"></div>
        </div>
        
        <!-- Players -->
        ${players.map(p => {
           const shouldShowName = p.showName !== undefined ? p.showName : globalShowNames;
           const shouldShowClub =  globalShowClubs;
          
          const playerX = (p.x / 100) * width;
          const playerY = (p.y / 100) * height;
          
          return `
            <div style="position: absolute; left: ${playerX}px; top: ${playerY}px; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; z-index: 10;">
              <!-- Jersey -->
              <div style="position: relative; margin-bottom: 8px;">
                <div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; display: flex; box-shadow: 0 10px 25px rgba(0,0,0,0.2); border: 4px solid rgba(255,255,255,0.5); background: ${p.color};">
                </div>
               
                <!-- Captain/Vice Badge -->
                ${p.role ? `
                  <div style="position: absolute; top: -8px; right: -8px; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 6px 12px rgba(0,0,0,0.2); background: ${p.role === 'C' ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};">
                    <span style="color: white; font-size: 12px; font-weight: 900;">${p.role}</span>
                  </div>
                ` : ''}
              </div>
              
              <!-- Name -->
              ${shouldShowName ? `
                <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); padding: 6px 12px; border-radius: 8px; margin-bottom: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                  <span style="color: black; font-size: 18px; font-weight: 900; white-space: nowrap; letter-spacing: -0.2px;">${p.name}</span>
                </div>
              ` : ''}
              
              <!-- Club -->
              ${shouldShowClub ? `
                <div style="background: white; padding: 6px 15px; border-radius: 20px; box-shadow: 0 6px 16px rgba(0,0,0,0.15); border: 2px solid #e5e7eb;">
                  <span style="color: #4b5563; font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;">${p.club}</span>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
        
        <!-- Team Name Overlay (Top Center) - Only show if showTeamInfo is true -->
        ${showTeamInfo ? `
          <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); z-index: 5;">
            <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); padding: 12px 24px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); border: 2px solid rgba(255,255,255,0.4);">
              <h2 style="color: #111827; font-size: 24px; font-weight: 900; margin: 0 0 4px 0; text-align: center; white-space: nowrap;">
                ${sanitizedTeamName}
              </h2>
              <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                <svg width="16" height="16" fill="#6b7280" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span style="color: #6b7280; font-size: 16px; font-weight: 600;">${sanitizedManagerName}</span>
              </div>
            </div>
          </div>
        ` : ''}
        
        <!-- Formation Overlay (Top Right) -->
        <div style="position: absolute; top: 20px; right: 20px; z-index: 5;">
          <div style="background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); padding: 10px 16px; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.2);">
            <div style="color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 700; margin-bottom: 2px; letter-spacing: 0.5px;">FORMATION</div>
            <div style="color: white; font-size: 20px; font-weight: 900;">${selectedFormation}</div>
          </div>
        </div>
        
        <!-- Position Labels (Bottom Center) -->
        <div style="position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); display: flex; gap: 50px; color: rgba(255,255,255,0.95); font-size: 16px; font-weight: 900; backdrop-filter: blur(4px); background: rgba(0,0,0,0.3); padding: 10px 30px; border-radius: 25px; border: 2px solid rgba(255,255,255,0.3); z-index: 5; letter-spacing: 1px;">
          <span>DEF</span>
          <span>MID</span>
          <span>ATT</span>
        </div>
        
        <!-- Watermark (Bottom Right) -->
        <div style="position: absolute; bottom: 20px; right: 20px; z-index: 5;">
          <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); padding: 8px 12px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <svg width="14" height="14" fill="#4b5563" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span style="color: #4b5563; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">draftmasterfc.com</span>
          </div>
        </div>
      </div>
    `;
    
    return container;
  };

  // Download function
  const downloadPitchImage = async (format: 'png' | 'jpeg' = 'png') => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      const container = createDownloadElement();
      document.body.appendChild(container);
      
      let dataUrl: string;
      
      if (format === 'png') {
        dataUrl = await toPng(container, {
          quality: 1.0,
          backgroundColor: 'transparent',
          pixelRatio: 3,
          skipFonts: true,
          cacheBust: true,
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      } else {
        dataUrl = await toJpeg(container, {
          quality: 0.95,
          backgroundColor: '#ffffff',
          pixelRatio: 3,
          skipFonts: true,
          cacheBust: true,
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
      
      document.body.removeChild(container);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sanitizedTeamName = teamName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-team';
      const filename = `${sanitizedTeamName}-lineup-${timestamp}.${format}`;
      
      if (isMobile) {
        await downloadForMobile(dataUrl, filename, format);
      } else {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
      }
      
      alert(`${teamName} lineup downloaded successfully!`);
      
    } catch (error) {
      console.error('Error downloading pitch:', error);
      
      try {
        const container = createDownloadElement();
        document.body.appendChild(container);
        
        const blob = await toBlob(container, {
          quality: 0.95,
          backgroundColor: format === 'jpeg' ? '#ffffff' : 'transparent',
          pixelRatio: 2,
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
        
        document.body.removeChild(container);
        
        if (blob) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const sanitizedTeamName = teamName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-team';
          const filename = `${sanitizedTeamName}-lineup-${timestamp}.${format}`;
          
          const link = document.createElement('a');
          link.download = filename;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        }
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError);
        alert('Failed to download lineup. Please try again or use the share option.');
      }
    } finally {
      setIsDownloading(false);
      setShowDownloadOptions(false);
    }
  };

  const downloadForMobile = async (dataUrl: string, filename: string, format: string) => {
    try {
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(clickEvent);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return;
    } catch (error) {
      console.log('Standard download failed on mobile, trying alternative...');
    }
    
    try {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${filename}</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                background: #f3f4f6; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              }
              .container { 
                max-width: 100%; 
                text-align: center; 
              }
              img { 
                max-width: 100%; 
                height: auto; 
                border-radius: 12px; 
                box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
                margin-bottom: 20px;
              }
              .instructions { 
                background: white; 
                padding: 20px; 
                border-radius: 12px; 
                margin: 20px 0; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
                max-width: 400px;
              }
              h1 { 
                color: #111827; 
                font-size: 20px; 
                margin-bottom: 15px;
              }
              p { 
                color: #4b5563; 
                line-height: 1.6; 
                font-size: 14px;
                margin-bottom: 15px;
              }
              .step { 
                display: flex; 
                align-items: flex-start; 
                gap: 12px; 
                margin: 15px 0; 
                text-align: left; 
              }
              .step-number { 
                width: 28px; 
                height: 28px; 
                background: #3b82f6; 
                color: white; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-weight: bold; 
                font-size: 14px;
                flex-shrink: 0;
              }
              .button {
                background: linear-gradient(to right, #3b82f6, #1d4ed8);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
                margin-top: 10px;
                display: inline-block;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Your Lineup Image</h1>
              <img src="${dataUrl}" alt="${teamName} Lineup" />
              <div class="instructions">
                <p><strong>To save this image:</strong></p>
                <div class="step">
                  <div class="step-number">1</div>
                  <div>Long press (touch and hold) the image above</div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div>Select "Save Image" or "Download Image" from the menu</div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div>Choose where to save it on your device</div>
                </div>
                <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
                  The image is in 3:4 portrait format, perfect for sharing!
                </p>
              </div>
              <a href="${dataUrl}" download="${filename}" class="button">
                Try Direct Download
              </a>
            </div>
          </body>
          </html>
        `);
        newWindow.document.close();
        return;
      }
    } catch (error) {
      console.log('New window method failed');
    }
    
    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        const file = new File([blob], filename, { type: format === 'png' ? 'image/png' : 'image/jpeg' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${teamName} Lineup`,
            text: `Check out my ${teamName} lineup created with DraftMaster FC!`,
          });
          return;
        }
      } catch (shareError) {
        console.log('Share API not available or failed:', shareError);
      }
    }
    
    alert(`To save your lineup:\n1. We opened the image in a new tab\n2. If not, long press the image above\n3. Select "Save Image"\n\nImage saved as: ${filename}`);
  };

  const shareLineup = async () => {
    if (navigator.share) {
      try {
        const container = createDownloadElement();
        document.body.appendChild(container);
        
        const dataUrl = await toPng(container, {
          quality: 0.8,
          backgroundColor: '#ffffff',
          pixelRatio: 1,
        });
        
        document.body.removeChild(container);
        
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'lineup.png', { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${teamName} Lineup`,
            text: `Check out my ${teamName} lineup created with DraftMaster FC! #DraftMasterFC`,
          });
        } else {
          await navigator.share({
            title: `${teamName} Lineup`,
            text: `Check out my ${teamName} lineup created with DraftMaster FC! #DraftMasterFC`,
            url: window.location.href,
          });
        }
      } catch (error) {
        console.error('Error sharing:', error);
        alert('Share failed. Please try downloading and sharing manually.');
      }
    } else {
      alert('Share feature is available on mobile devices. Please use the download option.');
    }
  };

  // Render player component for the interactive view
  const renderPlayer = (p: Player) => {
    const shouldShowName = p.showName !== undefined ? p.showName : globalShowNames;
    const shouldShowClub =  globalShowClubs;

    return (
      <div 
        key={p.id}
        onPointerDown={(e) => handlePointerDown(p.id, e)}
        onTouchStart={(e) => handleTouchStart(e, p.id)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none group
          ${activePlayerId === p.id ? 'z-50 cursor-grabbing' : 'z-10 cursor-grab'}`}
        style={{ 
          left: `${p.x}%`, 
          top: `${p.y}%`,
          touchAction: 'none'
        }}
      >
        <div className="relative mb-0.5 md:mb-1">
          {/* Jersey Circle - Single color now */}
          <div 
            className="relative w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden flex shadow-lg md:shadow-xl border-2 border-white/30 group-hover:scale-110 transition-transform duration-200"
            style={{ backgroundColor: p.color }}
          >
            {/* Position Badge */}
            <div className="absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-white/95 text-black text-[7px] md:text-[8px] lg:text-[9px] font-black rounded-full flex items-center justify-center border border-zinc-300 shadow-sm md:shadow-md">
              {p.position}
            </div>

            {/* Captain/Vice Badge */}
            {p.role && (
              <div className={`absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center border-2 md:border-3 border-white shadow-md md:shadow-lg
                ${p.role === 'C' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                <span className="text-white text-xs md:text-sm font-black drop-shadow-sm">{p.role}</span>
              </div>
            )}
          </div>

          {/* Color Picker */}
          {colorPickerOpen === p.id && (
            <ColorPicker 
              playerId={p.id} 
              currentColor={p.color} 
              onClose={() => setColorPickerOpen(null)}
            />
          )}
        </div>

        {/* Name and Club */}
        <div className="flex flex-col items-center gap-0.5 md:gap-1">
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
                  className="text-black text-[9px] md:text-[11px] lg:text-[12px] font-black leading-none bg-white/90 backdrop-blur-sm border-2 border-blue-400 rounded px-1.5 py-0.5 md:px-2 md:py-1 text-center min-w-[40px] md:min-w-[60px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                  autoFocus
                  maxLength={15}
                />
                <PenTool className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-blue-500 animate-pulse" />
              </div>
            ) : (
              <div className="relative group/name">
                <span 
                  onClick={() => setEditingPlayer(p.id)}
                  className="text-black text-[9px] md:text-[11px] lg:text-[12px] font-black leading-none whitespace-nowrap drop-shadow-sm md:drop-shadow-md hover:text-blue-600 cursor-pointer transition-colors bg-white/70 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded"
                  title="Click to edit name"
                >
                  {p.name}
                </span>
                <div className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/name:opacity-100 transition-opacity">
                  <Edit2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-500" />
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
                  className="text-zinc-700 text-[8px] md:text-[10px] lg:text-[11px] font-bold uppercase tracking-tight bg-white/90 backdrop-blur-sm border-2 border-blue-400 rounded-full px-2 py-1 md:px-3 md:py-1.5 text-center min-w-[40px] md:min-w-[60px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                  autoFocus
                  maxLength={10}
                />
                <PenTool className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-blue-500 animate-pulse" />
              </div>
            ) : (
              <div className="relative group/club">
                <div 
                  onClick={() => setEditingPlayer(`${p.id}-club`)}
                  className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5 shadow-md md:shadow-lg border border-zinc-200 flex items-center justify-center min-w-[40px] md:min-w-[60px] group-hover:shadow-lg md:group-hover:shadow-xl transition-all duration-200 hover:border-blue-300 hover:bg-white cursor-pointer"
                  title="Click to edit club"
                >
                  <span className="text-zinc-700 text-[8px] md:text-[10px] lg:text-[11px] font-bold uppercase tracking-tight hover:text-blue-600 transition-colors">
                    {p.club}
                  </span>
                </div>
                <div className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/club:opacity-100 transition-opacity">
                  <Edit3 className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-500" />
                </div>
              </div>
            )
          ) : null}
        </div>

        {/* Player Actions (on hover) - Desktop only */}
        {!isMobile && (
          <div className="absolute -bottom-16 md:-bottom-20 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
            <button 
              onClick={() => setPlayerRole(p.id, p.role === 'C' ? undefined : 'C')}
              className="p-1.5 md:p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl hover:scale-110"
              title="Make Captain"
            >
              <Trophy className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button 
              onClick={() => setPlayerRole(p.id, p.role === 'V' ? undefined : 'V')}
              className="p-1.5 md:p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl hover:scale-110"
              title="Make Vice"
            >
              <Type className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button 
              onClick={() => setColorPickerOpen(p.id)}
              className="p-1.5 md:p-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl hover:scale-110"
              title="Change Jersey Color"
            >
              <ColorPalette className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button 
              onClick={() => setRandomColor(p.id)}
              className="p-1.5 md:p-2 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-full hover:from-pink-600 hover:to-rose-700 transition-all shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl hover:scale-110"
              title="Random Color"
            >
              <Zap className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        )}

        {/* Mobile Color Picker Button */}
        {isMobile && (
          <button 
            onClick={() => setColorPickerOpen(colorPickerOpen === p.id ? null : p.id)}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110"
            title="Change Color"
          >
            <ColorPalette className="w-3 h-3 text-zinc-600" />
          </button>
        )}
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

  // Download Options Modal
  const DownloadOptionsModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-black text-zinc-900">Download Options</h3>
          <button 
            onClick={() => setShowDownloadOptions(false)}
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2">High Quality PNG</h4>
            <p className="text-sm text-blue-700">Best for printing and sharing</p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
            <h4 className="font-bold text-emerald-900 mb-2">Optimized JPEG</h4>
            <p className="text-sm text-emerald-700">Smaller file size, good for mobile</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => downloadPitchImage('png')}
            disabled={isDownloading}
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download as PNG</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => downloadPitchImage('jpeg')}
            disabled={isDownloading}
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download as JPEG</span>
              </>
            )}
          </button>
          
          {isMobile && (
            <button 
              onClick={shareLineup}
              className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Lineup</span>
            </button>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <p className="text-xs text-zinc-500 text-center">
            {isMobile 
              ? 'On mobile: Long press the image to save, or use share for social media'
              : 'Image will be downloaded to your default downloads folder'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showDownloadOptions && <DownloadOptionsModal />}
      
      <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-white to-zinc-50 rounded-2xl md:rounded-[40px] shadow-xl md:shadow-2xl overflow-hidden text-black border border-zinc-200">
        {/* Mobile Header Controls */}
        {isMobile && (
          <div className="lg:hidden flex flex-col items-center justify-center p-4 bg-white border-b border-zinc-100">
            <div className="text-center mb-4">
              {/* Team Name - Mobile Editable - Only show if showTeamInfo is true */}
              {showTeamInfo ? (
                <>
                  {isEditingTeamName ? (
                    <div className="relative mb-2">
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        onBlur={() => setIsEditingTeamName(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingTeamName(false)}
                        className="text-xl font-black text-center bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 pb-1 w-full"
                        autoFocus
                        maxLength={40}
                      />
                      <PenTool className="absolute -right-6 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-600 animate-pulse" />
                    </div>
                  ) : (
                    <h2 
                      onClick={() => setIsEditingTeamName(true)}
                      className="text-xl font-black mb-2 tracking-tight text-zinc-900 hover:text-blue-700 cursor-pointer transition-colors group relative inline-block"
                    >
                      {teamName}
                      <Edit2 className="absolute -right-5 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                  )}

                  {/* Manager Name - Mobile Editable - Only show if showTeamInfo is true */}
                  <div className="flex items-center justify-center gap-2">
                    <User className="w-3 h-3 text-zinc-400" />
                    {isEditingManagerName ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={managerName}
                          onChange={(e) => setManagerName(e.target.value)}
                          onBlur={() => setIsEditingManagerName(false)}
                          onKeyDown={(e) => e.key === 'Enter' && setIsEditingManagerName(false)}
                          className="text-sm text-center bg-transparent border-b border-blue-400 focus:outline-none focus:border-blue-600 pb-0.5 w-32"
                          autoFocus
                          maxLength={30}
                        />
                        <PenTool className="absolute -right-5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-blue-500 animate-pulse" />
                      </div>
                    ) : (
                      <p 
                        onClick={() => setIsEditingManagerName(true)}
                        className="text-zinc-600 text-sm font-medium hover:text-blue-600 cursor-pointer transition-colors group relative"
                      >
                        {managerName}
                        <Edit3 className="absolute -right-5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <p className="text-sm text-zinc-500 italic">Team info is hidden</p>
                  <p className="text-xs text-zinc-400">Toggle "Team Info" in settings to show</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between w-full">
              <button 
                onClick={() => setShowSidePanel(true)}
                className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors"
                title="Open Settings"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setShowDownloadOptions(true)}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity text-sm"
              >
                {isDownloading ? (
                  <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isDownloading ? 'Processing...' : 'Download'}
              </button>
            </div>
          </div>
        )}

        {/* Main Header - Desktop only */}
        {!isMobile && (
          <div className="hidden lg:block p-6 lg:p-8 relative flex flex-col items-center bg-white border-b border-zinc-100">
            <div className="absolute right-6 lg:right-8 top-6 lg:top-8 flex items-center gap-2 lg:gap-3">
              <button 
                onClick={() => setShowGrid(!showGrid)}
                className="p-2 lg:p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors shadow-sm hover:shadow-md"
                title="Toggle Grid"
              >
                <Grid3x3 className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <button 
                onClick={shareLineup}
                className="p-2 lg:p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors shadow-sm hover:shadow-md"
                title="Share"
              >
                <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>

            <div className="absolute left-6 lg:left-8 top-6 lg:top-8">
              <Settings className="w-5 h-5 lg:w-6 lg:h-6 text-zinc-400" />
            </div>

            <div className="text-center max-w-xl px-4">
              {/* Team Name and Manager - Only show if showTeamInfo is true */}
              {showTeamInfo ? (
                <>
                  {isEditingTeamName ? (
                    <div className="relative mb-2">
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        onBlur={() => setIsEditingTeamName(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingTeamName(false)}
                        className="text-2xl lg:text-4xl font-black text-center bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 pb-1 lg:pb-2 w-full"
                        autoFocus
                        maxLength={40}
                      />
                      <PenTool className="absolute -right-6 lg:-right-10 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-blue-600 animate-pulse" />
                    </div>
                  ) : (
                    <h2 
                      onClick={() => setIsEditingTeamName(true)}
                      className="text-2xl lg:text-4xl font-black mb-2 tracking-tight text-zinc-900 hover:text-blue-700 cursor-pointer transition-colors group relative inline-block"
                    >
                      {teamName}
                      <Edit2 className="absolute -right-6 lg:-right-10 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                  )}

                  <div className="flex items-center justify-center gap-2 lg:gap-3 mt-2 lg:mt-4">
                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-400" />
                    {isEditingManagerName ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={managerName}
                          onChange={(e) => setManagerName(e.target.value)}
                          onBlur={() => setIsEditingManagerName(false)}
                          onKeyDown={(e) => e.key === 'Enter' && setIsEditingManagerName(false)}
                          className="text-base lg:text-xl text-center bg-transparent border-b border-blue-400 focus:outline-none focus:border-blue-600 pb-0.5 lg:pb-1 w-32 lg:w-48"
                          autoFocus
                          maxLength={30}
                        />
                        <PenTool className="absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2 w-3 h-3 lg:w-4 lg:h-4 text-blue-500 animate-pulse" />
                      </div>
                    ) : (
                      <p 
                        onClick={() => setIsEditingManagerName(true)}
                        className="text-zinc-600 text-base lg:text-xl font-medium hover:text-blue-600 cursor-pointer transition-colors group relative"
                      >
                        {managerName}
                        <Edit3 className="absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2 w-3 h-3 lg:w-4 lg:h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-6">
                    <span className="text-xs lg:text-sm text-zinc-400 font-medium">
                      Click team name or manager to edit
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-4 lg:py-6">
                  <p className="text-lg lg:text-xl text-zinc-500 italic">Team info is hidden</p>
                  <p className="text-sm lg:text-base text-zinc-400">Toggle "Team Info" in settings to show</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row">
          {/* Main Pitch Area */}
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Formation Selector - Mobile optimized */}
            <div className="mb-4 md:mb-6 lg:mb-8 overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {formations.map(f => (
                  <button
                    key={f.id}
                    onClick={() => applyFormation(f.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      selectedFormation === f.id 
                        ? 'bg-gradient-to-r from-zinc-900 to-black text-white shadow-lg' 
                        : 'bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {f.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Pitch Theme Selector - Mobile (below formations) */}
            {isMobile && (
              <div className="mb-4 md:mb-6">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-md">
                  <div className="text-xs font-semibold text-zinc-600 mb-2 text-center">PITCH THEME</div>
                  <div className="flex justify-center gap-3">
                    {Object.entries(pitchThemes).map(([theme, _]) => (
                      <button
                        key={theme}
                        onClick={() => setPitchTheme(theme as any)}
                        className={`flex flex-col items-center gap-1 ${pitchTheme === theme ? 'text-blue-600' : 'text-zinc-500'}`}
                      >
                        <div 
                          className={`w-10 h-10 rounded-full border-2 transition-all ${pitchTheme === theme ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-blue-300'}`}
                          style={{ 
                            background: theme === 'green' ? '#a7d9b9' : 
                                       theme === 'blue' ? '#93c5fd' : 
                                       theme === 'classic' ? '#d4d4d4' : '#1f2937' 
                          }}
                        />
                        <span className="text-xs font-medium capitalize">{theme}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Pitch with Realistic Goals */}
            <div 
              ref={pitchRef}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className={`relative aspect-[3/4] ${pitchThemes[pitchTheme]} overflow-hidden touch-auto rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg md:shadow-xl lg:shadow-2xl border-4 md:border-6 lg:border-8 border-white/60`}
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
                <div className="absolute inset-2 md:inset-3 lg:inset-4 border-2 md:border-3 border-white/50 rounded-lg md:rounded-xl lg:rounded-2xl"></div>
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-2 border-white/50"></div>
                
                {/* Center Spot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-white rounded-full border border-black/20 shadow-lg"></div>
              </div>

              {/* Realistic Goals */}
              <GoalPost position="top" />
              <GoalPost position="bottom" />

              {/* Toolbar Overlay - Mobile optimized */}
              <div className={`absolute ${isMobile ? 'top-4 left-4 flex-row gap-2' : 'top-6 md:top-8 left-6 md:left-8 flex-col gap-3 md:gap-4'} flex z-40`}>
                <button 
                  onClick={() => setShowDownloadOptions(true)}
                  disabled={isDownloading}
                  className={`p-2 md:p-3 ${isDownloading ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-white/95 backdrop-blur'} rounded-full shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl active:scale-90 transition-all duration-200 ${isDownloading ? 'cursor-not-allowed' : 'hover:bg-white'}`}
                  title="Download Lineup"
                >
                  {isDownloading ? (
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Download className="w-4 h-4 md:w-5 md:h-5 text-zinc-600" />
                  )}
                </button>
                {!isMobile && (
                  <>
                    <button className="p-2 md:p-3 bg-white/95 backdrop-blur rounded-full shadow-lg md:shadow-xl hover:bg-white active:scale-90 transition-all duration-200 hover:shadow-xl md:hover:shadow-2xl">
                      <Save className="w-4 h-4 md:w-5 md:h-5 text-zinc-600" />
                    </button>
                  </>
                )}
              </div>

              {/* Pitch Theme Selector - Desktop only */}
              {!isMobile && (
                <div className="absolute top-6 md:top-8 right-6 md:right-8 flex flex-col gap-2 md:gap-3 z-40 bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl">
                  <div className="text-xs font-bold text-zinc-600 mb-1">Theme</div>
                  {Object.entries(pitchThemes).map(([theme, _]) => (
                    <button
                      key={theme}
                      onClick={() => setPitchTheme(theme as any)}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all ${pitchTheme === theme ? 'border-white shadow-lg scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ 
                        background: theme === 'green' ? '#a7d9b9' : 
                                   theme === 'blue' ? '#93c5fd' : 
                                   theme === 'classic' ? '#d4d4d4' : '#1f2937' 
                      }}
                      title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                    />
                  ))}
                </div>
              )}

              {/* Render Starting XI */}
              {players.map(p => renderPlayer(p))}

              {/* Position Labels */}
              <div className="absolute bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-6 md:gap-8 lg:gap-12 text-white/80 text-xs md:text-sm font-black backdrop-blur-sm bg-black/20 px-4 py-1.5 md:px-6 md:py-2 rounded-full">
                <span>DEF</span>
                <span>MID</span>
                <span>ATT</span>
              </div>
            </div>

            {/* Mobile Quick Actions */}
            {isMobile && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    const newPlayers = [...players];
                    newPlayers.forEach(p => {
                      p.x = 20 + Math.random() * 60;
                      p.y = 20 + Math.random() * 60;
                    });
                    setPlayers(newPlayers);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  <Zap className="w-4 h-4" />
                  Randomize
                </button>
                <button 
                  onClick={() => setShowDownloadOptions(true)}
                  className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Options
                </button>
              </div>
            )}
          </div>

          {/* Side Panel - Desktop & Mobile */}
          <div className={`
            ${isMobile ? 
              `fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out ${
                showSidePanel ? 'translate-x-0' : 'translate-x-full'
              }` : 
              'w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-zinc-200 bg-white'
            } p-4 md:p-6 lg:p-8 overflow-y-auto
          `}>
            {/* Mobile Side Panel Header */}
            {isMobile && (
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
                <button 
                  onClick={() => setShowSidePanel(false)}
                  className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-zinc-900">Settings</h2>
                <div className="w-10"></div>
              </div>
            )}

            {/* Display Controls */}
            <div className="mb-6 md:mb-8">
              {
                isMobile &&  (<div className="flex justify-end"><button className="p-2 text-zinc-400 hover:bg-zinc-50 rounded-full transition-colors" onClick={() => setShowSidePanel(false)}>
              <X className="w-5 h-5" />
            </button></div>)
              }
              <h3 className="text-lg md:text-xl font-black mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-zinc-900">
                <Eye className="w-5 h-5 md:w-6 md:h-6" />
                Display Settings
              </h3>
              
              <div className="space-y-3 md:space-y-4">
                {/* Team Info Toggle - NEW */}
                <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-zinc-50 to-zinc-100 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-white rounded-lg md:rounded-xl shadow-sm">
                      <Text className="w-4 h-4 md:w-6 md:h-6 text-zinc-700" />
                    </div>
                    <div>
                      <div className="font-bold text-sm md:text-base text-zinc-900">Team Info</div>
                      <div className="text-xs md:text-sm text-zinc-500">Show/hide team name & manager</div>
                    </div>
                  </div>
                  <button 
                    onClick={toggleTeamInfo}
                    className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-300 shadow-sm ${showTeamInfo ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : 'bg-gradient-to-r from-zinc-300 to-zinc-400 hover:from-zinc-400 hover:to-zinc-500'}`}
                  >
                    {showTeamInfo ? (
                      <CheckSquare className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    ) : (
                      <Square className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    )}
                  </button>
                </div>

                {/* Player Names Toggle */}
                <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-zinc-50 to-zinc-100 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-white rounded-lg md:rounded-xl shadow-sm">
                      <Type className="w-4 h-4 md:w-6 md:h-6 text-zinc-700" />
                    </div>
                    <div>
                      <div className="font-bold text-sm md:text-base text-zinc-900">Player Names</div>
                      <div className="text-xs md:text-sm text-zinc-500">Show/hide names</div>
                    </div>
                  </div>
                  <button 
                    onClick={toggleGlobalNames}
                    className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-300 shadow-sm ${globalShowNames ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'bg-gradient-to-r from-zinc-300 to-zinc-400 hover:from-zinc-400 hover:to-zinc-500'}`}
                  >
                    {globalShowNames ? (
                      <CheckSquare className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    ) : (
                      <Square className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    )}
                  </button>
                </div>

                {/* Club Names Toggle */}
                <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-zinc-50 to-zinc-100 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-white rounded-lg md:rounded-xl shadow-sm">
                      <Building className="w-4 h-4 md:w-6 md:h-6 text-zinc-700" />
                    </div>
                    <div>
                      <div className="font-bold text-sm md:text-base text-zinc-900">Club Badges</div>
                      <div className="text-xs md:text-sm text-zinc-500">Show/hide clubs</div>
                    </div>
                  </div>
                  <button 
                    onClick={toggleGlobalClubs}
                    className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-300 shadow-sm ${globalShowClubs ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'bg-gradient-to-r from-zinc-300 to-zinc-400 hover:from-zinc-400 hover:to-zinc-500'}`}
                  >
                    {globalShowClubs ? (
                      <CheckSquare className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    ) : (
                      <Square className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    )}
                  </button>
                </div>

                {/* Quick Color Change Section */}
                <div className="p-3 md:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl md:rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-sm md:text-base text-purple-900 mb-2 md:mb-3">Quick Color Changes</h4>
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    <button 
                      onClick={() => {
                        const newPlayers = [...players];
                        newPlayers.forEach(p => {
                          updatePlayerColor(p.id, '#ef4444'); // Red
                        });
                      }}
                      className="p-2 md:p-3 rounded-lg md:rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm font-medium transition-colors"
                    >
                      All Red
                    </button>
                    <button 
                      onClick={() => {
                        const newPlayers = [...players];
                        newPlayers.forEach(p => {
                          updatePlayerColor(p.id, '#3b82f6'); // Blue
                        });
                      }}
                      className="p-2 md:p-3 rounded-lg md:rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm font-medium transition-colors"
                    >
                      All Blue
                    </button>
                    <button 
                      onClick={() => {
                        const newPlayers = [...players];
                        newPlayers.forEach(p => {
                          setRandomColor(p.id);
                        });
                      }}
                      className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs md:text-sm font-medium transition-colors"
                    >
                      Random All
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Settings Status */}
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl border border-blue-100">
                <div className="text-xs md:text-sm font-bold text-blue-900 mb-1 md:mb-2">Current Settings:</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`px-2 py-1.5 md:px-3 md:py-2 rounded text-center text-xs md:text-sm font-medium ${showTeamInfo ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                    Team: {showTeamInfo ? 'ON' : 'OFF'}
                  </div>
                  <div className={`px-2 py-1.5 md:px-3 md:py-2 rounded text-center text-xs md:text-sm font-medium ${globalShowNames ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Names: {globalShowNames ? 'ON' : 'OFF'}
                  </div>
                  <div className={`px-2 py-1.5 md:px-3 md:py-2 rounded text-center text-xs md:text-sm font-medium ${globalShowClubs ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Clubs: {globalShowClubs ? 'ON' : 'OFF'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {!isMobile && <h3 className="text-lg md:text-xl font-black mb-3 md:mb-4 text-zinc-900">Quick Actions</h3>}
              
              {!isMobile && (
                <>
                  <button 
                    onClick={() => {
                      const newPlayers = [...players];
                      newPlayers.forEach(p => {
                        p.x = 20 + Math.random() * 60;
                        p.y = 20 + Math.random() * 60;
                      });
                      setPlayers(newPlayers);
                    }}
                    className="w-full flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl md:rounded-2xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-sm md:text-base"
                  >
                    <Zap className="w-4 h-4 md:w-5 md:h-5" />
                    Randomize Positions
                  </button>
                  
                  <button 
                    onClick={() => setShowDownloadOptions(true)}
                    className="w-full flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl md:rounded-2xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-sm md:text-base"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                    Download Lineup
                  </button>
                </>
              )}

              {/* Download Info */}
              <div className="p-3 md:p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl md:rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                  <Camera className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                  <h4 className="font-bold text-sm md:text-base text-emerald-900">Download Feature</h4>
                </div>
                <ul className="text-xs md:text-sm text-emerald-800 space-y-1">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1"></div>
                    <span>High-quality PNG & JPEG formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1"></div>
                    <span>Mobile-friendly download options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1"></div>
                    <span>draftmasterfc.com watermark included</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-3 md:p-4 lg:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl border border-blue-100">
              <h4 className="font-bold text-sm md:text-base mb-2 md:mb-3 text-blue-900 flex items-center gap-2">
                <Settings className="w-3 h-3 md:w-4 md:h-4" />
                How to Use
              </h4>
              <ul className="text-xs md:text-sm text-blue-800 space-y-1 md:space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
                  <span>Drag players to position them</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
                  <span>Click player name or club to edit</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
                  <span>Hover over player (desktop) or tap color button (mobile) to change jersey color</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
                  <span>Use toggles to show/hide names, clubs & team info</span>
                </li>
              </ul>
            </div>

            {/* Mobile Save Button */}
            {isMobile && (
              <button className="w-full mt-6 py-4 bg-gradient-to-r from-zinc-900 to-black text-white font-black rounded-2xl text-sm tracking-widest shadow-xl hover:opacity-90 transition-all duration-300 active:scale-95 uppercase flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Save Lineup
              </button>
            )}
          </div>
        </div>

        {/* Sticky Save Button - Desktop only */}
        {!isMobile && (
          <div className="hidden lg:block p-6 bg-gradient-to-r from-white to-zinc-50 border-t border-zinc-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] flex justify-center">
            <button 
              onClick={() => setShowDownloadOptions(true)}
              className="w-full max-w-sm py-5 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white font-black rounded-2xl text-base tracking-widest shadow-2xl hover:shadow-3xl transition-all duration-300 active:scale-95 uppercase flex items-center justify-center gap-3"
            >
              <Download className="w-5 h-5" />
              Download & Export Lineup
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PitchPreview;