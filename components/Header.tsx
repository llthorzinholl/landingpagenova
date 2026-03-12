import React, { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import logo from "../assets/novasImgs/logo.webp";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Reviews", href: "#testimonials" },
    { name: "Contact", href: "#contact", isQuote: true },
    { name: "Photo Check", href: "#contact", isPhotoCheck: true },
  ];

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    options?: { isPhotoCheck?: boolean; isQuote?: boolean }
  ) => {
    event.preventDefault();

    if (options?.isPhotoCheck) {
      track("header_nav_clicked", {
        source: "header",
        page: "home",
        target: "photo_check",
      });
      setIsMobileMenuOpen(false);
      window.dispatchEvent(new CustomEvent("openVisualPreTest"));
      return;
    }

    if (options?.isQuote) {
      track("header_nav_clicked", {
        source: "header",
        page: "home",
        target: "contact",
      });
      setIsMobileMenuOpen(false);
      window.dispatchEvent(new CustomEvent("openRequestQuote"));
      return;
    }

    setIsMobileMenuOpen(false);

    const targetId = href.replace("#", "");

    if (!targetId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) return;

    const headerOffset = headerRef.current?.offsetHeight ?? 0;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  const handlePhoneClick = () => {
    track("header_phone_clicked", {
      source: "header",
      page: "home",
    });

    window.location.href = "tel:0425257142";
  };

  return (
    <>
      <header
        ref={headerRef}
        className={[
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-300",
          isScrolled || isMobileMenuOpen
            ? "bg-white shadow-md py-1.5 sm:py-2"
            : "bg-transparent py-2.5 sm:py-4",
        ].join(" ")}
      >
        <div className="max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 flex justify-between items-center min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <a
              href="#"
              onClick={(event) => handleNavClick(event, "#")}
              className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 flex items-center justify-center overflow-hidden flex-shrink-0"
            >
              <img
                src={logo}
                alt="Absolute Environmental Services logo"
                className="w-full h-full object-cover object-left"
              />
            </a>

            <div className="flex flex-col min-w-0">
              <a
                href="#"
                onClick={(event) => handleNavClick(event, "#")}
                className={[
                  "font-extrabold leading-none tracking-tight break-words transition-colors duration-300",
                  "text-[14px] sm:text-lg md:text-xl",
                  isScrolled || isMobileMenuOpen ? "text-aes-navy" : "text-white",
                ].join(" ")}
              >
                ABSOLUTE
              </a>

              <span
                className={[
                  "font-bold tracking-[0.2em] break-words",
                  "text-[7px] sm:text-[8px] md:text-[10px]",
                  "text-aes-cyan",
                ].join(" ")}
              >
                ENVIRONMENTAL SERVICES
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 min-w-0">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(event) =>
                  handleNavClick(event, item.href, {
                    isPhotoCheck: item.isPhotoCheck,
                    isQuote: item.isQuote,
                  })
                }
                className={[
                  "inline-flex items-center justify-center rounded-full",
                  "px-3 py-2",
                  "text-[11px] font-semibold uppercase tracking-wider",
                  "transition-all duration-300 ease-out",
                  "border border-transparent",
                  "hover:bg-[#00aeef]/15 hover:border-white/20 hover:text-[#00aeef]",
                  "hover:shadow-lg hover:-translate-y-0.5",
                  isScrolled ? "text-slate-700" : "text-white",
                ].join(" ")}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="relative hidden sm:block w-full sm:w-auto">
              <button
                type="button"
                className={[
                  "w-full sm:w-auto rounded-full font-black uppercase tracking-widest text-center",
                  "px-4 sm:px-6 py-2 md:py-2.5 text-[10px] md:text-xs",
                  "border border-white/15 shadow-lg duration-200 transition-all",
                  "hover:scale-105 hover:bg-[#00aeef] hover:text-white hover:shadow-aes-cyan/20",
                  isScrolled || isMobileMenuOpen
                    ? "bg-aes-navy text-white"
                    : "bg-white/10 text-white/90 backdrop-blur-sm",
                ].join(" ")}
                onClick={handlePhoneClick}
              >
                <span className="text-xl">0425 257 142</span>
              </button>
            </div>

            <button
              type="button"
              className={[
                "lg:hidden p-2 rounded focus:outline-none transition-colors",
                isScrolled || isMobileMenuOpen ? "text-aes-navy" : "text-white",
              ].join(" ")}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-[55] bg-white lg:hidden flex flex-col pt-24 px-2 sm:px-4 origin-top transition-all duration-300 ease-out",
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        style={{ transform: isMobileMenuOpen ? "scaleY(1)" : "scaleY(0)" }}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex flex-col gap-4 sm:gap-6 text-center min-w-0">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(event) =>
                handleNavClick(event, item.href, {
                  isPhotoCheck: item.isPhotoCheck,
                  isQuote: item.isQuote,
                })
              }
              className="text-lg sm:text-xl font-bold text-aes-navy uppercase tracking-widest hover:text-aes-cyan transition-colors break-words"
            >
              {item.name}
            </a>
          ))}

          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 relative items-center w-full">
            <button
              type="button"
              className="w-full bg-aes-cyan text-white rounded font-bold uppercase tracking-widest shadow-xl transition-all duration-300 py-4 sm:py-6 px-4 sm:px-8 text-[10px] text-center"
              onClick={handlePhoneClick}
            >
              <span>Call Now</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;