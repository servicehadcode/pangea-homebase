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
  CheckCircle,
  Copy
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { updateCollaboratorName, getInvitedCollaborators, getSubtaskAssignment } from '@/services/collaborationService';
import { 
  updateSessionProgress, 
  recordSubtaskCompletion, 
  getPRFeedback,
  updatePRFeedbackStatus,
  getNextSubtaskData
} from '@/services/databaseService';
import { setupGitBranch, getProblemById, getProblemInstance } from "@/services/problemService";
import { cn } from "@/lib/utils";

interface SubtaskPanelProps {
  step: any;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onBackToSubtasks?: () => void;
  isSoloMode: boolean;
  isDatasetMode?: boolean;
  sessionId?: string;
  username?: string;
  inviterName?: string;
  savedState?: any;
  onStateChange?: (state: any) => void;
  subtaskAssignments?: Record<string, any>;
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
  onStateChange,
  subtaskAssignments = {}
}) => {
  const { toast } = useToast();
  const [branchCreated, setBranchCreated] = useState(false);
  const [prCreated, setPrCreated] = useState(false);
  const [deliverables, setDeliverables] = useState('');
  const [showPRFeedback, setShowPRFeedback] = useState(false);
  const [prFeedback, setPRFeedback] = useState<any[]>([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isCompletingSubtask, setIsCompletingSubtask] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(true);
  const [showGitDialog, setShowGitDialog] = useState(false);
  const [gitCommand, setGitCommand] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [problemData, setProblemData] = useState<any>(null);
  const [isLoadingProblemData, setIsLoadingProblemData] = useState(false);

  const defaultReporter = isSoloMode ? username : inviterName;
  const defaultAssignee = isSoloMode ? username : (step.assignedTo || 'Unassigned');
  
  const [reporter, setReporter] = useState(defaultReporter);
  const [assignee, setAssignee] = useState(defaultAssignee);
  const [isEditingReporter, setIsEditingReporter] = useState(false);
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);
  
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<{id: string; text: string; completed: boolean}[]>([]);
  const [isStateInitialized, setIsStateInitialized] = useState(false);
  
  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const urlParts = window.location.pathname.split('/');
        const problemNum = urlParts[urlParts.length - 1];
        
        if (problemNum) {
          setIsLoadingProblemData(true);
          const data = await getProblemById(problemNum);
          setProblemData(data);
          setIsLoadingProblemData(false);
        }
      } catch (error) {
        console.error('Error fetching problem data:', error);
        setIsLoadingProblemData(false);
      }
    };
    
    fetchProblemData();
  }, []);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        setIsLoadingCollaborators(true);
        const fetchedCollaborators = await getInvitedCollaborators();
        setCollaborators(fetchedCollaborators);
        
        if (step && step.id && !isSoloMode) {
          const assignment = subtaskAssignments[step.id];
          if (assignment) {
            setAssignee(assignment.userName);
          } else {
            const assignmentData = await getSubtaskAssignment(step.id);
            if (assignmentData) {
              setAssignee(assignmentData.userName);
            } else {
              const assignedCollaborator = fetchedCollaborators.find(
                (collab: any) => collab.email === step.assignedTo || collab.id === step.assignedTo
              );
              
              if (assignedCollaborator) {
                setAssignee(assignedCollaborator.name);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching collaborators:', error);
      } finally {
        setIsLoadingCollaborators(false);
      }
    };
    
    fetchCollaborators();
  }, [step, isSoloMode, subtaskAssignments]);
  
  useEffect(() => {
    if (!isStateInitialized) {
      if (savedState) {
        setBranchCreated(savedState.branchCreated || false);
        setPrCreated(savedState.prCreated || false);
        setDeliverables(savedState.deliverables || '');
        setPRFeedback(savedState.prFeedback || []);
        setShowPRFeedback(savedState.showPRFeedback || false);
        setReporter(savedState.reporter || defaultReporter);
        setAssignee(savedState.assignee || defaultAssignee);
        
        if (savedState.acceptanceCriteria && savedState.acceptanceCriteria.length > 0) {
          setAcceptanceCriteria(savedState.acceptanceCriteria);
        } else if (step && step.acceptanceCriteria && step.acceptanceCriteria.length > 0) {
          setAcceptanceCriteria(
            step.acceptanceCriteria.map((criteria: string, index: number) => ({
              id: `criteria-${step.id}-${index}`,
              text: criteria,
              completed: false
            }))
          );
        } else {
          setAcceptanceCriteria([]);
        }
      } else {
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
        
        setAcceptanceCriteria([]);
      }
      
      setIsStateInitialized(true);
    }
  }, [savedState, step, defaultReporter, defaultAssignee, isStateInitialized]);
  
  useEffect(() => {
    if (isStateInitialized && onStateChange) {
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
    isStateInitialized,
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
    if (step && step.acceptanceCriteria && isStateInitialized) {
      const hasNoSavedCriteria = !acceptanceCriteria.length || 
        (savedState && (!savedState.acceptanceCriteria || !savedState.acceptanceCriteria.length));
      
      const isCriteriaFromDifferentStep = acceptanceCriteria.length > 0 && 
        acceptanceCriteria[0].id && 
        !acceptanceCriteria[0].id.includes(`criteria-${step.id}`);
      
      if (hasNoSavedCriteria || isCriteriaFromDifferentStep) {
        setAcceptanceCriteria(
          step.acceptanceCriteria.map((criteria: string, index: number) => ({
            id: `criteria-${step.id}-${index}`,
            text: criteria,
            completed: false
          }))
        );
      }
    }
  }, [step, isStateInitialized, savedState, acceptanceCriteria]);
  
  const handleCreateBranch = async () => {
    if (branchCreated) return;
    setIsCreatingBranch(true);
    try {
      let repoUrl = "";
      
      if (step?.repoUrl || step?.repo_url || step?.repository || step?.metadata?.gitRepo) {
        repoUrl = step.repoUrl || step.repo_url || step.repository || step.metadata?.gitRepo;
      } 
      else if (problemData?.metadata?.gitRepo) {
        repoUrl = problemData.metadata.gitRepo;
      } 
      else if (step?.metadata?.gitRepo) {
        repoUrl = step.metadata.gitRepo;
      }
      
      if (!repoUrl) {
        throw new Error("Repository URL is missing. Make sure the problem has a valid Git repository URL.");
      }
      
      const urlParts = window.location.pathname.split('/');
      const problemNum = urlParts[urlParts.length - 1];
      const userId = localStorage.getItem('userId');
      
      let gitUsername = "";
      
      try {
        if (userId && problemNum) {
          const instance = await getProblemInstance(problemNum, userId);
          if (instance && (instance.owner.gitUsername || instance.gitUsername)) {
            gitUsername = instance.owner.gitUsername || instance.gitUsername;
            console.log("Found GitHub username from instance:", gitUsername);
          }
        }
      } catch (error) {
        console.error("Error fetching problem instance:", error);
      }
      
      if (!gitUsername) {
        gitUsername = "user";
        console.warn("No GitHub username found, using default:", gitUsername);
      }
      
      const sanitizedUsername = gitUsername.replace(/[^a-zA-Z0-9_-]/g, '');
      const branchOff = "main";
      const branchTo = `${sanitizedUsername}-feature`;

      console.log('Setting up git branch with:', {
        repoUrl,
        username: sanitizedUsername,
        branchOff,
        branchTo,
      });

      const result = await setupGitBranch({
        repoUrl,
        username: sanitizedUsername,
        branchOff,
        branchTo,
      });

      const commands = Array.isArray(result.gitCommands)
        ? result.gitCommands
        : [result.gitCommands || result.message];
      setGitCommand(commands && commands.length > 0 ? commands[0] : "");
      setShowGitDialog(true);
    } catch (err: any) {
      toast({
        title: "Branch Creation Failed",
        description: err?.message || "Could not create branch.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingBranch(false);
    }
  };

  const handleCopyGitCommand = async () => {
    if (!gitCommand) return;
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(gitCommand);
      toast({
        title: "Copied!",
        description: "The git command has been copied to your clipboard.",
      });
      setShowGitDialog(false);
      setBranchCreated(true);
      toast({
        title: "Branch Created",
        description: `Created branch: ${gitCommand.split(' ').slice(-1)}`,
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy the git command.",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
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
      await updatePRFeedbackStatus(feedbackId, resolved);
      
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
  
  const refreshSubtaskData = async () => {
    try {
      if (!step || !step.id) return;
      
      const nextSubtaskData = await getNextSubtaskData(step.id);
      
      setBranchCreated(false);
      setPrCreated(false);
      setDeliverables('');
      setPRFeedback([]);
      setShowPRFeedback(false);
      setHasAttemptedSubmit(false);
      
      if (nextSubtaskData.acceptanceCriteria && nextSubtaskData.acceptanceCriteria.length > 0) {
        setAcceptanceCriteria(
          nextSubtaskData.acceptanceCriteria.map((criteria: string, index: number) => ({
            id: `criteria-${step.id}-${index}`,
            text: criteria,
            completed: false
          }))
        );
      } else if (step.acceptanceCriteria && step.acceptanceCriteria.length > 0) {
        setAcceptanceCriteria(
          step.acceptanceCriteria.map((criteria: string, index: number) => ({
            id: `criteria-${step.id}-${index}`,
            text: criteria,
            completed: false
          }))
        );
      } else {
        setAcceptanceCriteria([]);
      }
    } catch (error) {
      console.error('Error refreshing subtask data:', error);
    }
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
        title: "Comments Required",
        description: "Please add comments for this subtask.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCompletingSubtask(true);
    
    try {
      if (sessionId) {
        const subtaskId = Math.random().toString(36).substring(2, 15);
        
        await updateSessionProgress(sessionId, 50);
        
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
      
      if (!isLast) {
        await refreshSubtaskData();
      }
      
      onComplete();
    } catch (error) {
      console.error('Error completing subtask:', error);
      toast({
        title: "Error",
        description: "Failed to complete subtask. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompletingSubtask(false);
    }
  };
  
  const handleSkip = () => {
    toast({
      title: "Subtask Skipped",
      description: `You have skipped: ${step.title}`
    });
    
    onSkip();
  };
  
  if (isDatasetMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dataset Exploration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Explore the dataset for this problem.</p>
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
  
  if (!isStateInitialized) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading subtask...</p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6 relative" style={{ pointerEvents: showGitDialog ? "none" : "auto", opacity: showGitDialog ? "0.6" : "1" }}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Subtask Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-medium mb-2">Details</h4>
            {step.details && step.details.length > 0 ? (
              <div className="grid gap-3">
                {step.details.map((detail: string, index: number) => (
                  <div 
                    key={index}
                    className="p-3 bg-secondary/30 rounded-lg flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                      {index + 1}
                    </div>
                    <p>{detail}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-3">
                {step.subproblems && step.subproblems.map((subproblem: string, index: number) => (
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
            )}
          </div>
          
          {acceptanceCriteria.length > 0 ? (
            <>
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium mb-2">Acceptance Criteria</h4>
                <div className="grid gap-2">
                  {acceptanceCriteria.map((criteria) => (
                    <div 
                      key={criteria.id}
                      className="flex items-start gap-2 p-2 border rounded-md"
                    >
                      <Checkbox
                        id={criteria.id}
                        checked={criteria.completed}
                        onCheckedChange={(checked) => 
                          handleToggleAcceptanceCriteria(criteria.id, checked === true)
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
          ) : null}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
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
                      {isLoadingCollaborators ? 'Loading...' : assignee}
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
            
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleCreateBranch}
                disabled={branchCreated || isCreatingBranch || showGitDialog}
              >
                {isCreatingBranch ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating branch...
                  </>
                ) : (
                  <>
                    <GitBranch className="h-4 w-4 mr-2" />
                    {branchCreated ? "Branch Created" : "Start Development (Create Branch)"}
                  </>
                )}
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
                <div className="grid gap-2">
                  {prFeedback.map((feedback) => (
                    <div 
                      key={feedback.id}
                      className="flex items-start gap-2 p-3 border rounded-md"
                    >
                      <Checkbox
                        id={feedback.id}
                        checked={feedback.resolved}
                        onCheckedChange={(checked) => 
                          handleToggleFeedbackResolution(feedback.id, checked === true)
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
            <h4 className="font-medium">Comments</h4>
            <Textarea
              placeholder="Add your comments for this subtask..."
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
                disabled={isCompletingSubtask}
              >
                {isCompletingSubtask ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="h-4 w-4 mr-2" />
                    Submit Solution
                  </>
                )}
              </Button>
            ) : (
              <Button 
                className="pangea-button-primary flex items-center"
                onClick={handleComplete}
                disabled={isCompletingSubtask}
              >
                {isCompletingSubtask ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    Complete & Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {showGitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-8 flex flex-col items-center gap-6 relative min-w-[300px]">
            <p className="text-base font-medium mb-2">Copy the command below in your terminal:</p>
            <div className="flex items-center bg-muted rounded px-4 py-2">
              <code className="text-sm font-mono select-text">{gitCommand}</code>
              <Button
                onClick={handleCopyGitCommand}
                size="icon"
                className="ml-2"
                disabled={isCopying}
                variant="outline"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {isCopying && (
              <span className="text-xs text-muted-foreground italic">Copying...</span>
            )}
            <p className="text-sm text-muted-foreground mt-3">The flow will continue once you copy this command.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtaskPanel;
