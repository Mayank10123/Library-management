import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookMarked, RotateCcw, AlertTriangle, Calendar } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const CalendarPage: React.FC = () => {
    const { transactions, books, members } = useLibrary();
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1)); // Feb 2026
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1));

    // Events from transactions
    const events = useMemo(() => {
        const evts: { day: number; type: 'due' | 'overdue' | 'issued' | 'returned'; label: string; color: string }[] = [];
        transactions.forEach(t => {
            const book = books.find(b => b.id === t.bookId);
            const member = members.find(m => m.id === t.memberId);
            const dueD = new Date(t.dueDate);
            const issueD = new Date(t.issueDate);

            if (issueD.getMonth() === month && issueD.getFullYear() === year) {
                evts.push({ day: issueD.getDate(), type: 'issued', label: `${member?.name} borrowed ${book?.title}`, color: 'var(--info)' });
            }
            if (dueD.getMonth() === month && dueD.getFullYear() === year) {
                const isOverdue = t.status === 'overdue';
                evts.push({ day: dueD.getDate(), type: isOverdue ? 'overdue' : 'due', label: `${book?.title} due (${member?.name})`, color: isOverdue ? 'var(--danger)' : 'var(--warning)' });
            }
            if (t.returnDate) {
                const retD = new Date(t.returnDate);
                if (retD.getMonth() === month && retD.getFullYear() === year) {
                    evts.push({ day: retD.getDate(), type: 'returned', label: `${member?.name} returned ${book?.title}`, color: 'var(--success)' });
                }
            }
        });
        return evts;
    }, [transactions, books, members, month, year]);

    const selectedEvents = selectedDay ? events.filter(e => e.day === selectedDay) : [];

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
            <div className="page-header">
                <motion.h1 variants={item}>Calendar</motion.h1>
                <motion.p variants={item}>Track due dates, returns, and library events.</motion.p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--sp-5)' }}>
                {/* Calendar Grid */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-5)' }} variants={item}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
                        <button className="btn-icon" onClick={prevMonth}><ChevronLeft size={18} /></button>
                        <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700 }}>{MONTHS[month]} {year}</h2>
                        <button className="btn-icon" onClick={nextMonth}><ChevronRight size={18} /></button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                        {DAYS.map(d => (
                            <div key={d} style={{ textAlign: 'center', fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--text-tertiary)', padding: 'var(--sp-2) 0' }}>{d}</div>
                        ))}
                        {calendarDays.map((day, i) => {
                            const dayEvents = day ? events.filter(e => e.day === day) : [];
                            const isToday = day === 21 && month === 1 && year === 2026;
                            const isSelected = day === selectedDay;
                            return (
                                <div key={i}
                                    onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                                    style={{
                                        minHeight: 70, padding: 'var(--sp-1)', borderRadius: 'var(--radius-sm)',
                                        background: isSelected ? 'var(--bg-glass-hover)' : isToday ? 'rgba(124,58,237,0.08)' : 'transparent',
                                        border: isToday ? '1px solid var(--accent-primary)' : '1px solid transparent',
                                        cursor: day ? 'pointer' : 'default',
                                        transition: 'background var(--transition-fast)',
                                    }}
                                    onMouseEnter={e => { if (day && !isSelected) e.currentTarget.style.background = 'var(--bg-glass)'; }}
                                    onMouseLeave={e => { if (day && !isSelected) e.currentTarget.style.background = isToday ? 'rgba(124,58,237,0.08)' : 'transparent'; }}
                                >
                                    {day && (
                                        <>
                                            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--accent-tertiary)' : 'var(--text-primary)', marginBottom: 2 }}>{day}</div>
                                            {dayEvents.slice(0, 3).map((evt, j) => (
                                                <div key={j} style={{ width: '100%', height: 4, borderRadius: 2, background: evt.color, marginBottom: 1 }} title={evt.label} />
                                            ))}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: 'var(--sp-4)', marginTop: 'var(--sp-4)', justifyContent: 'center' }}>
                        {[{ color: 'var(--info)', label: 'Issued' }, { color: 'var(--warning)', label: 'Due' }, { color: 'var(--danger)', label: 'Overdue' }, { color: 'var(--success)', label: 'Returned' }].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
                                <div style={{ width: 10, height: 4, borderRadius: 2, background: l.color }} /> {l.label}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Day Detail Sidebar */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-5)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                        <Calendar size={16} style={{ color: 'var(--accent-tertiary)' }} />
                        {selectedDay ? `${MONTHS[month]} ${selectedDay}` : 'Select a day'}
                    </h3>
                    {selectedEvents.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                            {selectedEvents.map((evt, i) => (
                                <div key={i} className="glass-panel" style={{ padding: 'var(--sp-3)', display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-2)' }}>
                                    <div style={{ marginTop: 2 }}>
                                        {evt.type === 'issued' ? <BookMarked size={14} style={{ color: evt.color }} />
                                            : evt.type === 'returned' ? <RotateCcw size={14} style={{ color: evt.color }} />
                                                : <AlertTriangle size={14} style={{ color: evt.color }} />}
                                    </div>
                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{evt.label}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--sp-8) 0', color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>
                            {selectedDay ? 'No events this day' : 'Click a day to see events'}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CalendarPage;
