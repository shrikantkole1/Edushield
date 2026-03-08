import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Shield, LayoutDashboard, BookOpen, Zap, MessageSquare,
    RefreshCw, LogOut, TrendingUp, AlertTriangle, CheckCircle,
    Clock, Target, ChevronRight, Activity
} from 'lucide-react';
import { predictRisk, getPlacementReadiness, getStudyPlan, getAttendance, getMarks } from '../services/studentApi';
import '../EduShield.css';

/* ── helpers ── */
const riskColor = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const riskBg = { high: '#fef2f2', medium: '#fffbeb', low: '#ecfdf5' };
const gradeColor = (g) => ({ 'A+': '#10b981', A: '#10b981', B: '#34d399', C: '#f59e0b', D: '#f97316' }[g] || '#ef4444');
const readColor = { excellent: '#10b981', good: '#34d399', moderate: '#f59e0b', needs_improvement: '#ef4444' };
const prioColor = { critical: '#ef4444', high: '#f97316', medium: '#6366f1', maintain: '#10b981' };
const prioBg = { critical: '#fef2f2', high: '#fff7ed', medium: '#eff6ff', maintain: '#ecfdf5' };

/* ── Animated SVG Ring ── */
function RingChart({ value = 0, size = 110, stroke = 11, color = '#6366f1', label, sub }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (circ * Math.min(value, 100)) / 100;
    return (
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                    stroke="#f1f5f9" strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                    stroke={color} strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.16,1,.3,1)' }} />
            </svg>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 0,
            }}>
                <span style={{ fontSize: size > 90 ? '1.35rem' : '1.1rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{label}</span>
                {sub && <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 2 }}>{sub}</span>}
            </div>
        </div>
    );
}

