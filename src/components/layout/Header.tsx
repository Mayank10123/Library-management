import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
    const { user } = useAuth();
    const { notifications, markNotificationRead } = useLibrary();
    const { togglePanel } = useTheme();
    const [showNotifs, setShowNotifs] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const unread = notifications.filter(n => !n.read);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <header className="app-header" style={{
            position: 'fixed', top: 0, right: 0, left: 'var(--sidebar-width)',
            height: 'var(--header-height)', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', padding: '0 var(--sp-6)',
            background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)',
            zIndex: 100, backdropFilter: 'blur(12px)',
            transition: 'left var(--transition-base)',
        }}>
            {/* Search with Ctrl+K hint */}
            <div style={{ position: 'relative', flex: 1, maxWidth: 420 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                    className="form-input"
                    placeholder="Search..."
                    readOnly
                    onClick={() => {
                        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
                    }}
                    style={{ paddingLeft: 36, paddingRight: 70, cursor: 'pointer', fontSize: 'var(--fs-sm)' }}
                />
                <div className="search-hint" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                    Ctrl+K
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                {/* Theme button */}
                <button className="btn-icon" onClick={togglePanel} title="Appearance">
                    <Palette size={17} />
                </button>

                {/* Notifications */}
                <div ref={notifRef} style={{ position: 'relative' }}>
                    <button className="btn-icon" onClick={() => setShowNotifs(prev => !prev)} style={{ position: 'relative' }}>
                        <Bell size={17} />
                        {unread.length > 0 && (
                            <span style={{
                                position: 'absolute', top: -2, right: -2,
                                width: 16, height: 16, borderRadius: '50%',
                                background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.55rem', fontWeight: 700, color: 'white',
                            }}>
                                {unread.length}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifs && (
                            <motion.div className="notif-dropdown glass-card"
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                style={{
                                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                                    width: 340, padding: 'var(--sp-4)', zIndex: 101,
                                }}>
                                <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-3)' }}>Notifications</h4>
                                {notifications.slice(0, 5).map(n => (
                                    <div key={n.id}
                                        onClick={() => markNotificationRead(n.id)}
                                        style={{
                                            padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--radius-sm)',
                                            marginBottom: 'var(--sp-1)', cursor: 'pointer',
                                            opacity: n.read ? 0.5 : 1, transition: 'background var(--transition-fast)',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{n.message}</div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* User avatar */}
                <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'white',
                }}>
                    {user?.name.charAt(0)}
                </div>
            </div>
        </header>
    );
};

export default Header;
