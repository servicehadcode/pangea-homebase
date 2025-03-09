
import { CheckCircle, Code, BookOpen, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: <BookOpen className="h-10 w-10 text-pangea" />,
    title: "Structured Learning",
    description: "Access curated educational content designed by experienced educators and industry professionals.",
  },
  {
    icon: <Code className="h-10 w-10 text-pangea" />,
    title: "Practical Problems",
    description: "Tackle real-world coding challenges that reinforce concepts and prepare you for technical interviews.",
  },
  {
    icon: <Compass className="h-10 w-10 text-pangea" />,
    title: "Career Guidance",
    description: "Get personalized guidance on navigating the tech industry and advancing your career.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-pangea" />,
    title: "Interview Preparation",
    description: "Practice with simulated interviews and receive constructive feedback to improve your performance.",
  },
];

const About = () => {
  return (
    <section id="about-section" className="pangea-section bg-secondary/30">
      <div className="pangea-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-pangea-light text-pangea-dark rounded-full">
            About Us
          </span>
          <h2 className="pangea-section-title mt-2">Transforming Education</h2>
          <p className="text-lg text-muted-foreground">
            Pangea Education was founded with a mission to make quality technical education accessible 
            to everyone, everywhere. We believe in empowering learners with practical knowledge 
            and skills that matter in the real world.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up [animation-delay:200ms]">
              <CardContent className="p-6 flex flex-col items-start">
                <div className="mb-4 p-2 bg-pangea-light/50 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-md animate-fade-up [animation-delay:300ms]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 space-y-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-pangea-light text-pangea-dark rounded-full">
                Our Vision
              </span>
              <h3 className="text-2xl md:text-3xl font-bold">Empowering the next generation of technology leaders</h3>
              <p className="text-muted-foreground">
                At Pangea Education, we're building more than just a learning platform. We're creating a community 
                of lifelong learners who support each other's growth. Our comprehensive approach combines structured learning, 
                practical application, and industry insights to give you the edge in your technical journey.
              </p>
              <Button className="pangea-button-primary" asChild>
                <Link to="/signup">Join Our Community</Link>
              </Button>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80" 
                alt="Pangea Education Team" 
                className="rounded-lg shadow-md w-full object-cover h-64" 
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
