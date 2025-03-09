
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="pangea-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold transition hover:opacity-80">
              Pangea Education
            </Link>
            <p className="text-primary-foreground/70 text-sm">
              Empowering learners with the knowledge and skills to succeed in the tech industry.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-foreground/70 hover:text-primary-foreground transition"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-foreground/70 hover:text-primary-foreground transition"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-foreground/70 hover:text-primary-foreground transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@pangeaeducation.com" 
                className="text-primary-foreground/70 hover:text-primary-foreground transition"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/problems" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Problems
                </Link>
              </li>
              <li>
                <Link to="/interview-prep" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Interview Prep
                </Link>
              </li>
              <li>
                <a href="#about-section" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/70 text-sm">
            &copy; {new Date().getFullYear()} Pangea Education. All rights reserved.
          </p>
          <p className="text-primary-foreground/70 text-sm mt-2 md:mt-0">
            Designed with precision and care.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
