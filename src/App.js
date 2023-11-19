import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/fragments/login/Login";
import Employees from "./components/fragments/employees/Employees";
import Admin from "./components/pages/admin/Admin";
import Schedules from "./components/fragments/schedules/Schedules";
import Engineer from "./components/pages/engineer/Engineer";
import QualityControl from "./components/fragments/qualityControl/QualityControl";
import ProjectTable from "./components/fragments/projects/ProjectTable";
import ProjectDetails from "./components/fragments/projects/ProjectDetails";




function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/engineer" element={<Engineer />} />
          <Route path="/log" element={<Login />} />
          <Route path="/exit" element={<Login />} />
          <Route path="/quality" element={<QualityControl />} />
          <Route path="/project-details/:projectId" element={<Schedules />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
