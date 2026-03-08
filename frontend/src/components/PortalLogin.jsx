import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, Settings, AlertCircle, Lock, Activity, ArrowRight } from 'lucide-react';
import '../EduShield.css';

/* ─── Unified Portal Login ─── */
function PortalLogin({ onStudentLogin, onAdminLogin }) {
    const navigate = useNavigate();
    const [portal, setPortal] = useState('student'); // 'student' | 'admin'

    /* Student state — name + email only, no password */
    const [sName, setSName] = useState('');
    const [sEmail, setSEmail] = useState('');
    const [sError, setSError] = useState('');

    /* Admin state */
    const [aUser, setAUser] = useState('');
    const [aPassword, setAPassword] = useState('');
    const [aError, setAError] = useState('');

    /* ── Student: instant local session — no API needed ── */
    const handleStudentSubmit = (e) => {
        e.preventDefault();
        setSError('');
        const name = sName.trim();
        const email = sEmail.trim().toLowerCase();

        if (!name) { setSError('Please enter your full name.'); return; }
        if (!email) { setSError('Please enter your email address.'); return; }
        if (!email.includes('@')) { setSError('Enter a valid email address.'); return; }

        /* Build a local student session — student_id 1 maps to real analytics data */
        const student = {
            student_id: '1',
            name,
            email,
            department: 'Computer Science',
            client_id: 1,
        };

        localStorage.setItem('student_token', 'local-session-' + Date.now());
        localStorage.setItem('student_data', JSON.stringify(student));
        onStudentLogin(student);
    };

    /* ── Admin: hardcoded credential check ── */
    const handleAdminSubmit = (e) => {
        e.preventDefault();
        setAError('');
        const u = aUser.trim();
        const p = aPassword.trim();
        if (u === 'admin' && p === 'admin123') {
            onAdminLogin();
            navigate('/dashboard', { replace: true });
        } else {
            setAError('Invalid credentials. Use admin / admin123');
        }
    };

    const isStudent = portal === 'student';

    return (
        <div className="auth-root">
            <div className="auth-body">

                {/* ── LEFT hero ── */}
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

                {/* ── RIGHT form pane ── */}
                <div className="auth-form-pane">
                    <div className="auth-form-card">

                        {/* Portal toggle */}
                        <div style={{
                            display: 'flex', background: '#f1f5f9',
                            borderRadius: 12, padding: 4, marginBottom: '1.75rem', gap: 4,
                        }}>
                            {[
                                { key: 'student', label: 'Student', icon: GraduationCap },
                                { key: 'admin', label: 'Admin', icon: Settings },
                            ].map(({ key, label, icon: Icon }) => {
                                const active = portal === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => { setPortal(key); setSError(''); setAError(''); }}
                                        style={{
                                            flex: 1, display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', gap: 7,
                                            padding: '0.55rem 0.75rem', borderRadius: 9, border: 'none',
                                            cursor: 'pointer', fontSize: '0.86rem',
                                            fontWeight: active ? 700 : 500,
                                            fontFamily: 'Inter, -apple-system, sans-serif',
                                            transition: 'all 0.2s ease',
                                            background: active ? '#fff' : 'transparent',
                                            color: active ? '#4f46e5' : '#64748b',
                                            boxShadow: active ? '0 1px 6px rgba(15,23,42,0.10)' : 'none',
                                        }}
                                    >
                                        <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                                        {label} Portal
                                    </button>
                                );
                            })}
                        </div>

                        {/* ══ STUDENT FORM — name + email only ══ */}
                        {isStudent && (
                            <>
                                <h2 className="auth-form-title">Welcome, Student</h2>
                                <p className="auth-form-sub">Enter your name and email to access your personalised dashboard instantly.</p>

                                <form onSubmit={handleStudentSubmit} noValidate>
                                    <div className="auth-field">
                                        <label className="auth-label" htmlFor="s-name">Full Name</label>
                                        <input
                                            id="s-name"
                                            type="text"
                                            className="auth-input"
                                            placeholder="e.g. Priya Sharma"
                                            value={sName}
                                            onChange={e => setSName(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <div className="auth-field" style={{ marginBottom: '1.5rem' }}>
                                        <label className="auth-label" htmlFor="s-email">Email Address</label>
                                        <input
                                            id="s-email"
                                            type="email"
                                            className="auth-input"
                                            placeholder="you@campus.edu"
                                            value={sEmail}
                                            onChange={e => setSEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {sError && (
                                        <div className="auth-err">
                                            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                                            {sError}
                                        </div>
                                    )}

                                    <button type="submit" className="auth-submit">
                                        Enter Dashboard &nbsp;<ArrowRight size={15} />
                                    </button>

                                    <div className="auth-trust" style={{ marginTop: '1.1rem' }}>
                                        <Lock size={13} />
                                        No password needed · Data stays on campus
                                    </div>
                                </form>
                            </>
                        )}

                        {/* ══ ADMIN FORM ══ */}
                        {!isStudent && (
                            <>
                                <h2 className="auth-form-title">Admin Access</h2>
                                <p className="auth-form-sub">Authenticate to enter the federated control plane.</p>

                                <form onSubmit={handleAdminSubmit} noValidate>
                                    <div className="auth-field">
                                        <label className="auth-label" htmlFor="a-user">Username</label>
                                        <input
                                            id="a-user"
                                            type="text"
                                            className="auth-input"
                                            placeholder="Enter admin username"
                                            value={aUser}
                                            onChange={e => setAUser(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="auth-field" style={{ marginBottom: '1.5rem' }}>
                                        <label className="auth-label" htmlFor="a-pass">Password</label>
                                        <input
                                            id="a-pass"
                                            type="password"
                                            className="auth-input"
                                            placeholder="Enter secure password"
                                            value={aPassword}
                                            onChange={e => setAPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {aError && (
                                        <div className="auth-err">
                                            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                                            {aError}
                                        </div>
                                    )}

                                    <button type="submit" className="auth-submit">Authenticate</button>

                                    <div className="auth-demo">
                                        <p>Demo Credentials</p>
                                        <p>Username: <code>admin</code> &nbsp;|&nbsp; Password: <code>admin123</code></p>
                                    </div>
                                </form>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default PortalLogin;
