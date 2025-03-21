// Database service for SQL operations

/**
 * Interface for user session data
 */
interface UserSession {
  sessionId?: string;
  userId: string;
  problemId: string;
  category: string;
  startTime: string;
  endTime?: string;
  progress?: number;
}

/**
 * Interface for subtask completion data
 */
interface SubtaskCompletion {
  subtaskId: string;
  sessionId: string;
  title: string;
  assignee: string;
  reporter: string;
  prComments: string;
  deliverables: string;
  completedAt: string;
}

/**
 * Interface for downloadable item
 */
interface DownloadableItem {
  id: string;
  problemId: string;
  name: string;
  description: string;
  fileType: string;
  url: string;
  size: string;
  uploadDate: string;
}

/**
 * Interface for PR feedback
 */
interface PRFeedback {
  id: string;
  subtaskId: string;
  comment: string;
  author: string;
  resolved: boolean;
}

/**
 * Interface for user progress
 */
interface UserProgress {
  userId: string;
  problemId: string;
  category: string;
  progress: any; // This can be any object representing the user's progress
  timestamp: string;
  stepsCompleted?: Record<string, boolean>; // Added to track completed subtasks
  subtaskStates?: Record<string, SubtaskState>; // Added to track detailed subtask state
}

/**
 * Interface for individual subtask state
 */
interface SubtaskState {
  acceptanceCriteria?: Array<{id: string; text: string; completed: boolean}>;
  prFeedback?: Array<PRFeedback>;
  deliverables?: string;
  branchCreated?: boolean;
  prCreated?: boolean;
  assignee?: string;
  reporter?: string;
}

/**
 * Records a new user session in the database
 * @param sessionData Session data to record
 * @returns Promise with session ID
 */
export const recordUserSession = async (sessionData: UserSession): Promise<string> => {
  // In a real implementation, this would connect to a SQL database
  // and execute an INSERT statement
  
  console.log('Recording user session:', sessionData);
  
  // Generate a random session ID
  const sessionId = Math.random().toString(36).substring(2, 15);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // For now, we're just logging the data. In a real app, we would do something like:
  // 
  // const query = `
  //   INSERT INTO user_sessions (user_id, problem_id, category, start_time)
  //   VALUES ($1, $2, $3, $4)
  //   RETURNING session_id;
  // `;
  // 
  // const values = [sessionData.userId, sessionData.problemId, sessionData.category, sessionData.startTime];
  // const result = await db.query(query, values);
  // return result.rows[0].session_id;
  
  return sessionId;
};

/**
 * Records a subtask completion in the database
 * @param completionData Subtask completion data
 * @returns Promise with success status
 */
export const recordSubtaskCompletion = async (completionData: SubtaskCompletion): Promise<boolean> => {
  console.log('Recording subtask completion:', completionData);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 250));
  
  // In a real app:
  // 
  // const query = `
  //   INSERT INTO subtask_completions (
  //     subtask_id, 
  //     session_id, 
  //     title, 
  //     assignee, 
  //     reporter, 
  //     pr_comments, 
  //     deliverables, 
  //     completed_at
  //   )
  //   VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
  // `;
  // 
  // const values = [
  //   completionData.subtaskId,
  //   completionData.sessionId,
  //   completionData.title,
  //   completionData.assignee,
  //   completionData.reporter,
  //   completionData.prComments,
  //   completionData.deliverables,
  //   completionData.completedAt
  // ];
  // await db.query(query, values);
  
  return true;
};

/**
 * Updates a user session with progress information
 * @param sessionId ID of the session to update
 * @param progress Progress percentage (0-100)
 * @returns Promise with success status
 */
export const updateSessionProgress = async (sessionId: string, progress: number): Promise<boolean> => {
  console.log(`Updating session ${sessionId} progress: ${progress}%`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In a real app:
  // 
  // const query = `
  //   UPDATE user_sessions
  //   SET progress = $1
  //   WHERE session_id = $2;
  // `;
  // 
  // const values = [progress, sessionId];
  // await db.query(query, values);
  
  return true;
};

/**
 * Completes a user session
 * @param sessionId ID of the session to complete
 * @returns Promise with success status
 */
export const completeSession = async (sessionId: string): Promise<boolean> => {
  const endTime = new Date().toISOString();
  console.log(`Completing session ${sessionId} at ${endTime}`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 250));
  
  // In a real app:
  // 
  // const query = `
  //   UPDATE user_sessions
  //   SET end_time = $1, progress = 100
  //   WHERE session_id = $2;
  // `;
  // 
  // const values = [endTime, sessionId];
  // await db.query(query, values);
  
  return true;
};

/**
 * Saves user progress for a problem
 * @param progress User progress data
 * @returns Promise with success status
 */
