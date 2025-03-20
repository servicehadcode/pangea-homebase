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

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate fetching problem data from an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = {
        id: parseInt(id || '1', 10),
        title: `Problem ${id} Title`,
        description: "This is a detailed description of the problem. It includes background information, context, and specific requirements for solving the problem. The description should be comprehensive enough for someone to understand the problem without any prior knowledge.",
        difficulty: "Intermediate",
        tags: ["Machine Learning", "Data Preprocessing", "API Development"],
        steps: [
          {
            id: 1,
            title: "Step 1: Data Collection",
            description: "Collect the necessary data from various sources. This may involve web scraping, API calls, or database queries.",
            hints: ["Use Python's requests library for API calls.", "Consider using BeautifulSoup for web scraping."],
            additionalResources: [
              { title: "Requests Library Documentation", url: "https://requests.readthedocs.io" },
              { title: "BeautifulSoup Documentation", url: "https://www.crummy.com/software/BeautifulSoup/bs4/doc/" }
            ],
          },
          {
            id: 2,
            title: "Step 2: Data Preprocessing",
            description: "Clean and preprocess the data to handle missing values, outliers, and inconsistencies.",
            hints: ["Use Pandas for data manipulation.", "Consider using Scikit-learn for data scaling."],
            additionalResources: [
              { title: "Pandas Documentation", url: "https://pandas.pydata.org/docs/" },
              { title: "Scikit-learn Documentation", url: "https://scikit-learn.org/stable/documentation.html" }
            ],
          },
          {
            id: 3,
            title: "Step 3: Model Training",
            description: "Train a machine learning model using the preprocessed data.",
            hints: ["Use Scikit-learn for model training.", "Consider using TensorFlow or PyTorch for deep learning models."],
            additionalResources: [
              { title: "Scikit-learn Documentation", url: "https://scikit-learn.org/stable/documentation.html" },
              { title: "TensorFlow Documentation", url: "https://www.tensorflow.org/api_docs" },
              { title: "PyTorch Documentation", url: "https://pytorch.org/docs/stable/index.html" }
            ],
          },
          {
            id: 4,
            title: "Step 4: API Development",
            description: "Develop an API to expose the trained model for predictions.",
            hints: ["Use Flask or FastAPI for API development.", "Consider using Docker for containerization."],
            additionalResources: [
              { title: "Flask Documentation", url: "https://flask.palletsprojects.com/en/2.0.x/" },
              { title: "FastAPI Documentation", url: "https://fastapi.tiangolo.com/" },
              { title: "Docker Documentation", url: "https://docs.docker.com/" }
            ],
          },
          {
            id: 5,
            title: "Step 5: Deployment",
            description: "Deploy the API to a cloud platform for production use.",
            hints: ["Use AWS, Google Cloud, or Azure for deployment.", "Consider using Kubernetes for orchestration."],
            additionalResources: [
              { title: "AWS Documentation", url: "https://aws.amazon.com/documentation/" },
              { title: "Google Cloud Documentation", url: "https://cloud.google.com/docs" },
              { title: "Azure Documentation", url: "https://docs.microsoft.com/en-us/azure/" },
              { title: "Kubernetes Documentation", url: "https://kubernetes.io/docs/home/" }
            ],
          },
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
      
      // Load completed steps from local storage
      const savedSteps = localStorage.getItem(`problem-${data.id}-steps`);
      if (savedSteps) {
        setStepsCompleted(JSON.parse(savedSteps));
      }
    };
    
    fetchData();
    
    // Load completion status from local storage
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

  const allStepsCompleted = problem?.steps.every(step => stepsCompleted[step.id]);

  const handleCompleteProblem = () => {
    setShowConfirmation(true);
  };

  const confirmCompleteProblem = () => {
    const completedProblems = JSON.parse(localStorage.getItem('completedProblems') || '{}');
    completedProblems[`${category}-${id}`] = true;
    localStorage.setItem('completedProblems', JSON.stringify(completedProblems));
    setIsCompleted(true);
    setShowConfirmation(false);
    
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

    // Simulate submission process
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Simulate successful submission
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
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              <Separator className="my-4" />

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Problem Overview</CardTitle>
                    <CardDescription>Understand the problem and its requirements.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{problem.description}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Concepts</CardTitle>
                    <CardDescription>Learn about the key concepts involved in solving this problem.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5">
                      <li>Machine Learning</li>
                      <li>Data Preprocessing</li>
                      <li>API Development</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="steps" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Steps to Solve</CardTitle>
                    <CardDescription>Follow these steps to solve the problem.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {problem.steps.map(step => renderStep(step))}
                    </Accordion>
                    
                    {allStepsCompleted ? (
                      <div className="mt-4 text-green-500 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        All steps completed!
                      </div>
                    ) : (
                      <div className="mt-4 text-yellow-500 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Complete all steps to unlock the solution.
                      </div>
                    )}
                  </CardContent>
                </Card>
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

      {/* Confirmation Dialog */}
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

      {/* Submit Solution Modal */}
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
