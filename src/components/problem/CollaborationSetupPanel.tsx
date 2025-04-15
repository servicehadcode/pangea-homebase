import React, { useState, useEffect } from 'react';
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
  Save,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendCollaborationInvite } from '@/services/collaborationService';
import { createProblemInstance, addCollaborator, getProblemInstance, ProblemInstance } from '@/services/problemService';

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
  const [isLoadingInstance, setIsLoadingInstance] = useState(true);
  const [existingInstance, setExistingInstance] = useState<ProblemInstance | null>(null);
  
  const mockUserId = "user123";

  useEffect(() => {
    const fetchExistingInstance = async () => {
      try {
        console.log("Problem object:", problem);
        console.log("Problem num:", problem?.problem_num);
        console.log("Problem id:", problem?.id);
        
        const problemNum = String(problem?.problem_num || problem?.id);
        
        console.log("Extracted problem number:", problemNum);
        
        if (!problemNum) {
          console.error("Problem number missing");
          setIsLoadingInstance(false);
          return;
        }
        
        console.log("Checking for existing instance with problem number:", problemNum);
        
        try {
          const instance = await getProblemInstance(problemNum, mockUserId);
          
          if (instance && instance._id) {
            console.log("Found existing instance:", instance);
            setExistingInstance(instance);
            setInstanceId(instance._id);
            setMode(instance.collaborationMode || 'solo');
            setIsNameSaved(true);
            setOwnerName(instance.owner.username);
            
            if (instance.collaborationMode === 'pair') {
              setShowCollaboratorSection(true);
              const emails = (instance.collaborators || [])
                .map(collab => collab.email)
                .filter(Boolean);
              setInvitedEmails(emails);
            }
            
            toast({
              title: "Previous Work Found",
              description: "We found your previous work on this problem",
            });
          } else {
            setExistingInstance(null);
            setInstanceId(null);
            console.log("No existing instance found for this problem and user");
          }
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            console.log("No existing instance found - new problem");
            setExistingInstance(null);
            setInstanceId(null);
          } else {
            console.error("Error checking for existing instance:", error);
          }
        }
      } catch (error) {
        console.error("Error in fetchExistingInstance:", error);
      } finally {
        setIsLoadingInstance(false);
      }
    };
    
    fetchExistingInstance();
  }, [problem, toast]);

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
      const response = await sendCollaborationInvite(collaboratorEmail);
      
      if (response.success) {
        const collaboratorResponse = await addCollaborator(instanceId, {
          userId: `user-${Date.now()}`,
          username: collaboratorEmail.split('@')[0],
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
      localStorage.setItem('username', ownerName);
      localStorage.setItem('inviterName', ownerName);
      
      const problemNum = String(problem?.problem_num || problem?.id);
      
      if (!problemNum) {
        throw new Error('Problem number is missing or invalid');
      }

      console.log("Creating/updating problem instance with problem number:", problemNum);
      
      const instanceData: ProblemInstance = {
        problemNum,
        owner: {
          userId: mockUserId,
          username: ownerName,
          email: "user@example.com"
        },
        collaborationMode: mode,
        status: existingInstance?.status || 'in-progress'
      };
      
      let response;
      if (existingInstance && instanceId) {
        response = await fetch(`http://localhost:5000/api/problem-instances/${instanceId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            collaborationMode: mode,
            status: instanceData.status
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update instance. Status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Updated instance:", result);
      } else {
        response = await createProblemInstance(instanceData);
        
        if (!response.ok && 'status' in response) {
          throw new Error(`Failed to create instance. Status: ${response.status}`);
        }
        
        const result = await response.json();
        setInstanceId(result.instanceId);
        console.log("Created new instance:", result);
      }

      setIsNameSaved(true);
      
      toast({
        title: existingInstance ? "Settings Updated" : "Settings Saved",
        description: existingInstance 
          ? "Your collaboration settings have been updated successfully." 
          : "Your settings have been saved successfully.",
      });
      
      if (mode === 'pair') {
        setShowCollaboratorSection(true);
      } else {
        setShowCollaboratorSection(false);
      }
      
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving your settings.",
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

    if (!isNameSaved) {
      toast({
        title: "Name Not Saved",
        description: "Please save your name before proceeding.",
        variant: "destructive",
      });
      return;
    }

    onComplete(mode);
  };

  if (isLoadingInstance) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Loading your progress...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {existingInstance && existingInstance.startedAt 
            ? `Update your collaboration settings for this problem (Started on ${new Date(existingInstance.startedAt).toLocaleDateString()})`
            : "Choose how you want to work on this problem and set up your collaboration preferences"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {existingInstance && existingInstance.startedAt && (
          <Alert>
            <AlertTitle>Previous work found</AlertTitle>
            <AlertDescription>
              You started working on this problem on {new Date(existingInstance.startedAt).toLocaleDateString()}. 
              You can update your collaboration mode below.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-3">
          <Label>Your Name</Label>
          <Input 
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Enter your name"
            disabled={isCreatingInstance || existingInstance !== null}
            className={existingInstance ? "bg-gray-100" : ""}
          />
        </div>

        <RadioGroup 
          value={mode} 
          onValueChange={(value: 'solo' | 'pair') => setMode(value)}
          className="space-y-4"
          disabled={isCreatingInstance}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="solo" id="solo" disabled={isCreatingInstance} />
            <Label htmlFor="solo" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Solo Mode
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pair" id="pair" disabled={isCreatingInstance} />
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
            disabled={isCreatingInstance}
            className="flex items-center gap-2 w-full"
          >
            {isCreatingInstance ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {existingInstance ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {existingInstance ? "Update Settings" : "Save Settings"}
              </>
            )}
          </Button>
        </div>
        
        {!isNameSaved && !existingInstance && (
          <p className="text-sm text-amber-600 mt-2">
            *You must save your settings before proceeding
          </p>
        )}
        
        <Separator />

        {mode === 'pair' && (isNameSaved || showCollaboratorSection) && (
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
          disabled={!isNameSaved && !existingInstance || (mode === 'pair' && showCollaboratorSection && invitedEmails.length === 0)}
        >
          Continue to Subtasks
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CollaborationSetupPanel;
