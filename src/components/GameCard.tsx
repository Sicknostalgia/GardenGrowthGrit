import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GameCardProps {
  level: number;
  isLocked: boolean;
  treesPlanted: number;
  maxTrees: number;
  onPlay: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ level, isLocked, treesPlanted, maxTrees, onPlay }) => {
  const progress = (treesPlanted / maxTrees) * 100;
  
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
      isLocked ? 'opacity-50 bg-gray-100' : 'bg-gradient-to-br from-green-100 to-emerald-200 shadow-lg'
    }`}>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-green-800 mb-2">Level {level}</div>
        
        {/* Tree Icon */}
        <div className="text-4xl mb-3">
          {isLocked ? '🔒' : '🌳'}
        </div>
        
        {!isLocked && (
          <>
            <div className="text-sm text-green-700 mb-2">
              {treesPlanted}/{maxTrees} trees planted
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-green-200 rounded-full h-2 mb-3">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}
        
        <Button 
          onClick={onPlay}
          disabled={isLocked}
          className={`w-full ${
            isLocked 
              ? 'bg-gray-400' 
              : 'bg-green-600 hover:bg-green-700 text-white shadow-md'
          }`}
        >
          {isLocked ? 'Locked' : 'Play'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;