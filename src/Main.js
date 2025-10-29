import { Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import QuizForm from "./QuizForm";
import AITutor from "./AITutor";
import ProgressAnalytics from "./ProgressAnalytics";
import AIRecommendations from "./AIRecommendations";
// DELETE IMPORTS for: TutorHistory, UploadedMaterials, MLRecommendations, Leaderboard, Badges, Challenges, Feedback, AccessibilitySettings, Chat, Forum

import ContentUpload from "./ContentUpload"; // Admin Panel
import ProfileSettings from "./ProfileSettings";
import ForgotPassword from "./ForgotPassword";
import CourseList from "./CourseList"; 
import Badges from "./Badges"; // KEEP if Badges is still on Dashboard, but remove route.

function Main() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quiz" element={<QuizForm />} />
      <Route path="/aitutor" element={<AITutor />} />
      <Route path="/analytics" element={<ProgressAnalytics />} />
      {/* REMOVED: /tutor-history, /materials, /ml-recommend, /leaderboard, /badges, /challenges, /feedback, /accessibility, /chat */}
      
      <Route path="/courses" element={<CourseList />} /> 
      <Route path="/upload" element={<ContentUpload />} /> 
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default Main;