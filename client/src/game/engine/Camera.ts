import { Vector } from "../utils/Vector";

export class Camera {
  position: Vector;
  viewWidth: number;
  viewHeight: number;
  worldSize: number;
  zoom: number;
  
  constructor(viewWidth: number, viewHeight: number, worldSize: number) {
    this.position = new Vector(worldSize / 2, worldSize / 2); // Start at center
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.worldSize = worldSize;
    this.zoom = 1.0;
  }
  
  // Center the camera on a position
  centerOn(position: Vector): void {
    this.position = position.clone();
    
    // Prevent camera from showing outside world bounds
    this.clampToWorld();
  }
  
  // Set zoom level
  setZoom(zoom: number): void {
    this.zoom = Math.max(0.5, Math.min(2.0, zoom)); // Clamp zoom between 0.5x and 2.0x
    
    // Reclamp to world after zoom change
    this.clampToWorld();
  }
  
  // Clamp camera position to world bounds
  private clampToWorld(): void {
    // Calculate effective half view dimensions
    const halfViewWidth = (this.viewWidth / 2) / this.zoom;
    const halfViewHeight = (this.viewHeight / 2) / this.zoom;
    
    // Clamp camera position
    this.position.x = Math.max(halfViewWidth, Math.min(this.worldSize - halfViewWidth, this.position.x));
    this.position.y = Math.max(halfViewHeight, Math.min(this.worldSize - halfViewHeight, this.position.y));
  }
  
  // Convert screen position to world position
  screenToWorldPosition(screenX: number, screenY: number): Vector {
    // Calculate effective dimensions
    const halfViewWidth = this.viewWidth / 2;
    const halfViewHeight = this.viewHeight / 2;
    
    // Convert screen coordinates to world coordinates
    const worldX = this.position.x + (screenX - halfViewWidth) / this.zoom;
    const worldY = this.position.y + (screenY - halfViewHeight) / this.zoom;
    
    return new Vector(worldX, worldY);
  }
  
  // Convert world position to screen position
  worldToScreenPosition(worldX: number, worldY: number): Vector {
    // Calculate effective dimensions
    const halfViewWidth = this.viewWidth / 2;
    const halfViewHeight = this.viewHeight / 2;
    
    // Convert world coordinates to screen coordinates
    const screenX = halfViewWidth + (worldX - this.position.x) * this.zoom;
    const screenY = halfViewHeight + (worldY - this.position.y) * this.zoom;
    
    return new Vector(screenX, screenY);
  }
  
  // Check if a world position is visible on screen
  isVisible(worldPos: Vector, radius: number = 0): boolean {
    // Calculate effective dimensions
    const halfViewWidth = (this.viewWidth / 2) / this.zoom;
    const halfViewHeight = (this.viewHeight / 2) / this.zoom;
    
    // Check if position is within visible area with padding for radius
    return (
      worldPos.x + radius >= this.position.x - halfViewWidth &&
      worldPos.x - radius <= this.position.x + halfViewWidth &&
      worldPos.y + radius >= this.position.y - halfViewHeight &&
      worldPos.y - radius <= this.position.y + halfViewHeight
    );
  }
}
