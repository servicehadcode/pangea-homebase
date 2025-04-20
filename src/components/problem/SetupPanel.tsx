import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { 
  ClipboardCopy, 
  GitBranch, 
  CheckCircle,
  ExternalLink,
  Download,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SetupPanelProps {
  problem: any;
  onComplete: () => void;
}

const SetupPanel: React.FC<SetupPanelProps> = ({ problem, onComplete }) => {
  const { toast } = useToast();
  const [setupCompleted, setSetupCompleted] = useState(problem.setup?.isCompleted || false);
  const [completedSteps, setCompletedSteps] = useState<{[key: number]: boolean}>({});
  const [showGitWarning, setShowGitWarning] = useState(false);
  
  const preparationSteps = problem.preparationSteps || [
    "Install required development tools",
    "Clone the repository",
    "Install dependencies",
    "Configure the environment"
  ];
  
  const repoUrl = problem.metadata?.gitRepo || "https://github.com/example/repo";
  
  const handleCopyCommand = () => {
    navigator.clipboard.writeText(`git clone ${repoUrl}`);
    toast({
      title: "Command Copied",
      description: "The git clone command has been copied to your clipboard."
    });
  };
  
  const handleToggleStep = (index: number) => {
    setCompletedSteps({
      ...completedSteps,
      [index]: !completedSteps[index]
    });
    
    if (preparationSteps[index]?.toLowerCase().includes('clone') && !completedSteps[index]) {
      setShowGitWarning(true);
    }
  };
  
  const handleCompleteSetup = () => {
    setSetupCompleted(true);
    toast({
      title: "Setup Completed",
      description: "You've completed the initial setup for this problem."
    });
    onComplete();
  };
  
  const allStepsCompleted = preparationSteps.length === 
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
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Repository</h3>
              <div className="flex gap-2 mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Clone Repository
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Clone Repository</DialogTitle>
                      <DialogDescription>
                        Use this command to clone the repository to your local machine
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 mt-4">
                      <div className="grid flex-1 gap-2">
                        <div className="flex items-center p-2 bg-secondary/30 rounded-md font-mono text-sm">
                          git clone {repoUrl}
                        </div>
                      </div>
                      <Button size="sm" onClick={handleCopyCommand}>
                        <ClipboardCopy className="h-4 w-4" />
                      </Button>
                    </div>
                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(repoUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in GitHub
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Git Help
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Git Commands Help</DialogTitle>
                      <DialogDescription>
                        Here are some helpful git commands to get you started
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 my-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Clone to a specific folder</h4>
                        <div className="p-2 bg-secondary/30 rounded-md font-mono text-sm">
                          git clone {repoUrl} your-folder-name
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Create a new branch</h4>
                        <div className="p-2 bg-secondary/30 rounded-md font-mono text-sm">
                          git checkout -b your-branch-name
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Stage your changes</h4>
                        <div className="p-2 bg-secondary/30 rounded-md font-mono text-sm">
                          git add .
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Commit your changes</h4>
                        <div className="p-2 bg-secondary/30 rounded-md font-mono text-sm">
                          git commit -m "Your commit message"
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Push your changes</h4>
                        <div className="p-2 bg-secondary/30 rounded-md font-mono text-sm">
                          git push origin your-branch-name
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {showGitWarning && (
                <Alert variant="default" className="mt-4 bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-700">
                    You might encounter a 400 error during the automatic Git setup later in the process.
                    If this happens, set up your branch manually using the Git commands provided in the Git Help dialog.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Setup Steps</h3>
              
              <div className="space-y-3">
                {preparationSteps.map((step: string, index: number) => (
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
                      
                      {step.toLowerCase().includes('download') && (
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
