import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from "@/components/ui/checkbox";
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
  Edit,
  Info,
  AlertCircle,
  Loader2,
  SendHorizonal,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { updateCollaboratorName } from '@/services/collaborationService';
import { 
  updateSessionProgress, 
  recordSubtaskCompletion, 
  getPRFeedback,
  updatePRFeedbackStatus
} from '@/services/databaseService';

interface SubtaskPanelProps {
  step: any;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  onSkip: () => void;
  onBackToSubtasks?: () => void;
  isFirst: boolean;
  isLast: boolean;
  isSoloMode: boolean;
  isDatasetMode?: boolean;
  sessionId?: string;
  username?: string;
  inviterName?: string;
  savedState?: any;
  onStateChange?: (state: any) => void;
}

const SubtaskPanel: React.FC<SubtaskPanelProps> = ({ 
  step,
  onPrev,
  onNext,
  isFirst,
  isLast,
  onComplete,
  onSkip,
  onBackToSubtasks,
  isSoloMode,
  isDatasetMode = false,
  sessionId,
  username = 'User',
  inviterName = 'Pangea Admin',
  savedState,
  onStateChange
}) => {
  const { toast } = useToast();
  const [branchCreated, setBranchCreated] = useState(false);
  const [prCreated, setPrCreated] = useState(false);
  const [deliverables, setDeliverables] = useState('');
  const [showPRFeedback, setShowPRFeedback] = useState(false);
  const [prFeedback, setPRFeedback] = useState<any[]>([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  // Default assignee and reporter based on mode
  const defaultReporter = isSoloMode ? username : inviterName;
  const defaultAssignee = isSoloMode ? username : (step.assignedTo || 'Unassigned');
  
  const [reporter, setReporter] = useState(defaultReporter);
  const [assignee, setAssignee] = useState(defaultAssignee);
  const [isEditingReporter, setIsEditingReporter] = useState(false);
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);
  
  // State for acceptance criteria
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<{id: string; text: string; completed: boolean}[]>([]);
  
  // Update parent component with state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        branchCreated,
        prCreated,
        deliverables,
        prFeedback,
        showPRFeedback,
        reporter,
        assignee,
        acceptanceCriteria
      });
    }
  }, [
    branchCreated, 
    prCreated, 
    deliverables, 
    prFeedback, 
    showPRFeedback, 
    reporter, 
    assignee, 
    acceptanceCriteria,
    onStateChange
  ]);
  
  useEffect(() => {
    // Reset states when step changes, unless we have saved state
    if (savedState) {
      // Restore from saved state
      setBranchCreated(savedState.branchCreated || false);
      setPrCreated(savedState.prCreated || false);
      setDeliverables(savedState.deliverables || '');
      setPRFeedback(savedState.prFeedback || []);
      setShowPRFeedback(savedState.showPRFeedback || false);
      setReporter(savedState.reporter || defaultReporter);
      setAssignee(savedState.assignee || defaultAssignee);
      
      if (savedState.acceptanceCriteria) {
        setAcceptanceCriteria(savedState.acceptanceCriteria);
      } else if (step.acceptanceCriteria) {
        setAcceptanceCriteria(
          step.acceptanceCriteria.map((criteria: string, index: number) => ({
            id: `criteria-${index}`,
            text: criteria,
            completed: false
          }))
        );
      } else {
        setAcceptanceCriteria([]);
      }
    } else {
      // Initialize with default values
      setBranchCreated(false);
      setPrCreated(false);
      setDeliverables('');
      setPRFeedback([]);
      setShowPRFeedback(false);
      setHasAttemptedSubmit(false);
      
      setReporter(defaultReporter);
      setAssignee(defaultAssignee);
      
      setIsEditingReporter(false);
      setIsEditingAssignee(false);
      
      // Initialize acceptance criteria
      if (step.acceptanceCriteria) {
        setAcceptanceCriteria(
          step.acceptanceCriteria.map((criteria: string, index: number) => ({
            id: `criteria-${index}`,
            text: criteria,
            completed: false
          }))
        );
      } else {
        setAcceptanceCriteria([]);
      }
    }
  }, [step, isSoloMode, username, inviterName, savedState, defaultAssignee, defaultReporter]);
  
  const handleCreateBranch = () => {
    setBranchCreated(true);
    toast({
      title: "Branch Created",
      description: `Created branch: ${step.id}-implementation`
    });
  };
  
  const handleCreatePR = async () => {
    if (!branchCreated) {
      toast({
        title: "Branch Required",
        description: "You need to create a branch first.",
        variant: "destructive"
      });
      return;
    }
    
    setPrCreated(true);
    setIsLoadingFeedback(true);
    
    try {
      // Get PR feedback from the service
      const feedback = await getPRFeedback(step.id);
      setPRFeedback(feedback);
      setShowPRFeedback(true);
    } catch (error) {
      console.error('Error getting PR feedback:', error);
      setPRFeedback([]);
    } finally {
      setIsLoadingFeedback(false);
    }
    
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
  
  const handleToggleFeedbackResolution = async (feedbackId: string, resolved: boolean) => {
    try {
      // Update the feedback status in the database
      await updatePRFeedbackStatus(feedbackId, resolved);
      
      // Update the local state
      setPRFeedback(prevFeedback => 
        prevFeedback.map(item => 
          item.id === feedbackId ? { ...item, resolved } : item
        )
      );
    } catch (error) {
      console.error('Error updating feedback status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update feedback status.",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleAcceptanceCriteria = (criteriaId: string, completed: boolean) => {
    setAcceptanceCriteria(prevCriteria =>
      prevCriteria.map(criteria =>
        criteria.id === criteriaId ? { ...criteria, completed } : criteria
      )
    );
  };
  
  const handleComplete = async () => {
    if (!prCreated) {
      toast({
        title: "Pull Request Required",
        description: "You need to create a pull request before completing this subtask.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if all feedback is resolved
    const hasUnresolvedFeedback = prFeedback.some(item => !item.resolved);
    
    if (hasUnresolvedFeedback && !hasAttemptedSubmit) {
      setHasAttemptedSubmit(true);
      toast({
        title: "Unresolved Feedback",
        description: "There is unresolved PR feedback. It's recommended to resolve all feedback before completing this subtask. Click 'Complete & Next' again to proceed anyway.",
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
    
    // Check if all acceptance criteria are completed
    const hasUncompletedCriteria = acceptanceCriteria.some(criteria => !criteria.completed);
    
    if (hasUncompletedCriteria) {
      toast({
        title: "Acceptance Criteria",
        description: "Not all acceptance criteria have been checked. Please review them before completing this subtask.",
        variant: "destructive"
      });
      return;
    }
    
    if (sessionId) {
      const subtaskId = Math.random().toString(36).substring(2, 15);
      
      // Update session progress
      await updateSessionProgress(sessionId, 50);
      
      // Store subtask completion data
      await recordSubtaskCompletion({
        subtaskId,
        sessionId,
        title: step.title,
        assignee,
        reporter,
        prComments: JSON.stringify(prFeedback),
        deliverables,
        completedAt: new Date().toISOString()
      });
      
      console.log('Subtask completed and stored in database:', {
        subtaskId,
        sessionId,
        title: step.title,
        assignee,
        reporter,
        prFeedback,
        deliverables
      });
    }
    
    toast({
      title: isLast ? "Solution Submitted" : "Subtask Completed",
      description: isLast 
        ? "Your solution has been submitted successfully." 
        : `You have completed: ${step.title}`
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
  
  // Render a special view for dataset mode
  if (isDatasetMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dataset Exploration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Explore the dataset for this problem.</p>
          {/* Dataset exploration content would go here */}
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p>The dataset is available for download and exploration.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline"
            onClick={onBackToSubtasks}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Subtasks
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
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
          
          {acceptanceCriteria.length > 0 && (
            <>
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Acceptance Criteria</h4>
                <div className="space-y-2">
                  {acceptanceCriteria.map((criteria) => (
                    <div 
                      key={criteria.id}
                      className="flex items-start gap-2 p-2 border rounded-md"
                    >
                      <Checkbox
                        id={criteria.id}
                        checked={criteria.completed}
                        onCheckedChange={(checked) => 
                          handleToggleAcceptanceCriteria(criteria.id, !!checked)
                        }
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={criteria.id}
                        className={`text-sm flex-1 ${criteria.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {criteria.text}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
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
          
          {showPRFeedback && (
            <div className="space-y-3">
              <h4 className="font-medium">PR Feedback</h4>
              
              {isLoadingFeedback ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Loading feedback...</span>
                </div>
              ) : prFeedback.length > 0 ? (
                <div className="space-y-2">
                  {prFeedback.map((feedback) => (
                    <div 
                      key={feedback.id}
                      className="flex items-start gap-2 p-3 border rounded-md"
                    >
                      <Checkbox
                        id={feedback.id}
                        checked={feedback.resolved}
                        onCheckedChange={(checked) => 
                          handleToggleFeedbackResolution(feedback.id, !!checked)
                        }
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={feedback.id}
                          className={`font-medium ${feedback.resolved ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {feedback.comment}
                        </label>
                        <p className="text-xs text-muted-foreground">From: {feedback.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 border rounded-md text-center text-muted-foreground">
                  No feedback received for this PR.
                </div>
              )}
            </div>
          )}
          
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
                      className="flex items-center gap-1"
                    >
                      Skip
                      <Info className="h-4 w-4 ml-1" />
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
                <SendHorizonal className="h-4 w-4 mr-2" />
                Submit Solution
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
  );
};

export default SubtaskPanel;
