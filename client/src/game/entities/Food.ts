import { Entity } from "./Entity";
import { Vector } from "../utils/Vector";
import { getRandomColor } from "../utils/MathUtils";

export class Food extends Entity {
  value: number;
  
  constructor({
    id,
    position,
    radius,
    color,
    value
  }: {
    id: string;
    position: Vector;
    radius: number;
    color: string;
    value: number;
  }) {
    super({ id, position, radius, color });
    this.value = value;
  }
  
  // Create a random food entity
  static createRandom(worldSize: number): Food {
    const radius = Math.random() * 5 + 2; // Random size between 2-7
    const x = Math.random() * (worldSize - 2 * radius) + radius;
    const y = Math.random() * (worldSize - 2 * radius) + radius;
    const position = new Vector(x, y);
    const value = Math.floor(radius * 2); // Value based on size
    
    // Get a color based on value (bigger = more valuable)
    const colors = [
      "#c39bd3", // lavender - low value
      "#7fb3d5", // light blue - medium value
      "#f9e79f", // light yellow - higher value
      "#f5b041"  // orange - highest value
    ];
    
    const colorIndex = Math.min(Math.floor(value / 4), colors.length - 1);
    const color = colors[colorIndex];
    
    return new Food({
      id: `food-${Date.now()}-${Math.random()}`,
      position,
      radius,
      color,
      value
    });
  }
}
