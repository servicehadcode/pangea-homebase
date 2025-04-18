// Collaboration microservice implementations

/**
 * Sends collaboration invitation via email using contact API
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
    const inviterName = localStorage.getItem('username') || 'Someone';
    const currentUrl = window.location.href;
    
    const formData = {
      name: inviterName,
      email: email,
      subject: `${inviterName} is inviting you to collaborate on a problem`,
      message: `Hello,\n\n${inviterName} has invited you to collaborate on solving a problem together.\n\nYou can join the collaboration by visiting:\n${currentUrl}\n\nBest regards,\nThe Problem Solving Team`
    };

    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the invited collaborator in localStorage
      const invitedCollaboratorsStr = localStorage.getItem('invitedCollaborators');
      let invitedCollaborators = invitedCollaboratorsStr ? 
        JSON.parse(invitedCollaboratorsStr) : {};
      
      invitedCollaborators[email] = {
        email,
        name: email.split('@')[0],
        status: 'invited',
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('invitedCollaborators', JSON.stringify(invitedCollaborators));
      
      return {
        success: true,
        message: data.message || `Invitation sent successfully to ${email}`
      };
    } else {
      throw new Error(data.error || 'Failed to send invitation');
    }
  } catch (error) {
    console.error('Error sending invitation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send invitation. Please try again later.'
    };
  }
};

/**
 * Gets all invited collaborators for the current session
 * @returns Array of collaborator objects
 */
export const getInvitedCollaborators = async (): Promise<any[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
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
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, this would update a database record
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
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!newName.trim()) {
    return {
      success: false,
      message: 'Name cannot be empty'
    };
  }
  
  // In production, this would update a database record
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
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In production, this would fetch from a database
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
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get assignments from localStorage
  const subtaskAssignmentsStr = localStorage.getItem('subtaskAssignments');
  const assignments = subtaskAssignmentsStr ? JSON.parse(subtaskAssignmentsStr) : {};
  
  // Get collaborators to ensure we have latest names
  const collaborators = await getInvitedCollaborators();
  
  // Enrich assignments with latest user information
  Object.keys(assignments).forEach(subtaskId => {
    const assignment = assignments[subtaskId];
    const collaborator = collaborators.find(
      (c: any) => c.email === assignment.userEmail || c.id === assignment.userId
    );
    
    if (collaborator) {
      assignments[subtaskId] = {
        ...assignment,
        userName: collaborator.name // Update name from latest collaborator data
      };
    }
  });
  
  return assignments;
};
