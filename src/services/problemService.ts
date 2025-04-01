
interface Problem {
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
    step: number;
    description: string;
  }>;
  resources: Array<{
    type: string;
    url: string;
    description: string;
  }>;
}

export const getAllProblems = async (category?: string): Promise<Problem[]> => {
  try {
    // In a real implementation, we would use an actual API URL
    // For now, we'll simulate an API call with mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Mock data for different categories
    const mockProblems: Record<string, Problem[]> = {
      'data-science': [
        {
          problem_num: "1",
          title: "Student Connection Channel Prediction",
          description: "Develop an AI model that takes in parameters about student connection and returns the most preferred channel to reach out to them.",
          longDescription: "This is a detailed description providing comprehensive information about the student connection prediction problem.",
          difficulty: "Intermediate",
          category: "data-science",
          requirements: {
            time: "3-4 hours",
            skills: ["Python", "Machine Learning", "Data Analysis"],
            prerequisites: ["Basic understanding of ML algorithms"]
          },
          tags: ["Machine Learning", "Data Preprocessing", "API Development"],
          steps: [
            { step: 1, description: "Collect and analyze student data" },
            { step: 2, description: "Preprocess and clean the data" },
            { step: 3, description: "Train a machine learning model" },
            { step: 4, description: "Evaluate model performance" },
            { step: 5, description: "Deploy and integrate the model" }
          ],
          resources: [
            { type: "Documentation", url: "https://example.com/docs", description: "Official documentation" },
            { type: "Tutorial", url: "https://example.com/tutorial", description: "Step-by-step tutorial" }
          ]
        },
        {
          problem_num: "2",
          title: "Customer Churn Prediction",
          description: "Build a predictive model to identify customers who are likely to churn based on historical behavior data.",
          longDescription: "Comprehensive details about the customer churn prediction problem and methodologies.",
          difficulty: "Advanced",
          category: "data-science",
          requirements: {
            time: "4-5 hours",
            skills: ["Python", "Classification Algorithms", "Feature Engineering"],
            prerequisites: ["Experience with predictive modeling"]
          },
          tags: ["Classification", "Feature Engineering", "Model Deployment"],
          steps: [
            { step: 1, description: "Understand business context and data" },
            { step: 2, description: "Perform exploratory data analysis" },
            { step: 3, description: "Build and train various models" },
            { step: 4, description: "Evaluate and select the best model" }
          ],
          resources: [
            { type: "Article", url: "https://example.com/churn-article", description: "Best practices for churn prediction" },
            { type: "Dataset", url: "https://example.com/churn-dataset", description: "Sample churn dataset" }
          ]
        },
        {
          problem_num: "3",
          title: "Data Visualization Dashboard",
          description: "Create an interactive dashboard to visualize key metrics from a dataset.",
          longDescription: "Complete details about building an effective data visualization dashboard.",
          difficulty: "Beginner",
          category: "data-science",
          requirements: {
            time: "2-3 hours",
            skills: ["Data Visualization", "Python/R", "Dashboard Design"],
            prerequisites: ["Basic programming skills"]
          },
          tags: ["Data Visualization", "Dashboard", "Analytics"],
          steps: [
            { step: 1, description: "Identify key metrics to visualize" },
            { step: 2, description: "Design dashboard layout" },
            { step: 3, description: "Implement interactive visualizations" }
          ],
          resources: [
            { type: "Tutorial", url: "https://example.com/dashboard-tutorial", description: "Dashboard creation tutorial" },
            { type: "Tool", url: "https://example.com/dashboard-tool", description: "Dashboard tools comparison" }
          ]
        }
      ],
      'software-dev': [
        {
          problem_num: "1",
          title: "E-commerce Product Recommendation System",
          description: "Design and implement a microservice-based product recommendation engine for an e-commerce platform.",
          longDescription: "In-depth explanation of building a recommendation system for e-commerce products.",
          difficulty: "Advanced",
          category: "software-dev",
          requirements: {
            time: "5-6 hours",
            skills: ["Microservices Architecture", "API Design", "Recommendation Algorithms"],
            prerequisites: ["Experience with distributed systems"]
          },
          tags: ["Microservices", "Docker", "API Design"],
          steps: [
            { step: 1, description: "Design microservice architecture" },
            { step: 2, description: "Implement recommendation algorithms" },
            { step: 3, description: "Develop API interfaces" },
            { step: 4, description: "Containerize services" },
            { step: 5, description: "Set up service orchestration" },
            { step: 6, description: "Test and deploy" }
          ],
          resources: [
            { type: "Documentation", url: "https://example.com/microservices", description: "Microservices best practices" },
            { type: "Tool", url: "https://example.com/docker", description: "Docker documentation" }
          ]
        },
        {
          problem_num: "2",
          title: "Real-time Chat Application",
          description: "Build a scalable real-time chat application with user authentication and message persistence.",
          longDescription: "Detailed guide for building a real-time chat application with all required features.",
          difficulty: "Intermediate",
          category: "software-dev",
          requirements: {
            time: "4-5 hours",
            skills: ["WebSockets", "Authentication", "Database Design"],
            prerequisites: ["Basic web development knowledge"]
          },
          tags: ["WebSockets", "Authentication", "Database Design"],
          steps: [
            { step: 1, description: "Set up WebSocket server" },
            { step: 2, description: "Implement authentication system" },
            { step: 3, description: "Design database schema for messages" },
            { step: 4, description: "Develop frontend interface" },
            { step: 5, description: "Implement message persistence" }
          ],
          resources: [
            { type: "Tutorial", url: "https://example.com/websocket-tutorial", description: "WebSocket implementation guide" },
            { type: "Article", url: "https://example.com/auth-article", description: "Authentication best practices" }
          ]
        },
        {
          problem_num: "3",
          title: "Responsive Portfolio Website",
          description: "Create a responsive portfolio website using modern web technologies.",
          longDescription: "Complete guide to building a professional portfolio website with responsive design.",
          difficulty: "Beginner",
          category: "software-dev",
          requirements: {
            time: "2-3 hours",
            skills: ["HTML/CSS", "Responsive Design", "JavaScript"],
            prerequisites: ["Basic web development knowledge"]
          },
          tags: ["HTML/CSS", "Responsive Design", "JavaScript"],
          steps: [
            { step: 1, description: "Design website layout" },
            { step: 2, description: "Implement HTML structure" },
            { step: 3, description: "Style with CSS" },
            { step: 4, description: "Add responsive behavior" }
          ],
          resources: [
            { type: "Tutorial", url: "https://example.com/responsive-tutorial", description: "Responsive design tutorial" },
            { type: "Tool", url: "https://example.com/design-tool", description: "Web design tools" }
          ]
        }
      ]
    };

    // Return problems based on category
    if (category) {
      return mockProblems[category] || [];
    }
    
    // Return all problems if no category specified
    return Object.values(mockProblems).flat();
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
};

export const getProblemById = async (problemNum: string): Promise<Problem> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fetch all problems and find the one matching the ID
    const allProblems = await getAllProblems();
    const problem = allProblems.find(p => p.problem_num === problemNum);
    
    if (!problem) {
      throw new Error(`Problem with ID ${problemNum} not found`);
    }
    
    return problem;
  } catch (error) {
    console.error('Error fetching problem details:', error);
    throw error;
  }
};
