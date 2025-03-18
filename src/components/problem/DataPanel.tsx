
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Download,
  FileJson,
  Files,
  Database,
  AlertTriangle,
  Info,
  BarChart,
  Rows,
  Table2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DatasetMetadata {
  name: string;
  description: string;
  rows: number;
  columns: number;
  fileType: string;
  lastUpdated: string;
  size: string;
}

interface DatasetFile {
  name: string;
  format: string;
  size: string;
  url: string;
}

interface DatasetProps {
  dataset: {
    isAvailable: boolean;
    metadata?: DatasetMetadata;
    files?: DatasetFile[];
    sampleData?: any[];
  };
}

const DataPanel: React.FC<DatasetProps> = ({ dataset }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!dataset.isAvailable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Dataset Available</AlertTitle>
            <AlertDescription>
              This problem does not have an associated dataset.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  const handleDownload = (file: DatasetFile) => {
    toast({
      title: "Downloading File",
      description: `Starting download for ${file.name}.`
    });
    
    // In a real app, this would trigger an actual file download
    // For now, just simulate the download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${file.name} has been downloaded successfully.`
      });
    }, 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Dataset</CardTitle>
        <CardDescription>
          Explore and download the dataset for this problem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <Info className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="files">
              <FileJson className="h-4 w-4 mr-2" />
              Files
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Table2 className="h-4 w-4 mr-2" />
              Data Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {dataset.metadata && (
              <div className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">{dataset.metadata.name}</h3>
                  <p className="text-muted-foreground">{dataset.metadata.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Rows className="h-4 w-4 text-pangea" />
                      <span className="font-medium">Rows</span>
                    </div>
                    <p className="text-2xl font-medium">{dataset.metadata.rows.toLocaleString()}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Table2 className="h-4 w-4 text-pangea" />
                      <span className="font-medium">Columns</span>
                    </div>
                    <p className="text-2xl font-medium">{dataset.metadata.columns}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="h-4 w-4 text-pangea" />
                      <span className="font-medium">Size</span>
                    </div>
                    <p className="text-2xl font-medium">{dataset.metadata.size}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="files">
            <div className="space-y-4">
              {dataset.files && dataset.files.length > 0 ? (
                dataset.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {file.format === 'csv' ? (
                        <Files className="h-6 w-6 text-green-600" />
                      ) : file.format === 'json' ? (
                        <FileJson className="h-6 w-6 text-blue-600" />
                      ) : (
                        <Database className="h-6 w-6 text-gray-600" />
                      )}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.format.toUpperCase()} • {file.size}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No Files Available</AlertTitle>
                  <AlertDescription>
                    There are no downloadable files for this dataset at the moment.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            {dataset.sampleData && dataset.sampleData.length > 0 ? (
              <div className="border rounded-lg overflow-auto">
                <Table>
                  <TableHeader>
                    {Object.keys(dataset.sampleData[0]).map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {dataset.sampleData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <TableCell key={colIndex}>
                            {String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Preview Available</AlertTitle>
                <AlertDescription>
                  Sample data preview is not available for this dataset.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataPanel;
