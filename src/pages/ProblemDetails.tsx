
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle, 
  Code, 
  Database,
  List,
  HelpCircle,
  AlertTriangle,
  FileText,
  Terminal,
  ChevronLeft,
  Users,
  Clock,
  GitBranch,
  GitPullRequest,
  Folder
} from 'lucide-react';

import CollaborationPanel from '@/components/problem/CollaborationPanel';
import OverviewPanel from '@/components/problem/OverviewPanel';
import SetupPanel from '@/components/problem/SetupPanel';
import SubtaskPanel from '@/components/problem/SubtaskPanel';
import HintPanel from '@/components/problem/HintPanel';

// Sample problem data (would typically come from an API)
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
    // Additional problems would be defined here
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
        // More steps would be defined here
      ],
      requirements: {
        hardware: "Minimum 16GB RAM, quad-core processor, SSD with 100GB free space",
        software: "Docker, Docker Compose, Node.js v14+, PostgreSQL, Redis"
      }
    },
    // More software development problems would be defined here
  ]
};

const ProblemDetails = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('collaboration');
  const [showHintPanel, setShowHintPanel] = useState(false);
  
  // Find the problem based on the category and id
  const problem = problemsData[category as keyof typeof problemsData]?.find(
    p => p.id === parseInt(id || '0')
  );
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!problem) {
      navigate('/problems');
    }
  }, [problem, navigate]);
  
  if (!problem) {
    return null;
  }
  
  const handleStepChange = (index: number) => {
    setCurrentStepIndex(index);
    setActiveTab('subtask');
  };
  
  const handleNextStep = () => {
    if (currentStepIndex < problem.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const currentStepData = problem.steps[currentStepIndex];
  
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
                  {problem.tags.map((tag, i) => (
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
                  <CardTitle>Subtasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {problem.steps.map((step, index) => (
                      <Button
                        key={index}
                        variant={currentStepIndex === index ? "default" : "ghost"}
                        className={`w-full justify-start ${step.isCompleted ? 'text-green-600' : ''}`}
                        onClick={() => handleStepChange(index)}
                      >
                        {step.isCompleted && <CheckCircle className="h-4 w-4 mr-2" />}
                        {!step.isCompleted && <div className="h-4 w-4 rounded-full border border-current mr-2 flex items-center justify-center">
                          {index + 1}
                        </div>}
                        <span className="truncate">{step.title}</span>
                      </Button>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
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
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="collaboration">
                    <Users className="h-4 w-4 mr-2" />
                    Collaboration
                  </TabsTrigger>
                  <TabsTrigger value="overview">
                    <FileText className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="setup">
                    <Folder className="h-4 w-4 mr-2" />
                    Setup
                  </TabsTrigger>
                  <TabsTrigger value="subtask">
                    <List className="h-4 w-4 mr-2" />
                    Subtask
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="collaboration">
                  <CollaborationPanel 
                    problem={problem} 
                    category={category || ''}
                  />
                </TabsContent>
                
                <TabsContent value="overview">
                  <OverviewPanel 
                    problem={problem} 
                    currentStepIndex={currentStepIndex}
                    onStepChange={handleStepChange}
                  />
                </TabsContent>
                
                <TabsContent value="setup">
                  <SetupPanel 
                    problem={problem} 
                    onComplete={() => setActiveTab('subtask')}
                  />
                </TabsContent>
                
                <TabsContent value="subtask">
                  <SubtaskPanel 
                    step={currentStepData}
                    onPrev={handlePrevStep}
                    onNext={handleNextStep}
                    isFirst={currentStepIndex === 0}
                    isLast={currentStepIndex === problem.steps.length - 1}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Floating Help Button */}
        <div className="fixed bottom-8 right-8">
          <Button 
            onClick={() => setShowHintPanel(!showHintPanel)} 
            className="rounded-full h-12 w-12 p-0 shadow-lg"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Hint Panel */}
        {showHintPanel && (
          <div className="fixed bottom-24 right-8 w-80 z-50">
            <HintPanel 
              problem={problem}
              currentStep={currentStepData}
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
