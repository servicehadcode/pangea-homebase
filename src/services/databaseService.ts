
// This is a dummy service that simulates database operations
// In a real-world application, this would connect to a backend API

// Generate a random ID for new items
const generateId = () => Math.random().toString(36).substring(2, 15);

// Store data in localStorage for persistence
const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getFromStorage = (key: string, defaultValue: any = null) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

// Record a user session for a problem
export const recordUserSession = async (sessionData: {
  userId: string;
  problemId: string;
  category: string;
  startTime: string;
}) => {
  const sessionId = generateId();
  const sessions = getFromStorage('userSessions', []);
  
  const newSession = {
    ...sessionData,
    sessionId,
    progress: 0,
    isCompleted: false,
  };
  
  sessions.push(newSession);
  saveToStorage('userSessions', sessions);
  
  return sessionId;
};

// Update the progress percentage for a session
export const updateSessionProgress = async (sessionId: string, progressPercentage: number) => {
  const sessions = getFromStorage('userSessions', []);
  const updatedSessions = sessions.map((session: any) => 
    session.sessionId === sessionId 
      ? { ...session, progress: progressPercentage } 
      : session
  );
  
  saveToStorage('userSessions', updatedSessions);
  
  return { success: true, message: "Progress updated" };
};

// Mark a session as completed
export const completeSession = async (sessionId: string) => {
  const sessions = getFromStorage('userSessions', []);
  const updatedSessions = sessions.map((session: any) => 
    session.sessionId === sessionId 
      ? { ...session, isCompleted: true, completedAt: new Date().toISOString() } 
      : session
  );
  
  saveToStorage('userSessions', updatedSessions);
  
  return { success: true, message: "Session completed" };
};

// Record a completed subtask
export const recordSubtaskCompletion = async (subtaskData: {
  subtaskId: string;
  sessionId: string;
  title: string;
  assignee: string;
  reporter: string;
  prComments: string;
  deliverables: string;
  completedAt: string;
}) => {
  const completedSubtasks = getFromStorage('completedSubtasks', []);
  completedSubtasks.push(subtaskData);
  saveToStorage('completedSubtasks', completedSubtasks);
  
  return { success: true, message: "Subtask recorded" };
};

// Check if a dataset is available for a problem
export const checkDatasetAvailability = async (problemId: string) => {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For demo purposes, assume datasets are available for problems with even IDs
  const isAvailable = parseInt(problemId) % 2 === 0;
  
  return { 
    isAvailable, 
    datasetUrl: isAvailable ? `https://example.com/datasets/${problemId}.csv` : null 
  };
};

// Get a list of downloadable items
export const getDownloadableItems = async (problemId: string) => {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Demo data
  return [
    { id: "1", name: "Dataset.csv", size: "2.3 MB", type: "data" },
    { id: "2", name: "ReadMe.md", size: "15 KB", type: "document" },
    { id: "3", name: "Starter_Code.py", size: "4 KB", type: "code" },
  ];
};

// Get PR feedback for a subtask
export const getPRFeedback = async (subtaskId: string) => {
  // Simulate API call with a delay to avoid immediate state changes
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate different feedback based on the subtask ID
  switch(subtaskId) {
    case "1":
      return [
        { id: "f1", author: "Senior Data Engineer", comment: "Consider using a more efficient data collection method.", resolved: false },
        { id: "f2", author: "Tech Lead", comment: "Please add error handling for API failures.", resolved: false }
      ];
    case "2":
      return [
        { id: "f3", author: "Senior Data Scientist", comment: "The normalization approach could be improved.", resolved: false },
        { id: "f4", author: "QA Engineer", comment: "Add more validation for edge cases.", resolved: false }
      ];
    case "3":
      return [
        { id: "f5", author: "ML Engineer", comment: "The model training could be optimized further.", resolved: false },
        { id: "f6", author: "Product Manager", comment: "Make sure the model meets the performance requirements.", resolved: false }
      ];
    default:
      return [
        { id: generateId(), author: "Reviewer", comment: "Great implementation!", resolved: false },
        { id: generateId(), author: "Team Lead", comment: "Consider adding more documentation.", resolved: false }
      ];
  }
};

// Update PR feedback resolution status
export const updatePRFeedbackStatus = async (feedbackId: string, resolved: boolean) => {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return { success: true, message: `Feedback ${resolved ? 'resolved' : 'unresolved'}` };
};

// Save user progress for a problem
export const saveUserProgress = async (progressData: {
  userId: string;
  problemId: string;
  category: string;
  progress: any;
  stepsCompleted: Record<string, boolean>;
  subtaskStates: Record<string, any>;
  timestamp: string;
}) => {
  // Ensure we have a stable storage key
  const storageKey = `user_${progressData.userId}_problem_${progressData.problemId}`;
  
  // Store the progress data
  saveToStorage(storageKey, {
    ...progressData,
    lastUpdated: new Date().toISOString()
  });
  
  // Also update the global progress tracking
  const userProgress = getFromStorage('userProgress', {});
  userProgress[storageKey] = {
    userId: progressData.userId,
    problemId: progressData.problemId,
    category: progressData.category,
    timestamp: progressData.timestamp,
    lastUpdated: new Date().toISOString()
  };
  saveToStorage('userProgress', userProgress);
  
  // Simulate network delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { success: true, message: "Progress saved successfully" };
};

// Get achievement data for a problem completed by a user
export const getAchievementData = async (problemId: string, userId: string) => {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate dummy achievement data based on the problem ID
  const achievementData = {
    problemTitle: `Problem ${problemId}`,
    experiencePoints: 150 + Math.floor(Math.random() * 100),
    completedAt: new Date().toISOString(),
    skillPoints: {
      "Data Analysis": 15 + Math.floor(Math.random() * 10),
      "Machine Learning": 20 + Math.floor(Math.random() * 15),
      "Data Visualization": 10 + Math.floor(Math.random() * 10),
      "Problem Solving": 25 + Math.floor(Math.random() * 10)
    },
    badges: [
      {
        name: "Problem Solver",
        description: "Successfully completed a data science problem",
        icon: "🏆"
      },
      {
        name: "Quick Thinker",
        description: "Completed the problem in record time",
        icon: "⚡"
      },
      {
        name: "Team Player",
        description: "Collaborated effectively with team members",
        icon: "👥"
      }
    ]
  };
  
  return achievementData;
};
