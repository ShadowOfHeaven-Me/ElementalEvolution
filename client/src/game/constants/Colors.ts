// Color constants for the game

// Element colors
export const ELEMENT_COLORS = {
  // Subatomic path
  electron: "#8a2be2", // BlueViolet
  quark: "#ff6347",    // Tomato
  atom: "#4682b4",     // SteelBlue
  molecule: "#32cd32", // LimeGreen
  
  // Stellar path
  hydrogen: "#87cefa", // LightSkyBlue
  star: "#ffd700",     // Gold
  neutronStar: "#00ffff", // Cyan
  blackHole: "#000000", // Black with glow effect
  
  // Spacetime path
  quantumFluctuation: "#da70d6", // Orchid
  wormhole: "#9370db",  // MediumPurple
  timeDistortion: "#ff00ff", // Magenta
};

// UI colors
export const UI_COLORS = {
  background: "#1e1e2f",
  primary: "#6c5ce7",
  secondary: "#a29bfe",
  accent: "#fd79a8",
  text: "#f5f6fa",
  textSecondary: "#dcdde1",
  danger: "#ff7675",
  success: "#55efc4",
  warning: "#ffeaa7",
};

// Get a color with alpha
export function withAlpha(color: string, alpha: number): string {
  // Check if color is hex
  if (color.startsWith("#")) {
    // Convert hex to rgb
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // If already rgba, replace alpha
  if (color.startsWith("rgba")) {
    return color.replace(/[\d\.]+\)$/, `${alpha})`);
  }
  
  // If rgb, convert to rgba
  if (color.startsWith("rgb")) {
    return color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
  }
  
  // Default fallback
  return color;
}
