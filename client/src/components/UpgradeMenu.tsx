import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UpgradeOption } from "../game/constants/Upgrades";

interface UpgradeMenuProps {
  options: UpgradeOption[];
  onSelect: (upgrade: UpgradeOption) => void;
  onClose: () => void;
  visible: boolean;
}

const UpgradeMenu = ({ options, onSelect, onClose, visible }: UpgradeMenuProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-9
      const key = parseInt(e.key);
      if (!isNaN(key) && key >= 1 && key <= options.length) {
        setSelectedIndex(key - 1);
        onSelect(options[key - 1]);
        onClose();
      }
      
      // Escape key
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, options, onSelect, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <Card className="w-[500px] max-h-[80vh] overflow-auto bg-gray-900 border-violet-500">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-violet-400 text-center">Evolution Available!</h2>
          <p className="text-gray-300 mb-6 text-center">Choose your upgrade path (press number keys 1-{options.length} to select)</p>
          
          <div className="space-y-4">
            {options.map((option, index) => (
              <Button
                key={option.id}
                className={`w-full flex items-center p-4 h-auto justify-between border ${
                  selectedIndex === index
                    ? "bg-violet-800 border-violet-400"
                    : "bg-gray-800 hover:bg-gray-700 border-gray-700"
                }`}
                onClick={() => {
                  setSelectedIndex(index);
                  onSelect(option);
                  onClose();
                }}
              >
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 mr-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: option.color }}
                  >
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{option.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                  </div>
                </div>
                <div className="font-mono text-xs">
                  {option.stats.map((stat, i) => (
                    <div key={i}>{stat.name}: +{stat.value}</div>
                  ))}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpgradeMenu;
