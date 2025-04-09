
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
  problemNum: string;
  owner: ProblemInstanceOwner;
  collaborationMode: 'solo' | 'pair';
}

export interface Collaborator {
  userId: string;
  username: string;
  email: string;
}

export const getAllProblems = async (category?: string): Promise<Problem[]> => {
  try {
    // Log the request URL for debugging
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

export const createProblemInstance = async (problemInstance: ProblemInstance): Promise<{instanceId: string, message: string}> => {
  try {
    if (!problemInstance.problemNum) {
      throw new Error('Problem number is required');
    }
    
    // Ensure problemNum is a string
    if (typeof problemInstance.problemNum !== 'string') {
      problemInstance.problemNum = String(problemInstance.problemNum);
    }
    
    const url = 'http://localhost:5000/api/problem-instances';
    console.log('Creating problem instance:', problemInstance);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(problemInstance)
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
    console.error('Error creating problem instance:', error);
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
