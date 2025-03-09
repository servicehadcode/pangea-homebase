
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="min-h-screen pt-28 pb-16 flex items-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-pangea-light/50 to-transparent z-0" 
        aria-hidden="true"
      />
      
      <div className="pangea-container relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-pangea-light text-pangea-dark rounded-full animate-fade-in">
              Educational Platform
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-up">
              Learn, Practice, <span className="text-pangea-dark">Succeed</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground animate-fade-up [animation-delay:200ms]">
            Pangea Education offers a comprehensive platform for students and professionals 
            to master technical concepts, practice real-world problems, and prepare for 
            technical interviews.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-up [animation-delay:400ms]">
            <Button className="pangea-button-primary w-full sm:w-auto" asChild>
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              className="pangea-button-secondary w-full sm:w-auto" 
              onClick={() => {
                const aboutSection = document.getElementById('about-section');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="mt-16 md:mt-24 relative animate-fade-in [animation-delay:600ms]">
          <div className="pangea-card relative overflow-hidden rounded-xl shadow-lg mx-auto max-w-4xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-pangea-dark/10 to-transparent z-0" aria-hidden="true" />
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3882&q=80" 
              alt="Pangea Education Platform" 
              className="w-full object-cover h-[300px] md:h-[400px] object-center" 
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 right-6 left-6 mx-auto max-w-2xl glassmorphism p-4 rounded-lg shadow-lg text-center">
            <p className="font-medium text-sm">Unlocking the world of knowledge through technology</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
