
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type InterviewModeProps = {
  onSelectMode: (mode: 'self' | 'professional') => void;
};

export const InterviewPreparationMode = ({ onSelectMode }: InterviewModeProps) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">Select Interview Mode</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">Self Supervised</CardTitle>
            <CardDescription>Practice at your own pace</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-muted-foreground text-sm mb-4">
              Practice interviews at your own pace with Pangea's AI infrastructure.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full pangea-button-primary" 
              onClick={() => onSelectMode('self')}
            >
              Start Self-Practice
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              Professional Supervised
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-800 ml-2">
                      BETA
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This feature is currently in beta.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>Live interviews with professionals</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-muted-foreground text-sm mb-4">
              Set up a live interview round with professionals. Available only on weekends.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full pangea-button-primary" 
              onClick={() => onSelectMode('professional')}
            >
              Book Professional Interview
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
