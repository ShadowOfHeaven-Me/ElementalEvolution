import { useRef, useEffect } from "react";
import { GameLoop } from "./engine/GameLoop";
import { InputManager } from "./engine/InputManager";
import { CollisionManager } from "./engine/CollisionManager";
import { Camera } from "./engine/Camera";
import { Renderer } from "./engine/Renderer";
import { Player } from "./entities/Player";
import { Projectile } from "./entities/Projectile";
import { Vector } from "./utils/Vector";
import { Enemy } from "./entities/Enemy";
import { Food } from "./entities/Food";

interface GameCanvasProps {
  gameState: {
    player: Player | null;
    entities: (Enemy | Food)[];
    worldSize: number;
  };
  onScoreUpdate: (score: number, isKill?: boolean) => void;
  onPlayerDeath: () => void;
}

const GameCanvas = ({ gameState, onScoreUpdate, onPlayerDeath }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<GameLoop | null>(null);
  const inputManagerRef = useRef<InputManager | null>(null);
  const projectilesRef = useRef<Projectile[]>([]);

  useEffect(() => {
    console.log("GameCanvas useEffect - start");
    console.log("Player:", gameState.player);
    console.log("Entities count:", gameState.entities.length);
    console.log("World size:", gameState.worldSize);

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas reference is null");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context from canvas");
      return;
    }

    // Resize canvas to fill window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log("Canvas resized:", canvas.width, "x", canvas.height);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Initialize game systems
    console.log("Initializing game systems");
    
    const camera = new Camera(
      canvas.width,
      canvas.height,
      gameState.worldSize
    );
    
    const renderer = new Renderer(ctx, camera);
    const collisionManager = new CollisionManager();
    const inputManager = new InputManager(canvas);
    inputManagerRef.current = inputManager;

    // Set up game loop
    const gameLoop = new GameLoop();
    gameLoopRef.current = gameLoop;
    console.log("Game loop initialized");

    // Update function for each frame
    const update = (deltaTime: number) => {
      if (!gameState.player) {
        console.warn("No player in update function");
        return;
      }
      
      const player = gameState.player;
      
      // Process player input
      const input = inputManager.getInput();
      
      // Handle player movement
      const movementDirection = new Vector(0, 0);
      
      if (input.up) movementDirection.y -= 1;
      if (input.down) movementDirection.y += 1;
      if (input.left) movementDirection.x -= 1;
      if (input.right) movementDirection.x += 1;
      
      if (movementDirection.lengthSquared() > 0) {
        movementDirection.normalize();
        player.move(movementDirection, deltaTime);
      }
      
      // Aim toward mouse position
      if (input.mousePosition) {
        const worldMousePos = camera.screenToWorldPosition(
          input.mousePosition.x,
          input.mousePosition.y
        );
        
        player.aim(worldMousePos);
      }
      
      // Handle shooting
      if (input.shooting && player.canShoot()) {
        const direction = player.facing.clone();
        const projectile = player.shoot(direction);
        if (projectile) {
          projectilesRef.current.push(projectile);
        }
      }
      
      // Keep player within world bounds
      player.position.x = Math.max(player.radius, Math.min(gameState.worldSize - player.radius, player.position.x));
      player.position.y = Math.max(player.radius, Math.min(gameState.worldSize - player.radius, player.position.y));
      
      // Update camera position to follow player
      camera.centerOn(player.position);
      
      // Update projectiles
      projectilesRef.current.forEach((projectile, index) => {
        projectile.update(deltaTime);
        
        // Check if projectile is out of bounds
        if (
          projectile.position.x < 0 ||
          projectile.position.x > gameState.worldSize ||
          projectile.position.y < 0 ||
          projectile.position.y > gameState.worldSize
        ) {
          projectilesRef.current.splice(index, 1);
        }
      });
      
      // Update entities
      gameState.entities.forEach((entity) => {
        if (entity instanceof Enemy) {
          entity.update(deltaTime, player);
        }
      });
      
      // Check collisions between player and food
      gameState.entities.forEach((entity, index) => {
        if (entity instanceof Food) {
          if (collisionManager.checkCollision(player, entity)) {
            // Player collects food
            const value = entity.value;
            onScoreUpdate(value);
            
            // Remove the food
            gameState.entities.splice(index, 1);
            
            // Spawn a new food at a random position
            const newFood = Food.createRandom(gameState.worldSize);
            gameState.entities.push(newFood);
          }
        }
      });
      
      // Check collisions between player and enemies
      gameState.entities.forEach((entity) => {
        if (entity instanceof Enemy) {
          // Player-enemy collision
          if (collisionManager.checkCollision(player, entity)) {
            // Player takes damage based on enemy size
            const damage = Math.max(5, entity.radius / 2);
            player.takeDamage(damage);
            
            // Check if player is dead
            if (player.health <= 0) {
              onPlayerDeath();
            }
          }
          
          // Enemy-projectile collision
          projectilesRef.current.forEach((projectile, pIndex) => {
            if (projectile.ownerId === player.id && collisionManager.checkCollision(projectile, entity)) {
              // Enemy takes damage
              const damage = projectile.damage;
              entity.takeDamage(damage);
              
              // Remove the projectile
              projectilesRef.current.splice(pIndex, 1);
              
              // Check if enemy is dead
              if (entity.health <= 0) {
                // Calculate score based on enemy size and level
                const score = Math.round(entity.radius * 2 + entity.level * 10);
                onScoreUpdate(score, true);
                
                // Respawn enemy in a random position
                entity.respawn(gameState.worldSize);
              }
            }
          });
        }
      });
      
      // Check collisions between player projectiles and enemy projectiles
      // (implement if needed)
    };

    // Render function for each frame
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Render grid background
      renderer.renderGrid();
      
      // Render world boundaries
      renderer.renderWorldBorders(gameState.worldSize);
      
      // Render entities
      gameState.entities.forEach(entity => {
        renderer.renderEntity(entity);
      });
      
      // Render projectiles
      projectilesRef.current.forEach(projectile => {
        renderer.renderProjectile(projectile);
      });
      
      // Render player
      if (gameState.player) {
        renderer.renderPlayer(gameState.player);
      } else {
        console.warn("No player to render");
      }
    };

    // Start game loop
    console.log("Starting game loop");
    gameLoop.start(update, render);
    console.log("Game loop started");

    // Clean up
    return () => {
      console.log("GameCanvas cleanup");
      window.removeEventListener("resize", resizeCanvas);
      if (gameLoop) {
        gameLoop.stop();
      }
      if (inputManager) {
        inputManager.cleanup();
      }
    };
  }, [gameState.player, gameState.entities, gameState.worldSize, onScoreUpdate, onPlayerDeath]);

  console.log("GameCanvas rendering");
  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full bg-gray-900"
    />
  );
};

export default GameCanvas;
