import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Code, 
  Database, 
  ChevronRight, 
  BarChart,
  List,
  Clock,
  ExternalLink,
  Upload,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Github,
  Link as LucideLink,
  Loader2,
  MessageCircle,
  Book,
  ChevronLeft,
  AlertCircle,
  Save,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import OverviewPanel from '@/components/problem/OverviewPanel';
import SubtaskPanel from '@/components/problem/SubtaskPanel';
import CollaborationSetupPanel from '@/components/problem/CollaborationSetupPanel';
import SubtaskAssignmentPanel from '@/components/problem/SubtaskAssignmentPanel';
import AchievementPanel from '@/components/problem/AchievementPanel';
import { 
  recordUserSession, 
  updateSessionProgress, 
  completeSession, 
  checkDatasetAvailability, 
  getDownloadableItems,
  saveUserProgress
} from '@/services/databaseService';
import { getDiscussionComments, addDiscussionComment } from '@/services/discussionService';
import { getResources } from '@/services/resourceService';
import { getAllSubtaskAssignments } from '@/services/collaborationService';

const ProblemDetails = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { toast } = useToast();
  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stepsCompleted, setStepsCompleted] = useState<Record<string, boolean>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [username, setUsername] = useState('Anonymous User');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isDatasetMode, setIsDatasetMode] = useState(false);
  const [lastSubtaskIndex, setLastSubtaskIndex] = useState(0);
  const [inviterName, setInviterName] = useState('Pangea Admin');
  const [collaborationMode, setCollaborationMode] = useState<'solo' | 'pair'>('solo');
  const [showAchievement, setShowAchievement] = useState(false);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tabsEnabled, setTabsEnabled] = useState({
    overview: true,
    collaboration: false,
    taskAssignment: false,
    subtasks: false,
    dataset: false,
    discussion: true,
    resources: true,
  });
  const [subtaskStates, setSubtaskStates] = useState<Record<string, any>>({});
  const [subtaskAssignments, setSubtaskAssignments] = useState<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = {
        id: parseInt(id || '1', 10),
        title: state?.problemTitle || `Problem ${id} Title`,
        description: "This is a detailed description of the problem. It includes background information, context, and specific requirements for solving the problem. The description should be comprehensive enough for someone to understand the problem without any prior knowledge.",
        longDescription: "This is a more detailed description that provides comprehensive information about the problem, including background context, detailed requirements, and expected outcomes.",
        difficulty: "Intermediate",
        tags: ["Machine Learning", "Data Preprocessing", "API Development"],
        requirements: {
          hardware: "Any modern computer with at least 8GB RAM",
          software: "Python 3.8+, Jupyter Notebook, Required libraries"
        },
        steps: [
          {
            id: 'setup',
            title: "Environment Setup",
            description: "Set up your development environment with the necessary tools and libraries.",
            isCompleted: false,
            subproblems: [
              "Install Python 3.8+",
              "Set up a virtual environment",
              "Install required packages"
            ],
            acceptanceCriteria: [
              "All dependencies are installed",
              "Environment is properly configured"
            ]
          },
          {
            id: 'collaboration',
            title: "Team Collaboration",
            description: "Configure collaboration settings for your team.",
            isCompleted: false,
            subproblems: [
              "Set up version control",
              "Configure collaboration tools",
              "Define team roles"
            ],
            acceptanceCriteria: [
              "Team members are added to the project",
              "Collaboration tools are configured"
            ]
          },
          {
            id: 'analysis',
            title: "Problem Analysis",
            description: "Analyze the problem requirements and constraints.",
            isCompleted: false,
            subproblems: [
              "Review problem requirements",
              "Identify constraints",
              "Plan implementation strategy"
            ],
            acceptanceCriteria: [
              "Requirements are understood",
              "Implementation strategy is defined"
            ]
          },
          {
            id: '1',
            title: "Data Collection",
            description: "Collect the necessary data from various sources.",
            isCompleted: false,
            subproblems: [
              "Identify data sources",
              "Implement data collection methods",
              "Validate collected data"
            ],
            acceptanceCriteria: [
              "Data is collected from all sources",
              "Data format is consistent",
              "Data is validated"
            ],
            assignedTo: "Data Engineer"
          },
          {
            id: '2',
            title: "Data Preprocessing",
            description: "Clean and preprocess the collected data.",
            isCompleted: false,
            subproblems: [
              "Handle missing values",
              "Normalize data",
              "Feature engineering"
            ],
            acceptanceCriteria: [
              "No missing values in critical fields",
              "Data is properly normalized",
              "Features are engineered as needed"
            ],
            assignedTo: "Data Scientist"
          },
          {
            id: '3',
            title: "Model Training",
            description: "Train a machine learning model using the preprocessed data.",
            isCompleted: false,
            subproblems: [
              "Select appropriate model",
              "Implement training pipeline",
              "Tune hyperparameters"
            ],
            acceptanceCriteria: [
              "Model is trained successfully",
              "Performance metrics meet expectations",
              "Training process is documented"
            ],
            assignedTo: "ML Engineer"
          }
        ],
        resources: [
          { title: "Machine Learning Basics", url: "https://www.example.com/ml-basics" },
          { title: "API Development with Flask", url: "https://www.example.com/flask-api" },
        ],
        isCompleted: false,
      };
      
      setProblem(data);
      setIsLoading(false);
      
      const newSessionId = await recordUserSession({
        userId: "user123",
        problemId: id || "1",
        category: category || "data-science",
        startTime: new Date().toISOString()
      });
      
      setSessionId(newSessionId);
      
      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
      }
      
      const savedInviter = localStorage.getItem('inviterName');
      if (savedInviter) {
        setInviterName(savedInviter);
      }
      
      const savedSteps = localStorage.getItem(`problem-${data.id}-steps`);
      if (savedSteps) {
        setStepsCompleted(JSON.parse(savedSteps));
      }
      
      const savedState = localStorage.getItem(`problem-${id}-state`);
      if (savedState) {
        const state = JSON.parse(savedState);
        setActiveTab(state.activeTab || 'overview');
        setCurrentStepIndex(state.currentStepIndex || 0);
        setCollaborationMode(state.collaborationMode || 'solo');
        setTabsEnabled(state.tabsEnabled || {
          overview: true,
          collaboration: false,
          taskAssignment: false,
          subtasks: false,
          dataset: false,
          discussion: true,
          resources: true,
        });
        setShowTaskAssignment(state.showTaskAssignment || false);
        
        if (state.subtaskStates) {
          setSubtaskStates(state.subtaskStates);
        }
      }
    };
    
    fetchData();
    
    const completedProblems = JSON.parse(localStorage.getItem('completedProblems') || '{}');
    setIsCompleted(completedProblems[`${category}-${id}`] || false);
  }, [category, id, state]);

  useEffect(() => {
    if (problem) {
      localStorage.setItem(`problem-${problem.id}-steps`, JSON.stringify(stepsCompleted));
    }
  }, [stepsCompleted, problem]);

  const getActualSubtasks = () => {
    if (!problem) return [];
    const systemTasks = ['setup', 'collaboration', 'analysis'];
    return problem.steps.filter(step => !systemTasks.includes(step.id));
  };

  const allStepsCompleted = problem && getActualSubtasks().every(step => stepsCompleted[step.id]);

  const handleCompleteProblem = async () => {
    if (sessionId) {
      await completeSession(sessionId);
    }
    
    const completedProblems = JSON.parse(localStorage.getItem('completedProblems') || '{}');
    completedProblems[`${category}-${id}`] = true;
    localStorage.setItem('completedProblems', JSON.stringify(completedProblems));
    
    setIsCompleted(true);
    setShowAchievement(true);
    
    toast({
      title: "Problem Completed!",
      description: "Congratulations on completing this problem.",
    });
  };
  
  const handleNextStep = () => {
    const actualSubtasks = getActualSubtasks();
    if (currentStepIndex < actualSubtasks.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const handleCompleteStep = () => {
    const actualSubtasks = getActualSubtasks();
    const currentSubtask = actualSubtasks[currentStepIndex];
    
    setStepsCompleted(prev => ({ ...prev, [currentSubtask.id]: true }));
    
    if (currentStepIndex < actualSubtasks.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (allStepsCompleted) {
      handleCompleteProblem();
    }
  };
  
  const handleSkipStep = () => {
    const actualSubtasks = getActualSubtasks();
    if (currentStepIndex < actualSubtasks.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  const handleDatasetTab = async () => {
    setLastSubtaskIndex(currentStepIndex);
    setIsDatasetMode(true);
    setActiveTab('dataset');
  };
  
  const handleBackToSubtasks = () => {
    setIsDatasetMode(false);
    setActiveTab('subtasks');
  };
  
  const handleStartSubtasks = () => {
    setTabsEnabled(prev => ({ ...prev, collaboration: true }));
    setActiveTab('collaboration');
  };
  
  const handleCollaborationComplete = (mode: 'solo' | 'pair') => {
    setCollaborationMode(mode);
    
    if (mode === 'pair') {
      setTabsEnabled(prev => ({ ...prev, taskAssignment: true }));
      setShowTaskAssignment(true);
      setActiveTab('taskAssignment');
    } else {
      setTabsEnabled(prev => ({ ...prev, subtasks: true }));
      setActiveTab('subtasks');
    }
  };
  
  const handleTaskAssignmentComplete = () => {
    setTabsEnabled(prev => ({ ...prev, subtasks: true }));
    setActiveTab('subtasks');
  };
  
  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingComment(true);
    
    try {
      const comment = await addDiscussionComment(
        id || "1",
        "user123",
        username,
        newComment
      );
      
      setDiscussions(prev => [comment, ...prev]);
      setNewComment('');
      
      toast({
        title: "Comment Posted",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const fetchDiscussions = async () => {
    if (!id) return;
    
    setIsLoadingDiscussions(true);
    
    try {
      const comments = await getDiscussionComments(id);
      setDiscussions(comments);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setIsLoadingDiscussions(false);
    }
  };
  
  const fetchResources = async () => {
    if (!id) return;
    
    setIsLoadingResources(true);
    
    try {
      const resourceItems = await getResources(id);
      setResources(resourceItems);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoadingResources(false);
    }
  };
  
  const handleSaveAndExit = async () => {
    setIsSaving(true);
    
    try {
      const currentState = {
        activeTab,
        currentStepIndex,
        collaborationMode,
        tabsEnabled,
        showTaskAssignment,
        stepsCompleted,
        subtaskStates
      };
      
      localStorage.setItem(`problem-${id}-state`, JSON.stringify(currentState));
      
      await saveUserProgress({
        userId: "user123",
        problemId: id || "1",
        category: category || "data-science",
        progress: currentState,
        stepsCompleted,
        subtaskStates,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Progress Saved",
        description: "Your progress has been saved. You can continue from where you left off when you return.",
      });
      
      navigate('/problems');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  useEffect(() => {
    if (activeTab === 'discussion') {
      fetchDiscussions();
    } else if (activeTab === 'resources') {
      fetchResources();
    }
  }, [activeTab, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-28 pb-16">
          <div className="pangea-container">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Loading problem details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-28 pb-16">
          <div className="pangea-container">
            <div className="text-center">
              <HelpCircle className="h-10 w-10 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Problem not found.</p>
              <Button onClick={() => navigate('/problems')} variant="outline" className="mt-4">
                Back to Problems
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredSteps = problem ? getActualSubtasks() : [];
  const currentSubtask = filteredSteps[currentStepIndex];
  const isFirstSubtask = currentStepIndex === 0;
  const isLastSubtask = currentStepIndex === filteredSteps.length - 1;
  
  const completedSubtasksCount = Object.values(stepsCompleted).filter(Boolean).length;
  const totalSubtasksCount = filteredSteps.length;
  const completionPercentage = totalSubtasksCount > 0 
    ? (completedSubtasksCount / totalSubtasksCount) * 100 
    : 0;

  if (showAchievement) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-28 pb-16">
          <div className="pangea-container">
            <div className="max-w-3xl mx-auto">
              <AchievementPanel 
                problemId={id || "1"} 
                userId="user123" 
                category={category || "data-science"}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="pangea-container">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/problems')}
            >
              ← Back to Problems
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleSaveAndExit}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save & Exit
                </>
              )}
            </Button>
          </div>

          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{problem.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge>{problem.difficulty}</Badge>
                {problem.tags.map(tag => (
                  <Badge variant="secondary" key={tag}>{tag}</Badge>
                ))}
              </div>
              <p className="text-lg text-muted-foreground">{problem.description}</p>
            </div>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="overview" disabled={!tabsEnabled.overview}>Overview</TabsTrigger>
                <TabsTrigger value="collaboration" disabled={!tabsEnabled.collaboration}>Collaboration</TabsTrigger>
                {showTaskAssignment && (
                  <TabsTrigger value="taskAssignment" disabled={!tabsEnabled.taskAssignment}>Assign Tasks</TabsTrigger>
                )}
                <TabsTrigger value="subtasks" disabled={!tabsEnabled.subtasks}>Subtasks</TabsTrigger>
                <TabsTrigger value="dataset" disabled={!tabsEnabled.dataset}>Dataset</TabsTrigger>
                <TabsTrigger value="discussion" disabled={!tabsEnabled.discussion}>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>Discussion</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="resources" disabled={!tabsEnabled.resources}>
                  <div className="flex items-center gap-1">
                    <Book className="h-4 w-4" />
                    <span>Resources</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <Separator className="my-4" />

              <TabsContent value="overview">
                <OverviewPanel 
                  problem={problem}
                  currentStepIndex={currentStepIndex}
                  onStepChange={setCurrentStepIndex}
                  onComplete={handleStartSubtasks}
                />
              </TabsContent>
              
              <TabsContent value="collaboration">
                <CollaborationSetupPanel 
                  onComplete={handleCollaborationComplete}
                  onBack={() => setActiveTab('overview')}
                  problem={problem}
                />
              </TabsContent>
              
              {showTaskAssignment && (
                <TabsContent value="taskAssignment">
                  <SubtaskAssignmentPanel 
                    subtasks={filteredSteps}
                    onComplete={handleTaskAssignmentComplete}
                    onBack={() => setActiveTab('collaboration')}
                  />
                </TabsContent>
              )}

              <TabsContent value="subtasks">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completion</span>
                            <span>{Math.round(completionPercentage)}%</span>
                          </div>
                          <Progress value={completionPercentage} className="h-2" />
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <ScrollArea className="h-[250px] pr-4">
                          <div className="space-y-2">
                            {filteredSteps.map((step, index) => (
                              <div 
                                key={step.id} 
                                className={`p-2 rounded-md cursor-pointer ${
                                  currentStepIndex === index ? 'bg-primary/90 text-primary-foreground' : 
                                  stepsCompleted[step.id] ? 'bg-primary/20' : 'bg-secondary/50'
                                }`}
                                onClick={() => setCurrentStepIndex(index)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{step.title}</span>
                                  {stepsCompleted[step.id] && <CheckCircle className="h-4 w-4" />}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="md:col-span-3">
                    <SubtaskPanel 
                      step={currentSubtask}
                      onPrev={handlePrevStep}
                      onNext={handleNextStep}
                      onComplete={handleCompleteStep}
                      onSkip={handleSkipStep}
                      isFirst={isFirstSubtask}
                      isLast={isLastSubtask}
                      isSoloMode={collaborationMode === 'solo'}
                      sessionId={sessionId}
                      username={username}
                      inviterName={inviterName}
                      savedState={subtaskStates[currentSubtask?.id]}
                      subtaskAssignments={subtaskAssignments} // Add this prop
                      onStateChange={(state) => {
                        setSubtaskStates(prev => ({
                          ...prev,
                          [currentSubtask.id]: state
                        }));
                      }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dataset">
                <SubtaskPanel 
                  step={currentSubtask}
                  onPrev={handlePrevStep}
                  onNext={handleNextStep}
                  onComplete={handleCompleteStep}
                  onSkip={handleSkipStep}
                  onBackToSubtasks={handleBackToSubtasks}
                  isFirst={isFirstSubtask}
                  isLast={isLastSubtask}
                  isSoloMode={collaborationMode === 'solo'}
                  isDatasetMode={true}
                  sessionId={sessionId}
                  username={username}
                  inviterName={inviterName}
                  subtaskAssignments={subtaskAssignments} // Add this prop
                />
              </TabsContent>

              <TabsContent value="discussion" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Discussion</CardTitle>
                    <CardDescription>Discuss the problem and its solutions with other users.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 mb-6">
                      <Label htmlFor="new-comment">Add a Comment</Label>
                      <Textarea 
                        id="new-comment"
                        placeholder="Share your thoughts, questions, or insights..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button 
                        onClick={handleSubmitComment}
                        disabled={isSubmittingComment || !newComment.trim()}
                        className="flex items-center gap-1"
                      >
                        {isSubmittingComment ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          'Post Comment'
                        )}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    {isLoadingDiscussions ? (
                      <div className="flex justify-center p-6">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : discussions.length > 0 ? (
                      <div className="space-y-4">
                        {discussions.map(comment => (
                          <div key={comment.id} className="border rounded-lg p-4">
                            <div className="flex justify-between mb-1">
                              <div className="font-semibold">{comment.username}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <div className="mb-3">{comment.content}</div>
                            
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="space-y-3 mt-3 pl-4 border-l-2 border-gray-200">
                                {comment.replies.map(reply => (
                                  <div key={reply.id} className="p-3 bg-secondary/20 rounded-md">
                                    <div className="flex justify-between mb-1">
                                      <div className="font-medium">{reply.username}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {new Date(reply.timestamp).toLocaleString()}
                                      </div>
                                    </div>
                                    <div>{reply.content}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="mt-2"
                            >
                              Reply
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No comments yet. Be the first to start the discussion!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="resources" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resources</CardTitle>
                    <CardDescription>Helpful resources for solving this problem.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingResources ? (
                      <div className="flex justify-center p-6">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : resources.length > 0 ? (
                      <div className="space-y-4">
                        {resources.map(resource => (
                          <div key={resource.id} className="border rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-1">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">{resource.type}</Badge>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(resource.url, '_blank')}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View Resource
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Book className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No resources available for this problem yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProblemDetails;
