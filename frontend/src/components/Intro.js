import { useEffect, useState } from "react";
import { HeartBurst } from "@/components/HeartBurst";

const LINES = [
    { t: "ندوشتيي…", cls: "intro-line-1 font-emotional" },
    { t: "اليوم انولدت حياتي ونور عيونيي…", cls: "intro-line-2" },
    { t: "اليوم يوم وحدة أحبها بشكل ما أعرف أوصفه بالكلام.", cls: "intro-line-3" },
];

export const Intro = ({ entered, onEnter }) => {
    const [step, setStep] = useState(0);
    const [burst, setBurst] = useState(false);

    useEffect(() => {
        const timers = [1300, 3700, 6300, 8900].map((ms, i) =>
            setTimeout(() => setStep(i + 1), ms)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    const handle = () => {
        try {
            navigator.vibrate && navigator.vibrate(45);
        } catch (e) {}
        setBurst(true);
        onEnter();
    };

    return (
        <div
            className={`intro-overlay${entered ? " intro-fade" : ""}`}
            data-testid="intro-scene"
        >
            {burst && <HeartBurst />}
            <div className="intro-content">
                {LINES.map(
                    (l, i) =>
                        step > i && (
                            <p key={i} className={`pop-in ${l.cls}`} data-testid={`intro-line-${i}`}>
                                {l.t}
                            </p>
                        )
                )}
                {step >= 4 && (
                    <button
                        data-testid="enter-button"
                        className="btn-love pop-in mt-6"
                        onClick={handle}
                        disabled={entered}
                    >
                        ادخلي ❤️
                    </button>
                )}
            </div>
        </div>
    );
};
