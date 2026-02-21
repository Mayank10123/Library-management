import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const MembersPage: React.FC = () => {
    const { members } = useLibrary();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const filtered = useMemo(() => {
        return members.filter(m => {
            const q = search.toLowerCase();
            const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.department.toLowerCase().includes(q) || m.id.includes(q);
            const matchesStatus = !statusFilter || m.status === statusFilter;
            const matchesType = !typeFilter || m.membershipType === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [members, search, statusFilter, typeFilter]);

    const statusColors: Record<string, string> = { active: 'badge-success', suspended: 'badge-danger', expired: 'badge-warning' };

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <div className="page-header">
                <motion.h1 variants={item}>Members</motion.h1>
                <motion.p variants={item}>Manage library members and their profiles.</motion.p>
            </div>

            <motion.div className="filters-bar" variants={item}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input className="filter-input" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, width: '100%' }} />
                </div>
                <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="expired">Expired</option>
                </select>
                <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                </select>
            </motion.div>

            <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-5)' }} variants={container}>
                {filtered.map(m => (
                    <motion.div key={m.id} className="glass-card member-card" variants={item} whileHover={{ y: -4 }}
                        onClick={() => navigate(`/members/${m.id}`)} style={{ cursor: 'pointer' }}>
                        <div className="member-avatar">{m.name.charAt(0)}</div>
                        <div className="member-name">{m.name}</div>
                        <div className="member-dept">{m.department}</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
                            <span className={`badge ${statusColors[m.status]}`}>{m.status}</span>
                            <span className="badge badge-accent">{m.membershipType}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)', fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', justifyContent: 'center' }}><Mail size={10} /> {m.email}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', justifyContent: 'center' }}><Phone size={10} /> {m.phone}</div>
                        </div>
                        <div className="member-stats">
                            <div className="member-stat-item">
                                <div className="member-stat-value">{m.booksIssued}</div>
                                <div className="member-stat-label">Borrowed</div>
                            </div>
                            <div className="member-stat-item">
                                <div className="member-stat-value" style={m.totalFines > 0 ? { color: 'var(--danger)' } : {}}>
                                    ${m.totalFines.toFixed(2)}
                                </div>
                                <div className="member-stat-label">Fines</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {filtered.length === 0 && (
                <div className="empty-state"><Users size={48} /><h3>No members found</h3><p>Try adjusting your filters.</p></div>
            )}
        </motion.div>
    );
};

export default MembersPage;
