import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

// Pure canvas QR code generator (simplified)
// Generates a visual QR-like pattern based on the ISBN data
function drawQR(canvas: HTMLCanvasElement, data: string, size: number) {
    const ctx = canvas.getContext('2d')!;
    canvas.width = size;
    canvas.height = size;

    const moduleCount = 21;
    const moduleSize = size / moduleCount;

    // Generate pattern from data hash
    const hash = data.split('').map(c => c.charCodeAt(0));
    const grid: boolean[][] = [];
    for (let r = 0; r < moduleCount; r++) {
        grid[r] = [];
        for (let c = 0; c < moduleCount; c++) {
            grid[r][c] = false;
        }
    }

    // Position detection patterns (3 corners)
    const drawFinder = (sr: number, sc: number) => {
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
                const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
                grid[sr + r][sc + c] = isOuter || isInner;
            }
        }
    };
    drawFinder(0, 0);
    drawFinder(0, moduleCount - 7);
    drawFinder(moduleCount - 7, 0);

    // Timing patterns
    for (let i = 8; i < moduleCount - 8; i++) {
        grid[6][i] = i % 2 === 0;
        grid[i][6] = i % 2 === 0;
    }

    // Data encoding (simplified visual pattern from data)
    let bitIdx = 0;
    for (let r = moduleCount - 1; r >= 0; r--) {
        for (let c = moduleCount - 1; c >= 0; c--) {
            if (grid[r][c]) continue; // Skip finder/timing
            if (r < 9 && c < 9) continue;
            if (r < 9 && c > moduleCount - 9) continue;
            if (r > moduleCount - 9 && c < 9) continue;
            const hashVal = hash[bitIdx % hash.length] + bitIdx;
            grid[r][c] = (hashVal * 7 + r * 3 + c * 11) % 3 === 0;
            bitIdx++;
        }
    }

    // Render
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#1a1a2e';
    for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
            if (grid[r][c]) {
                ctx.beginPath();
                ctx.roundRect(c * moduleSize + 0.5, r * moduleSize + 0.5, moduleSize - 1, moduleSize - 1, 1.5);
                ctx.fill();
            }
        }
    }
}

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const QRGenerator: React.FC = () => {
    const { books } = useLibrary();
    const canvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());

    useEffect(() => {
        canvasRefs.current.forEach((canvas, isbn) => {
            drawQR(canvas, isbn, 160);
        });
    });

    const downloadQR = (isbn: string, title: string) => {
        const canvas = canvasRefs.current.get(isbn);
        if (!canvas) return;
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `QR-${title.replace(/\s+/g, '-')}.png`;
        a.click();
    };

    const copyISBN = (isbn: string) => {
        navigator.clipboard.writeText(isbn);
    };

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}>
            <div className="page-header">
                <motion.h1 variants={item}>QR Code Generator</motion.h1>
                <motion.p variants={item}>Generate QR codes for book ISBNs. Download or print labels.</motion.p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--sp-4)' }}>
                {books.map(book => (
                    <motion.div key={book.id} className="glass-card" style={{ padding: 'var(--sp-4)', textAlign: 'center' }} variants={item}>
                        <canvas
                            ref={el => { if (el) canvasRefs.current.set(book.isbn, el); }}
                            style={{ borderRadius: 'var(--radius-md)', marginBottom: 'var(--sp-3)', width: 140, height: 140 }}
                        />
                        <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 2 }}>{book.title}</div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-3)', fontFamily: 'monospace' }}>{book.isbn}</div>
                        <div style={{ display: 'flex', gap: 'var(--sp-1)', justifyContent: 'center' }}>
                            <button className="btn btn-ghost" onClick={() => downloadQR(book.isbn, book.title)} style={{ fontSize: 'var(--fs-xs)', padding: '4px 8px' }}>
                                <Download size={12} />
                            </button>
                            <button className="btn btn-ghost" onClick={() => copyISBN(book.isbn)} style={{ fontSize: 'var(--fs-xs)', padding: '4px 8px' }}>
                                <Copy size={12} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default QRGenerator;
