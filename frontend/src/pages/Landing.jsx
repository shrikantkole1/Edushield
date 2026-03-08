import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Zap, ArrowRight, Brain, Shield, Target, Activity,
    TrendingUp, Users, BookOpen, CheckCircle2, ChevronRight,
    Lock, BarChart2, Heart
} from 'lucide-react';

export default function Landing() {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['workflow', 'features', 'stats'];
            const scrollPos = window.scrollY + window.innerHeight / 3;
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el) {
                    const { offsetTop, offsetHeight } = el;
                    if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                        setActiveSection(id);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' });
    };

    const stats = [
        { icon: Users, value: '2,400+', label: 'Students Enrolled' },
        { icon: BookOpen, value: '6', label: 'Campus Nodes' },
        { icon: TrendingUp, value: '91%', label: 'Readiness Lift' },
        { icon: CheckCircle2, value: '100%', label: 'Data Privacy' },
    ];

    const steps = [
        {
            num: '01', icon: Target,
            title: 'Register Securely',
            desc: 'Create your campus account. Your credentials never leave your local node — encrypted at rest and in transit.',
            gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)',
        },
        {
            num: '02', icon: Brain,
            title: 'AI Analyses Locally',
            desc: 'Our federated learning engine processes your attendance, marks, and participation — on your campus server, not a central cloud.',
            gradient: 'linear-gradient(135deg,#6366f1,#a855f7)',
        },
        {
            num: '03', icon: Activity,
            title: 'Act on Your Insights',
            desc: 'Receive personalized study plans, placement readiness scores, and skill-gap recommendations updated in real time.',
            gradient: 'linear-gradient(135deg,#a855f7,#ec4899)',
        },
    ];

    const features = [
        {
            icon: Shield,
            title: 'Federated Privacy',
            desc: 'Raw student data never leaves campus. Only encrypted model gradients are shared — industry-grade differential privacy built in.',
            gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)',
        },
        {
            icon: BarChart2,
            title: 'Placement Readiness',
            desc: 'Multi-dimensional readiness scoring across academics, skills, and extracurriculars. Know exactly where you stand before the interview.',
            gradient: 'linear-gradient(135deg,#6366f1,#a855f7)',
        },
        {
            icon: Brain,
            title: 'Adaptive Study Plans',
            desc: 'AI-generated weekly plans that recalibrate to your actual performance, prioritising high-risk subjects and available study hours.',
            gradient: 'linear-gradient(135deg,#a855f7,#ec4899)',
        },
    ];

    return (
        <div className="lp-root">
            {/* Background orbs */}
            <div className="lp-orb lp-orb-1" />
            <div className="lp-orb lp-orb-2" />

            {/* ── Navbar ── */}
            <nav className="lp-nav">
                <div className="lp-nav-inner">
                    <a href="/" className="lp-logo">
                        <div className="lp-logo-icon">
                            <Shield size={20} color="#fff" strokeWidth={2.5} />
                        </div>
                        Edu<span className="lp-logo-accent">Shield</span> AI
                    </a>

                    <div className="lp-nav-links">
                        <button className={`lp-nav-btn ${activeSection === 'workflow' ? 'active' : ''}`} onClick={() => scrollTo('workflow')}>Workflow</button>
                        <button className={`lp-nav-btn ${activeSection === 'features' ? 'active' : ''}`} onClick={() => scrollTo('features')}>Features</button>
                        <button className={`lp-nav-btn ${activeSection === 'stats' ? 'active' : ''}`} onClick={() => scrollTo('stats')}>Impact</button>
                    </div>

                    <Link to="/student/login" className="lp-nav-cta">
                        Sign In <ArrowRight size={15} />
                    </Link>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="lp-hero">
                <div className="lp-hero-chip">
                    <span className="lp-hero-chip-dot" />
                    AI-Powered Academic Intelligence — Privacy First
                </div>

                <h1 className="lp-hero-title">
                    Protect Privacy.<br />
                    <span className="lp-hero-gradient">Unlock Potential.</span>
                </h1>

                <p className="lp-hero-sub">
                    EduShield AI combines federated machine learning with actionable analytics — so students grow smarter and admins lead with clarity, without ever centralising sensitive data.
                </p>

                <div className="lp-hero-btns">
                    <Link to="/student/login" className="lp-btn-primary">
                        Student Login <ArrowRight size={18} />
                    </Link>
                    <button className="lp-btn-secondary" onClick={() => scrollTo('workflow')}>
                        Discover How <ChevronRight size={18} />
                    </button>
                </div>

                {/* Stats grid */}
                <div id="stats" className="lp-stats">
                    {stats.map(({ icon: Icon, value, label }) => (
                        <div key={label} className="lp-stat-card">
                            <Icon className="lp-stat-icon" strokeWidth={1.5} />
                            <div className="lp-stat-val">{value}</div>
                            <div className="lp-stat-label">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Workflow Section ── */}
            <section id="workflow" className="lp-section" style={{ position: 'relative' }}>
                <div className="lp-workflow-overlay" />
                <div className="lp-section-inner">
                    <span className="lp-section-label">Your Path to Excellence</span>
                    <h2 className="lp-section-title">
                        Three Steps to <span className="lp-hero-gradient">Clarity</span>
                    </h2>
                    <p className="lp-section-sub">
                        From registration to actionable insight — all within your campus walls, all federated.
                    </p>

                    <div className="lp-steps">
                        {steps.map(({ num, icon: Icon, title, desc, gradient }) => (
                            <div key={num} className="lp-step-card">
                                <div className="lp-step-num">{num}</div>

                                <div className="lp-step-icon-wrap">
                                    <div className="lp-step-icon-glow" style={{ background: gradient, filter: 'blur(24px)' }} />
                                    <div className="lp-step-icon-inner">
                                        <Icon size={38} color="#818cf8" strokeWidth={1.8} />
                                    </div>
                                </div>

                                <h3 className="lp-step-title">{title}</h3>
                                <p className="lp-step-desc">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section id="features" className="lp-section">
                <div className="lp-section-inner">
                    <span className="lp-section-label">Core Capabilities</span>
                    <h2 className="lp-section-title">
                        Built for <span className="lp-hero-gradient">Trust</span>
                    </h2>
                    <p className="lp-section-sub">
                        Precision-engineered features that respect privacy while maximising student success.
                    </p>

                    <div className="lp-features">
                        {features.map(({ icon: Icon, title, desc, gradient }, i) => (
                            <div key={i} className="lp-feature-card" style={{ '--accent': gradient }}>
                                <div className="lp-feature-icon" style={{ background: gradient }}>
                                    <Icon size={28} color="#fff" strokeWidth={2} />
                                </div>
                                <h3 className="lp-feature-title">{title}</h3>
                                <p className="lp-feature-desc">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <div className="lp-cta-section">
                <div className="lp-cta-inner">
                    <h2 className="lp-cta-title">
                        Ready to <span className="lp-hero-gradient">Transform</span><br />Your Campus?
                    </h2>
                    <p className="lp-cta-sub">
                        Join thousands of students who already benefit from AI-driven, privacy-preserving insights.
                    </p>
                    <Link to="/student/login" className="lp-btn-mega">
                        Get Started — It's Free <ArrowRight size={22} />
                    </Link>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="lp-footer">
                <div className="lp-footer-inner">
                    <div className="lp-footer-text">
                        <Zap size={16} color="#818cf8" />
                        <span style={{ color: '#fff' }}>EduShield AI</span> · 2026
                    </div>
                    <div className="lp-footer-text">
                        Built with <Heart size={14} color="#f43f5e" fill="#f43f5e" style={{ margin: '0 4px' }} /> for Smart Campuses
                    </div>
                    <div className="lp-footer-links">
                        <a href="/student/login" className="lp-footer-link">Student Portal</a>
                        <a href="/login" className="lp-footer-link">Admin</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
