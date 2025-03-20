
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { InterviewPreparationMode } from '@/components/interview/InterviewPreparationMode';
import { SkillSelection } from '@/components/interview/SkillSelection';
import { SelfSupervisedInterview } from '@/components/interview/SelfSupervisedInterview';
import { ProfessionalInterviewRequest } from '@/components/interview/ProfessionalInterviewRequest';

type InterviewStage = 'mode-selection' | 'skill-selection' | 'self-interview' | 'professional-request';

const InterviewPrep = () => {
  const [stage, setStage] = useState<InterviewStage>('mode-selection');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const handleModeSelect = (mode: 'self' | 'professional') => {
    if (mode === 'self') {
      setStage('skill-selection');
    } else {
      setStage('professional-request');
    }
  };
  
  const handleStartInterview = (skills: string[]) => {
    setSelectedSkills(skills);
    setStage('self-interview');
  };
  
  const handleGoBackToModeSelection = () => {
    setStage('mode-selection');
  };
  
  const handleGoBackToSkillSelection = () => {
    setStage('skill-selection');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="pangea-container max-w-4xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Interview Preparation</h1>
            <p className="text-lg text-muted-foreground">
              Practice your interview skills and get feedback to improve your performance.
            </p>
          </div>
          
          <div className="bg-background rounded-lg border p-8 animate-fade-up [animation-delay:200ms]">
            {stage === 'mode-selection' && (
              <InterviewPreparationMode onSelectMode={handleModeSelect} />
            )}
            
            {stage === 'skill-selection' && (
              <div>
                <button 
                  onClick={handleGoBackToModeSelection}
                  className="text-muted-foreground hover:text-foreground mb-4 flex items-center text-sm"
                >
                  &larr; Back to mode selection
                </button>
                <SkillSelection onStartInterview={handleStartInterview} />
              </div>
            )}
            
            {stage === 'self-interview' && (
              <SelfSupervisedInterview 
                selectedSkills={selectedSkills}
                onGoBack={handleGoBackToSkillSelection}
              />
            )}
            
            {stage === 'professional-request' && (
              <ProfessionalInterviewRequest 
                onGoBack={handleGoBackToModeSelection}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InterviewPrep;
