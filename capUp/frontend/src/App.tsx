import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/landing-page';
import { LoginPage } from './components/login-page';
import { SignupPage } from './components/signup-page';
import { Dashboard } from './components/dashboard';
import { VideoUpload } from './components/video-upload';
import { VideoEditor } from './components/video-editor';
import { VideoLibrary } from './components/video-library';
import { TemplatesGallery } from './components/templates-gallery';
import { SettingsPage } from './components/settings-page';
import { AppLayout } from './components/app-layout';

// User context for authentication state
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
            
            {/* Protected routes with app layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <AppLayout>
                  <VideoUpload />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/editor/:id?" element={
              <ProtectedRoute>
                <AppLayout>
                  <VideoEditor />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute>
                <AppLayout>
                  <VideoLibrary />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/templates" element={
              <ProtectedRoute>
                <AppLayout>
                  <TemplatesGallery />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}