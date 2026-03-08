import React, { useState, useEffect } from 'react';
import TrainingControl from './TrainingControl';
import Visualization from './Visualization';
import ClientSimulator from './ClientSimulator';
import Comparison from './Comparison';
import SkillGap from './SkillGap';
import ReadinessScore from './ReadinessScore';
import Explainability from './Explainability';
import { healthCheck } from '../services/api';

/* ── icon imports from lucide (already in deps) ── */
import {
    Shield, LayoutDashboard, Monitor, GitCompare,
    Target, Trophy, Microscope, LogOut, ChevronRight,
    RefreshCw, Wifi, WifiOff
} from 'lucide-react';

/* ── nav config ── */
const NAV = [
    {
        section: 'Federated Learning',
        items: [
            { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { key: 'clients', label: 'Client Nodes', icon: Monitor },
            { key: 'comparison', label: 'Comparison', icon: GitCompare },
        ],
    },
    {
        section: 'Career Intelligence',
        items: [
            { key: 'skill-gap', label: 'Skill Gap', icon: Target },
            { key: 'readiness', label: 'Readiness Score', icon: Trophy },
            { key: 'explainability', label: 'Explainable AI', icon: Microscope },
        ],
    },
];

const TAB_TITLE = {
    overview: 'Training Dashboard',
    clients: 'Client Management',
    comparison: 'Model Comparison',
    'skill-gap': 'Skill Gap Analysis',
    readiness: 'Interview Readiness',
    explainability: 'Explainable AI',
};

const TAB_SUB = {
    overview: 'Monitor and control federated learning training',
    clients: 'View and manage connected campus nodes',
    comparison: 'Compare centralised vs federated approaches',
    'skill-gap': 'Analyse skill gaps against target job roles',
    readiness: 'ML-powered placement readiness prediction',
    explainability: 'SHAP-based model explanation and interpretability',
};

const TAB_EMOJI = {
    overview: '📊', clients: '💻', comparison: '⚖️',
    'skill-gap': '🎯', readiness: '🏆', explainability: '🔬',
};

function Dashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [serverStatus, setServerStatus] = useState('checking');

    useEffect(() => {
        ping();
        const id = setInterval(ping, 10000);
        return () => clearInterval(id);
    }, []);

    const ping = async () => {
        try { await healthCheck(); setServerStatus('online'); }
        catch { setServerStatus('offline'); }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <><TrainingControl /><Visualization /></>;
            case 'clients': return <ClientSimulator />;
            case 'comparison': return <Comparison />;
            case 'skill-gap': return <SkillGap />;
            case 'readiness': return <ReadinessScore />;
            case 'explainability': return <Explainability />;
            default: return <TrainingControl />;
        }
    };

    const online = serverStatus === 'online';

    return (
        <div className="adm-layout">

            {/* ══ SIDEBAR ══ */}
            <aside className="adm-sidebar">
                {/* Brand */}
                <div className="adm-brand">
                    <div className="adm-brand-icon">
                        <Shield size={18} color="#fff" strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="adm-brand-name">EduShield AI</div>
                        <div className="adm-brand-sub">Admin Console</div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="adm-nav">
                    {NAV.map(({ section, items }) => (
                        <div key={section}>
                            <div className="adm-nav-section">{section}</div>
                            {items.map(({ key, label, icon: Icon }) => {
                                const active = activeTab === key;
                                return (
                                    <button
                                        key={key}
                                        className={`adm-nav-item${active ? ' active' : ''}`}
                                        onClick={() => setActiveTab(key)}
                                    >
                                        <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                                        <span>{label}</span>
                                        {active && <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#a5b4fc' }} />}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="adm-sidebar-footer">
                    {/* Server status */}
                    <div className="adm-server-status">
                        <div className={`adm-status-dot${online ? ' online' : ' offline'}`} />
                        <div>
                            <div className="adm-status-label">Server Status</div>
                            <div className={`adm-status-val${online ? ' online' : ' offline'}`}>
                                {online ? 'Online' : serverStatus === 'checking' ? 'Checking…' : 'Offline'}
                            </div>
                        </div>
                        {online
                            ? <Wifi size={15} style={{ marginLeft: 'auto', color: '#10b981', flexShrink: 0 }} />
                            : <WifiOff size={15} style={{ marginLeft: 'auto', color: '#ef4444', flexShrink: 0 }} />}
                    </div>

                    {/* Logout */}
                    <button className="adm-logout" onClick={onLogout}>
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* ══ MAIN ══ */}
            <main className="adm-main">
                {/* Page header */}
                <div className="adm-page-header">
                    <div>
                        <p className="adm-page-date">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <h1 className="adm-page-title">
                            <span className="adm-title-emoji">{TAB_EMOJI[activeTab]}</span>
                            {TAB_TITLE[activeTab]}
                        </h1>
                        <p className="adm-page-sub">{TAB_SUB[activeTab]}</p>
                    </div>
                    <button className="adm-refresh-btn" onClick={ping} title="Refresh server status">
                        <RefreshCw size={15} />
                    </button>
                </div>

                {/* Tab content */}
                <div className="adm-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
