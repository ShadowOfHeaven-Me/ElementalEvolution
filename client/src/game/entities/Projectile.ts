import { Entity } from "./Entity";
import { Vector } from "../utils/Vector";

export class Projectile extends Entity {
  ownerId: string;
  direction: Vector;
  speed: number;
  damage: number;
  lifetime: number;
  totalLifetime: number;
  
  constructor({
    id,
    ownerId,
    position,
    direction,
    speed,
    radius,
    damage,
    color,
    lifetime = 2.0 // Default 2 seconds
  }: {
    id: string;
    ownerId: string;
    position: Vector;
    direction: Vector;
    speed: number;
    radius: number;
    damage: number;
    color: string;
    lifetime?: number;
  }) {
    super({ id, position, radius, color });
    
    this.ownerId = ownerId;
    this.direction = direction.normalize();
    this.speed = speed;
    this.damage = damage;
    this.lifetime = lifetime;
    this.totalLifetime = lifetime;
    
    // Set initial velocity
    this.velocity = this.direction.multiply(this.speed);
  }
  
  // Update the projectile
  update(deltaTime: number): void {
    super.update(deltaTime);
    
    // Decrease lifetime
    this.lifetime -= deltaTime;
  }
  
  // Check if the projectile is expired
  isExpired(): boolean {
    return this.lifetime <= 0;
  }
  
  // Get the current progress of lifetime (0.0 - 1.0)
  getLifetimeProgress(): number {
    return this.lifetime / this.totalLifetime;
  }
}
