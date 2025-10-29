import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { Box, Typography, Card, CardContent, CircularProgress, Container, Grid, Paper, Divider } from "@mui/material";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GradeIcon from "@mui/icons-material/Grade";

export default function ParentDashboard() {
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        setLoading(false);
        return;
    }
    axios.get("/api/guardian/dashboard/", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setChildData(res.data))
      .catch(err => console.error("Failed to fetch guardian data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box minHeight="100vh" sx={{background: "linear-gradient(90deg, #f5faff 0%, #e3f2fd 100%)"}}>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom sx={{ mb: 4 }}>
          Guardian Dashboard
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : childData && childData.length > 0 ? (
          <Grid container spacing={4}>
            {childData.map((child, i) => (
              <Grid item xs={12} md={6} lg={4} key={i}>
                <Card sx={{ borderRadius: 4, boxShadow: 3, transition: "0.3s", "&:hover": { boxShadow: 6, transform: "translateY(-4px)" } }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <ChildCareIcon fontSize="large" color="secondary" sx={{ mr: 2 }} />
                      <Typography variant="h5" fontWeight="bold">
                        {child.user}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Paper elevation={1} sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, mb: 1.5 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="body1" fontWeight="medium">
                                <GradeIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} color="primary" />
                                Avg. Quiz Score:
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                {child.avg_score}%
                            </Typography>
                        </Box>
                    </Paper>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="body1" fontWeight="medium">
                                <CheckCircleIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} color="success" />
                                Quizzes Completed:
                            </Typography>
                            <Typography variant="h6" color="success" fontWeight="bold">
                                {child.total_quizzes}
                            </Typography>
                        </Box>
                    </Paper>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                        Learning Style: {child.learning_style || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" color="text.secondary">
            No linked student data found.
          </Typography>
        )}
      </Container>
    </Box>
  );
}