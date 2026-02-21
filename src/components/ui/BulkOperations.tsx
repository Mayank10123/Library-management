import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Trash2, Download, XCircle, AlertTriangle } from 'lucide-react';

interface BulkItem {
    id: string;
    label: string;
    subLabel?: string;
}

interface BulkOperationsProps {
    items: BulkItem[];
    onDelete?: (ids: string[]) => void;
    onExport?: (ids: string[]) => void;
    entityName?: string;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({ items, onDelete, onExport, entityName = 'items' }) => {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showConfirm, setShowConfirm] = useState(false);

    const toggleAll = () => {
        if (selected.size === items.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(items.map(i => i.id)));
        }
    };

    const toggle = (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id); else next.add(id);
        setSelected(next);
    };

    const handleDelete = () => {
        onDelete?.(Array.from(selected));
        setSelected(new Set());
        setShowConfirm(false);
    };

    const handleExport = () => {
        onExport?.(Array.from(selected));
    };

    const allSelected = selected.size === items.length && items.length > 0;

    return (
        <div>
            {/* Action Bar */}
            {selected.size > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                        padding: 'var(--sp-3) var(--sp-4)',
                        background: 'var(--accent-primary)', borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--sp-3)', color: 'white',
                    }}
                >
                    <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>
                        {selected.size} {entityName} selected
                    </span>
                    <div style={{ flex: 1 }} />
                    {onExport && (
                        <button onClick={handleExport}
                            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'white', padding: '4px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-xs)', fontFamily: 'inherit' }}>
                            <Download size={12} /> Export
                        </button>
                    )}
                    {onDelete && (
                        <button onClick={() => setShowConfirm(true)}
                            style={{ background: 'rgba(239,68,68,0.8)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'white', padding: '4px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-xs)', fontFamily: 'inherit' }}>
                            <Trash2 size={12} /> Delete
                        </button>
                    )}
                    <button onClick={() => setSelected(new Set())}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                        <XCircle size={16} />
                    </button>
                </motion.div>
            )}

            {/* Select All Row */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                padding: 'var(--sp-2) var(--sp-3)',
                borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--sp-2)',
            }}>
                <button onClick={toggleAll} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                    {allSelected ? <CheckSquare size={16} style={{ color: 'var(--accent-primary)' }} /> : <Square size={16} />}
                </button>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
                    {allSelected ? 'Deselect all' : 'Select all'} ({items.length} {entityName})
                </span>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
                {items.map(item => (
                    <div key={item.id}
                        onClick={() => toggle(item.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                            padding: 'var(--sp-2) var(--sp-3)',
                            borderRadius: 'var(--radius-sm)',
                            background: selected.has(item.id) ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                            cursor: 'pointer', transition: 'background 0.15s',
                        }}>
                        {selected.has(item.id) ? (
                            <CheckSquare size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                        ) : (
                            <Square size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>{item.label}</div>
                            {item.subLabel && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{item.subLabel}</div>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            {showConfirm && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9995,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }} onClick={() => setShowConfirm(false)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        onClick={e => e.stopPropagation()}
                        className="glass-card" style={{ padding: 'var(--sp-6)', maxWidth: 400, textAlign: 'center' }}
                    >
                        <AlertTriangle size={40} style={{ color: 'var(--danger)', marginBottom: 'var(--sp-3)' }} />
                        <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, marginBottom: 'var(--sp-2)' }}>Confirm Deletion</h3>
                        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-5)' }}>
                            Are you sure you want to delete {selected.size} {entityName}? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center' }}>
                            <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
                            <button className="btn" onClick={handleDelete}
                                style={{ background: 'var(--danger)', color: 'white', border: 'none' }}>
                                <Trash2 size={14} /> Delete {selected.size}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default BulkOperations;
