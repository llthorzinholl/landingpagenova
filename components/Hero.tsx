import React, { useEffect, useRef, useState } from "react";
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
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

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

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    track("audio_play_pause_clicked", {
      section: "hero",
    });

    try {
      if (audio.paused) {
        audio.muted = false;
        await audio.play();
        setIsPlaying(true);
        setIsAudioActive(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  };

  const handleCallNowClick = () => {
    window.location.href = "tel:0425257142";
  };

  const handleBookInspectionClick = () => {
    const target = document.getElementById("contact") || document.getElementById("quote");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.location.href = "#contact";
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
        {/* BACKGROUND */}
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

          {/* GRADIENT OVERLAY */}
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

        {/* CONTENT */}
        <div className="relative z-10 h-full">
          <div className="mx-auto flex min-h-[max(620px,100svh)] w-full max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="flex w-full items-center py-20 sm:py-24 lg:py-28">
              <div className="w-full max-w-[58rem] text-center md:text-left">
                <div className="inline-flex items-center justify-center self-start rounded-full border border-white/14 bg-white/8 px-3 py-2 backdrop-blur-md sm:px-4">
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

                {/* CTA */}
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

                {/* PLAY AUDIO */}
                <div className="mt-6 sm:mt-7 w-full max-w-[42rem] mx-auto md:mx-0">
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="inline-flex items-center justify-center md:justify-start gap-2 text-white text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.16em] font-extrabold transition-colors duration-300 hover:text-[#00AEEF]"
                  >
                    <span className="text-[12px] sm:text-[13px] leading-none">
                      {isPlaying ? "II" : "▶"}
                    </span>
                    <span>
                      {isPlaying ? "Pause Audio Overview" : "Play Audio Overview"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <audio ref={audioRef} src={voiceover} preload="auto" />
      </section>
    </>
  );
};

export default Hero;
