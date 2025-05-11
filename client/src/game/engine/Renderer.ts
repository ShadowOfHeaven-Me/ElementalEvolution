import { Camera } from "./Camera";
import { Entity } from "../entities/Entity";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Food } from "../entities/Food";
import { Enemy } from "../entities/Enemy";
import { Vector } from "../utils/Vector";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;
  private gridSize: number;
  private gridColor: string;
  
  constructor(ctx: CanvasRenderingContext2D, camera: Camera) {
    this.ctx = ctx;
    this.camera = camera;
    this.gridSize = 50; // Size of grid cells
    this.gridColor = "rgba(50, 50, 70, 0.3)"; // Subtle grid color
  }
  
  // Render the background grid
  renderGrid(): void {
    const ctx = this.ctx;
    const camera = this.camera;
    
    // Calculate visible grid bounds
    const startX = Math.floor((camera.position.x - (camera.viewWidth / 2) / camera.zoom) / this.gridSize) * this.gridSize;
    const startY = Math.floor((camera.position.y - (camera.viewHeight / 2) / camera.zoom) / this.gridSize) * this.gridSize;
    const endX = Math.ceil((camera.position.x + (camera.viewWidth / 2) / camera.zoom) / this.gridSize) * this.gridSize;
    const endY = Math.ceil((camera.position.y + (camera.viewHeight / 2) / camera.zoom) / this.gridSize) * this.gridSize;
    
    // Draw vertical grid lines
    ctx.beginPath();
    ctx.strokeStyle = this.gridColor;
    ctx.lineWidth = 1;
    
    for (let x = startX; x <= endX; x += this.gridSize) {
      const screenPos = camera.worldToScreenPosition(x, startY);
      ctx.moveTo(screenPos.x, 0);
      ctx.lineTo(screenPos.x, camera.viewHeight);
    }
    
    // Draw horizontal grid lines
    for (let y = startY; y <= endY; y += this.gridSize) {
      const screenPos = camera.worldToScreenPosition(startX, y);
      ctx.moveTo(0, screenPos.y);
      ctx.lineTo(camera.viewWidth, screenPos.y);
    }
    
    ctx.stroke();
  }
  
  // Render world boundaries
  renderWorldBorders(worldSize: number): void {
    const ctx = this.ctx;
    const camera = this.camera;
    
    ctx.strokeStyle = "rgba(150, 100, 200, 0.8)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Convert world bounds to screen coordinates
    const topLeft = camera.worldToScreenPosition(0, 0);
    const bottomRight = camera.worldToScreenPosition(worldSize, worldSize);
    
    // Draw rectangle
    ctx.rect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    ctx.stroke();
  }
  
  // Render a general entity
  renderEntity(entity: Entity): void {
    if (!this.camera.isVisible(entity.position, entity.radius)) return;
    
    const ctx = this.ctx;
    const screenPos = this.camera.worldToScreenPosition(entity.position.x, entity.position.y);
    const screenRadius = entity.radius * this.camera.zoom;
    
    ctx.fillStyle = entity.color;
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, screenRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // If the entity is food, draw a specific style
    if (entity instanceof Food) {
      this.renderFood(entity, screenPos, screenRadius);
    }
    
    // If the entity is an enemy, draw additional details
    if (entity instanceof Enemy) {
      this.renderEnemy(entity, screenPos, screenRadius);
    }
    
    // Draw name if available and entity is large enough
    if (entity.name && screenRadius > 15) {
      this.drawEntityName(entity.name, screenPos, screenRadius);
    }
  }
  
  // Render a player with special styling
  renderPlayer(player: Player): void {
    if (!this.camera.isVisible(player.position, player.radius)) return;
    
    const ctx = this.ctx;
    const screenPos = this.camera.worldToScreenPosition(player.position.x, player.position.y);
    const screenRadius = player.radius * this.camera.zoom;
    
    // Draw player body
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, screenRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw aiming line
    const lineEndX = screenPos.x + player.facing.x * screenRadius * 1.2;
    const lineEndY = screenPos.y + player.facing.y * screenRadius * 1.2;
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(screenPos.x, screenPos.y);
    ctx.lineTo(lineEndX, lineEndY);
    ctx.stroke();
    
    // Draw health bar
    this.drawHealthBar(player, screenPos, screenRadius);
    
    // Draw player name
    this.drawEntityName(player.name || "Player", screenPos, screenRadius);
    
    // Draw level indicator
    this.drawLevelIndicator(player.level, screenPos, screenRadius);
  }
  
  // Render a projectile
  renderProjectile(projectile: Projectile): void {
    if (!this.camera.isVisible(projectile.position, projectile.radius)) return;
    
    const ctx = this.ctx;
    const screenPos = this.camera.worldToScreenPosition(projectile.position.x, projectile.position.y);
    const screenRadius = projectile.radius * this.camera.zoom;
    
    // Draw projectile
    ctx.fillStyle = projectile.color;
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, screenRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add a trail effect
    const trailLength = 3; // Number of trail segments
    const trailOpacityStep = 0.6 / trailLength;
    
    for (let i = 1; i <= trailLength; i++) {
      const trailOffset = projectile.direction.multiply(-i * 5);
      const trailPos = new Vector(
        screenPos.x + trailOffset.x,
        screenPos.y + trailOffset.y
      );
      
      const trailRadius = screenRadius * (1 - i * 0.2);
      const opacity = 0.6 - (i * trailOpacityStep);
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(trailPos.x, trailPos.y, trailRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Render a food entity with special styling
  private renderFood(food: Food, screenPos: Vector, screenRadius: number): void {
    const ctx = this.ctx;
    
    // Add a pulsing effect
    const pulseScale = 0.2 * Math.sin(Date.now() / 500) + 1;
    
    // Draw a glowing effect
    const gradient = ctx.createRadialGradient(
      screenPos.x, screenPos.y, 0,
      screenPos.x, screenPos.y, screenRadius * pulseScale
    );
    
    gradient.addColorStop(0, food.color);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, screenRadius * 1.5 * pulseScale, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Render an enemy with special styling
  private renderEnemy(enemy: Enemy, screenPos: Vector, screenRadius: number): void {
    const ctx = this.ctx;
    
    // Draw a ring around the enemy based on behavior
    let ringColor;
    switch (enemy.behavior) {
      case "passive":
        ringColor = "rgba(100, 200, 100, 0.5)"; // Green for passive
        break;
      case "neutral":
        ringColor = "rgba(200, 200, 100, 0.5)"; // Yellow for neutral
        break;
      case "aggressive":
        ringColor = "rgba(200, 100, 100, 0.5)"; // Red for aggressive
        break;
    }
    
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, screenRadius * 1.2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw health bar
    this.drawHealthBar(enemy, screenPos, screenRadius);
    
    // Draw level indicator
    this.drawLevelIndicator(enemy.level, screenPos, screenRadius);
  }
  
  // Draw a health bar above an entity
  private drawHealthBar(entity: { health: number, maxHealth: number }, screenPos: Vector, screenRadius: number): void {
    const ctx = this.ctx;
    const barWidth = screenRadius * 2;
    const barHeight = 6;
    const barX = screenPos.x - barWidth / 2;
    const barY = screenPos.y - screenRadius - barHeight - 5;
    
    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health fill
    const healthPercent = entity.health / entity.maxHealth;
    let healthColor;
    
    if (healthPercent > 0.6) {
      healthColor = "rgba(100, 200, 100, 0.8)"; // Green
    } else if (healthPercent > 0.3) {
      healthColor = "rgba(200, 200, 100, 0.8)"; // Yellow
    } else {
      healthColor = "rgba(200, 100, 100, 0.8)"; // Red
    }
    
    ctx.fillStyle = healthColor;
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
  }
  
  // Draw entity name
  private drawEntityName(name: string, screenPos: Vector, screenRadius: number): void {
    const ctx = this.ctx;
    
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Text shadow for better visibility
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillText(name, screenPos.x + 1, screenPos.y - screenRadius - 15 + 1);
    
    // Actual text
    ctx.fillStyle = "white";
    ctx.fillText(name, screenPos.x, screenPos.y - screenRadius - 15);
  }
  
  // Draw level indicator
  private drawLevelIndicator(level: number, screenPos: Vector, screenRadius: number): void {
    const ctx = this.ctx;
    const indicatorSize = 16;
    const indicatorX = screenPos.x - indicatorSize / 2;
    const indicatorY = screenPos.y + screenRadius + 5;
    
    // Background circle
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y + screenRadius + 5 + indicatorSize / 2, indicatorSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Level text
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText(level.toString(), screenPos.x, screenPos.y + screenRadius + 5 + indicatorSize / 2);
  }
}
