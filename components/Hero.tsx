import React, { useEffect, useMemo, useRef, useState } from "react";

import voiceover from "../assets/AES-andrew_aes-JaredBatsonVoiceover_Revision 2.wav";

const CAPTION_OFFSET_SECONDS = 0;

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

const WORDS = SCRIPT_TEXT.replace(/[:.,]/g, "").split(/\s+/);

const WORD_TIMES = [
  0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0,
  7.5, 8.0, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0,
  14.5, 15.0, 15.5, 16.0, 16.5, 17.0, 17.5, 18.0, 18.5, 19.0, 19.5, 19.7, 20.0,
  20.5, 21.0, 21.5, 22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0, 25.5, 26.0, 26.5,
  27.0, 27.5, 28.0, 28.5, 29.0, 29.5, 30.0, 30.5, 31.0, 31.5, 32.0, 32.5, 33.0,
  33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5, 37.0, 37.5, 38.0, 38.5, 39.0, 39.5,
  40.0, 42.0, 42.5, 43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5, 47.0, 47.5,
  48.0, 48.5, 49.0, 49.5, 50.0, 50.5, 51.0, 51.5, 52.0, 52.5, 53.0, 53.5, 54.0,
  54.5, 55.0, 55.5, 56.0, 56.5, 57.0, 57.5, 58.0, 58.5, 59.0, 59.5, 60.0, 60.5,
  61.0, 61.5, 62.0, 62.5, 63.0, 63.5, 64.0, 64.5, 65.0, 65.5, 66.0, 66.5, 67.0,
  67.5, 68.0, 68.5, 69.0, 69.5, 70.0, 70.5, 71.0, 71.5, 72.0, 72.5, 73.0, 73.5,
  74.0, 74.5, 75.0, 75.5, 76.0, 76.5, 77.0, 77.5, 78.0, 78.5, 79.0, 79.5, 80.0,
  80.5, 81.0, 81.5, 82.0, 82.5, 83.0, 83.5, 84.0, 84.5, 85.0, 85.5, 86.0, 86.5,
  87.0, 87.5, 88.0,
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
  {
    time: 19,
    text: "Asbestos is a serious health risk when disturbed.",
  },
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
  {
    time: 70,
    text: "From residential homes to large commercial sites, no job is too big or too small.",
  },
  {
    time: 77,
    text: "Book your asbestos inspection or removal quote today and make your property safe for the future.",
  },
  {
    time: 85,
    text: "Absolute Environmental Services: Safe, Certified, Trusted.",
  },
];

const splitWords = (text: string) => text.replace(/[:.,]/g, "").split(/\s+/);
const PHRASE_WORDS = PHRASES.map((phrase) => splitWords(phrase.text));
const PHRASE_RANGES = PHRASE_WORDS.reduce<{ start: number; end: number }[]>(
  (acc, words) => {
    const last = acc[acc.length - 1];
    const start = last ? last.end : 0;
    acc.push({ start, end: start + words.length });
    return acc;
  },
  [],
);

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

