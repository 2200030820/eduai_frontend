import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CircularProgress, Container, Paper, Chip } from "@mui/material";
import NavBar from "./NavBar";
import axios from "axios";
import { Link } from "react-router-dom"; // Added for linking to materials

export default function AIRecommendations() {
  const [recData, setRecData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRec() {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("/api/ai-recommend/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // The API returns an object with profile info and an array of recommendations
        setRecData(res.data);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        setRecData(null);
      }
      setLoading(false);
    }
    fetchRec();
  }, []);

  // Use a different variable name (rec) for clarity in rendering
  const { profile, recommendations } = recData || { profile: {}, recommendations: [] };

  return (
    <Box minHeight="100vh" sx={{ background: "linear-gradient(90deg,#e3f2fd,#f5faff 100%)" }}>
      <NavBar />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card sx={{ p: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Adaptive Content Recommendations
            </Typography>
            {loading && <CircularProgress sx={{ mt: 3 }} />}
            {recData && (
              <>
                <Typography variant="h6" color="primary" gutterBottom>
                  Hello, {profile.username || "Learner"}!
                </Typography>
                {/* Display placeholder/actual profile data */}
                <Typography>Progress: {profile.progress || 0}%</Typography>
                <Typography>Interests: {(profile.interests || []).map(i => <Chip key={i} label={i} color="primary" sx={{ mx: 0.5 }}/>)}</Typography>
                
                <Typography mt={4} variant="subtitle1" fontWeight="bold">We recommend these materials:</Typography>
                
                {recommendations.length > 0 ? (
                    recommendations.map((item, idx) => (
                      <Paper key={idx} sx={{ p: 2, my: 2, borderLeft: "6px solid #ff7043", borderRadius: 2 }}>
                        <Typography fontWeight="bold" component={Link} to={`/materials/${item.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.type} • Recommended because: {item.reason}
                        </Typography>
                      </Paper>
                    ))
                ) : (
                    <Typography mt={2} color="success.main">
                        Great job! You've mastered your current curriculum. Explore new courses!
                    </Typography>
                )}
              </>
            )}
            {!loading && !recData && (
              <Typography color="error" mt={3}>Could not load recommendations. Please ensure you are logged in.</Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}