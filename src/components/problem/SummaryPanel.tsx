
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Award, ArrowLeft, Clock } from 'lucide-react';

interface SummaryPanelProps {
  problem: any;
  completedSubtasks: number;
  totalSubtasks: number;
  onBackToProblems: () => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ 
  problem,
  completedSubtasks,
  totalSubtasks,
  onBackToProblems
}) => {
  const completionPercentage = totalSubtasks > 0 
    ? (completedSubtasks / totalSubtasks) * 100 
    : 0;
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl flex justify-center items-center gap-2">
          <Award className="h-8 w-8 text-yellow-500" />
          Challenge Completed!
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        <div className="rounded-lg bg-secondary/30 p-6 text-center">
          <h2 className="text-xl font-bold mb-4">{problem.title}</h2>
          <p className="text-muted-foreground mb-6">{problem.description}</p>
          
          <div className="flex items-center justify-center mb-2">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Completed</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Progress</h3>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Subtasks completed</span>
              <span className="font-bold">{completedSubtasks} of {totalSubtasks}</span>
            </div>
            <Progress value={completionPercentage} className="h-2 mb-1" />
            
            <div className="text-right text-sm text-muted-foreground">
              {completionPercentage.toFixed(0)}% completion rate
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">
                {problem.estimatedTime.split("-")[0]} hrs
              </div>
              <div className="text-sm text-muted-foreground">
                Time Invested
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">
                {completedSubtasks}
              </div>
              <div className="text-sm text-muted-foreground">
                Tasks Completed
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">
                {problem.difficulty}
              </div>
              <div className="text-sm text-muted-foreground">
                Difficulty Level
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">What's Next?</h3>
          <p className="text-muted-foreground mb-4">
            You've completed this challenge! Ready to take on another one?
            Check out more industry problems to continue building your skills.
          </p>
          
          <Button 
            className="pangea-button-primary"
            onClick={onBackToProblems}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Problems
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryPanel;
