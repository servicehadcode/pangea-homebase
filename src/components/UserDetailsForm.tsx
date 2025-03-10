
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Briefcase, Code, GraduationCap, Link as LinkIcon, Plus, User } from 'lucide-react';

interface UserDetailsFormProps {
  onSubmit: () => void;
  onSkip: () => void;
}

export const UserDetailsForm = ({ onSubmit, onSkip }: UserDetailsFormProps) => {
  const [formData, setFormData] = useState({
    role: '',
    education: '',
    skills: '',
    experience: '',
    urls: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    onSubmit();
  };

  return (
    <Card className="border-0 shadow-lg animate-fade-up">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Tell us more about yourself</CardTitle>
        <CardDescription>
          These details are optional and will help us personalize your experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Role
            </Label>
            <Input
              id="role"
              name="role"
              placeholder="e.g. Software Engineer, Student, Data Scientist"
              value={formData.role}
              onChange={handleChange}
              className="border-border focus:border-pangea focus:ring-pangea"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </Label>
            <Input
              id="education"
              name="education"
              placeholder="e.g. BSc Computer Science, University of XYZ"
              value={formData.education}
              onChange={handleChange}
              className="border-border focus:border-pangea focus:ring-pangea"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skills" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Skills
            </Label>
            <Textarea
              id="skills"
              name="skills"
              placeholder="e.g. JavaScript, Python, React, Machine Learning"
              value={formData.skills}
              onChange={handleChange}
              className="border-border focus:border-pangea focus:ring-pangea min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Experience
            </Label>
            <Textarea
              id="experience"
              name="experience"
              placeholder="e.g. 2 years at Company X working on Project Y"
              value={formData.experience}
              onChange={handleChange}
              className="border-border focus:border-pangea focus:ring-pangea min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="urls" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              URLs
            </Label>
            <Textarea
              id="urls"
              name="urls"
              placeholder="e.g. GitHub, LinkedIn, Portfolio (one URL per line)"
              value={formData.urls}
              onChange={handleChange}
              className="border-border focus:border-pangea focus:ring-pangea min-h-[80px]"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 gap-2" 
              onClick={onSkip}
            >
              Skip
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              type="submit" 
              className="pangea-button-primary flex-1 gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <>
                  Complete Profile
                  <Plus className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
