import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import {
  Box, Typography, Grid, Paper, Container, Button, Card, CardContent, Avatar, CircularProgress, Divider
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person"; // <-- KEEP THIS IMPORT
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "Learner",
    username: "",
    total_quizzes: 0,
    avg_score: 0.0,
    badges: [],
    strong_subjects: [],
    weak_subjects: [],
    suggested_action: "Take a diagnostic quiz to set your path.",
  });

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
        const summaryRes = await axios.get("/api/performance-summary/", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const badgesRes = await axios.get("/api/badges/", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const analyticsRes = await axios.get("/api/analytics/", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const profileRes = await axios.get("/api/profile/", {
            headers: { Authorization: `Bearer ${token}` }
        });

        setUserData({
            name: profileRes.data.first_name || profileRes.data.username || "Learner",
            username: profileRes.data.username,
            total_quizzes: summaryRes.data.total_quizzes,
            avg_score: analyticsRes.data.average_score,
            badges: badgesRes.data,
            strong_subjects: analyticsRes.data.strong_subjects,
            weak_subjects: analyticsRes.data.weak_subjects,
            suggested_action: analyticsRes.data.suggested_action,
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setUserData(prev => ({ ...prev, name: "Guest" })); 
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { icon: <EmojiEventsIcon fontSize="large" color="warning" />, label: "Week Streak", value: 1 },
    { icon: <StarIcon fontSize="large" color="primary" />, label: "Quizzes Taken", value: userData.total_quizzes },
    { icon: <AccessTimeIcon fontSize="large" color="success" />, label: "Avg. Score", value: `${userData.avg_score}%` },
    { icon: <PersonIcon fontSize="large" color="secondary" />, label: "AI Interactions", value: 5 }
  ];

  const learningPath = [];
  
  if (userData.weak_subjects.length > 0) {
    const weakestSubject = userData.weak_subjects[0];
    learningPath.push({ 
        subject: `Focus: ${weakestSubject}`, 
        progress: userData.total_quizzes > 0 ? (100 - (userData.avg_score)) : 0, 
        next: `Review recommended material for ${weakestSubject}`, 
        color: 'var(--error-color)' 
    });
  }

  if (userData.strong_subjects.length > 0 && learningPath.length === 0) {
      const strongestSubject = userData.strong_subjects[0];
      learningPath.push({ 
        subject: `Advance: ${strongestSubject}`, 
        progress: 95,
        next: `Explore advanced topics in ${strongestSubject}`, 
        color: 'var(--success-color)'
    });
  }

  if (learningPath.length === 0) {
      learningPath.push({ 
        subject: "Start Your Journey", 
        progress: 0, 
        next: "Take the diagnostic quiz now!", 
        color: 'var(--primary-color)'
    });
  }


  if (loading) {
      return (
          <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
          </Box>
      );
  }

  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        
        {/* Welcome Section - Primary Feature Card */}
        <Paper className="dashboard-welcome-card">
          {/* FIX: Use PersonIcon instead of charAt(0) */}
          <Avatar className="dashboard-avatar" src={userData.avatar} sx={{ bgcolor: 'white', color: 'primary.main' }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: 'black' }}>
            Welcome back {userData.name}! 👋
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, maxWidth: 550, color: 'white' }}>
            {userData.suggested_action}
          </Typography>
          <Button
            component={Link}
            to="/quiz"
            variant="contained"
            color="secondary"
          >
            Continue Learning
          </Button>
        </Paper>

        {/* Stats Section - Using fixed columns for alignment */}
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 5 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}> 
              <Paper className="stat-card-paper">
                {stat.icon}
                <Typography variant="h5" className="stat-value">{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mb: 5 }}>
          {/* Learning Path - Dynamic Progress */}
          <Grid item xs={12} md={8}>
            <Card elevation={4} sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: 'var(--primary-color)' }}>Your Adaptive Learning Path</Typography>
                <Divider sx={{ mb: 2 }} />
                {learningPath.map((lp, idx) => (
                  <Box key={idx} sx={{ mb: 3 }}>
                    <Typography fontWeight={500}>{lp.subject}</Typography>
                    <Box className="progress-container">
                      <Box className="progress-bar" sx={{ width: `${lp.progress > 100 ? 100 : lp.progress}%`, bgcolor: lp.color }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">Next: {lp.next}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Badges - Dynamic Display */}
          <Grid item xs={12} md={4}>
            <Card elevation={4} sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: 'var(--primary-color)' }}>Your Badges</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1}>
                  {userData.badges.length > 0 ? (
                    userData.badges.map((badge, idx) => (
                      <Grid item xs={12} key={idx}>
                        <Box className="badge-item">
                          <EmojiEventsIcon color="secondary" />
                          <Typography className="badge-text">{badge}</Typography>
                        </Box>
                      </Grid>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                      Keep learning and taking quizzes to earn your first badge!
                    </Typography>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* AI Tutor and Analytics Links Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: 'var(--primary-color)' }}>
                  AI Tutor <ChatBubbleOutlineIcon color="primary" sx={{ ml: 1 }} />
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Get instant help, personalized guidance, and answers to your toughest questions 24/7.
                </Typography>
                <Button variant="outlined" component={Link} to="/aitutor" color="primary">Ask the AI Tutor</Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Explore More Features Card */}
          <Grid item xs={12} md={5}>
            <Card elevation={4}>
              <CardContent sx={{ textAlign: "center", py: 5 }}>
                <Typography variant="h6" fontWeight={600} color="var(--primary-color)">Explore More Features</Typography>
                <Box className="link-button-group" sx={{ mt: 2 }}>
                  <Button component={Link} to="/ai-recommend" color="primary" variant="text" size="small">Recommendations</Button> | 
                  <Button component={Link} to="/analytics" color="primary" variant="text" size="small">Full Analytics</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}