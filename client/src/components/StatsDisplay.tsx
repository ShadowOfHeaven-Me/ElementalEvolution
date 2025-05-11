import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  score: number;
  kills: number;
  health: number;
  maxHealth: number;
  particleType: string;
  evolutionPath: string;
}

interface StatsDisplayProps {
  stats: PlayerStats;
  topPlayerScore?: number; // Optional top player score from leaderboard
}

const StatsDisplay = ({ stats, topPlayerScore }: StatsDisplayProps) => {
  // Calculate XP percentage based on top player score if available
  let xpPercentage: number;
  let xpDisplay: string;
  
  if (topPlayerScore && topPlayerScore > 0) {
    // Use the top player's score as a benchmark
    xpPercentage = Math.min((stats.score / topPlayerScore) * 100, 100);
    xpDisplay = `${stats.score}/${topPlayerScore}`;
  } else {
    // Fallback to the traditional XP to next level
    xpPercentage = (stats.xp / stats.xpToNextLevel) * 100;
    xpDisplay = `${stats.xp}/${stats.xpToNextLevel} XP`;
  }
  
  const healthPercentage = (stats.health / stats.maxHealth) * 100;
  
  return (
    <Card className="w-64 bg-black/70 border-violet-500/30">
      <CardContent className="p-3">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <div className="font-semibold">Level {stats.level}</div>
            <div className="text-gray-400">{xpDisplay}</div>
          </div>
          
          <Progress value={xpPercentage} className="h-2 bg-gray-800" indicatorClassName="bg-blue-400" />
          
          <div className="flex justify-between text-xs">
            <div className="text-gray-300">Health</div>
            <div className="text-gray-400">{Math.round(stats.health)}/{stats.maxHealth}</div>
          </div>
          
          <Progress value={healthPercentage} className="h-2 bg-gray-800" indicatorClassName="bg-green-500" />
          
          <div className="pt-1 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Score:</span>
              <span className="font-medium">{stats.score.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Kills:</span>
              <span className="font-medium">{stats.kills}</span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Type:</span>
              <span className="font-medium">{stats.particleType}</span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Evolution:</span>
              <span className="font-medium text-violet-400">{stats.evolutionPath}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsDisplay;
