import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, BookOpen, Users, DollarSign, Calendar } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

// Pure SVG mini bar chart
const MiniBarChart: React.FC<{ data: number[]; labels: string[]; color: string; height?: number }> = ({ data, labels, color, height = 140 }) => {
    const max = Math.max(...data, 1);
    const barW = 100 / data.length;
    return (
        <svg width="100%" height={height} viewBox={`0 0 ${data.length * 50} ${height}`} style={{ overflow: 'visible' }}>
            {data.map((v, i) => {
                const barH = (v / max) * (height - 24);
                return (
                    <g key={i}>
                        <rect x={i * 50 + 10} y={height - 18 - barH} width={30} height={barH}
                            rx={4} fill={color} opacity={0.8}>
                            <animate attributeName="height" from="0" to={barH} dur="0.6s" fill="freeze" />
                            <animate attributeName="y" from={height - 18} to={height - 18 - barH} dur="0.6s" fill="freeze" />
                        </rect>
                        <text x={i * 50 + 25} y={height - 4} textAnchor="middle" fontSize="8" fill="var(--text-tertiary)">{labels[i]}</text>
                        <text x={i * 50 + 25} y={height - 22 - barH} textAnchor="middle" fontSize="9" fill="var(--text-secondary)" fontWeight="600">{v}</text>
                    </g>
                );
            })}
        </svg>
    );
};

