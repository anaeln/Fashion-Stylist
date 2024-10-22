import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

import './index.css';

const theme = createTheme({
	typography: {
	  fontFamily: 'Jost', // Replace with your desired font
	},
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</React.StrictMode>
);
