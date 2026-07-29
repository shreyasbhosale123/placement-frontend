import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="students" element={<Students />} />

          <Route path="jobs" element={<Jobs />} />

          <Route path="applications" element={<Applications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}