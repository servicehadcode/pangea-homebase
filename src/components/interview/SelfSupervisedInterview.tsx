
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type InterviewQuestion = {
  id: string;
  question: string;
  topic: string;
};

const dummyQuestions: { [key: string]: InterviewQuestion[] } = {
  spark: [
    { id: 'spark-1', question: 'What is Apache Spark and how does it differ from Hadoop MapReduce?', topic: 'Spark' },
    { id: 'spark-2', question: 'Explain RDDs in Spark and their key operations.', topic: 'Spark' },
  ],
  python: [
    { id: 'python-1', question: 'What are Python generators and why are they useful?', topic: 'Python' },
    { id: 'python-2', question: 'Explain list comprehensions in Python with examples.', topic: 'Python' },
  ],
  etl: [
    { id: 'etl-1', question: 'Describe the ETL process and its importance in data engineering.', topic: 'ETL' },
    { id: 'etl-2', question: 'What challenges might you face in an ETL pipeline and how would you address them?', topic: 'ETL' },
  ],
  aws: [
    { id: 'aws-1', question: 'Compare and contrast AWS S3 and EBS storage options.', topic: 'AWS Services' },
    { id: 'aws-2', question: 'Explain how AWS Lambda works and its use cases.', topic: 'AWS Services' },
  ],
  airflow: [
    { id: 'airflow-1', question: 'What is Apache Airflow and why is it used for workflow orchestration?', topic: 'Airflow' },
    { id: 'airflow-2', question: 'Explain DAGs in Airflow and how you would design one for a data pipeline.', topic: 'Airflow' },
  ],
  docker: [
    { id: 'docker-1', question: 'What are containers and how do they differ from virtual machines?', topic: 'Docker' },
    { id: 'docker-2', question: 'Explain Docker volumes and when you would use them.', topic: 'Docker' },
  ],
  behavioral: [
    { id: 'behavioral-1', question: 'Describe a challenging project you worked on and how you overcame obstacles.', topic: 'Behavioral' },
    { id: 'behavioral-2', question: 'How do you handle conflicting priorities or tight deadlines?', topic: 'Behavioral' },
  ],
};

type SelfSupervisedInterviewProps = {
  selectedSkills: string[];
  onGoBack: () => void;
};

export const SelfSupervisedInterview = ({
  selectedSkills,
  onGoBack
}: SelfSupervisedInterviewProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  // Build questions list based on selected skills
  const questions = selectedSkills.flatMap(skill => dummyQuestions[skill] || []);
  const currentQuestion = questions[currentQuestionIndex];
  
  // Mock recording functionality
  let recordingInterval = useRef<NodeJS.Timeout | null>(null);
  
  const startRecording = () => {
    setIsRecording(true);
    setTranscribedText('');
    
    toast({
      title: "Recording started",
      description: "Your answer is being recorded",
    });
    
    // Simulate speech-to-text with placeholder text appearing over time
    const placeholderAnswers: { [key: string]: string } = {
      'spark-1': "Apache Spark is a distributed computing engine for big data processing. Unlike Hadoop MapReduce, Spark uses in-memory processing which makes it much faster for iterative algorithms and interactive data analysis. Spark supports multiple programming languages and provides a unified engine for batch, streaming, and machine learning workloads.",
      'python-1': "Python generators are functions that return an iterator that yields items one at a time. They use the yield keyword instead of return. Generators are memory efficient because they generate values on-the-fly rather than storing an entire sequence in memory. This makes them ideal for working with large datasets or infinite sequences.",
      'etl-1': "ETL stands for Extract, Transform, Load. It's a process used to collect data from various sources, transform it to suit operational needs, and load it into a destination database or data warehouse. The ETL process is crucial for data integration, migration, and building analytics pipelines.",
    };
    
    const defaultAnswer = "This is a simulated answer for demonstration purposes. In a real implementation, this would be your actual spoken response transcribed to text using speech recognition technology.";
    const answer = placeholderAnswers[currentQuestion?.id] || defaultAnswer;
    
    // Simulate speech-to-text with text appearing gradually
    let charIndex = 0;
    recordingInterval.current = setInterval(() => {
      if (charIndex <= answer.length) {
        setTranscribedText(answer.substring(0, charIndex));
        charIndex += 3;
      } else {
        stopRecording();
      }
    }, 50);
  };
  
  const stopRecording = () => {
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    setIsRecording(false);
    
    toast({
      title: "Recording stopped",
      description: "You can review your answer before submitting",
    });
  };
  
  const submitAnswer = () => {
    if (isRecording) {
      stopRecording();
    }
    
    setIsSubmitted(true);
    setIsEvaluating(true);
    
    // Simulate evaluation delay
    setTimeout(() => {
      setIsEvaluating(false);
      setFeedback("Your answer demonstrates a good understanding of the core concepts. Consider adding more specific examples to strengthen your response. Overall, this is a solid answer that covers the main points effectively.");
    }, 1500);
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscribedText('');
      setIsSubmitted(false);
      setFeedback('');
    } else {
      setIsComplete(true);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, []);
  
  if (isComplete) {
    return (
      <div className="animate-fade-in text-center py-8">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">Interview Complete!</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          You've completed all questions in this interview session. Great job!
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={onGoBack}>
            Select New Skills
          </Button>
          <Button onClick={() => {
            setCurrentQuestionIndex(0);
            setTranscribedText('');
            setIsSubmitted(false);
            setFeedback('');
            setIsComplete(false);
          }}>
            Restart Interview
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onGoBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Skills
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
      
      <Progress 
        value={(currentQuestionIndex / questions.length) * 100} 
        className="h-2 mb-8" 
      />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
          <CardDescription>{currentQuestion?.topic}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{currentQuestion?.question}</p>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Your Answer
            {!isSubmitted && (
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isSubmitted}
                className="flex items-center gap-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </>
                )}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transcribedText ? (
            <div className="p-4 bg-muted/20 rounded-md min-h-[120px]">
              {transcribedText}
            </div>
          ) : (
            <div className="p-4 bg-muted/20 rounded-md min-h-[120px] flex items-center justify-center text-muted-foreground">
              {isSubmitted ? "No answer provided" : "Your transcribed answer will appear here"}
            </div>
          )}
        </CardContent>
        {!isSubmitted && transcribedText && (
          <CardFooter>
            <Button 
              onClick={submitAnswer}
              className="pangea-button-primary flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Submit Answer
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {isSubmitted && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {isEvaluating ? (
              <div className="flex items-center justify-center p-6">
                <div className="animate-spin h-6 w-6 border-2 border-pangea border-t-transparent rounded-full mr-2"></div>
                <span>Evaluating your answer...</span>
              </div>
            ) : (
              <div className="p-4 bg-muted/20 rounded-md">
                {feedback}
              </div>
            )}
          </CardContent>
          {!isEvaluating && (
            <CardFooter>
              <Button 
                onClick={nextQuestion}
                className="pangea-button-primary"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};
