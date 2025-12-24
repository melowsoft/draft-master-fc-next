'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  X, Download, Share2, Palette, Save, Zap, 
  Trophy, Grid3x3, Eye, Type, Building,
  CheckSquare, Square, Edit2, Edit3, Settings,
  PenTool, User, Camera, Goal, Menu, ChevronLeft
} from 'lucide-react';
import html2canvas from 'html2canvas';

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
  const [teamName, setTeamName] = useState('Team Name Here');
  const [managerName, setManagerName] = useState('Manager Name Here');
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [isEditingManagerName, setIsEditingManagerName] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Mobile State
  const [isMobile, setIsMobile] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  
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

  // Realistic Goal Component for Interactive Pitch
  const GoalPost = ({ position = 'top' }: { position: 'top' | 'bottom' }) => (
    <div className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-1/2 -translate-x-1/2 w-[90%] h-16 md:h-24 pointer-events-none z-0`}>
      {/* Goal Box - 6-yard box */}
      <div className={`absolute ${position === 'top' ? 'top-16 md:top-24' : 'bottom-16 md:bottom-24'} left-1/2 -translate-x-1/2 w-[40%] h-10 md:h-16 border-2 border-white/50 ${position === 'top' ? 'border-t-0 rounded-b-lg' : 'border-b-0 rounded-t-lg'}`}>
        {/* Box lines */}
      </div>
      
      {/* Penalty Spot */}
      <div className={`absolute ${position === 'top' ? 'top-28 md:top-40' : 'bottom-28 md:bottom-40'} left-1/2 -translate-x-1/2 w-2 md:w-3 h-2 md:h-3 bg-white rounded-full shadow-lg`}></div>
      
      {/* D-arc (penalty arc) */}
      <div className={`absolute ${position === 'top' ? 'top-24 md:top-36' : 'bottom-24 md:bottom-36'} left-1/2 -translate-x-1/2 w-24 md:w-32 h-12 md:h-16 border-2 border-white/30 ${position === 'top' ? 'border-t-0 rounded-b-full' : 'border-b-0 rounded-t-full'}`}></div>
    </div>
  );

  // Download pitch as image
  const downloadPitchImage = async () => {
    if (!downloadRef.current || isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '1200px';
      container.style.height = '1600px';
      container.style.background = 'white';
      container.style.padding = '30px';
      document.body.appendChild(container);
      
      const cleanPitchHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; gap: 30px; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <!-- Team Header - Mobile Optimized -->
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
            <h1 style="font-size: 36px; font-weight: 900; color: #111827; margin: 0 0 12px 0; letter-spacing: -0.5px; line-height: 1.2;">${teamName}</h1>
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
              <svg width="20" height="20" fill="#6b7280" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <p style="font-size: 22px; color: #4b5563; margin: 0; font-weight: 500; line-height: 1.3;">${managerName}</p>
            </div>
          </div>
          
          <!-- Formation Info - Above pitch on mobile -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(to right, #f8fafc, #f1f5f9); padding: 15px 20px; border-radius: 12px; border: 2px solid #e2e8f0; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: white; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                <svg width="16" height="16" fill="#3b82f6" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9v-2h4v-2H9V9h4V7H9V5h6v4z"/>
                </svg>
              </div>
              <div>
                <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 2px;">FORMATION</div>
                <div style="font-size: 24px; color: #1e293b; font-weight: 900; letter-spacing: 0.5px;">${selectedFormation}</div>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: ${pitchTheme === 'green' ? '#a7d9b9' : pitchTheme === 'blue' ? '#93c5fd' : pitchTheme === 'classic' ? '#d4d4d4' : '#1f2937'}; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"></div>
              <div style="font-size: 14px; color: #475569; font-weight: 600;">${pitchTheme.charAt(0).toUpperCase() + pitchTheme.slice(1)}</div>
            </div>
          </div>
          
          <!-- Pitch Container -->
          <div style="flex: 1; position: relative; display: flex; flex-direction: column;">
            <!-- Main Pitch - Mobile Optimized -->
            <div style="flex: 1; min-height: 0; position: relative; border-radius: 20px; overflow: hidden; background: linear-gradient(to bottom, ${pitchTheme === 'green' ? '#a7d9b9' : pitchTheme === 'blue' ? '#93c5fd' : pitchTheme === 'classic' ? '#d4d4d4' : '#1f2937'}, ${pitchTheme === 'green' ? '#8bc9a6' : pitchTheme === 'blue' ? '#60a5fa' : pitchTheme === 'classic' ? '#a3a3a3' : '#111827'});">
              <!-- Pitch Outline -->
              <div style="position: absolute; inset: 25px; border: 3px solid rgba(255,255,255,0.6); border-radius: 16px;"></div>
              
              <!-- Center Line -->
              <div style="position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: rgba(255,255,255,0.6);"></div>
              
              <!-- Center Circle -->
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 250px; height: 250px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.6);"></div>
              
              <!-- Center Spot -->
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: white; border-radius: 50%; border: 1px solid rgba(0,0,0,0.2); box-shadow: 0 1px 2px rgba(0,0,0,0.2);"></div>
              
              <!-- TOP Goal Area -->
              <div style="position: absolute; top: 25px; left: 50%; transform: translateX(-50%); width: 85%; height: 80px;">
              
                <!-- Penalty Area -->
                <div style="position: absolute; top: 80px; left: 50%; transform: translateX(-50%); width: 70%; height: 100px; border: 2px solid rgba(255,255,255,0.6); border-top: none; border-radius: 0 0 18px 18px;"></div>
                
                <!-- Penalty Spot -->
                <div style="position: absolute; top: 180px; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: white; border-radius: 50%; border: 1px solid rgba(0,0,0,0.2); box-shadow: 0 1px 2px rgba(0,0,0,0.2);"></div>
                
                <!-- D-arc -->
                <div style="position: absolute; top: 180px; left: 50%; transform: translateX(-50%); width: 200px; height: 100px; border: 2px solid rgba(255,255,255,0.6); border-top: none; border-radius: 0 0 100px 100px;"></div>
              </div>
              
              <!-- BOTTOM Goal Area -->
              <div style="position: absolute; bottom: 25px; left: 50%; transform: translateX(-50%); width: 85%; height: 80px;">
               
                <!-- Penalty Area -->
                <div style="position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); width: 70%; height: 100px; border: 2px solid rgba(255,255,255,0.6); border-bottom: none; border-radius: 18px 18px 0 0;"></div>
                
                <!-- Penalty Spot -->
                <div style="position: absolute; bottom: 180px; left: 50%; transform: translate(-50%, 50%); width: 8px; height: 8px; background: white; border-radius: 50%; border: 1px solid rgba(0,0,0,0.2); box-shadow: 0 1px 2px rgba(0,0,0,0.2);"></div>
                
                <!-- D-arc -->
                <div style="position: absolute; bottom: 180px; left: 50%; transform: translateX(-50%); width: 200px; height: 100px; border: 2px solid rgba(255,255,255,0.6); border-bottom: none; border-radius: 100px 100px 0 0;"></div>
              </div>
              
              <!-- Players -->
              ${players.map(p => {
                const shouldShowName = p.showName !== undefined ? p.showName : globalShowNames;
                const shouldShowClub = p.showClub !== undefined ? p.showClub : globalShowClubs;
                
                // Calculate position based on current pitch design
                const playerX = p.x;
                const playerY = p.y;
                
                return `
                  <div style="position: absolute; left: ${playerX}%; top: ${playerY}%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; z-index: 10;">
                    <!-- Jersey -->
                    <div style="position: relative; margin-bottom: 4px;">
                      <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; display: flex; box-shadow: 0 6px 15px rgba(0,0,0,0.15); border: 3px solid rgba(255,255,255,0.4);">
                        <div style="flex: 1; background: ${p.colors[0]};"></div>
                        <div style="flex: 1; background: ${p.colors[1]};"></div>
                      </div>
                      <!-- Position -->
                      <div style="position: absolute; bottom: -5px; right: -5px; width: 20px; height: 20px; background: rgba(255,255,255,0.95); color: black; font-size: 9px; font-weight: 900; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid #d1d5db; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        ${p.position}
                      </div>
                      <!-- Captain/Vice Badge -->
                      ${p.role ? `
                        <div style="position: absolute; top: -6px; right: -6px; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.15); background: ${p.role === 'C' ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};">
                          <span style="color: white; font-size: 11px; font-weight: 900;">${p.role}</span>
                        </div>
                      ` : ''}
                    </div>
                    
                    <!-- Name -->
                    ${shouldShowName ? `
                      <div style="background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 6px; margin-bottom: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                        <span style="color: black; font-size: 12px; font-weight: 900; white-space: nowrap; letter-spacing: -0.1px;">${p.name}</span>
                      </div>
                    ` : ''}
                    
                    <!-- Club -->
                    ${shouldShowClub ? `
                      <div style="background: white; padding: 5px 12px; border-radius: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
                        <span style="color: #4b5563; font-size: 10px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">${p.club}</span>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
              
              <!-- Position Labels -->
              <div style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; gap: 40px; color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 900; backdrop-filter: blur(4px); background: rgba(0,0,0,0.2); padding: 8px 24px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2); z-index: 5;">
                <span>DEF</span>
                <span>MID</span>
                <span>ATT</span>
              </div>
            </div>
            
            <!-- Footer Info - Mobile Optimized -->
            <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 20px;">
              <!-- Display Settings Summary -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="padding: 10px; background: ${globalShowNames ? '#f0fdf4' : '#fef2f2'}; border-radius: 8px; border: 1px solid ${globalShowNames ? '#dcfce7' : '#fee2e2'};">
                  <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 4px;">PLAYER NAMES</div>
                  <div style="font-size: 14px; color: ${globalShowNames ? '#166534' : '#dc2626'}; font-weight: 700;">
                    ${globalShowNames ? 'VISIBLE' : 'HIDDEN'}
                  </div>
                </div>
                <div style="padding: 10px; background: ${globalShowClubs ? '#f0fdf4' : '#fef2f2'}; border-radius: 8px; border: 1px solid ${globalShowClubs ? '#dcfce7' : '#fee2e2'};">
                  <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 4px;">CLUB BADGES</div>
                  <div style="font-size: 14px; color: ${globalShowClubs ? '#166534' : '#dc2626'}; font-weight: 700;">
                    ${globalShowClubs ? 'VISIBLE' : 'HIDDEN'}
                  </div>
                </div>
              </div>
              
              <!-- Watermark and Info -->
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <!-- Watermark -->
                <div style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" fill="#4b5563" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span style="color: #4b5563; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">draftmasterfc.com</span>
                </div>
                
                <!-- Date -->
                <div style="text-align: right;">
                  <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 2px;">CREATED</div>
                  <div style="font-size: 13px; color: #475569; font-weight: 700;">
                    ${new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer Note -->
          <div style="padding: 15px; background: linear-gradient(to right, #f8fafc, #f1f5f9); border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <div style="width: 20px; height: 20px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center;">
                <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <span style="font-size: 14px; font-weight: 700; color: #1e293b;">Lineup created with DraftMaster FC</span>
            </div>
            <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.4;">
              All player positions and formations are customizable. Share your lineup on social media with #DraftMasterFC
            </p>
          </div>
        </div>
      `;
      
      container.innerHTML = cleanPitchHTML;
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(container, {
        scale: 3, // Higher scale for mobile clarity
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        allowTaint: true,
        width: container.offsetWidth,
        height: container.offsetHeight,
        onclone: (clonedDoc) => {
          const images = clonedDoc.querySelectorAll('img');
          const promises = Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          });
          return Promise.all(promises);
        }
      });
      
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sanitizedTeamName = teamName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      const filename = `draftmaster-fc-${sanitizedTeamName}-${timestamp}.png`;
      
      link.download = filename;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      document.body.removeChild(container);
      
    } catch (error) {
      console.error('Error downloading pitch:', error);
      alert('Failed to download lineup. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Render player component for the interactive view
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
        <div className="relative mb-0.5 md:mb-1">
          {/* Jersey Circle */}
          <div className="relative w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden flex shadow-lg md:shadow-xl border-2 border-white/30 group-hover:scale-110 transition-transform duration-200">
            <div style={{ backgroundColor: p.colors[0] }} className="flex-1"></div>
            <div style={{ backgroundColor: p.colors[1] }} className="flex-1"></div>
            
            {/* Position Badge */}
            <div className="absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-white/95 text-black text-[7px] md:text-[8px] lg:text-[9px] font-black rounded-full flex items-center justify-center border border-zinc-300 shadow-sm md:shadow-md">
              {p.position}
            </div>
          </div>

          {/* Captain/Vice Badge */}
          {p.role && (
            <div className={`absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center border-2 md:border-3 border-white shadow-md md:shadow-lg
              ${p.role === 'C' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
              <span className="text-white text-xs md:text-sm font-black drop-shadow-sm">{p.role}</span>
            </div>
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
              onClick={() => {
                const randomColors: [string, string] = [
                  `#${Math.floor(Math.random()*16777215).toString(16)}`,
                  `#${Math.floor(Math.random()*16777215).toString(16)}`
                ];
                customizeJersey(p.id, randomColors);
              }}
              className="p-1.5 md:p-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl hover:scale-110"
              title="Random Jersey"
            >
              <Palette className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
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

  return (
    <>
      <div ref={downloadRef} style={{ position: 'absolute', left: '-9999px', top: 0 }}></div>
      
      <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-white to-zinc-50 rounded-2xl md:rounded-[40px] shadow-xl md:shadow-2xl overflow-hidden text-black border border-zinc-200">
        {/* Mobile Header Controls */}
        {isMobile && (
          <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-zinc-100">
            <button 
              onClick={() => setShowSidePanel(true)}
              className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors"
              title="Open Settings"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h2 className="text-lg font-black text-zinc-900 truncate max-w-[200px] mx-auto">{teamName}</h2>
              <p className="text-xs text-zinc-500 truncate">{managerName}</p>
            </div>
            
            <div className="p-2">
            
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
              <button className="p-2 lg:p-3 text-zinc-400 hover:bg-zinc-50 rounded-full transition-colors shadow-sm hover:shadow-md">
                <X className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>

            <div className="absolute left-6 lg:left-8 top-6 lg:top-8">
              <Settings className="w-5 h-5 lg:w-6 lg:h-6 text-zinc-400" />
            </div>

            <div className="text-center max-w-xl px-4">
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
                    className={`px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-full text-xs md:text-sm font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap ${selectedFormation === f.id ? 'bg-gradient-to-r from-zinc-900 to-black text-white shadow-lg scale-105' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
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
              className={`relative aspect-[3/4] ${pitchThemes[pitchTheme]} overflow-hidden touch-none rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg md:shadow-xl lg:shadow-2xl border-4 md:border-6 lg:border-8 border-white/60`}
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
                  onClick={downloadPitchImage}
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
                      <Share2 className="w-4 h-4 md:w-5 md:h-5 text-zinc-600" />
                    </button>
                    <button className="p-2 md:p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl active:scale-90 transition-all duration-200">
                      <Save className="w-4 h-4 md:w-5 md:h-5" />
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
                  onClick={downloadPitchImage}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  {isDownloading ? (
                    <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Download
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
                <div className="w-10"></div> {/* Spacer for centering */}
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
              </div>

              {/* Current Settings Status */}
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl border border-blue-100">
                <div className="text-xs md:text-sm font-bold text-blue-900 mb-1 md:mb-2">Current Settings:</div>
                <div className="grid grid-cols-2 gap-2">
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
                    onClick={() => {
                      if (players.length >= 2) {
                        const i1 = Math.floor(Math.random() * players.length);
                        let i2 = Math.floor(Math.random() * players.length);
                        while (i2 === i1) i2 = Math.floor(Math.random() * players.length);
                        swapPlayers(players[i1].id, players[i2].id);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl md:rounded-2xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-sm md:text-base"
                  >
                    <Palette className="w-4 h-4 md:w-5 md:h-5" />
                    Swap Random Players
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
                    <span>High-quality PNG image</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1"></div>
                    <span>Realistic pitch markings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1"></div>
                    <span>draftmasterfc.com watermark</span>
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
                  <span>Use toggles to show/hide names & clubs</span>
                </li>
                {!isMobile && (
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
                    <span>Hover players for captain/vice actions</span>
                  </li>
                )}
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
            <button className="w-full max-w-sm py-5 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white font-black rounded-2xl text-base tracking-widest shadow-2xl hover:shadow-3xl transition-all duration-300 active:scale-95 uppercase flex items-center justify-center gap-3">
              <Save className="w-5 h-5" />
              Save & Export Lineup
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PitchPreview;