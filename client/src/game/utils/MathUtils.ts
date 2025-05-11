import { Food } from "../entities/Food";
import { Enemy } from "../entities/Enemy";
import { Vector } from "./Vector";

// Get a random number between min and max
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Get a random integer between min and max (inclusive)
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get a random color in hex format
export function getRandomColor(): string {
  // Pastel colors for better visibility
  const hue = Math.floor(Math.random() * 360);
  const saturation = randomRange(60, 80);
  const lightness = randomRange(65, 80);
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Clamp a value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Linear interpolation
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Map a value from one range to another
export function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

// Get a random position within world bounds
export function randomPosition(worldSize: number, margin: number = 0): Vector {
  const x = randomRange(margin, worldSize - margin);
  const y = randomRange(margin, worldSize - margin);
  return new Vector(x, y);
}

// Create initial entities for the game
export function createInitialEntities(worldSize: number): (Food | Enemy)[] {
  try {
    console.log("Creating initial entities for world size:", worldSize);
    const entities: (Food | Enemy)[] = [];
    
    // Create food particles (reduced count for performance)
    const foodCount = Math.floor(worldSize / 100); // Reduced from 40 to 100
    console.log("Creating food particles:", foodCount);
    
    for (let i = 0; i < foodCount; i++) {
      try {
        const food = Food.createRandom(worldSize);
        entities.push(food);
      } catch (err) {
        console.error("Error creating food:", err);
      }
    }
    
    // Create enemies of different levels (reduced count for performance)
    const enemyCount = Math.floor(worldSize / 800); // Reduced from 400 to 800
    console.log("Creating enemies:", enemyCount);
    
    for (let i = 0; i < enemyCount; i++) {
      try {
        // Create enemies with different levels (1-5)
        const level = Math.floor(Math.random() * 5) + 1;
        const enemy = Enemy.createRandom(worldSize, level);
        entities.push(enemy);
      } catch (err) {
        console.error("Error creating enemy:", err);
      }
    }
    
    console.log("Created entities:", entities.length);
    return entities;
  } catch (err) {
    console.error("Error in createInitialEntities:", err);
    return []; // Return empty array to prevent crashes
  }
}

// Calculate distance between two entities without creating Vector objects
export function distanceBetween(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

// Check if a point is inside a circle
export function pointInCircle(
  px: number, py: number, 
  cx: number, cy: number, 
  radius: number
): boolean {
  const distanceSquared = (px - cx) * (px - cx) + (py - cy) * (py - cy);
  return distanceSquared <= radius * radius;
}
