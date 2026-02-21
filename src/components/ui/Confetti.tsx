import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    w: number; h: number;
    color: string;
    rotation: number; rotSpeed: number;
    opacity: number;
}

const COLORS = ['#7c3aed', '#6366f1', '#a78bfa', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#ef4444', '#14b8a6', '#f97316'];

const Confetti: React.FC<{ active: boolean; onDone?: () => void }> = ({ active, onDone }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!active || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Particle[] = [];
        for (let i = 0; i < 120; i++) {
            particles.push({
                x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
                y: canvas.height * 0.4,
                vx: (Math.random() - 0.5) * 12,
                vy: -Math.random() * 14 - 4,
                w: Math.random() * 8 + 4,
                h: Math.random() * 6 + 2,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                opacity: 1,
            });
        }

        let frame: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = 0;

            for (const p of particles) {
                p.vy += 0.3;
                p.vx *= 0.99;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotSpeed;
                p.opacity -= 0.006;

                if (p.opacity <= 0) continue;
                alive++;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            }

            if (alive > 0) {
                frame = requestAnimationFrame(animate);
            } else {
                onDone?.();
            }
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [active, onDone]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed', inset: 0, zIndex: 99999,
                pointerEvents: 'none',
            }}
        />
    );
};

export default Confetti;
