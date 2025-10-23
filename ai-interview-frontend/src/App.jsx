import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

function DashboardWrapper({children}) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/" />;
  return <>{children}</>;
}

function App() {
    return (
        <Router>
            <Navbar />
            <div className = "p-6">
                <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    <DashboardWrapper>
                        <Dashboard />
                    </DashboardWrapper>
                    } 
                />
                </Routes>
            </div>
        </Router>
    );
}
export default App;