import { useState, useEffect } from "react";
import { Player } from "./entities/Player";
import { Entity } from "./entities/Entity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { LeaderboardItem } from "../components/Leaderboard";
import Leaderboard from "../components/Leaderboard";
import StatsDisplay from "../components/StatsDisplay";
import Minimap from "../components/Minimap";
import UpgradeMenu from "../components/UpgradeMenu";
import { UpgradeOption } from "./constants/Upgrades";

interface GameUIProps {
  player: Player | null;
  score: number;
  kills: number;
  leaderboard: LeaderboardItem[];
  showUpgradeMenu: boolean;
  upgradeOptions: UpgradeOption[];
  onUpgradeSelect: (upgrade: UpgradeOption) => void;
  onCloseUpgradeMenu: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isGameOver: boolean;
  onRestart: () => void;
  worldSize: number;
  entities: (Enemy | Food)[];
}

const GameUI = ({
  player,
  score,
  kills,
  leaderboard,
  showUpgradeMenu,
  upgradeOptions,
  onUpgradeSelect,
  onCloseUpgradeMenu,
  isMuted,
  onToggleMute,
  isGameOver,
  onRestart,
  worldSize,
  entities
}: GameUIProps) => {
  const [playerStats, setPlayerStats] = useState({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    score: 0,
    kills: 0,
    health: 100,
    maxHealth: 100,
    particleType: "Electron",
    evolutionPath: "Subatomic"
  });
  
  // Update player stats
  useEffect(() => {
    if (player) {
      setPlayerStats({
        level: player.level,
        xp: player.xp,
        xpToNextLevel: player.xpToNextLevel,
        score: score,
        kills: kills,
        health: player.health,
        maxHealth: player.maxHealth,
        particleType: player.particleType,
        evolutionPath: player.evolutionPath
      });
    }
  }, [player, score, kills]);

  return (
    <>
      {/* Top bar - Score and Level */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 text-white bg-black/50 px-4 py-2 rounded-md">
        <div className="text-lg font-semibold">
          Score: <span className="text-violet-400">{score.toLocaleString()}</span>
        </div>
        <div className="text-lg font-semibold">
          Level: <span className="text-blue-400">{playerStats.level}</span>
        </div>
        <div className="text-lg font-semibold">
          Kills: <span className="text-red-400">{kills}</span>
        </div>
      </div>
      
      {/* Mute button - Top right */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMute}
          className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>
      
      {/* Right side - Leaderboard */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-0">
        <Leaderboard players={leaderboard} />
      </div>
      
      {/* Bottom right - Stats and Minimap */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <StatsDisplay stats={playerStats} />
        {player && <Minimap player={player} entities={entities} worldSize={worldSize} />}
      </div>
      
      {/* Upgrade Menu - Center modal */}
      <UpgradeMenu
        options={upgradeOptions}
        onSelect={onUpgradeSelect}
        onClose={onCloseUpgradeMenu}
        visible={showUpgradeMenu}
      />
      
      {/* Game Over screen */}
      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <Card className="w-[350px] bg-gray-900 border-violet-500">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-red-500">Game Over</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-lg text-gray-200">
                  Final Score: <span className="text-violet-400 font-bold">{score.toLocaleString()}</span>
                </div>
                <div className="text-lg text-gray-200">
                  Level Reached: <span className="text-blue-400 font-bold">{playerStats.level}</span>
                </div>
                <div className="text-lg text-gray-200">
                  Total Kills: <span className="text-red-400 font-bold">{kills}</span>
                </div>
                <div className="text-lg text-gray-200">
                  Final Form: <span className="text-green-400 font-bold">{playerStats.particleType}</span>
                </div>
              </div>
              
              <Button 
                onClick={onRestart} 
                className="w-full mt-4 bg-violet-700 hover:bg-violet-600 text-white"
              >
                Play Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default GameUI;
