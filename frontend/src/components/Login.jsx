import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Settings, AlertCircle } from 'lucide-react';
import '../EduShield.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            onLogin();
        } else {
            setError('Invalid credentials. Use admin / admin123');
        }
    };

    return (
        <div className="auth-root">
            <nav className="auth-navbar">
                <a href="/" className="auth-nav-logo">
                    <div className="auth-nav-logo-icon">
                        <Shield size={17} color="#fff" strokeWidth={2.5} />
                    </div>
                    EduShield Admin
                </a>
                <div className="auth-nav-right">
                    <Link to="/" className="auth-nav-link">Home</Link>
                    <Link to="/student/login" className="auth-nav-cta">Student Portal</Link>
                </div>
            </nav>

            <div className="auth-body">
                {/* LEFT */}
                <div className="auth-hero">
                    <div className="auth-hero-content">
                        <div className="auth-hero-logo">
                            <div className="auth-hero-logo-icon"><Settings size={20} color="#fff" strokeWidth={2} /></div>
                            <span className="auth-hero-logo-text">System Administration</span>
                        </div>
                        <div className="auth-hero-badge">
                            <span className="auth-hero-badge-dot" />
                            <span className="auth-hero-badge-text">Central Aggregation Node</span>
                        </div>
                        <h1 className="auth-hero-title">Manage the<br />intelligence network</h1>
                        <p className="auth-hero-sub">
                            Orchestrate federated learning model updates across campus nodes, monitor system health, and view aggregated analytics — without accessing individual student data.
                        </p>
                        <div className="auth-metrics">
                            <div className="auth-metric">
                                <div className="auth-metric-header">
                                    <div className="auth-metric-icon"><Shield size={15} /></div>
                                    <span className="auth-metric-label">Active Nodes</span>
                                </div>
                                <div className="auth-metric-val">5/5</div>
                                <div className="auth-metric-hint">✓ Nodes fully synced</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="auth-form-pane">
                    <div className="auth-form-card">
                        <h2 className="auth-form-title">Admin Access</h2>
                        <p className="auth-form-sub">Authenticate to enter the federated control plane.</p>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="auth-field">
                                <label className="auth-label" htmlFor="a-user">Username</label>
                                <input id="a-user" type="text" className="auth-input" placeholder="Enter admin username"
                                    value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
                            </div>

                            <div className="auth-field" style={{ marginBottom: '1.5rem' }}>
                                <label className="auth-label" htmlFor="a-pass">Password</label>
                                <input id="a-pass" type="password" className="auth-input" placeholder="Enter secure password"
                                    value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>

                            {error && (
                                <div className="auth-err">
                                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="auth-submit">Authenticate</button>
                        </form>

                        <div className="auth-demo">
                            <p>Demo Credentials</p>
                            <p>Username: <code>admin</code> &nbsp;|&nbsp; Password: <code>admin123</code></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
