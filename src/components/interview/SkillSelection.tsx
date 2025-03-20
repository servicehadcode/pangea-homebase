
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

export type Skill = {
  id: string;
  name: string;
  description: string;
};

type SkillSelectionProps = {
  onStartInterview: (selectedSkills: string[]) => void;
};

export const SkillSelection = ({ onStartInterview }: SkillSelectionProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skills: Skill[] = [
    { 
      id: 'spark', 
      name: 'Spark', 
      description: 'Apache Spark is a unified analytics engine for large-scale data processing'
    },
    { 
      id: 'python', 
      name: 'Python', 
      description: 'Python programming language and its ecosystem for data engineering' 
    },
    { 
      id: 'etl', 
      name: 'ETL', 
      description: 'Extract, Transform, Load processes and best practices' 
    },
    { 
      id: 'aws', 
      name: 'AWS Services', 
      description: 'Amazon Web Services cloud infrastructure and data services' 
    },
    { 
      id: 'airflow', 
      name: 'Airflow', 
      description: 'Apache Airflow workflow management platform' 
    },
    { 
      id: 'docker', 
      name: 'Docker', 
      description: 'Containerization technology for applications' 
    },
    { 
      id: 'behavioral', 
      name: 'Behavioral', 
      description: 'Soft skills, teamwork, and professional behavior in the workplace' 
    },
  ];

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Select Skills for Interview</h2>
      <p className="text-muted-foreground mb-6">
        Choose one or more skills you'd like to be interviewed on.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {skills.map(skill => (
          <div 
            key={skill.id} 
            className={`flex flex-col border p-4 rounded-md transition-colors ${
              selectedSkills.includes(skill.id) 
                ? 'bg-primary/10 border-primary/30' 
                : 'hover:bg-muted/20'
            }`}
            onClick={() => handleSkillToggle(skill.id)}
          >
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={skill.id} 
                checked={selectedSkills.includes(skill.id)}
                onCheckedChange={() => handleSkillToggle(skill.id)}
                // Stop propagation to prevent double-toggling when clicking directly on checkbox
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer"
              />
              <Label htmlFor={skill.id} className="cursor-pointer font-medium">
                {skill.name}
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2 ml-6">
              {skill.description}
            </p>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={() => onStartInterview(selectedSkills)}
        disabled={selectedSkills.length === 0}
        className="pangea-button-primary flex items-center gap-2"
      >
        Start Interview
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
