import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface GameAction {
  id: string;
  name: string;
  icon: string;
  cost: number;
  cooldown: number;
  description: string;
}

interface GameActionsProps {
  actions: GameAction[];
  selectedAction: string | null;
  onActionSelect: (actionId: string) => void;
  actionCooldowns: { [key: string]: number };
  canAfford: (cost: number) => boolean;
}

const GameActions: React.FC<GameActionsProps> = ({
  actions,
  selectedAction,
  onActionSelect,
  actionCooldowns,
  canAfford
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {actions.map((action) => {
            const cooldownRemaining = actionCooldowns[action.id] || 0;
            const isOnCooldown = cooldownRemaining > 0;
            const canUse = canAfford(action.cost) && !isOnCooldown;
            const isSelected = selectedAction === action.id;
            
            return (
              <Button
                key={action.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                disabled={!canUse}
                onClick={() => onActionSelect(action.id)}
                className={`flex flex-col h-auto p-3 ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="text-2xl mb-1">{action.icon}</div>
                <div className="text-xs font-medium">{action.name}</div>
                {isOnCooldown ? (
                  <div className="text-xs text-red-500">{cooldownRemaining}s</div>
                ) : (
                  <div className="text-xs text-gray-500">Cost: {action.cost}</div>
                )}
              </Button>
            );
          })}
        </div>
        {selectedAction && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-center">
            {actions.find(a => a.id === selectedAction)?.description}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameActions;