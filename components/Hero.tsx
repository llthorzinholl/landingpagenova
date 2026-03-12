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
    } catch {}
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

  const scrollToContact = () => {
    const target = document.getElementById("contact");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBookInspectionClick = () => {
    track("hero_cta_clicked", {
      source: "hero",
      cta_name: "book_an_inspection",
      page: "home",
    });
    window.dispatchEvent(new CustomEvent("openRequestQuote"));
    scrollToContact();
  };

  const handlePhotoCheckClick = () => {
    track("hero_cta_clicked", {
      source: "hero",
      cta_name: "photo_check",
      page: "home",
    });
    window.dispatchEvent(new CustomEvent("openVisualPreTest"));
    scrollToContact();
  };

  const sharedButtonWidth =
    "w-[170px] sm:w-[180px] md:w-[190px]";

  const ctaButtonClass = [
    "inline-flex items-center justify-center",
    sharedButtonWidth,
    "rounded-full",
    "bg-[#00aeef]/15 backdrop-blur-sm border border-white/20",
    "hover:bg-white hover:border-[#00aeef] hover:text-[#00aeef]",
    "text-white",
    "px-4 sm:px-5 py-2.5 sm:py-3",
    "font-extrabold text-[10px] sm:text-[11px] uppercase tracking-widest",
    "transition-all shadow-xl",
    "transform hover:-translate-y-1 active:translate-y-0",
  ].join(" ");

  const photoCheckButtonClass = [
    "inline-flex items-center justify-center",
    sharedButtonWidth,
    "rounded-full",
    "bg-white/10 backdrop-blur-sm border border-white/15",
    "hover:bg-white hover:border-[#00aeef] hover:text-[#00aeef]",
    "text-white",
    "px-4 sm:px-5 py-2.5 sm:py-3",
    "font-extrabold text-[10px] sm:text-[11px] uppercase tracking-widest",
    "transition-all shadow-xl",
    "transform hover:-translate-y-1 active:translate-y-0",
  ].join(" ");

  const controlButtonClass = [
    "relative z-[999] pointer-events-auto",
    "inline-flex items-center justify-center gap-2",
    sharedButtonWidth,
    "border border-white/35 bg-white/10 backdrop-blur-md",
    "rounded-full px-4 sm:px-5 py-2.5 sm:py-3",
    "text-[10px] sm:text-xs uppercase tracking-widest font-extrabold",
    "text-white",
    "transition-all duration-300 hover:border-aes-cyan",
    "shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
  ].join(" ");

  const ControlBar = () => (
    <div className="relative z-[999] pointer-events-auto">
      <button
        type="button"
        onClick={() => {
          void togglePlayPause("hero_main_play_button");
        }}
        className={controlButtonClass}
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
        id="top"
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
                "linear-gradient(to right, rgba(0,43,73,0.97) 0%, rgba(0,43,73,0.72) 30%, rgba(0,43,73,0.14) 70%, rgba(0,43,73,0.00) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,43,73,0.16) 0%, rgba(0,43,73,0.05) 50%, rgba(0,43,73,0.78) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 h-full">
          <div className="mx-auto flex h-full w-full max-w-6xl px-4 sm:px-6 lg:px-10">
            {!isAudioActive ? (
              <div className="w-full max-w-[55rem] min-w-0 flex flex-col justify-center">
                <div className="w-full text-left">
                  <div className="flex flex-col pt-[5.3rem] sm:pt-[6.2rem] md:pt-[6.8rem] pb-16 sm:pb-14">
                    <div className="w-full max-w-[47rem]">
                      <div className="flex flex-col gap-5 sm:gap-6">
                        <div className="w-full max-w-[20rem] sm:max-w-[21rem] rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.30)]">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-aes-cyan font-black leading-none text-[24px] sm:text-[28px]">
                                24+
                              </span>
                              <span className="text-white/95 font-extrabold tracking-wide text-[11px] sm:text-[12px] uppercase leading-none">
                                Years
                              </span>
                            </div>

                            <span className="h-6 w-px bg-white/15" />

                            <span className="text-white/85 font-medium text-[11px] sm:text-[12px] leading-tight">
                              Delivering safe & compliant asbestos removal across NSW
                            </span>
                          </div>
                        </div>

                        <div className="max-w-[48rem]">
                          <h1 className="font-black tracking-tight text-white break-words">
                            <span className="block text-white/80 text-[clamp(1rem,2.15vw,1.18rem)] leading-tight">
                              Licensed asbestos removal, inspections and make-safe solutions across Sydney and NSW.
                            </span>

                            <span className="block text-[clamp(2.3rem,5.4vw,5.1rem)] leading-[0.94] mt-2">
                              Worried About Asbestos?
                            </span>

                            <span className="block text-aes-cyan text-[clamp(1.65rem,4.15vw,3.9rem)] leading-[1.01] mt-2">
                              Book A Licensed <br /> Inspection Today.
                            </span>
                          </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-3">
                          <ControlBar />

                          <button
                            className={ctaButtonClass}
                            onClick={handleBookInspectionClick}
                            type="button"
                          >
                            Book Inspection
                          </button>

                          <button
                            className={photoCheckButtonClass}
                            onClick={handlePhotoCheckClick}
                            type="button"
                          >
                            Photo Check
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

                  <div className="flex max-w-full flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                    <button
                      className={ctaButtonClass}
                      onClick={handleBookInspectionClick}
                      type="button"
                    >
                      Book Inspection
                    </button>

                    <button
                      className={photoCheckButtonClass}
                      onClick={handlePhotoCheckClick}
                      type="button"
                    >
                      Photo Check
                    </button>
                  </div>
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