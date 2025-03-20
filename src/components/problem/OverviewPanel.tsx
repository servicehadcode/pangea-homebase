
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  CheckSquare
} from 'lucide-react';

interface OverviewPanelProps {
  problem: any;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onComplete: () => void;
}

const OverviewPanel: React.FC<OverviewPanelProps> = ({ 
  problem, 
  currentStepIndex, 
  onStepChange,
  onComplete
}) => {
  // Filter out system tasks (setup, collaboration, problem analysis)
  const systemTasks = ['setup', 'collaboration', 'analysis'];
  const actualSubtasks = problem.steps.filter((step: any) => 
    !systemTasks.includes(step.id)
  );
  
  // Get preparation steps separately 
  const setupStep = problem.steps.find((step: any) => step.id === 'setup');
  const collaborationStep = problem.steps.find((step: any) => step.id === 'collaboration');
  const analysisStep = problem.steps.find((step: any) => step.id === 'analysis');
  
  // Calculate progress based on actual subtasks only
  const completedSteps = actualSubtasks.filter((step: any) => step.isCompleted).length;
  const progressPercentage = actualSubtasks.length > 0 
    ? (completedSteps / actualSubtasks.length) * 100 
    : 0;
  
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
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare className="h-5 w-5 text-pangea" />
              <span className="font-medium">Progress</span>
            </div>
            <Progress value={progressPercentage} className="h-2 mb-2" />
            <div className="text-sm text-right text-muted-foreground">
              {completedSteps}/{actualSubtasks.length} subtasks
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
        
        {/* Preparation Steps Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Preparation Steps</h3>
          
          {/* Setup */}
          {setupStep && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                  setupStep.isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {setupStep.isCompleted ? <CheckCircle className="h-4 w-4" /> : 1}
                </div>
                <div>
                  <h4 className="font-medium">Environment Setup</h4>
                  <p className="text-sm text-muted-foreground">Set up your development environment and get ready to work</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Collaboration */}
          {collaborationStep && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                  collaborationStep.isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {collaborationStep.isCompleted ? <CheckCircle className="h-4 w-4" /> : 2}
                </div>
                <div>
                  <h4 className="font-medium">Team Collaboration</h4>
                  <p className="text-sm text-muted-foreground">Set up collaboration with your team members</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Analysis */}
          {analysisStep && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                  analysisStep.isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {analysisStep.isCompleted ? <CheckCircle className="h-4 w-4" /> : 3}
                </div>
                <div>
                  <h4 className="font-medium">Problem Analysis</h4>
                  <p className="text-sm text-muted-foreground">Analyze and understand the problem requirements</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Subtasks Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Implementation Subtasks</h3>
          <div className="space-y-2">
            {actualSubtasks.map((step: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                    step.isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {step.isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-6">
        <Button 
          className="pangea-button-primary"
          onClick={onComplete}
        >
          I've Reviewed the Overview
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OverviewPanel;
