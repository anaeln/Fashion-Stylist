// src/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from './config';

interface Profile {
	name: string;
	email: string;
}

const ProfilePage: React.FC = () => {
	const [profile, setProfile] = useState<Profile | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get<Profile>(`${config.serverUrl}/profile`, { withCredentials: true });
				setProfile(response.data);
			} catch (error) {
				console.error('Failed to fetch profile:', error);
			}
		};

		fetchProfile();
	}, []);

	const handleLogout = () => {
		document.cookie = 'session=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
		navigate('/login');
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
