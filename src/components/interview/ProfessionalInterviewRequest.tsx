
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, CalendarIcon, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  getAvailableTimeSlots, 
  scheduleInterview,
  InterviewTimeSlot,
  InterviewRequestData
} from '@/services/interviewService';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  date: z.date({ required_error: 'Please select a date' }),
  timeSlot: z.string({ required_error: 'Please select a time slot' }),
});

type FormValues = z.infer<typeof formSchema>;

type ProfessionalInterviewRequestProps = {
  onGoBack: () => void;
};

export const ProfessionalInterviewRequest = ({ onGoBack }: ProfessionalInterviewRequestProps) => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSlots, setTimeSlots] = useState<InterviewTimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });
  
  // Only allow weekends (Saturday and Sunday)
  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 is Sunday, 6 is Saturday
  };
  
  const selectedDate = form.watch('date');
  
  // Load available time slots when the component mounts
  useEffect(() => {
    const loadTimeSlots = async () => {
      setIsLoading(true);
      try {
        const slots = await getAvailableTimeSlots();
        setTimeSlots(slots);
      } catch (error) {
        console.error("Error loading time slots:", error);
        toast({
          title: "Error",
          description: "Failed to load available time slots",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTimeSlots();
  }, [toast]);
  
  const getAvailableTimeSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return timeSlots
      .filter(slot => slot.date === dateStr && !slot.isBooked)
      .map(slot => slot.time);
  };
  
  const availableTimeSlots = selectedDate ? getAvailableTimeSlotsForDate(selectedDate) : [];
  
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Call the scheduling service
      const success = await scheduleInterview(data as InterviewRequestData);
      
      if (success) {
        toast({
          title: "Interview Request Submitted",
          description: `Your interview is scheduled for ${format(data.date, 'EEEE, MMMM d')} at ${data.timeSlot}`,
        });
        
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast({
        title: "Submission Error",
        description: "Failed to schedule your interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="animate-fade-in text-center py-8">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">Interview Request Submitted</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We've received your request for a professional interview. You'll receive a confirmation email shortly.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={onGoBack}>
            Return to Selection
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={onGoBack} 
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Selection
      </Button>
      
      <h2 className="text-2xl font-bold mb-6">Request Professional Interview</h2>
      <p className="text-muted-foreground mb-6">
        Fill out the form below to schedule a 30-minute interview with one of our professionals.
        Professional interviews are available on weekends only.
      </p>
      
      <div className="bg-muted/20 p-6 rounded-md mb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Interview Date (Weekends Only)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isWeekday}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Professional interviews are available on weekends only.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedDate && (
              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Time Slot (30-minute sessions)</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
                      >
                        {availableTimeSlots.length > 0 ? (
                          availableTimeSlots.map((slot) => (
                            <FormItem key={slot} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={slot} />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {slot}
                              </FormLabel>
                            </FormItem>
                          ))
                        ) : (
                          <div className="col-span-full text-muted-foreground">
                            No available time slots for this date. Please select another date.
                          </div>
                        )}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button 
              type="submit" 
              className="pangea-button-primary w-full"
              disabled={!selectedDate || availableTimeSlots.length === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
