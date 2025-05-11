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
    
    try {
      // Calculate visible grid bounds
      const startX = Math.floor((camera.position.x - (camera.viewWidth / 2) / camera.zoom) / this.gridSize) * this.gridSize;
      const startY = Math.floor((camera.position.y - (camera.viewHeight / 2) / camera.zoom) / this.gridSize) * this.gridSize;
      const endX = Math.ceil((camera.position.x + (camera.viewWidth / 2) / camera.zoom) / this.gridSize) * this.gridSize;
      const endY = Math.ceil((camera.position.y + (camera.viewHeight / 2) / camera.zoom) / this.gridSize) * this.gridSize;
      
      // Draw a dark background for better visibility - using darker color than brutal.io
      ctx.fillStyle = "#050510"; // Very dark blue background
      ctx.fillRect(0, 0, camera.viewWidth, camera.viewHeight);
      
      // Draw grid with a glow effect
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 200, 200, 0.15)"; // Cyan grid lines with low opacity
      ctx.lineWidth = 1;
      
      // Draw vertical grid lines
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
      
      // Add a subtle radial gradient in the center for a "glow" effect
      const centerX = camera.viewWidth / 2;
      const centerY = camera.viewHeight / 2;
      const radius = Math.max(camera.viewWidth, camera.viewHeight) * 0.8;
      
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      
      gradient.addColorStop(0, "rgba(0, 50, 50, 0.2)"); // Subtle cyan glow at center
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Transparent at edges
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, camera.viewWidth, camera.viewHeight);
      
    } catch (err) {
      console.error("Error rendering grid:", err);
      
      // Fallback rendering if the calculation fails
      ctx.fillStyle = "#050510"; // Very dark blue background
      ctx.fillRect(0, 0, camera.viewWidth, camera.viewHeight);
      
      // Simple grid pattern
      const gridSize = 50;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 200, 200, 0.15)";
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x <= camera.viewWidth; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, camera.viewHeight);
      }
      
      // Horizontal lines
      for (let y = 0; y <= camera.viewHeight; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(camera.viewWidth, y);
      }
      
      ctx.stroke();
    }
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
    try {
      if (!this.camera.isVisible(entity.position, entity.radius)) return;
      
      console.log(`Rendering entity at ${entity.position.x}, ${entity.position.y}`);
      
      const ctx = this.ctx;
      const screenPos = this.camera.worldToScreenPosition(entity.position.x, entity.position.y);
      const screenRadius = entity.radius * this.camera.zoom;
      
      // Draw entity base shape
      ctx.fillStyle = entity.color;
      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, screenRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw a stroke around the entity for better visibility
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // If the entity is food, draw a specific style
      if (entity instanceof Food) {
        this.renderFood(entity, screenPos, screenRadius);
      }
      
      // If the entity is an enemy, draw additional details
      if (entity instanceof Enemy) {
        this.renderEnemy(entity, screenPos, screenRadius);
      }
      
      // Draw name if available and entity is large enough
      if (entity.name && screenRadius > 10) {
        this.drawEntityName(entity.name, screenPos, screenRadius);
      }
    } catch (err) {
      console.error("Error rendering entity:", err);
    }
  }
  
  // Render a player with special styling - brutal.io style with glow
  renderPlayer(player: Player): void {
    try {
      if (!this.camera.isVisible(player.position, player.radius)) return;
      
      const ctx = this.ctx;
      const screenPos = this.camera.worldToScreenPosition(player.position.x, player.position.y);
      const screenRadius = player.radius * this.camera.zoom;
      
      // Create bright color for core and glow
      const playerBaseColor = player.color;
      const playerGlowColor = this.getBrighterColor(playerBaseColor);
      
      // Create outer glow - large and subtle
      const outerGlow = ctx.createRadialGradient(
        screenPos.x, screenPos.y, 0,
        screenPos.x, screenPos.y, screenRadius * 3
      );
      outerGlow.addColorStop(0, this.colorWithAlpha(playerGlowColor, 0.3));
      outerGlow.addColorStop(0.5, this.colorWithAlpha(playerGlowColor, 0.1));
      outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, screenRadius * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Create inner glow - smaller but more intense
      const innerGlow = ctx.createRadialGradient(
        screenPos.x, screenPos.y, 0,
        screenPos.x, screenPos.y, screenRadius * 1.5
      );
      innerGlow.addColorStop(0, this.colorWithAlpha(playerGlowColor, 0.8));
      innerGlow.addColorStop(0.6, this.colorWithAlpha(playerBaseColor, 0.4));
      innerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, screenRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw player core body
      ctx.fillStyle = playerBaseColor;
      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, screenRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add bright stroke for better visibility
      ctx.strokeStyle = playerGlowColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw inner highlight for 3D effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(screenPos.x - screenRadius * 0.3, screenPos.y - screenRadius * 0.3, screenRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw aiming line with glow effect
      const lineLength = screenRadius * 2;
      const lineEndX = screenPos.x + player.facing.x * lineLength;
      const lineEndY = screenPos.y + player.facing.y * lineLength;
      
      // Draw glow around the line
      ctx.strokeStyle = this.colorWithAlpha(playerGlowColor, 0.3);
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(screenPos.x, screenPos.y);
      ctx.lineTo(lineEndX, lineEndY);
      ctx.stroke();
      
      // Draw core line
      ctx.strokeStyle = this.colorWithAlpha(playerGlowColor, 0.9);
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
    } catch (err) {
      console.error("Error rendering player:", err);
    }
  }
  
  // Helper function to create a brighter version of a color
  private getBrighterColor(color: string): string {
    // For hex colors
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      // Increase brightness (with max 255)
      const brighterR = Math.min(255, r + 100);
      const brighterG = Math.min(255, g + 100);
      const brighterB = Math.min(255, b + 100);
      
      return `rgb(${brighterR}, ${brighterG}, ${brighterB})`;
    }
    
    // For rgb/rgba colors
    if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        const r = parseInt(matches[0]);
        const g = parseInt(matches[1]);
        const b = parseInt(matches[2]);
        
        // Increase brightness (with max 255)
        const brighterR = Math.min(255, r + 100);
        const brighterG = Math.min(255, g + 100);
        const brighterB = Math.min(255, b + 100);
        
        return `rgb(${brighterR}, ${brighterG}, ${brighterB})`;
      }
    }
    
    // Default fallback to white if color format is unknown
    return "#ffffff";
  }
  
  // Helper function to add alpha to a color
  private colorWithAlpha(color: string, alpha: number): string {
    // For hex colors
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // For rgb colors
    if (color.startsWith('rgb(')) {
      const rgbValues = color.match(/\d+/g);
      if (rgbValues && rgbValues.length >= 3) {
        return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alpha})`;
      }
    }
    
    // For rgba colors, replace the alpha
    if (color.startsWith('rgba(')) {
      return color.replace(/[\d.]+\)$/, `${alpha})`);
    }
    
    // Default fallback
    return `rgba(255, 255, 255, ${alpha})`;
  }
  
  // Render a projectile
  renderProjectile(projectile: Projectile): void {
    if (!this.camera.isVisible(projectile.position, projectile.radius)) return;
    
    const ctx = this.ctx;
    const screenPos = this.camera.worldToScreenPosition(projectile.position.x, projectile.position.y);
    const screenRadius = projectile.radius * this.camera.zoom;
    
    // Create brighter glow color
    const baseColor = projectile.color;
    const glowColor = this.getBrighterColor(baseColor);
    
    // Draw outer glow
    const outerGlowRadius = screenRadius * 4;
    const outerGlow = ctx.createRadialGradient(
      screenPos.x, screenPos.y, 0,
      screenPos.x, screenPos.y, outerGlowRadius
    );
    outerGlow.addColorStop(0, this.colorWithAlpha(glowColor, 0.7));
    outerGlow.addColorStop(0.4, this.colorWithAlpha(glowColor, 0.2));
    outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, outerGlowRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw core of projectile
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, screenRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add bright stroke
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Add inner highlight for 3D effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(
      screenPos.x - screenRadius * 0.2,
      screenPos.y - screenRadius * 0.2,
      screenRadius * 0.4,
      0, Math.PI * 2
    );
    ctx.fill();
    
    // Enhanced trail effect with glow
    const trailLength = 5; // Longer trail for better effect
    
    // Draw a glowing trail using gradient
    const trailStartPos = screenPos;
    const trailDirection = projectile.direction.clone().multiply(-1);
    const trailEndOffset = trailDirection.multiply(screenRadius * 8);
    const trailEndPos = {
      x: screenPos.x + trailEndOffset.x,
      y: screenPos.y + trailEndOffset.y
    };
    
    // Create gradient for the trail
    const trailGradient = ctx.createLinearGradient(
      trailStartPos.x, trailStartPos.y,
      trailEndPos.x, trailEndPos.y
    );
    
    trailGradient.addColorStop(0, this.colorWithAlpha(glowColor, 0.8));
    trailGradient.addColorStop(0.3, this.colorWithAlpha(glowColor, 0.4));
    trailGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    
    // Draw trail with width based on projectile size
    ctx.strokeStyle = trailGradient;
    ctx.lineWidth = screenRadius * 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trailStartPos.x, trailStartPos.y);
    ctx.lineTo(trailEndPos.x, trailEndPos.y);
    ctx.stroke();
    
    // Inner brighter trail
    const innerTrailGradient = ctx.createLinearGradient(
      trailStartPos.x, trailStartPos.y,
      trailEndPos.x, trailEndPos.y
    );
    
    innerTrailGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    innerTrailGradient.addColorStop(0.5, this.colorWithAlpha(glowColor, 0.3));
    innerTrailGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    
    ctx.strokeStyle = innerTrailGradient;
    ctx.lineWidth = screenRadius;
    ctx.beginPath();
    ctx.moveTo(trailStartPos.x, trailStartPos.y);
    ctx.lineTo(trailEndPos.x, trailEndPos.y);
    ctx.stroke();
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
