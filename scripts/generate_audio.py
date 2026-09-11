"""Generates soft placeholder music tracks (self-composed, royalty-free) for the birthday site."""
import os
import subprocess
import wave

import numpy as np

SR = 22050
OUT_DIR = "/app/frontend/public/audio"
os.makedirs(OUT_DIR, exist_ok=True)


def freq(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def bell(midi, dur, vol=0.4, bright=0.5, decay=None):
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    dec = decay if decay else dur * 0.9
    env = np.exp(-3.2 * t / dec) * np.minimum(1.0, t / 0.008)
    sig = np.zeros_like(t)
    for h, a in [(1, 1.0), (2, bright), (3, bright * 0.4), (4, bright * 0.15)]:
        sig += a * np.sin(2 * np.pi * freq(midi) * h * t)
    return vol * env * sig


def pad(chord, dur, vol=0.13):
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    env = np.sin(np.pi * t / dur) ** 1.6
    sig = np.zeros_like(t)
    for m in chord:
        sig += np.sin(2 * np.pi * freq(m) * t) + 0.25 * np.sin(2 * np.pi * freq(m + 12) * t)
    return vol * env * sig / len(chord)


def place(buf, sig, at):
    i = int(at * SR)
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def master(sig):
    sig = sig - np.mean(sig)
    peak = np.max(np.abs(sig))
    if peak > 0:
        sig = sig / peak * 0.85
    n = int(0.04 * SR)
    sig[:n] *= np.linspace(0, 1, n)
    sig[-n:] *= np.linspace(1, 0, n)
    return sig


def ffmpeg_bin():
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        return "ffmpeg"
    except Exception:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()


FFMPEG = ffmpeg_bin()


def save(name, sig):
    sig = master(sig)
    pcm = (sig * 32767).astype(np.int16)
    wav_path = os.path.join(OUT_DIR, name + ".wav")
    with wave.open(wav_path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    mp3_path = os.path.join(OUT_DIR, name + ".mp3")
    subprocess.run(
        [FFMPEG, "-y", "-i", wav_path, "-codec:a", "libmp3lame", "-q:a", "4", mp3_path],
        check=True,
        capture_output=True,
    )
    os.remove(wav_path)
    print("saved", mp3_path)


def intro():
    dur = 16.0
    buf = np.zeros(int(SR * dur))
    for i, c in enumerate([[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 48, 52]]):
        place(buf, pad(c, 4.6, 0.16), i * 4.0)
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    buf += 0.03 * np.sin(2 * np.pi * freq(81) * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.25 * t))
    return buf


def emotional():
    dur = 16.0
    buf = np.zeros(int(SR * dur))
    place(buf, pad([41, 48, 53], 8.6, 0.15), 0)
    place(buf, pad([43, 50, 55], 8.6, 0.15), 8.0)
    arp = [53, 57, 60, 65, 64, 60, 57, 53]
    for r in range(2):
        for i, n in enumerate(arp):
            place(buf, bell(n, 1.6, 0.32, 0.35), r * 8 + i * 0.95)
    return buf


def playful():
    dur = 12.0
    buf = np.zeros(int(SR * dur))
    mel = [72, 74, 76, 79, 81, 79, 76, 74, 72, 74, 76, 74, 72, 67, 69, 72]
    for i, n in enumerate(mel):
        place(buf, bell(n, 0.5, 0.38, 0.6, decay=0.35), i * 0.72)
    for i, n in enumerate([48, 43, 45, 43]):
        place(buf, bell(n - 12, 1.0, 0.3, 0.3, decay=0.6), i * 2.88)
    return buf


def celebration():
    dur = 10.0
    buf = np.zeros(int(SR * dur))
    place(buf, pad([48, 52, 55], 5.2, 0.14), 0)
    place(buf, pad([45, 48, 53], 5.2, 0.14), 5.0)
    for i, n in enumerate([60, 64, 67, 72, 76, 79, 84, 79, 76, 72]):
        place(buf, bell(n, 1.3, 0.34, 0.7), i * 0.5)
    return buf


def finale():
    dur = 18.0
    buf = np.zeros(int(SR * dur))
    place(buf, pad([45, 52, 57], 9.6, 0.16), 0)
    place(buf, pad([41, 48, 53], 9.6, 0.16), 9.0)
    for i, n in enumerate([69, 72, 76, 74, 72, 69, 67, 69]):
        place(buf, bell(n, 2.6, 0.3, 0.3), 0.6 + i * 2.15)
    return buf


def pop():
    dur = 0.22
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    return 0.7 * np.sin(2 * np.pi * (700 + 1800 * t) * t) * np.exp(-18 * t)


def wrong():
    dur = 0.6
    buf = np.zeros(int(SR * dur))
    place(buf, bell(67, 0.22, 0.4, 0.5, decay=0.16), 0.0)
    place(buf, bell(62, 0.3, 0.4, 0.5, decay=0.22), 0.24)
    return buf


if __name__ == "__main__":
    save("intro", intro())
    save("emotional", emotional())
    save("playful", playful())
    save("celebration", celebration())
    save("finale", finale())
    save("pop", pop())
    save("wrong", wrong())
    print("done")
