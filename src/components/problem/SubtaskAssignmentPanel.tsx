
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, UserPlus, Mail, Send, CheckCircle, Loader2, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { assignSubtaskToUser } from '@/services/assignmentService';
import { getInvitedCollaborators } from '@/services/collaborationService';

interface SubtaskAssignmentPanelProps {
  subtasks: any[];
  onComplete: () => void;
  onBack: () => void;
}

const SubtaskAssignmentPanel: React.FC<SubtaskAssignmentPanelProps> = ({ 
  subtasks,
  onComplete,
  onBack
}) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [invitedUsers, setInvitedUsers] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(true);
  
  // Fetch invited collaborators from the service
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        setIsLoadingCollaborators(true);
        const collaborators = await getInvitedCollaborators();
        
        // Add the current user as a collaborator
        const currentUser = {
          id: 'current-user',
          name: localStorage.getItem('username') || 'You',
          email: 'you@example.com',
          status: 'active'
        };
        
        // If no collaborators were invited, use dummy data
        if (collaborators.length === 0) {
          setInvitedUsers([
            currentUser,
            { id: 'user1', name: 'Alice Johnson', email: 'alice@example.com', status: 'invited' },
            { id: 'user2', name: 'Bob Smith', email: 'bob@example.com', status: 'invited' },
            { id: 'user3', name: 'Charlie Davis', email: 'charlie@example.com', status: 'invited' }
          ]);
        } else {
          // Format the collaborators data
          const formattedCollaborators = collaborators.map((collab: any) => ({
            id: collab.email,
            name: collab.name,
            email: collab.email,
            status: collab.status
          }));
          
          setInvitedUsers([currentUser, ...formattedCollaborators]);
        }
      } catch (error) {
        console.error('Error fetching collaborators:', error);
        toast({
          title: "Error",
          description: "Failed to load collaborators. Using default collaborators instead.",
          variant: "destructive"
        });
        
        // Fallback to dummy data
        setInvitedUsers([
          { id: 'current-user', name: localStorage.getItem('username') || 'You', email: 'you@example.com', status: 'active' },
          { id: 'user1', name: 'Alice Johnson', email: 'alice@example.com', status: 'invited' },
          { id: 'user2', name: 'Bob Smith', email: 'bob@example.com', status: 'invited' },
          { id: 'user3', name: 'Charlie Davis', email: 'charlie@example.com', status: 'invited' }
        ]);
      } finally {
        setIsLoadingCollaborators(false);
      }
    };
    
    fetchCollaborators();
  }, [toast]);
  
  const handleAssignUser = async (subtaskId: string, userId: string) => {
    setAssignments(prev => ({
      ...prev,
      [subtaskId]: userId
    }));
    
    try {
      // Find the assigned user's info
      const assignedUser = invitedUsers.find(user => user.id === userId);
      
      if (!assignedUser) {
        throw new Error('User not found');
      }
      
      // Store the subtask assignment in localStorage
      const subtaskAssignmentsStr = localStorage.getItem('subtaskAssignments');
      let subtaskAssignments = subtaskAssignmentsStr ? JSON.parse(subtaskAssignmentsStr) : {};
      
      // Add the assignment with complete user details
      subtaskAssignments[subtaskId] = {
        userId: assignedUser.id,
        userName: assignedUser.name,
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
        description: `${assignedUser.name} has been assigned to this subtask.`,
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
              {isLoadingCollaborators ? (
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
                                {invitedUsers.map(user => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.name} ({user.email})
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
              <h3 className="font-medium">Invited Team Members</h3>
              
              <div className="space-y-2">
                {isLoadingCollaborators ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  invitedUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{user.name}</p>
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
            disabled={isSending || isLoadingCollaborators || Object.keys(assignments).length !== subtasks.length}
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
