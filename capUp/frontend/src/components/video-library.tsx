import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Edit3, 
  Download, 
  Trash2, 
  Copy,
  Eye,
  Calendar,
  Clock,
  Grid3X3,
  List,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const VideoLibrary = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock video data
  const videos = [
    {
      id: 1,
      title: 'Product Demo Video',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop',
      duration: '02:34',
      status: 'published',
      created: '2024-01-15',
      views: 1250,
      size: '145 MB',
      format: 'MP4'
    },
    {
      id: 2,
      title: 'Marketing Campaign Q1',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      duration: '01:45',
      status: 'draft',
      created: '2024-01-12',
      views: 0,
      size: '98 MB',
      format: 'MP4'
    },
    {
      id: 3,
      title: 'Tutorial Series Episode 1',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      duration: '05:12',
      status: 'processing',
      created: '2024-01-10',
      views: 0,
      size: '234 MB',
      format: 'MP4'
    },
    {
      id: 4,
      title: 'Company Overview 2024',
      thumbnail: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=225&fit=crop',
      duration: '03:28',
      status: 'published',
      created: '2024-01-08',
      views: 892,
      size: '178 MB',
      format: 'MP4'
    },
    {
      id: 5,
      title: 'Customer Testimonials',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop',
      duration: '04:15',
      status: 'published',
      created: '2024-01-05',
      views: 2341,
      size: '201 MB',
      format: 'MP4'
    },
    {
      id: 6,
      title: 'Behind the Scenes',
      thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop',
      duration: '02:58',
      status: 'draft',
      created: '2024-01-03',
      views: 0,
      size: '167 MB',
      format: 'MP4'
    }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' || video.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'views':
        return b.views - a.views;
      case 'duration':
        return b.duration.localeCompare(a.duration);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedVideos.map((video) => (
        <Card key={video.id} className="group hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-t-lg flex items-center justify-center">
              <Button
                size="lg"
                className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
              >
                <Play className="w-6 h-6" />
              </Button>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold truncate" title={video.title}>
                  {video.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(video.created)}</span>
                  <span>•</span>
                  <Eye className="w-3 h-3" />
                  <span>{video.views} views</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(video.status)}>
                  {video.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/editor/${video.id}`}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-2">
      {sortedVideos.map((video) => (
        <Card key={video.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-14 object-cover rounded"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                  {video.duration}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{video.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <span>{formatDate(video.created)}</span>
                  <span>{video.size}</span>
                  <span>{video.views} views</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(video.status)}>
                  {video.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/editor/${video.id}`}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Library</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize all your video projects
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link to="/upload">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Videos</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid/List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {sortedVideos.length} video{sortedVideos.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {sortedVideos.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No videos found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterBy !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload your first video to get started'}
              </p>
              <Link to="/upload">
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'grid' ? <GridView /> : <ListView />}
          </>
        )}
      </div>
    </div>
  );
};