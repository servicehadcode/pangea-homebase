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
  XCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Collaborator {
  email: string;
  name: string;
  status: 'invited' | 'active';
  assignedTasks: string[];
}

interface CollaborationPanelProps {
  problem: any;
  category: string;
  onComplete: () => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ problem, category, onComplete }) => {
  const { toast } = useToast();
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      email: 'user@example.com',
      name: 'Current User',
      status: 'active',
      assignedTasks: []
    }
  ]);
  const [taskAssignments, setTaskAssignments] = useState<{[key: string]: string}>({});
  const [hasAddedCollaborator, setHasAddedCollaborator] = useState(false);
  const [hasAssignedTask, setHasAssignedTask] = useState(false);
  
  const handleAddCollaborator = () => {
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
    
    const newCollaborator: Collaborator = {
      email: newCollaboratorEmail,
      name: newCollaboratorEmail.split('@')[0],
      status: 'invited',
      assignedTasks: []
    };
    
    setCollaborators([...collaborators, newCollaborator]);
    setNewCollaboratorEmail('');
    setHasAddedCollaborator(true);
    
    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${newCollaboratorEmail}.`
    });
  };
  
  const handleRemoveCollaborator = (email: string) => {
    setCollaborators(collaborators.filter(c => c.email !== email));
    
    toast({
      title: "Collaborator Removed",
      description: `${email} has been removed from this project.`
    });
  };
  
  const handleAssignTask = (taskId: string, email: string) => {
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
            />
            <Button onClick={handleAddCollaborator}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
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
                    <div className="font-medium">{collaborator.name}</div>
                    <div className="text-sm text-muted-foreground">{collaborator.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={collaborator.status === 'active' ? 'default' : 'outline'}>
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
                  <span className="text-sm">Assign to:</span>
                  <div className="flex gap-2">
                    {collaborators.map((collaborator, cIndex) => (
                      <Button
                        key={cIndex}
                        variant={taskAssignments[step.id] === collaborator.email ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleAssignTask(step.id, collaborator.email)}
                      >
                        {collaborator.name.split(' ')[0]}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <div className="text-sm text-muted-foreground">
          {hasAddedCollaborator || hasAssignedTask ? 
            <span className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" /> Ready to continue
            </span> : 
            <span>Add collaborators or assign tasks to continue</span>
          }
        </div>
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
