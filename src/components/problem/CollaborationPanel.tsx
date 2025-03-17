
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  UserPlus, 
  UserMinus, 
  Mail, 
  User, 
  AlignLeft,
  CheckCircle,
  XCircle,
  Users,
  UserX,
  Edit,
  Check,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  sendCollaborationInvite, 
  updateCollaboratorStatus, 
  updateCollaboratorName 
} from '@/services/collaborationService';

interface Collaborator {
  email: string;
  name: string;
  status: 'invited' | 'active';
  assignedTasks: string[];
  isParent?: boolean;
}

interface CollaborationPanelProps {
  problem: any;
  category: string;
  onComplete: () => void;
  onSoloModeSelect: () => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ 
  problem, 
  category, 
  onComplete,
  onSoloModeSelect
}) => {
  const { toast } = useToast();
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      email: 'user@example.com',
      name: 'Current User',
      status: 'active',
      assignedTasks: [],
      isParent: true
    }
  ]);
  const [taskAssignments, setTaskAssignments] = useState<{[key: string]: string}>({});
  const [hasAddedCollaborator, setHasAddedCollaborator] = useState(false);
  const [hasAssignedTask, setHasAssignedTask] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'selection' | 'solo' | 'team'>('selection');
  const [isInviting, setIsInviting] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail.trim() || !newCollaboratorEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    if (collaborators.some(c => c.email === newCollaboratorEmail)) {
      toast({
        title: "Duplicate Collaborator",
        description: "This user is already a collaborator.",
        variant: "destructive"
      });
      return;
    }
    
    setIsInviting(true);
    
    try {
      // Send invitation via microservice
      const response = await sendCollaborationInvite(newCollaboratorEmail);
      
      if (response.success) {
        const newCollaborator: Collaborator = {
          email: newCollaboratorEmail,
          name: newCollaboratorEmail.split('@')[0],
          status: 'invited',
          assignedTasks: [],
          isParent: false
        };
        
        setCollaborators([...collaborators, newCollaborator]);
        setNewCollaboratorEmail('');
        setHasAddedCollaborator(true);
        
        toast({
          title: "Invitation Sent",
          description: response.message
        });
      } else {
        toast({
          title: "Invitation Failed",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInviting(false);
    }
  };
  
  const handleRemoveCollaborator = (email: string) => {
    setCollaborators(collaborators.filter(c => c.email !== email));
    
    toast({
      title: "Collaborator Removed",
      description: `${email} has been removed from this project.`
    });
  };
  
  const handleAssignTask = (taskId: string, email: string) => {
    // Skip assignment if task is one of the core tasks that should be available to all
    const coreTaskIds = ["setup", "collaboration", "analysis"];
    if (coreTaskIds.includes(taskId)) {
      return;
    }
    
    setTaskAssignments({
      ...taskAssignments,
      [taskId]: email
    });
    
    // Update the collaborator's assigned tasks
    setCollaborators(
      collaborators.map(c => 
        c.email === email 
          ? { ...c, assignedTasks: [...c.assignedTasks.filter(t => t !== taskId), taskId] }
          : { ...c, assignedTasks: c.assignedTasks.filter(t => t !== taskId) }
      )
    );
    
    setHasAssignedTask(true);
    
    toast({
      title: "Task Assigned",
      description: `Task assigned to ${email}.`
    });
  };

  const handleSaveAssignments = () => {
    toast({
      title: "Assignments Saved",
      description: "Task assignments have been saved successfully."
    });
    
    // If we have at least added a collaborator or assigned a task, enable completion
    if (hasAddedCollaborator || hasAssignedTask || Object.keys(taskAssignments).length > 0) {
      onComplete();
    } else {
      toast({
        title: "Action Required",
        description: "Please add at least one collaborator or assign a task before proceeding.",
        variant: "destructive"
      });
    }
  };

  const handleSoloModeSelect = () => {
    setSelectedMode('solo');
    toast({
      title: "Solo Mode Selected",
      description: "You've chosen to work on this problem by yourself."
    });
    
    // Wait a moment before completing to let the user see the toast
    setTimeout(() => {
      onSoloModeSelect();
    }, 1000);
  };

  const handleTeamModeSelect = () => {
    setSelectedMode('team');
    toast({
      title: "Team Mode Selected",
      description: "You've chosen to collaborate with others on this problem."
    });
  };

  const handleEditName = (email: string, currentName: string) => {
    setEditingName(email);
    setNewName(currentName);
  };

  const handleSaveName = async (email: string) => {
    if (newName.trim() === '') {
      toast({
        title: "Invalid Name",
        description: "Name cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await updateCollaboratorName(email, newName);
      
      if (response.success) {
        setCollaborators(
          collaborators.map(c => 
            c.email === email ? { ...c, name: newName } : c
          )
        );
        
        toast({
          title: "Name Updated",
          description: response.message
        });
      } else {
        toast({
          title: "Update Failed",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update name. Please try again.",
        variant: "destructive"
      });
    } finally {
      setEditingName(null);
    }
  };

  const handleUpdateStatus = async (email: string, newStatus: 'invited' | 'active') => {
    setUpdatingStatus(email);
    
    try {
      const response = await updateCollaboratorStatus(email, newStatus);
      
      if (response.success) {
        setCollaborators(
          collaborators.map(c => 
            c.email === email ? { ...c, status: newStatus } : c
          )
        );
        
        toast({
          title: "Status Updated",
          description: response.message
        });
      } else {
        toast({
          title: "Update Failed",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Determine if a task is assignable or a core task
  const isAssignableTask = (taskId: string): boolean => {
    const coreTaskIds = ["setup", "collaboration", "analysis"];
    return !coreTaskIds.includes(taskId);
  };

  // Render the mode selection UI
  if (selectedMode === 'selection') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Project Collaboration</CardTitle>
          <CardDescription>
            Choose how you want to approach this problem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Solo Mode Option */}
            <div 
              className="border rounded-lg p-6 hover:border-pangea hover:bg-pangea/5 cursor-pointer transition-colors"
              onClick={handleSoloModeSelect}
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Work Solo</h3>
                <p className="text-muted-foreground mb-4">
                  Tackle this problem on your own at your own pace.
                </p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Full control over implementation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Work at your own schedule</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Learn all aspects of the problem</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Select Solo Mode
                </Button>
              </div>
            </div>

            {/* Team Mode Option */}
            <div 
              className="border rounded-lg p-6 hover:border-pangea hover:bg-pangea/5 cursor-pointer transition-colors"
              onClick={handleTeamModeSelect}
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Collaborate with Others</h3>
                <p className="text-muted-foreground mb-4">
                  Invite team members to collaborate on this problem.
                </p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Divide work between team members</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Leverage different skills and perspectives</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Complete the project faster</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Select Team Mode
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Solo mode confirmation
  if (selectedMode === 'solo') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Solo Mode Selected</CardTitle>
          <CardDescription>
            You've chosen to work on this problem by yourself
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <User className="h-10 w-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-medium mb-4">Ready to Begin</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              You'll be working on this problem independently. All tasks will be assigned to you by default.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button 
            className="pangea-button-primary"
            onClick={onSoloModeSelect}
          >
            Continue to Overview
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Team mode - show the original collaboration UI
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Team Collaboration</CardTitle>
        <CardDescription>
          Invite team members and assign tasks to collaborate on this problem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invite Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Invite Collaborators</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={newCollaboratorEmail}
              onChange={(e) => setNewCollaboratorEmail(e.target.value)}
              className="flex-1"
              disabled={isInviting}
            />
            <Button onClick={handleAddCollaborator} disabled={isInviting}>
              {isInviting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Inviting...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Separator />
        
        {/* Team Members */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Team Members</h3>
          
          <div className="space-y-3">
            {collaborators.map((collaborator, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-md border"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    {editingName === collaborator.email ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="h-8 w-36"
                          autoFocus
                        />
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleSaveName(collaborator.email)}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setEditingName(null)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className="font-medium">{collaborator.name}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => handleEditName(collaborator.email, collaborator.name)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">{collaborator.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {updatingStatus === collaborator.email ? (
                    <div className="flex items-center gap-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Updating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={collaborator.status === 'active' ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          if (!collaborator.isParent) {
                            handleUpdateStatus(
                              collaborator.email, 
                              collaborator.status === 'active' ? 'invited' : 'active'
                            );
                          }
                        }}
                      >
                        {collaborator.status === 'active' ? 'Active' : 'Invited'}
                      </Badge>
                      {index !== 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveCollaborator(collaborator.email)}
                        >
                          <UserMinus className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Task Assignment */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Task Assignments</h3>
          
          <div className="space-y-4">
            {problem.steps.map((step: any, index: number) => (
              <div 
                key={index}
                className="p-4 rounded-md border"
              >
                <div className="flex justify-between mb-3">
                  <div className="font-medium">{step.title}</div>
                  <Badge variant="outline">
                    {step.estimatedHours} hrs
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                
                <div className="flex items-center justify-between">
                  {isAssignableTask(step.id) ? (
                    <>
                      <span className="text-sm">Assign to:</span>
                      <div className="flex gap-2">
                        {collaborators.map((collaborator, cIndex) => (
                          <Button
                            key={cIndex}
                            variant={taskAssignments[step.id] === collaborator.email ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleAssignTask(step.id, collaborator.email)}
                            disabled={!collaborators[0].isParent} // Only parent user can assign tasks
                          >
                            {collaborator.name.split(' ')[0]}
                          </Button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="w-full text-center py-1">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Available to all collaborators
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={() => setSelectedMode('selection')}
        >
          <UserX className="h-4 w-4 mr-2" />
          Switch to Solo Mode
        </Button>
        <Button 
          className="pangea-button-primary"
          onClick={handleSaveAssignments}
        >
          Complete & Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CollaborationPanel;
