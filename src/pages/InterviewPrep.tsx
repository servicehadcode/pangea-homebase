
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { 
  User, Mail, Briefcase, Calendar, Clock, FileText, 
  Send, Plus, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const InterviewPrep = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');
  const [files, setFiles] = useState<FileList | null>(null);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  // Only allow Saturdays and Sundays
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !date || !time) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Interview request submitted!",
        description: "We'll contact you soon to confirm your interview.",
      });

      // Reset form
      setName('');
      setEmail('');
      setRole('');
      setJobDescription('');
      setAdditionalInfo('');
      setDate(undefined);
      setTime('');
      setFiles(null);
      
    } catch (error) {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Scroll to top on initial load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="pangea-container max-w-4xl mx-auto">
          <div className="animate-fade-in space-y-6">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4">Request an Interview</h1>
              <p className="text-lg text-muted-foreground">
                Complete the form below to schedule a mock interview with our experts
              </p>
            </div>
            
            <Card className="border shadow-md animate-fade-up">
              <CardHeader>
                <CardTitle>Interview Request</CardTitle>
                <CardDescription>
                  Fill in your details and preferred time slot. We conduct interviews on weekends only.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Job Information */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-medium">Job Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Target Job Role <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="role" 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Software Engineer, Data Scientist"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jobDescription" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Job Description
                      </Label>
                      <Textarea 
                        id="jobDescription" 
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here (optional)"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  
                  {/* Schedule */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-medium">Preferred Schedule</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Preferred Date <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date (weekends only)</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={isWeekend}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Preferred Time <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select a time slot</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-medium">Additional Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additional" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Additional Details
                      </Label>
                      <Textarea 
                        id="additional" 
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder="Any specific topics or questions you'd like to focus on"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resume" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Attachments (Resume, etc.)
                      </Label>
                      <Input 
                        id="resume" 
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload your resume, portfolio, or other relevant documents.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="pangea-button-primary w-full mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Interview Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InterviewPrep;
