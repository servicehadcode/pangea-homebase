import { emailApi } from './api/emailService';

// Collaboration microservice implementations

/**
 * Sends collaboration invitation via email using Nodemailer
 * @param email Email address to send invitation to
 * @returns Promise with response message
 */
export const sendCollaborationInvite = async (email: string): Promise<{ 
  success: boolean; 
  message: string;
}> => {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return {
      success: false,
      message: 'Invalid email format. Please provide a valid email address.'
    };
  }
  
  try {
    // Generate invite link
    const inviteLink = `${window.location.origin}/invite?email=${encodeURIComponent(email)}`;
    
    // Send email through backend service
    const response = await emailApi.sendCollaborationInvite(email, {
      projectName: 'Problem Solving Project', // You might want to make this dynamic
      invitedBy: localStorage.getItem('userName') || 'A team member',
      inviteLink
    });
    
    // Store the invited collaborator in localStorage
    const invitedCollaboratorsStr = localStorage.getItem('invitedCollaborators');
    let invitedCollaborators = invitedCollaboratorsStr ? 
      JSON.parse(invitedCollaboratorsStr) : {};
    
    // Add to invited collaborators with pending status
    invitedCollaborators[email] = {
      email,
      name: email.split('@')[0], // Default name from email
      status: 'invited',
      timestamp: new Date().toISOString()
    };
    
    // Save back to localStorage
    localStorage.setItem('invitedCollaborators', JSON.stringify(invitedCollaborators));
    
    return response;
  } catch (error) {
    console.error('Error sending invitation:', error);
    return {
      success: false,
      message: 'Failed to send invitation. Please try again later.'
    };
  }
};

/**
 * Gets all invited collaborators for the current session
 * @returns Array of collaborator objects
 */
export const getInvitedCollaborators = async (): Promise<any[]> => {
  // In production, this would fetch from a database
  const invitedCollaboratorsStr = localStorage.getItem('invitedCollaborators');
  const invitedCollaborators = invitedCollaboratorsStr ? 
    JSON.parse(invitedCollaboratorsStr) : {};
  
  // Convert object to array
  return Object.values(invitedCollaborators);
};

/**
 * Updates collaborator status
 * @param email Email of the collaborator
 * @param status New status to set
 * @returns Promise with response message
 */
export const updateCollaboratorStatus = async (email: string, status: 'invited' | 'active'): Promise<{
  success: boolean;
  message: string;
}> => {
  const invitedCollaboratorsStr = localStorage.getItem('invitedCollaborators');
  let invitedCollaborators = invitedCollaboratorsStr ? 
    JSON.parse(invitedCollaboratorsStr) : {};
  
  if (invitedCollaborators[email]) {
    invitedCollaborators[email].status = status;
    localStorage.setItem('invitedCollaborators', JSON.stringify(invitedCollaborators));
    
    return {
      success: true,
      message: `Collaborator ${email} status updated to ${status}.`
    };
  }
  
  return {
    success: false,
    message: 'Collaborator not found.'
  };
};

/**
 * Updates collaborator display name
 * @param email Email of the collaborator
 * @param newName New display name
 * @returns Promise with response message
 */
export const updateCollaboratorName = async (email: string, newName: string): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!newName.trim()) {
    return {
      success: false,
      message: 'Name cannot be empty'
    };
  }
  
  const invitedCollaboratorsStr = localStorage.getItem('invitedCollaborators');
  let invitedCollaborators = invitedCollaboratorsStr ? 
    JSON.parse(invitedCollaboratorsStr) : {};
  
  if (invitedCollaborators[email]) {
    invitedCollaborators[email].name = newName;
    localStorage.setItem('invitedCollaborators', JSON.stringify(invitedCollaborators));
    
    return {
      success: true,
      message: `Display name updated successfully to "${newName}".`
    };
  }
  
  return {
    success: false,
    message: 'Collaborator not found.'
  };
};

/**
 * Gets the assignment for a specific subtask
 * @param subtaskId ID of the subtask
 * @returns Assignment information or null if not found
 */
export const getSubtaskAssignment = async (subtaskId: string): Promise<any | null> => {
  const subtaskAssignmentsStr = localStorage.getItem('subtaskAssignments');
  const subtaskAssignments = subtaskAssignmentsStr ? 
    JSON.parse(subtaskAssignmentsStr) : {};
  
  return subtaskAssignments[subtaskId] || null;
};

/**
 * Gets all subtask assignments with user details
 * @returns Record of all subtask assignments with user information
 */
export const getAllSubtaskAssignments = async (): Promise<Record<string, any>> => {
  const subtaskAssignmentsStr = localStorage.getItem('subtaskAssignments');
  return subtaskAssignmentsStr ? JSON.parse(subtaskAssignmentsStr) : {};
};