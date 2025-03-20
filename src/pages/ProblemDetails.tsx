import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Loader2
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
import { recordUserSession, updateSessionProgress, completeSession, checkDatasetAvailability } from '@/services/databaseService';

const ProblemDetails = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdditionalResources, setShowAdditionalResources] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [collaborationMode, setCollaborationMode] = useState<'solo' | 'pair'>('solo');
  const [stepsCompleted, setStepsCompleted] = useState<Record<string, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [submissionDetails, setSubmissionDetails] = useState({
    code: '',
    explanation: '',
    githubLink: '',
  });
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [username, setUsername] = useState('Anonymous User');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isDatasetMode, setIsDatasetMode] = useState(false);
  const [lastSubtaskIndex, setLastSubtaskIndex] = useState(0);
  const [inviterName, setInviterName] = useState('Pangea Admin');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = {
        id: parseInt(id || '1', 10),
        title: `Problem ${id} Title`,
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
        solution: {
          description: "The solution involves collecting data, preprocessing it, training a machine learning model, developing an API, and deploying it to a cloud platform.",
          codeSnippet: `
            # Python code snippet for data preprocessing
            import pandas as pd
            
            def preprocess_data(data):
              # Handle missing values
              data = data.fillna(data.mean())
              
              # Scale the data
              from sklearn.preprocessing import StandardScaler
              scaler = StandardScaler()
              data = scaler.fit_transform(data)
              
              return data
          `,
          explanation: "This code snippet demonstrates how to preprocess data using Pandas and Scikit-learn. It handles missing values by filling them with the mean and scales the data using StandardScaler.",
        },
        discussion: [
          {
            id: 1,
            author: "John Doe",
            date: "2023-09-15",
            comment: "I found this problem very challenging. Has anyone tried using a different model?",
            replies: [
              {
                id: 1,
                author: "Jane Smith",
                date: "2023-09-16",
                comment: "Yes, I tried using a Random Forest model and it worked better for me.",
              },
            ],
          },
          {
            id: 2,
            author: "Alice Johnson",
            date: "2023-09-17",
            comment: "Can someone explain the purpose of the API development step?",
            replies: [],
          },
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
    };
    
    fetchData();
    
    const completedProblems = JSON.parse(localStorage.getItem('completedProblems') || '{}');
    setIsCompleted(completedProblems[`${category}-${id}`] || false);
  }, [category, id]);

  useEffect(() => {
    if (problem) {
      localStorage.setItem(`problem-${problem.id}-steps`, JSON.stringify(stepsCompleted));
    }
  }, [stepsCompleted, problem]);

  const handleStepComplete = (stepId: number) => {
    setStepsCompleted(prev => ({ ...prev, [stepId]: true }));
  };

  const handleStepIncomplete = (stepId: number) => {
    setStepsCompleted(prev => {
      const { [stepId]: removed, ...rest } = prev;
      return rest;
    });
  };
  
  const getActualSubtasks = () => {
    if (!problem) return [];
    const systemTasks = ['setup', 'collaboration', 'analysis'];
    return problem.steps.filter(step => !systemTasks.includes(step.id));
  };

  const allStepsCompleted = problem && getActualSubtasks().every(step => stepsCompleted[step.id]);

  const handleCompleteProblem = () => {
    setShowConfirmation(true);
  };

  const confirmCompleteProblem = async () => {
    const completedProblems = JSON.parse(localStorage.getItem('completedProblems') || '{}');
    completedProblems[`${category}-${id}`] = true;
    localStorage.setItem('completedProblems', JSON.stringify(completedProblems));
    setIsCompleted(true);
    setShowConfirmation(false);
    
    if (sessionId) {
      await completeSession(sessionId);
    }
    
    toast({
      title: "Problem Completed!",
      description: "Congratulations on completing this problem.",
    });
  };

  const handleUndoCompleteProblem = () => {
    const completedProblems = JSON.parse(localStorage.getItem('completedProblems') || '{}');
    delete completedProblems[`${category}-${id}`];
    localStorage.setItem('completedProblems', JSON.stringify(completedProblems));
    setIsCompleted(false);
    
    toast({
      title: "Problem Completion Undone",
      description: "You have marked this problem as incomplete.",
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
    setActiveTab('subtasks');
  };

  const renderStep = (step: any) => (
    <AccordionItem value={String(step.id)} key={step.id}>
      <AccordionTrigger className="flex justify-between items-center py-3">
        {step.title}
        <Checkbox
          id={`step-${step.id}`}
          checked={!!stepsCompleted[step.id]}
          onCheckedChange={(checked) => {
            checked ? handleStepComplete(step.id) : handleStepIncomplete(step.id);
          }}
          className="ml-4"
        />
      </AccordionTrigger>
      <AccordionContent className="py-4">
        <p className="mb-4">{step.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowHints(!showHints)}
          >
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAdditionalResources(!showAdditionalResources)}
          >
            {showAdditionalResources ? 'Hide Resources' : 'Show Resources'}
          </Button>
        </div>

        {showHints && step.hints && step.hints.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Hints:</h4>
            <ul className="list-disc pl-5">
              {step.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}

        {showAdditionalResources && step.additionalResources && step.additionalResources.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Additional Resources:</h4>
            <ul>
              {step.additionalResources.map((resource, index) => (
                <li key={index} className="mb-1">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-pangea hover:underline flex items-center gap-1">
                    <ExternalLink className="h-4 w-4" />
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );

  const handleSubmitSolution = async () => {
    setSubmissionLoading(true);
    setSubmissionError('');
    setSubmissionSuccess(false);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (submissionDetails.code.length < 10) {
        throw new Error('Code must be at least 10 characters long.');
      }

      setSubmissionSuccess(true);
      toast({
        title: "Solution Submitted!",
        description: "Your solution has been submitted successfully.",
      });
    } catch (error: any) {
      setSubmissionError(error.message || 'An error occurred during submission.');
      toast({
        title: "Submission Error",
        description: error.message || 'An error occurred during submission.',
        variant: "destructive",
      });
    } finally {
      setSubmissionLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="pangea-container">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/problems')}
          >
            ← Back to Problems
          </Button>

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
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                <TabsTrigger value="dataset">Dataset</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
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

              <TabsContent value="subtasks">
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
                />
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
                />
              </TabsContent>

              <TabsContent value="solution" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Solution</CardTitle>
                    <CardDescription>A detailed solution to the problem.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{problem.solution.description}</p>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                      <code>{problem.solution.codeSnippet}</code>
                    </pre>
                    <p className="mt-4">{problem.solution.explanation}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Discussion</CardTitle>
                    <CardDescription>Discuss the problem and its solutions with other users.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {problem.discussion.map(comment => (
                      <div key={comment.id} className="mb-4">
                        <div className="font-semibold">{comment.author}</div>
                        <div className="text-sm text-muted-foreground">{comment.date}</div>
                        <div>{comment.comment}</div>
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="ml-4 mt-2 border-l-2 border-gray-200 pl-4">
                            <div className="font-semibold">{reply.author}</div>
                            <div className="text-sm text-muted-foreground">{reply.date}</div>
                            <div>{reply.comment}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Resources</CardTitle>
                    <CardDescription>Links to additional resources that may be helpful.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul>
                      {problem.resources.map(resource => (
                        <li key={resource.title} className="mb-2">
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-pangea hover:underline flex items-center gap-1">
                            <ExternalLink className="h-4 w-4" />
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center mt-8">
              {isCompleted ? (
                <Button 
                  variant="destructive"
                  onClick={handleUndoCompleteProblem}
                  className="flex items-center gap-2"
                >
                  Undo Complete
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleCompleteProblem}
                  disabled={!allStepsCompleted}
                  className="pangea-button-primary flex items-center gap-2"
                >
                  Complete Problem
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              
              <Button 
                variant="secondary"
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-2"
              >
                Submit Your Solution
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Problem</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this problem as complete? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setShowConfirmation(false)}>Cancel</Button>
              <Button onClick={confirmCompleteProblem}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Your Solution</DialogTitle>
            <DialogDescription>
              Share your solution with the community.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code Snippet</Label>
              <Textarea
                id="code"
                placeholder="Paste your code snippet here"
                value={submissionDetails.code}
                onChange={(e) => setSubmissionDetails({ ...submissionDetails, code: e.target.value })}
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation</Label>
              <Textarea
                id="explanation"
                placeholder="Explain your solution"
                value={submissionDetails.explanation}
                onChange={(e) => setSubmissionDetails({ ...submissionDetails, explanation: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubLink" className="flex items-center gap-1">
                GitHub Repository <Github className="h-4 w-4 text-muted-foreground" />
              </Label>
              <Input
                id="githubLink"
                placeholder="Link to your GitHub repository (optional)"
                value={submissionDetails.githubLink}
                onChange={(e) => setSubmissionDetails({ ...submissionDetails, githubLink: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitSolution} disabled={submissionLoading} className="pangea-button-primary">
              {submissionLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Submit Solution"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-end space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

export default ProblemDetails;
