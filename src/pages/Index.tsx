
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the about section if the URL contains the hash
    if (location.hash === '#about-section') {
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Scroll to top on initial load
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
