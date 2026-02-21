import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

interface Shelf {
    id: string;
    name: string;
    x: number; y: number; w: number; h: number;
    category: string;
    color: string;
}

const SHELVES: Shelf[] = [
    { id: 's1', name: 'Fiction A-M', x: 60, y: 80, w: 100, h: 30, category: 'Fiction', color: '#7c3aed' },
    { id: 's2', name: 'Fiction N-Z', x: 60, y: 130, w: 100, h: 30, category: 'Fiction', color: '#7c3aed' },
    { id: 's3', name: 'Science Fiction', x: 60, y: 180, w: 100, h: 30, category: 'Science Fiction', color: '#3b82f6' },
    { id: 's4', name: 'Computer Science', x: 220, y: 80, w: 100, h: 30, category: 'Computer Science', color: '#10b981' },
    { id: 's5', name: 'Programming', x: 220, y: 130, w: 100, h: 30, category: 'Computer Science', color: '#10b981' },
    { id: 's6', name: 'Science', x: 220, y: 180, w: 100, h: 30, category: 'Science', color: '#f59e0b' },
    { id: 's7', name: 'Philosophy', x: 380, y: 80, w: 100, h: 30, category: 'Philosophy', color: '#ec4899' },
    { id: 's8', name: 'Self-Help', x: 380, y: 130, w: 100, h: 30, category: 'Self-Help', color: '#f97316' },
    { id: 's9', name: 'Biography', x: 380, y: 180, w: 100, h: 30, category: 'Biography', color: '#14b8a6' },
    { id: 's10', name: 'New Arrivals', x: 220, y: 260, w: 100, h: 30, category: 'New', color: '#ef4444' },
];

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const LibraryMapPage: React.FC = () => {
    const { books } = useLibrary();
    const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
    const [hoveredShelf, setHoveredShelf] = useState<string | null>(null);

    const booksOnShelf = selectedShelf
        ? books.filter(b => b.category === selectedShelf.category)
        : [];

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
            <div className="page-header">
                <motion.h1 variants={item}>Library Map</motion.h1>
                <motion.p variants={item}>Interactive floor plan. Click a shelf to see books.</motion.p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--sp-5)' }}>
                {/* Map */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-5)' }} variants={item}>
                    <svg width="100%" viewBox="0 0 540 320" style={{ borderRadius: 'var(--radius-md)' }}>
                        {/* Floor */}
                        <rect x="10" y="10" width="520" height="300" rx="12" fill="var(--bg-glass)" stroke="var(--border-color)" strokeWidth="1.5" />

                        {/* Entrance */}
                        <rect x="230" y="290" width="80" height="20" rx="4" fill="var(--accent-primary)" opacity="0.3" />
                        <text x="270" y="304" textAnchor="middle" fontSize="8" fill="var(--text-primary)" fontWeight="600">ENTRANCE</text>

                        {/* Desk */}
                        <rect x="200" y="30" width="140" height="30" rx="6" fill="var(--accent-primary)" opacity="0.15" stroke="var(--accent-primary)" strokeWidth="1" />
                        <text x="270" y="49" textAnchor="middle" fontSize="9" fill="var(--accent-tertiary)" fontWeight="600">CIRCULATION DESK</text>

                        {/* Reading Area */}
                        <rect x="400" y="240" width="120" height="50" rx="6" fill="rgba(16, 185, 129, 0.1)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
                        <text x="460" y="269" textAnchor="middle" fontSize="8" fill="var(--success)" fontWeight="500">Reading Area</text>

                        {/* Computer Area */}
                        <rect x="20" y="240" width="100" height="50" rx="6" fill="rgba(59, 130, 246, 0.1)" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
                        <text x="70" y="269" textAnchor="middle" fontSize="8" fill="var(--info)" fontWeight="500">Computers</text>

                        {/* Shelves */}
                        {SHELVES.map(shelf => {
                            const isHovered = hoveredShelf === shelf.id;
                            const isSelected = selectedShelf?.id === shelf.id;
                            const bookCount = books.filter(b => b.category === shelf.category).length;
                            const availableCount = books.filter(b => b.category === shelf.category && b.availableCopies > 0).length;

                            return (
                                <g key={shelf.id} style={{ cursor: 'pointer' }}
                                    onMouseEnter={() => setHoveredShelf(shelf.id)}
                                    onMouseLeave={() => setHoveredShelf(null)}
                                    onClick={() => setSelectedShelf(shelf)}>
                                    <rect x={shelf.x} y={shelf.y} width={shelf.w} height={shelf.h}
                                        rx={4} fill={shelf.color}
                                        opacity={isSelected ? 0.8 : isHovered ? 0.6 : 0.3}
                                        stroke={isSelected ? 'white' : shelf.color}
                                        strokeWidth={isSelected ? 2 : 1}
                                        style={{ transition: 'all 0.2s ease' }}
                                    />
                                    <text x={shelf.x + shelf.w / 2} y={shelf.y + shelf.h / 2 + 1}
                                        textAnchor="middle" dominantBaseline="middle"
                                        fontSize="7.5" fill={isSelected || isHovered ? 'white' : 'var(--text-primary)'}
                                        fontWeight="600" style={{ pointerEvents: 'none' }}>
                                        {shelf.name}
                                    </text>
                                    {/* Availability dot */}
                                    <circle cx={shelf.x + shelf.w - 6} cy={shelf.y + 6} r={3}
                                        fill={availableCount > 0 ? 'var(--success)' : 'var(--danger)'} />

                                    {/* Tooltip on hover */}
                                    {isHovered && (
                                        <g>
                                            <rect x={shelf.x + shelf.w + 8} y={shelf.y - 4} width={90} height={38}
                                                rx={6} fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
                                            <text x={shelf.x + shelf.w + 14} y={shelf.y + 10} fontSize="8" fill="var(--text-primary)" fontWeight="600">{shelf.name}</text>
                                            <text x={shelf.x + shelf.w + 14} y={shelf.y + 24} fontSize="7" fill="var(--text-tertiary)">{bookCount} books · {availableCount} available</text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}

                        {/* Legend */}
                        <g transform="translate(18, 18)">
                            <circle cx={0} cy={0} r={3} fill="var(--success)" />
                            <text x={8} y={3} fontSize="7" fill="var(--text-tertiary)">Available</text>
                            <circle cx={60} cy={0} r={3} fill="var(--danger)" />
                            <text x={68} y={3} fontSize="7" fill="var(--text-tertiary)">All checked out</text>
                        </g>
                    </svg>
                </motion.div>

                {/* Shelf Detail Panel */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-5)', height: 'fit-content' }} variants={item}>
                    {selectedShelf ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                                <div style={{ width: 12, height: 12, borderRadius: 3, background: selectedShelf.color }} />
                                <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600 }}>{selectedShelf.name}</h3>
                            </div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-3)' }}>
                                {booksOnShelf.length} book{booksOnShelf.length !== 1 && 's'} · {booksOnShelf.filter(b => b.availableCopies > 0).length} available
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', maxHeight: 400, overflowY: 'auto' }}>
                                {booksOnShelf.map(book => (
                                    <div key={book.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
                                        padding: 'var(--sp-2)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)',
                                    }}>
                                        <div style={{ width: 24, height: 34, borderRadius: 3, background: book.coverColor, flexShrink: 0 }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>{book.title}</div>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>{book.author}</div>
                                        </div>
                                        <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-accent'}`} style={{ fontSize: '0.5rem' }}>
                                            {book.availableCopies > 0 ? 'available' : 'checked out'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--sp-6) 0', color: 'var(--text-tertiary)' }}>
                            <MapPin size={32} style={{ marginBottom: 'var(--sp-2)', opacity: 0.5 }} />
                            <div style={{ fontSize: 'var(--fs-sm)' }}>Click a shelf on the map to view books</div>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LibraryMapPage;
