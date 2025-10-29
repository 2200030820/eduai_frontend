import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CircularProgress, Container, Chip } from "@mui/material";
import axios from "axios";
import NavBar from "./NavBar";

export default function ProgressAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("/api/analytics/", {
          headers: {Authorization: `Bearer ${token}`},
        });
        // Note: The backend response will no longer contain hours_studied
        setAnalytics(res.data);
      } catch {
        setAnalytics(null);
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  return (
    <Box minHeight="100vh" sx={{background: "linear-gradient(90deg, #f5faff 0%, #f5f5f5 100%)"}}>
      <NavBar />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
              Learning Profile & Analytics
            </Typography>
            {loading && <CircularProgress sx={{ mt: 3 }} />}
            {analytics && (
              <>
                <Typography variant="body1" sx={{ mt: 2 }}><strong>Username:</strong> {analytics.username}</Typography>
                <Typography variant="body1"><strong>Quizzes Taken:</strong> {analytics.quizzes_taken}</Typography>
                <Typography variant="body1"><strong>Avg. Score:</strong> {analytics.average_score}%</Typography>
                
                {/* REMOVED: Hours Studied display */}
                
                <Box mt={3}>
                  <Typography fontWeight="bold" color="success.main" gutterBottom>Strengths:</Typography>
                  {analytics.strong_subjects.map(sub => (
                    <Chip key={sub} label={sub} color="success" sx={{mr: 1}} />
                  ))}
                </Box>
                <Box mt={2}>
                  <Typography fontWeight="bold" color="error" gutterBottom>Weaknesses:</Typography>
                  {analytics.weak_subjects.map(sub => (
                    <Chip key={sub} label={sub} color="error" sx={{mr: 1}} />
                  ))}
                </Box>
                <Box mt={3} sx={{ borderLeft: '3px solid #FF5722', p: 1, bgcolor: '#fdf3e0' }}>
                  <Typography variant="subtitle1" color="text.primary" fontStyle="italic">
                    Next Action: <strong>{analytics.suggested_action}</strong>
                  </Typography>
                </Box>
              </>
            )}
            {!loading && !analytics && (
              <Typography color="error" mt={3}>Could not load analytics profile. Please check authentication and quiz status.</Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}