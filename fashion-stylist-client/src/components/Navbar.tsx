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
                    <Typography variant="h6" sx={{ fontSize: '22px' }}>
                        Fashion Recommender
                    </Typography>
                </div>
                <div id='navBarSeparator' style={{ borderLeft: '1px solid', height: '24px', margin: '0 16px' }}></div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button color="inherit" component={Link} to="/" sx={{ fontSize: '17px' }}>
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/UploadPage" sx={{ fontSize: '17px' }}>
                        Upload
                    </Button>
                    {!profile ? 
                        <>
                            <Button color="inherit" component={Link} to="/login" sx={{ fontSize: '17px' }}>
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register" sx={{ fontSize: '17px' }}>
                                Register
                            </Button>
                        </>
                        :
                        <>
                            <Button color="inherit" component={Link} to="/profile" sx={{ fontSize: '17px' }}>
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
