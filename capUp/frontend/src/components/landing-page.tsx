import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Upload, 
  MessageSquare, 
  Mic, 
  Sparkles, 
  Edit3,
  PlayCircle,
  Users,
  Star
} from 'lucide-react';

export const LandingPage = () => {
  const features = [
    {
      icon: Upload,
      title: 'MP4 Upload',
      description: 'Easily upload your video files with drag-and-drop functionality'
    },
    {
      icon: MessageSquare,
      title: 'Speech-to-Text',
      description: 'AI-powered audio transcription with high accuracy'
    },
    {
      icon: Mic,
      title: 'Text-to-Speech Dubbing',
      description: 'Generate natural-sounding voiceovers from text'
    },
    {
      icon: Sparkles,
      title: 'AI Storyline Generation',
      description: 'Automatically create engaging video narratives'
    },
    {
      icon: Edit3,
      title: 'Advanced Video Editing',
      description: 'Professional editing tools with intuitive interface'
    },
    {
      icon: PlayCircle,
      title: 'Instant Preview',
      description: 'Real-time preview of your edits and effects'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Content Creator',
      content: 'This platform revolutionized my video creation workflow. The AI features save me hours of work!',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Marketing Director',
      content: 'The speech-to-text and dubbing features are incredibly accurate. Perfect for our global campaigns.',
      rating: 5
    },
    {
      name: 'Elena Rodriguez',
      role: 'Filmmaker',
      content: 'The automatic storyline generation gives me creative inspiration I never expected from an AI tool.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">VideoAI Studio</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI-Powered Video Creation
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your ideas into professional videos with our advanced AI tools. 
            Upload, edit, and enhance your content with speech-to-text, dubbing, and automated storytelling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="px-8 py-3">
                Start Creating Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, edit, and enhance your videos with cutting-edge AI technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Creators</h2>
            <p className="text-muted-foreground">See what our users are saying about VideoAI Studio</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Create Amazing Videos?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using AI to enhance their video content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Get Started Today
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Users className="w-5 h-5 mr-2" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">VideoAI Studio</span>
              </div>
              <p className="text-muted-foreground">
                AI-powered video creation platform for modern content creators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 VideoAI Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};