
// Discussion service for problem discussions

export interface DiscussionComment {
  id: string;
  problemId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  votes?: number;
  replies?: DiscussionComment[];
  parentId?: string;
}

export interface CreateCommentRequest {
  problemId: string;
  content: string;
  userId: string;
  username: string;
  parentId?: string;
}

/**
 * Gets discussion comments for a problem
 */
export const getDiscussionComments = async (problemId: string): Promise<DiscussionComment[]> => {
  try {
    const response = await fetch(`http://localhost:5000/api/discussions/${problemId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch discussions');
    }
    
    // Transform the response to match our frontend interface
    const comments = await response.json();
    return comments.map((comment: any) => ({
      id: comment._id,
      problemId: comment.problemId,
      userId: comment.userId,
      username: comment.username || 'Anonymous',
      content: comment.content,
      timestamp: comment.createdAt,
      votes: comment.votes || 0,
      replies: comment.replies ? comment.replies.map((reply: any) => ({
        id: reply._id,
        problemId: reply.problemId,
        userId: reply.userId,
        username: reply.username || 'Anonymous',
        content: reply.content,
        timestamp: reply.createdAt,
        votes: reply.votes || 0,
        parentId: reply.parentId
      })) : [],
      parentId: comment.parentId
    }));
  } catch (error) {
    console.error('Error fetching discussions:', error);
    throw error;
  }
};

/**
 * Adds a new discussion comment
 */
export const addDiscussionComment = async (request: CreateCommentRequest): Promise<DiscussionComment> => {
  try {
    const response = await fetch('http://localhost:5000/api/discussions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }

    const comment = await response.json();
    // Transform backend response to match frontend interface
    return {
      id: comment._id,
      problemId: comment.problemId,
      userId: comment.userId,
      username: comment.username || 'Anonymous',
      content: comment.content,
      timestamp: comment.createdAt,
      votes: comment.votes || 0,
      parentId: comment.parentId
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Upvotes a discussion comment
 */
export const upvoteComment = async (commentId: string): Promise<void> => {
  try {
    console.log(`Upvoting comment with ID: ${commentId}`);
    const response = await fetch(`http://localhost:5000/api/discussions/${commentId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to upvote comment');
    }
  } catch (error) {
    console.error('Error upvoting comment:', error);
    throw error;
  }
};
