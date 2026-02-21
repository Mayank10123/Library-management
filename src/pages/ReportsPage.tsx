import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, BookOpen, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    Cell, LineChart, Line,
} from 'recharts';
import { useLibrary } from '../context/LibraryContext';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

type ReportType = 'issued' | 'overdue' | 'members' | 'popular';

const ReportsPage: React.FC = () => {
    const { books, members, transactions } = useLibrary();
    const [reportType, setReportType] = useState<ReportType>('issued');

    const reportTypes = [
        { id: 'issued' as const, label: 'Issued Books', icon: BookOpen, color: 'var(--info)' },
        { id: 'overdue' as const, label: 'Overdue Books', icon: AlertTriangle, color: 'var(--danger)' },
        { id: 'members' as const, label: 'Active Members', icon: Users, color: 'var(--success)' },
        { id: 'popular' as const, label: 'Popular Books', icon: TrendingUp, color: 'var(--accent-tertiary)' },
    ];

    const issuedData = useMemo(() => transactions.filter(t => t.status === 'active' || t.status === 'overdue'), [transactions]);
    const overdueData = useMemo(() => transactions.filter(t => t.status === 'overdue'), [transactions]);
    const activeMembers = useMemo(() => members.filter(m => m.status === 'active'), [members]);

    const categoryStats = useMemo(() => {
        const map: Record<string, number> = {};
        transactions.forEach(t => {
            const book = books.find(b => b.id === t.bookId);
            if (book) map[book.category] = (map[book.category] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    }, [transactions, books]);

    const monthlyData = [
        { month: 'Sep', issues: 42, returns: 38 },
        { month: 'Oct', issues: 55, returns: 48 },
        { month: 'Nov', issues: 63, returns: 52 },
        { month: 'Dec', issues: 48, returns: 55 },
        { month: 'Jan', issues: 58, returns: 50 },
        { month: 'Feb', issues: 67, returns: 45 },
    ];

    const colors = ['#7c3aed', '#6366f1', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

    const exportCSV = () => {
        let csv = '';
        if (reportType === 'issued') {
            csv = 'Book,Member,Issue Date,Due Date,Status\n';
            issuedData.forEach(t => {
                const book = books.find(b => b.id === t.bookId);
                const member = members.find(m => m.id === t.memberId);
                csv += `"${book?.title}","${member?.name}",${t.issueDate},${t.dueDate},${t.status}\n`;
            });
        } else if (reportType === 'overdue') {
            csv = 'Book,Member,Due Date,Fine\n';
            overdueData.forEach(t => {
                const book = books.find(b => b.id === t.bookId);
                const member = members.find(m => m.id === t.memberId);
                csv += `"${book?.title}","${member?.name}",${t.dueDate},$${t.fine.toFixed(2)}\n`;
            });
        } else if (reportType === 'members') {
            csv = 'Name,Department,Type,Books Issued,Fines\n';
            activeMembers.forEach(m => {
                csv += `"${m.name}","${m.department}",${m.membershipType},${m.booksIssued},$${m.totalFines.toFixed(2)}\n`;
            });
        }
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${reportType}-report.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <motion.h1 variants={item}>Reports</motion.h1>
                    <motion.p variants={item}>Generate and export library reports.</motion.p>
                </div>
                <motion.button className="btn btn-primary" onClick={exportCSV} variants={item}>
                    <Download size={16} /> Export CSV
                </motion.button>
            </div>

            <motion.div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)', flexWrap: 'wrap' }} variants={item}>
                {reportTypes.map(rt => (
                    <button
                        key={rt.id}
                        className={`btn ${reportType === rt.id ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setReportType(rt.id)}
                    >
                        <rt.icon size={16} /> {rt.label}
                    </button>
                ))}
            </motion.div>

            {/* Charts */}
            <motion.div className="grid-2" style={{ marginBottom: 'var(--sp-6)' }} variants={item}>
                <div className="glass-card chart-container">
                    <h3>Monthly Circulation</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlyData}>
                            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                            <Tooltip contentStyle={{ background: 'rgba(15,18,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12, color: '#f1f5f9' }} />
                            <Line type="monotone" dataKey="issues" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4, fill: '#7c3aed' }} />
                            <Line type="monotone" dataKey="returns" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: '#22c55e' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="glass-card chart-container">
                    <h3>Category Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={categoryStats}>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} angle={-20} textAnchor="end" height={50} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                            <Tooltip contentStyle={{ background: 'rgba(15,18,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12, color: '#f1f5f9' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {categoryStats.map((_e, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Data Table */}
            <motion.div className="glass-card" style={{ padding: 'var(--sp-5)' }} variants={item}>
                <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
                    {reportTypes.find(r => r.id === reportType)?.label} Report
                </h3>
                <div className="data-table-container" style={{ borderRadius: 'var(--radius-md)' }}>
                    <table className="data-table">
                        {reportType === 'issued' && (
                            <>
                                <thead><tr><th>Book</th><th>Member</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr></thead>
                                <tbody>
                                    {issuedData.map(t => {
                                        const book = books.find(b => b.id === t.bookId);
                                        const member = members.find(m => m.id === t.memberId);
                                        return (
                                            <tr key={t.id}>
                                                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{book?.title}</td>
                                                <td>{member?.name}</td>
                                                <td>{t.issueDate}</td>
                                                <td>{t.dueDate}</td>
                                                <td><span className={`badge ${t.status === 'overdue' ? 'badge-danger' : 'badge-info'}`}>{t.status}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </>
                        )}
                        {reportType === 'overdue' && (
                            <>
                                <thead><tr><th>Book</th><th>Member</th><th>Due Date</th><th>Days Overdue</th><th>Fine</th></tr></thead>
                                <tbody>
                                    {overdueData.map(t => {
                                        const book = books.find(b => b.id === t.bookId);
                                        const member = members.find(m => m.id === t.memberId);
                                        const days = Math.floor((Date.now() - new Date(t.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                                        return (
                                            <tr key={t.id}>
                                                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{book?.title}</td>
                                                <td>{member?.name}</td>
                                                <td>{t.dueDate}</td>
                                                <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{days} days</td>
                                                <td style={{ color: 'var(--danger)', fontWeight: 600 }}>${(days * 1).toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                    {overdueData.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 'var(--sp-6)', color: 'var(--text-tertiary)' }}>No overdue books!</td></tr>}
                                </tbody>
                            </>
                        )}
                        {reportType === 'members' && (
                            <>
                                <thead><tr><th>Name</th><th>Department</th><th>Type</th><th>Books</th><th>Fines</th></tr></thead>
                                <tbody>
                                    {activeMembers.map(m => (
                                        <tr key={m.id}>
                                            <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{m.name}</td>
                                            <td>{m.department}</td>
                                            <td><span className="badge badge-accent">{m.membershipType}</span></td>
                                            <td>{m.booksIssued}</td>
                                            <td style={m.totalFines > 0 ? { color: 'var(--danger)', fontWeight: 600 } : {}}>${m.totalFines.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        )}
                        {reportType === 'popular' && (
                            <>
                                <thead><tr><th>Book</th><th>Author</th><th>Category</th><th>Total Copies</th><th>Currently Issued</th></tr></thead>
                                <tbody>
                                    {books.sort((a, b) => (b.totalCopies - b.availableCopies) - (a.totalCopies - a.availableCopies)).slice(0, 10).map(b => (
                                        <tr key={b.id}>
                                            <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{b.title}</td>
                                            <td>{b.author}</td>
                                            <td><span className="badge badge-accent">{b.category}</span></td>
                                            <td>{b.totalCopies}</td>
                                            <td>{b.totalCopies - b.availableCopies}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        )}
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ReportsPage;
