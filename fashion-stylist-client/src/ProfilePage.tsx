import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import config from './config';
import BasicCard from './UploadPage/BasicCard';

const deleteCookie = (name: string, path: string = '/', domain?: string) => {
  const cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`;
  document.cookie = cookieString;
};

const ProfilePage: React.FC = () => {
  const { profile, setProfile } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.serverUrl}/userInfo`, { withCredentials: true });
        if (response.data && response.data.favorites) {
          setFavorites(response.data.favorites);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      await axios.post(`${config.serverUrl}/logout`, {}, { withCredentials: true });
      deleteCookie('session');
      setProfile(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight={'75vh'} padding={2}>
      {profile ? (
        <>
          <Typography variant="h4">Welcome, {profile.name}</Typography>
          <Typography variant="body1">Email: {profile.email}</Typography>
          <Typography variant="h5" mt={3}>Check out all your favorite items:</Typography>
          {loading ? (
            <Typography variant="h6">Loading your favorites...</Typography>
          ) : (
            <Grid container spacing={2} mt={2} justifyContent="center" sx={{ width: '100%' }}>
              <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '1200px', width: '100%' }}>
                {favorites.length > 0 ? (
                  favorites.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id} display="flex" justifyContent="center">
                      <BasicCard
                        id={item.id}
                        link={item.link}
                        title={item.title}
                        price={item.price}
                        img={item.img}
                        brand={item.brand}
                        isHeartFull={true}
                        isUserConnected={true}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography variant="h6" sx={{mt: 2}}>Your favorites list is empty.</Typography>
                )}
              </Grid>
            </Grid>
          )}
          <Button variant="contained" color="primary" onClick={handleLogout} sx={{ my: 3}}>
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