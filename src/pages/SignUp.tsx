import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UserDetailsForm } from '@/components/UserDetailsForm';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  
  useEffect(() => {
    // Scroll to top on initial load
    window.scrollTo(0, 0);
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    // Show the additional details form after successful signup
    setShowUserDetails(true);
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Welcome back! You've been successfully signed in.", {
      position: "bottom-right",
    });
    
    setIsLoading(false);
  };

  const handleDetailsSubmit = () => {
    toast.success("Account created successfully! Please check your email to verify your account.", {
      position: "bottom-right", 
    });
  };

  const handleSkip = () => {
    toast.success("Account created successfully! Please check your email to verify your account.", {
      position: "bottom-right", 
    });
    setShowUserDetails(false);
  };

  if (showUserDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-24 pb-16 bg-gradient-to-b from-pangea-light/30 to-background">
          <div className="pangea-container max-w-md mx-auto">
            <UserDetailsForm onSubmit={handleDetailsSubmit} onSkip={handleSkip} />
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 bg-gradient-to-b from-pangea-light/30 to-background">
        <div className="pangea-container max-w-md mx-auto">
          <Tabs defaultValue="signup" className="animate-fade-in">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signup" className="animate-fade-up">
              <Card className="border-0 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                  <CardDescription>
                    Enter your details below to create your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="John Doe" 
                          required 
                          className="border-border focus:border-pangea focus:ring-pangea"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="john@example.com" 
                          required 
                          className="border-border focus:border-pangea focus:ring-pangea"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          required 
                          className="border-border focus:border-pangea focus:ring-pangea"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" required />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <Link to="#" className="text-pangea hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link to="#" className="text-pangea hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                      
                      <Button className="pangea-button-primary w-full" type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                          </span>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button 
                      className="text-pangea hover:underline"
                      onClick={() => document.querySelector('[data-value="signin"]')?.click()}
                    >
                      Sign in
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="signin" className="animate-fade-up">
              <Card className="border-0 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                  <CardDescription>
                    Enter your credentials to sign in to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <Input 
                          id="signin-email" 
                          type="email" 
                          placeholder="john@example.com" 
                          required 
                          className="border-border focus:border-pangea focus:ring-pangea"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="signin-password">Password</Label>
                          <Link to="#" className="text-sm text-pangea hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <Input 
                          id="signin-password" 
                          type="password" 
                          placeholder="••••••••" 
                          required 
                          className="border-border focus:border-pangea focus:ring-pangea"
                        />
                      </div>
                      
                      <Button className="pangea-button-primary w-full" type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing In...
                          </span>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button 
                      className="text-pangea hover:underline"
                      onClick={() => document.querySelector('[data-value="signup"]')?.click()}
                    >
                      Sign up
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
