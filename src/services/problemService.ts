
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
}

export interface ProblemInstance {
  problemNum: string;  // Explicitly define as string
  owner: ProblemInstanceOwner;
  collaborationMode: 'solo' | 'pair';
  status?: string;
  startedAt?: string;
  lastUpdatedAt?: string;
  completedAt?: string | null;
  _id?: string;
  collaborators?: any[];
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
      problemNum: String(problemInstance.problemNum)
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
    
    // First get the current instance to access existing collaborators
    const url = `http://localhost:5000/api/problem-instances/${instanceId}`;
    const getResponse = await fetch(url);
    
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
    
    // Create a map of subtaskId to numeric step value
    const subtaskStepMap: Record<string, number> = {};
    for (const [subtaskId, userId] of Object.entries(assignments)) {
      // Try to parse the subtask ID to get the step number
      try {
        // The subtask ID could be in various formats, try to extract a numeric value
        const stepNumber = parseInt(subtaskId, 10);
        if (!isNaN(stepNumber)) {
          subtaskStepMap[userId] = stepNumber;
        }
      } catch (error) {
        console.warn(`Could not parse step number from subtask ID: ${subtaskId}`);
      }
    }
    
    console.log('Subtask step map:', subtaskStepMap);
    
    // Start with an empty collaborators array if none exists
    const updatedCollaborators = currentInstance.collaborators || [];
    
    // Update existing collaborators with subtask assignments
    const updatedCollaboratorsList = updatedCollaborators.map(collaborator => {
      const subtaskStep = subtaskStepMap[collaborator.userId];
      if (subtaskStep !== undefined) {
        return {
          ...collaborator,
          subtask: subtaskStep
        };
      }
      return collaborator;
    });
    
    // Check if owner has an assignment
    if (currentInstance.owner && subtaskStepMap[currentInstance.owner.userId] !== undefined) {
      // Find if owner is already in the collaborators list
      const ownerIndex = updatedCollaboratorsList.findIndex(
        collab => collab.userId === currentInstance.owner.userId
      );
      
      if (ownerIndex >= 0) {
        // Update existing entry
        updatedCollaboratorsList[ownerIndex].subtask = subtaskStepMap[currentInstance.owner.userId];
      } else {
        // Add owner to collaborators list with subtask
        updatedCollaboratorsList.push({
          userId: currentInstance.owner.userId,
          username: currentInstance.owner.username,
          email: currentInstance.owner.email,
          status: 'active',
          subtask: subtaskStepMap[currentInstance.owner.userId]
        });
      }
    }
    
    console.log('Updated collaborators list:', updatedCollaboratorsList);
    
    // Send PATCH request with updated collaborators
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collaborators: updatedCollaboratorsList,
        lastUpdatedAt: new Date().toISOString()
      })
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
