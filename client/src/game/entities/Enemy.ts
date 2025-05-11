import { Entity } from "./Entity";
import { Player } from "./Player";
import { Vector } from "../utils/Vector";
import { getRandomColor } from "../utils/MathUtils";

export class Enemy extends Entity {
  speed: number;
  health: number;
  maxHealth: number;
  level: number;
  aggroRange: number;
  behavior: "passive" | "aggressive" | "neutral";
  lastDirectionChange: number;
  directionChangeInterval: number;
  target: Vector | null;
  
  constructor({
    id,
    position,
    radius,
    color,
    speed,
    health,
    level,
    behavior
  }: {
    id: string;
    position: Vector;
    radius: number;
    color: string;
    speed: number;
    health: number;
    level: number;
    behavior: "passive" | "aggressive" | "neutral";
  }) {
    super({ id, position, radius, color });
    
    this.speed = speed;
    this.health = health;
    this.maxHealth = health;
    this.level = level;
    this.aggroRange = radius * 10; // Aggro range is 10x the radius
    this.behavior = behavior;
    this.lastDirectionChange = 0;
    this.directionChangeInterval = Math.random() * 2 + 1; // Random interval between 1-3 seconds
    this.target = null;
    
    // Set initial random velocity for passive and neutral enemies
    if (behavior !== "aggressive") {
      const angle = Math.random() * Math.PI * 2;
      this.velocity = new Vector(
        Math.cos(angle) * this.speed * 0.5,
        Math.sin(angle) * this.speed * 0.5
      );
    }
  }
  
  // Update enemy behavior
  update(deltaTime: number, player: Player | null): void {
    super.update(deltaTime, player);
    
    // Update direction change timer
    this.lastDirectionChange += deltaTime;
    
    if (this.behavior === "aggressive" && player) {
      // Aggressive enemies always chase the player
      this.chasePlayer(player, deltaTime);
    } else if (this.behavior === "neutral" && player) {
      // Neutral enemies chase the player if within aggro range, otherwise wander
      const distanceToPlayer = this.position.distanceTo(player.position);
      
      if (distanceToPlayer <= this.aggroRange) {
        this.chasePlayer(player, deltaTime);
      } else {
        this.wander(deltaTime);
      }
    } else {
      // Passive enemies just wander around
      this.wander(deltaTime);
    }
  }
  
  // Chase the player
  chasePlayer(player: Player, deltaTime: number): void {
    const direction = player.position.subtract(this.position).normalize();
    this.velocity = direction.multiply(this.speed);
  }
  
  // Wander randomly
  wander(deltaTime: number): void {
    // Change direction randomly
    if (this.lastDirectionChange >= this.directionChangeInterval) {
      const angle = Math.random() * Math.PI * 2;
      this.velocity = new Vector(
        Math.cos(angle) * this.speed * 0.5,
        Math.sin(angle) * this.speed * 0.5
      );
      
      this.lastDirectionChange = 0;
      this.directionChangeInterval = Math.random() * 2 + 1; // New random interval
    }
  }
  
  // Take damage
  takeDamage(amount: number): void {
    this.health -= amount;
    
    // Clamp health to 0
    if (this.health < 0) {
      this.health = 0;
    }
  }
  
  // Respawn the enemy at a random location
  respawn(worldSize: number): void {
    // Random position away from borders
    const margin = this.radius * 2;
    const x = Math.random() * (worldSize - 2 * margin) + margin;
    const y = Math.random() * (worldSize - 2 * margin) + margin;
    this.position = new Vector(x, y);
    
    // Reset health
    this.health = this.maxHealth;
    
    // Random behavior based on level
    const behaviors: ("passive" | "aggressive" | "neutral")[] = ["passive", "neutral", "aggressive"];
    const behaviorIndex = Math.min(Math.floor(this.level / 2), behaviors.length - 1);
    this.behavior = behaviors[behaviorIndex];
    
    // Reset direction change timer
    this.lastDirectionChange = 0;
  }
  
  // Create a random enemy
  static createRandom(worldSize: number, level: number = 1): Enemy {
    // Scale properties based on level
    const radius = 15 + level * 3;
    const speed = 100 + level * 10;
    const health = 30 + level * 20;
    
    // Random position away from borders
    const margin = radius * 2;
    const x = Math.random() * (worldSize - 2 * margin) + margin;
    const y = Math.random() * (worldSize - 2 * margin) + margin;
    const position = new Vector(x, y);
    
    // Choose color based on level
    const levelColors = [
      "#9b59b6", // purple - level 1
      "#3498db", // blue - level 2
      "#f1c40f", // yellow - level 3
      "#e74c3c", // red - level 4
      "#1abc9c"  // teal - level 5
    ];
    
    const colorIndex = Math.min(level - 1, levelColors.length - 1);
    const color = levelColors[colorIndex];
    
    // Choose behavior based on level
    const behaviors: ("passive" | "aggressive" | "neutral")[] = ["passive", "neutral", "aggressive"];
    const behaviorIndex = Math.min(Math.floor(level / 2), behaviors.length - 1);
    const behavior = behaviors[behaviorIndex];
    
    return new Enemy({
      id: `enemy-${Date.now()}-${Math.random()}`,
      position,
      radius,
      color,
      speed,
      health,
      level,
      behavior
    });
  }
}
