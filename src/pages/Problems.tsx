
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Problems = () => {
  useEffect(() => {
    // Scroll to top on initial load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16 flex items-center justify-center">
        <div className="pangea-container max-w-3xl mx-auto text-center">
          <div className="animate-fade-in space-y-6">
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-pangea-light text-pangea-dark">
              <Construction className="h-10 w-10" />
            </div>
            
            <h1 className="text-4xl font-bold">Problems Section</h1>
            
            <div className="p-8 bg-secondary/30 rounded-xl shadow-sm animate-fade-up [animation-delay:200ms]">
              <p className="text-lg text-muted-foreground mb-6">
                We're hard at work building a comprehensive collection of practice problems to help you enhance your skills. 
                This section will feature challenges ranging from beginner to advanced levels across various domains of computer science.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="pangea-button-primary w-full sm:w-auto" asChild>
                  <Link to="/">
                    Return to Home
                  </Link>
                </Button>
                <Button className="pangea-button-secondary w-full sm:w-auto" asChild>
                  <Link to="/contact">
                    Suggest a Problem
                  </Link>
                </Button>
              </div>
            </div>
            
            <p className="text-muted-foreground animate-fade-up [animation-delay:400ms]">
              Coming soon! Please check back later for updates.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Problems;
