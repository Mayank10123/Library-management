import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookMarked, RotateCcw, AlertTriangle, DollarSign, CalendarClock, Filter } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

interface TimelineEvent {
    id: string;
    date: string;
    type: 'issue' | 'return' | 'overdue' | 'fine' | 'reservation';
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const TimelinePage: React.FC = () => {
    const { transactions, fines, reservations, books, members } = useLibrary();
    const [filterType, setFilterType] = useState<string>('all');

    const events = useMemo<TimelineEvent[]>(() => {
        const evts: TimelineEvent[] = [];
        transactions.forEach(t => {
            const book = books.find(b => b.id === t.bookId);
            const member = members.find(m => m.id === t.memberId);
            evts.push({
                id: t.id + '_issue', date: t.issueDate, type: 'issue',
                title: `Book Issued`, description: `${member?.name} borrowed "${book?.title}"`,
                icon: <BookMarked size={16} />, color: 'var(--info)',
            });
            if (t.returnDate) {
                evts.push({
                    id: t.id + '_return', date: t.returnDate, type: 'return',
                    title: `Book Returned`, description: `${member?.name} returned "${book?.title}"`,
                    icon: <RotateCcw size={16} />, color: 'var(--success)',
                });
            }
            if (t.status === 'overdue') {
                evts.push({
                    id: t.id + '_overdue', date: t.dueDate, type: 'overdue',
                    title: `Overdue Alert`, description: `"${book?.title}" overdue by ${member?.name}`,
                    icon: <AlertTriangle size={16} />, color: 'var(--danger)',
                });
            }
        });
        fines.forEach(f => {
            const member = members.find(m => m.id === f.memberId);
            evts.push({
                id: f.id, date: f.date, type: 'fine',
                title: `Fine ${f.status === 'paid' ? 'Paid' : 'Added'}`,
                description: `$${f.amount.toFixed(2)} — ${f.reason} (${member?.name})`,
                icon: <DollarSign size={16} />, color: f.status === 'paid' ? 'var(--success)' : 'var(--warning)',
            });
        });
        reservations.forEach(r => {
            const book = books.find(b => b.id === r.bookId);
            const member = members.find(m => m.id === r.memberId);
            evts.push({
                id: r.id, date: r.reservationDate, type: 'reservation',
                title: `Reservation ${r.status}`,
                description: `${member?.name} reserved "${book?.title}"`,
                icon: <CalendarClock size={16} />, color: 'var(--accent-tertiary)',
            });
        });
        evts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return evts;
    }, [transactions, fines, reservations, books, members]);

    const filtered = filterType === 'all' ? events : events.filter(e => e.type === filterType);

    // Group by date
    const grouped = useMemo(() => {
        const groups: Record<string, TimelineEvent[]> = {};
        filtered.forEach(e => {
            if (!groups[e.date]) groups[e.date] = [];
            groups[e.date].push(e);
        });
        return Object.entries(groups);
    }, [filtered]);

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
            <div className="page-header">
                <motion.h1 variants={item}>Activity Timeline</motion.h1>
                <motion.p variants={item}>A chronological view of all library activity.</motion.p>
            </div>

            {/* Filters */}
            <motion.div variants={item} style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)', flexWrap: 'wrap' }}>
                {[
                    { key: 'all', label: 'All' },
                    { key: 'issue', label: 'Issues' },
                    { key: 'return', label: 'Returns' },
                    { key: 'overdue', label: 'Overdue' },
                    { key: 'fine', label: 'Fines' },
                    { key: 'reservation', label: 'Reservations' },
                ].map(f => (
                    <button key={f.key}
                        className={`btn ${filterType === f.key ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFilterType(f.key)}
                        style={{ fontSize: 'var(--fs-xs)', padding: 'var(--sp-1) var(--sp-3)' }}
                    >{f.label}</button>
                ))}
            </motion.div>

            {/* Timeline */}
            <div style={{ position: 'relative', paddingLeft: 32 }}>
                {/* Vertical line */}
                <div style={{
                    position: 'absolute', left: 11, top: 0, bottom: 0,
                    width: 2, background: 'var(--border-color)',
                }} />

                {grouped.map(([date, evts]) => (
                    <motion.div key={date} variants={item} style={{ marginBottom: 'var(--sp-5)' }}>
                        {/* Date label */}
                        <div style={{
                            position: 'relative', fontSize: 'var(--fs-xs)', fontWeight: 700,
                            color: 'var(--accent-tertiary)', marginBottom: 'var(--sp-3)', marginLeft: '-32px', paddingLeft: 32,
                        }}>
                            <div style={{
                                position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)',
                                width: 16, height: 16, borderRadius: '50%',
                                background: 'var(--accent-primary)', border: '3px solid var(--bg-primary)',
                            }} />
                            {date}
                        </div>

                        {evts.map(evt => (
                            <motion.div key={evt.id} className="glass-card"
                                style={{
                                    padding: 'var(--sp-3) var(--sp-4)', marginBottom: 'var(--sp-2)',
                                    marginLeft: 8, display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                                }}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.15 }}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                                    background: `${evt.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: evt.color, flexShrink: 0,
                                }}>
                                    {evt.icon}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{evt.title}</div>
                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{evt.description}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ))}

                {filtered.length === 0 && (
                    <div className="empty-state">
                        <Filter size={48} />
                        <h3>No events found</h3>
                        <p>Try changing the filter.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TimelinePage;
