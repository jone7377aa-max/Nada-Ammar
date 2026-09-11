import { useEffect, useState } from "react";
import { Confetti } from "@/components/Confetti";

const TARGET = new Date(2026, 8, 14, 0, 0, 0).getTime();
const KEYS = ["days", "hours", "minutes", "seconds"];

export const Countdown = () => {
    const [now, setNow] = useState(() => Date.now());

    const override = new URLSearchParams(window.location.search).get("date");
    const fixedNow = override ? new Date(`${override}T12:00:00`).getTime() : null;

    useEffect(() => {
        if (fixedNow) return undefined;
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, [fixedNow]);

    const eff = fixedNow || now;
    const diff = TARGET - eff;

    if (diff <= 0) {
        return (
            <div className="countdown-wrap mt-8" data-testid="birthday-celebration">
                <Confetti />
                <p className="celebration-title font-emotional pop-in">اليوم يوم ندى ❤️🎂</p>
            </div>
        );
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;
    const cells = [
        [d, "يوم"],
        [h, "ساعة"],
        [m, "دقيقة"],
        [s, "ثانية"],
    ];

    return (
        <div className="countdown-wrap" data-testid="countdown">
            <p className="line mt-8" data-testid="countdown-title">
                باقي على يوم ندى…
            </p>
            <div className="countdown-row" data-testid="countdown-timer">
                {cells.map(([v, l], i) => (
                    <div key={l} className="countdown-cell" data-testid={`countdown-${KEYS[i]}`}>
                        <span className="cd-num">{String(v).padStart(2, "0")}</span>
                        <span className="cd-label">{l}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
