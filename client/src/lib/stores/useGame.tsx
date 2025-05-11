import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";

interface GameState {
  phase: GamePhase;
  
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    phase: "ready",
    
    start: () => {
      set((state) => {
        // Only transition from ready to playing
        if (state.phase === "ready") {
          return { phase: "playing" };
        }
        return {};
      });
    },
    
    restart: () => {
      // First set to ended to ensure cleanup
      set((state) => {
        console.log("Game restart called, current phase:", state.phase);
        return { phase: "ended" };
      });
      
      // Then set a small timeout to transition back to playing
      setTimeout(() => {
        console.log("Setting game phase to playing after restart");
        set(() => ({ phase: "playing" }));
      }, 50); 
    },
    
    end: () => {
      set((state) => {
        // Only transition from playing to ended
        if (state.phase === "playing") {
          return { phase: "ended" };
        }
        return {};
      });
    }
  }))
);
