
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  useEffect(() => {
    // Scroll to top on initial load
    window.scrollTo(0, 0);
  }, []);

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-pangea" />,
      title: "Email",
      details: "contact@pangeaeducation.com",
      description: "For general inquiries and support",
    },
    {
      icon: <Phone className="h-6 w-6 text-pangea" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Monday-Friday, 9am-5pm EST",
    },
    {
      icon: <MapPin className="h-6 w-6 text-pangea" />,
      title: "Office",
      details: "San Francisco, CA",
      description: "Available for in-person meetings by appointment",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="pangea-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-pangea-light text-pangea-dark rounded-full animate-fade-in">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 animate-fade-up">Contact the Founders</h1>
            <p className="text-lg text-muted-foreground mt-4 animate-fade-up [animation-delay:200ms]">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-border text-center animate-fade-up [animation-delay:300ms]"
              >
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-pangea-light/70 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="font-medium text-pangea-dark">{item.details}</p>
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
