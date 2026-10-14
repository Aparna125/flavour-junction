import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";

// Temporary placeholder until the remaining pages are built.
const Placeholder = ({ title }) => (
  <main className="page">
    <h1 className="placeholder-title">{title}</h1>
  </main>
);

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Placeholder title="Feedback" />} />
        <Route path="/feedback/success" element={<Placeholder title="Thank you" />} />
        <Route path="/admin/login" element={<Placeholder title="Admin Login" />} />
      </Routes>
      <BottomNav />
    </>
  );
}
