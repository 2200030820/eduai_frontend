import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { 
    Box, Typography, Container, CircularProgress, Grid, Card, CardContent, 
    Button, Select, MenuItem, FormControl, InputLabel, Chip 
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

const CATEGORIES = [
    { value: 'Maths', label: 'Mathematics' },
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Science', label: 'Science' },
    { value: 'Social', label: 'Social' },
];

export default function CourseList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchCourses = async (category = '') => {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const categoryQuery = category ? `?category=${category}` : '';

        try {
            const res = await axios.get(`/api/courses/${categoryQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // The API response returns an object with a 'courses' key
            setCourses(res.data.courses || []); 
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(selectedCategory);
    }, [selectedCategory]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <Box minHeight="100vh" sx={{background: "linear-gradient(90deg, #f5faff 0%, #f5f5f5 100%)"}}>
            <NavBar />
            <Container maxWidth="lg" sx={{ mt: 8 }}>
                <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
                    Explore All Courses
                </Typography>

                <FormControl sx={{ minWidth: 200, mb: 4 }} size="small">
                    <InputLabel id="category-select-label">Filter by Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        value={selectedCategory}
                        label="Filter by Category"
                        onChange={handleCategoryChange}
                    >
                        <MenuItem value="">
                            <em>All Categories</em>
                        </MenuItem>
                        {CATEGORIES.map(cat => (
                            <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {loading ? (
                    <CircularProgress sx={{ display: 'block', margin: '30px auto' }} />
                ) : courses.length > 0 ? (
                    <Grid container spacing={4}>
                        {courses.map((course, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Chip label={course.category} size="small" color="secondary" />
                                            <Typography variant="caption" color="text.secondary">
                                                Topic: {course.topic}
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" component="div" fontWeight="bold" color="primary.main" mb={1}>
                                            {course.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60 }}>
                                            {course.description}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Button 
                                            variant="contained" 
                                            color="secondary" 
                                            fullWidth
                                            startIcon={<SchoolIcon />}
                                            // Action link would go here (e.g., /courses/1/start)
                                        >
                                            Start Course
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 5 }}>
                        No courses found in this category.
                    </Typography>
                )}
            </Container>
        </Box>
    );
}