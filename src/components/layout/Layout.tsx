import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from '../ui/Breadcrumbs';
import ShortcutsModal from '../ui/ShortcutsModal';
import { useKeyboardShortcuts } from '../ui/KeyboardShortcuts';

const Layout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);

    const openShortcutsModal = useCallback(() => setShortcutsOpen(true), []);
    useKeyboardShortcuts(openShortcutsModal);

    return (
        <div className="app-layout">
            <div className="animated-bg" />
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <Header />
            <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
                <motion.div
                    className="page-content"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Breadcrumbs />
                    <Outlet />
                </motion.div>
            </main>
            <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
        </div>
    );
};

export default Layout;
