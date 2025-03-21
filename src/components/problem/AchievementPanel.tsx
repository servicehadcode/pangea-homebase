
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  Star, 
  Award,
  Sparkles,
  ArrowRight,
  Loader2,
  Home
} from 'lucide-react';
import { getAchievementData } from '@/services/databaseService';
import { useNavigate } from 'react-router-dom';

interface AchievementPanelProps {
  problemId: string;
  userId: string;
  category: string;
}

const AchievementPanel: React.FC<AchievementPanelProps> = ({ 
  problemId,
  userId,
  category
}) => {
  const navigate = useNavigate();
  const [achievement, setAchievement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAchievementData = async () => {
      setIsLoading(true);
      try {
        const data = await getAchievementData(problemId, userId);
        setAchievement(data);
      } catch (error) {
        console.error('Error fetching achievement data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAchievementData();
  }, [problemId, userId]);
  
  const handleBackToProblems = () => {
    navigate('/problems');
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading achievement data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!achievement) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <p>No achievement data available.</p>
          <Button 
            onClick={handleBackToProblems}
            className="mt-4"
          >
            Back to Problems
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-pangea/80 to-pangea p-6 text-white">
        <div className="flex justify-center mb-4">
          <Trophy className="h-16 w-16" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-1">Problem Completed!</h2>
        <p className="text-center text-white/80">
          Congratulations on completing {achievement.problemTitle}
        </p>
      </div>
      
      <CardContent className="p-6 space-y-6 mt-4">
        <div className="flex justify-center">
          <Badge className="px-4 py-2 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white">
            <Award className="h-5 w-5 mr-2" />
            {achievement.experiencePoints} XP Earned
          </Badge>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
            Skills Improved
          </h3>
          
          <div className="space-y-4">
            {Object.entries(achievement.skillPoints).map(([skill, points]: [string, any]) => (
              <div key={skill}>
                <div className="flex justify-between mb-1">
                  <span>{skill}</span>
                  <span>+{points} points</span>
                </div>
                <Progress value={points * 5} className="h-2" />
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Badges Earned
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievement.badges.map((badge: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 flex items-center gap-3">
                <div className="text-3xl">{badge.icon}</div>
                <div>
                  <h4 className="font-semibold">{badge.name}</h4>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="text-center text-muted-foreground">
          <p>Completed on {new Date(achievement.completedAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center p-6 pt-2">
        <Button 
          onClick={handleBackToProblems}
          className="pangea-button-primary flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Return to Problems
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AchievementPanel;
