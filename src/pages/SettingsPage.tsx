import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Sun, Moon, Palette, Check, Download, Upload, Trash2, Info, Database, Bell, Clock, DollarSign, RotateCcw, Keyboard } from 'lucide-react';
import { useTheme, ACCENT_COLORS } from '../context/ThemeContext';
import { StorageService } from '../services/StorageService';
import { useToast } from '../context/ToastContext';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const SettingsPage: React.FC = () => {
    const { mode, setMode, accent, setAccent } = useTheme();
    const { toast } = useToast();
    const [loanDays, setLoanDays] = useState(14);
    const [fineRate, setFineRate] = useState(1.00);
    const [notifEnabled, setNotifEnabled] = useState(true);

    const handleExport = () => {
        const data = StorageService.exportAll();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'koha-backup.json'; a.click();
        URL.revokeObjectURL(url);
        toast('success', 'Data exported successfully!');
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    StorageService.importAll(reader.result as string);
                    toast('success', 'Data imported! Refresh to see changes.');
                } catch {
                    toast('error', 'Invalid JSON file.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const handleReset = () => {
        if (confirm('Are you sure? This will erase ALL saved data.')) {
            StorageService.clear();
            toast('success', 'All data cleared. Refresh to reset.');
        }
    };

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
            <div className="page-header">
                <motion.h1 variants={item}>Settings</motion.h1>
                <motion.p variants={item}>Configure your library management system.</motion.p>
            </div>

            <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
                {/* Appearance */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-6)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                        <Palette size={18} style={{ color: 'var(--accent-tertiary)' }} /> Appearance
                    </h3>
                    <div style={{ marginBottom: 'var(--sp-4)' }}>
                        <label className="form-label" style={{ marginBottom: 'var(--sp-2)', display: 'block' }}>Theme Mode</label>
                        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                            <button className={`btn ${mode === 'dark' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('dark')}>
                                <Moon size={15} /> Dark
                            </button>
                            <button className={`btn ${mode === 'light' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('light')}>
                                <Sun size={15} /> Light
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="form-label" style={{ marginBottom: 'var(--sp-2)', display: 'block' }}>Accent Color</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {ACCENT_COLORS.map(c => (
                                <button key={c.name} onClick={() => setAccent(c.name)}
                                    title={c.name}
                                    style={{
                                        width: 36, height: 36, borderRadius: 'var(--radius-md)',
                                        background: c.primary, border: accent === c.name ? '2px solid white' : '2px solid transparent',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'transform 0.15s, border-color 0.2s',
                                        transform: accent === c.name ? 'scale(1.15)' : 'scale(1)',
                                    }}
                                >
                                    {accent === c.name && <Check size={16} color="white" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Library Configuration */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-6)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                        <Clock size={18} style={{ color: 'var(--accent-tertiary)' }} /> Library Configuration
                    </h3>
                    <div className="grid-2" style={{ gap: 'var(--sp-4)' }}>
                        <div className="form-group">
                            <label className="form-label">Default Loan Period (days)</label>
                            <input className="form-input" type="number" min={1} value={loanDays} onChange={e => setLoanDays(Number(e.target.value))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Fine Rate ($/day)</label>
                            <input className="form-input" type="number" min={0} step={0.25} value={fineRate} onChange={e => setFineRate(Number(e.target.value))} />
                        </div>
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-6)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                        <Bell size={18} style={{ color: 'var(--accent-tertiary)' }} /> Notifications
                    </h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', cursor: 'pointer', fontSize: 'var(--fs-sm)' }}>
                        <div style={{
                            width: 44, height: 24, borderRadius: 12, padding: 2, cursor: 'pointer',
                            background: notifEnabled ? 'var(--accent-primary)' : 'var(--bg-glass)',
                            transition: 'background 0.2s',
                        }} onClick={() => setNotifEnabled(!notifEnabled)}>
                            <div style={{
                                width: 20, height: 20, borderRadius: '50%', background: 'white',
                                transform: notifEnabled ? 'translateX(20px)' : 'translateX(0)',
                                transition: 'transform 0.2s',
                            }} />
                        </div>
                        Enable due date reminders
                    </label>
                </motion.div>

                {/* Data Management */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-6)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                        <Database size={18} style={{ color: 'var(--accent-tertiary)' }} /> Data Management
                    </h3>
                    <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                        <button className="btn btn-ghost" onClick={handleExport}><Download size={15} /> Export JSON</button>
                        <button className="btn btn-ghost" onClick={handleImport}><Upload size={15} /> Import JSON</button>
                        <button className="btn btn-ghost" onClick={handleReset} style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
                            <Trash2 size={15} /> Reset All Data
                        </button>
                    </div>
                </motion.div>

                {/* About */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-6)' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                        <Info size={18} style={{ color: 'var(--accent-tertiary)' }} /> About
                    </h3>
                    <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                        <div><strong>Koha</strong> — Library Management System</div>
                        <div>Version 3.0.0</div>
                        <div>Built with React + TypeScript + Vite</div>
                        <div style={{ marginTop: 'var(--sp-2)', color: 'var(--text-tertiary)', fontSize: 'var(--fs-xs)' }}>
                            Press <kbd style={{ padding: '0 4px', background: 'var(--bg-glass)', borderRadius: 4, fontSize: '0.65rem' }}>?</kbd> for keyboard shortcuts
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SettingsPage;
