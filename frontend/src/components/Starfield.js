import { useMemo } from "react";

export const Starfield = ({ count = 80 }) => {
    const stars = useMemo(
        () =>
            Array.from({ length: count }, () => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() < 0.85 ? Math.random() * 1.5 + 0.6 : Math.random() * 2 + 1.6,
                delay: Math.random() * 6,
                dur: 3 + Math.random() * 5,
                gold: Math.random() < 0.12,
            })),
        [count]
    );
    return (
        <div className="stars-layer" aria-hidden="true">
            {stars.map((s, i) => (
                <span
                    key={i}
                    className={`star${s.gold ? " star-gold" : ""}`}
                    style={{
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        width: s.size,
                        height: s.size,
                        animationDelay: `${s.delay}s`,
                        animationDuration: `${s.dur}s`,
                    }}
                />
            ))}
        </div>
    );
};
