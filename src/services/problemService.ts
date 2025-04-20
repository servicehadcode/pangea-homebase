export interface Problem {
  problem_num: string;
  title: string;
  description: string;
  longDescription: string;
  difficulty: string;
  category: string;
  requirements: {
    time: string;
    skills: string[];
    prerequisites: string[];
  };
  tags: string[];
  steps: Array<{
    id: string;
    step: number;
    description: string;
    details?: string[]; // Field for step details
    acceptanceCriteria?: string[]; // Now this field exists within each step
  }>;
  resources: Array<{
    type: string;
    url: string;
    description: string;
  }>;
  metadata?: {
    gitRepo?: string;
  };
  downloadableItems?: string[];
  preparationSteps?: string[];
}

export interface TransformedProblem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  steps: number;
  isCompleted: boolean;
}

export interface ProblemInstanceOwner {
  userId: string;
  username: string;
  email: string;
  gitUsername?: string; // Add gitUsername as an optional property
}

export interface ProblemInstance {
  problemNum: string;
  owner: ProblemInstanceOwner;
  collaborationMode: 'solo' | 'pair';
  status?: string;
  startedAt?: string;
  lastUpdatedAt?: string;
  completedAt?: string | null;
  _id?: string;
  collaborators?: any[];
  gitUsername?: string;
}

