
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  GitBranch, 
  GitPullRequest,
  List,
  CheckSquare,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SubtaskPanelProps {
  step: any;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const SubtaskPanel: React.FC<SubtaskPanelProps> = ({ 
  step,
  onPrev,
  onNext,
  isFirst,
  isLast
}) => {
  const { toast } = useToast();
  const [branchCreated, setBranchCreated] = useState(false);
  const [prCreated, setPrCreated] = useState(false);
  const [prComments, setPrComments] = useState('');
  const [deliverables, setDeliverables] = useState('');
  
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
        description: "Please add comments resolving PR feedback.",
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
    
    toast({
      title: "Subtask Completed",
      description: `You have completed: ${step.title}`
    });
    
    onNext();
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left column - Description and criteria */}
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
      
      {/* Right column - Implementation and status */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Implementation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[120px]">
                <span className="text-sm text-muted-foreground">Estimated Time</span>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1 text-pangea" />
                  <span className="font-medium">{step.estimatedHours} hours</span>
                </div>
              </div>
              
              <div className="flex-1 min-w-[120px]">
                <span className="text-sm text-muted-foreground">Reporter</span>
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-1 text-pangea" />
                  <span className="font-medium">{step.reporter}</span>
                </div>
              </div>
              
              <div className="flex-1 min-w-[120px]">
                <span className="text-sm text-muted-foreground">Assignee</span>
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-1 text-pangea" />
                  <span className="font-medium">
                    {step.assignedTo || "Unassigned"}
                  </span>
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
        </Card>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline"
            onClick={onPrev}
            disabled={isFirst}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous Subtask
          </Button>
          
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
      </div>
    </div>
  );
};

export default SubtaskPanel;
