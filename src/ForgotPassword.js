import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Container, Link as MuiLink } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", color: "primary" });
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", color: "primary" });
    try {
      const res = await axios.post("/api/password/request-otp/", { email });
      setMessage({ text: res.data.status, color: "success" });
      setStep(2);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || "Error requesting OTP.", color: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", color: "primary" });
    try {
      await axios.post("/api/password/verify-otp/", { email, otp });
      setMessage({ text: "OTP verified. Set your new password.", color: "success" });
      setStep(3);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || "Invalid or expired OTP.", color: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", color: "primary" });
    try {
      await axios.post("/api/password/reset/", { email, new_password: newPassword });
      setMessage({ text: "Password reset complete! Redirecting to login...", color: "success" });
      setTimeout(() => window.location.href = "/login", 2000); // Redirect on success
    } catch (err) {
      setMessage({ text: err.response?.data?.error || "Error resetting password.", color: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- Step 1 UI: Request Email ---
  const renderStep1 = () => (
    <Box component="form" onSubmit={handleRequestOtp} sx={{ mt: 2 }}>
      <Typography mb={2}>Enter your email to receive a password reset code.</Typography>
      <TextField
        fullWidth margin="normal" label="Email" type="email" value={email}
        onChange={(e) => setEmail(e.target.value)} disabled={loading} required
      />
      <Button type="submit" fullWidth size="large" variant="contained" sx={{ mt: 2 }} disabled={loading}>
        {loading ? 'Sending...' : 'Request Reset Code'}
      </Button>
    </Box>
  );

  // --- Step 2 UI: Verify OTP ---
  const renderStep2 = () => (
    <Box component="form" onSubmit={handleVerifyOtp} sx={{ mt: 2 }}>
      <Typography mb={2}>An OTP has been sent to **{email}**. Enter it below.</Typography>
      <TextField
        fullWidth margin="normal" label="OTP Code" value={otp}
        onChange={(e) => setOtp(e.target.value)} disabled={loading} required
      />
      <Button type="submit" fullWidth size="large" variant="contained" sx={{ mt: 2 }} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify Code'}
      </Button>
      <MuiLink onClick={() => setStep(1)} sx={{ display: 'block', mt: 2, cursor: 'pointer' }} disabled={loading}>
        Back to Email Entry
      </MuiLink>
    </Box>
  );

  // --- Step 3 UI: Reset Password ---
  const renderStep3 = () => (
    <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 2 }}>
      <Typography mb={2}>Set your new secure password.</Typography>
      <TextField
        fullWidth margin="normal" label="New Password" type="password" value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)} disabled={loading} required
      />
      <Button type="submit" fullWidth size="large" variant="contained" sx={{ mt: 2 }} disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, width: '100%' }}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          Forgot Password (Step {step} of 3)
        </Typography>
        <Typography color={message.color === 'error' ? 'error' : 'success'} sx={{ mt: 1, fontWeight: 'bold' }}>
          {message.text}
        </Typography>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        <Typography sx={{ mt: 3, textAlign: 'center' }}>
            <MuiLink component={Link} to="/login" underline="hover">
                Return to Login
            </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
}