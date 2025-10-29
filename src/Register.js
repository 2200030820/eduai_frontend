import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Container, AppBar, Toolbar, Link as MuiLink } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    firstName: "", 
    lastName: "" 
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password || !form.firstName || !form.lastName) {
      setError("All fields are required.");
      return;
    }
    try {
      await axios.post("/api/register/", {
        username: form.email, // Passing email as username
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      });
      navigate("/login");
    } catch (err) {
      setError("Email already registered or registration failed.");
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(90deg,#e3f2fd,#f5faff 100%)",
      display: "flex",
      flexDirection: "column"
    }}>
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
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ py: 6, px: 4, borderRadius: 4, textAlign: "center" }}>
          <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
            Create your EduAI account
          </Typography>
          <Typography color="textSecondary" mb={3}>Sign up to get started</Typography>
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
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {error && <Typography color="error" mt={1}>{error}</Typography>}
            <Button type="submit" fullWidth size="large" variant="contained" sx={{ mt: 2 }}>
              Register
            </Button>
          </Box>
          <Typography sx={{ mt: 3, color: "text.secondary" }}>
            Already have an account?{" "}
            <MuiLink component={Link} to="/login" underline="hover" color="primary">Login</MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}