// Pure SVG donut chart
const DonutChart: React.FC<{ segments: { label: string; value: number; color: string }[]; size?: number }> = ({ segments, size = 160 }) => {
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    const r = (size - 20) / 2;
    const cx = size / 2;
    const cy = size / 2;
    let cumAngle = -90;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <svg width={size} height={size}>
                {segments.map((seg, i) => {
                    const angle = (seg.value / total) * 360;
                    const startAngle = cumAngle;
                    cumAngle += angle;
                    const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
                    const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
                    const x2 = cx + r * Math.cos(((startAngle + angle) * Math.PI) / 180);
                    const y2 = cy + r * Math.sin(((startAngle + angle) * Math.PI) / 180);
                    const largeArc = angle > 180 ? 1 : 0;
                    return (
                        <path key={i}
                            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={seg.color} opacity={0.85} stroke="var(--bg-primary)" strokeWidth={2}>
                        </path>
                    );
                })}
                <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--bg-secondary)" />
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="800" fill="var(--text-primary)">{total}</text>
                <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="var(--text-tertiary)">TOTAL</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {segments.map(seg => (
                    <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-xs)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{seg.label}</span>
                        <span style={{ fontWeight: 600, marginLeft: 'auto', color: 'var(--text-primary)' }}>{seg.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// SVG line chart
const LineChart: React.FC<{ data: number[]; labels: string[]; color: string; height?: number }> = ({ data, labels, color, height = 140 }) => {
    const max = Math.max(...data, 1);
    const w = data.length > 1 ? 300 / (data.length - 1) : 300;
    const points = data.map((v, i) => `${i * w + 20},${height - 20 - (v / max) * (height - 40)}`).join(' ');
    const areaPoints = `20,${height - 20} ${points} ${(data.length - 1) * w + 20},${height - 20}`;
    return (
        <svg width="100%" height={height} viewBox={`0 0 ${(data.length - 1) * w + 40} ${height}`} style={{ overflow: 'visible' }}>
            <polygon points={areaPoints} fill={`url(#lineGrad)`} opacity="0.15" />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs><linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} /><stop offset="1" stopColor="transparent" /></linearGradient></defs>
            {data.map((v, i) => (
                <g key={i}>
                    <circle cx={i * w + 20} cy={height - 20 - (v / max) * (height - 40)} r="3.5" fill={color} stroke="var(--bg-secondary)" strokeWidth="2" />
                    <text x={i * w + 20} y={height - 4} textAnchor="middle" fontSize="8" fill="var(--text-tertiary)">{labels[i]}</text>
                </g>
            ))}
        </svg>
    );
};

const AnalyticsPage: React.FC = () => {
    const { transactions, books, members, fines } = useLibrary();

    // Category distribution
    const catDist = useMemo(() => {
        const map: Record<string, number> = {};
        books.forEach(b => { map[b.category] = (map[b.category] || 0) + 1; });
        const colors = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#8b5cf6'];
        return Object.entries(map).map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }));
    }, [books]);

    // Monthly borrowing (mock last 6 months)
    const monthlyBorrowing = [12, 18, 15, 22, 19, 24];
    const monthLabels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

    // Top 5 borrowed books
    const topBooks = useMemo(() => {
        const map: Record<string, number> = {};
        transactions.forEach(t => { map[t.bookId] = (map[t.bookId] || 0) + 1; });
        return Object.entries(map)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([id, count]) => ({ title: books.find(b => b.id === id)?.title || id, count }));
    }, [transactions, books]);

    // Stats overview
    const totalBorrows = transactions.length;
    const totalActive = transactions.filter(t => t.status === 'active').length;
    const totalOverdue = transactions.filter(t => t.status === 'overdue').length;
    const totalFinesCollected = fines.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);

    // Busiest days (mock heatmap data)
    const heatmapData = [
        [2, 5, 3, 7, 4, 1, 0],
        [3, 6, 2, 8, 5, 2, 1],
        [1, 4, 6, 5, 3, 0, 0],
        [4, 7, 3, 9, 6, 3, 1],
    ];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
            <div className="page-header">
                <motion.h1 variants={item}>Analytics</motion.h1>
                <motion.p variants={item}>Deep insights into library performance.</motion.p>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
                {[
                    { label: 'Total Borrows', value: totalBorrows, icon: <BookOpen size={18} />, color: 'var(--info)' },
                    { label: 'Currently Active', value: totalActive, icon: <TrendingUp size={18} />, color: 'var(--success)' },
                    { label: 'Overdue', value: totalOverdue, icon: <Calendar size={18} />, color: 'var(--danger)' },
                    { label: 'Fines Collected', value: `$${totalFinesCollected.toFixed(2)}`, icon: <DollarSign size={18} />, color: 'var(--warning)' },
                ].map(s => (
                    <motion.div key={s.label} className="glass-card" style={{ padding: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }} variants={item}>
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
                        <div><div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700 }}>{s.value}</div><div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{s.label}</div></div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)' }}>
                {/* Borrowing Trend */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-5)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <TrendingUp size={15} style={{ color: 'var(--accent-tertiary)' }} /> Borrowing Trend
                    </h3>
                    <LineChart data={monthlyBorrowing} labels={monthLabels} color="var(--accent-primary)" />
                </motion.div>

                {/* Category Distribution */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-5)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <BarChart3 size={15} style={{ color: 'var(--accent-tertiary)' }} /> Category Distribution
                    </h3>
                    <DonutChart segments={catDist} />
                </motion.div>

                {/* Top Borrowed */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-5)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>Top 5 Borrowed Books</h3>
                    <MiniBarChart data={topBooks.map(b => b.count)} labels={topBooks.map(b => b.title.substring(0, 8) + '...')} color="var(--accent-primary)" />
                </motion.div>

                {/* Activity Heatmap */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-5)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>Activity Heatmap</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {heatmapData.map((week, wi) => (
                            <div key={wi} style={{ display: 'flex', gap: 4 }}>
                                {week.map((val, di) => (
                                    <div key={di} title={`${dayLabels[di]}: ${val} borrows`}
                                        style={{
                                            flex: 1, height: 28, borderRadius: 4,
                                            background: val === 0 ? 'var(--bg-glass)' : `rgba(124, 58, 237, ${Math.min(val / 10 + 0.1, 0.9)})`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.6rem', color: val > 4 ? 'white' : 'var(--text-tertiary)', fontWeight: 600,
                                        }}>
                                        {val > 0 && val}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: 4 }}>
                            {dayLabels.map(d => (
                                <div key={d} style={{ flex: 1, textAlign: 'center', fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>{d}</div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AnalyticsPage;