export const getAllProblems = async (category?: string): Promise<Problem[]> => {
  try {
    const url = category 
      ? `http://localhost:5000/api/problems?category=${encodeURIComponent(category)}`
      : 'http://localhost:5000/api/problems';
    
    console.log('Fetching problems from:', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const problems: Problem[] = await response.json();
    console.log(`Fetched ${category} problems:`, problems);
    return problems;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
};

export const getProblemById = async (problemNum: string): Promise<Problem> => {
  try {
    const url = `http://localhost:5000/api/problem/${encodeURIComponent(problemNum)}`;
    console.log('Fetching problem details from:', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Problem with ID ${problemNum} not found`);
    }

    const problem: Problem = await response.json();
    console.log('Fetched problem details:', problem);
    return problem;
  } catch (error) {
    console.error('Error fetching problem details:', error);
    throw error;
  }
};

export const getProblemInstance = async (problemNum: string, userId: string): Promise<ProblemInstance | null> => {
  try {
    const url = `http://localhost:5000/api/problem-instances/${encodeURIComponent(problemNum)}/${encodeURIComponent(userId)}`;
    console.log('Fetching problem instance from:', url);

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No instance found for problem ${problemNum} and user ${userId}`);
        return null;
      }
      throw new Error(`Failed to fetch problem instance. Status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate the startedAt date before returning
    if (data && data.startedAt) {
      const startDate = new Date(data.startedAt);
      if (isNaN(startDate.getTime())) {
        console.log('Invalid startedAt date detected, setting to current date');
        data.startedAt = new Date().toISOString();
      }
    }
    
    console.log('Fetched problem instance:', data);
    return data;
  } catch (error) {
    console.error('Error fetching problem instance:', error);
    return null;
  }
};

export const createProblemInstance = async (problemInstance: ProblemInstance): Promise<{instanceId: string, message: string}> => {
  try {
    if (!problemInstance.problemNum) {
      throw new Error('Problem number is required');
    }
    
    const instanceData = {
      ...problemInstance,
      problemNum: String(problemInstance.problemNum),
      gitUsername: problemInstance.gitUsername
    };

    const url = 'http://localhost:5000/api/problem-instances';
    console.log('Creating new problem instance:', instanceData);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(instanceData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || `Failed to create problem instance. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Problem instance created:', result);
    return result;
  } catch (error) {
    console.error('Error in createProblemInstance:', error);
    throw error;
  }
};

export const updateProblemInstanceStatus = async (instanceId: string, statusUpdate: { status: string, completedAt?: string }): Promise<{message: string}> => {
  try {
    const url = `http://localhost:5000/api/problem-instances/${instanceId}`;
    console.log(`Updating problem instance ${instanceId} status:`, statusUpdate);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statusUpdate)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update problem instance status. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Status updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating problem instance status:', error);
    throw error;
  }
};

export const addCollaborator = async (instanceId: string, collaborator: Collaborator): Promise<{message: string}> => {
  try {
    const url = `http://localhost:5000/api/problem-instances/${instanceId}/collaborators`;
    console.log(`Adding collaborator to problem instance ${instanceId}:`, collaborator);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(collaborator)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to add collaborator. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Collaborator added:', result);
    return result;
  } catch (error) {
    console.error('Error adding collaborator:', error);
    throw error;
  }
};

export const updateProblemInstanceCollaboration = async (
  instanceId: string, 
  collaborationMode: 'solo' | 'pair'
): Promise<{message: string}> => {
  try {
    const url = `http://localhost:5000/api/problem-instances/${instanceId}`;
    console.log(`Updating problem instance ${instanceId} collaboration mode:`, collaborationMode);

    const updateData = {
      collaborationMode,
      lastUpdatedAt: new Date().toISOString()
    };

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update collaboration mode. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Collaboration mode updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating collaboration mode:', error);
    throw error;
  }
};

export const updateProblemInstanceCollaborator = async (
  instanceId: string, 
  email: string
): Promise<{message: string}> => {
  try {
    const url = `http://localhost:5000/api/problem-instances/${instanceId}`;
    console.log(`Adding collaborator email ${email} to problem instance ${instanceId}`);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lastUpdatedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update collaborator. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Collaborator email added:', result);
    return result;
  } catch (error) {
    console.error('Error updating collaborator:', error);
    throw error;
  }
};

export const updateCollaboratorSubtaskAssignments = async (
  instanceId: string,
  assignments: Record<string, string>
): Promise<{message: string}> => {
  try {
    console.log(`Updating subtask assignments for instance ${instanceId}:`, assignments);
    
    // Get problemNum and userId from localStorage to fetch the instance correctly
    const urlParts = window.location.pathname.split('/');
    const problemNum = urlParts[urlParts.length - 1]; 
    const userId = localStorage.getItem('userId');
    
    if (!problemNum || !userId) {
      throw new Error('Could not determine problem number or user ID from the current context');
    }
    
    const getUrl = `http://localhost:5000/api/problem-instances/${encodeURIComponent(problemNum)}/${encodeURIComponent(userId)}`;
    const getResponse = await fetch(getUrl);
    
    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      console.error('Failed to fetch current problem instance:', errorText);
      throw new Error(`Failed to fetch current problem instance. Status: ${getResponse.status}`);
    }
    
    const currentInstance = await getResponse.json();
    console.log('Current instance data:', currentInstance);
    
    if (!currentInstance) {
      throw new Error('Problem instance not found');
    }
    
    // Group assignments by user
    const assignmentsByUser = Object.entries(assignments).reduce((acc, [subtaskId, userId]) => {
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(parseInt(subtaskId, 10));
      return acc;
    }, {} as Record<string, number[]>);
    
    console.log('Grouped assignments by user:', assignmentsByUser);
    
    // Update collaborators with arrays of subtask assignments
    const updatedCollaborators = currentInstance.collaborators?.map(collaborator => {
      const assignedSubtasks = assignmentsByUser[collaborator.userId] || [];
      
      if (assignedSubtasks.length > 0) {
        return {
          ...collaborator,
          subtask: assignedSubtasks // Now storing an array of subtasks
        };
      }
      
      return collaborator;
    }) || [];
    
    // Handle owner assignments
    const ownerAssignedSubtasks = assignmentsByUser[currentInstance.owner.userId] || [];
    
    const payload: any = {
      collaborators: updatedCollaborators,
      lastUpdatedAt: new Date().toISOString()
    };
    
    // If owner has assignments and isn't already in collaborators
    if (ownerAssignedSubtasks.length > 0) {
      const ownerAlreadyInCollaborators = updatedCollaborators.some(
        c => c.userId === currentInstance.owner.userId
      );
      
      if (!ownerAlreadyInCollaborators) {
        payload.collaborators.push({
          userId: currentInstance.owner.userId,
          username: currentInstance.owner.username,
          email: currentInstance.owner.email,
          status: 'active',
          subtask: ownerAssignedSubtasks // Now storing an array of subtasks
        });
      }
    }
    
    console.log('Sending payload to update collaborators:', payload);
    
    const updateUrl = `http://localhost:5000/api/problem-instances/${instanceId}`;
    const response = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null) || await response.text();
      console.error('Error response from server:', errorData);
      throw new Error(typeof errorData === 'object' && errorData.error 
        ? errorData.error 
        : `Failed to update collaborator subtasks. Status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Subtask assignments updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating subtask assignments:', error);
    throw error;
  }
};

export interface Collaborator {
  userId: string;
  username: string;
  email: string;
}

interface BranchSetupRequest {
  repoUrl: string;
  username: string;
  branchOff: string;
  branchTo: string;
}

interface BranchSetupResponse {
  message: string;
  gitCommands?: string[];
}

export const setupGitBranch = async (request: BranchSetupRequest): Promise<BranchSetupResponse> => {
  try {
    const url = 'http://localhost:5000/api/git/create-branch';
    console.log('Setting up git branch with:', request);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    console.log('Git branch setup response status:', response.status);
    
    // Try to get the response body regardless of status
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    let responseData: BranchSetupResponse;
    try {
      responseData = JSON.parse(responseText);
      console.log('Parsed response data:', responseData);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      responseData = { message: 'Unable to parse server response' };
    }

    if (!response.ok) {
      console.error('Git branch setup error:', responseData);
      throw new Error(responseData.message || `Failed to setup git branch. Status: ${response.status}`);
    }

    console.log('Git branch setup result:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error in setupGitBranch:', error);
    throw error;
  }
};
