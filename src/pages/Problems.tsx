
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
  Upload,
  Loader2
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
import { getAllProblems } from '@/services/problemService';

const Problems = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('data-science');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const [problems, setProblems] = useState<Record<string, any[]>>({
    'data-science': [],
    'software-dev': []
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        const [dataScience, softwareDev] = await Promise.all([
          getAllProblems('data-science'),
          getAllProblems('software-dev')
        ]);

        // Transform API data to match existing structure
        const transformProblems = (apiProblems: any[]) => 
          apiProblems.map(p => ({
            id: p.problem_num,
            title: p.title,
            description: p.description,
            difficulty: p.difficulty,
            tags: p.tags,
            steps: p.steps.length,
            isCompleted: false
          }));

        const transformedProblems = {
          'data-science': transformProblems(dataScience),
          'software-dev': transformProblems(softwareDev)
        };

        // Apply completed status from localStorage
        const completedProblems = JSON.parse(localStorage.getItem('completedProblems') || '{}');
        
        if (Object.keys(completedProblems).length > 0) {
          Object.keys(transformedProblems).forEach(category => {
            transformedProblems[category] = transformedProblems[category].map(problem => ({
              ...problem,
              isCompleted: completedProblems[`${category}-${problem.id}`] || false
            }));
          });
        }
        
        setProblems(transformedProblems);
      } catch (error) {
        console.error('Error fetching problems:', error);
        toast({
          title: "Error",
          description: "Failed to load problems. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProblems();
  }, [toast]);

  useEffect(() => {
    const completedProblems: Record<string, boolean> = {};
    
    Object.entries(problems).forEach(([category, categoryProblems]) => {
      categoryProblems.forEach(problem => {
        if (problem.isCompleted) {
          completedProblems[`${category}-${problem.id}`] = true;
        }
      });
    });
    
    localStorage.setItem('completedProblems', JSON.stringify(completedProblems));
  }, [problems]);

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

  const filteredDataScience = filterProblems(problems['data-science'] || []);
  const filteredSoftwareDev = filterProblems(problems['software-dev'] || []);

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

            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading problems...</span>
              </div>
            ) : (
              <>
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
              </>
            )}
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
