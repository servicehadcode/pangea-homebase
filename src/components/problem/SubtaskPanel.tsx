
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  GitBranch, 
  GitPullRequest,
  CheckSquare,
  HelpCircle,
  Edit
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { updateCollaboratorName } from '@/services/collaborationService';
import { updateSessionProgress } from '@/services/databaseService';

interface SubtaskPanelProps {
  step: any;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
  isSoloMode: boolean;
  sessionId?: string;
  username?: string;
}

const SubtaskPanel: React.FC<SubtaskPanelProps> = ({ 
  step,
  onPrev,
  onNext,
  isFirst,
  isLast,
  onComplete,
  onSkip,
  isSoloMode,
  sessionId,
  username = 'User'
}) => {
  const { toast } = useToast();
  const [branchCreated, setBranchCreated] = useState(false);
  const [prCreated, setPrCreated] = useState(false);
  const [prComments, setPrComments] = useState('');
  const [deliverables, setDeliverables] = useState('');
  
  const defaultAssignee = isSoloMode ? username : (step.assignedTo || 'Unassigned');
  const defaultReporter = isSoloMode ? username : (step.reporter || 'Pangea Admin');
  
  const [reporter, setReporter] = useState(defaultReporter);
  const [assignee, setAssignee] = useState(defaultAssignee);
  const [isEditingReporter, setIsEditingReporter] = useState(false);
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);
  
  useEffect(() => {
    setBranchCreated(false);
    setPrCreated(false);
    setPrComments('');
    setDeliverables('');
    
    const newAssignee = isSoloMode ? username : (step.assignedTo || 'Unassigned');
    const newReporter = isSoloMode ? username : (step.reporter || 'Pangea Admin');
    setReporter(newReporter);
    setAssignee(newAssignee);
    
    setIsEditingReporter(false);
    setIsEditingAssignee(false);
  }, [step, isSoloMode, username]);
  
  const handleCreateBranch = () => {
    setBranchCreated(true);
    toast({
      title: "Branch Created",
      description: `Created branch: ${step.id}-implementation`
    });
  };
  
  const handleCreatePR = () => {
    if (!branchCreated) {
      toast({
        title: "Branch Required",
        description: "You need to create a branch first.",
        variant: "destructive"
      });
      return;
    }
    
    setPrCreated(true);
    toast({
      title: "Pull Request Created",
      description: `Created PR: Implement ${step.title}`
    });
  };
  
  const handleUpdateName = async (type: 'reporter' | 'assignee', newName: string) => {
    try {
      const response = await updateCollaboratorName(
        type === 'reporter' ? 'reporter@example.com' : 'assignee@example.com', 
        newName
      );
      
      if (response.success) {
        toast({ title: "Name Updated", description: response.message });
        if (type === 'reporter') {
          setReporter(newName);
          setIsEditingReporter(false);
        } else {
          setAssignee(newName);
          setIsEditingAssignee(false);
        }
      } else {
        toast({ 
          title: "Update Failed", 
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update name. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleComplete = () => {
    if (!prCreated) {
      toast({
        title: "Pull Request Required",
        description: "You need to create a pull request before completing this subtask.",
        variant: "destructive"
      });
      return;
    }
    
    if (!prComments.trim()) {
      toast({
        title: "PR Comments Required",
        description: "Please add comments addressing PR feedback.",
        variant: "destructive"
      });
      return;
    }
    
    if (!deliverables.trim()) {
      toast({
        title: "Deliverables Required",
        description: "Please list the deliverables for this subtask.",
        variant: "destructive"
      });
      return;
    }
    
    if (sessionId) {
      const subtaskId = Math.random().toString(36).substring(2, 15);
      
      updateSessionProgress(sessionId, 50);
      
      console.log('Storing subtask data:', {
        subtaskId,
        sessionId,
        title: step.title,
        assignee,
        reporter,
        prComments,
        deliverables,
        completedAt: new Date().toISOString()
      });
    }
    
    toast({
      title: "Subtask Completed",
      description: `You have completed: ${step.title}`
    });
    
    onComplete();
  };
  
  const handleSkip = () => {
    toast({
      title: "Subtask Skipped",
      description: `You have skipped: ${step.title}`
    });
    
    onSkip();
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subtask Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Details</h4>
              <div className="space-y-2">
                {step.subproblems.map((subproblem: string, index: number) => (
                  <div 
                    key={index}
                    className="p-3 bg-secondary/30 rounded-lg flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                      {index + 1}
                    </div>
                    <p>{subproblem}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {step.acceptanceCriteria && (
              <>
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Acceptance Criteria</h4>
                  <div className="space-y-2">
                    {step.acceptanceCriteria.map((criteria: string, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 p-2 border rounded-md"
                      >
                        <CheckSquare className="h-4 w-4 text-pangea flex-shrink-0" />
                        <p className="text-sm">{criteria}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Implementation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[120px]">
                <span className="text-sm text-muted-foreground">Reporter</span>
                <div className="flex items-center mt-1 group">
                  <User className="h-4 w-4 mr-1 text-pangea" />
                  {isEditingReporter ? (
                    <div className="flex gap-2 items-center w-full">
                      <Input 
                        value={reporter} 
                        onChange={(e) => setReporter(e.target.value)}
                        className="h-7 py-1 text-sm"
                      />
                      <Button 
                        size="sm" 
                        className="h-7 px-2"
                        onClick={() => handleUpdateName('reporter', reporter)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{reporter}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 ml-1"
                        onClick={() => setIsEditingReporter(true)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-[120px]">
                <span className="text-sm text-muted-foreground">Assignee</span>
                <div className="flex items-center mt-1 group">
                  <User className="h-4 w-4 mr-1 text-pangea" />
                  {isEditingAssignee ? (
                    <div className="flex gap-2 items-center w-full">
                      <Input 
                        value={assignee} 
                        onChange={(e) => setAssignee(e.target.value)}
                        className="h-7 py-1 text-sm"
                      />
                      <Button 
                        size="sm" 
                        className="h-7 px-2"
                        onClick={() => handleUpdateName('assignee', assignee)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">
                        {assignee}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 ml-1"
                        onClick={() => setIsEditingAssignee(true)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Development</h4>
                <Badge variant={branchCreated ? "default" : "outline"}>
                  {branchCreated ? "Branch Created" : "Not Started"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleCreateBranch}
                  disabled={branchCreated}
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  {branchCreated ? "Branch Created" : "Start Development (Create Branch)"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleCreatePR}
                  disabled={!branchCreated || prCreated}
                >
                  <GitPullRequest className="h-4 w-4 mr-2" />
                  {prCreated ? "PR Created" : "Submit Work (Create PR)"}
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium">PR Feedback</h4>
              <Textarea
                placeholder="Enter comments addressing PR feedback..."
                value={prComments}
                onChange={(e) => setPrComments(e.target.value)}
                rows={3}
                disabled={!prCreated}
              />
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Deliverables</h4>
              <Textarea
                placeholder="List deliverables for this subtask..."
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-4">
            <Button 
              variant="outline"
              onClick={onPrev}
              disabled={isFirst}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous Subtask
            </Button>
            
            <div className="flex gap-2 items-center">
              {!isSoloMode && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline"
                        onClick={handleSkip}
                        className="flex items-center"
                      >
                        Skip
                        <HelpCircle className="h-4 w-4 ml-1" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skip if this task was not assigned to you</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {isLast ? (
                <Button 
                  className="pangea-button-primary flex items-center"
                  onClick={handleComplete}
                >
                  Complete Task
                </Button>
              ) : (
                <Button 
                  className="pangea-button-primary flex items-center"
                  onClick={handleComplete}
                >
                  Complete & Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SubtaskPanel;
