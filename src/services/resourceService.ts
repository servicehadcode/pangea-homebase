
// Resource service for problem resources

/**
 * Interface for resource item
 */
interface ResourceItem {
  id: string;
  problemId: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'tutorial' | 'documentation' | 'other';
  addedBy: string;
  addedAt: string;
}

/**
 * Gets resources for a problem
 * @param problemId ID of the problem
 * @returns Promise with array of resource items
 */
export const getResources = async (problemId: string): Promise<ResourceItem[]> => {
  console.log(`Getting resources for problem ${problemId}`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock data - in a real app this would come from the database
  return [
    {
      id: '1',
      problemId,
      title: 'Machine Learning Basics',
      description: 'A comprehensive guide to machine learning fundamentals',
      url: 'https://www.example.com/ml-basics',
      type: 'article',
      addedBy: 'admin',
      addedAt: '2023-09-10T10:00:00Z'
    },
    {
      id: '2',
      problemId,
      title: 'API Development with Flask',
      description: 'Learn how to develop RESTful APIs using Flask',
      url: 'https://www.example.com/flask-api',
      type: 'tutorial',
      addedBy: 'admin',
      addedAt: '2023-09-11T14:30:00Z'
    },
    {
      id: '3',
      problemId,
      title: 'Data Preprocessing Techniques',
      description: 'Advanced techniques for data preprocessing in machine learning',
      url: 'https://www.example.com/data-preprocessing',
      type: 'documentation',
      addedBy: 'admin',
      addedAt: '2023-09-12T09:15:00Z'
    }
  ];
};

/**
 * Adds a new resource
 * @param resource Resource item to add
 * @returns Promise with success status
 */
export const addResource = async (resource: Omit<ResourceItem, 'id' | 'addedAt'>): Promise<ResourceItem> => {
  console.log(`Adding resource for problem ${resource.problemId}`);
  
  // Simulate database interaction
  await new Promise(resolve => setTimeout(resolve, 250));
  
  // Generate a random resource ID
  const resourceId = Math.random().toString(36).substring(2, 10);
  
  // Create the new resource
  const newResource: ResourceItem = {
    ...resource,
    id: resourceId,
    addedAt: new Date().toISOString()
  };
  
  return newResource;
};
