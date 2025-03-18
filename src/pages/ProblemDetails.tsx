import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  CheckCircle, 
  Database,
  List,
  HelpCircle,
  FileText,
  ChevronLeft,
  Users,
  Clock,
  Folder,
  Lock,
  User
} from 'lucide-react';

import CollaborationPanel from '@/components/problem/CollaborationPanel';
import OverviewPanel from '@/components/problem/OverviewPanel';
import SetupPanel from '@/components/problem/SetupPanel';
import SubtaskPanel from '@/components/problem/SubtaskPanel';
import DataPanel from '@/components/problem/DataPanel';
import HintPanel from '@/components/problem/HintPanel';
import SummaryPanel from '@/components/problem/SummaryPanel';
import { useToast } from '@/components/ui/use-toast';
import { recordUserSession, checkDatasetAvailability, updateSessionProgress } from '@/services/databaseService';

const problemsData = {
  'data-science': [
    {
      id: 1,
      title: "Student Connection Channel Prediction",
      description: "Develop an AI model that takes in parameters about student connection and returns the most preferred channel to reach out to them.",
      longDescription: `There is a dataset attached for this project which has 10 attributes. Out
of these 10 attributes, the 'channel' attribute is the target that an AI
model has to predict. The dataset provided is not clean and balanced,
hence the following steps needs to be covered as a part of this project:
pre-process dataset, design a training methodology suitable for the
dataset, train a model, test the model, run it on validation dataset to
provide ACC and RMSE of the model. At the end of this whole process,
the user should be able to call the model using an API end point.`,
      difficulty: "Intermediate",
      estimatedTime: "20-25 hours",
      repoUrl: "https://github.com/pangeacorp/student-connection-model",
      tags: ["Machine Learning", "Data Preprocessing", "API Development"],
      collaborators: [],
      dataset: {
        isAvailable: true,
        metadata: {
          name: "Student Connection Dataset",
          description: "Dataset containing student preferences for communication channels",
          rows: 1000,
          columns: 10,
          fileType: "CSV",
          lastUpdated: "2023-05-15",
          size: "2.4 MB"
        },
        files: [
          {
            name: "student_connection_data.csv",
            format: "csv",
            size: "2.4 MB",
            url: "/datasets/student_connection_data.csv"
          },
          {
            name: "data_description.json",
            format: "json",
            size: "14 KB",
            url: "/datasets/data_description.json"
          }
        ],
        sampleData: [
          {
            "student_id": "ST001",
            "age": 19,
            "major": "Computer Science",
            "year": 2,
            "location": "On-campus",
            "device_preference": "Mobile",
            "time_zone": "EST",
            "response_time": 3.5,
            "communication_frequency": "High",
            "channel": "Slack"
          },
          {
            "student_id": "ST002",
            "age": 21,
            "major": "Biology",
            "year": 3,
            "location": "Off-campus",
            "device_preference": "Laptop",
            "time_zone": "PST",
            "response_time": 6.2,
            "communication_frequency": "Medium",
            "channel": "Email"
          },
          {
            "student_id": "ST003",
            "age": 20,
            "major": "Psychology",
            "year": 2,
            "location": "On-campus",
            "device_preference": "Mobile",
            "time_zone": "CST",
            "response_time": 1.8,
            "communication_frequency": "High",
            "channel": "WhatsApp"
          }
        ]
      },
      setup: {
        isCompleted: false,
        steps: [
          "Clone the github repo in local using this command: git clone https://github.com/pangeacorp/student-connection-model",
          "Download csv dataset and add it in the repo",
          "Run pip install –r requirements.txt in terminal",
          "Install docker from docker.com",
          "Install postman from postman.com",
          "Setup docker container",
          "Do a test end-to-end run"
        ]
      },
      steps: [
        {
          id: "setup",
          title: "Setup",
          description: "Set up your environment and get the necessary resources.",
          subproblems: [
            "Clone the github repo in local using this command: \"--\"",
            "Download csv dataset and add it in the repo",
            "Run pip install –r requirements.txt in terminal",
            "Install docker (hyperlink)",
            "Install postman (hyperlink)",
            "Setup docker container",
            "Do a test end-to-end run"
          ],
          isCompleted: false,
          assignedTo: "",
          estimatedHours: 2,
          reporter: "Pangea Admin"
        },
        {
          id: "collaboration",
          title: "Collaboration",
          description: "Set up collaboration and tracking tools.",
          subproblems: [
            "Add users to collaborate: 1 user adds other users in UI and they get automatic access to the github repo",
            "View progress"
          ],
          isCompleted: false,
          assignedTo: "",
          estimatedHours: 1,
          reporter: "Pangea Admin"
        },
        {
          id: "analysis",
          title: "Problem Analysis",
          description: "Break down the problem into manageable sub-problems.",
          subproblems: [
            "Analyze the given dataset to identify the key attributes that are needed during training the model to predict the required target attribute.",
            "Balance the dataset and derive train, test and validation datasets.",
            "Train a BERT model that predicts the target",
            "Use K Fold Technique to validate the model techniques",
            "Expose the model through an API",
            "Make a UI that takes input of required input features of the model and shows the prediction to the user on the UI."
          ],
          isCompleted: false,
          assignedTo: "",
          estimatedHours: 10,
          reporter: "Pangea Admin"
        },
        {
          id: "dataset",
          title: "Dataset Analysis",
          description: "Analyze the given dataset to identify key attributes needed for training.",
          subproblems: [
            "Download the dataset.",
            "Create a new folder in repo called dataset and attach this csv there.",
            "Write a python code that reads this csv and performs corr()",
            "Write a python code that does PCA on dataset",
            "Return python list of attributes"
          ],
          acceptanceCriteria: [
            "Dataset has been properly analyzed using correlation function",
            "PCA has been performed to identify key attributes",
            "A list of attributes needed for model training has been identified",
            "Documentation of dataset analysis has been provided"
          ],
          isCompleted: false,
          assignedTo: "",
          estimatedHours: 5,
          reporter: "Pangea Admin"
        },
        {
          id: "implementation",
          title: "Implementation & Delivery",
          description: "Implement the solution and deliver the final product.",
          subproblems: [
            "Build the model architecture",
            "Train the model with identified attributes",
            "Create API endpoints to access the model",
            "Build a simple web interface for testing",
            "Document the process and results"
          ],
          acceptanceCriteria: [
            "Working model with at least 85% accuracy",
            "API endpoints properly documented and tested",
            "Web interface for easy testing of the model",
            "Comprehensive documentation of implementation details"
          ],
          isCompleted: false,
          assignedTo: "",
          estimatedHours: 8,
          reporter: "Pangea Admin"
        }
      ],
      requirements: {
        hardware: "Minimum PC requirements – 8 GB RAM, 1 TB Hard-drive, etc",
        software: "Software requirements – Docker, Postman, etc"
      }
    },
  ],
  'software-dev': [
    {
      id: 1,
      title: "E-commerce Product Recommendation System",
      description: "Design and implement a microservice-based product recommendation engine for an e-commerce platform.",
      longDescription: `Create a microservice based recommendation engine that analyzes user behavior, purchase history, and product similarities to provide personalized product recommendations. The system should use a combination of collaborative filtering, content-based filtering, and real-time analytics to suggest products that users are likely to be interested in. The recommendations should be exposed through a RESTful API that can be consumed by front-end applications.`,
      difficulty: "Advanced",
      estimatedTime: "25-30 hours",
      repoUrl: "https://github.com/pangeacorp/ecommerce-recommendation",
      tags: ["Microservices", "Docker", "API Design"],
      collaborators: [],
      dataset: {
        isAvailable: false
      },
      setup: {
        isCompleted: false,
        steps: [
          "Clone the github repo using: git clone https://github.com/pangeacorp/ecommerce-recommendation",
          "Install Docker and Docker Compose",
          "Run docker-compose up to start the development environment",
          "Test the API using Postman or curl"
        ]
      },
      steps: [
        {
          id: "setup",
          title: "Setup & Environment",
          description: "Set up the development environment and infrastructure.",
          subproblems: [
            "Clone the repository",
            "Set up Docker containers",
            "Configure database connections",
            "Test basic infrastructure"
          ],
          isCompleted: false,
          assignedTo: "",
          estimatedHours: 3,
          reporter: "Pangea Admin"
        },
        {
          id: "datamodel",
          title: "Data Modeling",
          description: "Design the data model for products, users, and interactions.",
          subproblems: [
            "Design schema for product catalog",
            "Design schema for user profiles",
            "Design schema for user-product interactions",
            "Implement database migrations"
          ],
          acceptanceCriteria: [
            "Complete entity-relationship diagram",
            "Implemented database schemas with proper indexing",
            "Migration scripts for setting up test data",
            "Documentation of data model design decisions"
          ],
          isCompleted: false,
          assignedTo: "",
          estimatedHours: 5,
          reporter: "Pangea Admin"
        },
      ],
      requirements: {
        hardware: "Minimum 16GB RAM, quad-core processor, SSD with 100GB free space",
        software: "Docker, Docker Compose, Node.js v14+, PostgreSQL, Redis"
      }
    },
  ]
};

