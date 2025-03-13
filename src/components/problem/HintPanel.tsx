
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  HelpCircle, 
  AlertTriangle, 
  Terminal, 
  X,
  Code,
  LightbulbIcon
} from 'lucide-react';

interface HintPanelProps {
  problem: any;
  currentStep: any;
  onClose: () => void;
}

const HintPanel: React.FC<HintPanelProps> = ({ 
  problem,
  currentStep,
  onClose
}) => {
  const hints = [
    {
      title: `How to approach ${currentStep.title}?`,
      content: `Break down ${currentStep.title} into smaller tasks. Start by understanding the requirements, then plan your approach before implementation.`,
      type: 'tip'
    },
    {
      title: "Stuck with Git commands?",
      content: "To create a branch: git checkout -b branch-name\nTo push changes: git push origin branch-name",
      type: 'code'
    },
    {
      title: `Common pitfall in ${currentStep.title}`,
      content: "Many users forget to validate their inputs and handle edge cases. Make sure your solution is robust.",
      type: 'warning'
    }
  ];
  
  const codeHint = currentStep.title.toLowerCase().includes('dataset') ? 
    `# Example code for dataset analysis
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
df = pd.read_csv('dataset.csv')

# View basic statistics
print(df.describe())

# Check for missing values
print(df.isnull().sum())

# Calculate correlation
correlation = df.corr()
sns.heatmap(correlation, annot=True)
plt.show()` : 
    `// Example implementation snippet
function processData(inputData) {
  // Validate input
  if (!inputData || !Array.isArray(inputData)) {
    throw new Error('Invalid input data');
  }
  
  // Process data
  return inputData.map(item => {
    // Your transformation logic here
    return {
      ...item,
      processed: true
    };
  });
}`;

  return (
    <Card className="shadow-lg animate-in fade-in slide-in-from-right-5 duration-200">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <HelpCircle className="h-5 w-5 mr-2 text-pangea" />
          Quick Help
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
        {hints.map((hint, index) => (
          <div key={index} className="p-3 bg-secondary/30 rounded-lg">
            <h3 className="flex items-center gap-2 font-medium mb-1">
              {hint.type === 'tip' && <LightbulbIcon className="h-4 w-4 text-pangea" />}
              {hint.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
              {hint.type === 'code' && <Terminal className="h-4 w-4 text-pangea" />}
              {hint.title}
            </h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {hint.content}
            </p>
          </div>
        ))}
        
        <Separator />
        
        <div className="p-3 bg-secondary/30 rounded-lg">
          <h3 className="flex items-center gap-2 font-medium mb-2">
            <Code className="h-4 w-4 text-pangea" />
            Helpful Code Snippet
          </h3>
          <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-xs">
            {codeHint}
          </pre>
        </div>
        
        <Button variant="outline" className="w-full">
          <HelpCircle className="h-4 w-4 mr-2" />
          Ask for More Help
        </Button>
      </CardContent>
    </Card>
  );
};

export default HintPanel;
