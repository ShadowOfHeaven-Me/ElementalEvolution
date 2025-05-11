import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, VolumeX } from "lucide-react";

interface MenuProps {
  onStart: (name: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const Menu = ({ onStart, isMuted, onToggleMute }: MenuProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a nickname");
      return;
    }
    
    if (name.length > 15) {
      setError("Nickname must be 15 characters or less");
      return;
    }
    
    onStart(name.trim());
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-900 to-black">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMute}
          className="h-12 w-12 rounded-full bg-black/30 hover:bg-black/50"
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6 text-white" />
          ) : (
            <Volume2 className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>
      
      <Card className="w-[350px] bg-black/80 border-violet-500/50 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-violet-400">
            CosmicParticles.io
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter your nickname"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="bg-gray-900 border-violet-600 text-white placeholder:text-gray-400"
                maxLength={15}
              />
              {error && (
                <p className="text-red-400 text-sm mt-1">{error}</p>
              )}
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-violet-700 hover:bg-violet-600 text-white"
              >
                Play
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 text-xs text-gray-400">
          <p>Controls: WASD or Arrow keys to move</p>
          <p>Mouse to aim, Click to shoot</p>
          <p>Use numbers 1-9 to select upgrades</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Menu;
