import React, { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import voiceover from "../assets/AES-andrew_aes-JaredBatsonVoiceover_Revision 2.wav";

const CAPTION_OFFSET_SECONDS = 0.15;

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

const mediaEntries = Object.entries(
  import.meta.glob("../assets/AES/*.{jpeg,jpg,png,mp4,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  })
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

        <button type="button" onClick={onStopReset} className={btnBase}>
          <span>Stop</span>
        </button>

        <button type="button" onClick={onToggleMute} className={btnBase}>
          <span>{isMuted ? "Unmute" : "Mute"}</span>
        </button>

        <button type="button" onClick={onToggleVolume} className={btnBase}>
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    audio.volume = 1;
    audio.preload = "auto";

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
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

  const resetCaptionTimeline = () => setCurrentTime(0);

  const startAudioAudible = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    if (audio.volume <= 0) audio.volume = 1;

    setIsMuted(false);
    setVolume(audio.volume);

    try {
      await audio.play();
      setIsAudioActive(true);
      setCurrentTime(audio.currentTime || 0);
    } catch {
      // ignore browser play restrictions
    }
  };

  const togglePlayPause = async (source: string = "hero_voiceover_button") => {
    const audio = audioRef.current;
    if (!audio) return;

    track("audio_play_pause_clicked", {
      source,
      page: "home",
      section: "hero",
      action: audio.paused ? "play" : "pause",
    });

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
    track("hero_cta_clicked", {
      source: "hero",
      cta_name: "book_inspection",
      page: "home",
    });

    window.dispatchEvent(new CustomEvent("openRequestQuote"));
  };

  const handleCallNowClick = () => {
    track("hero_cta_clicked", {
      source: "hero",
      cta_name: "call_now",
      page: "home",
    });

    window.location.href = "tel:0425257142";
  };

  const primaryButtonClass = [
    "inline-flex items-center justify-center gap-2",
    "rounded-full",
    "bg-white text-aes-navy",
    "border border-white",
    "px-5 sm:px-6 py-3 sm:py-3.5",
    "font-extrabold text-[11px] sm:text-[12px] uppercase tracking-[0.18em]",
    "transition-all duration-300",
    "shadow-[0_14px_35px_rgba(255,255,255,0.12)]",
    "hover:-translate-y-0.5 hover:bg-aes-cyan hover:border-aes-cyan",
    "active:translate-y-0",
    "min-w-[190px]",
  ].join(" ");

  const secondaryButtonClass = [
    "inline-flex items-center justify-center gap-2",
    "rounded-full",
    "bg-white/8 text-white backdrop-blur-md",
    "border border-white/18",
    "px-5 sm:px-6 py-3 sm:py-3.5",
    "font-extrabold text-[11px] sm:text-[12px] uppercase tracking-[0.18em]",
    "transition-all duration-300",
    "hover:-translate-y-0.5 hover:bg-white/14 hover:border-white/28",
    "active:translate-y-0",
    "min-w-[190px]",
  ].join(" ");

  const smallGhostButtonClass = [
    "inline-flex items-center justify-center gap-2",
    "rounded-full",
    "border border-white/14 bg-white/6 backdrop-blur-md",
    "px-4 py-2.5",
    "text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-extrabold text-white",
    "transition-all duration-300 hover:bg-white/10 hover:border-white/22",
  ].join(" ");

  return (
    <>
      <section
        id="top"
        ref={heroSectionRef}
        className="relative w-full overflow-hidden bg-aes-navy"
        style={{
          height: "min(92svh, clamp(560px, 52vw, 980px))",
        }}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0">
            {mediaItems.length === 0 ? (
              <div
                className="absolute inset-0 bg-center bg-cover origin-center scale-[1.42] sm:scale-[1.15]"
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
                      alt="Absolute Environmental Services background"
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
                      alt="Absolute Environmental Services background"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,43,73,0.90) 0%, rgba(0,43,73,0.76) 34%, rgba(0,43,73,0.38) 68%, rgba(0,43,73,0.18) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,43,73,0.22) 0%, rgba(0,43,73,0.12) 40%, rgba(0,43,73,0.72) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 h-full">
          <div className="mx-auto flex h-full w-full max-w-6xl px-4 sm:px-6 lg:px-10">
            {!isAudioActive ? (
              <div className="w-full max-w-[55rem] flex flex-col justify-center">
                <div className="inline-flex items-center self-start rounded-full border border-white/14 bg-white/8 px-4 py-2 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                  <span className="text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em]">
                    24+ Years Experience • Sydney & NSW
                  </span>
                </div>

                <div className="mt-6 max-w-[42rem]">
                  <p className="text-white text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.24em]">
                    Asbestos Removal - Inspections - Testing
                  </p>

                  <h1 className="mt-3 font-black tracking-tight leading-[0.95] drop-shadow-[0_6px_24px_rgba(0,0,0,0.4)]">
                    <span className="block text-[clamp(2.6rem,6vw,5.6rem)] text-aes-cyan">
                      Safe Removal.
                    </span>
                    <span className="block mt-1 text-[clamp(2.15rem,4.8vw,4.35rem)] text-aes-cyan">
                      Clear Advice.
                    </span>
                    <span className="block mt-1 text-[clamp(2.15rem,4.8vw,4.35rem)] text-aes-cyan">
                      Fast Response.
                    </span>
                  </h1>

                  <p className="mt-6 max-w-[38rem] text-white text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed font-medium">
                    Professional asbestos inspections, make-safe works and compliant removal
                    for homes, renovations and commercial properties across NSW.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <button
                    className={primaryButtonClass}
                    onClick={handleBookInspectionClick}
                    type="button"
                  >
                    <span>Book Inspection</span>
                  </button>

                  <button
                    className={secondaryButtonClass}
                    onClick={handleCallNowClick}
                    type="button"
                  >
                    <span>Call 0425 257 142</span>
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-white">
                  <span className="text-[12px] sm:text-[13px] uppercase tracking-[0.14em] font-bold">
                    Safe
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span className="text-[12px] sm:text-[13px] uppercase tracking-[0.14em] font-bold">
                    Compliant
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span className="text-[12px] sm:text-[13px] uppercase tracking-[0.14em] font-bold">
                    Residential & Commercial
                  </span>
                </div>

                <div className="mt-7 w-full max-w-[42rem]">
                  <button
                    type="button"
                    onClick={() => {
                      void togglePlayPause("hero_voiceover_button");
                    }}
                    className='inline-flex items-center gap-2 text-white text-[11px] uppercase tracking-[0.16em] font-extrabold transition-colors duration-300 hover:text-[#00AEEF]'
                    aria-label={isPlaying ? "Pause voiceover" : "Play voiceover"}
                    aria-pressed={isPlaying}
                  >
                    <span className="text-sm">{isPlaying ? "II" : "▶"}</span>
                    <span>{isPlaying ? "Pause Audio Overview" : "Play Audio Overview"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full items-end justify-center pb-8 sm:pb-10 md:pb-12">
                <div className="flex w-full max-w-[52rem] flex-col items-center justify-center gap-4 text-center">
                  {activePhraseText && (
                    <div className="w-full max-w-[44rem] rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl px-4 py-4 sm:px-5 sm:py-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
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
                </div>
              </div>
            )}
          </div>
        </div>

        <audio ref={audioRef} src={voiceover} preload="auto" />
      </section>

      {hasScrolled && (
        <div className="fixed bottom-4 left-4 z-[70] flex flex-col gap-2">
          <button
            type="button"
            onClick={handleCallNowClick}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white bg-white px-4 py-3 text-[10px] md:text-[11px] uppercase tracking-[0.16em] font-extrabold text-aes-navy shadow-[0_12px_30px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-aes-cyan hover:border-aes-cyan"
          >
            <span>Call 0425 257 142</span>
          </button>

          <button
            type="button"
            onClick={() => {
              void togglePlayPause("floating_play_button");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/92 px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.16em] font-extrabold text-aes-navy transition-all duration-300 hover:bg-white"
            aria-label={isPlaying ? "Pause voiceover" : "Play voiceover"}
            aria-pressed={isPlaying}
          >
            <span className="text-sm md:text-base">{isPlaying ? "II" : "▶"}</span>
            <span>{isPlaying ? "Pause Audio" : "Play Audio"}</span>

            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="ml-2 inline-flex items-center rounded-full border border-slate-300 px-2 py-0.5 text-[8px] md:text-[9px] tracking-[0.16em] cursor-pointer"
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
