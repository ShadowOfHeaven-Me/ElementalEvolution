import { Entity } from "../entities/Entity";

export class CollisionManager {
  constructor() {
    // Any initialization if needed
  }
  
  // Check collision between two entities
  checkCollision(entityA: Entity, entityB: Entity): boolean {
    // Basic circle collision detection
    const distanceSquared = entityA.position.distanceSquaredTo(entityB.position);
    const radiusSum = entityA.radius + entityB.radius;
    
    return distanceSquared <= radiusSum * radiusSum;
  }
  
  // Handle response to a collision
  handleCollision(entityA: Entity, entityB: Entity): void {
    // Notify both entities of collision
    entityA.onCollision(entityB);
    entityB.onCollision(entityA);
  }
  
  // Check collisions for a specific entity against an array of entities
  checkCollisionsFor(entity: Entity, entities: Entity[]): Entity[] {
    const collisions: Entity[] = [];
    
    for (const other of entities) {
      // Skip collision check with self
      if (entity.id === other.id) continue;
      
      if (this.checkCollision(entity, other)) {
        collisions.push(other);
      }
    }
    
    return collisions;
  }
  
  // Check collisions between all entities in an array
  checkAllCollisions(entities: Entity[]): void {
    const entityCount = entities.length;
    
    for (let i = 0; i < entityCount; i++) {
      for (let j = i + 1; j < entityCount; j++) {
        if (this.checkCollision(entities[i], entities[j])) {
          this.handleCollision(entities[i], entities[j]);
        }
      }
    }
  }
}
