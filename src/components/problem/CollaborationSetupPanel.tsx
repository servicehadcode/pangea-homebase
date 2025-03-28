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
  MailCheck
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendCollaborationInvite } from '@/services/collaborationService';

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

  const handleInviteCollaborator = async () => {
    if (!collaboratorEmail || !collaboratorEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Ensure owner name is saved before sending invitation
    if (ownerName.trim() && ownerName !== localStorage.getItem('username')) {
      localStorage.setItem('username', ownerName);
      localStorage.setItem('inviterName', ownerName);
    }

    setIsInviting(true);
    
    try {
      const response = await sendCollaborationInvite(collaboratorEmail);
      
      if (response.success) {
        toast({
          title: "Invitation Sent",
          description: response.message,
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
      toast({
        title: "Error",
        description: "An error occurred while sending the invitation.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleSaveOwnerName = () => {
    if (ownerName.trim()) {
      localStorage.setItem('username', ownerName);
      localStorage.setItem('inviterName', ownerName);
      
      toast({
        title: "Name Saved",
        description: "Your name has been saved successfully.",
      });
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

    // Save the owner name if it's different from the stored one
    if (ownerName.trim() && ownerName !== localStorage.getItem('username')) {
      localStorage.setItem('username', ownerName);
      localStorage.setItem('inviterName', ownerName);
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
            />
            <Button 
              variant="outline"
              onClick={handleSaveOwnerName}
            >
              Save
            </Button>
          </div>
        </div>

        <Separator />

        <RadioGroup 
          value={mode} 
          onValueChange={(value: 'solo' | 'pair') => setMode(value)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="solo" id="solo" />
            <Label htmlFor="solo" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Solo Mode
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pair" id="pair" />
            <Label htmlFor="pair" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Mode
            </Label>
          </div>
        </RadioGroup>

        {mode === 'pair' && (
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
                  disabled={isInviting}
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
        >
          Continue to Subtasks
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CollaborationSetupPanel;