
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
    return await response.json();
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

    return await response.json();
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Upvotes a discussion comment
 */
export const upvoteComment = async (discussionId: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:5000/api/discussions/${discussionId}/vote`, {
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
