import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/novasImgs/logo.webp";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (isEnquireOpen) {
        setIsEnquireOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isEnquireOpen]);

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    event.preventDefault();
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

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center overflow-hidden">
              <img
                src={logo}
                alt="Absolute Environmental Services logo"
                className="w-full h-full object-cover object-left"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-extrabold text-lg md:text-xl leading-none tracking-tight ${isScrolled || isMobileMenuOpen ? "text-aes-navy" : "text-white"}`}
              >
                ABSOLUTE
              </span>
              <span
                className={`font-bold text-[8px] md:text-[10px] tracking-[0.2em] ${isScrolled || isMobileMenuOpen ? "text-aes-cyan" : "text-aes-cyan"}`}
              >
                ENVIRONMENTAL SERVICES
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 font-semibold text-xs uppercase tracking-wider">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href)}
                className={`hover:text-aes-cyan transition-colors ${isScrolled ? "text-slate-700" : "text-white"}`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="tel:1300237287"
              target="_blank"
              rel="noreferrer"
              className={`hidden sm:block font-bold transition-transform text-sm md:text-base ${isScrolled || isMobileMenuOpen ? "text-aes-navy" : "text-white"} hover:scale-105 duration-200`}
              style={{ transition: 'transform 0.2s' }}
            >
              0425 257 142
            </a>
            <div className="relative hidden sm:block">
              <button
                type="button"
                className="bg-aes-cyan hover:bg-aes-navy text-white px-4 md:px-6 py-2 md:py-2.5 rounded font-bold transition-transform shadow-lg hover:shadow-aes-cyan/20 uppercase text-[10px] md:text-xs tracking-widest hover:scale-105 duration-200"
                style={{ transition: 'transform 0.2s' }}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    window.location.href = 'tel:1300237287';
                  } else {
                    window.location.href = 'mailto:info@absoluteenvironmental.com.au';
                  }
                }}
              >
                <span>Enquire Now</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className={`lg:hidden p-2 rounded focus:outline-none transition-colors ${isScrolled || isMobileMenuOpen ? "text-aes-navy" : "text-white"}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[55] bg-white lg:hidden flex flex-col pt-24 px-6 origin-top transition-all duration-300 ease-out ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{ transform: isMobileMenuOpen ? "scaleY(1)" : "scaleY(0)" }}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex flex-col gap-6 text-center">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className="text-xl font-bold text-aes-navy uppercase tracking-widest hover:text-aes-cyan transition-colors"
            >
              {item.name}
            </a>
          ))}
          <div className="mt-8 flex flex-col gap-4 relative items-center">
            <button
              type="button"
              className="bg-aes-cyan text-white rounded font-bold uppercase tracking-widest shadow-xl transition-all duration-300 py-6 px-8 text-[10px]"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  window.location.href = 'tel:1300237287';
                } else {
                  window.location.href = 'mailto:info@absoluteenvironmental.com.au';
                }
              }}
            >
              <span>Enquire Now</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
