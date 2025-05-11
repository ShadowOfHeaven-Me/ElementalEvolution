import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Entity } from "../game/entities/Entity";
import { Player } from "../game/entities/Player";
import { Enemy } from "../game/entities/Enemy";
import { Food } from "../game/entities/Food";

interface MinimapProps {
  player: Player;
  entities: Entity[];
  worldSize: number;
  scale?: number;
}

const Minimap = ({ player, entities, worldSize, scale = 0.1 }: MinimapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const minimapSize = 150; // Size in pixels

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, minimapSize, minimapSize);

    // Background
    ctx.fillStyle = "#111a2e";
    ctx.fillRect(0, 0, minimapSize, minimapSize);

    // Draw grid lines
    ctx.strokeStyle = "#1a2b50";
    ctx.lineWidth = 0.5;
    
    const gridStep = minimapSize / 10;
    for (let i = 0; i <= 10; i++) {
      const pos = i * gridStep;
      
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(minimapSize, pos);
      ctx.stroke();
      
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, minimapSize);
      ctx.stroke();
    }

    // Draw border
    ctx.strokeStyle = "#3949ab";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, minimapSize, minimapSize);

    // Calculate ratios to convert world coordinates to minimap
    const ratio = minimapSize / worldSize;

    // Draw entities
    entities.forEach(entity => {
      const x = entity.position.x * ratio;
      const y = entity.position.y * ratio;
      const size = Math.max(3, entity.radius * ratio * 2);

      if (entity instanceof Food) {
        ctx.fillStyle = entity.color;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, size / 3), 0, Math.PI * 2);
        ctx.fill();
      } else if (entity instanceof Enemy) {
        ctx.fillStyle = entity.color;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(2, size / 2), 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw player
    if (player) {
      const x = player.position.x * ratio;
      const y = player.position.y * ratio;
      const size = Math.max(4, player.radius * ratio * 2);

      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add a white outline to the player
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

  }, [player, entities, worldSize, scale]);

  return (
    <Card className="p-0 overflow-hidden bg-transparent border-0 shadow-lg">
      <canvas
        ref={canvasRef}
        width={minimapSize}
        height={minimapSize}
        className="rounded-md"
      />
    </Card>
  );
};

export default Minimap;
