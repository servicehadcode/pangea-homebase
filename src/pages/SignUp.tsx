
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const SignUp = () => {
  const [user, setUser] = useState<any>(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const { toast } = useToast();

  const handleGitHubAuth = () => {
    try {
      // Store current URL in localStorage to ensure we can get back here
      localStorage.setItem('authRedirectURL', window.location.href);
      // Using SameSite=None and secure cookies requires HTTPS
      window.location.href = `${backendURL}/login/github?redirect=${encodeURIComponent(window.location.href)}`;
    } catch (err) {
      console.error('GitHub auth error:', err);
      toast({
        title: "Authentication Error",
        description: "Failed to initiate GitHub login. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${backendURL}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      setUser(null);
      // Clear any stored auth data
      sessionStorage.removeItem('userSession');
      localStorage.removeItem('authRedirectURL');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      window.location.href = '/'; // Redirect to home
    } catch (err) {
      console.error('Logout error:', err);
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    // Check if we just completed authentication
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    
    if (authSuccess === 'true') {
      console.log('Auth success parameter detected');
      // Remove the auth_success parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Fetch user details if already logged in
    fetch(`${backendURL}/me`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    })
      .then((res) => {
        console.log('Me endpoint response:', res.status);
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => {
        console.log('User authenticated:', data);
        setUser(data);
        // Store user data in sessionStorage for other components
        sessionStorage.setItem('userSession', JSON.stringify(data));
      })
      .catch((err) => {
        console.error('Error fetching user info:', err);
      });
  }, [backendURL]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 bg-gradient-to-b from-pangea-light/30 to-background">
        <div className="pangea-container max-w-md mx-auto text-center">
          {user ? (
            <>
              <img
                src={user.avatar}
                alt="avatar"
                className="mx-auto rounded-full w-16 h-16 mb-2"
              />
              <h1 className="text-2xl font-bold mb-1">Welcome, {user.username}!</h1>
              <p className="text-muted-foreground mb-6">{user.email}</p>
              <Button
                className="pangea-button-secondary w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">Sign In / Sign Up</h1>
              <p className="mb-6 text-muted-foreground">
                Use your GitHub account to sign in or sign up.
              </p>
              <Button
                className="pangea-button-primary w-full flex items-center justify-center gap-2"
                onClick={handleGitHubAuth}
              >
                Sign in with GitHub
              </Button>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
