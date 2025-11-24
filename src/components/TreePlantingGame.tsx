import React, { useState, useEffect } from 'react';
import GradeSelector from './GradeSelector';
import GameCard from './GameCard';
import EnhancedGameBoard from './EnhancedGameBoard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameProgress {
  [key: string]: { [level: number]: boolean }; // grade -> level -> completed
}

const TreePlantingGame: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('kindergarten');
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [gameProgress, setGameProgress] = useState<GameProgress>({});

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('treePlantingProgress');
    if (saved) {
      setGameProgress(JSON.parse(saved));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('treePlantingProgress', JSON.stringify(gameProgress));
  }, [gameProgress]);

  const isLevelUnlocked = (level: number): boolean => {
    if (level === 1) return true;
    const prevLevel = level - 1;
    return gameProgress[selectedGrade]?.[prevLevel] || false;
  };

  const isLevelCompleted = (level: number): boolean => {
    return gameProgress[selectedGrade]?.[level] || false;
  };

  const handleLevelComplete = (success: boolean) => {
    if (currentLevel && success) {
      setGameProgress(prev => ({
        ...prev,
        [selectedGrade]: {
          ...prev[selectedGrade],
          [currentLevel]: true
        }
      }));
    }
    
    setTimeout(() => {
      setCurrentLevel(null);
    }, 2000);
  };

  const renderLevelGrid = () => {
    const levels = Array.from({ length: 50 }, (_, i) => i + 1);
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {levels.map(level => {
          const isUnlocked = isLevelUnlocked(level);
          const isCompleted = isLevelCompleted(level);
          
          return (
            <GameCard
              key={level}
              level={level}
              isLocked={!isUnlocked}
              treesPlanted={isCompleted ? 10 : 0}
              maxTrees={10}
              onPlay={() => setCurrentLevel(level)}
            />
          );
        })}
      </div>
    );
  };

  if (currentLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-100 p-4">
        <EnhancedGameBoard
          level={currentLevel}
          onComplete={handleLevelComplete}
          onBack={() => setCurrentLevel(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 text-center shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
            <CardTitle className="text-4xl font-bold mb-2">
              🌳 Tree Planting Adventure 🌳
            </CardTitle>
            <p className="text-lg opacity-90">
              Complete missions with Growth & Grit modes! Water and fertilize to level up!
            </p>
          </CardHeader>
        </Card>
        
        <GradeSelector 
          selectedGrade={selectedGrade}
          onGradeSelect={setSelectedGrade}
        />
        
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-800">
              Choose Your Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderLevelGrid()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TreePlantingGame;