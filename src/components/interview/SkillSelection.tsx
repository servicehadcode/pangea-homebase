
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

type Skill = {
  id: string;
  name: string;
};

type SkillSelectionProps = {
  onStartInterview: (selectedSkills: string[]) => void;
};

export const SkillSelection = ({ onStartInterview }: SkillSelectionProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skills: Skill[] = [
    { id: 'spark', name: 'Spark' },
    { id: 'python', name: 'Python' },
    { id: 'etl', name: 'ETL' },
    { id: 'aws', name: 'AWS Services' },
    { id: 'airflow', name: 'Airflow' },
    { id: 'docker', name: 'Docker' },
    { id: 'behavioral', name: 'Behavioral' },
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
          <div key={skill.id} className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/20 transition-colors">
            <Checkbox 
              id={skill.id} 
              checked={selectedSkills.includes(skill.id)}
              onCheckedChange={() => handleSkillToggle(skill.id)}
            />
            <Label htmlFor={skill.id} className="cursor-pointer flex-grow">
              {skill.name}
            </Label>
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
