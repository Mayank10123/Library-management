import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, X, Check, Clock, BookOpen } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useToast } from '../context/ToastContext';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const ReservationsPage: React.FC = () => {
    const { reservations, books, members, cancelReservation } = useLibrary();
    const { toast } = useToast();

    const activeReservations = useMemo(() =>
        reservations.filter(r => r.status === 'waiting' || r.status === 'ready'),
        [reservations]);

    const pastReservations = useMemo(() =>
        reservations.filter(r => r.status === 'fulfilled' || r.status === 'cancelled'),
        [reservations]);

    const statusIcon = (status: string) => {
        switch (status) {
            case 'waiting': return <Clock size={14} style={{ color: 'var(--warning)' }} />;
            case 'ready': return <Check size={14} style={{ color: 'var(--success)' }} />;
            case 'fulfilled': return <BookOpen size={14} style={{ color: 'var(--info)' }} />;
            case 'cancelled': return <X size={14} style={{ color: 'var(--danger)' }} />;
            default: return null;
        }
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'waiting': return 'badge-warning';
            case 'ready': return 'badge-success';
            case 'fulfilled': return 'badge-info';
            case 'cancelled': return 'badge-danger';
            default: return 'badge-accent';
        }
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <div className="page-header">
                <motion.h1 variants={item}>Reservations</motion.h1>
                <motion.p variants={item}>Manage book reservation queue and notifications.</motion.p>
            </div>

            <motion.div className="glass-card" style={{ padding: 'var(--sp-5)' }} variants={item}>
                <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
                    Active Reservations ({activeReservations.length})
                </h3>
                {activeReservations.length > 0 ? (
                    <div className="data-table-container" style={{ borderRadius: 'var(--radius-md)' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Priority</th>
                                    <th>Book</th>
                                    <th>Member</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeReservations.map(r => {
                                    const book = books.find(b => b.id === r.bookId);
                                    const member = members.find(m => m.id === r.memberId);
                                    return (
                                        <tr key={r.id}>
                                            <td>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                    width: 28, height: 28, borderRadius: '50%',
                                                    background: 'rgba(124,58,237,0.15)', color: 'var(--accent-tertiary)',
                                                    fontWeight: 700, fontSize: 'var(--fs-sm)',
                                                }}>
                                                    #{r.priority}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{book?.title}</td>
                                            <td>{member?.name}</td>
                                            <td>{r.reservationDate}</td>
                                            <td>
                                                <span className={`badge ${statusBadge(r.status)}`}>
                                                    {statusIcon(r.status)} {r.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => {
                                                    cancelReservation(r.id);
                                                    toast('info', 'Reservation cancelled.');
                                                }}>
                                                    <X size={12} /> Cancel
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
                        <CalendarClock size={40} />
                        <h3>No active reservations</h3>
                        <p>All reservations have been fulfilled or cancelled.</p>
                    </div>
                )}
            </motion.div>

            {pastReservations.length > 0 && (
                <motion.div className="glass-card" style={{ padding: 'var(--sp-5)', marginTop: 'var(--sp-5)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
                        History
                    </h3>
                    <div className="data-table-container" style={{ borderRadius: 'var(--radius-md)' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Member</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastReservations.map(r => {
                                    const book = books.find(b => b.id === r.bookId);
                                    const member = members.find(m => m.id === r.memberId);
                                    return (
                                        <tr key={r.id}>
                                            <td style={{ color: 'var(--text-primary)' }}>{book?.title}</td>
                                            <td>{member?.name}</td>
                                            <td>{r.reservationDate}</td>
                                            <td><span className={`badge ${statusBadge(r.status)}`}>{r.status}</span></td>
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

export default ReservationsPage;
