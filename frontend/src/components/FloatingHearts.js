import { useMemo } from "react";

export const FloatingHearts = ({ count = 6 }) => {
    const hearts = useMemo(
        () =>
            Array.from({ length: count }, () => ({
                left: 5 + Math.random() * 88,
                size: 11 + Math.random() * 9,
                dur: 17 + Math.random() * 12,
                delay: Math.random() * 22,
                gold: Math.random() < 0.2,
            })),
        [count]
    );
    return (
        <div className="hearts-layer" aria-hidden="true">
            {hearts.map((h, i) => (
                <span
                    key={i}
                    className={`float-heart${h.gold ? " heart-gold" : ""}`}
                    style={{
                        left: `${h.left}%`,
                        fontSize: h.size,
                        animationDuration: `${h.dur}s`,
                        animationDelay: `${h.delay}s`,
                    }}
                >
                    ❤
                </span>
            ))}
        </div>
    );
};
