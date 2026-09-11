import { useCallback, useEffect, useRef, useState } from "react";
import { Starfield } from "@/components/Starfield";
import { FloatingHearts } from "@/components/FloatingHearts";
import { Reveal } from "@/components/Reveal";
import { Intro } from "@/components/Intro";
import { Quiz } from "@/components/Quiz";
import { Countdown } from "@/components/Countdown";
import { FinalScene } from "@/components/FinalScene";
import { useAudio } from "@/hooks/useAudio";

const MESSAGE_PARAS = [
    "ندى،",
    "أحبك.",
    "يمكن أحيانًا ما أعرف أقول لك كل اللي في قلبي، ويمكن ما أعبر لك بالطريقة اللي تستحقينها…",
    "بس والله انتي اكثر شي فارق لي في حياتي.",
    "أحبك يا ندى، وأحب وجودك معي، وأحب تفاصيلك اللي يمكن حتى أنتِ ما تنتبهين لها.",
    "واليوم، في يوم ميلادك، أهم شيء عندي إنك تكونين مبسوطة.",
    "أحبك يا ندى، الله يديمك لي يا عيوني وحياتي وروحي ❤️",
];

const TrackSection = ({ track, setTrack, children, className = "", ...rest }) => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setTrack(track);
            },
            { threshold: 0.35 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [track, setTrack]);
    return (
        <section ref={ref} className={`scene ${className}`} {...rest}>
            {children}
        </section>
    );
};

export default function App() {
    const [entered, setEntered] = useState(false);
    const [introGone, setIntroGone] = useState(false);
    const [quizDone, setQuizDone] = useState(false);
    const audio = useAudio();
    const afterQuizRef = useRef(null);

    const handleEnter = useCallback(() => {
        audio.enable("intro");
        setEntered(true);
    }, [audio]);

    useEffect(() => {
        if (!entered) return;
        const t = setTimeout(() => setIntroGone(true), 1400);
        return () => clearTimeout(t);
    }, [entered]);

    const handleQuizFinish = useCallback(() => {
        setQuizDone(true);
    }, []);

    useEffect(() => {
        if (quizDone && afterQuizRef.current) {
            const t = setTimeout(
                () => afterQuizRef.current?.scrollIntoView({ behavior: "smooth" }),
                200
            );
            return () => clearTimeout(t);
        }
    }, [quizDone]);

    return (
        <div className="app-shell">
            <div className="app-bg" aria-hidden="true" />
            <Starfield />
            <FloatingHearts />

            {!introGone && <Intro entered={entered} onEnter={handleEnter} />}

            {entered && (
                <main>
                    <TrackSection track="intro" setTrack={audio.setTrack} data-testid="scene-date">
                        <Reveal>
                            <p className="big-date" data-testid="birthday-date">
                                14 سبتمبر 2006
                            </p>
                        </Reveal>
                        <Reveal delay={250}>
                            <p className="line mt-7">في هذا اليوم انولدت ندى…</p>
                        </Reveal>
                        <Reveal delay={150}>
                            <p className="line mt-5">
                                ومن بين كل الأيام والتواريخ، هذا التاريخ صار له مكان خاص عندي.
                            </p>
                        </Reveal>
                        <Reveal delay={150}>
                            <p className="line dim mt-5">يمكن بالنسبة للعالم مجرد تاريخ…</p>
                        </Reveal>
                        <Reveal delay={150}>
                            <p className="line mt-5">
                                بس بالنسبة لي صار تاريخ له معنى ثاني تمامًا. ❤️
                            </p>
                        </Reveal>
                    </TrackSection>

                    <TrackSection
                        track="emotional"
                        setTrack={audio.setTrack}
                        data-testid="scene-message"
                    >
                        <Reveal>
                            <span className="divider-heart" aria-hidden="true">
                                ❤
                            </span>
                        </Reveal>
                        {MESSAGE_PARAS.map((p, i) => (
                            <Reveal key={i} delay={i * 120}>
                                <p
                                    className={`msg-line ${i === 0 ? "msg-name" : ""} ${
                                        i === 1 ? "msg-love" : ""
                                    }`}
                                    data-testid={`message-para-${i}`}
                                >
                                    {p}
                                </p>
                            </Reveal>
                        ))}
                    </TrackSection>

                    <TrackSection track="playful" setTrack={audio.setTrack} data-testid="scene-quiz">
                        <Reveal>
                            <p className="quiz-intro-1 font-playful" data-testid="quiz-intro-1">
                                طيب يعجوزه عندي لك اختبار مفاجئ 😑
                            </p>
                        </Reveal>
                        <Reveal delay={250}>
                            <p className="quiz-intro-2" data-testid="quiz-intro-2">
                                هنشوووف هتنجحي ولا ايه 😂
                            </p>
                        </Reveal>
                        <Reveal delay={200} className="w-full">
                            <Quiz playSfx={audio.playSfx} onFinish={handleQuizFinish} />
                        </Reveal>
                    </TrackSection>

                    {quizDone && (
                        <>
                            <div ref={afterQuizRef} />
                            <TrackSection
                                track="celebration"
                                setTrack={audio.setTrack}
                                data-testid="scene-newyear"
                            >
                                <Reveal>
                                    <p className="big-date" dir="ltr" data-testid="newyear-date">
                                        14 • 09 • 2006
                                    </p>
                                </Reveal>
                                <Reveal delay={200}>
                                    <p className="line mt-7 text-xl">
                                        كبرتي سنة يا عجوزتي 😂❤️
                                    </p>
                                </Reveal>
                                <Reveal delay={150}>
                                    <p className="line mt-4">وعقبال للـ1000 سنة ياربببببب ❤️</p>
                                </Reveal>
                                <Reveal delay={150} className="w-full">
                                    <Countdown />
                                </Reveal>
                            </TrackSection>

                            <TrackSection
                                track="finale"
                                setTrack={audio.setTrack}
                                data-testid="scene-final"
                            >
                                <FinalScene />
                            </TrackSection>
                        </>
                    )}
                </main>
            )}

            {entered && (
                <button
                    data-testid="music-toggle-button"
                    className={`music-btn ${audio.enabled ? "on" : "off"}`}
                    onClick={audio.toggle}
                    aria-label="الموسيقى"
                >
                    <span className="note" aria-hidden="true">
                        🎵
                    </span>
                </button>
            )}
        </div>
    );
}
