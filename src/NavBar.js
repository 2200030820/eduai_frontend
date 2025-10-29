import React from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CodeIcon from "@mui/icons-material/Code";
import ChatIcon from "@mui/icons-material/Chat";
import ImportContactsIcon from "@mui/icons-material/ImportContacts"; // New Icon Import
import { Link, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/dashboard" }, 
  { label: "Courses", path: "/courses", icon: <ImportContactsIcon sx={{ mr: 0.5 }} /> }, // ADDED COURSES LINK
  { label: "Quiz", path: "/quiz" },
  { label: "Analytics", path: "/analytics" },
  { label: "AI Tutor", path: "/aitutor", icon: <ChatIcon sx={{ mr: 0.5 }} /> },
  { label: "Recommendations", path: "/ai-recommend", icon: <CodeIcon sx={{ mr: 0.5 }} /> },
];

export default function NavBar() {
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <AppBar position="static" color="background" elevation={4} sx={{ borderBottom: '2px solid #00796B' }}> 
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo/Brand */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SchoolIcon sx={{ mr: 1, color: "primary.main", fontSize: 36 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            EduAI
          </Typography>
        </Box>
        
        {/* Nav Links and Auth Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          {navLinks.map((link, i) => (
            <Button
              key={i}
              component={Link}
              to={link.path}
              color="primary" 
              sx={{ mx: 1, fontWeight: "medium", textTransform: 'none', 
                    '&:hover': { bgcolor: 'primary.light', opacity: 0.9 } 
                }}
            >
              {link.icon}
              {link.label}
            </Button>
          ))}
          
          {/* Right-aligned User Actions */}
          {!isLoggedIn ? (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{ ml: 2 }}
              size="large"
            >
              Login
            </Button>
          ) : (
            <>
              <Button
                component={Link}
                to="/profile"
                variant="outlined"
                color="primary"
                sx={{ ml: 2 }}
                startIcon={<AccountCircleIcon />}
              >
                Profile
              </Button>
              <Button
                onClick={handleLogout}
                variant="contained" 
                color="secondary" 
                sx={{ ml: 1 }}
                startIcon={<ExitToAppIcon />}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}