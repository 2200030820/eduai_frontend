import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Container, AppBar, Toolbar, Link as MuiLink } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Both fields are required.");
      return;
    }
    try {
      const response = await axios.post("/api/token/", {
        username: form.email, 
        password: form.password,
      });
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(90deg,#e3f2fd,#f5faff 100%)",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Logo + Register Top Bar */}
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
            to="/register"
            variant="contained"
            size="large"
            sx={{ ml: 2 }}
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ py: 6, px: 4, borderRadius: 4, textAlign: "center" }}>
          <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
            Welcome back to EduAI
          </Typography>
          <Typography color="textSecondary" mb={3}>Log in with your email</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {error && <Typography color="error" mt={1}>{error}</Typography>}
            <Button type="submit" fullWidth size="large" variant="contained" sx={{ mt: 2 }}>
              Login
            </Button>
          </Box>
          <MuiLink component={Link} to="/forgot-password" underline="hover" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: '0.9rem' }}>
            Forgot Password?
          </MuiLink>
          <Typography sx={{ mt: 3, color: "text.secondary" }}>
            Don’t have an account?{" "}
            <MuiLink component={Link} to="/register" underline="hover" color="primary">Register</MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}