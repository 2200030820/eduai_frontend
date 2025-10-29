// src/index.js (Modified for CSS-First approach)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css'; // CRITICAL: Import the main CSS file here
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Using a basic theme, colors are now in CSS variables
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const eduaiTheme = createTheme({
    palette: {
        primary: { main: '#00796B' }, // Retain for MUI component color mapping
        secondary: { main: '#FF5722' }, // Retain for MUI component color mapping
    },
    // We rely mostly on CSS variables and classes now
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={eduaiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <App /> 
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);