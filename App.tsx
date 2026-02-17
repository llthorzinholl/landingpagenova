import React, { useEffect, useRef, useState } from "react";
import logo from "./assets/novasImgs/logo.webp";
import Header from "./components/Header";
import CookieConsent from "./components/CookieConsent";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";
import { TESTIMONIALS } from "./constants";


const VIMEO_EMBED_URL =
  "https://player.vimeo.com/video/1146343746?autoplay=1&muted=1&loop=1&background=1&title=0&byline=0&portrait=0";

// Placeholder para o vídeo
const VIMEO_THUMB = "../assets/novasImgs/1.webp";


const aboutPortfolioEntries = Object.entries(
  import.meta.glob("./assets/AES/*.{jpeg,jpg,png,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
) as Array<[string, string]>;
// Removido carregamento de arquivos de áudio inexistentes para evitar erros de rede

const aboutPortfolioItems = aboutPortfolioEntries
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src], index) => {
    const pairNumber = Math.floor(index / 2) + 1;
    const isBefore = index % 2 === 0;
    return {
      src,
      alt: path.split("/").pop() ?? "AES portfolio",
      title: `${isBefore ? "Before" : "After"} ${pairNumber}`,
      subtitle: isBefore
        ? "Site condition before remediation."
        : "Result after safe removal and cleanup.",
    };
  });

const aboutPortfolioPairs = aboutPortfolioItems.reduce<
  Array<{
    pairNumber: number;
    before: (typeof aboutPortfolioItems)[number];
    after?: (typeof aboutPortfolioItems)[number];
  }>
>((acc, item, index) => {
  if (index % 2 === 0) {
    acc.push({ pairNumber: Math.floor(index / 2) + 1, before: item });
  } else {
    acc[acc.length - 1].after = item;
  }
  return acc;
}, []);

const SAFETY_VIDEO_THUMB_TIME = 56.3;

