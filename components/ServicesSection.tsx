import React from "react";
import { SERVICES } from "../constants";

type ServicesSectionProps = {
  onSelectService?: (serviceTitle: string) => void;
};

const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
}) => {
  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div
          data-reveal
          className="reveal-item flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6 md:gap-8 text-center md:text-left"
        >
          <div className="max-w-2xl">
            <h2 className="text-aes-cyan font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-3 md:mb-4">
              Our Expertise
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-aes-navy leading-tight">
              Leading Environmental <br className="hidden md:block" />{" "}
              Remediation Services.
            </h3>
          </div>
          <p className="text-base md:text-lg text-slate-600 max-w-md mx-auto md:mx-0">
            We employ industry-leading protocols and specialized equipment to
            ensure every site is restored to the highest safety standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              data-reveal
              className="reveal-item group bg-white border-b-4 border-slate-100 hover:border-aes-cyan transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-xl rounded-t-lg"
              style={{ transitionDelay: `${service.revealDelay ?? 0}ms` }}
            >
              <div className="relative h-48 md:h-56 lg:h-60 overflow-hidden rounded-t-lg">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-aes-navy/20 group-hover:bg-aes-navy/0 transition-colors" />
              </div>
              <div className="p-6 md:p-8 flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl md:text-3xl">{service.icon}</span>
                  <h4 className="text-lg md:text-xl font-extrabold text-aes-navy tracking-tight">
                    {service.title}
                  </h4>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 md:mb-8 text-xs md:text-sm">
                  {service.description}
                </p>
                <a
                  href="#contact"
                  onClick={() => onSelectService?.(service.title)}
                  className="mt-auto text-aes-navy font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 group-hover:text-aes-cyan transition-colors"
                >
                  Get A Quote <span className="text-aes-cyan">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
