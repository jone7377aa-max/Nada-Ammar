import { useMemo } from "react";

export const HeartBurst = ({ count = 12 }) => {
    const hearts = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => {
                const ang = (i / count) * Math.PI * 2;
                const dist = 60 + Math.random() * 95;
                return {
                    tx: Math.cos(ang) * dist,
                    ty: Math.sin(ang) * dist,
                    d: 0.7 + Math.random() * 0.5,
                    size: 13 + Math.random() * 12,
                    delay: Math.random() * 0.15,
                };
            }),
        [count]
    );
    return (
        <div className="heart-burst" aria-hidden="true">
            {hearts.map((h, i) => (
                <span
                    key={i}
                    className="burst-heart"
                    style={{
                        "--tx": `${h.tx}px`,
                        "--ty": `${h.ty}px`,
                        fontSize: h.size,
                        animationDuration: `${h.d}s`,
                        animationDelay: `${h.delay}s`,
                    }}
                >
                    ❤
                </span>
            ))}
        </div>
    );
};
