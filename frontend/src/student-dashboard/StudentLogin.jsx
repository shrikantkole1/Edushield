import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, Lock, AlertCircle, Loader } from 'lucide-react';
import { loginStudent } from '../services/authApi';
import '../EduShield.css';

function StudentLogin({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await loginStudent(email, password);
            localStorage.setItem('student_token', data.token);
            localStorage.setItem('student_data', JSON.stringify(data.student));
            onLogin(data.student);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
            {/* ── Navbar ── */}
            <nav className="auth-navbar">
                <Link to="/" className="auth-nav-logo">
                    <div className="auth-nav-logo-icon">
                        <Shield size={17} color="#fff" strokeWidth={2.5} />
                    </div>
                    EduShield AI
                </Link>
                <div className="auth-nav-right">
                    <Link to="/" className="auth-nav-link">Home</Link>
                    <a href="#features" className="auth-nav-link">Features</a>
                    <button className="auth-nav-cta" onClick={onSwitchToRegister}>Create Account</button>
                </div>
            </nav>

            {/* ── Split Body ── */}
            <div className="auth-body">

                {/* LEFT — Hero */}
                <div className="auth-hero">
                    <div className="auth-hero-content">
                        <div className="auth-hero-logo">
                            <div className="auth-hero-logo-icon">
                                <Shield size={20} color="#fff" strokeWidth={2.5} />
                            </div>
                            <span className="auth-hero-logo-text">EduShield AI</span>
                        </div>

                        <div className="auth-hero-badge">
                            <span className="auth-hero-badge-dot" />
                            <span className="auth-hero-badge-text">Enterprise-grade federated learning</span>
                        </div>

                        <h1 className="auth-hero-title">
                            Unlock your<br />learning potential
                        </h1>

                        <p className="auth-hero-sub">
                            A high-trust, privacy-first analytics platform designed to pinpoint skill gaps and elevate your placement readiness — without ever compromising your data.
                        </p>

                        <div className="auth-metrics">
                            <div className="auth-metric">
                                <div className="auth-metric-header">
                                    <div className="auth-metric-icon"><Activity size={15} /></div>
                                    <span className="auth-metric-label">Performance</span>
                                </div>
                                <div className="auth-metric-val">94.2%</div>
                                <div className="auth-metric-hint">↑ +2.4% vs last week</div>
                            </div>

                            <div className="auth-metric">
                                <div className="auth-metric-header">
                                    <div className="auth-metric-icon"><Lock size={15} /></div>
                                    <span className="auth-metric-label">Data Privacy</span>
                                </div>
                                <div className="auth-metric-val">100%</div>
                                <div className="auth-metric-hint">✓ Federated edge</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Form */}
                <div className="auth-form-pane">
                    <div className="auth-form-card">
                        <h2 className="auth-form-title">Student Sign In</h2>
                        <p className="auth-form-sub">Enter your campus credentials to access your personalised dashboard.</p>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="auth-field">
                                <label className="auth-label" htmlFor="s-email">Email Address</label>
                                <input id="s-email" type="email" className="auth-input"
                                    placeholder="you@campus.edu"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    required autoFocus />
                            </div>

                            <div className="auth-field">
                                <label className="auth-label" htmlFor="s-pass">Password</label>
                                <input id="s-pass" type="password" className="auth-input"
                                    placeholder="Enter your password"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    required />
                            </div>

                            <div className="auth-extras">
                                <label className="auth-check-label">
                                    <input type="checkbox" className="auth-check" checked={remember} onChange={e => setRemember(e.target.checked)} />
                                    Remember me
                                </label>
                                <button type="button" className="auth-text-link">Forgot password?</button>
                            </div>

                            {error && (
                                <div className="auth-err">
                                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="auth-submit" disabled={loading}>
                                {loading
                                    ? <><Loader size={16} className="auth-spin" /> Authenticating...</>
                                    : 'Sign In'}
                            </button>
                        </form>

                        <div className="auth-form-footer">
                            Don't have an account?{' '}
                            <button className="auth-text-link" onClick={onSwitchToRegister}>Register here</button>
                        </div>

                        <div className="auth-trust">
                            <Lock size={13} />
                            End-to-end encrypted · Data stays on campus
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentLogin;
