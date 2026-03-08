import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import PortalLogin from './components/PortalLogin';
import Dashboard from './components/Dashboard';
import StudentRegister from './student-dashboard/StudentRegister';
import StudentDashboard from './student-dashboard/StudentDashboard';
import './EduShield.css';
/* Keep App.css only for the admin Dashboard component (legacy) */
import './App.css';

function App() {
    const [isAdmin, setAdmin] = useState(false);
    const [studentAuth, setStudentAuth] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [studentView, setStudentView] = useState('login');

    useEffect(() => {
        if (localStorage.getItem('authenticated') === 'true') setAdmin(true);
        const tok = localStorage.getItem('student_token');
        const data = localStorage.getItem('student_data');
        if (tok && data) { setStudentAuth(true); setStudentData(JSON.parse(data)); }
    }, []);

    const handleAdminLogin = () => {
        localStorage.setItem('authenticated', 'true');
        setAdmin(true);
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('authenticated');
        setAdmin(false);
    };

    const handleStudentLogin = (s) => {
        setStudentAuth(true);
        setStudentData(s);
    };

    const handleStudentLogout = () => {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_data');
        setStudentAuth(false);
        setStudentData(null);
        setStudentView('login');
    };

    return (
        <Router>
            <Routes>
                {/* Landing */}
                <Route path="/" element={<Landing />} />

                {/* Unified login — /login and /student/login share this component */}
                <Route
                    path="/login"
                    element={
                        isAdmin
                            ? <Navigate to="/dashboard" replace />
                            : <PortalLogin
                                onStudentLogin={handleStudentLogin}
                                onAdminLogin={handleAdminLogin}
                            />
                    }
                />
                <Route
                    path="/student/login"
                    element={
                        studentAuth
                            ? <Navigate to="/student/dashboard" replace />
                            : studentView === 'register'
                                ? <StudentRegister
                                    onRegister={handleStudentLogin}
                                    onSwitchToLogin={() => setStudentView('login')}
                                />
                                : <PortalLogin
                                    onStudentLogin={handleStudentLogin}
                                    onAdminLogin={handleAdminLogin}
                                />
                    }
                />

                {/* Admin dashboard */}
                <Route
                    path="/dashboard"
                    element={isAdmin ? <Dashboard onLogout={handleAdminLogout} /> : <Navigate to="/login" replace />}
                />

                {/* Student register */}
                <Route
                    path="/student/register"
                    element={
                        studentAuth
                            ? <Navigate to="/student/dashboard" replace />
                            : <StudentRegister
                                onRegister={handleStudentLogin}
                                onSwitchToLogin={() => setStudentView('login')}
                            />
                    }
                />

                {/* Student dashboard */}
                <Route
                    path="/student/dashboard"
                    element={
                        studentAuth && studentData
                            ? <StudentDashboard student={studentData} onLogout={handleStudentLogout} />
                            : <Navigate to="/student/login" replace />
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
