
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Message sent successfully! We'll get back to you soon.", {
      position: "bottom-right",
    });
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up [animation-delay:200ms]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="border-border focus:border-pangea focus:ring-pangea"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="border-border focus:border-pangea focus:ring-pangea"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="How can we help you?"
          value={formData.subject}
          onChange={handleChange}
          required
          className="border-border focus:border-pangea focus:ring-pangea"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Please provide details about your inquiry..."
          value={formData.message}
          onChange={handleChange}
          required
          className="min-h-[150px] border-border focus:border-pangea focus:ring-pangea"
        />
      </div>
      
      <Button className="pangea-button-primary w-full" type="submit" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending Message...
          </span>
        ) : (
          <span className="flex items-center">
            Send Message <Send className="ml-2 h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
};

export default ContactForm;
