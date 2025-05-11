import { useState, useEffect, useCallback } from "react";
import GameCanvas from "./GameCanvas";
import GameUI from "./GameUI";
import { useGame } from "../lib/stores/useGame";
import { useAudio } from "../lib/stores/useAudio";
import { UpgradeOption, getUpgradesForLevel } from "./constants/Upgrades";
import { Player } from "./entities/Player";
import { Enemy } from "./entities/Enemy";
import { Food } from "./entities/Food";
import { createInitialEntities } from "./utils/MathUtils";
import { Vector } from "./utils/Vector";

interface GameProps {
  playerName: string;
  isMuted: boolean;
  onToggleMute: () => void;
}

interface GameState {
  player: Player | null;
  entities: (Enemy | Food)[];
  score: number;
  kills: number;
  worldSize: number;
  showUpgradeMenu: boolean;
  upgradeOptions: UpgradeOption[];
  leaderboard: { id: string; name: string; score: number; level: number; isCurrentPlayer?: boolean; }[];
}

const Game = ({ playerName, isMuted, onToggleMute }: GameProps) => {
  const { phase, end, restart } = useGame();
  const { playHit, playSuccess } = useAudio();
  
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>(() => {
    const worldSize = 4000;
    const initialEntities = createInitialEntities(worldSize);
    
    const player = new Player({
      id: "player",
      position: new Vector(worldSize / 2, worldSize / 2),
      radius: 20,
      speed: 250,
      name: playerName,
      color: "#8a2be2", // BlueViolet - initial electron color
    });
    
    return {
      player: player,
      entities: initialEntities,
      score: 0,
      kills: 0,
      worldSize: worldSize,
      showUpgradeMenu: false,
      upgradeOptions: [],
      leaderboard: [
        // Add some initial AI players to the leaderboard
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `ai-${i + 1}`,
          name: `Cosmic${i + 1}`,
          score: Math.floor(Math.random() * 5000),
          level: Math.floor(Math.random() * 5) + 1,
        })),
        // Add the player
        {
          id: "player",
          name: playerName,
          score: 0,
          level: 1,
          isCurrentPlayer: true
        }
      ]
    };
  });
  
  // Check for level up and show upgrade menu
  useEffect(() => {
    if (!gameState.player) return;
    
    const player = gameState.player;
    const currentLevel = player.level;
    const xpRequired = player.xpToNextLevel;
    
    if (player.xp >= xpRequired && !gameState.showUpgradeMenu) {
      // Level up and show upgrade menu
      player.levelUp();
      
      // Play success sound
      playSuccess();
      
      // Get upgrade options based on level and current path
      const upgradeOptions = getUpgradesForLevel(
        currentLevel + 1, 
        player.evolutionPath
      );
      
      setGameState(prev => ({
        ...prev,
        showUpgradeMenu: true,
        upgradeOptions
      }));
      
      // Update leaderboard
      setGameState(prev => {
        const updatedLeaderboard = prev.leaderboard.map(item => {
          if (item.id === "player") {
            return {
              ...item,
              level: player.level,
              score: prev.score
            };
          }
          return item;
        });
        
        return {
          ...prev,
          leaderboard: updatedLeaderboard
        };
      });
    }
  }, [gameState.player?.xp, gameState.showUpgradeMenu, playSuccess]);
  
  // Handle selecting an upgrade
  const handleUpgradeSelect = useCallback((upgrade: UpgradeOption) => {
    if (!gameState.player) return;
    
    const player = gameState.player;
    
    // Apply the upgrade to the player
    player.applyUpgrade(upgrade);
    
    // Hide the upgrade menu
    setGameState(prev => ({
      ...prev,
      showUpgradeMenu: false
    }));
  }, [gameState.player]);
  
  // Handle closing the upgrade menu without selecting
  const handleCloseUpgradeMenu = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showUpgradeMenu: false
    }));
  }, []);
  
  // Handle score updates
  const handleScoreUpdate = useCallback((scoreChange: number, isKill: boolean = false) => {
    setGameState(prev => {
      const newScore = prev.score + scoreChange;
      const newKills = isKill ? prev.kills + 1 : prev.kills;
      
      // Also update the player's XP
      if (prev.player) {
        prev.player.addXP(scoreChange);
      }
      
      // Update leaderboard
      const updatedLeaderboard = prev.leaderboard.map(item => {
        if (item.id === "player") {
          return {
            ...item,
            score: newScore
          };
        }
        return item;
      });
      
      // Sort leaderboard by score
      updatedLeaderboard.sort((a, b) => b.score - a.score);
      
      return {
        ...prev,
        score: newScore,
        kills: newKills,
        leaderboard: updatedLeaderboard
      };
    });
    
    // Play hit sound for successful hits
    if (scoreChange > 0) {
      playHit();
    }
  }, [playHit]);
  
  // Handle player death
  const handlePlayerDeath = useCallback(() => {
    // End the game
    end();
  }, [end]);
  
  // Handle game restart
  const handleRestart = useCallback(() => {
    restart();
  }, [restart]);
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <GameCanvas 
        gameState={gameState}
        onScoreUpdate={handleScoreUpdate}
        onPlayerDeath={handlePlayerDeath}
      />
      
      <GameUI 
        player={gameState.player}
        score={gameState.score}
        kills={gameState.kills}
        leaderboard={gameState.leaderboard}
        showUpgradeMenu={gameState.showUpgradeMenu}
        upgradeOptions={gameState.upgradeOptions}
        onUpgradeSelect={handleUpgradeSelect}
        onCloseUpgradeMenu={handleCloseUpgradeMenu}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        isGameOver={phase === "ended"}
        onRestart={handleRestart}
        worldSize={gameState.worldSize}
        entities={gameState.entities}
      />
    </div>
  );
};

export default Game;
