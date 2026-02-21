import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, BookOpen, UserPlus, Users, BookMarked,
    RotateCcw, CalendarClock, DollarSign, BarChart3, Bell,
    ChevronLeft, ChevronRight, LogOut, Library, PlusCircle,
    Calendar, Clock, BookOpenCheck, Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    const navItems = [
        {
            section: 'Main', items: [
                { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'librarian', 'member'] },
                { to: '/calendar', icon: Calendar, label: 'Calendar', roles: ['admin', 'librarian', 'member'] },
                { to: '/timeline', icon: Clock, label: 'Timeline', roles: ['admin', 'librarian', 'member'] },
            ]
        },
        {
            section: 'Catalog', items: [
                { to: '/books', icon: BookOpen, label: 'Books', roles: ['admin', 'librarian', 'member'] },
                { to: '/books/add', icon: PlusCircle, label: 'Add Book', roles: ['admin', 'librarian'] },
                { to: '/ebooks', icon: BookOpenCheck, label: 'eBook Store', roles: ['admin', 'librarian', 'member'] },
            ]
        },
        {
            section: 'Circulation', items: [
                { to: '/issue', icon: BookMarked, label: 'Issue Book', roles: ['admin', 'librarian'] },
                { to: '/return', icon: RotateCcw, label: 'Return Book', roles: ['admin', 'librarian'] },
                { to: '/reservations', icon: CalendarClock, label: 'Reservations', roles: ['admin', 'librarian', 'member'] },
            ]
        },
        {
            section: 'People', items: [
                { to: '/members', icon: Users, label: 'Members', roles: ['admin', 'librarian'] },
                { to: '/members/add', icon: UserPlus, label: 'Add Member', roles: ['admin', 'librarian'] },
            ]
        },
        {
            section: 'Finance', items: [
                { to: '/fines', icon: DollarSign, label: 'Fines', roles: ['admin', 'librarian'] },
            ]
        },
        {
            section: 'Admin', items: [
                { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['admin'] },
                { to: '/notifications', icon: Bell, label: 'Notifications', roles: ['admin', 'librarian', 'member'] },
                { to: '/settings', icon: Settings, label: 'Settings', roles: ['admin', 'librarian', 'member'] },
            ]
        },
    ];

    return (
        <motion.aside
            className={`sidebar ${collapsed ? 'collapsed' : ''}`}
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon"><Library size={20} color="white" /></div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.h2
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.15 }}
                            >
                                Koha
                            </motion.h2>
                        )}
                    </AnimatePresence>
                </div>
                <button className="sidebar-toggle" onClick={onToggle}>
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(section => {
                    const visibleItems = section.items.filter(item =>
                        item.roles.some(r => hasRole([r as 'admin' | 'librarian' | 'member']))
                    );
                    if (visibleItems.length === 0) return null;

                    return (
                        <div className="nav-section" key={section.section}>
                            {!collapsed && <div className="nav-section-title">{section.section}</div>}
                            {visibleItems.map(item => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.to === '/'}
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <item.icon size={18} />
                                    {!collapsed && <span>{item.label}</span>}
                                </NavLink>
                            ))}
                        </div>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="user-avatar">{user?.name?.charAt(0) || '?'}</div>
                {!collapsed && (
                    <div className="user-info" style={{ flex: 1, minWidth: 0 }}>
                        <div className="user-name">{user?.name}</div>
                        <div className="user-role">{user?.role}</div>
                    </div>
                )}
                {!collapsed && (
                    <button className="btn-icon" onClick={handleLogout} title="Logout">
                        <LogOut size={16} />
                    </button>
                )}
            </div>
        </motion.aside>
    );
};

export default Sidebar;
