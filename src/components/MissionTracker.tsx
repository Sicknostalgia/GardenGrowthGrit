import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export interface Mission {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  icon: string;
  completed: boolean;
}

interface MissionTrackerProps {
  missions: Mission[];
  level: number;
}

const MissionTracker: React.FC<MissionTrackerProps> = ({ missions, level }) => {
  const completedMissions = missions.filter(m => m.completed).length;
  const totalMissions = missions.length;
  const overallProgress = (completedMissions / totalMissions) * 100;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Level {level} Missions</span>
          <Badge variant={completedMissions === totalMissions ? "default" : "secondary"}>
            {completedMissions}/{totalMissions}
          </Badge>
        </CardTitle>
        <Progress value={overallProgress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {missions.map((mission) => (
          <div key={mission.id} className="flex items-center space-x-3">
            <div className="text-2xl">{mission.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className={`font-medium ${
                  mission.completed ? 'text-green-600' : 'text-gray-700'
                }`}>
                  {mission.name}
                </span>
                <span className="text-sm text-gray-500">
                  {mission.current}/{mission.target}
                </span>
              </div>
              <Progress 
                value={(mission.current / mission.target) * 100} 
                className="h-1"
              />
            </div>
            {mission.completed && (
              <div className="text-green-500 text-xl">✓</div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MissionTracker;