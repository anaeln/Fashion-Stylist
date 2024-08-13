import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { profile } = useAuth();

    return (
        <AppBar position="static" color="primary" style={{ borderRadius: 30, border: 1, maxWidth: '75%', margin: '0 auto' }}>
            <Toolbar style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Typography variant="h6">
                        Fashion Recommender
                    </Typography>
                </div>
                <div style={{ borderLeft: '1px solid white', height: '24px', margin: '0 16px' }}></div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/HomePage">
                        Upload
                    </Button>
                    {!profile ? 
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
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
