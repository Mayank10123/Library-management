import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useToast } from '../context/ToastContext';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const FinesPage: React.FC = () => {
    const { fines, members, payFine } = useLibrary();
    const { toast } = useToast();

    const pendingFines = useMemo(() => fines.filter(f => f.status === 'pending'), [fines]);
    const paidFines = useMemo(() => fines.filter(f => f.status === 'paid'), [fines]);
    const totalPending = pendingFines.reduce((s, f) => s + f.amount, 0);
    const totalCollected = paidFines.reduce((s, f) => s + f.amount, 0);

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <div className="page-header">
                <motion.h1 variants={item}>Fines Management</motion.h1>
                <motion.p variants={item}>Track and manage library fines and payments.</motion.p>
            </div>

            <motion.div className="stats-grid" style={{ marginBottom: 'var(--sp-6)' }} variants={item}>
                <motion.div className="glass-card stat-card" variants={item}>
                    <div className="stat-icon red"><AlertTriangle size={22} /></div>
                    <div className="stat-value">${totalPending.toFixed(2)}</div>
                    <div className="stat-label">Outstanding Fines</div>
                </motion.div>
                <motion.div className="glass-card stat-card" variants={item}>
                    <div className="stat-icon green"><CheckCircle size={22} /></div>
                    <div className="stat-value">${totalCollected.toFixed(2)}</div>
                    <div className="stat-label">Collected</div>
                </motion.div>
                <motion.div className="glass-card stat-card" variants={item}>
                    <div className="stat-icon purple"><DollarSign size={22} /></div>
                    <div className="stat-value">{pendingFines.length}</div>
                    <div className="stat-label">Pending Payments</div>
                </motion.div>
            </motion.div>

            <motion.div className="glass-card" style={{ padding: 'var(--sp-5)' }} variants={item}>
                <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
                    Outstanding Fines
                </h3>
                {pendingFines.length > 0 ? (
                    <div className="data-table-container" style={{ borderRadius: 'var(--radius-md)' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Member</th>
                                    <th>Amount</th>
                                    <th>Reason</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingFines.map(f => {
                                    const member = members.find(m => m.id === f.memberId);
                                    return (
                                        <tr key={f.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'white' }}>
                                                        {member?.name.charAt(0)}
                                                    </div>
                                                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{member?.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 700, color: 'var(--danger)' }}>${f.amount.toFixed(2)}</td>
                                            <td>{f.reason}</td>
                                            <td>{f.date}</td>
                                            <td>
                                                <button className="btn btn-sm btn-success" onClick={() => {
                                                    payFine(f.id);
                                                    toast('success', `$${f.amount.toFixed(2)} fine marked as paid.`);
                                                }}>
                                                    <CreditCard size={12} /> Pay
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state" style={{ padding: 'var(--sp-8)' }}>
                        <CheckCircle size={40} style={{ color: 'var(--success)' }} />
                        <h3>No outstanding fines</h3>
                        <p>All fines have been collected.</p>
                    </div>
                )}
            </motion.div>

            {paidFines.length > 0 && (
                <motion.div className="glass-card" style={{ padding: 'var(--sp-5)', marginTop: 'var(--sp-5)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>Payment History</h3>
                    <div className="data-table-container" style={{ borderRadius: 'var(--radius-md)' }}>
                        <table className="data-table">
                            <thead><tr><th>Member</th><th>Amount</th><th>Reason</th><th>Date</th><th>Status</th></tr></thead>
                            <tbody>
                                {paidFines.map(f => {
                                    const member = members.find(m => m.id === f.memberId);
                                    return (
                                        <tr key={f.id}>
                                            <td style={{ color: 'var(--text-primary)' }}>{member?.name}</td>
                                            <td>${f.amount.toFixed(2)}</td>
                                            <td>{f.reason}</td>
                                            <td>{f.date}</td>
                                            <td><span className="badge badge-success">Paid</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default FinesPage;
