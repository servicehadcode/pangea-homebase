import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Code, 
  Database, 
  ChevronRight, 
  Plus, 
  BarChart,
  List,
  Clock,
  ExternalLink,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ProblemCard } from '@/components/ProblemCard';
import { SubmitProblemForm } from '@/components/SubmitProblemForm';
import { ProblemFilters } from '@/components/ProblemFilters';

const Problems = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('data-science');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const [dataScience, setDataScience] = useState([
    {
      id: 1,
      title: "Student Connection Channel Prediction",
      description: "Develop an AI model that takes in parameters about student connection and returns the most preferred channel to reach out to them.",
      difficulty: "Intermediate",
      tags: ["Machine Learning", "Data Preprocessing", "API Development"],
      steps: 5,
      isCompleted: false,
    },
    {
      id: 2,
      title: "Customer Churn Prediction",
      description: "Build a predictive model to identify customers who are likely to churn based on historical behavior data.",
      difficulty: "Advanced",
      tags: ["Classification", "Feature Engineering", "Model Deployment"],
      steps: 4,
      isCompleted: false,
    },
    {
      id: 3,
      title: "Data Visualization Dashboard",
      description: "Create an interactive dashboard to visualize key metrics from a dataset.",
      difficulty: "Beginner",
      tags: ["Data Visualization", "Dashboard", "Analytics"],
      steps: 3,
      isCompleted: false,
    },
  ]);

  const [softwareDev, setSoftwareDev] = useState([
    {
      id: 1,
      title: "E-commerce Product Recommendation System",
      description: "Design and implement a microservice-based product recommendation engine for an e-commerce platform.",
      difficulty: "Advanced",
      tags: ["Microservices", "Docker", "API Design"],
      steps: 6,
      isCompleted: false,
    },
    {
      id: 2,
      title: "Real-time Chat Application",
      description: "Build a scalable real-time chat application with user authentication and message persistence.",
      difficulty: "Intermediate",
      tags: ["WebSockets", "Authentication", "Database Design"],
      steps: 5,
      isCompleted: false,
    },
    {
      id: 3,
      title: "Responsive Portfolio Website",
      description: "Create a responsive portfolio website using modern web technologies.",
      difficulty: "Beginner",
      tags: ["HTML/CSS", "Responsive Design", "JavaScript"],
      steps: 4,
      isCompleted: false,
    },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const completedProblems = JSON.parse(localStorage.getItem('completedProblems') || '{}');
    
    if (Object.keys(completedProblems).length > 0) {
      setDataScience(prev => prev.map(problem => ({
        ...problem,
        isCompleted: completedProblems[`data-science-${problem.id}`] || false
      })));
      
      setSoftwareDev(prev => prev.map(problem => ({
        ...problem,
        isCompleted: completedProblems[`software-dev-${problem.id}`] || false
      })));
    }
  }, []);

  useEffect(() => {
    const completedProblems: Record<string, boolean> = {};
    
    dataScience.forEach(problem => {
      if (problem.isCompleted) {
        completedProblems[`data-science-${problem.id}`] = true;
      }
    });
    
    softwareDev.forEach(problem => {
      if (problem.isCompleted) {
        completedProblems[`software-dev-${problem.id}`] = true;
      }
    });
    
    localStorage.setItem('completedProblems', JSON.stringify(completedProblems));
  }, [dataScience, softwareDev]);

  const handleSubmitProblem = (data: any) => {
    toast({
      title: "Problem Submitted Successfully",
      description: "We'll review your problem within 48 hours and get back to you.",
      duration: 5000,
    });
    setShowSubmitForm(false);
  };

  const resetFilters = () => {
    setDifficultyFilter('all');
  };

  const filterProblems = (problems: any[]) => {
    if (difficultyFilter === 'all') {
      return problems;
    }
    return problems.filter(problem => problem.difficulty === difficultyFilter);
  };

  const filteredDataScience = filterProblems(dataScience);
  const filteredSoftwareDev = filterProblems(softwareDev);

  if (showSubmitForm) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-28 pb-16">
          <div className="pangea-container max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => setShowSubmitForm(false)}
            >
              ← Back to Problems
            </Button>
            <SubmitProblemForm onSubmit={handleSubmitProblem} onCancel={() => setShowSubmitForm(false)} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="pangea-container">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Industry Problems</h1>
            <p className="text-lg text-muted-foreground">
              Tackle real-world industry problems to gain experience and build your skills.
              Follow our step-by-step approach to solve complex challenges.
            </p>
          </div>

          <Tabs 
            defaultValue="data-science" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="max-w-5xl mx-auto animate-fade-up [animation-delay:200ms]"
          >
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="data-science" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Data Science</span>
                </TabsTrigger>
                <TabsTrigger value="software-dev" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span>Software Development</span>
                </TabsTrigger>
              </TabsList>
              
              <Button 
                onClick={() => setShowSubmitForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Submit Your Problem</span>
              </Button>
            </div>

            <ProblemFilters 
              difficulty={difficultyFilter}
              setDifficulty={setDifficultyFilter}
              onReset={resetFilters}
            />

            <TabsContent value="data-science" className="mt-6 space-y-6">
              {filteredDataScience.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No problems match your current filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredDataScience.map(problem => (
                    <ProblemCard key={problem.id} problem={problem} category="data-science" />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="software-dev" className="mt-6 space-y-6">
              {filteredSoftwareDev.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No problems match your current filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredSoftwareDev.map(problem => (
                    <ProblemCard key={problem.id} problem={problem} category="software-dev" />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-16 max-w-3xl mx-auto bg-pangea-light/30 p-8 rounded-lg border border-pangea/20 animate-fade-up [animation-delay:400ms]">
            <div className="flex items-start gap-4">
              <Clock className="h-12 w-12 text-pangea" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Need a Custom Problem?</h3>
                <p className="text-muted-foreground mb-4">
                  Have a specific challenge you'd like to tackle? Submit your own problem and our team will review and normalize it to our platform standards within 48 hours.
                </p>
                <Button 
                  onClick={() => setShowSubmitForm(true)}
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Submit Your Problem</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Problems;