const Hero: React.FC = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const captionDisplayRef = useRef<HTMLSpanElement | null>(null);
  const captionMeasureRef = useRef<HTMLDivElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(1);
  const [captionSegments, setCaptionSegments] = useState<
    Array<{ start: number; end: number }>
  >([]);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<number | null>(null);
  const manualPauseRef = useRef(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [transitionIndex, setTransitionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeMediaRef = useRef(0);

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
    const heroSection = heroSectionRef.current;
    if (!heroSection || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(heroSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      } catch {
        // Autoplay might be blocked; user can start via button.
      }
    }, 500);

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handlePlay = () => {
      manualPauseRef.current = false;
      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
      setIsPlaying(true);
      setIsAudioActive(true);
    };
    const handlePause = () => {
      if (!manualPauseRef.current) {
        return;
      }
      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
      }
      pauseTimeoutRef.current = window.setTimeout(() => {
        setIsPlaying(false);
        setIsAudioActive(false);
        pauseTimeoutRef.current = null;
        manualPauseRef.current = false;
      }, 200);
    };
    const handleEnded = () => {
      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
      setIsPlaying(false);
      setIsAudioActive(false);
    };
    const handleVolumeChange = () => setIsMuted(audio.muted);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("volumechange", handleVolumeChange);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("volumechange", handleVolumeChange);
      window.clearTimeout(autoplayDelay);
      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tick = () => {
      setCurrentTime(audio.currentTime || 0);
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

  const adjustedTime = Math.max(0, currentTime - CAPTION_OFFSET_SECONDS);

  const activeWordIndex = useMemo(() => {
    let index = 0;
    for (let i = 1; i < WORD_TIMELINE.length; i += 1) {
      if (adjustedTime >= WORD_TIMELINE[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [adjustedTime]);

  const activePhrase = useMemo(() => {
    let index = 0;
    for (let i = 1; i < PHRASES.length; i += 1) {
      if (adjustedTime >= PHRASES[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return PHRASES[index];
  }, [adjustedTime]);

  const phraseIndex = useMemo(() => {
    let index = 0;
    for (let i = 1; i < PHRASES.length; i += 1) {
      if (adjustedTime >= PHRASES[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [adjustedTime]);

  const phraseWords = PHRASE_WORDS[phraseIndex] ?? [];
  const phraseRange = PHRASE_RANGES[phraseIndex] ?? { start: 0, end: 0 };
  const activeWordInPhrase = activeWordIndex - phraseRange.start;
  const safeActiveWordInPhrase = Math.max(0, activeWordInPhrase);
  const activeSegment = useMemo(() => {
    if (captionSegments.length === 0) {
      return { start: 0, end: phraseWords.length };
    }
    const matched =
      captionSegments.find(
        (segment) =>
          safeActiveWordInPhrase >= segment.start &&
          safeActiveWordInPhrase < segment.end,
      ) ?? captionSegments[0];
    if (!matched || matched.start >= phraseWords.length) {
      return { start: 0, end: phraseWords.length };
    }
    return {
      start: matched.start,
      end: Math.min(matched.end, phraseWords.length),
    };
  }, [captionSegments, phraseWords.length, safeActiveWordInPhrase]);
  const visibleWords = useMemo(
    () => phraseWords.slice(activeSegment.start, activeSegment.end),
    [phraseWords, activeSegment],
  );

  useEffect(() => {
    setCaptionSegments([]);
  }, [phraseWords]);

  useEffect(() => {
    const displayEl = captionDisplayRef.current;
    const measureEl = captionMeasureRef.current;
    if (!displayEl || !measureEl) return;

    const updateSegments = () => {
      const targetWidth = displayEl.getBoundingClientRect().width;
      if (targetWidth <= 0) return;
      measureEl.style.width = `${targetWidth}px`;
      measureEl.innerHTML = "";

      const fragment = document.createDocumentFragment();
      phraseWords.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word;
        span.dataset.index = String(index);
        span.className = "inline-block mr-2 word-smooth";
        fragment.appendChild(span);
      });
      measureEl.appendChild(fragment);

      const spans = Array.from(
        measureEl.querySelectorAll<HTMLSpanElement>("span"),
      );
      if (spans.length === 0) {
        setCaptionSegments([]);
        return;
      }

      let currentTop = spans[0].offsetTop;
      let line = 0;
      const lineNumbers = spans.map((span) => {
        if (Math.abs(span.offsetTop - currentTop) > 2) {
          line += 1;
          currentTop = span.offsetTop;
        }
        return line;
      });

      const nextSegments: Array<{ start: number; end: number }> = [];
      let start = 0;
      let startLine = lineNumbers[0] ?? 0;

      for (let i = 0; i < lineNumbers.length; i += 1) {
        if (lineNumbers[i] - startLine >= 4) {
          nextSegments.push({ start, end: i });
          start = i;
          startLine = lineNumbers[i];
        }
      }

      nextSegments.push({ start, end: lineNumbers.length });
      setCaptionSegments(nextSegments);
    };

    const rafId = window.requestAnimationFrame(updateSegments);
    const handleResize = () => updateSegments();
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [phraseWords]);

  const handleControlClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const audio = audioRef.current;
    if (!audio) return;

    const target = event.target as HTMLElement;
    const action = target.closest("[data-action]")?.getAttribute("data-action");

    if (action === "mute") {
      audio.muted = !audio.muted;
      setIsMuted(audio.muted);
      return;
    }

    if (audio.paused) {
      try {
        manualPauseRef.current = false;
        audio.muted = false;
        setIsMuted(false);
        await audio.play();
      } catch {
        // Autoplay might be blocked; user gesture is required.
      }
    } else {
      manualPauseRef.current = true;
      audio.pause();
    }
  };

  const handleVolumeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextVolume = Number(event.target.value);
    audio.volume = nextVolume;
    setVolume(nextVolume);
    if (nextVolume > 0 && audio.muted) {
      audio.muted = false;
      setIsMuted(false);
    }
  };

  return (
    <>
      <section
        ref={heroSectionRef}
        className="relative min-h-[90vh] md:h-screen flex items-center pt-0 md:pt-20 overflow-hidden bg-aes-navy"
      >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center md:block">
          <div className="relative w-full aspect-[4/9] md:aspect-auto md:h-full scale-[1.15] sm:scale-100">
            {mediaItems.length === 0 ? (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=2000")',
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            ) : (
              <>
                <div
                  className={`absolute inset-0 aes-media-layer ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {mediaItems[activeMediaIndex]?.isVideo ? (
                    <video
                      className="h-full w-full object-cover aes-media"
                      src={mediaItems[activeMediaIndex].src}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      className="h-full w-full object-cover aes-media"
                      src={mediaItems[activeMediaIndex]?.src}
                      alt="AES background"
                    />
                  )}
                </div>
                <div
                  className={`absolute inset-0 aes-media-layer ${
                    isTransitioning ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {mediaItems[transitionIndex]?.isVideo ? (
                    <video
                      className="h-full w-full object-cover aes-media"
                      src={mediaItems[transitionIndex].src}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      className="h-full w-full object-cover aes-media"
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
            background: isAudioActive
              ? "linear-gradient(to right, rgba(0,43,73,0.6), rgba(0,43,73,0.05))"
              : "linear-gradient(to right, rgba(0,43,73,1), rgba(0,43,73,0))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-aes-navy/30 via-transparent to-aes-navy/60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #002B49 0%, rgba(0, 43, 73, 0) 100%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-white w-full flex items-center justify-center sm:justify-start">
        <div className="max-w-4xl text-center sm:text-left relative">
          <div className="relative mb-4 md:mb-6 h-6 md:h-7 flex justify-center md:justify-start">
            <div
              className={`absolute inset-0 flex items-center justify-center md:justify-start gap-2 transition-all duration-500 ${
                isAudioActive
                  ? "opacity-0 scale-95 pointer-events-none"
                  : "opacity-100 scale-100"
              }`}
            >
              <div className="h-px w-8 md:w-12 bg-aes-cyan hidden sm:block" />
              {/* Mobile h3 above main title */}
              <span className="text-aes-cyan font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[9px] md:text-xs hidden sm:block">
                Hazardous Material Management Specialists
              </span>
            </div>
            <div
              className={`absolute inset-0 flex items-center justify-center md:justify-start transition-all duration-500 ${
                isAudioActive
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <button
                type="button"
                onClick={handleControlClick}
                className={`inline-flex items-center gap-2 border border-white/40 bg-white/5 rounded-full text-[10px] md:text-xs uppercase tracking-widest font-bold transition-all duration-300 hover:border-aes-cyan hover:text-aes-cyan px-4 py-2 opacity-100 sm:group`}
                aria-label={isPlaying ? "Pause voiceover" : "Play voiceover"}
                aria-pressed={isPlaying}
              >
                <span className="text-sm md:text-base">{isPlaying ? "II" : "▶"}</span>
                <span
                  data-action="mute"
                  className="ml-2 items-center rounded-full border border-white/40 px-2 py-0.5 text-[8px] md:text-[9px] tracking-widest"
                >
                  {isMuted ? "UNMUTE" : "MUTE"}
                </span>
              </button>
            </div>
          </div>

          <div className="relative min-h-[220px] md:min-h-[320px]">
            {/* Mobile h3 above main title */}
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black leading-[1.2] mb-5 md:mb-5 text-center sm:text-left">
              <span
                className={`absolute inset-x-0 bottom-0 md:inset-0 text-aes-cyan text-left transition-all duration-500 ${
                  isAudioActive
                    ? "opacity-0 scale-95 pointer-events-none"
                    : "opacity-100 scale-100"
                }`}
              >
                <span className="block sm:hidden w-full mb-[20px]">
                <div className="relative w-full flex items-center justify-between">
                  <h3 className="text-aes-cyan text-[9px] font-bold tracking-[0.2em] uppercase text-left">DO NOT HESITATE, CALL ME</h3>
                  <span className="absolute right-0">
                    <a
                      href="tel:0425257142"
                      className="bg-aes-cyan rounded-full px-3 py-1 flex items-center"
                      style={{ textDecoration: 'none' }}
                    >
                      <h3 className="text-white text-[11px] font-extrabold text-left">0425 257 142</h3>
                    </a>
                  </span>
                </div>
                </span>
              <span className="text-white">Absolute</span>
                <br />
                <span className="text-white">Environmental</span>
                <br />
                <span>Services Safe Certified Trusted</span>
              </span>
              <span
                ref={captionDisplayRef}
                className={`absolute inset-x-0 bottom-0 md:inset-0 text-aes-cyan text-2xl sm:text-3xl md:text-8xl text-center md:text-left transition-all duration-500 ${
                  isAudioActive
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {visibleWords.map((word, index) => {
                  const actualIndex = activeSegment.start + index;
                  return (
                    <span
                      key={`${word}-${actualIndex}`}
                      className={`inline-block mr-2 word-smooth ${
                        actualIndex === activeWordInPhrase
                          ? "text-white word-glow word-active"
                          : ""
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </span>
            </h1>
          </div>
          <div
            ref={captionMeasureRef}
            className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none text-3xl sm:text-4xl md:text-7xl font-black leading-[1.2]"
          />

          <div
            className={`mt-[5px] mb-5 md:mb-6 flex justify-start md:justify-start transition-all duration-500 ${
              isAudioActive ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <button
              type="button"
              onClick={handleControlClick}
              className={`inline-flex items-center gap-2 border border-white/40 bg-white/5 px-4 py-2 rounded-full text-[10px] md:text-xs uppercase tracking-widest font-bold transition-all duration-300 hover:border-aes-cyan hover:text-aes-cyan ${
                isPlaying ? "opacity-30 hover:opacity-100" : "opacity-100"
              }`}
              aria-label={isPlaying ? "Pause voiceover" : "Play voiceover"}
              aria-pressed={isPlaying}
            >
              <span className="text-sm md:text-base">
                {isPlaying ? "II" : "▶"}
              </span>
              <span>{isPlaying ? "PAUSE" : "Experience"}</span>
              <span
                data-action="mute"
                className="ml-2 inline-flex items-center rounded-full border border-white/40 px-2 py-0.5 text-[8px] md:text-[9px] tracking-widest"
              >
                {isMuted ? "UNMUTE" : "MUTE"}
              </span>
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  setShowVolume((prev) => !prev);
                }}
                className="ml-1 inline-flex items-center rounded-full border border-white/40 px-2 py-0.5 text-[8px] md:text-[9px] tracking-widest"
              >
                VOL
              </span>
              <span
                className={`overflow-hidden transition-all duration-200 ${
                  showVolume ? "w-24 opacity-100" : "w-0 opacity-0"
                }`}
                onClick={(event) => event.stopPropagation()}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeInput}
                  className="w-24 accent-aes-cyan"
                />
              </span>
            </button>
          </div>

          <div
            className={`transition-opacity duration-500 ${isAudioActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <p className="hidden md:block text-base sm:text-lg md:text-2xl text-slate-100 mb-5 md:mb-6 leading-relaxed max-w-2xl mx-auto md:mx-0 font-light">
              Providing safe, effective and efficient removal of asbestos and
              other hazardous materials for residential and commercial
              properties.
            </p>

            <div className="flex flex-row flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center md:justify-start">
              <button
                className="w-auto bg-aes-cyan hover:bg-white hover:border-[#00aeef] hover:text-[#00aeef] text-white px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-4 rounded font-bold text-[10px] sm:text-xs md:text-sm transition-all shadow-xl uppercase tracking-widest transform hover:-translate-y-1"
                onClick={() => {
                  const target = document.getElementById("contact");
                  if (target) {
                    target.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                type="button"
              >
                Book an inspection
              </button>
              <button
                className="w-auto bg-transparent border-2 border-white/30 hover:border-aes-cyan hover:text-aes-cyan text-white px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-4 rounded font-bold text-[10px] sm:text-xs md:text-sm transition-all transform hover:-translate-y-1 uppercase tracking-widest"
                onClick={() => {
                  const target = document.getElementById("services");
                  if (target) {
                    target.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                type="button"
              >
                Our Services
              </button>
            </div>

            <div className="mt-12 md:mt-20 flex flex-row flex-wrap justify-center md:justify-start items-center gap-4 sm:gap-6 md:gap-16">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-300 uppercase tracking-widest font-bold mb-1 md:mb-2">
                  Licensed
                </span>
                <span className="text-sm sm:text-base md:text-xl font-bold border-l-2 border-aes-cyan pl-3 md:pl-4">
                  Class A & B
                </span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-300 uppercase tracking-widest font-bold mb-1 md:mb-2">
                  Certified
                </span>
                <span className="text-sm sm:text-base md:text-xl font-bold border-l-2 border-aes-cyan pl-3 md:pl-4">
                  ISO Registered
                </span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-300 uppercase tracking-widest font-bold mb-1 md:mb-2">
                  Response
                </span>
                <span className="text-sm sm:text-base md:text-xl font-bold border-l-2 border-aes-cyan pl-3 md:pl-4">
                  Faster
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
        <audio ref={audioRef} src={voiceover} preload="metadata" autoPlay muted />
      </section>
      {hasScrolled && (
        <div className="fixed bottom-4 left-4 z-[70]">
          <button
            type="button"
            onClick={handleControlClick}
            className={`inline-flex items-center gap-2 border border-blue-600 bg-white px-4 py-2 rounded-full text-[10px] md:text-xs uppercase tracking-widest font-bold text-blue-600 transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 ${
              isPlaying ? "opacity-80 hover:opacity-100" : "opacity-100"
            }`}
            aria-label={isPlaying ? "Pause voiceover" : "Play voiceover"}
            aria-pressed={isPlaying}
          >
            <span className="text-sm md:text-base">
              {isPlaying ? "II" : "▶"}
            </span>
            <span>{isPlaying ? "PAUSE" : "Experience"}</span>
            <span
              data-action="mute"
              className="ml-2 inline-flex items-center rounded-full border border-white/40 px-2 py-0.5 text-[8px] md:text-[9px] tracking-widest"
            >
              {isMuted ? "UNMUTE" : "MUTE"}
            </span>
            <span
              onClick={(event) => {
                event.stopPropagation();
                setShowVolume((prev) => !prev);
              }}
              className="ml-1 inline-flex items-center rounded-full border border-white/40 px-2 py-0.5 text-[8px] md:text-[9px] tracking-widest"
            >
              VOL
            </span>
            <span
              className={`overflow-hidden transition-all duration-200 ${
                showVolume ? "w-24 opacity-100" : "w-0 opacity-0"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeInput}
                className="w-24 accent-aes-cyan"
              />
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default Hero;
