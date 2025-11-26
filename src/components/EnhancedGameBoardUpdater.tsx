import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import GameModeSelector, { GameMode } from './GameModeSelector';
import MissionTracker, { Mission } from './MissionTracker';
import GameActions, { GameAction } from './GameActions';

interface EnhancedGameBoardProps {
  level: number;
  mode?: 'growth' | 'grit' | 'speed';
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

const EnhancedGameBoard: React.FC<EnhancedGameBoardProps> = ({ level, mode = "growth", onComplete, onBack }) => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>('plant');
  const [gameOverReason, setGameOverReason] = useState<'time' | 'forbidden' | null>(null);
  const [trees, setTrees] = useState<TreeState[]>([]);
  const [resources, setResources] = useState({ water: 10, fertilizer: 5, seeds: 15 });
  const [actionCooldowns, setActionCooldowns] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(25);
  const [gameActive, setGameActive] = useState(false);

  const gameModes: GameMode[] = [
    { id: 'growth', name: 'Growth Mode', icon: '🌱', description: 'Focus on growing healthy trees', color: 'text-green-500' },
    { id: 'grit', name: 'Grit Mode', icon: '💪', description: 'Overcome challenges and obstacles', color: 'text-orange-500' },
    { id: 'speed', name: 'Speed Mode', icon: '⚡', description: 'Plant trees as fast as possible', color: 'text-yellow-500' }
  ];
const isEndless = mode === "grit" || mode === "speed";

  const gameActions: GameAction[] = [
    { id: 'plant', name: 'Plant', icon: '🌱', cost: 1, cooldown: 0, description: 'Plant a new tree seed' },
    { id: 'water', name: 'Water', icon: '💧', cost: 1, cooldown: 2, description: 'Water trees to help them grow' },
    { id: 'fertilize', name: 'Fertilize', icon: '🧪', cost: 1, cooldown: 5, description: 'Add fertilizer for faster growth' }
  ];

 const [missions, setMissions] = useState<Mission[]>(
  mode === "growth"
    ? [
        { id: '1', name: 'Plant Trees', description: 'Plant 10 trees', target: 10, current: 0, icon: '🌱', completed: false },
        { id: '2', name: 'Water Plants', description: 'Water 8 trees', target: 8, current: 0, icon: '💧', completed: false },
        { id: '3', name: 'Use Fertilizer', description: 'Fertilize 5 trees', target: 5, current: 0, icon: '🧪', completed: false }
      ]
    : []  // ❌ no missions for endless modes
);

  const checkEarlyGameComplete = () => {
  const allDone = missions.every(m => m.completed === true);

  if (allDone) {
    checkGameComplete();
    console.log("🎉 EARLY GAME COMPLETE!");
    setGameActive(false);      // stop all actions
    // setShowGameOver(true);     // show game over screen if you have one
  }
};
  useEffect(() => {
if (!gameActive || trees.length === 0) return;
if (!isEndless) checkEarlyGameComplete();
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);

  } else {
  if (!isEndless || mode === "speed") {
    checkGameComplete();
  }}
  }, [timeLeft, gameActive,trees.length]); // this is where useEffect based on. "it is called dependencies"

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
  const checkGameComplete = () => {
    setGameActive(false);
    const allCompleted = missions.every(m => m.completed);
    onComplete(allCompleted);
  };

  const handleTreeClick = (treeId: number) => {
    if (!gameActive || !selectedAction) return;
    
    if (selectedAction === 'water' && resources.water > 0) {
      setTrees(prev => prev.map(tree => {
        if (tree.id === treeId && !tree.watered) {
          return { ...tree, watered: true, growth: Math.min(tree.growth + 25, 100) };
        }
        return tree;
      }));
      setResources(prev => ({ ...prev, water: prev.water - 1 }));
      setActionCooldowns(prev => ({ ...prev, water: 2 }));
if (!isEndless) updateMission('2', 1);
    } else if (selectedAction === 'fertilize' && resources.fertilizer > 0) {
      setTrees(prev => prev.map(tree => {
        if (tree.id === treeId && !tree.fertilized) {
          return { ...tree, fertilized: true, growth: Math.min(tree.growth + 50, 100) };
        }
        return tree;
      }));
      setResources(prev => ({ ...prev, fertilizer: prev.fertilizer - 1 }));

  if (!isEndless) updateMission('3', 1);
    }
  };
