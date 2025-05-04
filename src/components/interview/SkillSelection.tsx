
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

type SkillSelectionProps = {
  onStartInterview: (skills: string[]) => void;
};

export const SkillSelection = ({ onStartInterview }: SkillSelectionProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is already logged in
    fetch(`${backendURL}/me`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [backendURL]);

  const handleCheckboxChange = (skill: string) => {
    setSelectedSkills((prevSelected) => {
      if (prevSelected.includes(skill)) {
        return prevSelected.filter((s) => s !== skill);
      } else {
        return [...prevSelected, skill];
      }
    });
  };

  const handleStartInterview = () => {
    if (!user) {
      // If user is not logged in, redirect to sign up page and store the return URL
      const currentURL = window.location.pathname;
      localStorage.setItem('returnAfterLogin', currentURL);
      
      // Show toast notification
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with interview practice.",
      });
      
      // Navigate to signup page
      navigate('/signup', { replace: false });
      return;
    }
    
    if (selectedSkills.length === 0) {
      toast({
        title: "No Skills Selected",
        description: "Please select at least one skill to practice.",
        variant: "destructive",
      });
      return;
    }
    
    onStartInterview(selectedSkills);
  };

  const skills = [
    { id: 'python', label: 'Python', description: 'Core Python concepts and programming techniques' },
    { id: 'spark', label: 'Apache Spark', description: 'Spark architecture, RDDs, DataFrames, and optimization' },
    { id: 'etl', label: 'ETL Processes', description: 'Extract, Transform, Load data pipeline design and implementation' },
    { id: 'aws', label: 'AWS Services', description: 'Amazon Web Services architecture and best practices' },
    { id: 'airflow', label: 'Apache Airflow', description: 'Workflow orchestration and DAG management' },
    { id: 'docker', label: 'Docker & Containerization', description: 'Container technology, Docker, and orchestration' },
    { id: 'behavioral', label: 'Behavioral Questions', description: 'Common behavioral and situational questions' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Skills to Practice</h2>
        <p className="text-muted-foreground mb-4">
          Choose the skills you'd like to focus on during your practice interview.
        </p>
      </div>

      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/20 transition-colors">
            <Checkbox
              id={`skill-${skill.id}`}
              checked={selectedSkills.includes(skill.id)}
              onCheckedChange={() => handleCheckboxChange(skill.id)}
            />
            <div>
              <Label htmlFor={`skill-${skill.id}`} className="font-medium cursor-pointer">
                {skill.label}
              </Label>
              <p className="text-sm text-muted-foreground">{skill.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button 
          className="w-full pangea-button-primary"
          onClick={handleStartInterview}
          disabled={selectedSkills.length === 0}
        >
          Start Self-Practice
        </Button>
      </div>
    </div>
  );
};
