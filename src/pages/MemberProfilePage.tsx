import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, Building, Calendar, BookOpen, DollarSign, ArrowLeft, Clock, AlertTriangle } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const MemberProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { members, transactions, fines, books } = useLibrary();

    const member = members.find(m => m.id === id);

    const memberTxns = useMemo(() =>
        transactions.filter(t => t.memberId === id).sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()),
        [transactions, id]
    );

    const memberFines = useMemo(() => fines.filter(f => f.memberId === id), [fines, id]);
    const totalFinesPending = memberFines.filter(f => f.status === 'pending').reduce((s, f) => s + f.amount, 0);
    const activeBooks = memberTxns.filter(t => t.status === 'active' || t.status === 'overdue');

    if (!member) return (
        <div className="empty-state">
            <AlertTriangle size={48} /><h3>Member not found</h3>
            <button className="btn btn-primary" onClick={() => navigate('/members')}>Back to Members</button>
        </div>
    );

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
            <motion.div variants={item} style={{ marginBottom: 'var(--sp-4)' }}>
                <button className="btn btn-ghost" onClick={() => navigate('/members')} style={{ fontSize: 'var(--fs-sm)' }}>
                    <ArrowLeft size={15} /> Back to Members
                </button>
            </motion.div>

            {/* Profile Header */}
            <motion.div className="glass-card" style={{ padding: 'var(--sp-8)' }} variants={item}>
                <div style={{ display: 'flex', gap: 'var(--sp-6)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: 'var(--accent-gradient)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 800, color: 'white', flexShrink: 0,
                    }}>
                        {member.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--sp-1)' }}>{member.name}</h1>
                        <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)' }}>
                            <span className={`badge ${member.status === 'active' ? 'badge-success' : member.status === 'suspended' ? 'badge-danger' : 'badge-accent'}`}>
                                {member.status}
                            </span>
                            <span className="badge badge-accent">{member.membershipType}</span>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)', textAlign: 'center' }}>
                        {[
                            { label: 'Books Issued', value: activeBooks.length, icon: BookOpen, color: 'var(--info)' },
                            { label: 'Total Txns', value: memberTxns.length, icon: Clock, color: 'var(--accent-tertiary)' },
                            { label: 'Pending Fines', value: `$${totalFinesPending.toFixed(2)}`, icon: DollarSign, color: totalFinesPending > 0 ? 'var(--danger)' : 'var(--success)' },
                        ].map(s => (
                            <div key={s.label} className="glass-panel" style={{ padding: 'var(--sp-3) var(--sp-4)' }}>
                                <s.icon size={18} style={{ color: s.color, marginBottom: 4 }} />
                                <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)', marginTop: 'var(--sp-5)' }}>
                {/* Contact Info */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-6)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>Contact Information</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                        {[
                            { icon: Mail, label: 'Email', value: member.email },
                            { icon: Phone, label: 'Phone', value: member.phone },
                            { icon: Building, label: 'Department', value: member.department },
                            { icon: Calendar, label: 'Joined', value: member.joinDate },
                        ].map(info => (
                            <div key={info.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                                    <info.icon size={14} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{info.label}</div>
                                    <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{info.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Currently Borrowed */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-6)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>Currently Borrowed ({activeBooks.length})</h3>
                    {activeBooks.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                            {activeBooks.map(t => {
                                const book = books.find(b => b.id === t.bookId);
                                return (
                                    <div key={t.id} className="glass-panel" style={{ padding: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                        <div style={{ width: 30, height: 40, borderRadius: 4, background: book?.coverColor, flexShrink: 0 }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{book?.title}</div>
                                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>Due: {t.dueDate}</div>
                                        </div>
                                        <span className={`badge ${t.status === 'overdue' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.6rem' }}>
                                            {t.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--sp-6) 0', color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>
                            No books currently borrowed
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Borrowing History */}
            <motion.div className="glass-card" style={{ padding: 'var(--sp-6)', marginTop: 'var(--sp-5)' }} variants={item}>
                <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>Borrowing History</h3>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Return Date</th><th>Status</th><th>Fine</th></tr>
                        </thead>
                        <tbody>
                            {memberTxns.map(t => {
                                const book = books.find(b => b.id === t.bookId);
                                return (
                                    <tr key={t.id}>
                                        <td style={{ fontWeight: 500 }}>{book?.title}</td>
                                        <td>{t.issueDate}</td>
                                        <td>{t.dueDate}</td>
                                        <td>{t.returnDate || '—'}</td>
                                        <td><span className={`badge ${t.status === 'returned' ? 'badge-success' : t.status === 'overdue' ? 'badge-danger' : 'badge-accent'}`}>{t.status}</span></td>
                                        <td>{t.fine > 0 ? `$${t.fine.toFixed(2)}` : '—'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MemberProfilePage;
