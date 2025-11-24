import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface GameBoardProps {
  level: number;
  targetTrees: number;
  onComplete: (treesPlanted: number) => void;
  onBack: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ level, targetTrees, onComplete, onBack }) => {
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [plantedPositions, setPlantedPositions] = useState<{x: number, y: number}[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
      onComplete(treesPlanted);
    }
  }, [timeLeft, gameActive, treesPlanted, onComplete]);

  useEffect(() => {
    if (treesPlanted >= targetTrees) {
      setGameActive(false);
      onComplete(treesPlanted);
    }
  }, [treesPlanted, targetTrees, onComplete]);

  const handlePlantTree = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPlantedPositions(prev => [...prev, { x, y }]);
    setTreesPlanted(prev => prev + 1);
  };

  const progress = (treesPlanted / targetTrees) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl">
      <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardTitle className="text-2xl font-bold">
          Level {level} - Plant {targetTrees} Trees!
        </CardTitle>
        <div className="flex justify-between items-center mt-2">
          <span>Trees: {treesPlanted}/{targetTrees}</span>
          <span>Time: {timeLeft}s</span>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          className="relative h-96 bg-gradient-to-b from-sky-200 to-green-300 cursor-pointer overflow-hidden"
          onClick={handlePlantTree}
        >
          {/* Ground */}
          <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-amber-600 to-green-400" />
          
          {/* Planted Trees */}
          {plantedPositions.map((pos, index) => (
            <div
              key={index}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              🌳
            </div>
          ))}
          
          {/* Click instruction */}
          {treesPlanted === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌳</div>
                <div className="font-semibold">Click anywhere to plant trees!</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 flex justify-between">
          <Button onClick={onBack} variant="outline">
            Back to Levels
          </Button>
          
          {!gameActive && (
            <div className="text-center">
              {treesPlanted >= targetTrees ? (
                <div className="text-green-600 font-bold">🎉 Level Complete!</div>
              ) : (
                <div className="text-orange-600 font-bold">⏰ Time's Up!</div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameBoard;