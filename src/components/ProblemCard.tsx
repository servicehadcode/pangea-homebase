
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, CheckCircle } from 'lucide-react';

interface ProblemProps {
  problem: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    tags: string[];
    steps: number;
    isCompleted: boolean;
  };
  category: string;
}

export const ProblemCard: React.FC<ProblemProps> = ({ problem, category }) => {
  const navigate = useNavigate();
  
  const difficultyColor = {
    'Beginner': 'bg-green-100 text-green-800 border-green-200',
    'Intermediate': 'bg-blue-100 text-blue-800 border-blue-200',
    'Advanced': 'bg-purple-100 text-purple-800 border-purple-200',
  }[problem.difficulty] || 'bg-gray-100 text-gray-800 border-gray-200';

  const handleViewProblem = () => {
    navigate(`/problems/${category}/${problem.id}`, {
      state: { problemTitle: problem.title }
    });
  };

  return (
    <Card className={`h-full flex flex-col hover:shadow-md transition-all duration-300 overflow-hidden border border-border animate-fade-in ${problem.isCompleted ? 'border-green-200 bg-green-50/30' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{problem.title}</CardTitle>
          {problem.isCompleted && (
            <div className="flex items-center">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mr-1">
                Completed
              </Badge>
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className={difficultyColor}>
            {problem.difficulty}
          </Badge>
          <Badge variant="outline">
            {problem.steps} Steps
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-muted-foreground text-sm">{problem.description}</p>
        <div className="flex flex-wrap gap-1 mt-4">
          {problem.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          onClick={handleViewProblem} 
          className="w-full flex items-center justify-between pangea-button-primary"
        >
          <span>{problem.isCompleted ? 'Review Solution' : 'Start Problem'}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
