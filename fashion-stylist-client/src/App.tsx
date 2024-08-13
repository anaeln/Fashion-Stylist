import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import UploadPage from './UploadPage/UploadPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import Navbar from './components/Navbar';
import HomePage from './Home/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Box } from '@mui/material';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <MainContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const MainContent: React.FC = () => {
  const location = useLocation();
  
  return (
    <>
      {location.pathname !== '/' &&
            <Box p={3}>
              <Navbar />

            </Box>
      }
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/UploadPage" element={<UploadPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
};

export default App;
