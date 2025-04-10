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

    const instance: ProblemInstance = await response.json();
    console.log('Fetched problem instance:', instance);
    return instance;
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

    const existingInstance = await getProblemInstance(
      instanceData.problemNum, 
      instanceData.owner.userId
    );

    let url = 'http://localhost:5000/api/problem-instances';
    let method = 'POST';
    
    if (existingInstance && existingInstance._id) {
      url = `http://localhost:5000/api/problem-instances/${existingInstance._id}`;
      method = 'PATCH';
      console.log('Updating existing problem instance:', existingInstance._id);
      
      instanceData.lastUpdatedAt = new Date().toISOString();
      
      // Ensure we're keeping the existing status if it's not provided in the update
      if (!instanceData.status && existingInstance.status) {
        instanceData.status = existingInstance.status;
      }
      
      // If no status exists at all, set a default one for updates
      if (!instanceData.status) {
        instanceData.status = 'in-progress';
      }
    } else {
      instanceData.startedAt = new Date().toISOString();
      instanceData.lastUpdatedAt = instanceData.startedAt;
      instanceData.status = 'in-progress';
    }
    
    console.log(`${method === 'POST' ? 'Creating' : 'Updating'} problem instance:`, instanceData);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(instanceData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || `Failed to ${method === 'POST' ? 'create' : 'update'} problem instance. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`Problem instance ${method === 'POST' ? 'created' : 'updated'}:`, result);
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

export interface Collaborator {
  userId: string;
  username: string;
  email: string;
}
