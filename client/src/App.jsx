import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProjectRoom from "./pages/ProjectRoom/layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:id/*" element={<ProjectRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
