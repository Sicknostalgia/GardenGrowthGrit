// ==========================================
// 🍀 1. IMPORTS
// (Everything needed from React + UI components)
// ==========================================
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import GameModeSelector, { GameMode } from './GameModeSelector';
import MissionTracker, { Mission } from './MissionTracker';
import GameActions, { GameAction } from './GameActions';


// ==========================================
// 🌳 2. TYPES & INTERFACES
// ==========================================
interface EnhancedGameBoardProps {
  level: number;
  onComplete: (success: boolean) => void;
  onBack: () => void;
}

interface TreeState {
  id: number;
  x: number;
  y: number;
  growth: number;
  watered: boolean;
  fertilized: boolean;
  stage: 'seed' | 'sprout' | 'sapling' | 'tree';
}


// ==========================================
// 🎮 3. MAIN COMPONENT
// ==========================================
const EnhancedGameBoard: React.FC<EnhancedGameBoardProps> = ({ level, onComplete, onBack }) => {

  // ------------------------------------------
  // 🧠 3A. REACT STATES (Game Data)
  // ------------------------------------------
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>('plant');
  const [trees, setTrees] = useState<TreeState[]>([]);
  const [resources, setResources] = useState({ water: 10, fertilizer: 5, seeds: 15 });
  const [actionCooldowns, setActionCooldowns] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(25);
  const [gameActive, setGameActive] = useState(true);


  // ------------------------------------------
  // 🪄 3B. GAME MODE DEFINITIONS
  // ------------------------------------------
  const gameModes: GameMode[] = [
    { id: 'growth', name: 'Growth Mode', icon: '🌱', description: 'Focus on growing healthy trees', color: 'text-green-500' },
    { id: 'grit', name: 'Grit Mode', icon: '💪', description: 'Overcome challenges and obstacles', color: 'text-orange-500' },
    { id: 'speed', name: 'Speed Mode', icon: '⚡', description: 'Plant trees as fast as possible', color: 'text-yellow-500' }
  ];

  // ------------------------------------------
  // 🧰 3C. ACTION DEFINITIONS
  // ------------------------------------------
  const gameActions: GameAction[] = [
    { id: 'plant', name: 'Plant', icon: '🌱', cost: 1, cooldown: 0, description: 'Plant a new tree seed' },
    { id: 'water', name: 'Water', icon: '💧', cost: 1, cooldown: 2, description: 'Water trees to help them grow' },
    { id: 'fertilize', name: 'Fertilize', icon: '🧪', cost: 1, cooldown: 5, description: 'Add fertilizer for faster growth' }
  ];


  // ------------------------------------------
  // 🎯 3D. MISSION DATA
  // ------------------------------------------
  const [missions, setMissions] = useState<Mission[]>([
    { id: '1', name: 'Plant Trees', description: 'Plant 10 trees', target: 10, current: 0, icon: '🌱', completed: false },
    { id: '2', name: 'Water Plants', description: 'Water 8 trees', target: 8, current: 0, icon: '💧', completed: false },
    { id: '3', name: 'Use Fertilizer', description: 'Fertilize 5 trees', target: 5, current: 0, icon: '🧪', completed: false }
  ]);


  // ==========================================
  // ⏱️ 4. GAME TIMER + COOLDOWN EFFECTS
  // ==========================================
  useEffect(() => {
    if (!gameActive || trees.length === 0) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      checkGameComplete();
    }
  }, [timeLeft, gameActive, trees.length]);


  // Action cooldown countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setActionCooldowns(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) updated[key]--;
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  // ==========================================
  // 🏁 5. GAME & MISSION COMPLETION LOGIC
  // ==========================================
  const updateMission = (missionId: string, increment: number) => {
    setMissions(prev =>
      prev.map(mission => {
        if (mission.id === missionId && !mission.completed) {
          const newCurrent = Math.min(mission.current + increment, mission.target);
          return { ...mission, current: newCurrent, completed: newCurrent >= mission.target };
        }
        return mission;
      })
    );
  };

  const checkGameComplete = () => {
    setGameActive(false);
    const allCompleted = missions.every(m => m.completed);
    onComplete(allCompleted);
  };


  // ==========================================
  // 🖱️ 6. TREE INTERACTIONS
  // ==========================================
  const handleTreeClick = (treeId: number) => {
    if (!gameActive || !selectedAction) return;

    if (selectedAction === 'water' && resources.water > 0) {
      setTrees(prev =>
        prev.map(tree =>
          tree.id === treeId && !tree.watered
            ? { ...tree, watered: true, growth: Math.min(tree.growth + 25, 100) }
            : tree
        )
      );
      setResources(prev => ({ ...prev, water: prev.water - 1 }));
      setActionCooldowns(prev => ({ ...prev, water: 2 }));
      updateMission('2', 1);
    }

    if (selectedAction === 'fertilize' && resources.fertilizer > 0) {
      setTrees(prev =>
        prev.map(tree =>
          tree.id === treeId && !tree.fertilized
            ? { ...tree, fertilized: true, growth: Math.min(tree.growth + 50, 100) }
            : tree
        )
      );
      setResources(prev => ({ ...prev, fertilizer: prev.fertilizer - 1 }));
      updateMission('3', 1);
    }
  };


  // ==========================================
  // 🖱️ 7. BOARD CLICK = PLANT TREE
  // ==========================================
  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameActive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (resources.seeds > 0) {
      if (trees.length === 0) setGameActive(true);

      const newTree: TreeState = {
        id: Date.now(),
        x, y,
        growth: 0,
        watered: false,
        fertilized: false,
        stage: 'seed'
      };

      setTrees(prev => [...prev, newTree]);
      setResources(prev => ({ ...prev, seeds: prev.seeds - 1 }));
      updateMission('1', 1);
    }
  };


  // ==========================================
  // 🌲 8. TREE ICON HELPER
  // ==========================================
  const getTreeIcon = (tree: TreeState) => {
    if (tree.growth < 25) return '🌱';
    if (tree.growth < 50) return '🌿';
    if (tree.growth < 75) return '🌳';
    return '🌲';
  };


  // ==========================================
  // 🖼️ 9. MODE SELECTION SCREEN
  // ==========================================
  if (!selectedMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle>Choose Your Game Mode - Level {level}</CardTitle>
          </CardHeader>
          <CardContent>
            <GameModeSelector
              modes={gameModes}
              selectedMode={selectedMode}
              onModeSelect={setSelectedMode}
            />
            <div className="text-center">
              <Button onClick={onBack} variant="outline">Back to Levels</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  // ==========================================
  // 🎨 10. MAIN GAME UI
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto">
      {/* Missions */}
      <MissionTracker missions={missions} level={level} />

      {/* Action Buttons */}
      <GameActions
        actions={gameActions}
        selectedAction={selectedAction}
        onActionSelect={setSelectedAction}
        actionCooldowns={actionCooldowns}
        canAfford={(cost, actionId) => {
          switch (actionId) {
            case 'plant': return resources.seeds >= cost;
            case 'water': return resources.water >= cost && (actionCooldowns.water ?? 0) <= 0;
            case 'fertilize': return resources.fertilizer >= cost && (actionCooldowns.fertilize ?? 0) <= 0;
            default: return true;
          }
        }}
      />

      {/* Game Board */}
      <Card>
        <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardTitle>Level {level} - {gameModes.find(m => m.id === selectedMode)?.name}</CardTitle>
          <div className="flex justify-between items-center mt-2">
            <span>Seeds: {resources.seeds} | Water: {resources.water} | Fertilizer: {resources.fertilizer}</span>
            <span>Time: {timeLeft}s</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div
            className="relative h-96 bg-gradient-to-b from-sky-200 to-green-300 cursor-pointer overflow-hidden"
            onClick={handleBoardClick}
          >
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-amber-600 to-green-400" />

            {trees.map(tree => (
              <div
                key={tree.id}
                className="absolute text-3xl cursor-pointer hover:scale-110 transition-transform"
                style={{ left: `${tree.x}%`, top: `${tree.y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTreeClick(tree.id);
                }}
              >
                {getTreeIcon(tree)}
              </div>
            ))}

            {trees.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🌱</div>
                  <div className="font-semibold">Click to plant trees!</div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 flex justify-between">
            <Button onClick={onBack} variant="outline">Back</Button>

            {!gameActive && (
              <div className="text-center font-bold">
                {missions.every(m => m.completed) ? '🎉 Mission Complete!' : '⏰ Time Up!'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedGameBoard;
