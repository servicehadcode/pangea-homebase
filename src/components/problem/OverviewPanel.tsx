
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CheckCircle, 
  CheckSquare,
  ChevronLeft,
  Download,
  FileText,
  FileSpreadsheet,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface OverviewPanelProps {
  problem: any;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onComplete: () => void;
  onBack?: () => void;
}

const OverviewPanel: React.FC<OverviewPanelProps> = ({ 
  problem, 
  currentStepIndex, 
  onStepChange,
  onComplete,
  onBack
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${backendURL}/me`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };
    
    checkAuthStatus();
  }, [backendURL]);

  // Transform downloadable items from the problem data
  const downloadableItems = problem.downloadableItems?.map((item: string, index: number) => ({
    id: index.toString(),
    name: item,
    description: `Resource for problem ${problem.id}`,
    size: "500KB", // Sample size (could be dynamic in future)
    fileType: item.toLowerCase().endsWith('.pdf') ? 'pdf' : 
              item.toLowerCase().endsWith('.csv') ? 'csv' : 'file',
    uploadDate: new Date().toLocaleDateString() // Sample date
  })) || [];
  
  // Filter out system tasks (setup, collaboration, problem analysis)
  const systemTasks = ['setup', 'collaboration', 'analysis'];
  const actualSubtasks = problem.steps.filter((step: any) => 
    !systemTasks.includes(step.id)
  );
  
  // Get preparation steps separately 
  const setupStep = problem.steps.find((step: any) => step.id === 'setup');
  const collaborationStep = problem.steps.find((step: any) => step.id === 'collaboration');
  const analysisStep = problem.steps.find((step: any) => step.id === 'analysis');
  
  // Calculate progress based on actual subtasks only
  const completedSteps = actualSubtasks.filter((step: any) => step.isCompleted).length;
  const progressPercentage = actualSubtasks.length > 0 
    ? (completedSteps / actualSubtasks.length) * 100 
    : 0;

  const handleReviewComplete = () => {
    if (!user) {
      // If user is not logged in, redirect to sign up page and store the return URL
      const currentURL = window.location.pathname;
      localStorage.setItem('returnAfterLogin', currentURL);
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with this problem.",
      });
      navigate('/sign-up');
      return;
    }
    
    // If user is logged in, proceed as normal
    onComplete();
  };

  const handleDownload = (item: any) => {
    toast({
      title: "Download Started",
      description: `Downloading ${item.name}...`,
    });
    
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${item.name} has been downloaded successfully.`,
      });
    }, 2000);
  };

  const handleCheckDownloadableItems = () => {
    if (downloadableItems.length === 0) {
      toast({
        title: "No Items Available",
        description: "There are no downloadable items for this problem.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Items Available",
        description: `${downloadableItems.length} downloadable items available for this problem.`,
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Project Overview</CardTitle>
          {onBack && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBack}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          )}
        </div>
        <CardDescription>
          A comprehensive view of the project, requirements, and progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Project Status</h3>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare className="h-5 w-5 text-pangea" />
              <span className="font-medium">Progress</span>
            </div>
            <Progress value={progressPercentage} className="h-2 mb-2" />
            <div className="text-sm text-right text-muted-foreground">
              {completedSteps}/{actualSubtasks.length} subtasks
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Project Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Problem Description</h3>
          <p className="whitespace-pre-line">{problem.longDescription}</p>
        </div>
        
        <Separator />
        
        {/* Requirements */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="font-medium">Hardware:</p>
              <p className="text-muted-foreground">{problem.requirements.hardware}</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="font-medium">Software:</p>
              <p className="text-muted-foreground">{problem.requirements.software}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Downloadable Items Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Downloadable Items</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCheckDownloadableItems}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Check Items
            </Button>
          </div>

          {isLoadingItems ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading downloadable items...</span>
            </div>
          ) : downloadableItems.length > 0 ? (
            <div className="space-y-2">
              {downloadableItems.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {item.fileType === 'pdf' ? (
                        <FileText className="h-10 w-10 text-red-500" />
                      ) : item.fileType === 'csv' ? (
                        <FileSpreadsheet className="h-10 w-10 text-green-500" />
                      ) : (
                        <FileText className="h-10 w-10 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">Size: {item.size}</span>
                        <span className="text-xs text-muted-foreground">Uploaded: {item.uploadDate}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(item)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No downloadable items</AlertTitle>
              <AlertDescription>
                There are no downloadable items available for this problem.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <Separator />
        
        {/* Preparation Steps Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Preparation Steps</h3>
          
          {problem.preparationSteps && problem.preparationSteps.length > 0 ? (
            <div className="space-y-2">
              {problem.preparationSteps.map((step: string, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm">{step}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Setup */}
              {setupStep && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                      setupStep.isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {setupStep.isCompleted ? <CheckCircle className="h-4 w-4" /> : 1}
                    </div>
                    <div>
                      <h4 className="font-medium">Environment Setup</h4>
                      <p className="text-sm text-muted-foreground">Set up your development environment and get ready to work</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Collaboration */}
              {collaborationStep && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                      collaborationStep.isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {collaborationStep.isCompleted ? <CheckCircle className="h-4 w-4" /> : 2}
                    </div>
                    <div>
                      <h4 className="font-medium">Team Collaboration</h4>
                      <p className="text-sm text-muted-foreground">Set up collaboration with your team members</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Analysis */}
              {analysisStep && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                      analysisStep.isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {analysisStep.isCompleted ? <CheckCircle className="h-4 w-4" /> : 3}
                    </div>
                    <div>
                      <h4 className="font-medium">Problem Analysis</h4>
                      <p className="text-sm text-muted-foreground">Analyze and understand the problem requirements</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <Separator />
        
        {/* Subtasks Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Implementation Subtasks</h3>
          <div className="space-y-2">
            {actualSubtasks.map((step: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                    step.isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {step.isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-6">
        <Button 
          className="pangea-button-primary"
          onClick={handleReviewComplete}
        >
          I've Reviewed the Overview
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OverviewPanel;
