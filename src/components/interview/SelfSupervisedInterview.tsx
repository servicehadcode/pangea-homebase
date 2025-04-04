import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchInterviewQuestions, 
  evaluateAnswer,
  InterviewQuestion,
  InterviewFeedback
} from '@/services/interviewService';

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
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Reference for the audio recorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Fetch questions when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const fetchedQuestions = await fetchInterviewQuestions(selectedSkills);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error loading questions:", error);
        toast({
          title: "Error",
          description: "Failed to load interview questions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [selectedSkills, toast]);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Update the startRecording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get supported MIME types for this browser
      const mimeType = getSupportedMimeType();
      
      // Create an AudioContext to process the audio later
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Configure with supported MIME type
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Use the correct MIME type based on what was supported
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        try {
          // Convert to WAV before sending to API
          const wavBlob = await convertToWav(audioBlob);
          await sendAudioToTranscriptionAPI(wavBlob);
        } catch (error) {
          console.error('Error processing audio:', error);
          toast({
            title: "Processing Error",
            description: "Failed to process audio recording",
            variant: "destructive",
          });
        }
        
        // Close audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Set a time slice to collect data periodically (e.g., every second)
      mediaRecorder.start(1000);
      setIsRecording(true);
      setTranscribedText('');
      
      toast({
        title: "Recording started",
        description: "Your answer is being recorded",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Function to convert audio blob to WAV format
  const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      // Create file reader to read the blob
      const fileReader = new FileReader();
      
      fileReader.onloadend = async () => {
        try {
          const arrayBuffer = fileReader.result as ArrayBuffer;
          const audioContext = audioContextRef.current as AudioContext;
          
          // Decode the audio data
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          // Convert to WAV
          const wavBuffer = audioBufferToWav(audioBuffer);
          const wavBlob = new Blob([new DataView(wavBuffer)], { type: 'audio/wav' });
          
          resolve(wavBlob);
        } catch (error) {
          reject(error);
        }
      };
      
      fileReader.onerror = () => {
        reject(new Error('Failed to read audio file'));
      };
      
      // Read the blob as array buffer
      fileReader.readAsArrayBuffer(audioBlob);
    });
  };
  
  // Helper function to convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2; // 16-bit audio (2 bytes per sample)
    const sampleRate = buffer.sampleRate;
    
    // Create the WAV file buffer
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
    
    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // File length minus RIFF identifier length and file description length
    view.setUint32(4, 36 + length, true);
    // WAVE identifier
    writeString(view, 8, 'WAVE');
    // Format chunk identifier
    writeString(view, 12, 'fmt ');
    // Format chunk length
    view.setUint32(16, 16, true);
    // Sample format (PCM)
    view.setUint16(20, 1, true);
    // Channel count
    view.setUint16(22, numOfChannels, true);
    // Sample rate
    view.setUint32(24, sampleRate, true);
    // Byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * numOfChannels * 2, true);
    // Block align (channel count * bytes per sample)
    view.setUint16(32, numOfChannels * 2, true);
    // Bits per sample
    view.setUint16(34, 16, true);
    // Data chunk identifier
    writeString(view, 36, 'data');
    // Data chunk length
    view.setUint32(40, length, true);
    
    // Write the PCM samples
    const channelData = [];
    let offset = 44;
    
    // Extract the channel data
    for (let i = 0; i < numOfChannels; i++) {
      channelData.push(buffer.getChannelData(i));
    }
    
    // Interleave the channels and convert to 16-bit
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        // Convert float audio data (range -1 to 1) to 16-bit PCM
        const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
        const pcmSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, pcmSample, true);
        offset += 2;
      }
    }
    
    return arrayBuffer;
  };
  
  // Helper function to write a string to a DataView
  const writeString = (view: DataView, offset: number, string: string): void => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // Helper function to get supported MIME type
  const getSupportedMimeType = (): string => {
    const types = [
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
      'audio/webm;codecs=opus',
      'audio/webm;codecs=pcm',
      'audio/webm;codecs=vorbis',
      ''  // Empty string is a valid fallback
    ];
    
    for (const type of types) {
      if (type === '' || MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    
    return ''; // Fallback to default
  };

  // Add the new function to send audio to API
  const sendAudioToTranscriptionAPI = async (audioBlob: Blob) => {
    try {
      setTranscribedText("Transcribing your answer...");
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('language', 'en-US');

      const response = await fetch('http://localhost:5000/api/v1/transcribe', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setTranscribedText(result.data.transcription);
      } else {
        throw new Error(result.error?.message || 'Transcription failed');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: "Transcription Error",
        description: "Failed to transcribe your answer. Please try again.",
        variant: "destructive",
      });
      setTranscribedText('');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording stopped",
        description: "Transcribing your answer...",
      });
    }
  };
  
  const submitAnswer = async () => {
    if (isRecording) {
      stopRecording();
    }
    
    setIsSubmitted(true);
    setIsEvaluating(true);
    
    try {
      // Call evaluation service
      const result = await evaluateAnswer(currentQuestion, transcribedText);
      setFeedback(result);
    } catch (error) {
      console.error("Error evaluating answer:", error);
      toast({
        title: "Evaluation Error",
        description: "Failed to evaluate your answer",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating(false);
    }
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscribedText('');
      setIsSubmitted(false);
      setFeedback(null);
    } else {
      setIsComplete(true);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-pangea border-t-transparent rounded-full mr-3"></div>
        <p>Loading interview questions...</p>
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find any questions for your selected skills. Please try selecting different skills.
        </p>
        <Button onClick={onGoBack}>Back to Skill Selection</Button>
      </div>
    );
  }
  
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
            setFeedback(null);
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
            ) : feedback ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Score:</span>
                  <span className={`font-bold ${
                    feedback.score >= 90 ? "text-green-500" : 
                    feedback.score >= 80 ? "text-yellow-500" : 
                    "text-red-500"
                  }`}>
                    {feedback.score}/100
                  </span>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Strengths:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="text-green-700 dark:text-green-400">
                        <span className="text-foreground">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Areas for Improvement:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="text-amber-700 dark:text-amber-400">
                        <span className="text-foreground">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Overall Feedback:</h4>
                  <p className="bg-muted/20 p-3 rounded-md">{feedback.overallFeedback}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/20 rounded-md">
                No feedback available
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
