import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen, Users, BookMarked, AlertTriangle,
    ArrowUpRight, ArrowDownRight, RotateCcw, PlusCircle,
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import AnimatedCounter from '../components/ui/AnimatedCounter';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const DashboardPage: React.FC = () => {
    const { books, members, transactions, fines } = useLibrary();
    const { user } = useAuth();

    const totalBooks = books.reduce((s, b) => s + b.totalCopies, 0);
    const issuedBooks = transactions.filter(t => t.status === 'active' || t.status === 'overdue').length;
    const overdueBooks = transactions.filter(t => t.status === 'overdue').length;
    const activeMembers = members.filter(m => m.status === 'active').length;
    const pendingFines = fines.filter(f => f.status === 'pending').reduce((s, f) => s + f.amount, 0);

    const stats = [
        { label: 'Total Books', value: totalBooks, icon: BookOpen, color: 'purple', change: '+12', up: true },
        { label: 'Currently Issued', value: issuedBooks, icon: BookMarked, color: 'blue', change: '+3', up: true },
        { label: 'Active Members', value: activeMembers, icon: Users, color: 'green', change: '+5', up: true },
        { label: 'Overdue Books', value: overdueBooks, icon: AlertTriangle, color: 'orange', change: '-1', up: false },
    ];

    // Mock chart data
    const chartData = [
        { name: 'Jan', issued: 45, returned: 38 },
        { name: 'Feb', issued: 52, returned: 42 },
        { name: 'Mar', issued: 61, returned: 55 },
        { name: 'Apr', issued: 48, returned: 50 },
        { name: 'May', issued: 55, returned: 49 },
        { name: 'Jun', issued: 67, returned: 58 },
        { name: 'Jul', issued: 72, returned: 65 },
    ];

    const categoryData = [
        { name: 'Technology', value: 7, color: '#7c3aed' },
        { name: 'Fiction', value: 5, color: '#6366f1' },
        { name: 'Science', value: 3, color: '#3b82f6' },
        { name: 'History', value: 2, color: '#22c55e' },
        { name: 'Philosophy', value: 3, color: '#f59e0b' },
        { name: 'Other', value: 4, color: '#ef4444' },
    ];

    const recentActivity = transactions.slice(0, 6);

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <div className="page-header">
                <motion.h1 variants={item}>Welcome back, {user?.name?.split(' ')[0]} 👋</motion.h1>
                <motion.p variants={item}>Here's what's happening in your library today.</motion.p>
            </div>

            {/* Stats */}
            <motion.div className="stats-grid" variants={item}>
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        className="glass-card stat-card"
                        variants={item}
                        whileHover={{ y: -4 }}
                    >
                        <div className={`stat-icon ${s.color}`}>
                            <s.icon size={22} />
                        </div>
                        <div className="stat-value"><AnimatedCounter target={s.value} /></div>
                        <div className="stat-label">{s.label}</div>
                        <div className={`stat-change ${s.up ? 'up' : 'down'}`}>
                            {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {s.change} this month
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Row */}
            <motion.div className="grid-2" style={{ marginTop: 'var(--sp-6)' }} variants={item}>
                <div className="glass-card chart-container">
                    <h3>Circulation Trends</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="issuedGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="returnedGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(15,18,40,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 10, fontSize: 12, color: '#f1f5f9',
                                }}
                            />
                            <Area type="monotone" dataKey="issued" stroke="#7c3aed" strokeWidth={2} fill="url(#issuedGrad)" />
                            <Area type="monotone" dataKey="returned" stroke="#22c55e" strokeWidth={2} fill="url(#returnedGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-card chart-container">
                    <h3>Books by Category</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%" cy="50%"
                                outerRadius={90}
                                innerRadius={55}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {categoryData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(15,18,40,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 10, fontSize: 12, color: '#f1f5f9',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'center' }}>
                        {categoryData.map(c => (
                            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                                {c.name}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Recent + Quick Actions */}
            <motion.div className="grid-2" style={{ marginTop: 'var(--sp-6)' }} variants={item}>
                <div className="glass-card" style={{ padding: 'var(--sp-5)' }}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
                        Recent Activity
                    </h3>
                    <div className="activity-list">
                        {recentActivity.map(t => {
                            const book = books.find(b => b.id === t.bookId);
                            const member = members.find(m => m.id === t.memberId);
                            return (
                                <div className="activity-item" key={t.id}>
                                    <div className="activity-icon" style={{
                                        background: t.status === 'overdue' ? 'rgba(239,68,68,0.15)'
                                            : t.status === 'returned' ? 'rgba(34,197,94,0.15)'
                                                : 'rgba(59,130,246,0.15)',
                                    }}>
                                        {t.status === 'returned' ? <RotateCcw size={14} style={{ color: 'var(--success)' }} />
                                            : t.status === 'overdue' ? <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />
                                                : <BookMarked size={14} style={{ color: 'var(--info)' }} />}
                                    </div>
                                    <div className="activity-text">
                                        <strong>{member?.name}</strong> {t.status === 'returned' ? 'returned' : 'borrowed'}{' '}
                                        <strong>{book?.title}</strong>
                                    </div>
                                    <div className="activity-time">{t.issueDate}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="glass-card" style={{ padding: 'var(--sp-5)' }}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
                        Quick Actions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                        {[
                            { icon: PlusCircle, label: 'Add New Book', link: '/books/add', color: 'var(--accent-tertiary)' },
                            { icon: BookMarked, label: 'Issue a Book', link: '/issue', color: 'var(--info)' },
                            { icon: RotateCcw, label: 'Process Return', link: '/return', color: 'var(--success)' },
                            { icon: Users, label: 'Register Member', link: '/members/add', color: 'var(--warning)' },
                        ].map(a => (
                            <a
                                key={a.label}
                                href={a.link}
                                className="glass-panel"
                                style={{
                                    padding: 'var(--sp-3) var(--sp-4)', display: 'flex', alignItems: 'center',
                                    gap: 'var(--sp-3)', textDecoration: 'none', color: 'var(--text-primary)',
                                    fontSize: 'var(--fs-sm)',
                                }}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-glass)', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', color: a.color,
                                }}>
                                    <a.icon size={16} />
                                </div>
                                {a.label}
                            </a>
                        ))}
                    </div>

                    {pendingFines > 0 && (
                        <div className="glass-panel" style={{
                            padding: 'var(--sp-4)', marginTop: 'var(--sp-4)',
                            borderColor: 'rgba(239,68,68,0.2)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-1)' }}>
                                <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />
                                <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--danger)' }}>
                                    Pending Fines
                                </span>
                            </div>
                            <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
                                ${pendingFines.toFixed(2)}
                            </div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
                                {fines.filter(f => f.status === 'pending').length} outstanding fines
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DashboardPage;