const forbiddenZones = [
  { id: "zone1", x: 50, y: 50, width: 120, height: 120 },
  { id: "zone2", x: 300, y: 180, width: 150, height: 100 },
];

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
if (!gameActive && trees.length > 0) return; // only block if game has ended

    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

 if (mode === "grit") {
    for (const zone of forbiddenZones) {
      const inZone =
        x >= zone.x &&
        x <= zone.x + zone.width &&
        y >= zone.y &&
        y <= zone.y + zone.height;

      if (inZone) {
        console.log("❌ Forbidden area in grit mode");
        return; // stop planting
      }
    }
  }
    if (resources.seeds > 0) {
       // 🌱 First-ever tree → Start the timer
    if (trees.length === 0) {
      setGameActive(true);
    }
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
if (!isEndless) updateMission('1', 1);

    }
  };


  const updateMission = (missionId: string, increment: number) => {
    setMissions(prev => prev.map(mission => {
      if (mission.id === missionId && !mission.completed) {
        const newCurrent = Math.min(mission.current + increment, mission.target);
        return { ...mission, current: newCurrent, completed: newCurrent >= mission.target };
      }
      return mission;
    }));
  };


  const getTreeIcon = (tree: TreeState) => {
    if (tree.growth < 25) return '🌱';
    if (tree.growth < 50) return '🌿';
    if (tree.growth < 75) return '🌳';
    return '🌲';
  };




  return (
    <div className="max-w-4xl mx-auto">
   {!isEndless && <MissionTracker missions={missions} level={level} />}
      
      <GameActions
        actions={gameActions}
        selectedAction={selectedAction}
        onActionSelect={setSelectedAction}
        actionCooldowns={actionCooldowns}
 canAfford={(cost, actionId) => {
    // Check resource and cooldown for the specific action
    switch(actionId) {
      case 'plant':
        return resources.seeds >= cost && (actionCooldowns.plant ?? 0) <= 0;
      case 'water':
        return resources.water >= cost && (actionCooldowns.water ?? 0) <= 0;
      case 'fertilize':
        return resources.fertilizer >= cost && (actionCooldowns.fertilize ?? 0) <= 0;
      default:
        return true;
    }}
       }

      />
      
      <Card>
        <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white">
         <CardTitle>
  {isEndless
    ? (mode === "speed" ? "⚡ Speed Endless Mode" : "💪 Grit Endless Mode")
    : `Level ${level} - Growth Mode`
  }
</CardTitle>

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
    {/* ⬇️ GROUND */}
    <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-amber-600 to-green-400" />

    {/* ⛔ FORBIDDEN ZONES (GRIT & SPEED ONLY) */}
  {isEndless && forbiddenZones.map(zone => (
  <div
    key={zone.id}
    onClick={(e) => {
      e.stopPropagation();
      console.log("❌ Forbidden zone clicked – Game Over");
      setGameActive(false);
      setGameOverReason('forbidden');   // <- track reason
      onComplete(false);
    }}
    style={{
      position: "absolute",
      left: `${zone.x}px`,
      top: `${zone.y}px`,
      width: `${zone.width}px`,
      height: `${zone.height}px`,
      backgroundColor: "rgba(255, 0, 0, 0.25)",
      border: "2px dashed red",
      borderRadius: "8px",
      cursor: "not-allowed",
      zIndex: 5,
    }}
  />
))}


    {/* 🌳 TREES */}
    {trees.map((tree) => (
      <div
        key={tree.id}
        className="absolute text-3xl cursor-pointer hover:scale-110 transition-transform"
        style={{
          left: `${tree.x}%`,
          top: `${tree.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleTreeClick(tree.id);
        }}
      >
        {getTreeIcon(tree)}
      </div>
    ))}

    {/* FIRST TIME HELP OVERLAY */}
    {trees.length === 0 && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
    {gameOverReason === 'forbidden' 
      ? '⏰ Game is Over Try Again!' 
      : (!isEndless && missions.every(m => m.completed) 
          ? '🎉 Mission Complete!' 
          : 'Game is Over Try Again!')}
  </div>
)}
  </div>
</CardContent>

      </Card>
    </div>
  );
};

export default EnhancedGameBoard;