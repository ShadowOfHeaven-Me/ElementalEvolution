import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export interface LeaderboardItem {
  id: string;
  name: string;
  score: number;
  level: number;
  isCurrentPlayer?: boolean;
}

interface LeaderboardProps {
  players: LeaderboardItem[];
}

const Leaderboard = ({ players }: LeaderboardProps) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 10);
  
  return (
    <Card className="w-64 bg-black/70 border-violet-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Trophy className="h-4 w-4 mr-1 text-yellow-400" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-1">
        <ul className="space-y-1 text-xs">
          {sortedPlayers.map((player, index) => (
            <li 
              key={player.id}
              className={`flex justify-between items-center py-1 px-2 rounded ${
                player.isCurrentPlayer 
                  ? "bg-violet-900/50 text-white font-medium" 
                  : "text-gray-300"
              }`}
            >
              <div className="flex items-center">
                <span className="w-5 text-center">{index + 1}</span>
                <span className="ml-2 truncate max-w-[100px]">{player.name}</span>
              </div>
              <div className="flex space-x-2">
                <span className="text-gray-400">Lv{player.level}</span>
                <span>{player.score.toLocaleString()}</span>
              </div>
            </li>
          ))}
          
          {sortedPlayers.length === 0 && (
            <li className="text-center text-gray-400 py-2">No players yet</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
