import { Entity } from "./Entity";
import { Vector } from "../utils/Vector";
import { Projectile } from "./Projectile";
import { UpgradeOption } from "../constants/Upgrades";

export class Player extends Entity {
  speed: number;
  health: number;
  maxHealth: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  facing: Vector;
  shootCooldown: number;
  shootTimer: number;
  projectileSpeed: number;
  projectileDamage: number;
  evolutionPath: string;
  particleType: string;
  shootSound?: HTMLAudioElement;
  
  constructor({
    id,
    position,
    radius,
    speed,
    name,
    color
  }: {
    id: string;
    position: Vector;
    radius: number;
    speed: number;
    name: string;
    color: string;
  }) {
    super({ id, position, radius, color, name });
    
    this.speed = speed;
    this.health = 100;
    this.maxHealth = 100;
    this.level = 1;
    this.xp = 0;
    this.xpToNextLevel = 100;
    this.facing = new Vector(1, 0); // Default facing right
    this.shootCooldown = 0.5; // 500ms between shots
    this.shootTimer = 0;
    this.projectileSpeed = 600;
    this.projectileDamage = 10;
    this.evolutionPath = "Subatomic"; // Default evolution path
    this.particleType = "Electron"; // Default particle type
  }
  
  // Move the player in a direction
  move(direction: Vector, deltaTime: number): void {
    // Scale direction by speed and delta time
    const moveX = direction.x * this.speed * deltaTime;
    const moveY = direction.y * this.speed * deltaTime;
    
    // Update position
    this.position.x += moveX;
    this.position.y += moveY;
  }
  
  // Aim toward a target position
  aim(targetPosition: Vector): void {
    this.facing = targetPosition.subtract(this.position).normalize();
  }
  
  // Check if player can shoot
  canShoot(): boolean {
    return this.shootTimer <= 0;
  }
  
  // Shoot a projectile
  shoot(direction: Vector): Projectile | null {
    if (!this.canShoot()) {
      return null;
    }
    
    // Reset shoot timer
    this.shootTimer = this.shootCooldown;
    
    // Create projectile
    const projectilePosition = this.position.add(direction.multiply(this.radius + 5));
    const projectile = new Projectile({
      id: `proj-${Date.now()}`,
      ownerId: this.id,
      position: projectilePosition,
      direction: direction,
      speed: this.projectileSpeed,
      radius: 5,
      damage: this.projectileDamage,
      color: this.color
    });
    
    return projectile;
  }
  
  // Level up
  levelUp(): void {
    this.level++;
    this.xp = 0;
    this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
    
    // Base stat upgrades per level
    this.maxHealth += 10;
    this.health = this.maxHealth; // Heal to full on level up
    this.radius += 2; // Grow a bit
  }
  
  // Add experience points
  addXP(amount: number): void {
    this.xp += amount;
  }
  
  // Apply an upgrade
  applyUpgrade(upgrade: UpgradeOption): void {
    // Set evolution path if it's not set yet
    if (this.level === 2) {
      this.evolutionPath = upgrade.path;
    }
    
    // Update particle type
    this.particleType = upgrade.name;
    
    // Apply stats changes
    upgrade.stats.forEach(stat => {
      switch (stat.name) {
        case "Health":
          this.maxHealth += stat.value;
          this.health += stat.value;
          break;
        case "Speed":
          this.speed += stat.value;
          break;
        case "Size":
          this.radius += stat.value;
          break;
        case "Damage":
          this.projectileDamage += stat.value;
          break;
        case "Reload":
          this.shootCooldown = Math.max(0.1, this.shootCooldown - stat.value / 100);
          break;
        default:
          break;
      }
    });
    
    // Apply color change
    this.color = upgrade.color;
  }
  
  // Take damage
  takeDamage(amount: number): void {
    this.health -= amount;
    
    // Clamp health to 0
    if (this.health < 0) {
      this.health = 0;
    }
  }
  
  // Heal the player
  heal(amount: number): void {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }
  
  // Update method (called each frame)
  update(deltaTime: number): void {
    super.update(deltaTime);
    
    // Update shoot timer
    if (this.shootTimer > 0) {
      this.shootTimer -= deltaTime;
    }
  }
}
