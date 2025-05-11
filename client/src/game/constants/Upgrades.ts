import { ELEMENT_COLORS } from "./Colors";

export interface UpgradeStat {
  name: string;
  value: number;
}

export interface UpgradeOption {
  id: string;
  name: string;
  description: string;
  level: number;
  path: string;
  color: string;
  stats: UpgradeStat[];
}

// Define upgrade paths
const UPGRADE_PATHS = {
  SUBATOMIC: "Subatomic",
  STELLAR: "Stellar",
  SPACETIME: "Spacetime"
};

// Define all possible upgrades
const ALL_UPGRADES: UpgradeOption[] = [
  // Level 2 Upgrades (Path Selection)
  {
    id: "electron",
    name: "Electron",
    description: "Fast and agile subatomic particle with negative charge",
    level: 2,
    path: UPGRADE_PATHS.SUBATOMIC,
    color: ELEMENT_COLORS.electron,
    stats: [
      { name: "Speed", value: 50 },
      { name: "Reload", value: 10 },
      { name: "Size", value: 2 }
    ]
  },
  {
    id: "hydrogen",
    name: "Hydrogen Cloud",
    description: "Primordial gas that forms stars",
    level: 2,
    path: UPGRADE_PATHS.STELLAR,
    color: ELEMENT_COLORS.hydrogen,
    stats: [
      { name: "Health", value: 30 },
      { name: "Size", value: 5 },
      { name: "Damage", value: 5 }
    ]
  },
  {
    id: "quantum_fluctuation",
    name: "Quantum Fluctuation",
    description: "Unpredictable energy that bends spacetime",
    level: 2,
    path: UPGRADE_PATHS.SPACETIME,
    color: ELEMENT_COLORS.quantumFluctuation,
    stats: [
      { name: "Speed", value: 25 },
      { name: "Damage", value: 10 },
      { name: "Reload", value: 5 }
    ]
  },
  
  // Level 3 Upgrades
  // Subatomic path
  {
    id: "quark",
    name: "Quark",
    description: "Fundamental constituent of matter",
    level: 3,
    path: UPGRADE_PATHS.SUBATOMIC,
    color: ELEMENT_COLORS.quark,
    stats: [
      { name: "Damage", value: 15 },
      { name: "Speed", value: 20 },
      { name: "Reload", value: 15 }
    ]
  },
  // Stellar path
  {
    id: "star",
    name: "Star",
    description: "Massive, luminous sphere of plasma",
    level: 3,
    path: UPGRADE_PATHS.STELLAR,
    color: ELEMENT_COLORS.star,
    stats: [
      { name: "Health", value: 50 },
      { name: "Size", value: 10 },
      { name: "Damage", value: 20 }
    ]
  },
  // Spacetime path
  {
    id: "wormhole",
    name: "Wormhole",
    description: "Connection between different points in spacetime",
    level: 3,
    path: UPGRADE_PATHS.SPACETIME,
    color: ELEMENT_COLORS.wormhole,
    stats: [
      { name: "Speed", value: 40 },
      { name: "Reload", value: 20 },
      { name: "Damage", value: 10 }
    ]
  },
  
  // Level 4 Upgrades
  // Subatomic path
  {
    id: "atom",
    name: "Atom",
    description: "Basic unit of matter with balanced charges",
    level: 4,
    path: UPGRADE_PATHS.SUBATOMIC,
    color: ELEMENT_COLORS.atom,
    stats: [
      { name: "Health", value: 40 },
      { name: "Damage", value: 20 },
      { name: "Size", value: 5 }
    ]
  },
  // Stellar path
  {
    id: "neutron_star",
    name: "Neutron Star",
    description: "Extremely dense remnant of a massive star",
    level: 4,
    path: UPGRADE_PATHS.STELLAR,
    color: ELEMENT_COLORS.neutronStar,
    stats: [
      { name: "Health", value: 80 },
      { name: "Damage", value: 30 },
      { name: "Size", value: -5 } // Smaller but more powerful
    ]
  },
  // Spacetime path
  {
    id: "time_distortion",
    name: "Time Distortion",
    description: "Manipulation of the flow of time",
    level: 4,
    path: UPGRADE_PATHS.SPACETIME,
    color: ELEMENT_COLORS.timeDistortion,
    stats: [
      { name: "Speed", value: 30 },
      { name: "Reload", value: 25 },
      { name: "Damage", value: 20 }
    ]
  },
  
  // Level 5 Upgrades (Final forms)
  // Subatomic path
  {
    id: "molecule",
    name: "Complex Molecule",
    description: "Stable arrangement of atoms forming complex structures",
    level: 5,
    path: UPGRADE_PATHS.SUBATOMIC,
    color: ELEMENT_COLORS.molecule,
    stats: [
      { name: "Health", value: 60 },
      { name: "Damage", value: 25 },
      { name: "Size", value: 10 },
      { name: "Reload", value: 10 }
    ]
  },
  // Stellar path
  {
    id: "black_hole",
    name: "Black Hole",
    description: "Region of spacetime with gravitational pull so strong nothing can escape",
    level: 5,
    path: UPGRADE_PATHS.STELLAR,
    color: ELEMENT_COLORS.blackHole,
    stats: [
      { name: "Health", value: 100 },
      { name: "Damage", value: 40 },
      { name: "Size", value: 15 },
      { name: "Speed", value: -20 } // Slower but extremely powerful
    ]
  },
  // Spacetime path
  {
    id: "cosmic_string",
    name: "Cosmic String",
    description: "One-dimensional defect in the fabric of spacetime",
    level: 5,
    path: UPGRADE_PATHS.SPACETIME,
    color: ELEMENT_COLORS.timeDistortion,
    stats: [
      { name: "Speed", value: 50 },
      { name: "Reload", value: 30 },
      { name: "Damage", value: 30 },
      { name: "Health", value: 40 }
    ]
  }
];

// Get upgrades for a specific level and path
export function getUpgradesForLevel(level: number, path?: string): UpgradeOption[] {
  if (level === 2) {
    // For level 2, always show all path options
    return ALL_UPGRADES.filter(upgrade => upgrade.level === 2);
  } else {
    // For higher levels, filter by path and level
    return ALL_UPGRADES.filter(upgrade => 
      upgrade.level === level && 
      (!path || upgrade.path === path)
    );
  }
}
