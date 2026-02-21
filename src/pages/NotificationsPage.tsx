import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, BookOpen, AlertTriangle, Info, DollarSign, CheckCheck } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { type: 'spring' as const, damping: 20 } } };

const NotificationsPage: React.FC = () => {
    const { notifications, markNotificationRead, markAllNotificationsRead } = useLibrary();
    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'overdue': return <AlertTriangle size={18} />;
            case 'due_reminder': return <Clock size={18} />;
            case 'reservation_ready': return <BookOpen size={18} />;
            case 'fine': return <DollarSign size={18} />;
            default: return <Info size={18} />;
        }
    };

    const getIconStyle = (type: string) => {
        switch (type) {
            case 'overdue': return { background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' };
            case 'due_reminder': return { background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' };
            case 'reservation_ready': return { background: 'rgba(34,197,94,0.15)', color: 'var(--success)' };
            case 'fine': return { background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' };
            default: return { background: 'rgba(59,130,246,0.15)', color: 'var(--info)' };
        }
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <motion.h1 variants={item}>Notifications</motion.h1>
                    <motion.p variants={item}>{unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.` : 'All caught up!'}</motion.p>
                </div>
                {unreadCount > 0 && (
                    <motion.button className="btn btn-secondary" onClick={markAllNotificationsRead} variants={item}>
                        <CheckCheck size={16} /> Mark all read
                    </motion.button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {notifications.map(n => (
                    <motion.div
                        key={n.id}
                        className="glass-card"
                        variants={item}
                        onClick={() => markNotificationRead(n.id)}
                        style={{
                            padding: 'var(--sp-4) var(--sp-5)',
                            display: 'flex', alignItems: 'center', gap: 'var(--sp-4)',
                            cursor: 'pointer',
                            opacity: n.read ? 0.6 : 1,
                            borderColor: !n.read ? 'var(--border-accent)' : 'var(--border-color)',
                        }}
                        whileHover={{ x: 4 }}
                    >
                        <div style={{
                            ...getIconStyle(n.type),
                            width: 40, height: 40, borderRadius: 'var(--radius-md)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            {getIcon(n.type)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 2 }}>
                                <span style={{ fontWeight: 600, fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}>{n.title}</span>
                                {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />}
                            </div>
                            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{n.message}</div>
                        </div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                            {n.date}
                        </div>
                    </motion.div>
                ))}
            </div>

            {notifications.length === 0 && (
                <div className="empty-state">
                    <Bell size={48} />
                    <h3>No notifications</h3>
                    <p>You're all caught up!</p>
                </div>
            )}
        </motion.div>
    );
};

export default NotificationsPage;
