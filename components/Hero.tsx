import React, { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import voiceover from "../assets/AES-andrew_aes-JaredBatsonVoiceover_Revision 2.wav";

/*
   Captions + Timing
*/

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

/*
   Background media
*/

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
    "select-none inline-flex items-center justify-center gap-2 rounded-full " +
    "border border-white/15 bg-white/10 text-white " +
    "px-3 sm:px-4 py-2 " +
    "text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest " +
    "transition hover:bg-white/15 hover:border-white/25 active:scale-[0.99]";

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex max-w-full flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={onTogglePlayPause}
          className={[btnBase, "border-aes-cyan/25 hover:border-aes-cyan/50"].join(" ")}
          aria-label={isPlaying ? "Pause voiceover" : "Play voiceover"}
          aria-pressed={isPlaying}
        >
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>

        <button
          type="button"
          onClick={onStopReset}
          className={btnBase}
          aria-label="Stop and reset"
        >
          <span>Stop</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          className={btnBase}
          aria-label={isMuted ? "Unmute voiceover" : "Mute voiceover"}
        >
          <span>{isMuted ? "Unmute" : "Mute"}</span>
        </button>

        <button
          type="button"
          onClick={onToggleVolume}
          className={btnBase}
          aria-label="Toggle volume slider"
          aria-expanded={showVolume}
        >
          <span>Vol</span>
        </button>
      </div>

      <div
        className={[
          "overflow-hidden transition-all duration-200 ease-out",
          showVolume ? "max-h-16 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-[180px] sm:w-[220px] accent-aes-cyan"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const activeMediaRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(1);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [transitionIndex, setTransitionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const resetCaptionTimeline = () => {
    setCurrentTime(0);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    audio.volume = 1;
    audio.preload = "auto";

    setIsMuted(true);
    setVolume(1);
    setIsPlaying(false);
    setCurrentTime(0);

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsAudioActive(false);
      setShowVolume(false);
      setCurrentTime(audio.duration || 0);
    };

    const handleVolumeChange = () => {
      setIsMuted(audio.muted);
      setVolume(audio.volume);
    };

    const handleLoadedMetadata = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("volumechange", handleVolumeChange);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("volumechange", handleVolumeChange);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
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
      setCurrentTime(audio.currentTime || 0);
    }

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isPlaying]);

  const adjustedTime = Math.max(0, currentTime - CAPTION_OFFSET_SECONDS);

  const phraseIndex = useMemo(() => {
    let idx = 0;
    for (let i = 1; i < PHRASES.length; i += 1) {
      if (adjustedTime >= PHRASES[i].time) idx = i;
      else break;
    }
    return idx;
  }, [adjustedTime]);

  const activePhraseText = PHRASES[phraseIndex]?.text ?? "";

  const startAudioAudible = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    if (audio.volume <= 0) {
      audio.volume = 1;
    }

    setIsMuted(false);
    setVolume(audio.volume);

    try {
      await audio.play();
      setIsAudioActive(true);
      setCurrentTime(audio.currentTime || 0);
    } catch {
      // browser may block in rare cases
    }
  };

  const togglePlayPause = async (source: string = "hero_main_play_button") => {
    const audio = audioRef.current;
    if (!audio) return;

    track("audio_play_pause_clicked", {
      source,
      page: "home",
      section: "hero",
      action: audio.paused ? "play" : "pause",
    });

    const isHeroButton = source === "hero_main_play_button";

    if (isHeroButton) {
      if (audio.ended || audio.currentTime >= (audio.duration || 0) - 0.01) {
        audio.currentTime = 0;
        resetCaptionTimeline();
      }

      await startAudioAudible();
      return;
    }

    if (audio.paused) {
      if (audio.ended || audio.currentTime >= (audio.duration || 0) - 0.01) {
        audio.currentTime = 0;
        resetCaptionTimeline();
      }

      await startAudioAudible();
    } else {
      audio.pause();
    }
  };

  const stopAndReset = () => {
    const audio = audioRef.current;
    if (!audio) return;

    track("audio_stop_clicked", {
      source: "hero_audio_controls",
      page: "home",
      section: "hero",
    });

    audio.pause();
    audio.currentTime = 0;
    resetCaptionTimeline();

    setIsAudioActive(false);
    setIsPlaying(false);
    setShowVolume(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    track("audio_mute_clicked", {
      source: hasScrolled ? "floating_audio_button" : "hero_audio_controls",
      page: "home",
      section: "hero",
      action: audio.muted ? "unmute" : "mute",
    });

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

  const handleBookInspectionClick = () => {
    track("cta_clicked", {
      source: "hero_book_inspection_button",
      cta_name: "book_an_inspection",
      page: "home",
      section: "hero",
    });

    const target = document.getElementById("contact");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const ControlBar = ({ className = "" }: { className?: string }) => (
    <div className={["relative z-[999] pointer-events-auto", className].join(" ")}>
      <button
        type="button"
        onClick={() => {
          void togglePlayPause("hero_main_play_button");
        }}
        className={[
          "relative z-[999] pointer-events-auto",
          "inline-flex flex-wrap items-center gap-2",
          "border border-white/35 bg-white/10 backdrop-blur-md",
          "rounded-full px-3 sm:px-4 py-2",
          "text-[10px] sm:text-xs uppercase tracking-widest font-extrabold",
          "text-white",
          "transition-all duration-300 hover:border-aes-cyan",
          "shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        ].join(" ")}
        aria-label="Play voiceover"
      >
        <span className="text-sm sm:text-base">▶</span>
        <span>PLAY</span>
      </button>
    </div>
  );

  return (
    <>
      <section
        ref={heroSectionRef}
        className="relative w-full overflow-hidden bg-aes-navy"
        style={{
          height: "min(92svh, clamp(560px, 52vw, 980px))",
        }}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-full w-full">
              {mediaItems.length === 0 ? (
                <div
                  className="absolute inset-0 bg-center bg-cover origin-center scale-[1.55] sm:scale-[1.24]"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=2000")',
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
                        className="h-full w-full object-cover origin-center scale-[1.55] sm:scale-[1.24]"
                        src={mediaItems[activeMediaIndex].src}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        className="h-full w-full object-cover origin-center scale-[1.55] sm:scale-[1.24]"
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
                        className="h-full w-full object-cover origin-center scale-[1.55] sm:scale-[1.24]"
                        src={mediaItems[transitionIndex].src}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        className="h-full w-full object-cover origin-center scale-[1.55] sm:scale-[1.24]"
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
                "linear-gradient(to right, rgba(0,43,73,0.97) 0%, rgba(0,43,73,0.70) 30%, rgba(0,43,73,0.12) 70%, rgba(0,43,73,0.00) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,43,73,0.14) 0%, rgba(0,43,73,0.05) 55%, rgba(0,43,73,0.72) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 h-full">
          <div className="mx-auto flex h-full w-full max-w-6xl px-4 sm:px-6 lg:px-10">
            {!isAudioActive ? (
              <div className="w-full max-w-[52rem] min-w-0 flex flex-col justify-center">
                <div className="w-full mx-auto sm:mx-0 text-left">
                  <div
                    className={[
                      "flex flex-col",
                      "gap-4 sm:gap-5 lg:gap-6",
                      "pt-3 sm:pt-8 md:pt-12",
                      "pb-16 sm:pb-12",
                      "mt-[3.25rem] sm:mt-[4.75rem] md:mt-[5.5rem]",
                    ].join(" ")}
                  >
                    <div className="w-full max-w-[42rem]">
                      <div className="flex flex-col gap-3 sm:gap-4">
                        <div
                          className={[
                            "w-full",
                            "rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md",
                            "px-4 py-2.5",
                            "shadow-[0_10px_30px_rgba(0,0,0,0.30)]",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-aes-cyan font-black leading-none text-[22px] sm:text-[26px]">
                                24+
                              </span>
                              <span className="text-white/95 font-extrabold tracking-wide text-[11px] sm:text-[12px] uppercase leading-none">
                                Years
                              </span>
                            </div>

                            <span className="h-5 w-px bg-white/15" />
                            <span className="text-white/85 font-medium text-[11px] sm:text-[12px] leading-tight">
                              Delivering safe & compliant asbestos removal across NSW
                            </span>
                          </div>
                        </div>

                        <div className="w-full">
                          <h1 className="font-black tracking-tight text-white break-words">
                            <span className="block text-white/80 text-[clamp(0.95rem,2.4vw,1.15rem)] leading-tight">
                              Safe asbestos removal for NSW homes.
                            </span>

                            <span className="block text-[clamp(1.85rem,4.8vw,4.6rem)] leading-[0.98] mt-1">
                              Worried About Asbestos?
                            </span>

                            <span className="block text-aes-cyan text-[clamp(1.35rem,3.8vw,3.6rem)] leading-[1.02]">
                              Book An <br /> Inspection Today.
                            </span>
                          </h1>
                        </div>

                        <div className="w-full flex flex-wrap items-center gap-2.5 sm:gap-3 justify-start">
                          <ControlBar />

                          <button
                            className={[
                              "inline-flex items-center justify-center",
                              "rounded-full",
                              "bg-[#00aeef]/15 backdrop-blur-sm border border-white/20",
                              "hover:bg-white hover:border-[#00aeef] hover:text-[#00aeef]",
                              "text-white",
                              "px-5 sm:px-6 md:px-7 py-2 sm:py-2.5",
                              "font-extrabold text-[10px] sm:text-[11px] uppercase tracking-widest",
                              "transition-all shadow-xl",
                              "transform hover:-translate-y-1 active:translate-y-0",
                            ].join(" ")}
                            onClick={handleBookInspectionClick}
                            type="button"
                          >
                            Book an inspection
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full items-end justify-center pb-8 sm:pb-10 md:pb-12">
                <div className="flex w-full max-w-[52rem] flex-col items-center justify-center gap-4 text-center">
                  {activePhraseText && (
                    <div className="w-full max-w-[44rem] rounded-2xl border border-white/15 bg-black/25 backdrop-blur-md px-4 py-4 sm:px-5 sm:py-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                      <p className="text-white text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed font-medium">
                        {activePhraseText}
                      </p>
                    </div>
                  )}

                  <CaptionControls
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    volume={volume}
                    showVolume={showVolume}
                    onTogglePlayPause={() => {
                      void togglePlayPause("hero_caption_controls");
                    }}
                    onStopReset={stopAndReset}
                    onToggleMute={toggleMute}
                    onToggleVolume={() => setShowVolume((prev) => !prev)}
                    onVolumeChange={onVolumeChange}
                  />

                  <button
                    className={[
                      "inline-flex items-center justify-center",
                      "rounded-full",
                      "bg-[#00aeef]/15 backdrop-blur-sm border border-white/20",
                      "hover:bg-white hover:border-[#00aeef] hover:text-[#00aeef]",
                      "text-white",
                      "px-5 sm:px-6 md:px-7 py-2 sm:py-2.5",
                      "font-extrabold text-[10px] sm:text-[11px] uppercase tracking-widest",
                      "transition-all shadow-xl",
                      "transform hover:-translate-y-1 active:translate-y-0",
                    ].join(" ")}
                    onClick={handleBookInspectionClick}
                    type="button"
                  >
                    Book an inspection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <audio ref={audioRef} src={voiceover} preload="auto" />
      </section>

      {hasScrolled && (
        <div className="fixed bottom-4 left-4 z-[70]">
          <button
            type="button"
            onClick={() => {
              void togglePlayPause("floating_play_button");
            }}
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