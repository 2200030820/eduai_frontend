import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { 
    Box, Typography, Card, CardContent, CircularProgress, Container, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        setLoading(false);
        return;
    }
    axios.get("/api/teacher/dashboard/", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStudents(res.data))
      .catch(err => console.error("Failed to fetch teacher dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box minHeight="100vh" sx={{background: "linear-gradient(90deg, #f5faff 0%, #e3f2fd 100%)"}}>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom sx={{ mb: 4 }}>
          Teacher Dashboard: Student Overview
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : students.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
            <Table aria-label="student performance table">
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    <AssignmentIndIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Student
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Average Score (%)</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s) => (
                  <TableRow
                    key={s.profile_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
                  >
                    <TableCell component="th" scope="row">
                      {s.name}
                    </TableCell>
                    <TableCell align="right">
                      <Typography color={s.avg_score >= 80 ? 'success.main' : s.avg_score >= 50 ? 'warning.main' : 'error.main'} fontWeight="bold">
                        {s.avg_score || 0}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                        <a href={`/student-details/${s.profile_id}`}>View Full Report</a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6" color="text.secondary">
            No students found or enrolled.
          </Typography>
        )}
      </Container>
    </Box>
  );
}