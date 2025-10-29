import React from "react";
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ForumIcon from "@mui/icons-material/Forum";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";
import { Link } from "react-router-dom";

const drawerWidth = 220;

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { to: "/forum", label: "Forum", icon: <ForumIcon /> },
  { to: "/quiz", label: "Quiz", icon: <SchoolIcon /> },
  { to: "/analytics", label: "Analytics", icon: <AssessmentIcon /> }
];

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            EduAI
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth, flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          {navLinks.map((item) => (
            <ListItem button key={item.to} component={Link} to={item.to}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main style={{ flexGrow: 1, padding: "32px", marginLeft: `${drawerWidth}px`, marginTop: "64px" }}>
        {children}
      </main>
    </div>
  );
}
