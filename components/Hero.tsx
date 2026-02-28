import React, { useEffect, useMemo, useRef, useState } from "react";

import voiceover from "../assets/AES-andrew_aes-JaredBatsonVoiceover_Revision 2.wav";

/* =============================================================================
   Captions + Timing (easy to find / tweak)
============================================================================= */

const CAPTION_OFFSET_SECONDS = 0.15;

const SCRIPT_TEXT =
  "Every house built before the year 2000 may contain asbestos, making safety and professional handling absolutely essential. " +
  "At Absolute Environmental Services, we make asbestos removal simple, safe, and fully compliant, so you can move forward with confidence. " +
  "Asbestos is a serious health risk when disturbed. " +
  "Whether you're renovating, demolishing, or buying an older property, professional removal is essential. " +
  "Our licensed specialists handle every step, from site inspection and testing to removal, transport, and certified disposal, following strict WorkSafe and EPA regulations. " +
  "With years of industry experience, fully accredited staff, and the latest HEPA-filtered equipment, we guarantee safe, efficient results on every project. " +
  "We work with homeowners, builders, and real estate professionals across New South Wales, delivering quality workmanship and total peace of mind. " +
  "Our clients trust Absolute Environmental Services for responsive service, transparent pricing, and proven compliance. " +
  "From residential homes to large commercial sites, no job is too big or too small. " +
  "Book your asbestos inspection or removal quote today and make your property safe for the future. " +
  "Absolute Environmental Services: Safe, Certified, Trusted.";

// Kept for future use (currently phrase-by-phrase)
const WORDS = SCRIPT_TEXT.replace(/[:.,]/g, "").split(/\s+/);
const WORD_TIMES = [
  0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0,
  7.5, 8.0, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0,
  14.5, 15.0, 15.5, 16.0, 16.5, 17.0, 17.5, 18.0, 18.5, 19.0, 19.5, 19.7, 20.0,
  20.5, 21.0, 21.5, 22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0, 25.5, 26.0, 26.5,
  27.0, 27.5, 28.0, 28.5, 29.0, 29.5, 30.0, 30.5, 31.0, 31.5, 32.0, 32.5, 33.0,
  33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5, 37.0, 37.5, 38.0, 38.5, 39.0, 39.5,
  40.0, 42.0, 42.5, 43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.5, 47.0, 47.5, 48.0,
  48.5, 49.0, 49.5, 50.0, 50.5, 51.0, 51.5, 52.0, 52.5, 53.0, 53.5, 54.0, 54.5,
  55.0, 55.5, 56.0, 56.5, 57.0, 57.5, 58.0, 58.5, 59.0, 59.5, 60.0, 60.5, 61.0,
  61.5, 62.0, 62.5, 63.0, 63.5, 64.0, 64.5, 65.0, 65.5, 66.0, 66.5, 67.0, 67.5,
  68.0, 68.5, 69.0, 69.5, 70.0, 70.5, 71.0, 71.5, 72.0, 72.5, 73.0, 73.5, 74.0,
  74.5, 75.0, 75.5, 76.0, 76.5, 77.0, 77.5, 78.0, 78.5, 79.0, 79.5, 80.0, 80.5,
  81.0, 81.5, 82.0, 82.5, 83.0, 83.5, 84.0, 84.5, 85.0, 85.5, 86.0, 86.5, 87.0,
  87.5, 88.0,
];

const WORD_TIMELINE = WORDS.map((word, index) => ({
  time: WORD_TIMES[index] ?? WORD_TIMES[WORD_TIMES.length - 1] ?? 0,
  word,
}));

const PHRASES = [
  {
    time: 0,
    text: "Every house built before the year 2000 may contain asbestos, making safety and professional handling absolutely essential.",
  },
  {
    time: 9,
    text: "At Absolute Environmental Services, we make asbestos removal simple, safe, and fully compliant, so you can move forward with confidence.",
  },
  { time: 19, text: "Asbestos is a serious health risk when disturbed." },
  {
    time: 22,
    text: "Whether you're renovating, demolishing, or buying an older property, professional removal is essential.",
  },
  {
    time: 29,
    text: "Our licensed specialists handle every step, from site inspection and testing to removal, transport, and certified disposal, following strict WorkSafe and EPA regulations.",
  },
  {
    time: 42,
    text: "With years of industry experience, fully accredited staff, and the latest HEPA-filtered equipment, we guarantee safe, efficient results on every project.",
  },
  {
    time: 52,
    text: "We work with homeowners, builders, and real estate professionals across New South Wales, delivering quality workmanship and total peace of mind.",
  },
  {
    time: 62,
    text: "Our clients trust Absolute Environmental Services for responsive service, transparent pricing, and proven compliance.",
  },
  { time: 70, text: "From residential homes to large commercial sites, no job is too big or too small." },
  { time: 77, text: "Book your asbestos inspection or removal quote today and make your property safe for the future." },
  { time: 85, text: "Absolute Environmental Services: Safe, Certified, Trusted." },
];