export const saveUserProgress = async (progress: UserProgress): Promise<boolean> => {
  console.log(`Saving progress for user ${progress.userId} on problem ${progress.problemId}`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 350));
  
  // In a real app:
  // 
  // const query = `
  //   INSERT INTO user_progress (user_id, problem_id, category, progress, steps_completed, subtask_states, timestamp)
  //   VALUES ($1, $2, $3, $4, $5, $6, $7)
  //   ON CONFLICT (user_id, problem_id) 
  //   DO UPDATE SET progress = $4, steps_completed = $5, subtask_states = $6, timestamp = $7;
  // `;
  // 
  // const values = [
  //   progress.userId,
  //   progress.problemId,
  //   progress.category,
  //   JSON.stringify(progress.progress),
  //   JSON.stringify(progress.stepsCompleted || {}),
  //   JSON.stringify(progress.subtaskStates || {}),
  //   progress.timestamp
  // ];
  // await db.query(query, values);
  
  return true;
};

/**
 * Checks if dataset is available for a problem
 * @param problemId ID of the problem to check
 * @returns Promise with boolean indicating dataset availability
 */
export const checkDatasetAvailability = async (problemId: string): Promise<boolean> => {
  console.log(`Checking dataset availability for problem ${problemId}`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In a real app:
  // 
  // const query = `
  //   SELECT has_dataset 
  //   FROM problems
  //   WHERE problem_id = $1;
  // `;
  // 
  // const values = [problemId];
  // const result = await db.query(query, values);
  // return result.rows[0].has_dataset;
  
  // Mock response - in a real app this would come from the database
  // For now, just return true for certain problem IDs
  return ['1', '3', '5'].includes(problemId);
};

/**
 * Gets downloadable items for a problem
 * @param problemId ID of the problem
 * @returns Promise with array of downloadable items
 */
export const getDownloadableItems = async (problemId: string): Promise<DownloadableItem[]> => {
  console.log(`Getting downloadable items for problem ${problemId}`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock data - in a real app this would come from the database
  if (['1', '3'].includes(problemId)) {
    return [
      {
        id: '1',
        problemId,
        name: 'Dataset.csv',
        description: 'Main dataset for the problem',
        fileType: 'csv',
        url: '#',
        size: '2.4 MB',
        uploadDate: '2023-09-15'
      },
      {
        id: '2',
        problemId,
        name: 'Documentation.pdf',
        description: 'Additional documentation and guidelines',
        fileType: 'pdf',
        url: '#',
        size: '1.2 MB',
        uploadDate: '2023-09-16'
      }
    ];
  }
  
  return [];
};

/**
 * Gets PR feedback for a subtask
 * @param subtaskId ID of the subtask
 * @returns Promise with array of PR feedback items
 */
export const getPRFeedback = async (subtaskId: string): Promise<PRFeedback[]> => {
  console.log(`Getting PR feedback for subtask ${subtaskId}`);
  
  // Simulate database interaction with longer delay to ensure feedback loads properly
  await new Promise(resolve => setTimeout(resolve, 750));
  
  // Generate more consistent feedback based on subtask ID to avoid randomness
  const feedbackItems = [];
  
  // Ensure we always return at least 2 feedback items
  feedbackItems.push({
    id: `${subtaskId}-feedback-1`,
    subtaskId,
    comment: `Consider improving the performance of your implementation with optimized algorithms.`,
    author: 'Senior Developer',
    resolved: false
  });
  
  feedbackItems.push({
    id: `${subtaskId}-feedback-2`,
    subtaskId,
    comment: `Add more comprehensive error handling to make your code more robust.`,
    author: 'Tech Lead',
    resolved: false
  });
  
  // Add a third feedback for some subtasks
  if (['1', '3', '5'].includes(subtaskId)) {
    feedbackItems.push({
      id: `${subtaskId}-feedback-3`,
      subtaskId,
      comment: `The code could benefit from better documentation and comments.`,
      author: 'Code Reviewer',
      resolved: false
    });
  }
  
  return feedbackItems;
};

/**
 * Updates PR feedback resolution status
 * @param feedbackId ID of the feedback item
 * @param resolved New resolution status
 * @returns Promise with success status
 */
export const updatePRFeedbackStatus = async (feedbackId: string, resolved: boolean): Promise<boolean> => {
  console.log(`Updating PR feedback ${feedbackId} resolution status to ${resolved}`);
  
  // Simulate database interaction with sufficient delay to ensure the UI updates properly
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return true;
};

/**
 * Gets achievement data after problem completion
 * @param problemId ID of the completed problem
 * @param userId ID of the user
 * @returns Promise with achievement data
 */
export const getAchievementData = async (problemId: string, userId: string): Promise<any> => {
  console.log(`Getting achievement data for problem ${problemId} and user ${userId}`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock data - in a real app this would come from the database
  return {
    problemTitle: `Problem ${problemId}`,
    experiencePoints: Math.floor(Math.random() * 100) + 50,
    skillPoints: {
      'Problem Solving': Math.floor(Math.random() * 20) + 10,
      'Technical Skills': Math.floor(Math.random() * 20) + 10,
      'Collaboration': Math.floor(Math.random() * 20) + 5
    },
    badges: [
      {
        name: 'Problem Solver',
        description: 'Successfully completed a complex problem',
        icon: '🏆'
      }
    ],
    completedAt: new Date().toISOString()
  };
};
