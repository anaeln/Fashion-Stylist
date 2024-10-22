// src/RegisterPage.tsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from './config';

const RegisterPage: React.FC = () => {
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const navigate = useNavigate();

	const handleRegister = async () => {
		if (!name || !email || !password) {
			alert('All fields are required.');
			return;
		}

		if (!email.includes('@')) {
			alert('Please enter a valid email address.');
			return;
		}

		try {
			await axios.post(`${config.serverUrl}/register`, { name, email, password });
			navigate('/login');
		} catch (error) {
			console.error('Registration failed:', error);
		}
	};

	return (
		<Box display="flex" flexDirection="column" alignItems="center" mt={5} minHeight="75vh">
			<Typography variant="h4">Register</Typography>
			<TextField
				label="Name"
				variant="outlined"
				value={name}
				onChange={(e) => setName(e.target.value)}
				margin="normal"
			/>
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
			<Button variant="contained" color="primary" onClick={handleRegister} sx={{ mt: 2 }}>
				Register
			</Button>
		</Box>
	);
};

export default RegisterPage;