import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Palette, Check } from 'lucide-react';
import { useTheme, ACCENT_COLORS } from '../../context/ThemeContext';

const ThemePanel: React.FC = () => {
    const { mode, accent, toggleMode, setAccent, isPanelOpen, togglePanel } = useTheme();

    return (
        <AnimatePresence>
            {isPanelOpen && (
                <>
                    <motion.div
                        className="theme-overlay"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={togglePanel}
                    />
                    <motion.div
                        className="theme-panel"
                        initial={{ x: 320, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 320, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="theme-panel-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                                <Palette size={18} style={{ color: accent.primary }} />
                                <span style={{ fontWeight: 700, fontSize: 'var(--fs-md)' }}>Appearance</span>
                            </div>
                            <button className="btn-icon" onClick={togglePanel}><X size={16} /></button>
                        </div>

                        <div className="theme-panel-section">
                            <div className="theme-panel-label">Mode</div>
                            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                                <button
                                    className={`theme-mode-btn ${mode === 'light' ? 'active' : ''}`}
                                    onClick={() => { if (mode !== 'light') toggleMode(); }}
                                >
                                    <Sun size={18} />
                                    <span>Light</span>
                                </button>
                                <button
                                    className={`theme-mode-btn ${mode === 'dark' ? 'active' : ''}`}
                                    onClick={() => { if (mode !== 'dark') toggleMode(); }}
                                >
                                    <Moon size={18} />
                                    <span>Dark</span>
                                </button>
                            </div>
                        </div>

                        <div className="theme-panel-section">
                            <div className="theme-panel-label">Accent Color</div>
                            <div className="accent-grid">
                                {ACCENT_COLORS.map(c => (
                                    <motion.button
                                        key={c.name}
                                        className={`accent-swatch ${accent.name === c.name ? 'active' : ''}`}
                                        style={{ background: c.gradient }}
                                        onClick={() => setAccent(c)}
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.95 }}
                                        title={c.name}
                                    >
                                        {accent.name === c.name && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                                <Check size={14} strokeWidth={3} />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="theme-panel-section">
                            <div className="theme-panel-label">Preview</div>
                            <div className="glass-card" style={{ padding: 'var(--sp-4)', pointerEvents: 'none' }}>
                                <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
                                    <button className="btn btn-primary btn-sm">Primary</button>
                                    <button className="btn btn-secondary btn-sm">Secondary</button>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                                    <span className="badge badge-accent">Accent</span>
                                    <span className="badge badge-success">Success</span>
                                    <span className="badge badge-danger">Danger</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ThemePanel;
