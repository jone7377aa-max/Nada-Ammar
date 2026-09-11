import { useState } from "react";
import { HeartBurst } from "@/components/HeartBurst";

const QUESTIONS = [
    {
        label: "السؤال الأول 😑",
        q: "طيب… مين يحب الثاني اكثثثر؟",
        options: ["انتي تحبيني اكثر 🙄", "انا احبك اكثر 😌", "انا احبك اكثر كمان مرة 😑"],
        correctIdx: [1, 2],
        correctAnswer: ["ايوه شطورة وانتي تعترفي كدا 🌚"],
        wrong: "غلططططط ❌😑",
        answer: ["طبعا انا احبك اكثر مافيش خياااار ثانييييييي 😑😑", "وش كنتي متوقعة يعني؟ 😑😂"],
        next: "يلا السؤال اللي بعده 👀",
    },
    {
        label: "السؤال الثاني 😑",
        q: "بحب مين اكثرر؟",
        options: ["نونوووووو", "توتووووووو", "حلوياتيييييي"],
        allCorrect: true,
        correctAnswer: ["ايوه بحبها بس بحبكم كلكم والله 😂"],
        next: "السؤال اللي بعده 👀",
    },
    {
        label: "السؤال الثالث 👀",
        q: "لو قلت لك دقيقة واجيك كم ممكن اخذ وقت فعلا؟",
        options: ["دقيقة فعلًا 🙄", "5 دقايق", "نص ساعة 😂", "مدري، على حسب عمار 😂"],
        wrong: "غلط برضو ❌🙄",
        answer: ["طبعاا مش باخر انتي يتهيالك يعجوزة 🙄", "أنا قلت دقيقة يعني دقيقة 😑😂"],
        next: "يلا كملي…",
    },
];

export const Quiz = ({ playSfx, onFinish }) => {
    const [qi, setQi] = useState(0);
    const [picked, setPicked] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [correct, setCorrect] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [finished, setFinished] = useState(false);

    const q = QUESTIONS[qi];
    const resultLines = correct ? q.correctAnswer || [] : q.answer || [];

    const choose = (i) => {
        if (answered) return;
        const isCorrect = Boolean(q.allCorrect) || (q.correctIdx || []).includes(i);
        try {
            navigator.vibrate && navigator.vibrate(isCorrect ? [20, 60, 20] : 35);
        } catch (e) {}
        playSfx && playSfx(isCorrect ? "pop" : "wrong");
        setPicked(i);
        setCorrect(isCorrect);
        setAnswered(true);
        setTimeout(() => setShowResult(true), 620);
    };

    const next = () => {
        try {
            navigator.vibrate && navigator.vibrate(20);
        } catch (e) {}
        if (qi < QUESTIONS.length - 1) {
            setQi(qi + 1);
            setPicked(null);
            setAnswered(false);
            setCorrect(false);
            setShowResult(false);
        } else {
            playSfx && playSfx("pop");
            setFinished(true);
        }
    };

    if (finished) {
        return (
            <div className="quiz-done" data-testid="quiz-done">
                <HeartBurst count={10} />
                <p className="quiz-done-title pop-in">خلاص خلص الاختبار 😂❤️</p>
                <p className="answer-line" style={{ animationDelay: "0.6s" }}>
                    واضح إني أنا اللي كنت محتاج اختبار من الأساس 😑😂
                </p>
                <button
                    data-testid="quiz-continue-button"
                    className="btn-love pop-in mt-9"
                    style={{ animationDelay: "1.3s" }}
                    onClick={onFinish}
                >
                    يلا نكمل ❤️
                </button>
            </div>
        );
    }

    return (
        <div className="quiz-card pop-in" key={qi} data-testid="quiz">
            <p className="quiz-step" data-testid="quiz-question-label">
                {q.label}
            </p>
            <h3 className="quiz-q" data-testid="quiz-question-text">
                {q.q}
            </h3>
            <div className="quiz-options">
                {q.options.map((opt, i) => (
                    <button
                        key={i}
                        data-testid={`quiz-option-${qi}-${i}`}
                        className={`quiz-option${
                            answered && picked === i
                                ? correct
                                    ? " correct-pick"
                                    : " wrong-pick"
                                : ""
                        }${answered && picked !== i ? " disabled" : ""}`}
                        onClick={() => choose(i)}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {showResult && (
                <div className="quiz-result" data-testid="quiz-result">
                    {correct && <HeartBurst count={7} />}
                    {correct ? (
                        <p className="correct-banner" data-testid="quiz-correct-banner">
                            صحييييح ✅😌
                        </p>
                    ) : (
                        <>
                            <p className="wrong-banner" data-testid="quiz-wrong-banner">
                                {q.wrong}
                            </p>
                            <p className="correct-label">الإجابة الصحيحة 😌:</p>
                        </>
                    )}
                    {resultLines.map((l, i) => (
                        <p
                            key={i}
                            className="answer-line"
                            style={{ animationDelay: `${0.45 + i * 0.6}s` }}
                        >
                            {l}
                        </p>
                    ))}
                    <button
                        data-testid="quiz-next-button"
                        className="btn-love answer-line mt-7"
                        style={{ animationDelay: `${0.7 + resultLines.length * 0.6}s` }}
                        onClick={next}
                    >
                        {q.next}
                    </button>
                </div>
            )}
        </div>
    );
};
