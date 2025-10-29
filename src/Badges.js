import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { Box, Typography, Container, Paper, Chip, CircularProgress } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function Badges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        setLoading(false);
        return;
    }
    axios.get("/api/badges/", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setBadges(res.data))
      .catch(err => console.error("Failed to fetch badges:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box minHeight="100vh" sx={{background: "linear-gradient(90deg, #f5faff 0%, #e3f2fd 100%)"}}>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Your Achievements & Badges
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />
        ) : badges.length > 0 ? (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {badges.map((b, i) => (
              <Chip
                key={i}
                icon={<EmojiEventsIcon />}
                label={b}
                color="warning"
                variant="filled"
                size="large"
                sx={{ fontSize: '1.05rem', p: 1.5 }}
              />
            ))}
          </Paper>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
            No badges earned yet. Complete more quizzes to achieve mastery!
          </Typography>
        )}
      </Container>
    </Box>
  );
}