import { useCallback, useRef, useState } from "react";

const MAX_VOLUME = 0.55;
const FADE_STEP = 60;

const fade = (audio, target, ms, onDone) => {
    if (!audio) return;
    const steps = Math.max(1, Math.round(ms / FADE_STEP));
    const start = audio.volume;
    let i = 0;
    const timer = setInterval(() => {
        i += 1;
        try {
            audio.volume = Math.min(1, Math.max(0, start + (target - start) * (i / steps)));
        } catch (e) {}
        if (i >= steps) {
            clearInterval(timer);
            if (target === 0) {
                try {
                    audio.pause();
                } catch (e) {}
            }
            onDone && onDone();
        }
    }, FADE_STEP);
};

export const useAudio = () => {
    const currentRef = useRef(null);
    const currentTrackRef = useRef(null);
    const pendingRef = useRef("intro");
    const enabledRef = useRef(false);
    const [enabled, setEnabled] = useState(false);

    const startTrack = useCallback((name) => {
        const old = currentRef.current;
        currentTrackRef.current = name;
        if (old) {
            fade(old, 0, 650, () => {
                try {
                    old.removeAttribute("src");
                } catch (e) {}
            });
        }
        const a = new Audio(`/audio/${name}.mp3`);
        a.loop = true;
        a.preload = "auto";
        a.volume = 0;
        a.play()
            .then(() => fade(a, MAX_VOLUME, 1400))
            .catch(() => {});
        currentRef.current = a;
    }, []);

    const enable = useCallback(
        (track = "intro") => {
            if (enabledRef.current) return;
            enabledRef.current = true;
            setEnabled(true);
            startTrack(track);
        },
        [startTrack]
    );

    const setTrack = useCallback(
        (name) => {
            pendingRef.current = name;
            if (!enabledRef.current) return;
            if (currentTrackRef.current === name) return;
            startTrack(name);
        },
        [startTrack]
    );

    const toggle = useCallback(() => {
        if (enabledRef.current) {
            enabledRef.current = false;
            setEnabled(false);
            if (currentRef.current) fade(currentRef.current, 0, 400);
        } else {
            enabledRef.current = true;
            setEnabled(true);
            const a = currentRef.current;
            if (a && a.src) {
                a.play()
                    .then(() => fade(a, MAX_VOLUME, 900))
                    .catch(() => {});
            } else {
                startTrack(pendingRef.current || "intro");
            }
        }
    }, [startTrack]);

    const playSfx = useCallback((name) => {
        if (!enabledRef.current) return;
        try {
            const s = new Audio(`/audio/${name}.mp3`);
            s.volume = 0.7;
            s.play().catch(() => {});
        } catch (e) {}
    }, []);

    return { enabled, enable, setTrack, toggle, playSfx };
};
