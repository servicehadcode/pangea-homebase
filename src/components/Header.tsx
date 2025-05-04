
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isMobile = useIsMobile();
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch(`${backendURL}/me`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    })
      .then((res) => {
        console.log('Header: Me endpoint response status:', res.status);
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => {
        console.log('Header: User authenticated:', data);
        setUser(data);
      })
      .catch((err) => {
        console.log('Header: User not authenticated', err.message);
        setUser(null);
      });
  }, [backendURL]);

  const handleLogin = () => {
    try {
      const currentUrl = window.location.href;
      window.location.href = `${backendURL}/login/github?redirect=${encodeURIComponent(currentUrl)}`;
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
      const response = await fetch(`${backendURL}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        setUser(null);
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out."
        });
        window.location.href = '/';
      } else {
        throw new Error('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { name: 'About', href: '#about-section', onClick: scrollToAbout },
    { name: 'Problems', href: '/problems' },
    { name: 'Interview Preparation', href: '/interview-prep' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="pangea-container">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold text-pangea-dark"
          >
            <span className="animate-fade-in">Pangea Education</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className={cn(
                    "text-base font-medium hover:text-pangea hover:bg-pangea-light/50",
                    `animate-fade-in [animation-delay:${200 + index * 100}ms]`
                  )}
                >
                  {item.onClick ? (
                    <a href={item.href} onClick={item.onClick}>
                      {item.name}
                    </a>
                  ) : (
                    <Link to={item.href}>{item.name}</Link>
                  )}
                </Button>
              ))}

              {user ? (
                <div className="flex items-center gap-4 ml-3 animate-fade-in [animation-delay:700ms]">
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                  <span>{user.username}</span>
                  <Button variant="ghost" onClick={handleLogout}>Logout</Button>
                </div>
              ) : (
                <Button
                  className="ml-3 pangea-button-primary animate-fade-in [animation-delay:700ms]"
                  onClick={handleLogin}
                >
                  Sign Up / Sign In
                </Button>
              )}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobile && mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-3 px-2 rounded-lg glassmorphism animate-scale-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start text-base font-medium"
                  asChild
                >
                  {item.onClick ? (
                    <a href={item.href} onClick={item.onClick}>
                      {item.name}
                    </a>
                  ) : (
                    <Link to={item.href} onClick={() => setMobileMenuOpen(false)}>
                      {item.name}
                    </Link>
                  )}
                </Button>
              ))}

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2">
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                    <span>{user.username}</span>
                  </div>
                  <Button className="w-full" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <Button className="w-full pangea-button-primary" onClick={handleLogin}>
                  Sign Up / Sign In
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
