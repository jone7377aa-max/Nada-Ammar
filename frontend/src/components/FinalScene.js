import { useEffect, useRef, useState } from "react";

const FINAL_PARAS = [
    "أحبك ياندى الله يديمك لي يعيوني وحياتيييي وروووحيي وعقبال لل1000 سنه ياربببببب ❤️",
    "أتمنى كل سنة تمر عليك تكون أحلى من اللي قبلها، وتكون حياتك مليانة أشياء تفرح قلبك.",
    "وأتمنى أكون دائمًا من الناس اللي يقدرون يخلونك تبتسمين حتى في الأيام اللي ما تكون حلوة.",
    "كل عام وأنتِ ندى اللي أحبها.",
    "كل عام وأنتِ بخير يا عيوني.",
    "واعشقك يعجوزتي ❤️😂",
];

export const FinalScene = () => {
    const ref = useRef(null);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let timers = [];
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    [900, 3100, 5300, 7700, 16800].forEach((ms, i) =>
                        timers.push(setTimeout(() => setStep(i + 1), ms))
                    );
                    obs.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        obs.observe(el);
        return () => {
            obs.disconnect();
            timers.forEach(clearTimeout);
        };
    }, []);

    return (
        <div ref={ref} className="final-scene" data-testid="final-scene">
            {step >= 1 && (
                <p className="final-name font-emotional pop-in" data-testid="final-line-1">
                    ندى…
                </p>
            )}
            {step >= 2 && (
                <p className="line pop-in" data-testid="final-line-2">
                    قبل ما تخلص الرحلة…
                </p>
            )}
            {step >= 3 && (
                <p className="line pop-in" data-testid="final-line-3">
                    عندي شيء لازم أقوله لك.
                </p>
            )}
            {step >= 4 && (
                <div className="final-message" data-testid="final-message">
                    {FINAL_PARAS.map((p, i) => (
                        <p key={i} className="answer-line" style={{ animationDelay: `${i * 1.1}s` }}>
                            {p}
                        </p>
                    ))}
                </div>
            )}
            {step >= 5 && (
                <div className="final-reveal" data-testid="final-reveal">
                    <p className="font-emotional text-2xl glow-pink pop-in" dir="ltr">
                        Happy Birthday, Nada ❤️
                    </p>
                    <p className="gold-text pop-in mt-2" dir="ltr" style={{ animationDelay: "0.5s" }}>
                        14 September 2026
                    </p>
                    <p className="line pop-in mt-6" style={{ animationDelay: "1s" }}>
                        من عمار ❤️
                    </p>
                    <p
                        className="final-love pop-in"
                        data-testid="final-love"
                        style={{ animationDelay: "1.6s" }}
                    >
                        أحبك.
                    </p>
                </div>
            )}
        </div>
    );
};
