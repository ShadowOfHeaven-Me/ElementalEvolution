import { useState, useEffect } from "react";
import Game from "./game/Game";
import Menu from "./components/Menu";
import { useAudio } from "./lib/stores/useAudio";
import { useGame } from "./lib/stores/useGame";
import "./index.css";

function App() {
  const { phase, start } = useGame();
  const [playerName, setPlayerName] = useState<string>("");
  const { isMuted, toggleMute } = useAudio();
  
  // Initialize audio elements
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    const audioStore = useAudio.getState();
    audioStore.setBackgroundMusic(bgMusic);
    audioStore.setHitSound(hitSound);
    audioStore.setSuccessSound(successSound);
    
    // Clean up on unmount
    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, []);

  // Handle game start
  const handleStartGame = (name: string) => {
    setPlayerName(name);
    start();
    
    // Start background music if not muted
    if (!isMuted) {
      const bgMusic = useAudio.getState().backgroundMusic;
      if (bgMusic) {
        bgMusic.play().catch(err => console.error("Error playing background music:", err));
      }
    }
  };

  return (
    <div className="app-container">
      {phase === "ready" && (
        <Menu 
          onStart={handleStartGame}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      )}
      
      {phase !== "ready" && (
        <Game 
          playerName={playerName}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      )}
    </div>
  );
}

export default App;
