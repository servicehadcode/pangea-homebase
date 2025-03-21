
// Assignment service for subtask assignments

/**
 * Interface for task assignment data
 */
interface TaskAssignment {
  subtaskId: string;
  userId: string;
  subtaskTitle?: string;
  username?: string;
  assignedAt: string;
  notification?: {
    status: 'sent' | 'failed' | 'pending';
    message?: string;
  };
}

/**
 * Interface for assignment notification
 */
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

/**
 * Assigns a subtask to a user
 * @param subtaskId ID of the subtask to assign
 * @param userId ID of the user to assign to
 * @returns Promise with task assignment data
 */
export const assignSubtaskToUser = async (subtaskId: string, userId: string): Promise<TaskAssignment> => {
  console.log(`Assigning subtask ${subtaskId} to user ${userId}`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get user information (in a real app, this would come from a user service)
  const userInfo = {
    'user1': { name: 'Alice Johnson', email: 'alice@example.com' },
    'user2': { name: 'Bob Smith', email: 'bob@example.com' },
    'user3': { name: 'Charlie Davis', email: 'charlie@example.com' }
  }[userId] || { name: 'Unknown User', email: 'unknown@example.com' };
  
  // Get subtask information (in a real app, this would come from a subtask service)
  const subtaskInfo = {
    title: 'Subtask Title', // Would be fetched based on subtaskId in real app
    description: 'This is a description of the subtask.'
  };
  
  // Create notification
  const notification: AssignmentNotification = {
    to: userInfo.email,
    subject: `New Task Assignment: ${subtaskInfo.title}`,
    content: `You have been assigned a new task: "${subtaskInfo.title}". Please review and complete this task.`,
    subtaskInfo: {
      title: subtaskInfo.title,
      description: subtaskInfo.description,
      id: subtaskId
    }
  };
  
  // Send notification (in a real app, this would send an actual email)
  const notificationSent = await sendAssignmentNotification(notification);
  
  // Record assignment in the database
  const assignment: TaskAssignment = {
    subtaskId,
    userId,
    subtaskTitle: subtaskInfo.title,
    username: userInfo.name,
    assignedAt: new Date().toISOString(),
    notification: {
      status: notificationSent ? 'sent' : 'failed',
      message: notificationSent ? 'Notification sent successfully' : 'Failed to send notification'
    }
  };
  
  return assignment;
};

/**
 * Sends an assignment notification (email)
 * @param notification The notification to send
 * @returns Promise with success status
 */
const sendAssignmentNotification = async (notification: AssignmentNotification): Promise<boolean> => {
  console.log(`Sending assignment notification to ${notification.to}`);
  console.log(`Subject: ${notification.subject}`);
  console.log(`Content: ${notification.content}`);
  
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulate success (in a real app, this would be the result of the email send operation)
  return true;
};

/**
 * Gets all assignments for a user
 * @param userId ID of the user
 * @returns Promise with array of task assignments
 */
export const getUserAssignments = async (userId: string): Promise<TaskAssignment[]> => {
  console.log(`Getting assignments for user ${userId}`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock data - in a real app this would come from the database
  const assignments: TaskAssignment[] = [
    {
      subtaskId: '1',
      userId,
      subtaskTitle: 'Data Collection',
      username: 'User',
      assignedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      notification: {
        status: 'sent',
        message: 'Notification sent successfully'
      }
    },
    {
      subtaskId: '2',
      userId,
      subtaskTitle: 'Data Preprocessing',
      username: 'User',
      assignedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      notification: {
        status: 'sent',
        message: 'Notification sent successfully'
      }
    }
  ];
  
  return assignments;
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
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would update the status in the database
  
  return true;
};
