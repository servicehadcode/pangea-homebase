
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ClipboardCopy, 
  GitBranch, 
  CheckCircle,
  ExternalLink,
  Download
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SetupPanelProps {
  problem: any;
  onComplete: () => void;
}

const SetupPanel: React.FC<SetupPanelProps> = ({ problem, onComplete }) => {
  const { toast } = useToast();
  const [setupCompleted, setSetupCompleted] = useState(problem.setup.isCompleted);
  const [completedSteps, setCompletedSteps] = useState<{[key: number]: boolean}>({});
  
  const handleCopyRepo = () => {
    navigator.clipboard.writeText(problem.repoUrl);
    toast({
      title: "Repository URL Copied",
      description: "The repository URL has been copied to your clipboard."
    });
  };
  
  const handleToggleStep = (index: number) => {
    setCompletedSteps({
      ...completedSteps,
      [index]: !completedSteps[index]
    });
  };
  
  const handleCompleteSetup = () => {
    setSetupCompleted(true);
    toast({
      title: "Setup Completed",
      description: "You've completed the initial setup for this problem."
    });
    onComplete();
  };
  
  const allStepsCompleted = problem.setup.steps.length === 
    Object.values(completedSteps).filter(Boolean).length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Project Setup</CardTitle>
        <CardDescription>
          Set up your development environment to start working on this problem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {setupCompleted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Setup Completed!</h3>
            <p className="text-muted-foreground">
              You've already completed the setup for this project. 
              You can now proceed to the subtasks.
            </p>
            <Button 
              onClick={onComplete} 
              className="mt-6 pangea-button-primary"
            >
              Go to Subtasks
            </Button>
          </div>
        ) : (
          <>
            {/* Repository Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Repository</h3>
              <div className="flex gap-2">
                <Input
                  value={problem.repoUrl}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button onClick={handleCopyRepo}>
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="flex-1">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Clone Repository
                </Button>
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in GitHub
                </Button>
              </div>
            </div>
            
            {/* Setup Steps */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Setup Steps</h3>
              
              <div className="space-y-3">
                {problem.setup.steps.map((step: string, index: number) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-md border"
                  >
                    <Checkbox 
                      id={`step-${index}`}
                      checked={completedSteps[index] || false}
                      onCheckedChange={() => handleToggleStep(index)}
                    />
                    <div className="space-y-1.5">
                      <label 
                        htmlFor={`step-${index}`}
                        className={`font-medium cursor-pointer ${
                          completedSteps[index] ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {step}
                      </label>
                      
                      {step.includes('download') && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download Resource
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Complete Setup Button */}
            <div className="pt-4">
              <Button 
                onClick={handleCompleteSetup} 
                className="w-full pangea-button-primary"
                disabled={!allStepsCompleted}
              >
                Mark Setup as Complete
              </Button>
              
              {!allStepsCompleted && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Complete all setup steps to proceed
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SetupPanel;
