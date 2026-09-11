import { useEffect, useRef } from "react";

export const Confetti = ({ duration = 5200 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        const colors = ["#b3122f", "#f6b8c8", "#d9b36c", "#ffffff", "#e89aac"];
        const pieces = Array.from({ length: 80 }, () => ({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * canvas.height * 0.35,
            w: (4 + Math.random() * 5) * dpr,
            h: (7 + Math.random() * 8) * dpr,
            vy: (1.1 + Math.random() * 1.7) * dpr,
            vx: (Math.random() - 0.5) * 1.1 * dpr,
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.14,
            color: colors[(Math.random() * colors.length) | 0],
        }));

        let raf;
        const start = performance.now();
        const tick = (t) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of pieces) {
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.vr;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.globalAlpha = 0.9;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            }
            if (t - start < duration) {
                raf = requestAnimationFrame(tick);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [duration]);

    return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
};
