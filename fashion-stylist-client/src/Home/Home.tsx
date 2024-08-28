import { Box, Button, Stack, Typography  } from '@mui/material';
/*import config from '../config';
import FileUploadButton from './FileUploadButton';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
*/
import { Link } from 'react-router-dom';

const HomePage = () => {
	
	return (
        <Stack direction="row"justifyContent="space-between"alignItems="center"spacing={1}>

            {/* content on left side */}
            <Box height={600} width={600} >
                <Stack>
                    <Stack direction={'row'}>
                    <Box
                        sx={{
                            maxHeight: '60px',
                            maxWidth: '60px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                        }}
                        >
                        <Box
                            component="img"
                            src={'http://localhost:5000/public/logo.jpg'}
                            sx={{
                            height: '100%',
                            width: '100%',
                            transform: 'scale(1.45) translate(-0.3%, 0.2%)',
                            }}
                            alt="Logo"
                        />
                        </Box>
                        <Typography variant='h3' color={'black'} sx={{textAlign: 'left', fontWeight: '600' }}>
                            Fashion Stylist
                        </Typography>
                    </Stack>
                    <Typography 
                        variant='h4' 
                        color={'black'}
                        sx={{ 
                        ml:'90px',
                        pt: '120px', 
                        fontWeight: '600', 
                        textAlign: 'left' // Ensure the text is aligned to the left
                        }}
                    >
                        Discover your personal style
                    </Typography>
                    <Typography 
                        variant='caption' 
                        color='gray' 
                        width={'75%'}
                        sx={{ 
                        ml:'90px',
                        pt: '20px', 
                        fontSize:'medium', 
                        textAlign: 'left' // Ensure the text is aligned to the left
                        }}
                    >
                        Get an AI-powered personal stylist that offers recommendations to help you look and feel your best
                    </Typography>
                    <Box
                        height={150}
                        width={500}
                        sx={{
                            ml:"90px",
                            mt:"50px",
                            position: 'relative', // Ensure the child components are positioned relative to this Box
                            backgroundImage: 'url(http://localhost:5000/public/background.png)',
                            backgroundSize: 'cover', // Ensure the image covers the entire Box
                            backgroundPosition: 'center', // Center the image in the Box
                            backgroundRepeat: 'no-repeat', // Prevent the image from repeating
                            opacity:"0.9",
                        }}
                        >
                        <Button
                            variant="contained"
                            color='primary'
                            size="large"
                            sx={{
                            position: 'absolute', // Position the button absolutely within the Box
                            top: -20, // Position the button to overflow at the top
                            left: '50%', // Center horizontally
                            transform: 'translateX(-50%)', // Center the button horizontally
                            borderRadius: '40px',
                            width: '120px',
                            
                            }}
                            component={Link}
                            to="/UploadPage"
                        >
                            Try it
                        </Button>
                        </Box>
                </Stack>
            </Box>

            {/* big robots photo */}
            <Box
            height={700}
            width={600}
            position={'sticky'}
            left={'100%'}
            top={0}
            alignContent={'flex-start'}
            sx={{
                overflow: 'hidden', // Ensures the image respects the border radius
            }}
            >
                <Box
                    component="img"
                    src={'http://localhost:5000/public/robot.jpeg'}
                    sx={{
                    maxHeight: '700px',
                    maxWidth: '600px',
                    border: '1px solid black',
                    borderBottomLeftRadius: '200px', // Apply radius to the bottom-left corner
                    display: 'block', // Ensures the image takes up only the size of its container
                    }}
                    alt="Robot"
                />
            </Box>
        </Stack>
	);
};

export default HomePage;
