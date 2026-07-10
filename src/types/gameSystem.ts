export type GameSystemId =
  | 'dnd5e'
  | 'dnd5e-2024'
  | 'pathfinder2e'
  | 'pathfinder1e'
  | 'vampire-v5'
  | 'call-of-cthulhu'
  | 'shadowrun'
  | 'fate-core'
  | 'blades-in-dark'
  | 'mork-borg'
  | 'pirate-borg'
  | 'cy-borg'
  | 'mothership'
  | 'warhammer-frp'
  | 'stars-without-number'
  | 'worlds-without-number'
  | 'old-school-essentials'
  | 'dungeon-world'
  | 'savage-worlds'
  | 'generic';

export interface GameSystem {
  id: GameSystemId;
  name: string;
  publisher: string;
  genre: string[];
  icon: string;
}
