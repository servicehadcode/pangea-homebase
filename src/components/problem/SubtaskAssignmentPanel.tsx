import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, UserPlus, Mail, Send, CheckCircle, Loader2, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { assignSubtaskToUser } from '@/services/assignmentService';
import { getProblemInstance } from '@/services/problemService';

interface SubtaskAssignmentPanelProps {
  subtasks: any[];
  onComplete: () => void;
  onBack: () => void;
}

interface Collaborator {
  userId: string;
  username: string;
  email: string;
  status?: string;
  invitedAt?: string;
}

const SubtaskAssignmentPanel: React.FC<SubtaskAssignmentPanelProps> = ({ 
  subtasks,
  onComplete,
  onBack
}) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblemInstance = async () => {
      try {
        setIsLoading(true);
        const urlParts = window.location.pathname.split('/');
        const problemNum = urlParts[urlParts.length - 1];
        const userId = localStorage.getItem('userId');

        if (!problemNum || !userId) {
          throw new Error('Missing problem number or user ID');
        }

        const instance = await getProblemInstance(problemNum, userId);
        
        if (!instance) {
          throw new Error('Problem instance not found');
        }

        // Add owner as a collaborator
        const allCollaborators: Collaborator[] = [{
          userId: instance.owner.userId,
          username: instance.owner.username,
          email: instance.owner.email,
          status: 'active'
        }];

        // Add other collaborators if they exist
        if (instance.collaborators && instance.collaborators.length > 0) {
          allCollaborators.push(...instance.collaborators);
        }

        setCollaborators(allCollaborators);
      } catch (error) {
        console.error('Error fetching problem instance:', error);
        toast({
          title: "Error",
          description: "Failed to load collaborators. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblemInstance();
  }, [toast]);

  const handleAssignUser = async (subtaskId: string, userId: string) => {
    setAssignments(prev => ({
      ...prev,
      [subtaskId]: userId
    }));
    
    try {
      // Find the assigned user's info
      const assignedUser = collaborators.find(user => user.userId === userId);
      
      if (!assignedUser) {
        throw new Error('User not found');
      }
      
      // Store the subtask assignment in localStorage
      const subtaskAssignmentsStr = localStorage.getItem('subtaskAssignments');
      let subtaskAssignments = subtaskAssignmentsStr ? JSON.parse(subtaskAssignmentsStr) : {};
      
      // Add the assignment with complete user details
      subtaskAssignments[subtaskId] = {
        userId: assignedUser.userId,
        userName: assignedUser.username,
        userEmail: assignedUser.email,
        assignedAt: new Date().toISOString(),
        status: assignedUser.status
      };
      
      // Save back to localStorage
      localStorage.setItem('subtaskAssignments', JSON.stringify(subtaskAssignments));
      
      // Call the assignment service to send notification
      await assignSubtaskToUser(subtaskId, userId);
      
      toast({
        title: "User Assigned",
        description: `${assignedUser.username} has been assigned to this subtask.`,
      });
    } catch (error) {
      console.error('Error assigning user:', error);
      toast({
        title: "Assignment Failed",
        description: "There was an error assigning the user. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCompleteAssignments = async () => {
    const unassignedSubtasks = subtasks.filter(subtask => !assignments[subtask.id]);
    
    if (unassignedSubtasks.length > 0) {
      toast({
        title: "Incomplete Assignments",
        description: `${unassignedSubtasks.length} subtasks are still unassigned. Please assign all subtasks before continuing.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Simulate backend process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsComplete(true);
      
      toast({
        title: "Assignments Complete",
        description: "All subtasks have been assigned successfully.",
      });
      
      // Wait a moment before completing
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error completing the assignments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Subtasks</CardTitle>
        <CardDescription>
          Assign each subtask to a team member. All team members must have a task assigned before proceeding.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isComplete ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold">Assignments Complete!</h3>
            <p className="text-muted-foreground">
              All team members have been notified of their assignments.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading collaborators...</span>
                </div>
              ) : (
                <>
                  {subtasks.map(subtask => (
                    <Card key={subtask.id} className="overflow-hidden">
                      <div className="p-4 bg-secondary/30">
                        <h3 className="font-medium">{subtask.title}</h3>
                        <p className="text-sm text-muted-foreground">{subtask.description}</p>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                          <div className="flex-1">
                            <Label htmlFor={`assign-${subtask.id}`} className="mb-1 block">
                              Assign to
                            </Label>
                            <Select
                              value={assignments[subtask.id] || ""}
                              onValueChange={(value) => handleAssignUser(subtask.id, value)}
                            >
                              <SelectTrigger id={`assign-${subtask.id}`}>
                                <SelectValue placeholder="Select a team member" />
                              </SelectTrigger>
                              <SelectContent>
                                {collaborators.map(user => (
                                  <SelectItem key={user.userId} value={user.userId}>
                                    {user.username} ({user.email})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {assignments[subtask.id] && (
                            <div className="w-full sm:w-auto">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-green-600"
                                disabled
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Assigned
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Team Members</h3>
              
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  collaborators.map(user => (
                    <div key={user.userId} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      
                      <Badge variant="outline" className="px-2 py-1 text-xs">
                        {user.status === 'active' ? 'Active' : 'Invited'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={onBack}
          disabled={isComplete || isSending}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        
        {!isComplete && (
          <Button 
            onClick={handleCompleteAssignments}
            disabled={isSending || isLoading || Object.keys(assignments).length !== subtasks.length}
            className="flex items-center gap-1"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Notifications...
              </>
            ) : (
              <>
                Continue to Subtasks
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubtaskAssignmentPanel;
