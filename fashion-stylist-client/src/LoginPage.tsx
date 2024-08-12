// src/LoginPage.tsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from './config';

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			await axios.post(`${config.serverUrl}/login`, { email, password },{ withCredentials: true });
			navigate('/profile');
		} catch (error) {
			console.error('Login failed:', error);
		}
	};

	return (
		<Box display="flex" flexDirection="column" alignItems="center" mt={5} minHeight={'75vh'}>
			<Typography variant="h4">Login</Typography>
			<TextField
				label="Email"
				variant="outlined"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				margin="normal"
			/>
			<TextField
				label="Password"
				variant="outlined"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				margin="normal"
			/>
			<Button variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>
				Login
			</Button>
		</Box>
	);
};

export default LoginPage;