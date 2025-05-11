import { Vector } from "../utils/Vector";
import { Entity } from "./Entity";
import { Player } from "./Player";

export class WormHole extends Entity {
  exitWormhole: WormHole | null = null;
  effectRadius: number;
  cooldown: number;
  cooldownMax: number;
  pulseSpeed: number;
  rotationAngle: number;
  rotationSpeed: number;
  suctionStrength: number;
  rotationTime: number;
  
  constructor({
    id,
    position,
    radius,
    color = "#9370DB" // MediumPurple color for wormholes
  }: {
    id: string;
    position: Vector;
    radius: number;
    color?: string;
  }) {
    super({ id, position, radius, color });
    
    this.effectRadius = radius * 5;
    this.cooldown = 0;
    this.cooldownMax = 3; // 3 seconds cooldown between teleports
    this.pulseSpeed = Math.random() * 1.0 + 1.0;
    this.rotationAngle = 0;
    this.rotationSpeed = Math.random() * 0.05 + 0.02;
    this.suctionStrength = 1000;
    this.rotationTime = 0;
  }
  
  /**
   * Link this wormhole to another one for teleportation
   */
  linkTo(wormhole: WormHole): void {
    this.exitWormhole = wormhole;
    wormhole.exitWormhole = this;
  }
  
  /**
   * Apply suction effect to an entity or player
   */
  applySuctionTo(entity: Entity | Player, deltaTime: number): void {
    // Calculate distance vector between wormhole and entity
    const distanceVector = this.position.subtract(entity.position);
    const distance = distanceVector.length();
    
    // If entity is outside effect radius, no suction is applied
    if (distance > this.effectRadius) {
      return;
    }
    
    // Calculate suction strength based on inverse square law with distance
    const forceMagnitude = (this.suctionStrength * deltaTime) / 
      Math.max(distance * distance, 1);
    
    // Add rotation effect for objects caught in suction field
    const rotationFactor = 1 - distance / this.effectRadius;
    const tangentVector = new Vector(
      -distanceVector.y, 
      distanceVector.x
    ).normalize();
    
    // Combine pull with rotational force
    const direction = distanceVector.normalize();
    const pullVector = direction.multiply(forceMagnitude);
    const rotationVector = tangentVector.multiply(forceMagnitude * rotationFactor);
    
    // Apply force to entity
    if ("velocity" in entity) {
      entity.velocity.add(pullVector);
      entity.velocity.add(rotationVector);
    } else {
      // For entities without velocity (like Food)
      entity.position.add(pullVector.multiply(0.1));
      entity.position.add(rotationVector.multiply(0.1));
    }
    
    // If entity is close enough and cooldown is done, teleport
    if (distance < this.radius * 1.2 && this.cooldown <= 0 && this.exitWormhole) {
      this.teleport(entity);
      this.cooldown = this.cooldownMax;
      if (this.exitWormhole) {
        this.exitWormhole.cooldown = this.exitWormhole.cooldownMax;
      }
    }
  }
  
  /**
   * Teleport an entity to the exit wormhole
   */
  teleport(entity: Entity | Player): void {
    if (!this.exitWormhole) return;
    
    // Calculate new position away from the exit wormhole (so entity doesn't get stuck)
    const exitDirection = new Vector(
      Math.cos(Math.random() * Math.PI * 2),
      Math.sin(Math.random() * Math.PI * 2)
    );
    
    const teleportDistance = this.exitWormhole.radius * 2.5;
    const newPosition = this.exitWormhole.position.add(
      exitDirection.multiply(teleportDistance)
    );
    
    // Set the entity's position to the new position
    entity.position.x = newPosition.x;
    entity.position.y = newPosition.y;
    
    // If entity has velocity (like Player), scatter the direction a bit
    if ("velocity" in entity) {
      const scatterAngle = Math.random() * Math.PI * 0.5 - Math.PI * 0.25;
      const currentDir = entity.velocity.normalize();
      const newDir = new Vector(
        currentDir.x * Math.cos(scatterAngle) - currentDir.y * Math.sin(scatterAngle),
        currentDir.x * Math.sin(scatterAngle) + currentDir.y * Math.cos(scatterAngle)
      );
      
      entity.velocity = newDir.multiply(entity.velocity.length());
    }
  }
  
  update(deltaTime: number): void {
    super.update(deltaTime);
    
    // Update cooldown
    if (this.cooldown > 0) {
      this.cooldown -= deltaTime;
    }
    
    // Update rotation angle for visual effect
    this.rotationAngle += this.rotationSpeed * deltaTime;
    if (this.rotationAngle > Math.PI * 2) {
      this.rotationAngle -= Math.PI * 2;
    }
    
    // Increment rotation time for pulsing effect
    this.rotationTime += deltaTime;
    
    // Radius pulsing effect
    const pulseFactor = Math.sin(this.rotationTime * this.pulseSpeed) * 0.2 + 1.0;
    this.radius = this.radius * pulseFactor;
  }
  
  static createPair(worldSize: number): WormHole[] {
    // Create first wormhole in a random location, avoiding the center
    const minDistance1 = worldSize * 0.2;
    const maxDistance1 = worldSize * 0.4;
    const distance1 = minDistance1 + Math.random() * (maxDistance1 - minDistance1);
    const angle1 = Math.random() * Math.PI * 2;
    
    const x1 = worldSize / 2 + Math.cos(angle1) * distance1;
    const y1 = worldSize / 2 + Math.sin(angle1) * distance1;
    
    // Create second wormhole in a different area
    const minDistance2 = worldSize * 0.25;
    const maxDistance2 = worldSize * 0.45;
    const distance2 = minDistance2 + Math.random() * (maxDistance2 - minDistance2);
    
    // Make sure the second wormhole is in a different direction from the first
    const angle2 = angle1 + Math.PI + (Math.random() * Math.PI / 2 - Math.PI / 4);
    
    const x2 = worldSize / 2 + Math.cos(angle2) * distance2;
    const y2 = worldSize / 2 + Math.sin(angle2) * distance2;
    
    // Random radius between 30 and 50
    const radius = 30 + Math.random() * 20;
    
    // Create the pair of wormholes
    const wormhole1 = new WormHole({
      id: `wormhole-1-${Date.now()}`,
      position: new Vector(x1, y1),
      radius,
      color: "#9370DB"
    });
    
    const wormhole2 = new WormHole({
      id: `wormhole-2-${Date.now()}`,
      position: new Vector(x2, y2),
      radius,
      color: "#9370DB"
    });
    
    // Link the wormholes together
    wormhole1.linkTo(wormhole2);
    
    return [wormhole1, wormhole2];
  }
}