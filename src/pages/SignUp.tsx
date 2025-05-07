
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';

const SignUp = () => {
  const { user, logout } = useUser();
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGitHubAuth = () => {
    const currentPage = window.location.href;
    window.location.href = `${backendURL}/login/github?redirect=${encodeURIComponent(currentPage)}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    // Check if there's a return URL stored in localStorage
    if (user) {
      const returnUrl = localStorage.getItem('returnAfterLogin');
      if (returnUrl) {
        // Clear the stored URL
        localStorage.removeItem('returnAfterLogin');

        // Show a success toast
        toast({
          title: "Successfully Signed In",
          description: "You're now being redirected to continue.",
        });

        // Navigate to the stored URL
        navigate(returnUrl);
      }
    }
  }, [user, navigate, toast]);

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
