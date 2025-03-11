
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
  ChevronLeft
} from 'lucide-react';

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
      tags: ["Machine Learning", "Data Preprocessing", "API Development"],
      steps: [
        {
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
          isCompleted: true
        },
        {
          title: "Dashboard",
          description: "Set up collaboration and tracking tools.",
          subproblems: [
            "Add users to collaborate: 1 user adds other users in UI and they get automatic access to the github repo",
            "View progress"
          ],
          isCompleted: false
        },
        {
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
          isCompleted: false
        },
        {
          title: "Dataset Analysis",
          description: "Analyze the given dataset to identify key attributes needed for training.",
          subproblems: [
            "Download the dataset.",
            "Create a new folder in repo called dataset and attach this csv there.",
            "Write a python code that reads this csv and performs corr()",
            "Write a python code that does PCA on dataset",
            "Return python list of attributes"
          ],
          isCompleted: false
        },
        {
          title: "Implementation & Delivery",
          description: "Implement the solution and deliver the final product.",
          subproblems: [],
          isCompleted: false
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
    // Software development problems would be defined here
  ]
};

const ProblemDetails = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  
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
    setCurrentStep(index);
    setActiveTab('step-details');
  };
  
  const handleNextStep = () => {
    if (currentStep < problem.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const currentStepData = problem.steps[currentStep];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
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
                  {problem.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  Mark as Complete
                </Button>
                <Button className="pangea-button-primary">
                  {currentStepData.isCompleted ? 'Continue' : 'Start Problem'}
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
                  <div className="space-y-2">
                    {problem.steps.map((step, index) => (
                      <Button
                        key={index}
                        variant={currentStep === index ? "default" : "ghost"}
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
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span>Current</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="overview">
                    <FileText className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="step-details">
                    <List className="h-4 w-4 mr-2" />
                    Step Details
                  </TabsTrigger>
                  <TabsTrigger value="hints">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Hints & FAQ
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle>Problem Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <p className="whitespace-pre-line">{problem.longDescription}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Requirements</h3>
                        <div className="space-y-2">
                          <div className="p-4 bg-secondary/30 rounded-lg">
                            <p className="font-medium">Hardware:</p>
                            <p>{problem.requirements.hardware}</p>
                          </div>
                          <div className="p-4 bg-secondary/30 rounded-lg">
                            <p className="font-medium">Software:</p>
                            <p>{problem.requirements.software}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Steps Overview</h3>
                        <div className="space-y-3">
                          {problem.steps.map((step, index) => (
                            <div 
                              key={index}
                              className={`p-4 rounded-lg border ${
                                step.isCompleted 
                                  ? 'border-green-200 bg-green-50' 
                                  : currentStep === index
                                    ? 'border-blue-200 bg-blue-50'
                                    : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                                  step.isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : currentStep === index
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-200 text-gray-700'
                                }`}>
                                  {step.isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                                </div>
                                <div>
                                  <h4 className="font-medium">{step.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="step-details">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="flex items-center gap-2">
                        <span>Step {currentStep + 1}: {currentStepData.title}</span>
                        {currentStepData.isCompleted && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Completed
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handlePrevStep}
                          disabled={currentStep === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                          {currentStep + 1} of {problem.steps.length}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleNextStep}
                          disabled={currentStep === problem.steps.length - 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <p>{currentStepData.description}</p>
                      </div>
                      
                      {currentStepData.subproblems.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Sub-Problems</h3>
                          <div className="space-y-3">
                            {currentStepData.subproblems.map((subproblem, index) => (
                              <div 
                                key={index}
                                className="p-4 bg-secondary/30 rounded-lg flex items-start gap-3"
                              >
                                <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                  {index + 1}
                                </div>
                                <div>
                                  <p>{subproblem}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-secondary/30 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Project Status</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">PR Created:</span>
                            <Badge variant="outline" className="text-amber-800 bg-amber-100">No</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">PR Merged:</span>
                            <Badge variant="outline" className="text-amber-800 bg-amber-100">No</Badge>
                          </div>
                          <div>
                            <span className="font-medium">Resolve PR comments:</span>
                            <div className="mt-2">
                              <textarea 
                                className="w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm"
                                rows={2}
                                placeholder="Add comments here (required)"
                              ></textarea>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Deliverables:</span>
                            <div className="mt-2">
                              <textarea 
                                className="w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm"
                                rows={2}
                                placeholder="List deliverables here (required)"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <Button 
                          variant="outline"
                          onClick={handlePrevStep}
                          disabled={currentStep === 0}
                        >
                          Previous Step
                        </Button>
                        <div className="space-x-2">
                          <Button variant="outline">
                            Save Progress
                          </Button>
                          <Button 
                            className="pangea-button-primary"
                            onClick={handleNextStep}
                            disabled={currentStep === problem.steps.length - 1}
                          >
                            {currentStep === problem.steps.length - 1 ? 'Complete' : 'Next Step'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="hints">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hints & FAQ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-secondary/30 p-4 rounded-lg">
                          <h3 className="flex items-center gap-2 font-medium mb-2">
                            <HelpCircle className="h-5 w-5 text-pangea" />
                            How do I get started with Docker?
                          </h3>
                          <p className="text-muted-foreground">
                            Docker is a platform that uses containerization to make it easier to create, deploy, and run applications. To get started, download and install Docker Desktop from the official website, then use the Docker CLI to build and run containers.
                          </p>
                        </div>
                        
                        <div className="bg-secondary/30 p-4 rounded-lg">
                          <h3 className="flex items-center gap-2 font-medium mb-2">
                            <HelpCircle className="h-5 w-5 text-pangea" />
                            What is PCA and when should I use it?
                          </h3>
                          <p className="text-muted-foreground">
                            Principal Component Analysis (PCA) is a dimensionality-reduction technique that transforms a large set of variables into a smaller one that still contains most of the information. Use it when you want to reduce the number of features while preserving as much variance as possible.
                          </p>
                        </div>
                        
                        <div className="bg-secondary/30 p-4 rounded-lg">
                          <h3 className="flex items-center gap-2 font-medium mb-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Common pitfall: Overfitting
                          </h3>
                          <p className="text-muted-foreground">
                            Be careful not to overfit your model to the training data. This can happen when your model learns the noise in the training data rather than the underlying pattern. Use techniques like cross-validation, regularization, or early stopping to prevent overfitting.
                          </p>
                        </div>
                        
                        <div className="bg-secondary/30 p-4 rounded-lg">
                          <h3 className="flex items-center gap-2 font-medium mb-2">
                            <Terminal className="h-5 w-5 text-pangea" />
                            Useful code snippet
                          </h3>
                          <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-sm">
{`# Performing PCA in Python
from sklearn.decomposition import PCA
import pandas as pd

# Load your dataset
data = pd.read_csv('dataset.csv')

# Select features for PCA
features = data.drop('channel', axis=1)

# Standardize the features
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

# Apply PCA
pca = PCA(n_components=5)  # Keep top 5 components
pca_result = pca.fit_transform(scaled_features)

# Variance explained by each component
print(pca.explained_variance_ratio_)`}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProblemDetails;
