import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Video, 
  FileText,
  Sparkles,
  Settings
} from 'lucide-react';
import { Switch } from './ui/switch';

export const VideoUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [aiFeatures, setAiFeatures] = useState({
    speechToText: true,
    autoStoryline: false,
    voiceEnhancement: true
  });
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('video/')
    );
    onDrop(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith('video/')
      );
      onDrop(selectedFiles);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          // Navigate to editor with the project
          navigate('/editor/new');
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Upload Video</h1>
        <p className="text-muted-foreground mt-2">
          Upload your MP4 files and let AI enhance your video editing workflow
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Files</CardTitle>
            <CardDescription>
              Drag and drop your MP4 files or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Drop your videos here</h3>
              <p className="text-muted-foreground mb-4">
                Supports MP4, MOV, AVI files up to 2GB each
              </p>
              <Button>
                <File className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold">Selected Files</h4>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Video className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Settings */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-input-background"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your project"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-input-background"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Features
              </CardTitle>
              <CardDescription>
                Enable AI-powered enhancements for your video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Speech-to-Text</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically transcribe audio to text
                  </p>
                </div>
                <Switch
                  checked={aiFeatures.speechToText}
                  onCheckedChange={(checked) =>
                    setAiFeatures(prev => ({ ...prev, speechToText: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto Storyline</Label>
                  <p className="text-xs text-muted-foreground">
                    Generate storyline suggestions
                  </p>
                </div>
                <Switch
                  checked={aiFeatures.autoStoryline}
                  onCheckedChange={(checked) =>
                    setAiFeatures(prev => ({ ...prev, autoStoryline: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Voice Enhancement</Label>
                  <p className="text-xs text-muted-foreground">
                    Improve audio quality automatically
                  </p>
                </div>
                <Switch
                  checked={aiFeatures.voiceEnhancement}
                  onCheckedChange={(checked) =>
                    setAiFeatures(prev => ({ ...prev, voiceEnhancement: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Button */}
          <div className="space-y-3">
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className="w-full"
              size="lg"
            >
              {uploading ? (
                <>
                  <Settings className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Start Upload & Processing
                </>
              )}
            </Button>
            
            {files.length > 0 && !uploading && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {files.length} file(s) ready to upload
                </p>
              </div>
            )}
          </div>

          {/* Processing Info */}
          <Card className="bg-blue-50/50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-blue-900">Processing Time</h4>
                  <p className="text-xs text-blue-700">
                    AI processing typically takes 2-5 minutes per minute of video content.
                    You'll be notified when processing is complete.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};