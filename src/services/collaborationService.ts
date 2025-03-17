
// Dummy microservice implementations for collaboration features

/**
 * Sends collaboration invitation via email (dummy implementation)
 * @param email Email address to send invitation to
 * @returns Promise with response message
 */
export const sendCollaborationInvite = async (email: string): Promise<{ 
  success: boolean; 
  message: string;
}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate success response (in a real implementation, this would send an actual email)
  if (email && email.includes('@')) {
    return {
      success: true,
      message: `Invitation sent successfully to ${email}. They will receive an email shortly.`
    };
  } else {
    return {
      success: false,
      message: 'Failed to send invitation. Please check the email address and try again.'
    };
  }
};

/**
 * Updates collaborator status (dummy implementation)
 * @param email Email of the collaborator
 * @param status New status to set
 * @returns Promise with response message
 */
export const updateCollaboratorStatus = async (email: string, status: 'invited' | 'active'): Promise<{
  success: boolean;
  message: string;
}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate success response
  return {
    success: true,
    message: `Collaborator ${email} status updated to ${status}.`
  };
};

/**
 * Updates collaborator display name (dummy implementation)
 * @param email Email of the collaborator
 * @param newName New display name
 * @returns Promise with response message
 */
export const updateCollaboratorName = async (email: string, newName: string): Promise<{
  success: boolean;
  message: string;
}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (newName.trim().length === 0) {
    return {
      success: false,
      message: 'Name cannot be empty'
    };
  }
  
  // Simulate success response
  return {
    success: true,
    message: `Display name updated successfully to "${newName}".`
  };
};
