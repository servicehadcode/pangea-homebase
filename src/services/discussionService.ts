
// Discussion service for problem discussions

/**
 * Interface for discussion comment
 */
interface DiscussionComment {
  id: string;
  problemId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  replies?: DiscussionComment[];
}

/**
 * Gets discussion comments for a problem
 * @param problemId ID of the problem
 * @returns Promise with array of discussion comments
 */
export const getDiscussionComments = async (problemId: string): Promise<DiscussionComment[]> => {
  console.log(`Getting discussion comments for problem ${problemId}`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 350));
  
  // Mock data - in a real app this would come from the database
  return [
    {
      id: '1',
      problemId,
      userId: 'user1',
      username: 'John Doe',
      content: 'I found this problem very challenging. Has anyone tried using a different model?',
      timestamp: '2023-09-15T12:00:00Z',
      replies: [
        {
          id: '1-1',
          problemId,
          userId: 'user2',
          username: 'Jane Smith',
          content: 'Yes, I tried using a Random Forest model and it worked better for me.',
          timestamp: '2023-09-16T08:30:00Z'
        }
      ]
    },
    {
      id: '2',
      problemId,
      userId: 'user3',
      username: 'Alice Johnson',
      content: 'Can someone explain the purpose of the API development step?',
      timestamp: '2023-09-17T15:45:00Z',
      replies: []
    }
  ];
};

/**
 * Adds a new discussion comment
 * @param problemId ID of the problem
 * @param userId ID of the user
 * @param username Name of the user
 * @param content Comment content
 * @param parentId Optional ID of the parent comment (for replies)
 * @returns Promise with the created comment
 */
export const addDiscussionComment = async (
  problemId: string,
  userId: string,
  username: string,
  content: string,
  parentId?: string
): Promise<DiscussionComment> => {
  console.log(`Adding discussion comment for problem ${problemId}`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate a random comment ID
  const commentId = parentId ? `${parentId}-${Math.random().toString(36).substring(2, 6)}` : Math.random().toString(36).substring(2, 10);
  
  // Create the new comment
  const newComment: DiscussionComment = {
    id: commentId,
    problemId,
    userId,
    username,
    content,
    timestamp: new Date().toISOString(),
    replies: []
  };
  
  return newComment;
};
