import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Container, CircularProgress, Button } from "@mui/material";
import NavBar from "./NavBar";
import axios from "axios";
import SchoolIcon from "@mui/icons-material/School";
import { Link } from "react-router-dom";

export default function ProfileSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("/api/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // The API returns StudentProfile, which has the nested User data
        setProfile(res.data);

      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile || !profile.user) {
    return (
      <Box minHeight="100vh" textAlign="center">
        <NavBar />
        <Container maxWidth="sm" sx={{ mt: 10 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Profile data missing or you are not authenticated.
          </Typography>
          <Button component={Link} to="/login" variant="contained">Login Again</Button>
        </Container>
      </Box>
    );
  }

  // Destructure for cleaner access
  const userData = profile.user;
  const profileData = profile;

  return (
    <Box minHeight="100vh" sx={{background: "linear-gradient(90deg, #f5faff 0%, #e3f2fd 100%)"}}>
      <NavBar />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={4} sx={{ py: 5, px: 4, textAlign: "center", borderRadius: 4 }}>
          <SchoolIcon color="primary" sx={{ fontSize: 60, mb: 3 }} />
          <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
            Your Profile
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Manage your personal and learning information.
          </Typography>

          <Box sx={{ textAlign: 'left', maxWidth: 300, margin: '0 auto' }}>
            <Typography variant="body1" sx={{ mt: 2, borderBottom: '1px dashed #ddd', pb: 1 }}>
                <strong>Email (Login):</strong> {userData.email}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, borderBottom: '1px dashed #ddd', pb: 1 }}>
                <strong>First Name:</strong> {userData.first_name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, borderBottom: '1px dashed #ddd', pb: 1 }}>
                <strong>Last Name:</strong> {userData.last_name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, borderBottom: '1px dashed #ddd', pb: 1 }}>
                <strong>Learning Style:</strong> {profileData.learning_style || 'Not Set'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, pb: 1 }}>
                <strong>Member Since:</strong> {new Date(userData.date_joined).toLocaleDateString()}
            </Typography>
          </Box>

          <Button variant="contained" color="secondary" sx={{ mt: 4 }}>
            Edit Learning Preferences
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}