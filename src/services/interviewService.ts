// This file contains all interview-related services

import { toast } from "sonner";
import { pipeline } from "@huggingface/transformers";

// Types
export type InterviewQuestion = {
  id: string;
  question: string;
  topic: string;
};

export type InterviewFeedback = {
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  overallFeedback: string;
};

export type InterviewTimeSlot = {
  date: string;
  time: string;
  isBooked: boolean;
};

export type InterviewRequestData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: Date;
  timeSlot: string;
};

// Whisper transcription model initialization
let whisperTranscriber: any = null;

const initWhisperModel = async () => {
  if (!whisperTranscriber) {
    try {
      console.log("Initializing Whisper model...");
      whisperTranscriber = await pipeline(
        "automatic-speech-recognition",
        "openai/whisper-tiny"
      );
      console.log("Whisper model initialized successfully");
    } catch (error) {
      console.error("Error initializing Whisper model:", error);
      toast.error("Failed to load speech recognition model");
    }
  }
  return whisperTranscriber;
};

// Dummy questions database
const questionDatabase: { [key: string]: InterviewQuestion[] } = {
  spark: [
    { id: 'spark-1', question: 'What is Apache Spark and how does it differ from Hadoop MapReduce?', topic: 'Spark' },
    { id: 'spark-2', question: 'Explain RDDs in Spark and their key operations.', topic: 'Spark' },
    { id: 'spark-3', question: 'How does Spark handle data partitioning and shuffling?', topic: 'Spark' },
    { id: 'spark-4', question: 'Describe Spark\'s execution model and how it optimizes performance.', topic: 'Spark' },
  ],
  python: [
    { id: 'python-1', question: 'What are Python generators and why are they useful?', topic: 'Python' },
    { id: 'python-2', question: 'Explain list comprehensions in Python with examples.', topic: 'Python' },
    { id: 'python-3', question: 'How does memory management work in Python?', topic: 'Python' },
    { id: 'python-4', question: 'Describe Python\'s GIL and its implications for multithreaded applications.', topic: 'Python' },
  ],
  etl: [
    { id: 'etl-1', question: 'Describe the ETL process and its importance in data engineering.', topic: 'ETL' },
    { id: 'etl-2', question: 'What challenges might you face in an ETL pipeline and how would you address them?', topic: 'ETL' },
    { id: 'etl-3', question: 'Compare batch and streaming ETL approaches.', topic: 'ETL' },
    { id: 'etl-4', question: 'How would you handle data quality issues in an ETL pipeline?', topic: 'ETL' },
  ],
  aws: [
    { id: 'aws-1', question: 'Compare and contrast AWS S3 and EBS storage options.', topic: 'AWS Services' },
    { id: 'aws-2', question: 'Explain how AWS Lambda works and its use cases.', topic: 'AWS Services' },
    { id: 'aws-3', question: 'Describe the AWS data transfer costs and optimization strategies.', topic: 'AWS Services' },
    { id: 'aws-4', question: 'How would you design a highly available application on AWS?', topic: 'AWS Services' },
  ],
  airflow: [
    { id: 'airflow-1', question: 'What is Apache Airflow and why is it used for workflow orchestration?', topic: 'Airflow' },
    { id: 'airflow-2', question: 'Explain DAGs in Airflow and how you would design one for a data pipeline.', topic: 'Airflow' },
    { id: 'airflow-3', question: 'How does Airflow handle task dependencies and retries?', topic: 'Airflow' },
    { id: 'airflow-4', question: 'What are the different executors in Airflow and when would you use each?', topic: 'Airflow' },
  ],
  docker: [
    { id: 'docker-1', question: 'What are containers and how do they differ from virtual machines?', topic: 'Docker' },
    { id: 'docker-2', question: 'Explain Docker volumes and when you would use them.', topic: 'Docker' },
    { id: 'docker-3', question: 'Describe Docker networking and the different network modes.', topic: 'Docker' },
    { id: 'docker-4', question: 'How would you optimize a Docker image for production?', topic: 'Docker' },
  ],
  behavioral: [
    { id: 'behavioral-1', question: 'Describe a challenging project you worked on and how you overcame obstacles.', topic: 'Behavioral' },
    { id: 'behavioral-2', question: 'How do you handle conflicting priorities or tight deadlines?', topic: 'Behavioral' },
    { id: 'behavioral-3', question: 'Tell me about a time when you had to learn a new technology quickly.', topic: 'Behavioral' },
    { id: 'behavioral-4', question: 'How do you approach collaboration with team members who have different working styles?', topic: 'Behavioral' },
  ],
};