/* ── Mini bar ── */
function MiniBar({ value, color, height = 6 }) {
    return (
        <div style={{ flex: 1, height, background: '#f1f5f9', borderRadius: height, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(value, 100)}%`, background: color, borderRadius: height, transition: 'width 0.9s cubic-bezier(.16,1,.3,1)' }} />
        </div>
    );
}

/* ── Stat Pill ── */
function StatPill({ label, value, color }) {
    return (
        <div style={{ flex: 1, textAlign: 'center', padding: '0.6rem 0.5rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: color || '#4f46e5' }}>{value}</div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginTop: 2 }}>{label}</div>
        </div>
    );
}

/* ── Section card wrapper ── */
function SCard({ title, badge, badgeColor, badgeBg, icon: Icon, children, accent }) {
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #e8edf4',
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
            transition: 'box-shadow 0.25s ease',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(15,23,42,0.10)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(15,23,42,0.05)'}
        >
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.95rem 1.3rem',
                borderBottom: '1px solid #f1f5f9',
                background: accent ? `linear-gradient(135deg,${accent}08,transparent)` : 'transparent',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    {Icon && <Icon size={15} style={{ color: accent || '#6366f1' }} />}
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155' }}>{title}</span>
                </div>
                {badge && (
                    <span style={{
                        padding: '0.18rem 0.65rem',
                        borderRadius: 30,
                        fontSize: '0.67rem',
                        fontWeight: 800,
                        letterSpacing: '0.4px',
                        color: badgeColor || '#fff',
                        background: badgeBg || '#6366f1',
                    }}>{badge}</span>
                )}
            </div>
            <div style={{ padding: '1.1rem 1.3rem' }}>{children}</div>
        </div>
    );
}

/* ════════════════════════════════════════
   OVERVIEW TAB
════════════════════════════════════════ */
function Overview({ riskData, placementData, attendance, marks }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem' }}>

            {/* ── Risk Card ── */}
            <SCard
                title="Attendance Risk"
                icon={AlertTriangle}
                accent={riskData ? riskColor[riskData.risk_level] : '#6366f1'}
                badge={riskData ? riskData.risk_level.toUpperCase() : null}
                badgeBg={riskData ? riskColor[riskData.risk_level] : undefined}
            >
                {riskData ? (
                    <>
                        <div style={{
                            padding: '0.7rem 0.9rem', borderRadius: 12,
                            background: riskBg[riskData.risk_level] || '#f8fafc',
                            marginBottom: '0.9rem',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Risk Score</span>
                                <span style={{ fontSize: '0.74rem', fontWeight: 900, color: riskColor[riskData.risk_level] }}>{riskData.risk_score}%</span>
                            </div>
                            <MiniBar value={riskData.risk_score} color={`linear-gradient(90deg,#10b981,#f59e0b,#ef4444)`} height={8} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                            {riskData.factors && Object.entries(riskData.factors).map(([k, v]) => (
                                <div key={k} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '0.45rem 0.65rem', background: '#f8fafc', borderRadius: 8, fontSize: '0.77rem'
                                }}>
                                    <span style={{ color: '#64748b', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                                    <span style={{ fontWeight: 700, color: '#334155' }}>
                                        {typeof v === 'number' && (k.includes('rate') || k.includes('participation')) ? `${v}%` : v}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : <EmptySlate text="No risk data available" />}
            </SCard>

            {/* ── Placement Card ── */}
            <SCard
                title="Placement Readiness"
                icon={Target}
                accent="#6366f1"
                badge={placementData ? placementData.level.replace('_', ' ').toUpperCase() : null}
                badgeBg={placementData ? readColor[placementData.level] : undefined}
            >
                {placementData ? (
                    <div style={{ display: 'flex', gap: '1.1rem', alignItems: 'center' }}>
                        <RingChart
                            value={placementData.readiness_score}
                            size={105}
                            stroke={10}
                            color="#6366f1"
                            label={`${placementData.readiness_score}%`}
                            sub="ready"
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {placementData.breakdown && Object.entries(placementData.breakdown).map(([k, v]) => (
                                <div key={k}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>{k}</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>{v}%</span>
                                    </div>
                                    <MiniBar value={v} color={v >= 70 ? '#10b981' : v >= 50 ? '#f59e0b' : '#ef4444'} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : <EmptySlate text="No placement data available" />}
            </SCard>

            {/* ── Attendance Card ── */}
            <SCard title="Attendance Overview" icon={Activity} accent="#10b981">
                {attendance ? (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.8rem' }}>
                            <StatPill
                                label="Attendance"
                                value={`${(attendance.attendance_rate * 100).toFixed(1)}%`}
                                color={attendance.attendance_rate >= 0.75 ? '#10b981' : '#ef4444'}
                            />
                            <StatPill label="Absences" value={attendance.absences} color="#f59e0b" />
                            <StatPill label="Study hrs/day" value={`${attendance.study_hours?.toFixed(1)}h`} color="#6366f1" />
                            <StatPill label="Participation" value={`${(attendance.participation * 100).toFixed(0)}%`} color="#3b82f6" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 0.9rem', background: attendance.attendance_rate >= 0.75 ? '#ecfdf5' : '#fef2f2', borderRadius: 10, border: `1px solid ${attendance.attendance_rate >= 0.75 ? '#a7f3d0' : '#fca5a5'}` }}>
                            {attendance.attendance_rate >= 0.75
                                ? <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                                : <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />}
                            <span style={{ fontSize: '0.77rem', fontWeight: 600, color: attendance.attendance_rate >= 0.75 ? '#065f46' : '#b91c1c' }}>
                                {attendance.attendance_rate >= 0.75 ? 'Attendance above minimum threshold' : 'Below 75% — action required'}
                            </span>
                        </div>
                    </>
                ) : <EmptySlate text="No attendance data available" />}
            </SCard>

            {/* ── Marks Card ── */}
            <SCard title="Academic Scores" icon={TrendingUp} accent="#3b82f6">
                {marks ? (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '0.8rem' }}>
                            {[['Mathematics', marks.math_score], ['Science', marks.science_score], ['English', marks.english_score]].map(([sub, sc]) => (
                                <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ width: 82, fontSize: '0.8rem', color: '#475569', flexShrink: 0 }}>{sub}</span>
                                    <MiniBar
                                        value={Math.min(sc, 100)}
                                        color={sc >= 70 ? 'linear-gradient(90deg,#10b981,#34d399)' : sc >= 50 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#ef4444,#f87171)'}
                                        height={7}
                                    />
                                    <span style={{ width: 38, textAlign: 'right', fontSize: '0.83rem', fontWeight: 700, color: '#334155' }}>{sc?.toFixed(1)}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div style={{ flex: 1, padding: '0.5rem 0.7rem', background: '#f8fafc', borderRadius: 9, border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Assignment Rate</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#334155', marginTop: 2 }}>{(marks.assignment_rate * 100).toFixed(0)}%</div>
                            </div>
                            <div style={{ flex: 1, padding: '0.5rem 0.7rem', background: '#f8fafc', borderRadius: 9, border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Quiz Average</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#334155', marginTop: 2 }}>{marks.quiz_avg?.toFixed(1)}</div>
                            </div>
                        </div>
                        {marks.weak_subject && marks.weak_subject !== 'none' && (
                            <div style={{ marginTop: '0.75rem', padding: '0.45rem 0.75rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: '0.77rem', color: '#92400e' }}>
                                ⚠️ Focus Area: <strong>{marks.weak_subject}</strong>
                            </div>
                        )}
                    </>
                ) : <EmptySlate text="No marks data available" />}
            </SCard>
        </div>
    );
}

/* ════════════════════════════════════════
   STUDY PLANNER TAB
════════════════════════════════════════ */
function StudyPlanner({ studyPlan }) {
    if (!studyPlan) return <EmptySlate text="No study plan data available. Make sure the Client API is running." />;
    return (
        <>
            {/* Summary strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.9rem', marginBottom: '1.4rem' }}>
                {[
                    { icon: '📚', val: `${studyPlan.total_current_hours}h`, label: 'Current weekly hours' },
                    { icon: '🎯', val: `${studyPlan.total_recommended_hours}h`, label: 'Recommended hours' },
                    { icon: '🔍', val: studyPlan.focus_area, label: 'Focus area' },
                ].map(({ icon, val, label }) => (
                    <div key={label} style={{
                        background: '#fff', border: '1px solid #e8edf4',
                        borderRadius: 14, padding: '1rem 1.1rem',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        boxShadow: '0 1px 6px rgba(15,23,42,0.04)',
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                        <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#4f46e5', textTransform: 'capitalize' }}>{val}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Plan cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.9rem' }}>
                {studyPlan.weekly_plan?.map((item, i) => (
                    <div key={i} style={{
                        background: '#fff', border: '1px solid #e8edf4',
                        borderRadius: 14, overflow: 'hidden',
                        boxShadow: '0 1px 6px rgba(15,23,42,0.04)',
                        borderTop: `3px solid ${prioColor[item.priority] || '#6366f1'}`,
                        transition: 'box-shadow 0.25s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.09)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(15,23,42,0.04)'}
                    >
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '0.8rem 1rem', borderBottom: '1px solid #f8fafc',
                            background: `${prioBg[item.priority] || '#f8fafc'}`,
                        }}>
                            <h4 style={{ margin: 0, color: '#334155', fontSize: '0.88rem', fontWeight: 700 }}>{item.subject}</h4>
                            <span style={{
                                padding: '0.15rem 0.6rem', borderRadius: 30,
                                fontSize: '0.62rem', fontWeight: 800,
                                textTransform: 'uppercase', letterSpacing: '0.4px',
                                color: '#fff', background: prioColor[item.priority] || '#6366f1',
                            }}>{item.priority}</span>
                        </div>
                        <div style={{ padding: '0.9rem 1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                                {[
                                    { label: 'Score', val: item.current_score, hi: false },
                                    { label: 'Current', val: `${item.current_hours}h`, hi: false },
                                    { label: 'Target', val: `${item.recommended_hours}h`, hi: true },
                                ].map(({ label, val, hi }) => (
                                    <div key={label} style={{
                                        flex: 1, textAlign: 'center', padding: '0.45rem 0.3rem',
                                        background: hi ? '#eff6ff' : '#f8fafc',
                                        border: hi ? '1px solid #dbeafe' : '1px solid #f1f5f9',
                                        borderRadius: 8,
                                    }}>
                                        <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.4px', color: '#94a3b8' }}>{label}</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: hi ? '#4f46e5' : '#334155', marginTop: 2 }}>{val}</div>
                                    </div>
                                ))}
                            </div>
                            {item.tips && (
                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {item.tips.map((t, ti) => (
                                        <div key={ti} style={{ display: 'flex', gap: '0.45rem', fontSize: '0.77rem', color: '#475569', lineHeight: 1.45 }}>
                                            <span>💡</span><span>{t}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

/* ════════════════════════════════════════
   SKILLS TAB
════════════════════════════════════════ */
function Skills({ placementData }) {
    if (!placementData?.skills) return <EmptySlate text="No skills data available." />;
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(placementData.skills).map(([sk, d]) => (
                <div key={sk} style={{
                    background: '#fff', border: '1px solid #e8edf4',
                    borderRadius: 14, padding: '1.2rem',
                    boxShadow: '0 1px 6px rgba(15,23,42,0.04)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    transition: 'all 0.25s',
                    cursor: 'default',
                }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(15,23,42,0.10)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(15,23,42,0.04)'; }}
                >
                    <RingChart value={d.score} size={90} stroke={8} color={gradeColor(d.grade)} label={`${d.score}%`} />
                    <div style={{ marginTop: '0.9rem', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>{sk.charAt(0).toUpperCase() + sk.slice(1)}</span>
                            <span style={{ fontSize: '1rem', fontWeight: 900, color: gradeColor(d.grade) }}>{d.grade}</span>
                        </div>
                        <div style={{ height: 5, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${d.score}%`, background: gradeColor(d.grade), borderRadius: 5, transition: 'width 0.9s' }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ════════════════════════════════════════
   RECOMMENDATIONS TAB
════════════════════════════════════════ */
function Recs({ riskData }) {
    if (!riskData?.recommendations) return <EmptySlate text="No recommendations available." />;
    const pBg = { high: '#fef2f2', medium: '#fffbeb', low: '#ecfdf5' };
    const pBorder = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {riskData.recommendations.map((r, i) => (
                <div key={i} style={{
                    background: '#fff',
                    border: '1px solid #e8edf4',
                    borderLeft: `4px solid ${pBorder[r.priority] || '#6366f1'}`,
                    borderRadius: 14,
                    padding: '1rem 1.2rem',
                    boxShadow: '0 1px 6px rgba(15,23,42,0.04)',
                    transition: 'box-shadow 0.25s',
                }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(15,23,42,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(15,23,42,0.04)'}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#334155' }}>{r.area}</span>
                        <span style={{
                            padding: '0.18rem 0.65rem', borderRadius: 30,
                            fontSize: '0.64rem', fontWeight: 800,
                            textTransform: 'uppercase', letterSpacing: '0.4px',
                            color: '#fff', background: pBorder[r.priority] || '#6366f1',
                        }}>{r.priority}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.6 }}>{r.suggestion}</p>
                </div>
            ))}
        </div>
    );
}

/* ── Empty state ── */
function EmptySlate({ text }) {
    return (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8', fontSize: '0.86rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
            {text}
        </div>
    );
}

/* ════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
════════════════════════════════════════ */
function StudentDashboard({ student, onLogout }) {
    const [tab, setTab] = useState('overview');
    const [riskData, setRisk] = useState(null);
    const [placementData, setPlace] = useState(null);
    const [studyPlan, setPlan] = useState(null);
    const [attendance, setAttend] = useState(null);
    const [marks, setMarks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const numId = parseInt(student.student_id) || 1;
    const clientId = student.client_id || 1;

    const load = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const [r, p, pl, a, m] = await Promise.allSettled([
                predictRisk(clientId, numId),
                getPlacementReadiness(clientId, numId),
                getStudyPlan(clientId, numId),
                getAttendance(clientId, numId),
                getMarks(clientId, numId),
            ]);
            if (r.status === 'fulfilled') setRisk(r.value);
            if (p.status === 'fulfilled') setPlace(p.value);
            if (pl.status === 'fulfilled') setPlan(pl.value);
            if (a.status === 'fulfilled') setAttend(a.value.data);
            if (m.status === 'fulfilled') setMarks(m.value.data);
            const any = [r, p, pl, a, m].some(x => x.status === 'fulfilled');
            if (!any) setError(`No data for Student ID ${numId} on Client ${clientId}.`);
        } catch {
            setError('Could not connect. Make sure the campus API is running on port 5002.');
        } finally {
            setLoading(false);
        }
    }, [clientId, numId]);

    useEffect(() => { load(); }, [load]);

    const navItems = [
        { key: 'overview', label: 'Overview', icon: LayoutDashboard },
        { key: 'study-planner', label: 'Study Planner', icon: BookOpen },
        { key: 'skills', label: 'Skills', icon: Zap },
        { key: 'recommendations', label: 'Recommendations', icon: MessageSquare },
    ];

    const tabTitle = {
        overview: 'Dashboard Overview',
        'study-planner': 'Study Planner',
        skills: 'Skills Analysis',
        recommendations: 'Recommendations',
    };

    const initials = student.name?.charAt(0).toUpperCase() || 'S';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fa', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>

            {/* ══ SIDEBAR ══ */}
            <aside style={{
                width: 238, flexShrink: 0,
                background: '#fff',
                borderRight: '1px solid #e8edf4',
                display: 'flex', flexDirection: 'column',
                padding: '1.3rem 1rem',
                position: 'fixed', top: 0, left: 0, height: '100vh',
                overflowY: 'auto', zIndex: 50,
                boxShadow: '1px 0 0 #edf0f5',
            }}>
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: '1.6rem', paddingBottom: '1.1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{
                        width: 34, height: 34,
                        background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
                        flexShrink: 0,
                    }}>
                        <Shield size={17} color="#fff" strokeWidth={2.5} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.93rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.2px' }}>EduShield AI</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 1 }}>Student Portal</div>
                    </div>
                </div>

                {/* User card */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.65rem',
                    padding: '0.85rem 0.95rem',
                    background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)',
                    border: '1px solid #e0e7ff',
                    borderRadius: 13, marginBottom: '1.4rem',
                }}>
                    <div style={{
                        width: 40, height: 40,
                        background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
                        borderRadius: 11,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.95rem', fontWeight: 900, color: '#fff', flexShrink: 0,
                    }}>{initials}</div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#6366f1', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.department}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 1 }}>ID: {student.student_id}</div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.64rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#cbd5e1', padding: '0 0.5rem', marginBottom: '0.4rem' }}>Navigation</div>
                    {navItems.map(({ key, label, icon: Icon }) => {
                        const active = tab === key;
                        return (
                            <button key={key}
                                onClick={() => setTab(key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.65rem',
                                    width: '100%', textAlign: 'left',
                                    padding: '0.6rem 0.8rem', borderRadius: 10,
                                    cursor: 'pointer', transition: 'all 0.18s ease',
                                    marginBottom: 2,
                                    color: active ? '#4f46e5' : '#64748b',
                                    fontWeight: active ? 700 : 500,
                                    fontSize: '0.85rem',
                                    background: active ? 'linear-gradient(135deg,#eff6ff,#f5f3ff)' : 'transparent',
                                    border: active ? '1px solid #e0e7ff' : '1px solid transparent',
                                    fontFamily: 'inherit',
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                                {label}
                                {active && <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#a5b4fc' }} />}
                            </button>
                        );
                    })}
                </nav>

                {/* Privacy indicator */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '0.5rem 0.75rem',
                    background: '#ecfdf5', borderRadius: 9,
                    marginTop: '0.5rem', marginBottom: '0.85rem',
                }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.71rem', fontWeight: 600, color: '#065f46' }}>Data processed locally</span>
                </div>

                {/* Logout */}
                <button onClick={onLogout} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    width: '100%', padding: '0.65rem',
                    background: 'none', border: '1.5px solid #e2e8f0',
                    borderRadius: 10, color: '#64748b',
                    fontSize: '0.84rem', fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'inherit',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#b91c1c'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                >
                    <LogOut size={14} /> Sign Out
                </button>
            </aside>

            {/* ══ MAIN CONTENT ══ */}
            <main style={{ flex: 1, marginLeft: 238, padding: '1.75rem 2rem', minHeight: '100vh', overflowY: 'auto' }}>

                {/* Page header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
                    <div>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4, fontWeight: 500 }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <h1 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
                            {tab === 'overview' ? `${greeting}, ${student.name?.split(' ')[0]}` : tabTitle[tab]}
                        </h1>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>
                            Privacy-preserving analytics · Client {clientId}
                        </p>
                    </div>
                    <button onClick={load} title="Refresh data"
                        style={{
                            width: 38, height: 38,
                            background: '#fff', border: '1.5px solid #e2e8f0',
                            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#64748b',
                            transition: 'all 0.2s', flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.background = '#eff6ff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = '#fff'; }}
                    >
                        <RefreshCw size={15} />
                    </button>
                </div>

                {/* ── Quick stat strip (overview only) ── */}
                {tab === 'overview' && !loading && !error && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.9rem', marginBottom: '1.4rem' }}>
                        {[
                            {
                                label: 'Risk Level',
                                value: riskData ? riskData.risk_level.charAt(0).toUpperCase() + riskData.risk_level.slice(1) : '—',
                                color: riskData ? riskColor[riskData.risk_level] : '#94a3b8',
                                icon: AlertTriangle,
                            },
                            {
                                label: 'Readiness',
                                value: placementData ? `${placementData.readiness_score}%` : '—',
                                color: '#6366f1',
                                icon: Target,
                            },
                            {
                                label: 'Attendance',
                                value: attendance ? `${(attendance.attendance_rate * 100).toFixed(1)}%` : '—',
                                color: attendance && attendance.attendance_rate >= 0.75 ? '#10b981' : '#ef4444',
                                icon: Activity,
                            },
                            {
                                label: 'Study hrs/day',
                                value: attendance ? `${attendance.study_hours?.toFixed(1)}h` : '—',
                                color: '#3b82f6',
                                icon: Clock,
                            },
                        ].map(({ label, value, color, icon: Icon }) => (
                            <div key={label} style={{
                                background: '#fff', border: '1px solid #e8edf4',
                                borderRadius: 14, padding: '1rem 1.2rem',
                                boxShadow: '0 1px 6px rgba(15,23,42,0.04)',
                                display: 'flex', alignItems: 'center', gap: '0.9rem',
                                transition: 'box-shadow 0.25s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(15,23,42,0.09)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(15,23,42,0.04)'}
                            >
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10,
                                    background: `${color}14`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Icon size={17} style={{ color }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: color, lineHeight: 1 }}>{value}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Tab body ── */}
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem', gap: '1rem' }}>
                        <div style={{
                            width: 36, height: 36,
                            border: '3px solid #e2e8f0',
                            borderTopColor: '#6366f1',
                            borderRadius: '50%',
                            animation: 'spin 0.75s linear infinite',
                        }} />
                        <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: 0 }}>Loading your data from local campus node…</p>
                    </div>
                ) : error ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', gap: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem' }}>⚠️</div>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: 380, margin: 0 }}>{error}</p>
                        <button onClick={load} style={{
                            padding: '0.6rem 1.6rem', background: '#6366f1', color: '#fff',
                            border: 'none', borderRadius: 10,
                            fontSize: '0.87rem', fontWeight: 700, cursor: 'pointer',
                            fontFamily: 'inherit', transition: 'background 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                            onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
                        >Retry</button>
                    </div>
                ) : (
                    <>
                        {tab === 'overview' && <Overview riskData={riskData} placementData={placementData} attendance={attendance} marks={marks} />}
                        {tab === 'study-planner' && <StudyPlanner studyPlan={studyPlan} />}
                        {tab === 'skills' && <Skills placementData={placementData} />}
                        {tab === 'recommendations' && <Recs riskData={riskData} />}
                    </>
                )}
            </main>
        </div>
    );
}

export default StudentDashboard;
