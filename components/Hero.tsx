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
    text: "Our licensed specialists handle every step, from site inspection and testing to removal, transport, and certified disposal.",
  },
  {
    time: 42,
    text: "With years of industry experience and the latest HEPA-filtered equipment, we guarantee safe, efficient results.",
  },
  {
    time: 52,
    text: "We work with homeowners, builders, and real estate professionals across New South Wales.",
  },
  {
    time: 62,
    text: "Our clients trust Absolute Environmental Services for responsive service and transparent pricing.",
  },
  {
    time: 70,
    text: "From residential homes to large commercial sites, no job is too big or too small.",
  },
  {
    time: 77,
    text: "Book your asbestos inspection or removal quote today and make your property safe.",
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

const Hero: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeMediaRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showFloatingControls, setShowFloatingControls] = useState(false);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [transitionIndex, setTransitionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [isCaptionMode, setIsCaptionMode] = useState(false);

  const [showDesktopFloatingVolume, setShowDesktopFloatingVolume] = useState(false);
  const [isDesktopAudioExpanded, setIsDesktopAudioExpanded] = useState(false);
  const [isDesktopCallExpanded, setIsDesktopCallExpanded] = useState(false);

  const [isMobileAudioExpanded, setIsMobileAudioExpanded] = useState(false);
  const [isMobileCallExpanded, setIsMobileCallExpanded] = useState(false);

  const [showCaptionVolume, setShowCaptionVolume] = useState(false);

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
    const handleScroll = () => {
      setShowFloatingControls(window.scrollY > 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMobileAudioExpanded(false);
        setIsMobileCallExpanded(false);
      } else {
        setIsDesktopAudioExpanded(false);
        setIsDesktopCallExpanded(false);
        setShowDesktopFloatingVolume(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    const handleLoadedMetadata = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setIsCaptionMode(false);
      audio.currentTime = 0;
      setShowCaptionVolume(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, [volume, isMuted]);

  const activeCaption = useMemo(() => {
    if (!isCaptionMode) return "";

    const adjustedTime = Math.max(0, currentTime + CAPTION_OFFSET_SECONDS);

    for (let i = PHRASES.length - 1; i >= 0; i -= 1) {
      if (adjustedTime >= PHRASES[i].time) {
        return PHRASES[i].text;
      }
    }

    return PHRASES[0]?.text ?? "";
  }, [currentTime, isCaptionMode]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    track("audio_play_pause_clicked", {
      section: "hero",
    });

    try {
      if (audio.paused) {
        setIsCaptionMode(true);
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    setIsCaptionMode(false);
    setShowDesktopFloatingVolume(false);
    setIsDesktopAudioExpanded(false);
    setIsMobileAudioExpanded(false);
    setShowCaptionVolume(false);
  };

  const handleMuteToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextVolume = Math.max(0, Math.min(1, value));
    audio.volume = nextVolume;
    setVolume(nextVolume);

    const shouldMute = nextVolume === 0;
    audio.muted = shouldMute;
    setIsMuted(shouldMute);
  };

  const handleCallNowClick = () => {
    track("hero_call_clicked", { section: "hero" });
    window.location.href = "tel:0425257142";
  };

  const handleBookInspectionClick = () => {
    const target =
      document.getElementById("contact") || document.getElementById("quote");

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.location.href = "#contact";
  };

  const handleMobileAudioMainButton = () => {
    if (!isMobileAudioExpanded) {
      setIsMobileAudioExpanded(true);
      return;
    }

    setIsMobileAudioExpanded(false);
  };

  const handleMobileCallMainButton = () => {
    setIsMobileCallExpanded((prev) => !prev);
  };

  const handleDesktopAudioMainButton = () => {
    if (!isDesktopAudioExpanded) {
      setIsDesktopAudioExpanded(true);
      return;
    }

    setIsDesktopAudioExpanded(false);
    setShowDesktopFloatingVolume(false);
  };

  const handleDesktopCallMainButton = () => {
    setIsDesktopCallExpanded((prev) => !prev);
  };

  return (
    <>
      <section
        id="top"
        className="relative w-full overflow-hidden bg-aes-navy"
        style={{
          minHeight: "max(620px, 100svh)",
        }}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0">
            {mediaItems.length === 0 ? (
              <div
                className="absolute inset-0 bg-center bg-cover origin-center scale-[1.22] sm:scale-[1.12] lg:scale-[1.06]"
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
                      className="h-full w-full object-cover scale-[1.55] sm:scale-[1.24]"
                      src={mediaItems[activeMediaIndex].src}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      className="h-full w-full object-cover scale-[1.55] sm:scale-[1.24]"
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
                      className="h-full w-full object-cover scale-[1.55] sm:scale-[1.24]"
                      src={mediaItems[transitionIndex].src}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      className="h-full w-full object-cover scale-[1.55] sm:scale-[1.24]"
                      src={mediaItems[transitionIndex]?.src}
                      alt="AES background"
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
                "linear-gradient(180deg, rgba(0,43,73,0.82) 0%, rgba(0,43,73,0.72) 35%, rgba(0,43,73,0.68) 100%)",
            }}
          />

          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,43,73,0.92) 0%, rgba(0,43,73,0.82) 34%, rgba(0,43,73,0.42) 68%, rgba(0,43,73,0.18) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 h-full">
          <div className="mx-auto flex min-h-[max(620px,100svh)] w-full max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="flex w-full items-center py-20 sm:py-24 lg:py-28">
              <div
                className={[
                  "w-full max-w-[58rem] text-center md:text-left transition-all duration-500",
                  isCaptionMode
                    ? "opacity-0 pointer-events-none translate-y-4"
                    : "opacity-100 translate-y-0",
                ].join(" ")}
              >
                <div className="inline-flex items-center justify-center self-start rounded-full border border-white/20 bg-white/8 px-3 py-2 backdrop-blur-md sm:px-4">
                  <span className="text-white text-[10px] sm:text-[11px] md:text-[12px] font-extrabold uppercase tracking-[0.16em] sm:tracking-[0.18em]">
                    24+ Years Experience • Sydney & NSW
                  </span>
                </div>

                <div className="mt-5 sm:mt-6 max-w-[46rem] mx-auto md:mx-0">
                  <p className="text-white/90 text-[11px] sm:text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.24em]">
                    Asbestos Removal - Inspections - Testing
                  </p>

                  <h1 className="mt-3 font-black tracking-tight leading-[0.92]">
                    <span className="block text-aes-cyan text-[clamp(2.25rem,11vw,5.8rem)]">
                      Safe Removal.
                    </span>
                    <span className="block mt-1 text-aes-cyan text-[clamp(1.95rem,9vw,4.4rem)]">
                      Clear Advice.
                    </span>
                    <span className="block mt-1 text-aes-cyan text-[clamp(1.95rem,9vw,4.4rem)]">
                      Fast Response.
                    </span>
                  </h1>

                  <p className="mt-5 sm:mt-6 max-w-[40rem] mx-auto md:mx-0 text-white/95 text-[14px] sm:text-[15px] md:text-[17px] leading-relaxed sm:leading-8">
                    Professional asbestos inspections and compliant removal for homes,
                    renovations and commercial properties across NSW.
                  </p>
                </div>

                <div className="mt-7 sm:mt-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center md:justify-start">
                  <button
                    onClick={handleBookInspectionClick}
                    className="w-full sm:w-auto rounded-full bg-white text-aes-navy px-6 py-3.5 sm:px-7 sm:py-3.5 font-extrabold text-[14px] sm:text-[15px] shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Book Inspection
                  </button>

                  <button
                    onClick={handleCallNowClick}
                    className="w-full sm:w-auto rounded-full border border-white/20 bg-white/5 text-white px-6 py-3.5 sm:px-7 sm:py-3.5 font-semibold text-[14px] sm:text-[15px] backdrop-blur-sm transition-colors duration-300 hover:bg-white/10"
                  >
                    Call 0425 257 142
                  </button>
                </div>

                <div className="mt-6 sm:mt-7 w-full max-w-[42rem] mx-auto md:mx-0">
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className="inline-flex items-center justify-center md:justify-start gap-2 text-white text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.16em] font-extrabold transition-colors duration-300 hover:text-[#00AEEF]"
                  >
                    <span>▶</span>
                    <span>Play Audio Overview</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={[
            "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4 sm:pb-7 md:pb-8 transition-all duration-500",
            isCaptionMode
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6",
          ].join(" ")}
        >
          <div className="pointer-events-auto w-full max-w-[56rem]">
            <div className="mx-auto flex flex-col items-center">
              <div
                className="w-full max-w-[50rem] rounded-[22px] px-4 py-3 sm:px-6 sm:py-5 shadow-[0_18px_55px_rgba(0,0,0,0.16)]"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <p className="text-center text-white text-[14px] sm:text-[18px] md:text-[20px] leading-relaxed font-medium">
                  {activeCaption}
                </p>
              </div>

              <div
                className="mt-2 w-full max-w-[22rem] sm:max-w-[38rem] rounded-full px-2 py-1.5 sm:px-3 sm:py-2.5 shadow-[0_10px_28px_rgba(0,0,0,0.12)]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className="rounded-full bg-white text-aes-navy px-2.5 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-[13px] font-semibold transition-transform duration-300 hover:scale-[1.03]"
                  >
                    {isPlaying ? "II" : "▶"}
                  </button>

                  <button
                    type="button"
                    onClick={handleStop}
                    className="rounded-full border border-white/10 bg-white/5 text-white px-2.5 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-[13px] font-medium transition-colors duration-300 hover:bg-white/10"
                  >
                    ■
                  </button>

                  <button
                    type="button"
                    onClick={handleMuteToggle}
                    className="rounded-full border border-white/10 bg-white/5 text-white px-2.5 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-[13px] font-medium transition-colors duration-300 hover:bg-white/10"
                  >
                    {isMuted ? "Unmute" : "Mute"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCaptionVolume((prev) => !prev)}
                    className="rounded-full border border-white/10 bg-white/5 text-white px-2.5 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-[13px] font-medium transition-colors duration-300 hover:bg-white/10"
                  >
                    Vol
                  </button>

                  <div
                    className={[
                      "overflow-hidden transition-all duration-300 ease-out",
                      showCaptionVolume
                        ? "max-w-[72px] sm:max-w-[140px] opacity-100"
                        : "max-w-0 opacity-0",
                    ].join(" ")}
                  >
                    <div className="flex items-center pl-1 sm:pl-2">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                        className="h-1 w-[56px] sm:w-[110px] cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <audio ref={audioRef} src={voiceover} preload="auto" />
      </section>

      {/* DESKTOP CALL */}
      <div
        className={[
          "hidden sm:block fixed left-4 bottom-4 z-50 transition-all duration-300",
          showFloatingControls
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          className="flex items-center overflow-hidden rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
          style={{
            background: "rgba(4,28,45,0.68)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <button
            type="button"
            onClick={handleDesktopCallMainButton}
            className="flex h-11 w-11 items-center justify-center text-white text-[14px] font-medium"
            aria-label="Expand call button"
          >
            {isDesktopCallExpanded ? "→" : "☎"}
          </button>

          <div
            className={[
              "overflow-hidden transition-all duration-300 ease-out",
              isDesktopCallExpanded
                ? "max-w-[148px] opacity-100"
                : "max-w-0 opacity-0",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={handleCallNowClick}
              className="whitespace-nowrap pr-4 text-white text-[12px] font-medium"
            >
              0425 257 142
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP AUDIO */}
      <div
        className={[
          "hidden sm:block fixed right-4 bottom-4 z-50 transition-all duration-300",
          showFloatingControls
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          className="flex items-center overflow-hidden rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
          style={{
            background: "rgba(4,28,45,0.68)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <button
            type="button"
            onClick={handleDesktopAudioMainButton}
            className={[
              "flex h-11 w-11 items-center justify-center font-semibold transition-all duration-300",
              isDesktopAudioExpanded
                ? "bg-transparent text-white text-[15px]"
                : "bg-white text-aes-navy text-[13px]",
            ].join(" ")}
            aria-label={isDesktopAudioExpanded ? "Collapse audio controls" : "Expand audio controls"}
          >
            {isDesktopAudioExpanded ? "→" : isPlaying ? "II" : "▶"}
          </button>

          <div
            className={[
              "flex items-center overflow-hidden transition-all duration-300 ease-out",
              isDesktopAudioExpanded
                ? "max-w-[340px] opacity-100 pr-2 gap-2"
                : "max-w-0 opacity-0 pr-0 gap-0",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={handlePlayPause}
              className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-aes-navy text-[12px] font-semibold"
            >
              {isPlaying ? "II" : "▶"}
            </button>

            <button
              type="button"
              onClick={handleMuteToggle}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-white text-[12px] font-medium"
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>

            <button
              type="button"
              onClick={handleStop}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-white text-[12px] font-medium"
            >
              ■
            </button>

            <button
              type="button"
              onClick={() => setShowDesktopFloatingVolume((prev) => !prev)}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-white text-[12px] font-medium"
            >
              Vol
            </button>

            <div
              className={[
                "overflow-hidden transition-all duration-300",
                showDesktopFloatingVolume
                  ? "max-w-[110px] opacity-100"
                  : "max-w-0 opacity-0",
              ].join(" ")}
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="h-1.5 w-[86px] cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE CALL */}
      <div
        className={[
          "sm:hidden fixed left-3 bottom-3 z-50 transition-all duration-300",
          showFloatingControls
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          className="flex items-center overflow-hidden rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
          style={{
            background: "rgba(4,28,45,0.68)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <button
            type="button"
            onClick={handleMobileCallMainButton}
            className="flex h-10 w-10 items-center justify-center text-white text-[13px] font-medium"
            aria-label="Show call number"
          >
            {isMobileCallExpanded ? "→" : "☎"}
          </button>

          <div
            className={[
              "overflow-hidden transition-all duration-300 ease-out",
              isMobileCallExpanded
                ? "max-w-[132px] opacity-100"
                : "max-w-0 opacity-0",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={handleCallNowClick}
              className="whitespace-nowrap pr-3 text-white text-[11px] font-medium"
            >
              0425 257 142
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE AUDIO */}
      <div
        className={[
          "sm:hidden fixed right-3 bottom-3 z-50 transition-all duration-300",
          showFloatingControls
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          className="flex items-center overflow-hidden rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
          style={{
            background: "rgba(4,28,45,0.68)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <button
            type="button"
            onClick={handleMobileAudioMainButton}
            className={[
              "flex h-10 w-10 items-center justify-center font-semibold transition-all duration-300",
              isMobileAudioExpanded
                ? "bg-transparent text-white text-[14px]"
                : "bg-white text-aes-navy text-[13px]",
            ].join(" ")}
            aria-label={isMobileAudioExpanded ? "Collapse audio controls" : "Expand audio controls"}
          >
            {isMobileAudioExpanded ? "→" : isPlaying ? "II" : "▶"}
          </button>

          <div
            className={[
              "flex items-center overflow-hidden transition-all duration-300 ease-out",
              isMobileAudioExpanded
                ? "max-w-[220px] opacity-100 pr-2 gap-1.5"
                : "max-w-0 opacity-0 pr-0 gap-0",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={handlePlayPause}
              className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-aes-navy text-[11px] font-semibold"
            >
              {isPlaying ? "II" : "▶"}
            </button>

            <button
              type="button"
              onClick={handleMuteToggle}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-white text-[11px] font-medium"
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>

            <button
              type="button"
              onClick={handleStop}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-white text-[11px] font-medium"
            >
              ■
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
