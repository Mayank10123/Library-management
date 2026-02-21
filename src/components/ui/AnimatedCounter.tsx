import React, { useEffect, useRef, useState } from 'react';

interface Props {
    target: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

const AnimatedCounter: React.FC<Props> = ({ target, duration = 1200, prefix = '', suffix = '', decimals = 0 }) => {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) {
            setValue(target);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const start = performance.now();
                    const animate = (now: number) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setValue(eased * target);
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return <span ref={ref}>{prefix}{value.toFixed(decimals)}{suffix}</span>;
};

export default AnimatedCounter;
