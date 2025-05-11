import { Vector } from "../utils/Vector";
import { Entity } from "./Entity";
import { Player } from "./Player";

export class BlackHole extends Entity {
  radius: number;
  mass: number;
  pulseSpeed: number;
  rotationSpeed: number;
  rotationAngle: number;
  effectRadius: number;
  gravityStrength: number;
  rotationTime: number;
  
  constructor({
    id,
    position,
    radius,
    mass = 500,
    color = "#000000"
  }: {
    id: string;
    position: Vector;
    radius: number;
    mass?: number;
    color?: string;
  }) {
    super({ id, position, radius, color });
    
    this.mass = mass;
    this.pulseSpeed = Math.random() * 0.5 + 0.5;
    this.rotationSpeed = Math.random() * 0.01 + 0.005;
    this.rotationAngle = 0;
    this.effectRadius = radius * 10; // Radius of gravitational effect
    this.gravityStrength = 2000; // Strength of gravity
    this.rotationTime = 0;
  }
  
  /**
   * Apply gravitational effect to a player or entity
   */
  applyGravityTo(entity: Entity | Player, deltaTime: number): void {
    // Calculate distance vector between black hole and entity
    const distanceVector = this.position.subtract(entity.position);
    const distance = distanceVector.length();
    
    // If entity is outside effect radius, no gravity is applied
    if (distance > this.effectRadius) {
      return;
    }
    
    // Calculate gravity strength based on inverse square law with distance
    // Stronger closer to the black hole
    const forceMagnitude = (this.gravityStrength * this.mass * deltaTime) / 
      Math.max(distance * distance, 1);
    
    // Add rotation effect for objects caught in gravity well
    // As objects get closer, they orbit more
    const rotationFactor = 1 - distance / this.effectRadius;
    const tangentVector = new Vector(
      -distanceVector.y, 
      distanceVector.x
    ).normalize();
    
    // Combine gravitational pull with rotational force
    const direction = distanceVector.normalize();
    const pullVector = direction.multiply(forceMagnitude);
    const rotationVector = tangentVector.multiply(forceMagnitude * rotationFactor * 0.5);
    
    // Apply force to entity
    if ("velocity" in entity) {
      entity.velocity.add(pullVector);
      entity.velocity.add(rotationVector);
    } else {
      // For entities without velocity (like Food)
      entity.position.add(pullVector.multiply(0.1));
      entity.position.add(rotationVector.multiply(0.1));
    }
    
    // If entity is too close, destroy it or damage player
    if (distance < this.radius * 1.5) {
      if (entity instanceof Player) {
        // Damage player if too close
        entity.takeDamage(20 * deltaTime);
      } else {
        // Remove non-player entities
        entity.isActive = false;
      }
    }
  }
  
  update(deltaTime: number): void {
    super.update(deltaTime);
    
    // Update rotation angle for visual effect
    this.rotationAngle += this.rotationSpeed * deltaTime;
    if (this.rotationAngle > Math.PI * 2) {
      this.rotationAngle -= Math.PI * 2;
    }
    
    // Increment rotation time for pulsing effect
    this.rotationTime += deltaTime;
    
    // Radius pulsing effect
    const pulseFactor = Math.sin(this.rotationTime * this.pulseSpeed) * 0.1 + 1.0;
    this.radius = this.radius * pulseFactor;
  }
  
  static createRandom(worldSize: number): BlackHole {
    // Position randomly, but keep away from center (where players spawn)
    const minDistance = worldSize * 0.2; // Minimum distance from center
    const maxDistance = worldSize * 0.45; // Maximum distance from center
    
    // Generate a random distance from center within allowed range
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    
    // Generate a random angle
    const angle = Math.random() * Math.PI * 2;
    
    // Calculate position based on angle and distance from center
    const x = worldSize / 2 + Math.cos(angle) * distance;
    const y = worldSize / 2 + Math.sin(angle) * distance;
    
    // Random radius between 50 and 100
    const radius = 50 + Math.random() * 50;
    
    // Random mass
    const mass = 400 + Math.random() * 300;
    
    return new BlackHole({
      id: `blackhole-${Date.now()}-${Math.random()}`,
      position: new Vector(x, y),
      radius,
      mass,
      color: "#000000" // Black holes are black!
    });
  }
}