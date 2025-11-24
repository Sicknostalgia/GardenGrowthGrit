import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface GameMode {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

interface GameModeSelectorProps {
  modes: GameMode[];
  selectedMode: string | null;
  onModeSelect: (modeId: string) => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  modes,
  selectedMode,
  onModeSelect
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {modes.map((mode) => (
        <Card
          key={mode.id}
          className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
            selectedMode === mode.id
              ? 'ring-4 ring-blue-500 shadow-xl'
              : 'hover:shadow-lg'
          }`}
          onClick={() => onModeSelect(mode.id)}
        >
          <CardContent className="p-4 text-center">
            <div className={`text-4xl mb-2 ${mode.color}`}>
              {mode.icon}
            </div>
            <h3 className="font-bold text-lg mb-1">{mode.name}</h3>
            <p className="text-sm text-gray-600">{mode.description}</p>
            {selectedMode === mode.id && (
              <div className="mt-2 text-blue-600 font-semibold">
                ✓ Selected
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GameModeSelector;