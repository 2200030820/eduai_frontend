import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Main from "./Main"; 
// DELETED: import Dashboard from "./Dashboard"; (redundant)

// Define the Earthy Theme (Muted Teal and Safety Orange)
const theme = createTheme({
  palette: {
    primary: { main: "#00796B" }, // Muted Teal
    secondary: { main: "#FF5722" }, // Safety Orange
    background: {
        default: '#F5F5F5', 
        paper: '#FFFFFF',
    },
    text: {
        primary: '#333333', 
        secondary: '#555555', 
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Main /> 
    </ThemeProvider>
  );
}

export default App;