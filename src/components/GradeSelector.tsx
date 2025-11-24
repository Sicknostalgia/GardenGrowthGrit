import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GradeSelectorProps {
  selectedGrade: string;
  onGradeSelect: (grade: string) => void;
}

const grades = [
  { id: 'kindergarten', name: 'Kindergarten', emoji: '🌱', color: 'from-yellow-200 to-orange-200' },
  { id: 'grade1', name: 'Grade 1', emoji: '🌿', color: 'from-green-200 to-lime-200' },
  { id: 'grade2', name: 'Grade 2', emoji: '🌳', color: 'from-emerald-200 to-teal-200' },
  { id: 'grade3', name: 'Grade 3', emoji: '🌲', color: 'from-teal-200 to-cyan-200' },
  { id: 'grade4', name: 'Grade 4', emoji: '🌴', color: 'from-blue-200 to-indigo-200' },
  { id: 'grade5', name: 'Grade 5', emoji: '🎋', color: 'from-purple-200 to-pink-200' },
];

const GradeSelector: React.FC<GradeSelectorProps> = ({ selectedGrade, onGradeSelect }) => {
  return (
    <Card className="mb-6 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-800">
          Choose Your Grade Level
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {grades.map((grade) => (
            <Button
              key={grade.id}
              onClick={() => onGradeSelect(grade.id)}
              className={`h-16 text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                selectedGrade === grade.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : `bg-gradient-to-br ${grade.color} text-gray-800 hover:shadow-md`
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">{grade.emoji}</span>
                <span className="text-sm">{grade.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeSelector;