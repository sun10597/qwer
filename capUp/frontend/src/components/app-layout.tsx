import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from './ui/sidebar';
import { 
  Home, 
  Upload, 
  Edit3, 
  Video, 
  FileImage, 
  Settings, 
  User,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../App';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: Home,
        },
        {
          title: 'Upload Video',
          url: '/upload',
          icon: Upload,
        },
        {
          title: 'Video Editor',
          url: '/editor',
          icon: Edit3,
        }
      ]
    },
    {
      title: 'Library',
      items: [
        {
          title: 'My Videos',
          url: '/library',
          icon: Video,
        },
        {
          title: 'Templates',
          url: '/templates',
          icon: FileImage,
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
        }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar variant="inset" className="border-r">
          <SidebarContent>
            {/* Logo */}
            <div className="p-4 border-b">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
                <span className="font-bold text-lg">VideoAI Studio</span>
              </Link>
            </div>

            {/* Navigation */}
            {navigationItems.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.url || 
                        (item.url === '/editor' && location.pathname.startsWith('/editor'));
                      
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive}
                          >
                            <Link to={item.url} className="flex items-center">
                              <Icon className="w-4 h-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search videos, templates..."
                  className="pl-10 bg-input-background"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-background">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};