// Cache for time slots
let cachedTimeSlots: InterviewTimeSlot[] | null = null;

// Dummy available time slots (next 4 weekends)
const generateTimeSlots = (): InterviewTimeSlot[] => {
  const slots: InterviewTimeSlot[] = [];
  const today = new Date();
  
  // Generate slots for the next 4 weekends
  for (let week = 0; week < 4; week++) {
    // Find the next Saturday
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + ((6 - today.getDay()) % 7) + (week * 7));
    
    // Find the next Sunday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + ((7 - today.getDay()) % 7) + (week * 7));
    
    // Time slots
    const times = [
      '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', 
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
      '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
    ];
    
    // Add Saturday slots
    times.forEach(time => {
      slots.push({
        date: saturday.toISOString().split('T')[0],
        time,
        isBooked: Math.random() < 0.3, // Randomly mark 30% as booked
      });
    });
    
    // Add Sunday slots
    times.forEach(time => {
      slots.push({
        date: sunday.toISOString().split('T')[0],
        time,
        isBooked: Math.random() < 0.3, // Randomly mark 30% as booked
      });
    });
  }
  
  return slots;
};

// Question Generation Service
export const fetchInterviewQuestions = async (selectedSkills: string[]): Promise<InterviewQuestion[]> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // Get questions for each selected skill
    const questions = selectedSkills.flatMap(skill => {
      const skillQuestions = questionDatabase[skill] || [];
      // If we have more than 2 questions per skill, randomly select 2
      if (skillQuestions.length > 2) {
        return skillQuestions
          .sort(() => Math.random() - 0.5) // Shuffle
          .slice(0, 2); // Take first 2
      }
      return skillQuestions;
    });
    
    // Shuffle all questions
    return questions.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error fetching interview questions:", error);
    toast.error("Failed to load interview questions");
    return [];
  }
};

// Answer Evaluation Service
export const evaluateAnswer = async (
  question: InterviewQuestion, 
  answer: string
): Promise<InterviewFeedback> => {
  
  try {
    // Connect to API endpoint
    const response = await fetch('http://localhost:5000/api/v1/feedback/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        question: question.question, 
        transcribedText: answer 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to evaluate answer');
    }

    const evaluatedFeedback: InterviewFeedback = await response.json();
    return evaluatedFeedback;
    
  } catch (error) {
    console.error("Error evaluating answer:", error);
    toast.error("Failed to evaluate answer");
    
    // Return a generic feedback if evaluation fails
    return {
      score: 0,
      strengths: [],
      improvements: ["Unable to evaluate answer at this time"],
      overallFeedback: "Evaluation failed. Please try again later."
    };
  }
};

// Interview Scheduling Service
export const getAvailableTimeSlots = async (): Promise<InterviewTimeSlot[]> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Generate time slots if not cached
    if (!cachedTimeSlots) {
      cachedTimeSlots = generateTimeSlots();
    }
    
    return cachedTimeSlots;
  } catch (error) {
    console.error("Error fetching time slots:", error);
    toast.error("Failed to load available time slots");
    return [];
  }
};

export const scheduleInterview = async (requestData: InterviewRequestData): Promise<boolean> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    console.log("Scheduling interview with data:", requestData);
    
    // In a real implementation, this would call an API to:
    // 1. Check if the slot is still available
    // 2. Book the slot
    // 3. Send confirmation emails
    // 4. Update the booking system
    
    // For now, we'll just mark the slot as booked in our cached data
    if (cachedTimeSlots) {
      const dateStr = requestData.date.toISOString().split('T')[0];
      const slot = cachedTimeSlots.find(
        s => s.date === dateStr && s.time === requestData.timeSlot
      );
      
      if (slot) {
        if (slot.isBooked) {
          toast.error("This time slot is no longer available");
          return false;
        }
        
        slot.isBooked = true;
      }
    }
    
    // Send success notification
    toast.success("Interview scheduled successfully!");
    return true;
  } catch (error) {
    console.error("Error scheduling interview:", error);
    toast.error("Failed to schedule interview");
    return false;
  }
};
