import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, AlertCircle, Loader } from 'lucide-react';
import { registerStudent } from '../services/authApi';
import '../EduShield.css';

function StudentRegister({ onRegister, onSwitchToLogin }) {
    const [form, setForm] = useState({
        student_id: '', name: '', email: '',
        password: '', confirmPassword: '',
        department: 'Computer Science'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const depts = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology'];

    const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
        if (form.password.length < 6) return setError('Password must be at least 6 characters.');
        setLoading(true);
        try {
            const data = await registerStudent({
                student_id: form.student_id, name: form.name,
                email: form.email, password: form.password, department: form.department
            });
            localStorage.setItem('student_token', data.token);
            localStorage.setItem('student_data', JSON.stringify(data.student));
            onRegister(data.student);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
            <nav className="auth-navbar">
                <Link to="/" className="auth-nav-logo">
                    <div className="auth-nav-logo-icon">
                        <Shield size={17} color="#fff" strokeWidth={2.5} />
                    </div>
                    EduShield AI
                </Link>
                <div className="auth-nav-right">
                    <Link to="/" className="auth-nav-link">Home</Link>
                    <button className="auth-nav-cta" onClick={onSwitchToLogin}>Sign In</button>
                </div>
            </nav>

            <div className="auth-body">
                {/* LEFT */}
                <div className="auth-hero">
                    <div className="auth-hero-content">
                        <div className="auth-hero-logo">
                            <div className="auth-hero-logo-icon"><Shield size={20} color="#fff" strokeWidth={2.5} /></div>
                            <span className="auth-hero-logo-text">EduShield AI</span>
                        </div>
                        <div className="auth-hero-badge">
                            <span className="auth-hero-badge-dot" />
                            <span className="auth-hero-badge-text">Join the edge network</span>
                        </div>
                        <h1 className="auth-hero-title">Secure your<br />academic future</h1>
                        <p className="auth-hero-sub">
                            Register once and let our federated AI track your growth — locally, privately, and intelligently.
                        </p>
                        <div className="auth-metrics">
                            <div className="auth-metric">
                                <div className="auth-metric-header">
                                    <div className="auth-metric-icon"><Lock size={15} /></div>
                                    <span className="auth-metric-label">Local Processing</span>
                                </div>
                                <div className="auth-metric-val">100%</div>
                                <div className="auth-metric-hint">✓ Zero central storage</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="auth-form-pane">
                    <div className="auth-form-card" style={{ maxWidth: 420 }}>
                        <h2 className="auth-form-title">Create Account</h2>
                        <p className="auth-form-sub">Set up your student profile for personalised analytics.</p>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="auth-field-row">
                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="r-id">Student ID</label>
                                    <input id="r-id" name="student_id" type="text" className="auth-input" placeholder="e.g. 5"
                                        value={form.student_id} onChange={onChange} required />
                                </div>
                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="r-name">Full Name</label>
                                    <input id="r-name" name="name" type="text" className="auth-input" placeholder="John Doe"
                                        value={form.name} onChange={onChange} required />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label className="auth-label" htmlFor="r-email">Email Address</label>
                                <input id="r-email" name="email" type="email" className="auth-input" placeholder="you@campus.edu"
                                    value={form.email} onChange={onChange} required />
                            </div>

                            <div className="auth-field">
                                <label className="auth-label" htmlFor="r-dept">Department</label>
                                <select id="r-dept" name="department" className="auth-input"
                                    value={form.department} onChange={onChange}>
                                    {depts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div className="auth-field-row">
                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="r-pw">Password</label>
                                    <input id="r-pw" name="password" type="password" className="auth-input" placeholder="Min 6 chars"
                                        value={form.password} onChange={onChange} required />
                                </div>
                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="r-cpw">Confirm</label>
                                    <input id="r-cpw" name="confirmPassword" type="password" className="auth-input" placeholder="Repeat"
                                        value={form.confirmPassword} onChange={onChange} required />
                                </div>
                            </div>

                            {error && (
                                <div className="auth-err">
                                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="auth-submit" disabled={loading}>
                                {loading ? <><Loader size={16} className="auth-spin" /> Creating account...</> : 'Create Account'}
                            </button>
                        </form>

                        <div className="auth-form-footer">
                            Already have an account?{' '}
                            <button className="auth-text-link" onClick={onSwitchToLogin}>Sign in instead</button>
                        </div>
                        <div className="auth-trust"><Lock size={13} />Data processed locally on campus</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentRegister;
