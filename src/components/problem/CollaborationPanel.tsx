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
  const [isInviting, setIsInviting] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [hasAddedCollaborator, setHasAddedCollaborator] = useState(false);
  const [hasAssignedTask, setHasAssignedTask] = useState(false);
  const [taskAssignments, setTaskAssignments] = useState<Record<string, string>>({});
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      email: 'user@example.com',
      name: 'Current User',
      status: 'active',
      assignedTasks: [],
      isParent: true
    }
  ]);

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
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{collaborator.name}</span>
                        {!collaborator.isParent && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingName(collaborator.email);
                              setNewName(collaborator.name);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                    <span className="text-sm text-muted-foreground">{collaborator.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={collaborator.status === 'active' ? 'default' : 'secondary'}>
                    {collaborator.status === 'active' ? 'Active' : 'Invited'}
                  </Badge>
                  {!collaborator.isParent && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveCollaborator(collaborator.email)}
                    >
                      <UserMinus className="h-4 w-4 text-red-500" />
                    </Button>
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
          onClick={onSoloModeSelect}
        >
          Switch to Solo Mode
        </Button>
        <Button 
          onClick={onComplete}
          disabled={!hasAddedCollaborator || !hasAssignedTask}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CollaborationPanel;