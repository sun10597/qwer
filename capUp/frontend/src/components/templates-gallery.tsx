import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Filter, 
  Play, 
  Clock, 
  Star,
  Crown,
  Zap,
  Video,
  Briefcase,
  GraduationCap,
  Heart,
  Gamepad2,
  ShoppingBag,
  Music,
  Sparkles
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const TemplatesGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All Templates', icon: Video },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'social', label: 'Social Media', icon: Heart },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag },
    { id: 'music', label: 'Music', icon: Music }
  ];

  // Mock template data
  const templates = [
    {
      id: 1,
      title: 'Product Launch Announcement',
      description: 'Professional template for announcing new products with dynamic animations',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=225&fit=crop',
      category: 'business',
      duration: '00:45',
      premium: false,
      rating: 4.8,
      uses: 1250,
      tags: ['product', 'launch', 'professional', 'animated']
    },
    {
      id: 2,
      title: 'Social Media Story Template',
      description: 'Trendy vertical template perfect for Instagram and TikTok stories',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop',
      category: 'social',
      duration: '00:15',
      premium: true,
      rating: 4.9,
      uses: 3420,
      tags: ['social', 'story', 'instagram', 'vertical']
    },
    {
      id: 3,
      title: 'Educational Course Intro',
      description: 'Clean and engaging template for online course introductions',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      category: 'education',
      duration: '01:20',
      premium: false,
      rating: 4.7,
      uses: 890,
      tags: ['education', 'course', 'intro', 'clean']
    },
    {
      id: 4,
      title: 'Gaming Montage Highlight',
      description: 'High-energy template with flashy effects for gaming content',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop',
      category: 'gaming',
      duration: '02:30',
      premium: true,
      rating: 4.9,
      uses: 2150,
      tags: ['gaming', 'montage', 'effects', 'energy']
    },
    {
      id: 5,
      title: 'Corporate Presentation',
      description: 'Professional corporate template with data visualization elements',
      thumbnail: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=225&fit=crop',
      category: 'business',
      duration: '03:00',
      premium: false,
      rating: 4.6,
      uses: 680,
      tags: ['corporate', 'presentation', 'data', 'professional']
    },
    {
      id: 6,
      title: 'E-commerce Product Showcase',
      description: 'Stylish template to showcase products with smooth transitions',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      category: 'ecommerce',
      duration: '01:15',
      premium: true,
      rating: 4.8,
      uses: 1890,
      tags: ['ecommerce', 'product', 'showcase', 'smooth']
    },
    {
      id: 7,
      title: 'Music Video Visualizer',
      description: 'Dynamic audio-reactive template perfect for music content',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
      category: 'music',
      duration: '04:00',
      premium: true,
      rating: 4.9,
      uses: 2780,
      tags: ['music', 'visualizer', 'audio-reactive', 'dynamic']
    },
    {
      id: 8,
      title: 'Tutorial Step-by-Step',
      description: 'Clear instructional template with callouts and annotations',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
      category: 'education',
      duration: '02:45',
      premium: false,
      rating: 4.7,
      uses: 1540,
      tags: ['tutorial', 'instructional', 'callouts', 'annotations']
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (templateId: number) => {
    // Navigate to editor with template
    navigate(`/editor/template-${templateId}`);
  };

  const handlePreviewTemplate = (templateId: number) => {
    // Mock preview functionality
    alert(`Previewing template ${templateId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Template Gallery</h1>
        <p className="text-muted-foreground mt-2">
          Choose from our collection of professionally designed video templates
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <Button
              key={category.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span>{category.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse different categories
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={template.thumbnail}
                    alt={template.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePreviewTemplate(template.id)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{template.duration}</span>
                  </div>

                  {/* Premium badge */}
                  {template.premium && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>Pro</span>
                    </div>
                  )}

                  {/* AI badge for auto-generated templates */}
                  {template.id <= 3 && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI</span>
                    </div>
                  )}
                </div>

                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base line-clamp-1">{template.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    {/* Rating and Usage */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{template.rating}</span>
                      </div>
                      <span className="text-muted-foreground">{template.uses} uses</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      {template.premium ? (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Use Pro Template
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Use Template
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Premium Upsell */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                Unlock Premium Templates
              </h3>
              <p className="text-muted-foreground">
                Get access to exclusive high-quality templates and advanced AI features
              </p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};