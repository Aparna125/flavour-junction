import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Feedback from "./pages/Feedback.jsx";
import ThankYou from "./pages/ThankYou.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminFeedback from "./pages/AdminFeedback.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";

// Temporary placeholder until the remaining admin pages are built.
const Placeholder = ({ title }) => (
  <section className="page">
    <h1 className="placeholder-title">{title}</h1>
  </section>
);

export default function App() {
  const { pathname } = useLocation();
  // Admin screens use their own layout, so hide the public header and tab bar there.
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/feedback/success" element={<ThankYou />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
      {!isAdmin && <BottomNav />}
    </>
  );
}