const App: React.FC = () => {
  const safetyVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isSafetyVideoPlaying, setIsSafetyVideoPlaying] = useState(false);
  const [selectedService, setSelectedService] = useState(
    "External Asbestos Removal",
  );

  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  // Lazy load do vídeo Vimeo
  const [vimeoLoaded, setVimeoLoaded] = useState(false);

  useEffect(() => {
    const video = safetyVideoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      video.currentTime = SAFETY_VIDEO_THUMB_TIME;
      video.pause();
    };

    const handlePlay = () => setIsSafetyVideoPlaying(true);
    const handlePause = () => {
      setIsSafetyVideoPlaying(false);
      if (!video.ended) {
        video.currentTime = SAFETY_VIDEO_THUMB_TIME;
      }
    };
    const handleEnded = () => {
      setIsSafetyVideoPlaying(false);
      video.currentTime = SAFETY_VIDEO_THUMB_TIME;
      video.pause();
      // Não faz nada relacionado à opacidade
    };

    video.muted = true;
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSafetyVideoEnter = async () => {
    const video = safetyVideoRef.current;
    if (!video) return;

    if (!video.paused) return;

    video.muted = true;
    video.currentTime = 0;

    try {
      await video.play();
    } catch {
      // Autoplay might be blocked; hover intent still sets the start frame.
    }
  };

  return (
    <div className="min-h-screen">
      <CookieConsent />
      <Header />

      <main>
        <Hero />

        {/* Core Values Row */}
        <section className="bg-slate-50 py-12 md:py-20 border-b border-slate-200">
          <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div
              data-reveal
              className="reveal-item flex flex-col items-center text-center p-4"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-aes-navy text-white rounded-full flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 shadow-lg shadow-aes-navy/20">
                🛡️
              </div>
              <h4 className="text-lg md:text-xl font-bold text-aes-navy mb-2 md:mb-3">
                Safety First
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                Our primary objective is the health and safety of our clients,
                the public, and our technicians.
              </p>
            </div>
            <div
              data-reveal
              className="reveal-item flex flex-col items-center text-center p-4"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-aes-cyan text-white rounded-full flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 shadow-lg shadow-aes-cyan/20">
                📋
              </div>
              <h4 className="text-lg md:text-xl font-bold text-aes-navy mb-2 md:mb-3">
                Full Compliance
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                Operating under strict ISO certifications and fully licensed by
                SafeWork NSW for high-risk remediation.
              </p>
            </div>
            <div
              data-reveal
              className="reveal-item flex flex-col items-center text-center p-4 sm:col-span-2 md:col-span-1"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-aes-navy text-white rounded-full flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 shadow-lg shadow-aes-navy/20">
                🌍
              </div>
              <h4 className="text-lg md:text-xl font-bold text-aes-navy mb-2 md:mb-3">
                Eco Responsible
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                Dedicated to environmentally sustainable waste disposal and
                reducing remediation footprints.
              </p>
            </div>
          </div>
        </section>

        <ServicesSection onSelectService={setSelectedService} />

        {/* Corporate Profile Section */}
        <section
          id="about"
          className="py-16 md:py-24 bg-aes-navy text-white overflow-hidden relative"
        >
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div
              data-reveal
              className="reveal-item relative z-10 text-center lg:text-left"
            >
              <h2 className="text-aes-cyan font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-4">
                About the Company
              </h2>
              <h3 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 leading-tight">
                Expert Management of <br className="hidden md:block" />{" "}
                Hazardous Materials.
              </h3>
              <p className="text-slate-300 mb-8 text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Absolute Environmental Services (AES) is a market leader in the
                provision of hazardous material removal and environmental
                remediation services. Based in Sydney, we provide tailored
                solutions for residential, commercial and government sectors.
              </p>

              <div className="space-y-6 md:space-y-8 text-left">
                {[
                  {
                    title: "Technical Excellence",
                    desc: "Our technicians undergo continuous training in the latest removal and containment technologies.",
                  },
                  {
                    title: "Project Management",
                    desc: "From audit to clearance certification, we manage every aspect of the environmental risk.",
                  },
                  {
                    title: "Integrated Systems",
                    desc: "Our ISO-certified management systems ensure quality, safety and environment are prioritized.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 items-start">
                    <div className="flex-shrink-0 text-aes-cyan font-black text-xl md:text-2xl mt-1">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg md:text-xl mb-1 md:mb-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsAboutExpanded((prev) => !prev)}
                className="mt-10 md:mt-12 w-full sm:w-auto bg-aes-cyan duration-300 hover:bg-white hover:text-black text-white px-8 hover:px-10 py-4 rounded font-bold transition-all uppercase text-xs tracking-widest"
              >
                {isAboutExpanded ? "Show Less" : "Learn More About Us"}
              </button>
            </div>

            <div
              data-reveal
              className="reveal-item relative hidden lg:block"
              style={{ width: '960px', height: '540px' }}
            >
              <div
                className="rounded-lg shadow-2xl h-full w-full overflow-hidden cursor-pointer bg-black/80 flex items-center justify-center"
                aria-label="Onsite remediation"
                style={{ minHeight: 540, minWidth: 960 }}
                onClick={() => setVimeoLoaded(true)}
              >
                {!vimeoLoaded ? (
                  <>
                    <img
                      src={VIMEO_THUMB}
                      alt="Vimeo video placeholder"
                      className="h-full w-full object-cover object-center transition-opacity duration-300"
                      style={{ filter: 'blur(0.5px)' }}
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
                      style={{ border: 'none', width: '100%', height: '100%', cursor: 'pointer' }}
                      aria-label="Carregar vídeo Vimeo"
                    >
                      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="40" cy="40" r="40" fill="#00aeef" fillOpacity="0.85" />
                        <polygon points="32,25 60,40 32,55" fill="#fff" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <iframe
                    src={VIMEO_EMBED_URL}
                    className="h-full w-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Onsite remediation"
                  />
                )}
              </div>
              <div
                className={`absolute bg-aes-cyan p-6 md:p-7 rounded shadow-2xl transition-all duration-500
                  ${isSafetyVideoPlaying ? "top-4 -left-10 translate-y-0" : "top-1/2 -left-10 -translate-y-1/2"}
                `}
                style={isSafetyVideoPlaying ? { top: '1rem', left: '-2.5rem', transform: 'none', width: '90%', maxWidth: '270px', opacity: 1 } : { top: '50%', left: '-2.5rem', transform: 'translateY(-50%)', width: '90%', maxWidth: '270px', opacity: 1 }}
              >
                <p className="text-5xl font-black mb-2 text-white">100%</p>
                <p className="font-bold tracking-widest uppercase text-xs text-aes-navy">
                  Safety Rating
                </p>
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-700 ${
              isAboutExpanded
                ? "max-h-[5000px] opacity-100 mt-12"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="container mx-auto px-4">
              <div className="grid gap-10 md:gap-12 lg:grid-cols-2">
                {aboutPortfolioPairs.map((pair) => (
                  <div
                    key={`pair-${pair.pairNumber}`}
                    className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
                  >
                    <div className="grid grid-cols-2 divide-x-[5px] divide-white/25">
                      <div className="aspect-[5/4] overflow-hidden relative">
                        <span className="absolute left-3 top-3 z-10 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                          Before
                        </span>
                        <img
                          src={pair.before.src}
                          alt={pair.before.alt}
                          className="h-full w-full object-cover scale-[2.25]"
                        />
                      </div>
                      {pair.after && (
                        <div className="aspect-[5/4] overflow-hidden relative">
                          <span className="absolute left-3 top-3 z-10 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                            After
                          </span>
                          <img
                            src={pair.after.src}
                            alt={pair.after.alt}
                            className="h-full w-full object-cover scale-[2.25]"
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-6 md:p-7">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {pair.before.subtitle} {pair.after?.subtitle ?? ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div data-reveal className="reveal-item text-center mb-12 md:mb-20">
              <h2 className="text-aes-cyan font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-4">
                Client Success
              </h2>
              <h3 className="text-3xl md:text-5xl font-black text-aes-navy">
                Trusted Across Sydney
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.id}
                  data-reveal
                  className="reveal-item bg-slate-50 p-6 md:p-10 rounded border-t-4 border-aes-cyan shadow-sm relative"
                >
                  <div className="text-aes-cyan flex gap-1 mb-4 md:mb-6 text-sm">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-slate-700 italic mb-6 md:mb-8 leading-relaxed font-medium text-sm md:text-base">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-aes-navy rounded-full flex items-center justify-center font-bold text-white uppercase text-sm md:text-base">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-aes-navy text-sm md:text-base">
                        {t.name}
                      </p>
                      <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-12 md:py-24 bg-aes-cyan">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col lg:flex-row">
              <div
                data-reveal
                className="reveal-item p-8 md:p-12 lg:p-20 flex-grow"
              >
                <h3 className="text-3xl md:text-4xl font-black text-aes-navy mb-4 uppercase tracking-tighter">
                  Get a Professional Quote
                </h3>
                <p className="text-slate-500 mb-8 md:mb-10 text-base md:text-lg">
                  Speak with one of our environmental specialists today about
                  your property needs.
                </p>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Service Type
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all appearance-none"
                        value={selectedService}
                        onChange={(event) =>
                          setSelectedService(event.target.value)
                        }
                      >
                        <option>External Asbestos Removal</option>
                        <option>Internal Asbestos Removal</option>
                        <option>Roof and Eaves Removal</option>
                        <option>Make Safe</option>
                        <option>Others</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all resize-none"
                      placeholder="Tell us what you need..."
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="mt-10 md:mt-12 bg-aes-cyan duration-300 hover:bg-white hover:text-[#00aeef] border hover:border-[#00aeef] text-white px-10 md:px-16 hover:px-14 py-4 rounded font-bold transition-all uppercase text-xs tracking-widest"
                    >
                      Submit Inquiry
                    </button>
                  </div>
                </form>
              </div>
              <div
                data-reveal
                className="reveal-item lg:w-[400px] bg-aes-navy p-8 md:p-12 lg:p-20 flex flex-col justify-center text-white"
              >
                <div className="mb-8 md:mb-12">
                  <p className="text-aes-cyan font-bold uppercase tracking-widest text-[10px] mb-4">
                    Contact Details
                  </p>
                  <a
                    href="tel:1300237287"
                    target="_blank"
                    rel="noreferrer"
                    className="text-2xl md:text-3xl font-black hover:text-aes-cyan transition-colors block"
                  >
                    1300 237 287
                  </a>
                </div>
                <div className="mb-8 md:mb-12">
                  <p className="text-aes-cyan font-bold uppercase tracking-widest text-[10px] mb-4">
                    Email Us
                  </p>
                  <a
                    href="mailto:info@aesaus.com.au"
                    target="_blank"
                    rel="noreferrer"
                    className="text-base md:text-lg font-bold hover:text-aes-cyan transition-colors break-words"
                  >
                    info@aesaus.com.au
                  </a>
                  <a
                    href="mailto:ghsilva2895@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-base md:text-lg font-bold hover:text-aes-cyan transition-colors break-words mt-2 block"
                  >
                    ghsilva2895@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-aes-cyan font-bold uppercase tracking-widest text-[10px] mb-4">
                    Location
                  </p>
                  <p className="text-slate-300 font-medium text-sm md:text-base">
                    Unit 52, 49-51 Mitchell Rd, Brookvale, NSW 2100, Australia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-aes-navy text-slate-500 py-12 md:py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 md:gap-3 mb-8 md:mb-10">
            <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center overflow-hidden">
              <img
                src={logo}
                alt="Absolute Environmental Services logo"
                className="w-full h-full object-cover object-left"
              />
            </div>
            <span className="font-extrabold text-white tracking-widest text-xs md:text-sm uppercase">
              Absolute Environmental Services
            </span>
          </div>

          <div className="flex justify-center flex-wrap gap-x-6 md:gap-x-12 gap-y-4 mb-8 md:mb-12 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
            <span>ISO 9001 Certified</span>
            <span>ISO 14001 Certified</span>
            <span>ISO 45001 Certified</span>
          </div>

          <p className="text-[10px] md:text-xs max-w-2xl mx-auto leading-relaxed">
            © {new Date().getFullYear()} Absolute Environmental Services Pty
            Ltd. All hazardous materials are handled and disposed of in
            accordance with the Work Health and Safety Regulation 2017 and
            Environmental Protection Authority guidelines.
          </p>

          <div className="flex justify-center gap-4 md:gap-8 mt-8 md:mt-10 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
            <a
              href="https://aesaus.com.au/privacy-policy/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-aes-cyan transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://aesaus.com.au/terms-conditions/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-aes-cyan transition-colors"
            >
              Terms and Condition
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
