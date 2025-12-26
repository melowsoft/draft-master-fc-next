// formations.ts
import { Formation, FormationPosition, Position } from './types';

const createPosition = (id: string, x: number, y: number, position: Position): FormationPosition => ({
  id,
  x,
  y,
  position,
});

export const formations: Formation[] = [
  {
    id: '4-4-2',
    name: '4-4-2 Classic',
    description: 'Balanced',
    positions: [
      createPosition('gk', 50, 15, 'GKP'),
      // Back 4: Same x positions as midfield 4, just different y
      createPosition('lb', 20, 35, 'DEF'),    // Match LM x:20
      createPosition('cb1', 40, 35, 'DEF'),   // Match CM1 x:40
      createPosition('cb2', 60, 35, 'DEF'),   // Match CM2 x:60
      createPosition('rb', 80, 35, 'DEF'),    // Match RM x:80
      // Midfield 4
      createPosition('lm', 20, 55, 'MID'),
      createPosition('cm1', 40, 55, 'MID'),
      createPosition('cm2', 60, 55, 'MID'),
      createPosition('rm', 80, 55, 'MID'),
      // Forwards 2
      createPosition('st1', 35, 75, 'FWD'),
      createPosition('st2', 65, 75, 'FWD'),
    ],
  },
  {
    id: '4-3-3',
    name: '4-3-3 Attacking',
    description: 'Offensive',
    positions: [
      createPosition('gk', 50, 15, 'GKP'),
      // Back 4: Use same spacing pattern as midfield would have
      createPosition('lb', 20, 35, 'DEF'),
      createPosition('cb1', 40, 35, 'DEF'),
      createPosition('cb2', 60, 35, 'DEF'),
      createPosition('rb', 80, 35, 'DEF'),
      // Midfield 3 - centered with same spread
      createPosition('cm1', 30, 55, 'MID'),
      createPosition('cm2', 50, 55, 'MID'),
      createPosition('cm3', 70, 55, 'MID'),
      // Forwards 3 - also same spread
      createPosition('lw', 30, 75, 'FWD'),
      createPosition('st', 50, 75, 'FWD'),
      createPosition('rw', 70, 75, 'FWD'),
    ],
  },
  {
    id: '4-2-3-1',
    name: '4-2-3-1 Modern',
    description: 'Attacking Midfield',
    positions: [
      createPosition('gk', 50, 15, 'GKP'),
      // Back 4: Consistent spacing
      createPosition('lb', 20, 35, 'DEF'),
      createPosition('cb1', 40, 35, 'DEF'),
      createPosition('cb2', 60, 35, 'DEF'),
      createPosition('rb', 80, 35, 'DEF'),
      // Defensive midfield 2
      createPosition('cdm1', 40, 50, 'MID'),
      createPosition('cdm2', 60, 50, 'MID'),
      // Attacking midfield 3
      createPosition('lw', 20, 60, 'MID'),
      createPosition('cam', 50, 60, 'MID'),
      createPosition('rw', 80, 60, 'MID'),
      // Striker
      createPosition('st', 50, 75, 'FWD'),
    ],
  },
  {
    id: '4-1-4-1',
    name: '4-1-4-1 Defensive',
    description: 'Counter Attack',
    positions: [
      createPosition('gk', 50, 15, 'GKP'),
      // Back 4
      createPosition('lb', 20, 35, 'DEF'),
      createPosition('cb1', 40, 35, 'DEF'),
      createPosition('cb2', 60, 35, 'DEF'),
      createPosition('rb', 80, 35, 'DEF'),
      // Defensive midfielder
      createPosition('cdm', 50, 45, 'MID'),
      // Midfield 4 (same as back 4 spacing)
      createPosition('lm', 20, 55, 'MID'),
      createPosition('cm1', 40, 55, 'MID'),
      createPosition('cm2', 60, 55, 'MID'),
      createPosition('rm', 80, 55, 'MID'),
      // Striker
      createPosition('st', 50, 75, 'FWD'),
    ],
  },
  {
    id: '3-5-2',
    name: '3-5-2 Wing Play',
    description: 'Midfield Control',
    positions: [
      createPosition('gk', 50, 15, 'GKP'),
      // Back 3 - centered with good spacing
      createPosition('cb1', 30, 35, 'DEF'),
      createPosition('cb2', 50, 35, 'DEF'),
      createPosition('cb3', 70, 35, 'DEF'),
      // Midfield 5 - wingers wide, central mids closer
      createPosition('lm', 15, 55, 'MID'),
      createPosition('cm1', 35, 55, 'MID'),
      createPosition('cdm', 50, 55, 'MID'),
      createPosition('cm2', 65, 55, 'MID'),
      createPosition('rm', 85, 55, 'MID'),
      // Forwards 2
      createPosition('st1', 35, 75, 'FWD'),
      createPosition('st2', 65, 75, 'FWD'),
    ],
  },
  {
    id: '5-3-2',
    name: '5-3-2 Defensive',
    description: 'Solid Defense',
    positions: [
      createPosition('gk', 50, 15, 'GKP'),
      // Back 5 - wing backs wider, center backs tighter
      createPosition('lwb', 15, 35, 'DEF'),
      createPosition('cb1', 30, 35, 'DEF'),
      createPosition('cb2', 50, 35, 'DEF'),
      createPosition('cb3', 70, 35, 'DEF'),
      createPosition('rwb', 85, 35, 'DEF'),
      // Midfield 3
      createPosition('cm1', 30, 55, 'MID'),
      createPosition('cm2', 50, 55, 'MID'),
      createPosition('cm3', 70, 55, 'MID'),
      // Forwards 2
      createPosition('st1', 35, 75, 'FWD'),
      createPosition('st2', 65, 75, 'FWD'),
    ],
  },
];

export function getFormationById(id: string): Formation | undefined {
  return formations.find(f => f.id === id);
}

export function getDefaultFormation(): Formation {
  return formations[0];
}