import React from "react";
import { Box, Typography, Button, Grid, Paper, Container, AppBar, Toolbar } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { Link } from "react-router-dom";

const stats = [
  { number: "10K+", label: "Active Learners" },
  { number: "500+", label: "Expert Courses" },
  { number: "95%", label: "Success Rate" },
  { number: "24/7", label: "AI Support" }
];

const heroImage = "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=720&q=80";

export default function Landing() {
  return (
    <Box sx={{ background: "linear-gradient(90deg, #e3f2fd 0%, #f5faff 100%)", minHeight: "100vh" }}>
      {/* Logo + Login Top Bar */}
      <AppBar position="static" color="inherit" elevation={2}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SchoolIcon sx={{ mr: 1, color: "primary.main", fontSize: 32 }} />
            <Typography variant="h6" color="primary" fontWeight="bold">
              EduAI
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            sx={{ ml: 2 }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* HERO SECTION */}
      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={8} sx={{ py: 10 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" fontWeight="bold" color="primary" gutterBottom>
              Transform Your Learning with{" "}
              <span style={{
                background: "linear-gradient(90deg, #1976d2 30%, #00c9ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                AI Power
              </span>
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Experience personalized education like never before. Our AI platform adapts to your learning, provides instant feedback, and guides you to mastery at your own pace.
            </Typography>
            <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mb={4}>
              <Button component={Link} to="/register" size="large" variant="contained">
                Start Learning Free
              </Button>
              <Button size="large" variant="outlined">
                Watch Demo
              </Button>
            </Box>
            <Box display="flex" alignItems="center" gap={3}>
              <Typography variant="subtitle2" color="textSecondary">4.9/5 rating</Typography>
              <Typography color="text.secondary">Join 10,000+ learners</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative", width: "100%", minHeight: 300 }}>
              <Box
                sx={{
                  width: "100%",
                  height: 370,
                  borderRadius: 5,
                  boxShadow: 8,
                  overflow: "hidden",
                  background: "#fff"
                }}
              >
                <img
                  src={heroImage}
                  alt="AI-powered education platform"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ background: "rgba(255,255,255,0.6)", py: 8, mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" fontWeight="bold" color="primary">{stat.number}</Typography>
                  <Typography color="textSecondary">{stat.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box sx={{ borderTop: 1, borderColor: "divider", py: 6, bgcolor: "#fff", mt: 3 }}>
        <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6" color="primary" fontWeight="bold">EduAI</Typography>
          </Box>
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            © 2025 EduAI. All rights reserved. Transforming education with AI.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
