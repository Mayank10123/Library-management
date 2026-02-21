import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Search, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useToast } from '../context/ToastContext';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const ReturnPage: React.FC = () => {
    const { transactions, books, members, returnBook } = useLibrary();
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [selectedTxn, setSelectedTxn] = useState<string | null>(null);
    const [returned, setReturned] = useState(false);
    const [fineAmount, setFineAmount] = useState(0);

    const activeTransactions = useMemo(() => {
        const q = search.toLowerCase();
        return transactions.filter(t =>
            (t.status === 'active' || t.status === 'overdue') && (
                !q || t.id.includes(q) ||
                books.find(b => b.id === t.bookId)?.title.toLowerCase().includes(q) ||
                members.find(m => m.id === t.memberId)?.name.toLowerCase().includes(q)
            )
        );
    }, [transactions, books, members, search]);

    const selTxn = transactions.find(t => t.id === selectedTxn);
    const selBook = selTxn ? books.find(b => b.id === selTxn.bookId) : null;
    const selMember = selTxn ? members.find(m => m.id === selTxn.memberId) : null;

    const daysOverdue = selTxn ? Math.max(0, Math.floor((Date.now() - new Date(selTxn.dueDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;

    const handleReturn = () => {
        if (!selectedTxn) return;
        const result = returnBook(selectedTxn);
        if (result) {
            setFineAmount(result.fine);
            setReturned(true);
            toast(result.fine > 0 ? 'warning' : 'success',
                result.fine > 0 ? `Book returned with $${result.fine.toFixed(2)} fine.` : 'Book returned successfully!');
            setTimeout(() => { setReturned(false); setSelectedTxn(null); setSearch(''); }, 3000);
        }
    };

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
            <div className="page-header">
                <motion.h1 variants={item}>Return Book</motion.h1>
                <motion.p variants={item}>Process book returns and calculate any applicable fines.</motion.p>
            </div>

            {returned ? (
                <motion.div className="glass-card text-center" style={{ padding: 'var(--sp-12)' }}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                        <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: 'var(--sp-4)' }} />
                    </motion.div>
                    <h2 style={{ marginBottom: 'var(--sp-2)' }}>Book Returned!</h2>
                    {fineAmount > 0 && (
                        <div className="glass-panel" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)', padding: 'var(--sp-3) var(--sp-5)', marginTop: 'var(--sp-4)', borderColor: 'rgba(239,68,68,0.2)' }}>
                            <DollarSign size={16} style={{ color: 'var(--danger)' }} />
                            <span style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--danger)' }}>${fineAmount.toFixed(2)} fine</span>
                        </div>
                    )}
                </motion.div>
            ) : (
                <>
                    <motion.div className="glass-card" style={{ padding: 'var(--sp-6)' }} variants={item}>
                        <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
                            Find Transaction
                        </h3>
                        <div style={{ position: 'relative', marginBottom: 'var(--sp-4)' }}>
                            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                            <input className="form-input" placeholder="Search by transaction ID, book title, or member name..."
                                value={search} onChange={e => { setSearch(e.target.value); setSelectedTxn(null); }}
                                style={{ paddingLeft: 36 }} />
                        </div>

                        <div className="data-table-container" style={{ borderRadius: 'var(--radius-md)' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Book</th>
                                        <th>Member</th>
                                        <th>Issue Date</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeTransactions.map(t => {
                                        const book = books.find(b => b.id === t.bookId);
                                        const member = members.find(m => m.id === t.memberId);
                                        return (
                                            <tr key={t.id} style={selectedTxn === t.id ? { background: 'rgba(124,58,237,0.08)' } : {}}>
                                                <td style={{ fontFamily: 'monospace' }}>{t.id}</td>
                                                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{book?.title}</td>
                                                <td>{member?.name}</td>
                                                <td>{t.issueDate}</td>
                                                <td>{t.dueDate}</td>
                                                <td>
                                                    <span className={`badge ${t.status === 'overdue' ? 'badge-danger' : 'badge-info'}`}>{t.status}</span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-secondary" onClick={() => setSelectedTxn(t.id)}>Select</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {activeTransactions.length === 0 && (
                                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: 'var(--sp-6)', color: 'var(--text-tertiary)' }}>No active transactions found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {selTxn && (
                        <motion.div className="glass-card" style={{ padding: 'var(--sp-6)', marginTop: 'var(--sp-5)' }}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>Return Summary</h3>
                            <div className="grid-2">
                                <div>
                                    <div className="form-label">Book</div>
                                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{selBook?.title}</div>
                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{selBook?.author}</div>
                                </div>
                                <div>
                                    <div className="form-label">Member</div>
                                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{selMember?.name}</div>
                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{selMember?.department}</div>
                                </div>
                            </div>
                            {daysOverdue > 0 && (
                                <div className="glass-panel" style={{ padding: 'var(--sp-4)', marginTop: 'var(--sp-4)', borderColor: 'rgba(239,68,68,0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-1)' }}>
                                        <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />
                                        <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--danger)' }}>Overdue by {daysOverdue} days</span>
                                    </div>
                                    <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, color: 'var(--danger)' }}>
                                        Fine: ${(daysOverdue * 1.00).toFixed(2)}
                                    </div>
                                </div>
                            )}
                            <button className="btn btn-primary btn-lg" onClick={handleReturn} style={{ marginTop: 'var(--sp-5)' }}>
                                <RotateCcw size={18} /> Process Return
                            </button>
                        </motion.div>
                    )}
                </>
            )}
        </motion.div>
    );
};

export default ReturnPage;
