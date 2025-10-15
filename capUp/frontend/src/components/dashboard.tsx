import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Upload, 
  Video, 
  Edit3, 
  Clock, 
  PlayCircle, 
  MoreVertical,
  Plus,
  TrendingUp,
  Users,
  Eye
} from 'lucide-react';
import { useAuth } from '../App';

export const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for recent projects
  const recentProjects = [
    {
      id: 1,
      title: 'Product Demo Video',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop',
      duration: '02:34',
      status: 'completed',
      created: '2 days ago',
      views: 1200
    },
    {
      id: 2,
      title: 'Marketing Campaign',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      duration: '01:45',
      status: 'processing',
      created: '1 day ago',
      views: 0,
      progress: 75
    },
    {
      id: 3,
      title: 'Tutorial Series Ep 1',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      duration: '05:12',
      status: 'draft',
      created: '3 hours ago',
      views: 0
    }
  ];

  const quickActions = [
    {
      title: 'Upload Video',
      description: 'Start with your own MP4 file',
      icon: Upload,
      href: '/upload',
      color: 'bg-blue-500'
    },
    {
      title: 'Create from Template',
      description: 'Use AI-powered templates',
      icon: Video,
      href: '/templates',
      color: 'bg-purple-500'
    },
    {
      title: 'Start Editing',
      description: 'Jump into the editor',
      icon: Edit3,
      href: '/editor',
      color: 'bg-green-500'
    }
  ];

  const stats = [
    {
      title: 'Total Videos',
      value: '24',
      change: '+12%',
      icon: Video
    },
    {
      title: 'Total Views',
      value: '15.2K',
      change: '+8.3%',
      icon: Eye
    },
    {
      title: 'Processing Time',
      value: '2.4 min',
      change: '-15%',
      icon: Clock
    },
    {
      title: 'Team Members',
      value: '3',
      change: '+1',
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-2">
            Let's create something amazing with AI-powered video editing
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex gap-3">
          <Link to="/upload">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
          <Button variant="outline">
            <PlayCircle className="w-4 h-4 mr-2" />
            Watch Tutorial
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with these common video editing tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.href}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Link to="/library">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="relative">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-16 h-10 object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded flex items-center justify-center">
                      <PlayCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{project.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{project.duration}</span>
                      <span>•</span>
                      <span>{project.created}</span>
                      {project.views > 0 && (
                        <>
                          <span>•</span>
                          <span>{project.views} views</span>
                        </>
                      )}
                    </div>
                    {project.status === 'processing' && project.progress && (
                      <div className="mt-2">
                        <Progress value={project.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        project.status === 'completed'
                          ? 'default'
                          : project.status === 'processing'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {project.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Features Card */}
        <Card>
          <CardHeader>
            <CardTitle>AI Features</CardTitle>
            <CardDescription>
              Explore our latest AI-powered tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
              <h4 className="font-semibold mb-2">Auto Storyline Generator</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Let AI create compelling narratives for your videos automatically
              </p>
              <Button size="sm" variant="outline">Try Now</Button>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg">
              <h4 className="font-semibold mb-2">Smart Dubbing</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Convert text to natural speech with multiple voice options
              </p>
              <Button size="sm" variant="outline">Explore</Button>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg">
              <h4 className="font-semibold mb-2">Speech Recognition</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Automatically transcribe audio to text with high accuracy
              </p>
              <Button size="sm" variant="outline">Learn More</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};