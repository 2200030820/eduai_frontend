import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { 
    Box, Typography, Container, Paper, Tabs, Tab, TextField, Button, CircularProgress, 
    FormControl, InputLabel, Select, MenuItem, Grid, Checkbox, FormControlLabel, Alert
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// Hardcoded categories/skills based on models.py
const CATEGORY_OPTIONS = ['Maths', 'Machine Learning', 'DevOps', 'Science', 'Social'];
const SKILL_OPTIONS = ['math', 'ml', 'logic', 'devops'];

// --- Sub-components for Form Organization ---

const AddCourseForm = ({ onCourseCreated }) => {
    const [form, setForm] = useState({ title: '', description: '', topic: SKILL_OPTIONS[0], category: CATEGORY_OPTIONS[0], course_url: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setLoading(true);
        setStatus({ message: '', type: '' });
        const token = localStorage.getItem("accessToken");
        
        try {
            await axios.post("/api/admin/courses/", form, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setStatus({ message: 'Course added successfully!', type: 'success' });
            setForm({ title: '', description: '', topic: SKILL_OPTIONS[0], category: CATEGORY_OPTIONS[0], course_url: '' });
            onCourseCreated();
        } catch (err) {
            setStatus({ message: `Error: ${err.response?.data?.error || 'Failed to add course.'}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Add New Course Material</Typography>
            {status.message && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}
            
            <TextField fullWidth label="Course Title" name="title" value={form.title} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Web Preview Link (URL)" name="course_url" value={form.course_url} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Description" name="description" value={form.description} onChange={handleChange} margin="normal" multiline rows={3} />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select name="category" value={form.category} label="Category" onChange={handleChange}>
                            {CATEGORY_OPTIONS.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>Skill Topic</InputLabel>
                        <Select name="topic" value={form.topic} label="Skill Topic" onChange={handleChange}>
                            {SKILL_OPTIONS.map(skill => <MenuItem key={skill} value={skill}>{skill}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 3 }} disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddCircleIcon />}>
                {loading ? 'Creating...' : 'Add Course'}
            </Button>
        </Paper>
    );
};

const AddQuizForm = ({ courses }) => {
    const [quizTitle, setQuizTitle] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [newQuizId, setNewQuizId] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setStatus({ message: '', type: '' });
        const token = localStorage.getItem("accessToken");
        
        try {
            const res = await axios.post("/api/admin/quizzes/", {
                title: quizTitle,
                course: selectedCourseId,
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            setNewQuizId(res.data.id);
            setStatus({ message: `Quiz "${quizTitle}" created. Now add questions below!`, type: 'success' });
            setQuizTitle('');
        } catch (err) {
            setStatus({ message: `Error: ${err.response?.data?.error || 'Failed to create quiz.'}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Link Quiz to Course</Typography>
            {status.message && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}

            <FormControl fullWidth margin="normal">
                <InputLabel>Select Course</InputLabel>
                <Select value={selectedCourseId} label="Select Course" onChange={e => setSelectedCourseId(e.target.value)}>
                    <MenuItem value=""><em>Select a Course</em></MenuItem>
                    {courses.map(c => <MenuItem key={c.id} value={c.id}>{c.title} ({c.category})</MenuItem>)}
                </Select>
            </FormControl>
            <TextField fullWidth label="Quiz Title (e.g., Final Exam)" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} margin="normal" />
            
            <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 3 }} disabled={loading || !selectedCourseId || !quizTitle} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddCircleIcon />}>
                {loading ? 'Creating Quiz...' : 'Create Quiz Link'}
            </Button>
            
            {newQuizId && (
                <Typography variant="subtitle1" sx={{ mt: 2, p: 1, border: '1px solid #00796B' }}>
                    **New Quiz ID: {newQuizId}** (Use this ID in the Question form)
                </Typography>
            )}
        </Paper>
    );
};

const AddQuestionForm = ({ courses }) => {
    const [form, setForm] = useState({ quizId: '', text: '', skillTag: SKILL_OPTIONS[0], answers: [{ text: '', is_correct: false }, { text: '', is_correct: false }] });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });

    const handleAnswerChange = (index, field, value) => {
        const newAnswers = form.answers.map((ans, i) => i === index ? { ...ans, [field]: value } : ans);
        setForm({ ...form, answers: newAnswers });
    };

    const handleAddAnswer = () => setForm({ ...form, answers: [...form.answers, { text: '', is_correct: false }] });

    const handleSubmit = async () => {
        setLoading(true);
        setStatus({ message: '', type: '' });
        const token = localStorage.getItem("accessToken");
        
        // Prepare payload, mapping answers array to answers_to_create for the serializer
        const payload = {
            quiz: form.quizId,
            text: form.text,
            skill_tag: form.skillTag,
            answers_to_create: form.answers.filter(a => a.text.trim() !== ''),
        };
        
        try {
            await axios.post("/api/admin/questions/", payload, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setStatus({ message: `Question added successfully to Quiz ${form.quizId}!`, type: 'success' });
            setForm({ quizId: form.quizId, text: '', skillTag: SKILL_OPTIONS[0], answers: [{ text: '', is_correct: false }, { text: '', is_correct: false }] });
        } catch (err) {
            setStatus({ message: `Error: ${err.response?.data?.quiz || err.response?.data?.error || 'Failed to add question.'}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Add New Question</Typography>
            {status.message && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}

            <TextField fullWidth label="Target Quiz ID" value={form.quizId} onChange={e => setForm({ ...form, quizId: e.target.value })} margin="normal" placeholder="E.g., 1, 2, 3 (From 'Link Quiz to Course')" />
            <FormControl fullWidth margin="normal">
                <InputLabel>Skill Tag</InputLabel>
                <Select value={form.skillTag} label="Skill Tag" onChange={e => setForm({ ...form, skillTag: e.target.value })}>
                    {SKILL_OPTIONS.map(skill => <MenuItem key={skill} value={skill}>{skill}</MenuItem>)}
                </Select>
            </FormControl>
            <TextField fullWidth label="Question Text" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} margin="normal" multiline rows={2} />

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Answers (Check the correct one):</Typography>
            {form.answers.map((ans, index) => (
                <Grid container spacing={1} alignItems="center" key={index}>
                    <Grid item xs={10}>
                        <TextField 
                            fullWidth 
                            label={`Option ${index + 1}`} 
                            value={ans.text} 
                            onChange={e => handleAnswerChange(index, 'text', e.target.value)} 
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: 'right' }}>
                        <FormControlLabel 
                            control={<Checkbox checked={ans.is_correct} onChange={e => handleAnswerChange(index, 'is_correct', e.target.checked)} />}
                            label="Correct"
                            labelPlacement="end"
                        />
                    </Grid>
                </Grid>
            ))}
            
            <Button onClick={handleAddAnswer} variant="outlined" size="small" sx={{ mt: 1 }}>+ Add Answer Option</Button>

            <Button onClick={handleSubmit} variant="contained" color="secondary" sx={{ mt: 3 }} disabled={loading} fullWidth startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddCircleIcon />}>
                {loading ? 'Saving Question...' : 'Add Question'}
            </Button>
        </Paper>
    );
};


// --- Main Component ---
export default function ContentUpload() {
    const [tabValue, setTabValue] = useState(0);
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    const fetchCourses = async () => {
        setLoadingCourses(true);
        const token = localStorage.getItem("accessToken");
        try {
            const res = await axios.get("/api/admin/courses/", { headers: { Authorization: `Bearer ${token}` } });
            setCourses(res.data);
        } catch (err) {
            console.error("Failed to load course list:", err);
            setCourses([]);
        } finally {
            setLoadingCourses(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box minHeight="100vh" sx={{background: "linear-gradient(90deg, #f5faff 0%, #f5f5f5 100%)"}}>
            <NavBar />
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
                    Content Administration Panel
                </Typography>

                <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="secondary" textColor="secondary" centered sx={{ mb: 3 }}>
                        <Tab label="1. Add Course" />
                        <Tab label="2. Link Quiz to Course" />
                        <Tab label="3. Add Question" />
                    </Tabs>

                    {tabValue === 0 && <AddCourseForm onCourseCreated={fetchCourses} />}
                    {tabValue === 1 && <AddQuizForm courses={courses} />}
                    {tabValue === 2 && <AddQuestionForm courses={courses} />}
                </Paper>
                
                {/* List of Existing Courses for reference */}
                <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
                    <Typography variant="h6" color="primary" mb={2}>Existing Courses ({courses.length})</Typography>
                    {loadingCourses ? (
                        <CircularProgress size={20} />
                    ) : (
                        <Grid container spacing={2}>
                            {courses.map(c => (
                                <Grid item xs={12} sm={6} key={c.id}>
                                    <Box sx={{ p: 1, bgcolor: '#e0f2f1', borderRadius: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">ID: {c.id} | {c.title}</Typography>
                                        <Typography variant="caption">{c.category} ({c.topic}) - Quiz ID: {c.quiz_id || 'None'}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>

            </Container>
        </Box>
    );
}