import { emailApi } from './api/emailService';

// Types
interface TaskAssignment {
  subtaskId: string;
  userId: string;
  subtaskTitle?: string;
  username?: string;
  assignedAt: string;
  status?: 'accepted' | 'declined' | 'in_progress' | 'completed';
  notification?: {
    status: 'sent' | 'failed' | 'pending';
    message?: string;
  };
}

interface AssignmentNotification {
  to: string;
  subject: string;
  content: string;
  subtaskInfo: {
    title: string;
    description: string;
    id: string;
  };
}

// Mock user data - in production this would come from a user service
const userInfo: Record<string, { name: string; email: string }> = {
  'user1': { name: 'Alice Johnson', email: 'alice@example.com' },
  'user2': { name: 'Bob Smith', email: 'bob@example.com' },
  'user3': { name: 'Charlie Davis', email: 'charlie@example.com' }
};

/**
 * Assigns a subtask to a user and sends notification
 * @param subtaskId ID of the subtask to assign
 * @param userId ID of the user to assign to
 * @returns Promise with task assignment data
 */
export const assignSubtaskToUser = async (subtaskId: string, userId: string): Promise<TaskAssignment> => {
  console.log(`Assigning subtask ${subtaskId} to user ${userId}`);
  
  // Get user information
  const user = userInfo[userId] || { name: 'Unknown User', email: 'unknown@example.com' };
  
  // Get subtask information (in production this would come from a subtask service)
  const subtaskInfo = {
    title: 'Subtask Title', // Would be fetched based on subtaskId in production
    description: 'This is a description of the subtask.'
  };

  try {
    // Create and send notification
    const notification: AssignmentNotification = {
      to: user.email,
      subject: `New Task Assignment: ${subtaskInfo.title}`,
      content: `You have been assigned a new task: "${subtaskInfo.title}". Please review and complete this task.`,
      subtaskInfo: {
        title: subtaskInfo.title,
        description: subtaskInfo.description,
        id: subtaskId
      }
    };
    
    const response = await emailApi.sendAssignmentNotification(notification);
    
    // Create assignment record
    const assignment: TaskAssignment = {
      subtaskId,
      userId,
      subtaskTitle: subtaskInfo.title,
      username: user.name,
      assignedAt: new Date().toISOString(),
      notification: {
        status: response.success ? 'sent' : 'failed',
        message: response.message
      }
    };

    // Store assignment in localStorage
    const assignmentsStr = localStorage.getItem('subtaskAssignments');
    const assignments: Record<string, TaskAssignment> = assignmentsStr ? JSON.parse(assignmentsStr) : {};
    assignments[subtaskId] = assignment;
    localStorage.setItem('subtaskAssignments', JSON.stringify(assignments));

    return assignment;
    
  } catch (error) {
    console.error('Error in assignSubtaskToUser:', error);
    
    // Return assignment with failed notification status
    return {
      subtaskId,
      userId,
      subtaskTitle: subtaskInfo.title,
      username: user.name,
      assignedAt: new Date().toISOString(),
      notification: {
        status: 'failed',
        message: 'Failed to send notification'
      }
    };
  }
};

/**
 * Gets all assignments for a user
 * @param userId ID of the user
 * @returns Promise with array of task assignments
 */
export const getUserAssignments = async (userId: string): Promise<TaskAssignment[]> => {
  console.log(`Getting assignments for user ${userId}`);
  
  // Get assignments from localStorage
  const assignmentsStr = localStorage.getItem('subtaskAssignments');
  const allAssignments: Record<string, TaskAssignment> = assignmentsStr ? JSON.parse(assignmentsStr) : {};
  
  // Filter assignments for the specific user and cast to TaskAssignment[]
  return Object.values(allAssignments).filter(
    (assignment): assignment is TaskAssignment => 
      assignment && 
      typeof assignment === 'object' && 
      'userId' in assignment && 
      assignment.userId === userId
  );
};

/**
 * Updates the status of an assignment
 * @param subtaskId ID of the subtask
 * @param userId ID of the user
 * @param status New status of the assignment
 * @returns Promise with success status
 */
export const updateAssignmentStatus = async (
  subtaskId: string, 
  userId: string, 
  status: 'accepted' | 'declined' | 'in_progress' | 'completed'
): Promise<boolean> => {
  console.log(`Updating assignment status for subtask ${subtaskId} to ${status}`);
  
  try {
    // Get current assignments
    const assignmentsStr = localStorage.getItem('subtaskAssignments');
    const assignments: Record<string, TaskAssignment> = assignmentsStr ? JSON.parse(assignmentsStr) : {};
    
    // Update status if assignment exists
    if (assignments[subtaskId] && assignments[subtaskId].userId === userId) {
      assignments[subtaskId].status = status;
      localStorage.setItem('subtaskAssignments', JSON.stringify(assignments));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating assignment status:', error);
    return false;
  }
};