import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Scissors, 
  Type, 
  Image, 
  Mic, 
  Download,
  Save,
  Undo,
  Redo,
  Sparkles,
  MessageSquare,
  FileText,
  Layers,
  Settings
} from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export const VideoEditor = () => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedTool, setSelectedTool] = useState('select');
  const [transcript, setTranscript] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock transcript data
  const mockTranscript = [
    { time: 5, text: "Welcome to our amazing product demonstration." },
    { time: 12, text: "Today we'll show you the key features that make our solution unique." },
    { time: 20, text: "First, let's look at the user interface and its intuitive design." },
    { time: 28, text: "Notice how everything is organized for maximum productivity." }
  ];

  // Mock timeline segments
  const timelineSegments = [
    { start: 0, end: 15, type: 'video', label: 'Intro Scene' },
    { start: 15, end: 35, type: 'video', label: 'Main Content' },
    { start: 35, end: 50, type: 'video', label: 'Feature Demo' },
    { start: 50, end: 65, type: 'video', label: 'Conclusion' }
  ];

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (time: number) => {
    setCurrentTime(time);
  };

  const handleSpeechToText = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setTranscript(mockTranscript.map(item => item.text).join(' '));
      setIsProcessing(false);
    }, 2000);
  };

  const handleTextToSpeech = () => {
    if (!voiceText.trim()) return;
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Voice generated successfully! It has been added to your timeline.');
    }, 3000);
  };

  const handleGenerateStoryline = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('AI storyline generated! Check the timeline for suggested scene transitions.');
    }, 2500);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Video Editor</h1>
          <Badge variant="secondary">Project: {id === 'new' ? 'Untitled Project' : `Project ${id}`}</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Redo className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-64 border-r bg-card p-4 overflow-y-auto">
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="space-y-4 mt-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <Label>Speech-to-Text</Label>
                  </div>
                  <Button 
                    onClick={handleSpeechToText} 
                    disabled={isProcessing}
                    className="w-full"
                    size="sm"
                  >
                    {isProcessing ? 'Processing...' : 'Extract Text'}
                  </Button>
                  {transcript && (
                    <Textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Extracted text will appear here..."
                      rows={4}
                      className="text-sm"
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4" />
                    <Label>Text-to-Speech</Label>
                  </div>
                  <Textarea
                    value={voiceText}
                    onChange={(e) => setVoiceText(e.target.value)}
                    placeholder="Enter text to convert to speech..."
                    rows={3}
                    className="text-sm"
                  />
                  <Button 
                    onClick={handleTextToSpeech} 
                    disabled={isProcessing || !voiceText.trim()}
                    className="w-full"
                    size="sm"
                  >
                    {isProcessing ? 'Generating...' : 'Generate Voice'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <Label>AI Storyline</Label>
                  </div>
                  <Button 
                    onClick={handleGenerateStoryline} 
                    disabled={isProcessing}
                    className="w-full"
                    size="sm"
                  >
                    {isProcessing ? 'Generating...' : 'Auto Generate'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    AI will analyze your content and suggest story improvements
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Scissors, label: 'Cut', id: 'cut' },
                  { icon: Type, label: 'Text', id: 'text' },
                  { icon: Image, label: 'Image', id: 'image' },
                  { icon: Volume2, label: 'Audio', id: 'audio' },
                  { icon: Layers, label: 'Effects', id: 'effects' },
                  { icon: Settings, label: 'Settings', id: 'settings' }
                ].map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? 'default' : 'outline'}
                      className="h-16 flex-col space-y-1"
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{tool.label}</span>
                    </Button>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Media Library</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-video bg-muted rounded border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <Image className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="aspect-video bg-muted rounded border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <Image className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Add Media
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview */}
          <div className="flex-1 bg-black flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <video
                ref={videoRef}
                className="w-full h-auto max-h-full"
                poster="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop"
              >
                <source src="" type="video/mp4" />
              </video>
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                <Button
                  size="lg"
                  className="rounded-full w-16 h-16"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="bg-card border-t p-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <SkipForward className="w-4 h-4" />
              </Button>
              
              <div className="flex-1 flex items-center space-x-2">
                <span className="text-sm font-mono">{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
                <Slider
                  value={[currentTime]}
                  onValueChange={([value]) => setCurrentTime(value)}
                  max={duration}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-mono">{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={([value]) => {
                    setVolume(value);
                    setIsMuted(value === 0);
                  }}
                  max={100}
                  step={1}
                  className="w-24"
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-muted p-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Timeline</h3>
                <Button variant="outline" size="sm">
                  <Layers className="w-4 h-4 mr-2" />
                  Add Layer
                </Button>
              </div>
              
              {/* Timeline Track */}
              <div className="relative h-20 bg-background rounded border overflow-hidden">
                <div className="flex h-full">
                  {timelineSegments.map((segment, index) => (
                    <div
                      key={index}
                      className="relative h-full bg-primary/20 border-r border-primary/30 flex items-center px-2 cursor-pointer hover:bg-primary/30 transition-colors"
                      style={{ width: `${(segment.end - segment.start) / duration * 100}%` }}
                      onClick={() => handleTimelineClick(segment.start)}
                    >
                      <span className="text-xs font-medium truncate">{segment.label}</span>
                    </div>
                  ))}
                </div>
                
                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                >
                  <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5 -mt-1"></div>
                </div>
              </div>
              
              {/* Timeline Controls */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>0:00</span>
                <div className="flex-1 border-t"></div>
                <span>0:30</span>
                <div className="flex-1 border-t"></div>
                <span>1:00</span>
                <div className="flex-1 border-t"></div>
                <span>1:30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};