const ProblemDetails = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [previousTab, setPreviousTab] = useState('subtask');
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [soloMode, setSoloMode] = useState(false);
  const [hasDataset, setHasDataset] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string>('User');
  const [showSummary, setShowSummary] = useState(false);
  const [completedSubtasksCount, setCompletedSubtasksCount] = useState(0);
  
  const [tabsCompleted, setTabsCompleted] = useState({
    overview: false,
    collaboration: false,
    setup: false,
    subtask: false
  });
  
  const tabOrder = ['overview', 'collaboration', 'setup', 'subtask'];
  
  const problem = problemsData[category as keyof typeof problemsData]?.find(
    p => p.id === parseInt(id || '0')
  );
  
  const getActualSubtasks = () => {
    if (!problem) return [];
    const systemTasks = ['setup', 'collaboration', 'analysis'];
    return problem.steps.filter((step: any) => !systemTasks.includes(step.id));
  };
  
  const actualSubtasks = getActualSubtasks();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!problem) {
      navigate('/problems');
    } else {
      const initSession = async () => {
        const newSessionId = await recordUserSession({
          problemId: id || '',
          category: category || '',
          startTime: new Date().toISOString(),
          userId: 'anonymous' // Replace with actual user ID when authentication is implemented
        });
        
        setSessionId(newSessionId);
      };
      
      initSession();
      
      const checkDataset = async () => {
        const isAvailable = await checkDatasetAvailability(id || '');
        setHasDataset(isAvailable);
      };
      
      checkDataset();
    }
  }, [problem, navigate, category, id]);
  
  if (!problem) {
    return null;
  }
  
  const handleStepChange = (index: number) => {
    if (tabsCompleted.setup) {
      setCurrentStepIndex(index);
      setActiveTab('subtask');
    }
  };
  
  const handleNextStep = () => {
    const maxIndex = actualSubtasks.length - 1;
    if (currentStepIndex < maxIndex) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const isTabAccessible = (tabName: string) => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const targetIndex = tabOrder.indexOf(tabName);
    
    if (tabName === 'data') return hasDataset;
    
    if (targetIndex < currentIndex) return true;
    
    if (targetIndex === currentIndex) return true;
    
    if (targetIndex === currentIndex + 1) {
      const previousTab = tabOrder[currentIndex];
      return tabsCompleted[previousTab as keyof typeof tabsCompleted];
    }
    
    for (let i = 0; i < targetIndex; i++) {
      const prevTab = tabOrder[i];
      if (!tabsCompleted[prevTab as keyof typeof tabsCompleted]) {
        return false;
      }
    }
    
    return true;
  };
  
  const handleTabChange = (value: string) => {
    if (value === 'data') {
      setPreviousTab(activeTab);
      setActiveTab('data');
      return;
    }
    
    if (isTabAccessible(value)) {
      setActiveTab(value);
    } else {
      let lastIncompleteTab = 'overview';
      for (const tab of tabOrder) {
        if (!tabsCompleted[tab as keyof typeof tabsCompleted]) {
          lastIncompleteTab = tab;
          break;
        }
      }
      
      toast({
        title: "Tab locked",
        description: `You need to complete the ${lastIncompleteTab} section first.`,
        variant: "destructive"
      });
    }
  };
  
  const completeTab = (tabName: string) => {
    setTabsCompleted(prev => ({
      ...prev,
      [tabName]: true
    }));
    
    if (sessionId) {
      const progressMap: {[key: string]: number} = {
        overview: 25,
        collaboration: 50,
        setup: 75,
        subtask: 100
      };
      
      updateSessionProgress(sessionId, progressMap[tabName] || 0);
    }
    
    const currentIndex = tabOrder.indexOf(tabName);
    if (currentIndex < tabOrder.length - 1) {
      const nextTab = tabOrder[currentIndex + 1];
      setActiveTab(nextTab);
    }
    
    toast({
      title: "Section Completed",
      description: `You've completed the ${tabName} section!`
    });
  };

  const handleSoloModeSelect = (name: string) => {
    setSoloMode(true);
    setUsername(name || 'User');
    completeTab('collaboration');
  };
  
  const handleReturnFromDataTab = () => {
    setActiveTab(previousTab);
  };
  
  const handleCompleteSubtask = (skipMode = false) => {
    if (!skipMode) {
      setCompletedSubtasksCount(prev => prev + 1);
    }
    
    const isLastSubtask = currentStepIndex === actualSubtasks.length - 1;
    
    if (isLastSubtask) {
      setShowSummary(true);
    } else {
      handleNextStep();
    }
  };
  
  const handleBackToProblems = () => {
    if (problem) {
      problem.isCompleted = true;
    }
    
    navigate('/problems');
  };
  
  const currentActualSubtask = actualSubtasks[currentStepIndex];
  
  if (showSummary) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-28 pb-16">
          <div className="pangea-container max-w-4xl mx-auto">
            <SummaryPanel 
              problem={problem}
              completedSubtasks={completedSubtasksCount}
              totalSubtasks={actualSubtasks.length}
              onBackToProblems={handleBackToProblems}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16 relative">
        <div className="pangea-container">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate('/problems')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Problems
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{problem.title}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className={
                    problem.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 border-green-200' :
                    problem.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-purple-100 text-purple-800 border-purple-200'
                  }>
                    {problem.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                    <Clock className="h-4 w-4 mr-1" />
                    {problem.estimatedTime}
                  </Badge>
                  {soloMode ? (
                    <Badge variant="secondary">
                      <User className="h-4 w-4 mr-1" />
                      Solo Mode
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Users className="h-4 w-4 mr-1" />
                      Team Mode
                    </Badge>
                  )}
                  {problem.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  Track Progress
                </Button>
                <Button className="pangea-button-primary">
                  Start Challenge
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTab === 'subtask' && tabsCompleted.setup ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <h3 className="font-medium mb-2">Subtask Progress</h3>
                        <Progress 
                          value={(completedSubtasksCount / actualSubtasks.length) * 100} 
                          className="h-2 mb-2" 
                        />
                        <div className="text-sm text-right text-muted-foreground">
                          {completedSubtasksCount}/{actualSubtasks.length} subtasks
                        </div>
                      </div>
                      
                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <h3 className="font-medium mb-2">Current Subtask</h3>
                        <div className="text-sm font-medium">
                          {currentActualSubtask?.title || 'No subtask selected'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <h3 className="font-medium mb-2">Setup Progress</h3>
                        <Progress 
                          value={
                            (tabsCompleted.overview ? 33 : 0) + 
                            (tabsCompleted.collaboration ? 33 : 0) + 
                            (tabsCompleted.setup ? 34 : 0)
                          } 
                          className="h-2 mb-2" 
                        />
                        <div className="text-sm text-muted-foreground">
                          Complete all setup steps to start working on subtasks
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-4" />
                  
                  {hasDataset && (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setPreviousTab(activeTab);
                          setActiveTab('data');
                        }}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        <span>Dataset</span>
                      </Button>
                      <Separator className="my-4" />
                    </>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                      <span>Not Started</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="overview">
                    <FileText className="h-4 w-4 mr-2" />
                    Overview
                    {tabsCompleted.overview && <CheckCircle className="h-3 w-3 ml-1 text-green-600" />}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="collaboration" 
                    disabled={!isTabAccessible('collaboration')}
                  >
                    {soloMode ? (
                      <User className="h-4 w-4 mr-2" />
                    ) : (
                      <Users className="h-4 w-4 mr-2" />
                    )}
                    {soloMode ? "Solo Mode" : "Collaboration"}
                    {!isTabAccessible('collaboration') && <Lock className="h-3 w-3 ml-1" />}
                    {tabsCompleted.collaboration && <CheckCircle className="h-3 w-3 ml-1 text-green-600" />}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="setup"
                    disabled={!isTabAccessible('setup')}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    Setup
                    {!isTabAccessible('setup') && <Lock className="h-3 w-3 ml-1" />}
                    {tabsCompleted.setup && <CheckCircle className="h-3 w-3 ml-1 text-green-600" />}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="subtask"
                    disabled={!isTabAccessible('subtask')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Subtask
                    {!isTabAccessible('subtask') && <Lock className="h-3 w-3 ml-1" />}
                    {tabsCompleted.subtask && <CheckCircle className="h-3 w-3 ml-1 text-green-600" />}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <OverviewPanel 
                    problem={problem} 
                    currentStepIndex={currentStepIndex}
                    onStepChange={handleStepChange}
                    onComplete={() => completeTab('overview')}
                  />
                </TabsContent>
                
                <TabsContent value="collaboration">
                  <CollaborationPanel 
                    problem={problem} 
                    category={category || ''}
                    onComplete={() => completeTab('collaboration')}
                    onSoloModeSelect={handleSoloModeSelect}
                  />
                </TabsContent>
                
                <TabsContent value="setup">
                  <SetupPanel 
                    problem={problem} 
                    onComplete={() => completeTab('setup')}
                  />
                </TabsContent>
                
                <TabsContent value="subtask">
                  <SubtaskPanel 
                    step={currentActualSubtask}
                    onPrev={handlePrevStep}
                    onNext={handleNextStep}
                    isFirst={currentStepIndex === 0}
                    isLast={currentStepIndex === actualSubtasks.length - 1}
                    onComplete={() => {
                      if (currentStepIndex === actualSubtasks.length - 1) {
                        handleCompleteSubtask(false);
                      } else {
                        handleCompleteSubtask(false);
                      }
                    }}
                    onSkip={() => {
                      if (currentStepIndex === actualSubtasks.length - 1) {
                        handleCompleteSubtask(true);
                      } else {
                        handleCompleteSubtask(true);
                      }
                    }}
                    isSoloMode={soloMode}
                    sessionId={sessionId}
                    username={username}
                  />
                </TabsContent>

                <TabsContent value="data">
                  <div className="mb-4">
                    <Button 
                      variant="outline"
                      onClick={handleReturnFromDataTab}
                      className="flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Return to {previousTab.charAt(0).toUpperCase() + previousTab.slice(1)}
                    </Button>
                  </div>
                  <DataPanel dataset={problem.dataset} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="fixed bottom-8 right-8">
          <Button 
            onClick={() => setShowHintPanel(!showHintPanel)} 
            className="rounded-full h-12 w-12 p-0 shadow-lg"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </div>
        
        {showHintPanel && (
          <div className="fixed bottom-24 right-8 w-80 z-50">
            <HintPanel 
              problem={problem}
              currentStep={activeTab === 'subtask' ? currentActualSubtask : problem.steps[currentStepIndex]}
              onClose={() => setShowHintPanel(false)}
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProblemDetails;
