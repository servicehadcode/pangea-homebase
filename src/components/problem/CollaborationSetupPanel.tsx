
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CheckCircle, 
  UserPlus, 
  Users, 
  User,
  ChevronLeft,
  Loader2,
  MailCheck,
  Save
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendCollaborationInvite } from '@/services/collaborationService';
import { createProblemInstance, addCollaborator } from '@/services/problemService';

interface CollaborationSetupPanelProps {
  onComplete: (mode: 'solo' | 'pair') => void;
  onBack: () => void;
  problem: any;
}

const CollaborationSetupPanel: React.FC<CollaborationSetupPanelProps> = ({ onComplete, onBack, problem }) => {
  const { toast } = useToast();
  const [mode, setMode] = useState<'solo' | 'pair'>('solo');
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [ownerName, setOwnerName] = useState(localStorage.getItem('username') || 'You');
  const [isNameSaved, setIsNameSaved] = useState(false);
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [showCollaboratorSection, setShowCollaboratorSection] = useState(false);

  const handleInviteCollaborator = async () => {
    if (!collaboratorEmail || !collaboratorEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!instanceId) {
      toast({
        title: "Error",
        description: "Problem instance not created yet. Please save your name first.",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    
    try {
      // First send the email invitation
      const response = await sendCollaborationInvite(collaboratorEmail);
      
      if (response.success) {
        // Now add the collaborator to the problem instance
        const collaboratorResponse = await addCollaborator(instanceId, {
          userId: `user-${Date.now()}`, // Generate a unique ID (in real app, this would come from auth)
          username: collaboratorEmail.split('@')[0], // Use part of email as username
          email: collaboratorEmail
        });

        toast({
          title: "Invitation Sent",
          description: collaboratorResponse.message || "Collaborator added successfully",
        });
        
        setInvitedEmails([...invitedEmails, collaboratorEmail]);
        setCollaboratorEmail('');
      } else {
        toast({
          title: "Invitation Failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding collaborator:", error);
      toast({
        title: "Error",
        description: "An error occurred while sending the invitation or adding the collaborator.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleSaveOwnerName = async () => {
    if (!ownerName.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingInstance(true);

    try {
      // Save the name first
      localStorage.setItem('username', ownerName);
      localStorage.setItem('inviterName', ownerName);
      
      // Create problem instance in the database
      // Extract the problem number directly from the problem object
      const problemNum = problem.problem_num;
      
      console.log("Creating problem instance with problem number:", problemNum);
      
      const response = await createProblemInstance({
        problemNum: problemNum,
        owner: {
          userId: "user123", // In a real app, this would come from authentication
          username: ownerName,
          email: "user@example.com" // In a real app, this would come from authentication
        },
        collaborationMode: mode
      });

      setInstanceId(response.instanceId);
      setIsNameSaved(true);
      
      toast({
        title: "Name Saved",
        description: "Your name has been saved and problem instance created successfully.",
      });
      
      // Show collaborator section if team mode is selected
      if (mode === 'pair') {
        setShowCollaboratorSection(true);
      }
      
    } catch (error) {
      console.error("Error creating problem instance:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving your name and creating the problem instance.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingInstance(false);
    }
  };

  const handleContinue = () => {
    if (mode === 'pair' && invitedEmails.length === 0) {
      toast({
        title: "No Collaborators",
        description: "Please invite at least one collaborator or switch to solo mode.",
        variant: "destructive",
      });
      return;
    }

    // Additional check to ensure owner name is saved
    if (!isNameSaved) {
      toast({
        title: "Name Not Saved",
        description: "Please save your name before continuing.",
        variant: "destructive",
      });
      return;
    }

    onComplete(mode);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Collaboration Setup</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Overview
          </Button>
        </div>
        <CardDescription>
          Choose how you want to work on this problem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Your Name</Label>
          <div className="flex gap-2">
            <Input 
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Enter your name"
              disabled={isNameSaved}
            />
          </div>
        </div>

        <RadioGroup 
          value={mode} 
          onValueChange={(value: 'solo' | 'pair') => setMode(value)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="solo" id="solo" disabled={isNameSaved} />
            <Label htmlFor="solo" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Solo Mode
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pair" id="pair" disabled={isNameSaved} />
            <Label htmlFor="pair" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Mode
            </Label>
          </div>
        </RadioGroup>

        <div className="pt-2">
          <Button 
            variant="outline"
            onClick={handleSaveOwnerName}
            disabled={isCreatingInstance || isNameSaved}
            className="flex items-center gap-2 w-full"
          >
            {isCreatingInstance ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isNameSaved ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          {!isNameSaved && (
            <p className="text-sm text-amber-600 mt-2">
              *You must save your name before proceeding
            </p>
          )}
        </div>
        
        <Separator />

        {mode === 'pair' && showCollaboratorSection && (
          <>
            <div className="space-y-3">
              <Label>Invite Collaborators</Label>
              <div className="flex gap-2">
                <Input 
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  placeholder="Enter collaborator's email"
                  disabled={isInviting}
                />
                <Button 
                  onClick={handleInviteCollaborator}
                  disabled={isInviting || !collaboratorEmail}
                  className="flex items-center gap-1"
                >
                  {isInviting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Inviting...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Invite
                    </>
                  )}
                </Button>
              </div>

              {invitedEmails.length > 0 && (
                <div className="space-y-2">
                  <Label>Invited Collaborators:</Label>
                  {invitedEmails.map((email, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-md bg-muted"
                    >
                      <MailCheck className="h-4 w-4 text-green-500" />
                      <span>{email}</span>
                    </div>
                  ))}
                </div>
              )}

              <Alert>
                <AlertTitle>How collaboration works</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">
                    In collaboration mode, you'll be able to assign subtasks to specific team members.
                    Each collaborator will receive an email invitation with a link to join this problem.
                  </p>
                  <p>
                    As the problem owner, you can manage collaborators and track their progress.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <Button 
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        
        <Button 
          onClick={handleContinue}
          className="pangea-button-primary"
          disabled={!isNameSaved || (mode === 'pair' && showCollaboratorSection && invitedEmails.length === 0)}
        >
          Continue to Subtasks
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CollaborationSetupPanel;
