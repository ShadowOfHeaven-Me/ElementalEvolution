export class GameLoop {
  private running: boolean;
  private lastTime: number;
  private animationFrameId: number;
  private update: (deltaTime: number) => void;
  private render: () => void;
  
  constructor() {
    this.running = false;
    this.lastTime = 0;
    this.animationFrameId = 0;
    this.update = () => {};
    this.render = () => {};
  }
  
  // Start the game loop
  start(
    update: (deltaTime: number) => void,
    render: () => void
  ): void {
    if (this.running) return;
    
    this.running = true;
    this.update = update;
    this.render = render;
    
    // Start the loop
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }
  
  // Stop the game loop
  stop(): void {
    if (!this.running) return;
    
    this.running = false;
    cancelAnimationFrame(this.animationFrameId);
  }
  
  // Main loop function
  private loop(currentTime: number): void {
    // Calculate delta time in seconds
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    // Cap delta time to avoid large jumps
    const cappedDeltaTime = Math.min(deltaTime, 0.1);
    
    // Update game state
    this.update(cappedDeltaTime);
    
    // Render the game
    this.render();
    
    // Schedule next frame if still running
    if (this.running) {
      this.animationFrameId = requestAnimationFrame((time) => this.loop(time));
    }
  }
}
