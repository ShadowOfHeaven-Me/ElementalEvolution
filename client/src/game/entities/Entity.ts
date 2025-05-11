import { Vector } from "../utils/Vector";

// Base class for all game entities
export class Entity {
  id: string;
  position: Vector;
  velocity: Vector;
  radius: number;
  color: string;
  name?: string;
  
  constructor({
    id,
    position,
    radius,
    color,
    name
  }: {
    id: string;
    position: Vector;
    radius: number;
    color: string;
    name?: string;
  }) {
    this.id = id;
    this.position = position;
    this.velocity = new Vector(0, 0);
    this.radius = radius;
    this.color = color;
    this.name = name;
  }
  
  // Update entity state
  update(deltaTime: number): void {
    // Move entity based on velocity
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }
  
  // Check if this entity collides with another
  collidesWith(other: Entity): boolean {
    const distanceSquared = this.position.distanceSquaredTo(other.position);
    const radiusSum = this.radius + other.radius;
    return distanceSquared <= radiusSum * radiusSum;
  }
  
  // Handle collision response
  onCollision(other: Entity): void {
    // Base implementation does nothing
  }
}
