import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
interface Profile {
	name: string;
	email: string;
}

const Navbar: React.FC = () => {
	const [isLogged, setIsLogged] = useState<Profile | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get<Profile>(`${config.serverUrl}/profile`, { withCredentials: true });
				if(response.status !== 200){
					setIsLogged(null);
				}
				else setIsLogged(response.data);
			} catch (error) {
				setIsLogged(null);
				console.error('Failed to fetch profile:', error);
			}
		};

		fetchProfile();
	}, []);
	return (
		<AppBar position="static" color="primary" style={{borderRadius: 30, border:1}}>
			<Toolbar>
				<Typography variant="h6" style={{flexShrink:'1' }}>
					Fashion Recommender
				</Typography>
				<Button color="inherit" component={Link} to="/">
					Home
				</Button>
				{!isLogged ? 
					<>
						<Button color="inherit" component={Link} to="/login">
							Login
						</Button>
						<Button color="inherit" component={Link} to="/register">
							Register
						</Button>
					</>
					:
					<>
						<Button color="inherit" component={Link} to="/profile">
							Profile
						</Button>
					</>
				}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
