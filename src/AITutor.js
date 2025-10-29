import React, { useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { 
    Box, Typography, Container, Paper, TextField, Button, CircularProgress, 
    List, ListItem, ListItemText, InputAdornment, IconButton
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";

function AITutor() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userQuestion = input.trim();
    // Optimistic UI update: Display user message immediately
    setHistory(h => [...h, { sender: "user", text: userQuestion }]);
    setInput("");
    setLoading(true);

    const token = localStorage.getItem("accessToken"); 
    
    if (!token) {
        setHistory(h => [...h, { sender: "system", text: "Error: Please log in to use the AI Tutor." }]);
        setLoading(false);
        return; 
    }

    try {
        const res = await axios.post(
          "/api/aitutor/",
          { question: userQuestion },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Add AI response to history
        setHistory(h => [...h, { sender: "ai", text: res.data.answer }]);
    } catch (err) {
         setHistory(h => [...h, { sender: "system", text: `Error: Could not connect to the tutor. (${err.response?.status || 'network error'})` }]);
         console.error("AI Tutor Error:", err);
    } finally {
        setLoading(false);
    }
  };

  const MessageBubble = ({ msg }) => {
    const isAI = msg.sender === 'ai';
    const isSystem = msg.sender === 'system';
    
    // Use theme colors: Primary (Teal) for AI, Accent (Orange) for User, Red for System
    const bgColor = isSystem 
      ? '#ffebee' // Very light red for system alerts
      : isAI 
        ? '#E0F2F1' // Lighter Teal for AI
        : '#FFF3E0'; // Lighter Orange/Beige for User

    const align = isAI ? 'flex-start' : 'flex-end';
    const icon = isAI ? <ChatIcon fontSize="small" color="primary" /> : <PersonIcon fontSize="small" color="secondary" />;
    const content = isSystem ? `[SYSTEM] ${msg.text}` : msg.text;

    return (
        <ListItem sx={{ justifyContent: align }}>
            <Paper 
                elevation={isSystem ? 0 : 2}
                sx={{ 
                    maxWidth: '80%', 
                    p: 1.5, 
                    borderRadius: 3, 
                    bgcolor: bgColor, 
                    border: isSystem ? '1px solid #e74c3c' : 'none'
                }}
            >
                <Box display="flex" alignItems="center" mb={0.5} color={isAI ? 'primary.main' : 'secondary.main'}>
                    {icon}
                    <Typography variant="caption" fontWeight="bold" sx={{ ml: 0.5 }}>
                        {isSystem ? 'System Alert' : isAI ? 'AI Tutor' : 'You'}
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.primary">
                    {content}
                </Typography>
            </Paper>
        </ListItem>
    );
  };


  return (
    <Box minHeight="100vh" sx={{background: "linear-gradient(90deg, #f5faff 0%, #e3f2fd 100%)"}}>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Your Adaptive AI Tutor
        </Typography>

        <Paper elevation={4} sx={{ borderRadius: 3, p: 2 }}>
            {/* Chat History Display Area */}
            <List sx={{ 
                maxHeight: 450, 
                overflowY: 'auto', 
                mb: 2, 
                p: 0 
            }}>
                {history.length === 0 && (
                    <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        sx={{ textAlign: 'center', py: 3 }}
                    >
                        Start by asking a question about math, ML, or any course material!
                    </Typography>
                )}
                {history.map((msg, i) => (
                    <MessageBubble key={i} msg={msg} />
                ))}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 2 }}>
                        <CircularProgress size={20} color="primary" />
                    </Box>
                )}
            </List>

            {/* Input Form */}
            <Box component="form" onSubmit={handleAsk} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Ask the EduAI Tutor..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton type="submit" color="primary" disabled={loading || input.trim() === ""}>
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Paper>
      </Container>
    </Box>
  );
}
export default AITutor;