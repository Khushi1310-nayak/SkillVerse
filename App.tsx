
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { CategoryView } from './components/CategoryView';
import { CourseView } from './components/CourseView';
import { Certificate } from './components/Certificate';
import { Settings } from './components/Settings';
import { CoursesList } from './components/CoursesList';
import { CertificationsList } from './components/CertificationsList';
import { CareerMode } from './components/CareerMode';
import { Onboarding } from './components/Onboarding';
import { storageService } from './services/storageService';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const storedUser = storageService.getUser();
    if (storedUser) {
      setUser(storedUser);
      // Ensure theme is applied on load
      if (storedUser.settings.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
      
      // Check onboarding status
      if (!storedUser.settings.onboardingCompleted) {
         setShowOnboarding(true);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setShowAuth(false);
    
    // Check onboarding for new login
    if (!newUser.settings.onboardingCompleted) {
        setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setShowAuth(false);
    setShowOnboarding(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleOnboardingComplete = (updatedUser: User) => {
      setUser(updatedUser);
      setShowOnboarding(false);
  };

  if (loading) return null;

  return (
    <HashRouter>
      {!user && !showAuth ? (
        <LandingPage onGetStarted={() => setShowAuth(true)} />
      ) : showOnboarding && user ? (
        <Onboarding user={user} onComplete={handleOnboardingComplete} />
      ) : (
        <Layout user={user} onLogout={handleLogout}>
          <Routes>
            <Route 
              path="/" 
              element={user ? <Dashboard user={user} /> : <Auth onLogin={handleLogin} />} 
            />
            <Route 
              path="/courses" 
              element={user ? <CoursesList /> : <Navigate to="/" />} 
            />
            <Route 
              path="/career" 
              element={user ? <CareerMode /> : <Navigate to="/" />} 
            />
            <Route 
              path="/certifications" 
              element={user ? <CertificationsList /> : <Navigate to="/" />} 
            />
            <Route 
              path="/settings" 
              element={user ? <Settings user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/category/:id" 
              element={user ? <CategoryView /> : <Navigate to="/" />} 
            />
            <Route 
              path="/course/:id" 
              element={user ? <CourseView /> : <Navigate to="/" />} 
            />
            <Route 
              path="/certificate/:id" 
              element={user ? <Certificate /> : <Navigate to="/" />} 
            />
          </Routes>
        </Layout>
      )}
    </HashRouter>
  );
}

export default App;
