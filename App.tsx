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
import { CredentialVerification } from './components/CredentialVerification';
import { DocumentationPage } from './components/DocumentationPage';
import { CustomCursor } from './components/CustomCursor';import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { storageService } from './services/storageService'; // Will clean up storageService next
import  NotFound  from './components/NotFound';

const AppRoutes = () => {
  const { user, appUser, logout, updateUserSettings, updateUserAccount, updateLocalUser, } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
     if (appUser && !appUser.settings.onboardingCompleted) {
         setShowOnboarding(true);
     } else {
         setShowOnboarding(false);
     }
  }, [appUser]);

  const handleUpdateUser = async (updatedUser: any) => {
     await updateUserAccount(updatedUser);
  };

  const handlePreviewUpdate = (updatedUser: any) => {
   updateLocalUser(updatedUser);
};

  const handleOnboardingComplete = async (updatedUser: any) => {
      await updateUserSettings(updatedUser.settings);
      setShowOnboarding(false);
  };

  const handleLogout = async () => {
      await logout();
      setShowAuth(false);
  };

  return (
      <Routes>
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/credential/:token" element={<CredentialVerification />} />
        
        {/* Verification Wall */}
        <Route path="/verify-email" element={
            user && (!user.emailVerified && user.providerData[0]?.providerId === "password") ? 
               <Auth /> : <Navigate to="/" replace />
        } />

        <Route path="/*" element={
          !user && !showAuth ? (
            <LandingPage onGetStarted={() => setShowAuth(true)} />
          ) : !user && showAuth ? (
            <Auth />
          ) : showOnboarding && appUser ? (
            <ProtectedRoute requireVerification={false}>
               <Onboarding user={appUser} onComplete={handleOnboardingComplete} />
            </ProtectedRoute>
          ) : (
            <ProtectedRoute>
              {appUser && (
                  <Layout user={appUser} onLogout={handleLogout}>
                    <Routes>
                      <Route path="/" element={<Dashboard user={appUser} />} />
                      <Route path="/courses" element={<CoursesList />} />
                      <Route path="/career" element={<CareerMode />} />
                      <Route path="/certifications" element={<CertificationsList />} />
                      <Route path="/settings" element={<Settings user={appUser} onPreviewUpdate={handlePreviewUpdate} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />} />
                      <Route path="/category/:id" element={<CategoryView />} />
                      <Route path="/course/:id" element={<CourseView />} />
                      <Route path="/certificate/:id" element={<Certificate />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
              )}
            </ProtectedRoute>
          )
        } />
      </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
       <HashRouter>
          <AppRoutes />
       </HashRouter>
       <CustomCursor />
    </AuthProvider>
  );
}

export default App;
