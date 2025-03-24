
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
    // Simulate API call delay (in production, this would be a real API call to a Nodemailer service)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In production, the email sending code would look like this:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Invitation to Collaborate on a Problem',
      html: `
        <h1>You've been invited to collaborate!</h1>
        <p>Someone has invited you to collaborate on a problem-solving task.</p>
        <p>Click the button below to join:</p>
        <a href="https://your-app-url.com/invite?email=${email}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                  text-align: center; text-decoration: none; display: inline-block;
                  border-radius: 4px;">
          Accept Invitation
        </a>
      `
    };
    
    await transporter.sendMail(mailOptions);
    */
    
    // Store the invited collaborator in localStorage instead of global
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
    
    return {
      success: true,
      message: `Invitation sent successfully to ${email}. They will receive an email shortly.`
    };
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
