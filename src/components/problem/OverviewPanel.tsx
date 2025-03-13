
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  CheckCircle, 
  GitBranch, 
  GitPullRequest,
  CheckSquare,
  CalendarClock
} from 'lucide-react';

interface OverviewPanelProps {
  problem: any;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
}

const OverviewPanel: React.FC<OverviewPanelProps> = ({ 
  problem, 
  currentStepIndex, 
  onStepChange 
}) => {
  // Calculate progress
  const completedSteps = problem.steps.filter((step: any) => step.isCompleted).length;
  const progressPercentage = (completedSteps / problem.steps.length) * 100;
  
  // Calculate total estimated time
  const totalEstimatedHours = problem.steps.reduce(
    (total: number, step: any) => total + (step.estimatedHours || 0), 
    0
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Project Overview</CardTitle>
        <CardDescription>
          A comprehensive view of the project, requirements, and progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Project Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckSquare className="h-5 w-5 text-pangea" />
                <span className="font-medium">Progress</span>
              </div>
              <Progress value={progressPercentage} className="h-2 mb-2" />
              <div className="text-sm text-right text-muted-foreground">
                {completedSteps}/{problem.steps.length} subtasks
              </div>
            </div>
            
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-pangea" />
                <span className="font-medium">Estimated Time</span>
              </div>
              <div className="text-2xl font-bold">{totalEstimatedHours} hrs</div>
              <div className="text-sm text-muted-foreground">Total for all tasks</div>
            </div>
            
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="h-5 w-5 text-pangea" />
                <span className="font-medium">Timeline</span>
              </div>
              <div className="text-lg font-medium">{problem.estimatedTime}</div>
              <div className="text-sm text-muted-foreground">Recommended timeframe</div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Project Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Problem Description</h3>
          <p className="whitespace-pre-line">{problem.longDescription}</p>
        </div>
        
        <Separator />
        
        {/* Requirements */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="font-medium">Hardware:</p>
              <p className="text-muted-foreground">{problem.requirements.hardware}</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="font-medium">Software:</p>
              <p className="text-muted-foreground">{problem.requirements.software}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Steps Overview */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Subtasks Overview</h3>
          
          <div className="space-y-4">
            {problem.steps.map((step: any, index: number) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  step.isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : currentStepIndex === index
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                    step.isCompleted 
                      ? 'bg-green-500 text-white' 
                      : currentStepIndex === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                  }`}>
                    {step.isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{step.title}</h4>
                      <Badge variant="outline">
                        {step.estimatedHours} hrs
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    
                    {step.assignedTo && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Assigned to: </span>
                        <span className="font-medium">{step.assignedTo}</span>
                      </div>
                    )}
                    
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => onStepChange(index)}
                      className="mt-2 p-0 h-auto text-pangea"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewPanel;
