
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: 'Interview Prep', href: '/interview-prep' },
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

              <Button
                className={cn(
                  "ml-3 pangea-button-primary animate-fade-in [animation-delay:700ms]",
                )}
                asChild
              >
                <Link to="/signup">Sign Up / Sign In</Link>
              </Button>
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
              <Button className="w-full pangea-button-primary" asChild>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up / Sign In
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
