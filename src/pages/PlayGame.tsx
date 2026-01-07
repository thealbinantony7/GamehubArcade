
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import DynamicIsland from "@/components/layout/DynamicIsland";
import ThemeToggle from "@/components/TicTacToe/ThemeToggle";
import SoundToggle from "@/components/TicTacToe/SoundToggle";
import { soundManager } from "@/utils/sounds";
import { getArcadeGame } from "@/data/games/arcadeGames";

const PlayGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    soundManager.playClick();
    navigate("/arcade");
  };

  const game = gameId ? getArcadeGame(gameId) : undefined;
  const GameComponent = game?.component;

  if (!GameComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <DynamicIsland />
        <ThemeToggle />
        <SoundToggle />

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-semibold text-foreground mb-4">
            Game Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The arcade machine is broken.
          </p>
          <motion.button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-button text-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Arcade
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with controls */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 pointer-events-none">
        <motion.button
          onClick={handleBack}
          className="p-3 rounded-full glass-button text-foreground pointer-events-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        <div className="flex items-center gap-2 pointer-events-auto">
          <SoundToggle className="glass-button rounded-full p-3" />
          <ThemeToggle className="glass-button rounded-full p-3" />
        </div>
      </div>

      {/* Game content */}
      <div className="pt-20 h-screen w-full flex items-center justify-center">
        <GameComponent />
      </div>
    </div>
  );
};

export default PlayGame;
