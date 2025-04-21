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
  Copy
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendCollaborationInvite } from '@/services/collaborationService';
import { createProblemInstance, addCollaborator, getProblemInstance, updateProblemInstanceCollaboration, ProblemInstance } from '@/services/problemService';
import { v4 as uuidv4 } from 'uuid';
import { getProblemById, setupGitBranch } from '@/services/problemService';

interface CollaborationSetupPanelProps {
  onComplete: (mode: 'solo' | 'pair') => void;
  onBack: () => void;
  problem: any;
}

const CollaborationSetupPanel: React.FC<CollaborationSetupPanelProps> = ({ 
  onComplete, 
  onBack, 
  problem 
}) => {
  const { toast } = useToast();
  const [mode, setMode] = useState<'solo' | 'pair'>('solo');
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [ownerName, setOwnerName] = useState(localStorage.getItem('username') || '');
  const [gitUsername, setGitUsername] = useState('');
  const [isNameSaved, setIsNameSaved] = useState(false);
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [showCollaboratorSection, setShowCollaboratorSection] = useState(false);
  const [isLoadingInstance, setIsLoadingInstance] = useState(true);
  const [existingInstance, setExistingInstance] = useState<ProblemInstance | null>(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [isSettingUpGit, setIsSettingUpGit] = useState(false);
  const [gitCommandUI, setGitCommandUI] = useState<{ command: string } | null>(null);

  const getProblemNumber = () => {
    if (!problem) return null;
    
    if (problem.problem_num) {
      return String(problem.problem_num);
    }
    
    return problem.id ? String(problem.id) : null;
  };

  useEffect(() => {
    const fetchExistingInstance = async () => {
      try {
        const problemNum = getProblemNumber();
        
        if (!problemNum) {
          console.error("Problem number missing");
          setIsLoadingInstance(false);
          return;
        }
        
        let currentUserId = localStorage.getItem('userId');
        if (!currentUserId) {
          currentUserId = uuidv4();
          localStorage.setItem('userId', currentUserId);
          setUserId(currentUserId);
        }
        
        try {
          const instance = await getProblemInstance(problemNum, currentUserId);
          
          if (instance && instance._id) {
            console.log("Found existing instance:", instance);
            setExistingInstance(instance);
            setInstanceId(instance._id);
            localStorage.setItem(`problemInstance_${problemNum}`, instance._id);
            setMode(instance.collaborationMode || 'solo');
            setIsNameSaved(true);
            setOwnerName(instance.owner.username);
            setGitUsername(instance.owner.gitUsername || instance.gitUsername || '');
            
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
            console.log("No existing instance found for this problem and user");
            setExistingInstance(null);
            setInstanceId(null);
            setIsNameSaved(false);
            setOwnerName(localStorage.getItem('username') || '');
            setGitUsername('');
          }
        } catch (error: any) {
          console.log("Error or no instance found:", error);
          setExistingInstance(null);
          setInstanceId(null);
          setIsNameSaved(false);
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
        description: "Problem instance not created yet. Please save your settings first.",
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
    
    if (!gitUsername.trim()) {
      toast({
        title: "Invalid GitHub Username",
        description: "Please enter a valid GitHub username.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingInstance(true);

    try {
      localStorage.setItem('username', ownerName);
      localStorage.setItem('inviterName', ownerName);
      
      const problemNum = getProblemNumber();
      
      if (!problemNum) {
        throw new Error('Problem number is missing or invalid');
      }

      if (existingInstance && instanceId) {
        console.log("Updating existing instance:", instanceId);
        
        const response = await updateProblemInstanceCollaboration(instanceId, mode);
        
        if (response) {
          toast({
            title: "Settings Updated",
            description: "Your collaboration settings have been updated successfully.",
          });
          
          setMode(mode);
          setShowCollaboratorSection(mode === 'pair');
        }
      } else {
        let currentUserId = userId;
        if (!currentUserId) {
          currentUserId = uuidv4();
          localStorage.setItem('userId', currentUserId);
          setUserId(currentUserId);
        }

        const instanceData: ProblemInstance = {
          problemNum,
          owner: {
            userId: currentUserId,
            username: ownerName,
            email: "john@example.com",
            gitUsername: gitUsername
          },
          collaborationMode: mode,
          status: 'in-progress',
        };
        
        console.log("Creating new problem instance:", instanceData);
        
        const response = await createProblemInstance(instanceData);
        
        if ('instanceId' in response) {
          const newInstanceId = response.instanceId;
          setInstanceId(newInstanceId);
          localStorage.setItem(`problemInstance_${problemNum}`, newInstanceId);
          console.log("Created new instance:", response);
          
          toast({
            title: "Settings Saved",
            description: "Your settings have been saved successfully.",
          });
          
          setIsNameSaved(true);
        } else {
          throw new Error('Failed to create instance: No instanceId returned');
        }
      }

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

  const handleContinue = async () => {
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

    try {
      setIsSettingUpGit(true);

      const problemNum = getProblemNumber();
      const problemDetails = await getProblemById(problemNum || '');
      const repoUrl = problemDetails.metadata?.gitRepo;

      if (!repoUrl) {
        onComplete(mode);
        return;
      }

      if (!gitUsername) {
        toast({
          title: "GitHub Username Required",
          description: "Please save your GitHub username before proceeding.",
          variant: "destructive",
        });
        return;
      }

      const branchSetupRequest = {
        repoUrl,
        username: gitUsername,
        branchOff: 'main',
        branchTo: `${gitUsername}-main`
      };

      const result = await setupGitBranch(branchSetupRequest);

      if (result.gitCommands && result.gitCommands.length > 0) {
        setGitCommandUI({ command: result.gitCommands[0] });
        setIsSettingUpGit(false);
        return;
      }

      toast({
        title: "Git Setup Success",
        description: result.message,
      });

      onComplete(mode);
    } catch (error: any) {
      toast({
        title: "Git Setup Failed",
        description: error.message || "Failed to setup git branch. Please try again.",
        variant: "destructive",
      });
      onComplete(mode);
    } finally {
      setIsSettingUpGit(false);
    }
  };

  const handleCopyGitCommand = async () => {
    if (gitCommandUI?.command) {
      try {
        await navigator.clipboard.writeText(gitCommandUI.command);
        toast({
          title: "Copied!",
          description: "Git command has been copied to clipboard.",
        });
      } catch {
        toast({
          title: "Copy Failed",
          description: "Could not copy command to clipboard.",
          variant: "destructive"
        });
      }
      setGitCommandUI(null);
      onComplete(mode);
    }
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

  if (gitCommandUI) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-14">
          <h2 className="text-2xl font-bold mb-2">Git Branch Setup Command</h2>
          <p className="mb-6 text-muted-foreground text-center max-w-md">
            To start working on your branch, run the following command in your terminal.<br />
            <span className="text-blue-600 font-bold">Click the copy icon to copy, then you'll be taken to the next step.</span>
          </p>
          <div className="relative w-full max-w-xl flex">
            <div className="flex-1 bg-secondary/40 p-3 rounded font-mono text-base break-all border border-secondary pr-12 select-all">
              {gitCommandUI.command}
            </div>
            <Button
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={handleCopyGitCommand}
              aria-label="Copy command"
            >
              <Copy className="h-6 w-6" />
            </Button>
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
            disabled={isCreatingInstance || isNameSaved}
            className={isNameSaved ? "bg-gray-100" : ""}
          />
        </div>

        <div className="space-y-3">
          <Label>Your GitHub Username</Label>
          <Input 
            value={gitUsername}
            onChange={(e) => setGitUsername(e.target.value)}
            placeholder="Enter your GitHub username"
            disabled={isCreatingInstance || existingInstance !== null || isNameSaved}
            className={isNameSaved || existingInstance ? "bg-gray-100" : ""}
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
                {isNameSaved ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isNameSaved ? "Update Settings" : "Save Settings"}
              </>
            )}
          </Button>
        </div>
        
        {!isNameSaved && (
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
          disabled={!isNameSaved || (mode === 'pair' && showCollaboratorSection && invitedEmails.length === 0) || isSettingUpGit}
        >
          {isSettingUpGit ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Setting up Git...
            </>
          ) : (
            'Continue to Subtasks'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CollaborationSetupPanel;
