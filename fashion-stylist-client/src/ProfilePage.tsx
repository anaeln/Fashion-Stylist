import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import config from './config';

// Utility function to delete a cookie
const deleteCookie = (name: string, path: string = '/', domain?: string) => {
  const cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`;
  document.cookie = cookieString;
};

const ProfilePage: React.FC = () => {
  const { profile, setProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${config.serverUrl}/logout`, {}, { withCredentials: true });
      deleteCookie('session'); // Clear the cookie on the client side
      setProfile(null); // Clear profile from context
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5} minHeight={'75vh'}>
      {profile ? (
        <>
          <Typography variant="h4">Welcome, {profile.name}</Typography>
          <Typography variant="body1">Email: {profile.email}</Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mt: 2 }}>
            Logout
          </Button>
        </>
      ) : (
        <Typography variant="h6">Loading profile...</Typography>
      )}
    </Box>
  );
};

export default ProfilePage;
