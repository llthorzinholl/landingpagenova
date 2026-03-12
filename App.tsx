import React, { useEffect, useRef, useState } from "react";
import logo from "./assets/novasImgs/logo.webp";
import Header from "./components/Header";
import CookieConsent from "./components/CookieConsent";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";
import { TESTIMONIALS } from "./constants";
import asbestosImage from "./assets/novasImgs/1.webp";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { track } from "@vercel/analytics";

const VIMEO_EMBED_URL =
  "https://player.vimeo.com/video/1146343746?autoplay=1&muted=1&loop=1&background=1&title=0&byline=0&portrait=0";
const VIMEO_THUMB = asbestosImage;

const MAX_GENERAL_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

const aboutPortfolioEntries = Object.entries(
  import.meta.glob("./assets/AES/*.{jpeg,jpg,png,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  })
) as Array<[string, string]>;

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

const App: React.FC = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [vimeoLoaded, setVimeoLoaded] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [activeContactTab, setActiveContactTab] = useState<"quote" | "general">(
    "quote"
  );
  const [showTermsBox, setShowTermsBox] = useState(false);

  const termsBoxRef = useRef<HTMLDivElement | null>(null);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactService, setContactService] = useState("External Asbestos Removal");
  const [contactDesc, setContactDesc] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    message?: boolean;
  }>({});

  const [generalName, setGeneralName] = useState("");
  const [generalPhone, setGeneralPhone] = useState("");
  const [generalEmail, setGeneralEmail] = useState("");
  const [generalLocation, setGeneralLocation] = useState("");
  const [generalImage, setGeneralImage] = useState<File | null>(null);
  const [generalAcceptedTerms, setGeneralAcceptedTerms] = useState(false);
  const [generalErrors, setGeneralErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    image?: string;
    terms?: string;
  }>({});
  const [generalTouched, setGeneralTouched] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    location?: boolean;
    image?: boolean;
    terms?: boolean;
  }>({});

  useEffect(() => {
    document.title =
      "Asbestos Removal Sydney | Licensed Asbestos Removalists NSW | Absolute Environmental Services";

    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta(
      "description",
      "Licensed asbestos removal in Sydney and NSW. Book asbestos inspections, make-safe solutions, residential and commercial asbestos removal, and photo checks with Absolute Environmental Services."
    );
  }, []);

  const validateAll = () => {
    const newErrors: typeof errors = {};

    if (!contactName || contactName.trim().length < 2) {
      newErrors.name = "Invalid name";
    }

    const email = contactEmail.trim();
    const emailOk =
      /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(email);

    if (!emailOk) {
      newErrors.email = "Invalid email";
    }

    const phoneDigits = contactPhone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 9 || phoneDigits.length > 10) {
      newErrors.phone = "Invalid phone";
    } else if (!/^0|^4/.test(phoneDigits)) {
      newErrors.phone = "Invalid phone";
    }

    if (!contactDesc || contactDesc.trim().length < 10) {
      newErrors.message = "Message too short";
    }

    return newErrors;
  };

  const validateGeneralForm = () => {
    const newErrors: typeof generalErrors = {};

    if (!generalName || generalName.trim().length < 2) {
      newErrors.name = "Invalid name";
    }

    const email = generalEmail.trim();
    const emailOk =
      /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(email);

    if (!emailOk) {
      newErrors.email = "Invalid email";
    }

    const phoneDigits = generalPhone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 9 || phoneDigits.length > 10) {
      newErrors.phone = "Invalid phone";
    } else if (!/^0|^4/.test(phoneDigits)) {
      newErrors.phone = "Invalid phone";
    }

    if (!generalLocation || generalLocation.trim().length < 5) {
      newErrors.location = "Please specify the location of the material";
    }

    if (!generalImage) {
      newErrors.image = "Please attach a JPG or PNG image";
    } else {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(generalImage.type)) {
        newErrors.image = "Only JPG and PNG images are allowed";
      } else if (generalImage.size > MAX_GENERAL_IMAGE_SIZE_BYTES) {
        newErrors.image = "Image must be under 8MB";
      }
    }

    if (!generalAcceptedTerms) {
      newErrors.terms = "You must accept the terms before submitting";
    }

    return newErrors;
  };

  const handleBlur = (field: keyof typeof errors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const v = validateAll();
    setErrors((prev) => ({ ...prev, [field]: v[field] }));
  };

  const handleGeneralBlur = (field: keyof typeof generalErrors) => {
    setGeneralTouched((prev) => ({ ...prev, [field]: true }));
    const v = validateGeneralForm();
    setGeneralErrors((prev) => ({ ...prev, [field]: v[field] }));
  };

  const resetSuccessState = () => {
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 2000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateAll();
    setErrors(validation);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.keys(validation).length > 0) {
      setGlobalError("Please correct the highlighted fields.");
      return;
    }

    setGlobalError(null);

    try {
      const res = await fetch("/api/landing-page-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: contactName.trim(),
          phone_number: `+61${contactPhone.replace(/\D/g, "")}`,
          email_address: contactEmail.trim().toLowerCase(),
          service_type: contactService,
          description: contactDesc.trim(),
          form_type: "quote",
        }),
      });

      const text = await res.text();
      let payload: any = null;

      try {
        payload = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        setGlobalError(payload?.error || "Failed to send. Please try again.");
        return;
      }

      track("quote_form_submitted", {
        source: "contact_section",
        page: "home",
        service_type: contactService,
      });

      setContactName("");
      setContactPhone("");
      setContactEmail("");
      setContactService("External Asbestos Removal");
      setContactDesc("");
      setErrors({});
      setTouched({});
      setGlobalError(null);
      resetSuccessState();
    } catch {
      setGlobalError("Network error. Please try again.");
    }
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateGeneralForm();
    setGeneralErrors(validation);
    setGeneralTouched({
      name: true,
      email: true,
      phone: true,
      location: true,
      image: true,
      terms: true,
    });

    if (Object.keys(validation).length > 0) {
      setGlobalError("Please correct the highlighted fields.");
      return;
    }

    if (!generalImage) {
      setGlobalError("Please attach an image.");
      return;
    }

    setGlobalError(null);

    try {
      const formData = new FormData();
      formData.append("full_name", generalName.trim());
      formData.append("phone_number", `+61${generalPhone.replace(/\D/g, "")}`);
      formData.append("email_address", generalEmail.trim().toLowerCase());
      formData.append("service_type", "Photo Check");
      formData.append("form_type", "visual_pre_assessment");
      formData.append("material_location", generalLocation.trim());
      formData.append("attachment", generalImage);
      formData.append("terms_accepted", String(generalAcceptedTerms));

      const res = await fetch("/api/landing-page-form", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let payload: any = null;

      try {
        payload = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        setGlobalError(payload?.error || "Failed to send. Please try again.");
        return;
      }

      track("photo_check_submitted", {
        source: "contact_section",
        page: "home",
        has_image: true,
      });

      setGeneralName("");
      setGeneralPhone("");
      setGeneralEmail("");
      setGeneralLocation("");
      setGeneralImage(null);
      setGeneralAcceptedTerms(false);
      setGeneralErrors({});
      setGeneralTouched({});
      setGlobalError(null);
      setShowTermsBox(false);
      resetSuccessState();
    } catch {
      setGlobalError("Network error. Please try again.");
    }
  };

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
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
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!showTermsBox) return;
      if (!termsBoxRef.current) return;

      const target = event.target as Node;
      if (!termsBoxRef.current.contains(target)) {
        setShowTermsBox(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showTermsBox]);

  useEffect(() => {
    const openQuote = () => {
      setActiveContactTab("quote");
      setGlobalError(null);
      setShowTermsBox(false);

      requestAnimationFrame(() => {
        const target = document.getElementById("contact");
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    const openPhotoCheck = () => {
      setActiveContactTab("general");
      setGlobalError(null);
      setShowTermsBox(false);

      requestAnimationFrame(() => {
        const target = document.getElementById("contact");
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    window.addEventListener("openRequestQuote", openQuote);
    window.addEventListener("openVisualPreTest", openPhotoCheck);

    return () => {
      window.removeEventListener("openRequestQuote", openQuote);
      window.removeEventListener("openVisualPreTest", openPhotoCheck);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <CookieConsent />
      <Header />

      <main>
        <Hero />

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
                Licensed & Safety Focused
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                We prioritise safe asbestos removal, site protection and strict
                compliance on every project across Sydney and NSW.
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
                Fully Compliant
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                Our team works under strict compliance requirements for licensed
                asbestos removal, inspections and hazardous material control.
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
                Residential & Commercial
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                We deliver asbestos removal and make-safe solutions for homes,
                builders, strata, commercial sites and government projects.
              </p>
            </div>
          </div>
        </section>

        <section id="services">
          <ServicesSection
            onSelectService={(svc) => {
              setContactService(svc);
              setActiveContactTab("quote");
            }}
          />
        </section>

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
                About Absolute Environmental Services
              </h2>
              <h3 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 leading-tight">
                Licensed Asbestos Removal <br className="hidden md:block" /> and
                Hazardous Material Management.
              </h3>
              <p className="text-slate-300 mb-8 text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Absolute Environmental Services provides licensed asbestos
                removal, inspections, make-safe works and environmental
                remediation across Sydney and NSW. We support residential,
                commercial, builder, strata and government clients with safe,
                compliant and professionally managed solutions.
              </p>

              <div className="space-y-6 md:space-y-8 text-left">
                {[
                  {
                    title: "Licensed Technical Expertise",
                    desc: "Our team follows proven asbestos removal procedures and ongoing training to deliver safe, controlled and compliant outcomes.",
                  },
                  {
                    title: "End-to-End Project Delivery",
                    desc: "From first inspection through removal, transport and final clearance coordination, we manage the process professionally.",
                  },
                  {
                    title: "Reliable Compliance Systems",
                    desc: "Our quality, safety and environmental systems help ensure every project is completed with care, consistency and accountability.",
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
                {isAboutExpanded ? "Show Less" : "View More Project Results"}
              </button>
            </div>

            <div
              data-reveal
              className="reveal-item relative hidden lg:block"
              style={{ width: "960px", height: "540px" }}
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
                      style={{ filter: "blur(0.5px)" }}
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
                      style={{
                        border: "none",
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                      aria-label="Load Vimeo video"
                    >
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="40"
                          cy="40"
                          r="40"
                          fill="#00aeef"
                          fillOpacity="0.85"
                        />
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
                className="absolute bg-aes-cyan p-6 md:p-7 rounded shadow-2xl transition-all duration-500 top-1/2 -left-10 -translate-y-1/2"
                style={{
                  width: "90%",
                  maxWidth: "270px",
                  opacity: 1,
                }}
              >
                <p className="text-5xl font-black mb-2 text-white">24+</p>
                <p className="font-black text-white tracking-widest uppercase text-xs text-aes-navy">
                  Years of Industry Experience
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

        <section id="testimonials" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div data-reveal className="reveal-item text-center mb-12 md:mb-20">
              <h2 className="text-aes-cyan font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-4">
                Client Reviews
              </h2>
              <h3 className="text-3xl md:text-5xl font-black text-aes-navy">
                Trusted for Asbestos Removal Across Sydney
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

        <section id="contact" className="py-12 md:py-24 bg-aes-cyan">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col lg:flex-row">
              <div
                data-reveal
                className="reveal-item p-6 sm:p-8 md:p-12 lg:p-20 flex-grow min-w-0"
              >
                <h3 className="text-3xl md:text-4xl font-black text-aes-navy mb-4 uppercase tracking-tighter">
                  {activeContactTab === "quote"
                    ? "Book an Asbestos Inspection or Request a Quote"
                    : "Upload a Photo for a Preliminary Check"}
                </h3>

                <p className="text-slate-500 mb-6 text-sm sm:text-base md:text-lg leading-relaxed">
                  {activeContactTab === "quote"
                    ? "Tell us about your property, project or suspected asbestos material and our team will get back to you about the next safest step."
                    : "Upload a clear photo of the material you are concerned about. Our team may identify visible features commonly associated with asbestos-containing materials and provide preliminary guidance based on appearance only."}
                </p>

                {activeContactTab === "general" && (
                  <div className="mb-8 rounded border-l-4 border-aes-cyan bg-slate-50 px-4 py-4 text-sm leading-relaxed text-slate-600">
                    A visual review cannot confirm whether a material does or does
                    not contain asbestos. The safest and most reliable option is
                    always physical sampling and laboratory analysis performed by
                    an accredited facility. Any visual feedback provided through
                    this form is preliminary only and must not be relied upon as a
                    substitute for formal testing before renovation, demolition, or
                    disturbance of suspect materials.
                  </div>
                )}

                <div className="mb-8 flex justify-center sm:justify-start">
                  <div className="relative inline-grid grid-cols-2 rounded-full bg-slate-100 p-1 w-full max-w-[360px] sm:w-auto">
                    <span
                      className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ${
                        activeContactTab === "quote"
                          ? "left-1 bg-aes-cyan"
                          : "left-[calc(50%+0px)] bg-aes-navy"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        track("contact_switch_clicked", {
                          source: "contact_section",
                          target: "quote",
                          page: "home",
                        });
                        setActiveContactTab("quote");
                        setGlobalError(null);
                        setShowTermsBox(false);
                      }}
                      className={`relative z-10 rounded-full px-4 sm:px-5 py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-colors ${
                        activeContactTab === "quote"
                          ? "text-white"
                          : "text-slate-600"
                      }`}
                    >
                      Request Quote
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        track("contact_switch_clicked", {
                          source: "contact_section",
                          target: "photo_check",
                          page: "home",
                        });
                        setActiveContactTab("general");
                        setGlobalError(null);
                      }}
                      className={`relative z-10 rounded-full px-4 sm:px-5 py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-colors ${
                        activeContactTab === "general"
                          ? "text-white"
                          : "text-slate-600"
                      }`}
                    >
                      Photo Check
                    </button>
                  </div>
                </div>

                {globalError && (
                  <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {globalError}
                  </div>
                )}

                {activeContactTab === "quote" && (
                  <form className="space-y-6" onSubmit={handleContactSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className={`w-full bg-slate-50 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all border ${
                            errors.name && touched.name
                              ? "border-red-500 placeholder-red-500 text-red-500"
                              : "border-slate-200"
                          }`}
                          value={contactName}
                          onChange={(e) => {
                            setContactName(e.target.value);
                            if (touched.name) {
                              const v = validateAll();
                              setErrors((prev) => ({ ...prev, name: v.name }));
                            }
                          }}
                          onBlur={() => handleBlur("name")}
                          placeholder={
                            errors.name && touched.name ? "Invalid name" : "Full Name"
                          }
                        />
                        {errors.name && touched.name && (
                          <div className="text-red-500 text-xs mt-1">{errors.name}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                          Phone Number
                        </label>
                        <div className="flex">
                          <span className="flex items-center px-3 bg-slate-100 border border-slate-200 rounded-l text-slate-500 text-sm select-none">
                            +61
                          </span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                            className={`w-full min-w-0 bg-slate-50 rounded-r px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all border border-l-0 ${
                              errors.phone && touched.phone
                                ? "border-red-500 placeholder-red-500 text-red-500"
                                : "border-slate-200"
                            }`}
                            value={contactPhone}
                            onChange={(e) => {
                              const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setContactPhone(onlyNums);
                              if (touched.phone) {
                                const v = validateAll();
                                setErrors((prev) => ({ ...prev, phone: v.phone }));
                              }
                            }}
                            onBlur={() => handleBlur("phone")}
                            placeholder={
                              errors.phone && touched.phone
                                ? "Invalid phone"
                                : "4xxxxxxxxx"
                            }
                          />
                        </div>
                        {errors.phone && touched.phone && (
                          <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className={`w-full bg-slate-50 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all border ${
                          errors.email && touched.email
                            ? "border-red-500 placeholder-red-500 text-red-500"
                            : "border-slate-200"
                        }`}
                        value={contactEmail}
                        onChange={(e) => {
                          setContactEmail(e.target.value);
                          if (touched.email) {
                            const v = validateAll();
                            setErrors((prev) => ({ ...prev, email: v.email }));
                          }
                        }}
                        onBlur={() => handleBlur("email")}
                        placeholder={
                          errors.email && touched.email
                            ? "Invalid email"
                            : "Email Address"
                        }
                      />
                      {errors.email && touched.email && (
                        <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                        Service Type
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all appearance-none"
                          value={contactService}
                          onChange={(e) => setContactService(e.target.value)}
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
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                        Project Details
                      </label>
                      <textarea
                        rows={4}
                        className={`w-full bg-slate-50 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all resize-none border ${
                          errors.message && touched.message
                            ? "border-red-500 placeholder-red-500 text-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder={
                          errors.message && touched.message
                            ? "Message too short"
                            : "Tell us about the property, suspected material, location or work required..."
                        }
                        value={contactDesc}
                        onChange={(e) => {
                          setContactDesc(e.target.value);
                          if (touched.message) {
                            const v = validateAll();
                            setErrors((prev) => ({ ...prev, message: v.message }));
                          }
                        }}
                        onBlur={() => handleBlur("message")}
                      />
                      {errors.message && touched.message && (
                        <div className="text-red-500 text-xs mt-1">{errors.message}</div>
                      )}
                    </div>

                    <div className="flex justify-center sm:justify-start">
                      <button
                        type="submit"
                        disabled={submitSuccess}
                        className={
                          submitSuccess
                            ? "mt-6 md:mt-8 bg-green-500 text-white rounded-full w-24 h-12 md:w-28 md:h-14 flex items-center justify-center text-lg font-bold transition-all duration-500 shadow-lg scale-110"
                            : "mt-6 md:mt-8 bg-aes-cyan duration-300 hover:bg-white hover:text-[#00aeef] border hover:border-[#00aeef] text-white px-8 sm:px-10 md:px-16 py-4 rounded font-bold transition-all uppercase text-xs tracking-widest"
                        }
                        style={
                          submitSuccess
                            ? { minWidth: "96px", minHeight: "48px", padding: 0 }
                            : {}
                        }
                      >
                        {submitSuccess ? "Done" : "Request Quote"}
                      </button>
                    </div>
                  </form>
                )}

                {activeContactTab === "general" && (
                  <form className="space-y-6" onSubmit={handleGeneralSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className={`w-full bg-slate-50 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all border ${
                            generalErrors.name && generalTouched.name
                              ? "border-red-500 placeholder-red-500 text-red-500"
                              : "border-slate-200"
                          }`}
                          value={generalName}
                          onChange={(e) => {
                            setGeneralName(e.target.value);
                            if (generalTouched.name) {
                              const v = validateGeneralForm();
                              setGeneralErrors((prev) => ({ ...prev, name: v.name }));
                            }
                          }}
                          onBlur={() => handleGeneralBlur("name")}
                          placeholder={
                            generalErrors.name && generalTouched.name
                              ? "Invalid name"
                              : "Full Name"
                          }
                        />
                        {generalErrors.name && generalTouched.name && (
                          <div className="text-red-500 text-xs mt-1">{generalErrors.name}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                          Phone Number
                        </label>
                        <div className="flex">
                          <span className="flex items-center px-3 bg-slate-100 border border-slate-200 rounded-l text-slate-500 text-sm select-none">
                            +61
                          </span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                            className={`w-full min-w-0 bg-slate-50 rounded-r px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all border border-l-0 ${
                              generalErrors.phone && generalTouched.phone
                                ? "border-red-500 placeholder-red-500 text-red-500"
                                : "border-slate-200"
                            }`}
                            value={generalPhone}
                            onChange={(e) => {
                              const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setGeneralPhone(onlyNums);
                              if (generalTouched.phone) {
                                const v = validateGeneralForm();
                                setGeneralErrors((prev) => ({ ...prev, phone: v.phone }));
                              }
                            }}
                            onBlur={() => handleGeneralBlur("phone")}
                            placeholder={
                              generalErrors.phone && generalTouched.phone
                                ? "Invalid phone"
                                : "4xxxxxxxxx"
                            }
                          />
                        </div>
                        {generalErrors.phone && generalTouched.phone && (
                          <div className="text-red-500 text-xs mt-1">{generalErrors.phone}</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className={`w-full bg-slate-50 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all border ${
                          generalErrors.email && generalTouched.email
                            ? "border-red-500 placeholder-red-500 text-red-500"
                            : "border-slate-200"
                        }`}
                        value={generalEmail}
                        onChange={(e) => {
                          setGeneralEmail(e.target.value);
                          if (generalTouched.email) {
                            const v = validateGeneralForm();
                            setGeneralErrors((prev) => ({ ...prev, email: v.email }));
                          }
                        }}
                        onBlur={() => handleGeneralBlur("email")}
                        placeholder={
                          generalErrors.email && generalTouched.email
                            ? "Invalid email"
                            : "Email Address"
                        }
                      />
                      {generalErrors.email && generalTouched.email && (
                        <div className="text-red-500 text-xs mt-1">{generalErrors.email}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                        Where in the house is this material located? Please specify.
                      </label>
                      <input
                        type="text"
                        className={`w-full bg-slate-50 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all border ${
                          generalErrors.location && generalTouched.location
                            ? "border-red-500 placeholder-red-500 text-red-500"
                            : "border-slate-200"
                        }`}
                        value={generalLocation}
                        onChange={(e) => {
                          setGeneralLocation(e.target.value);
                          if (generalTouched.location) {
                            const v = validateGeneralForm();
                            setGeneralErrors((prev) => ({ ...prev, location: v.location }));
                          }
                        }}
                        onBlur={() => handleGeneralBlur("location")}
                        placeholder={
                          generalErrors.location && generalTouched.location
                            ? "Please specify the location"
                            : "Example: garage ceiling, laundry wall sheeting, eaves, bathroom backing board"
                        }
                      />
                      {generalErrors.location && generalTouched.location && (
                        <div className="text-red-500 text-xs mt-1">
                          {generalErrors.location}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                        Upload Photo of Suspected Material
                      </label>

                      <div className="flex flex-wrap items-center gap-3">
                        <label
                          className={`inline-flex cursor-pointer items-center justify-center rounded px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                            generalErrors.image && generalTouched.image
                              ? "border border-red-500 bg-red-50 text-red-600"
                              : "border border-slate-200 bg-slate-50 text-aes-navy hover:border-aes-cyan hover:text-aes-cyan"
                          }`}
                        >
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              setGeneralImage(file);

                              setGeneralTouched((prev) => ({
                                ...prev,
                                image: true,
                              }));

                              const imageErrors = (() => {
                                if (!file) return "Please attach a JPG or PNG image";
                                if (!["image/jpeg", "image/png"].includes(file.type)) {
                                  return "Only JPG and PNG images are allowed";
                                }
                                if (file.size > MAX_GENERAL_IMAGE_SIZE_BYTES) {
                                  return "Image must be under 8MB";
                                }
                                return undefined;
                              })();

                              setGeneralErrors((prev) => ({
                                ...prev,
                                image: imageErrors,
                              }));
                            }}
                            onBlur={() => handleGeneralBlur("image")}
                          />
                          Attach Image
                        </label>

                        {generalImage && (
                          <span className="max-w-full break-all text-sm text-slate-600">
                            {generalImage.name}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        JPG or PNG only. Max 8MB. Please upload a clear photo of
                        the material.
                      </p>

                      <div className="mt-3 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-700">
                        For your safety, do not cut, scrape, drill, or break the
                        material to obtain a photo. Disturbing suspect materials
                        may release hazardous fibres.
                      </div>

                      {generalErrors.image && generalTouched.image && (
                        <div className="text-red-500 text-xs mt-1">{generalErrors.image}</div>
                      )}
                    </div>

                    <div className="relative" ref={termsBoxRef}>
                      {showTermsBox && (
                        <div className="absolute bottom-full left-0 z-50 mb-3 w-[min(92vw,560px)] rounded-lg border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-600 shadow-2xl">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <h4 className="text-sm font-bold text-aes-navy">
                              Photo Check Terms and Conditions
                            </h4>
                            <button
                              type="button"
                              onClick={() => setShowTermsBox(false)}
                              className="shrink-0 rounded border border-slate-200 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-aes-navy"
                            >
                              Close
                            </button>
                          </div>

                          <div className="max-h-[280px] overflow-y-auto pr-2 overscroll-contain">
                            <p className="whitespace-pre-line">
                              {`By submitting an image through this form, you acknowledge that Absolute Environmental Services is providing a preliminary visual review only.

A photograph, video, or visual inspection alone cannot confirm whether a material does or does not contain asbestos. Definitive identification requires physical sampling and laboratory analysis performed by an accredited testing facility.

Any comments, observations, or guidance provided in response to your submission are based solely on visible characteristics and common material features historically associated with asbestos-containing products.

This service does not constitute a formal asbestos inspection, hazardous materials report, clearance certificate, compliance advice, or legal determination under any applicable Australian law, regulation, code, or standard.

Absolute Environmental Services makes no warranty, representation, or guarantee that any material shown in an image is asbestos-free, asbestos-containing, safe, unsafe, compliant, or suitable for disturbance, renovation, demolition, removal, or disposal.

You must not rely solely on this visual pre-assessment when making decisions about renovation, demolition, property transactions, workplace safety, or any activity that may disturb a suspect material.

For safety and compliance reasons, Absolute Environmental Services strongly recommends formal inspection, physical sampling, and laboratory analysis before any suspect material is handled, disturbed, removed, drilled, cut, sanded, broken, or otherwise affected.

To the maximum extent permitted by law, Absolute Environmental Services excludes liability for any loss, damage, injury, cost, delay, claim, or consequence arising from reliance on this visual pre-assessment or from actions taken before formal testing is completed.

By proceeding, you confirm that you understand and accept that this service is informational only, preliminary in nature, and not a substitute for professional asbestos testing or regulatory advice.`}
                            </p>
                          </div>
                        </div>
                      )}

                      <label className="flex items-start gap-3 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={generalAcceptedTerms}
                          onChange={(e) => {
                            setGeneralAcceptedTerms(e.target.checked);
                            setGeneralTouched((prev) => ({
                              ...prev,
                              terms: true,
                            }));

                            if (e.target.checked) {
                              setGeneralErrors((prev) => ({
                                ...prev,
                                terms: undefined,
                              }));
                            } else {
                              setGeneralErrors((prev) => ({
                                ...prev,
                                terms: "You must accept the terms before submitting",
                              }));
                            }
                          }}
                          onBlur={() => handleGeneralBlur("terms")}
                          className="mt-1 h-4 w-4 shrink-0 accent-aes-cyan"
                        />

                        <span className="leading-relaxed">
                          I have read and accept the{" "}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              track("terms_box_toggled", {
                                source: "contact_section",
                                page: "home",
                                form: "photo_check",
                              });
                              setShowTermsBox((prev) => !prev);
                            }}
                            className="inline font-semibold text-aes-cyan underline decoration-aes-cyan underline-offset-2"
                          >
                            Terms and Conditions
                          </button>
                          .
                        </span>
                      </label>

                      {generalErrors.terms && generalTouched.terms && (
                        <div className="text-red-500 text-xs mt-2">{generalErrors.terms}</div>
                      )}
                    </div>

                    <div className="flex justify-center sm:justify-start">
                      <button
                        type="submit"
                        disabled={submitSuccess}
                        className={
                          submitSuccess
                            ? "mt-6 md:mt-8 bg-green-500 text-white rounded-full w-24 h-12 md:w-28 md:h-14 flex items-center justify-center text-lg font-bold transition-all duration-500 shadow-lg scale-110"
                            : "mt-6 md:mt-8 bg-aes-cyan duration-300 hover:bg-white hover:text-[#00aeef] border hover:border-[#00aeef] text-white px-8 sm:px-10 md:px-16 py-4 rounded font-bold transition-all uppercase text-xs tracking-widest"
                        }
                        style={
                          submitSuccess
                            ? { minWidth: "96px", minHeight: "48px", padding: 0 }
                            : {}
                        }
                      >
                        {submitSuccess ? "Done" : "Submit Photo Check"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div
                data-reveal
                className="reveal-item lg:w-[400px] xl:w-[420px] bg-aes-navy p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center text-white"
              >
                <div className="mb-8 md:mb-12">
                  <p className="text-aes-cyan font-bold uppercase tracking-widest text-[10px] mb-4">
                    Call Our Team
                  </p>
                  <a
                    href="tel:0425257142"
                    target="_blank"
                    rel="noreferrer"
                    className="text-2xl md:text-3xl font-black hover:text-aes-cyan transition-colors block break-words"
                  >
                    Andrew Konarev
                    <br />
                    0425 257 142
                  </a>
                </div>

                <div className="mb-8 md:mb-12">
                  <p className="text-aes-cyan font-bold uppercase tracking-widest text-[10px] mb-4">
                    Email Us
                  </p>
                  <a
                    href="mailto:business.support@aesaus.com.au"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm md:text-base font-bold hover:text-aes-cyan transition-colors whitespace-nowrap"
                  >
                    business.support@aesaus.com.au
                  </a>
                </div>

                <div>
                  <p className="text-aes-cyan font-bold uppercase tracking-widest text-[10px] mb-4">
                    Service Area
                  </p>
                  <p className="text-slate-300 font-medium text-sm md:text-base">
                    Sydney, Brookvale and wider NSW service coverage for asbestos
                    removal, inspections and hazardous material works.
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
            Ltd. Licensed asbestos removal, inspections and hazardous materials
            handling in accordance with applicable WHS and EPA requirements.
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

      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;