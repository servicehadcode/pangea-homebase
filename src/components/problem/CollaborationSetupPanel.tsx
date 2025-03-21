
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
        
        <div className="space-y-3">
          <Label>Working Mode</Label>
          <RadioGroup 
            value={mode} 
            onValueChange={(value) => setMode(value as 'solo' | 'pair')}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className={`border rounded-lg p-4 cursor-pointer ${mode === 'solo' ? 'border-pangea bg-pangea/5' : ''}`}>
              <div className="flex items-start gap-2">
                <RadioGroupItem value="solo" id="solo" className="mt-1" />
                <div>
                  <Label htmlFor="solo" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-5 w-5 text-pangea" />
                    <span className="font-medium">Solo Mode</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Work on this problem by yourself. You'll be responsible for all subtasks.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`border rounded-lg p-4 cursor-pointer ${mode === 'pair' ? 'border-pangea bg-pangea/5' : ''}`}>
              <div className="flex items-start gap-2">
                <RadioGroupItem value="pair" id="pair" className="mt-1" />
                <div>
                  <Label htmlFor="pair" className="flex items-center gap-2 cursor-pointer">
                    <Users className="h-5 w-5 text-pangea" />
                    <span className="font-medium">Collaboration Mode</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Work on this problem with team members. Assign subtasks to collaborators.
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {mode === 'pair' && (
          <>
            <Separator />
            
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
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Invited Collaborators</h4>
                  {invitedEmails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                      <MailCheck className="h-4 w-4 text-green-500" />
                      <span>{email}</span>
                      <Badge className="ml-auto">Invited</Badge>
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
          className="pangea-button-primary"
          onClick={handleContinue}
        >
          Continue to Subtasks
        </Button>
      </CardFooter>
    </Card>
  );
};

// Add the Badge component that was missing
const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <span className={`bg-green-100 text-green-800 text-xs py-1 px-2 rounded ${className}`}>
    {children}
  </span>
);

export default CollaborationSetupPanel;