/* =============================================================================
   Background media (images/videos)
============================================================================= */

const mediaEntries = Object.entries(
  import.meta.glob("../assets/AES/*.{jpeg,jpg,png,mp4,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
) as Array<[string, string]>;

const mediaItems = mediaEntries
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => ({
    src,
    isVideo: path.toLowerCase().endsWith(".mp4"),
  }));

/* =============================================================================
   UI Components (Caption Controls)
============================================================================= */

type CaptionControlsProps = {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  showVolume: boolean;
  onTogglePlayPause: () => void;
  onStopReset: () => void;
  onToggleMute: () => void;
  onToggleVolume: () => void;
  onVolumeChange: (v: number) => void;
};

const CaptionControls: React.FC<CaptionControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  showVolume,
  onTogglePlayPause,
  onStopReset,
  onToggleMute,
  onToggleVolume,
  onVolumeChange,
}) => {
  const btnBase =
    "select-none inline-flex items-center gap-2 rounded-lg " +
    "border border-white/15 bg-white/10 text-white " +
    "px-2.5 sm:px-3 py-1.5 sm:py-2 " +
    "text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest " +
    "transition hover:bg-white/15 hover:border-white/25 active:scale-[0.99]";

  const iconBox =
    "inline-flex items-center justify-center w-7 h-7 sm:w-[30px] sm:h-[30px] " +
    "rounded-md bg-white/10 border border-white/10";

  return (
    <div className="max-w-full">
      {/* One single container */}
      <div
        className={[
          "inline-flex max-w-full flex-wrap items-center gap-2 sm:gap-2.5",
          "rounded-xl border border-white/10 bg-white/8 backdrop-blur-md",
          "px-2.5 sm:px-3 py-2",
          "shadow-[0_10px_30px_rgba(0,0,0,0.30)]",
        ].join(" ")}
      >
        {/* Play / Pause */}
        <button
          type="button"
          onClick={onTogglePlayPause}
          className={[
            btnBase,
            "border-aes-cyan/25 hover:border-aes-cyan/50",
            "flex-1 sm:flex-none",
          ].join(" ")}
          aria-label={isPlaying ? "Pause voiceover" : "Play voiceover"}
          aria-pressed={isPlaying}
        >
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>

        {/* Stop (only this one changes the hero back to normal) */}
        <button
          type="button"
          onClick={onStopReset}
          className={[btnBase, "flex-1 sm:flex-none"].join(" ")}
          aria-label="Stop and reset"
        >
          <span>Stop</span>
        </button>

        {/* Mute */}
        <button
          type="button"
          onClick={onToggleMute}
          className={[btnBase, "flex-1 sm:flex-none"].join(" ")}
          aria-label={isMuted ? "Unmute voiceover" : "Mute voiceover"}
        >
          <span>{isMuted ? "Unmute" : "Mute"}</span>
        </button>

        {/* Volume toggle */}
        <button
          type="button"
          onClick={onToggleVolume}
          className={[btnBase, "flex-1 sm:flex-none"].join(" ")}
          aria-label="Toggle volume slider"
          aria-expanded={showVolume}
        >
          <span>Vol</span>
        </button>

        {/* ✅ Volume expands (horizontal) and reveals slider */}
        <div
          className={[
            "overflow-hidden transition-all duration-200 ease-out",
            // On mobile it can wrap down; on desktop it expands to the right
            "basis-full sm:basis-auto",
            showVolume ? "max-h-16 opacity-100" : "max-h-0 opacity-0",
            "sm:max-h-none",
            showVolume ? "sm:w-[190px] sm:opacity-100" : "sm:w-0 sm:opacity-0",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mt-2 sm:mt-0 sm:ml-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-full sm:w-[170px] accent-aes-cyan"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* =============================================================================
   Hero
============================================================================= */

const Hero: React.FC = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Caption timeline refs
  const lastPhraseIndexRef = useRef(0);
  const smoothedTimeRef = useRef(0);

  // UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(1);
  const [hasScrolled, setHasScrolled] = useState(false);

  // RAF smoothing
  const rafIdRef = useRef<number | null>(null);

  // Background slideshow
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [transitionIndex, setTransitionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeMediaRef = useRef(0);

  const [smoothTime, setSmoothTime] = useState(0);

  useEffect(() => {
    activeMediaRef.current = activeMediaIndex;
  }, [activeMediaIndex]);

  useEffect(() => {
    if (mediaItems.length <= 1) return;

    const interval = window.setInterval(() => {
      const next = (activeMediaRef.current + 1) % mediaItems.length;
      setTransitionIndex(next);
      setIsTransitioning(true);
    }, 7000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isTransitioning) return;

    const timeout = window.setTimeout(() => {
      setActiveMediaIndex(transitionIndex);
      setIsTransitioning(false);
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [isTransitioning, transitionIndex]);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =============================================================================
     Audio wiring
     ✅ PAUSE keeps caption visible (isAudioActive stays true)
     ✅ STOP is the only action that returns hero to normal (sets isAudioActive false)
============================================================================= */

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    setIsMuted(true);
    setVolume(audio.volume ?? 1);

    const autoplayDelay = window.setTimeout(async () => {
      try {
        await audio.play();
        audio.muted = false;
        setIsMuted(false);
        setIsAudioActive(true);
      } catch {
        // autoplay blocked; user can press Play
      }
    }, 500);

    const handlePlay = () => {
      setIsPlaying(true);
      setIsAudioActive(true);
    };

    const handlePause = () => {
      // ✅ keep caption visible; only pause audio
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsAudioActive(false);
    };

    const handleVolumeChange = () => setIsMuted(audio.muted);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("volumechange", handleVolumeChange);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("volumechange", handleVolumeChange);
      window.clearTimeout(autoplayDelay);
    };
  }, []);

  /* =============================================================================
     Smooth currentTime via RAF
============================================================================= */

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tick = () => {
      const t = audio.currentTime || 0;
      const alpha = 0.22;

      smoothedTimeRef.current = smoothedTimeRef.current + alpha * (t - smoothedTimeRef.current);
      setSmoothTime(smoothedTimeRef.current);

      rafIdRef.current = window.requestAnimationFrame(tick);
    };

    if (isPlaying) {
      rafIdRef.current = window.requestAnimationFrame(tick);
    } else if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isPlaying]);

  const adjustedTime = Math.max(0, smoothTime - CAPTION_OFFSET_SECONDS);

  const phraseIndex = useMemo(() => {
    let idx = 0;

    for (let i = 1; i < PHRASES.length; i += 1) {
      if (adjustedTime >= PHRASES[i].time) idx = i;
      else break;
    }

    // prevents going backwards due to smoothing jitter
    const last = lastPhraseIndexRef.current;
    const finalIdx = Math.max(last, idx);
    lastPhraseIndexRef.current = finalIdx;

    return finalIdx;
  }, [adjustedTime]);

  const activePhraseText = PHRASES[phraseIndex]?.text ?? "";

  /* =============================================================================
     Actions
============================================================================= */

  const resetCaptionTimeline = () => {
    lastPhraseIndexRef.current = 0;
    smoothedTimeRef.current = 0;
    setSmoothTime(0);
  };

  // ✅ Play/Pause toggle:
  // - If paused => resumes from where paused (caption stays)
  // - If ended => restart + reset captions
  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsAudioActive(true);

    if (audio.paused) {
      if (audio.ended || audio.currentTime >= (audio.duration || 0) - 0.01) {
        resetCaptionTimeline();
        audio.currentTime = 0;
      }

      if (audio.volume > 0 && audio.muted) {
        audio.muted = false;
        setIsMuted(false);
      }

      try {
        await audio.play();
      } catch {
        // user gesture required
      }
    } else {
      audio.pause();
    }
  };

  // ✅ STOP: pause + reset + back to hero normal state
  const stopAndReset = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    resetCaptionTimeline();
    audio.currentTime = 0;

    // ✅ only STOP changes hero layout back
    setIsAudioActive(false);
    setIsPlaying(false);
    setShowVolume(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const onVolumeChange = (nextVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = nextVolume;
    setVolume(nextVolume);

    if (nextVolume > 0 && audio.muted) {
      audio.muted = false;
      setIsMuted(false);
    }
  };

  /* =============================================================================
     Main Hero ControlBar (top area)
============================================================================= */

  const ControlBar = ({ className = "" }: { className?: string }) => (
    <div className={["relative z-[999] pointer-events-auto", className].join(" ")}>
      <button
        type="button"
        onClick={togglePlayPause}
        className={[
          "relative z-[999] pointer-events-auto",
          "inline-flex flex-wrap items-center gap-2",
          "border border-white/40 bg-white/10 backdrop-blur-md",
          "rounded-full px-4 py-2",
          "text-[10px] sm:text-xs uppercase tracking-widest font-bold",
          "text-white",
          "transition-all duration-300 hover:border-aes-cyan",
          "shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        ].join(" ")}
        aria-label={isPlaying ? "Pause voiceover" : "Play voiceover"}
        aria-pressed={isPlaying}
      >
        <span className="text-sm sm:text-base">{isPlaying ? "II" : "▶"}</span>
        <span className="text-lg">{isPlaying ? "PAUSE" : "PLAY"}</span>

        <span
          className={`overflow-hidden transition-all duration-200 ${showVolume ? "w-24 opacity-100" : "w-0 opacity-0"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-24 accent-aes-cyan"
          />
        </span>
      </button>
    </div>
  );

  return (
    <>
      <section
        ref={heroSectionRef}
        className="relative w-full overflow-hidden bg-aes-navy"
        style={{ height: "min(100svh, clamp(680px, 56.25vw, 1080px))" }}
        aria-labelledby="hero-heading"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-full w-full">
              {mediaItems.length === 0 ? (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=2000")',
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    transform: "scale(1.28)",
                  }}
                />
              ) : (
                <>
                  <div
                    className={`absolute inset-0 transition-opacity duration-[1200ms] ${
                      isTransitioning ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {mediaItems[activeMediaIndex]?.isVideo ? (
                      <video
                        className="h-full w-full object-cover"
                        style={{ transform: "scale(1.28)" }}
                        src={mediaItems[activeMediaIndex].src}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        className="h-full w-full object-cover"
                        style={{ transform: "scale(1.28)" }}
                        src={mediaItems[activeMediaIndex]?.src}
                        alt="AES background"
                      />
                    )}
                  </div>

                  <div
                    className={`absolute inset-0 transition-opacity duration-[1200ms] ${
                      isTransitioning ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {mediaItems[transitionIndex]?.isVideo ? (
                      <video
                        className="h-full w-full object-cover"
                        style={{ transform: "scale(1.28)" }}
                        src={mediaItems[transitionIndex].src}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        className="h-full w-full object-cover"
                        style={{ transform: "scale(1.28)" }}
                        src={mediaItems[transitionIndex]?.src}
                        alt="AES background"
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,43,73,0.97) 0%, rgba(0,43,73,0.72) 28%, rgba(0,43,73,0.18) 68%, rgba(0,43,73,0.02) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,43,73,0.18) 0%, rgba(0,43,73,0.05) 45%, rgba(0,43,73,0.65) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full">
          <div className="mx-auto h-full w-full max-w-6xl px-4 sm:px-6 lg:px-10">
            <div className="h-full w-full max-w-[56rem] min-w-0 text-left flex flex-col justify-center">
              <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 pt-6 sm:pt-8 md:pt-14 pb-10 sm:pb-12 mt-[4rem] sm:mt-[5rem] md:mt-[6rem]">
                {!isAudioActive && (
                  <h3 className="hidden sm:flex items-center justify-start gap-3 mb-[-1.20rem]">
                    <div className="h-px w-10 bg-aes-cyan" />
                    <span className="text-aes-cyan font-bold tracking-[0.25em] uppercase text-[clamp(0.55rem,0.8vw,0.75rem)]">
                      Hazardous Material Management Specialists
                    </span>
                  </h3>
                )}

                {!isAudioActive && (
                  <>
                    <div className="sm:hidden mb-3 flex items-center justify-between gap-3">
                      <span className="text-aes-cyan text-[10px] font-bold tracking-[0.2em] uppercase">
                        DO NOT HESITATE, CALL ME
                      </span>
                      <a
                        href="tel:0425257142"
                        className="bg-aes-cyan rounded-full px-3 py-1 flex items-center shrink-0"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="text-white text-[11px] font-black">0425 257 142</span>
                      </a>
                    </div>

                    <h1 id="hero-heading" className="font-black tracking-tight leading-[0.95] text-white break-words">
                      <span className="block text-[clamp(2.4rem,4.3vw,5.6rem)]">24+ Years</span>
                      <span className="block text-[clamp(2.4rem,4.3vw,5.6rem)]">Of Experience</span>
                      <span className="block text-aes-cyan text-[clamp(2.2rem,3.9vw,5.2rem)]">
                        Making Your <br /> Life Safer
                      </span>
                    </h1>

                    <div className="mb-[1rem] mt-[-1rem] flex justify-start">
                      <ControlBar />
                    </div>
                  </>
                )}

                <div
                  className={`transition-opacity duration-500 ${
                    isAudioActive ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <p className="text-slate-100 font-light leading-relaxed max-w-[42rem] text-[clamp(1rem,1.2vw,1rem)] mt-[-1rem] mb-[-1rem]">
                    Providing safe, effective and efficient removal of asbestos and other hazardous materials for residential and commercial properties in Sydney and New South Wales.
                  </p>
                </div>

                <div
                  className={`transition-opacity duration-500 ${
                    isAudioActive ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <div className="flex flex-wrap gap-3 sm:gap-4 justify-start">
                    <a
                      href="#contact"
                      className="w-full sm:w-auto bg-[#00aeef]/15 backdrop-blur-sm border border-white/20 hover:bg-white hover:border-[#00aeef] hover:text-[#00aeef] text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-xs md:text-sm transition-all shadow-xl uppercase tracking-widest transform hover:-translate-y-1"
                    >
                      Book an inspectio
                    </a>

                    <a
                      href="#services"
                      className="w-full sm:w-auto bg-transparent border-2 border-white/30 hover:border-aes-cyan hover:text-aes-cyan text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-xs md:text-sm transition-all transform hover:-translate-y-1 uppercase tracking-widest"
                    >
                      Our Services
                    </a>
                  </div>
                </div>

                <audio ref={audioRef} src={voiceover} preload="metadata" autoPlay muted />
              </div>
            </div>
          </div>

          {/* Caption container anchored bottom */}
          {isAudioActive && (
            <div className="absolute inset-x-0 bottom-0 z-20">
              <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 pb-6 sm:pb-8">
                <div className="relative w-full rounded-2xl border border-white/10 bg-white/6 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.42)] px-4 sm:px-5 md:px-7 py-6 sm:py-7 md:py-8 pointer-events-auto">
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 w-10 rounded-l-2xl"
                    style={{
                      background: "linear-gradient(to right, rgba(0,43,73,0.78), rgba(0,43,73,0))",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 w-10 rounded-r-2xl"
                    style={{
                      background: "linear-gradient(to left, rgba(0,43,73,0.68), rgba(0,43,73,0))",
                    }}
                  />

                  <div className="w-full overflow-hidden">
                    <span
                      className={[
                        "inline-block",
                        "whitespace-normal break-words",
                        "text-white/95",
                        "font-semibold tracking-[0.01em] leading-[1.25]",
                        "text-[clamp(0.95rem,1.8vw,1.55rem)]",
                        "bg-white/19 border border-white/10 rounded-xl px-3 py-2",
                      ].join(" ")}
                    >
                      {activePhraseText}
                    </span>
                  </div>

                  <div className="mt-4 sm:mt-5 flex justify-center">
                    <CaptionControls
                      isPlaying={isPlaying}
                      isMuted={isMuted}
                      volume={volume}
                      showVolume={showVolume}
                      onTogglePlayPause={togglePlayPause}
                      onStopReset={stopAndReset}
                      onToggleMute={toggleMute}
                      onToggleVolume={() => setShowVolume((prev) => !prev)}
                      onVolumeChange={onVolumeChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {hasScrolled && (
        <div className="fixed bottom-4 left-4 z-[70]">
          <button
            type="button"
            onClick={togglePlayPause}
            className="inline-flex items-center gap-2 border border-blue-600 bg-white px-4 py-2 rounded-full text-[10px] md:text-xs uppercase tracking-widest font-bold text-blue-600 transition-all duration-300 hover:bg-blue-50 hover:text-blue-700"
            aria-label={isPlaying ? "Pause voiceover" : "Play voiceover"}
            aria-pressed={isPlaying}
          >
            <span className="text-sm md:text-base">{isPlaying ? "II" : "▶"}</span>
            <span>{isPlaying ? "Pause" : "Play"}</span>

            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="ml-2 inline-flex items-center rounded-full border border-blue-200 px-2 py-0.5 text-[8px] md:text-[9px] tracking-widest cursor-pointer"
            >
              {isMuted ? "UNMUTE" : "MUTE"}
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default Hero;
