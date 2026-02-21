import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Download, Clock, BookOpen, DollarSign, LogIn } from 'lucide-react';

interface AuditEntry {
    id: string;
    action: string;
    category: 'auth' | 'circulation' | 'catalog' | 'finance' | 'admin';
    user: string;
    detail: string;
    timestamp: string;
}

const AUDIT_DATA: AuditEntry[] = [
    { id: 'a1', action: 'Login', category: 'auth', user: 'admin@koha.edu', detail: 'Logged in from 192.168.1.45', timestamp: '2026-02-21 10:30:00' },
    { id: 'a2', action: 'Issue Book', category: 'circulation', user: 'admin@koha.edu', detail: 'Issued "Clean Code" to James W.', timestamp: '2026-02-21 10:25:00' },
    { id: 'a3', action: 'Return Book', category: 'circulation', user: 'lib@koha.edu', detail: 'Returned "1984" from Lisa C.', timestamp: '2026-02-21 09:45:00' },
    { id: 'a4', action: 'Add Book', category: 'catalog', user: 'admin@koha.edu', detail: 'Added "The Pragmatic Programmer" to catalog', timestamp: '2026-02-20 16:20:00' },
    { id: 'a5', action: 'Fine Paid', category: 'finance', user: 'lib@koha.edu', detail: 'Fine $3.50 paid by Raj P.', timestamp: '2026-02-20 15:10:00' },
    { id: 'a6', action: 'Login', category: 'auth', user: 'lib@koha.edu', detail: 'Logged in from 192.168.1.32', timestamp: '2026-02-20 09:00:00' },
    { id: 'a7', action: 'Edit Member', category: 'admin', user: 'admin@koha.edu', detail: 'Updated status for Kevin W. to active', timestamp: '2026-02-19 14:30:00' },
    { id: 'a8', action: 'Delete Book', category: 'catalog', user: 'admin@koha.edu', detail: 'Removed duplicate entry for "Algorithms"', timestamp: '2026-02-19 11:00:00' },
    { id: 'a9', action: 'Issue Book', category: 'circulation', user: 'lib@koha.edu', detail: 'Issued "Thinking, Fast and Slow" to Dr. Emily F.', timestamp: '2026-02-19 10:15:00' },
    { id: 'a10', action: 'Export Data', category: 'admin', user: 'admin@koha.edu', detail: 'Exported full library data as JSON', timestamp: '2026-02-18 17:00:00' },
    { id: 'a11', action: 'Fine Applied', category: 'finance', user: 'system', detail: 'Auto-applied $2.00 fine to Sarah P. for overdue', timestamp: '2026-02-18 08:00:00' },
    { id: 'a12', action: 'Login', category: 'auth', user: 'member@koha.edu', detail: 'Logged in from 10.0.0.15', timestamp: '2026-02-17 13:20:00' },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    auth: <LogIn size={14} />,
    circulation: <BookOpen size={14} />,
    catalog: <BookOpen size={14} />,
    finance: <DollarSign size={14} />,
    admin: <Shield size={14} />,
};

const CATEGORY_COLORS: Record<string, string> = {
    auth: 'var(--info)',
    circulation: 'var(--success)',
    catalog: 'var(--accent-tertiary)',
    finance: 'var(--warning)',
    admin: 'var(--danger)',
};

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const AuditLogPage: React.FC = () => {
    const [categoryFilter, setCategoryFilter] = useState('');
    const [search, setSearch] = useState('');

    const filtered = AUDIT_DATA.filter(e => {
        const q = search.toLowerCase();
        const matchesSearch = !q || e.action.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q) || e.user.toLowerCase().includes(q);
        const matchesCategory = !categoryFilter || e.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const exportCSV = () => {
        const header = 'Timestamp,Action,Category,User,Detail\n';
        const rows = filtered.map(e => `${e.timestamp},${e.action},${e.category},${e.user},"${e.detail}"`).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'audit-log.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}>
            <div className="page-header">
                <motion.h1 variants={item}>Audit Log</motion.h1>
                <motion.p variants={item}>Complete history of all system actions.</motion.p>
            </div>

            <motion.div className="filters-bar" variants={item} style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
                    <input className="filter-input" placeholder="Search actions..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
                    <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="auth">Authentication</option>
                        <option value="circulation">Circulation</option>
                        <option value="catalog">Catalog</option>
                        <option value="finance">Finance</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button className="btn btn-ghost" onClick={exportCSV} style={{ fontSize: 'var(--fs-sm)' }}>
                    <Download size={14} /> Export CSV
                </button>
            </motion.div>

            <motion.div variants={item}>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr><th>Time</th><th>Action</th><th>Category</th><th>User</th><th>Details</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(entry => (
                                <tr key={entry.id}>
                                    <td style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                                        <Clock size={10} style={{ marginRight: 4 }} />{entry.timestamp}
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{entry.action}</td>
                                    <td>
                                        <span className="badge" style={{ background: `${CATEGORY_COLORS[entry.category]}20`, color: CATEGORY_COLORS[entry.category], display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                            {CATEGORY_ICONS[entry.category]} {entry.category}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 'var(--fs-xs)' }}>{entry.user}</td>
                                    <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{entry.detail}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AuditLogPage;
