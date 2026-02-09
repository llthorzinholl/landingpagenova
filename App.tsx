
import React from 'react';
import logo from './assets/novasImgs/logo.png';
import aboutVideo from './assets/novasImgs/landing page 3.mp4';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import { TESTIMONIALS } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Hero />
        
        {/* Core Values Row */}
        <section className="bg-slate-50 py-12 md:py-20 border-b border-slate-200">
          <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-aes-navy text-white rounded-full flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 shadow-lg shadow-aes-navy/20">🛡️</div>
              <h4 className="text-lg md:text-xl font-bold text-aes-navy mb-2 md:mb-3">Safety First</h4>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">Our primary objective is the health and safety of our clients, the public, and our technicians.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-aes-cyan text-white rounded-full flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 shadow-lg shadow-aes-cyan/20">📋</div>
              <h4 className="text-lg md:text-xl font-bold text-aes-navy mb-2 md:mb-3">Full Compliance</h4>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">Operating under strict ISO certifications and fully licensed by SafeWork NSW for high-risk remediation.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:col-span-2 md:col-span-1">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-aes-navy text-white rounded-full flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 shadow-lg shadow-aes-navy/20">🌍</div>
              <h4 className="text-lg md:text-xl font-bold text-aes-navy mb-2 md:mb-3">Eco Responsible</h4>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">Dedicated to environmentally sustainable waste disposal and reducing remediation footprints.</p>
            </div>
          </div>
        </section>

        <ServicesSection />

        {/* Corporate Profile Section */}
        <section id="about" className="py-16 md:py-24 bg-aes-navy text-white overflow-hidden relative">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative z-10 text-center lg:text-left">
              <h2 className="text-aes-cyan font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-4">About the Company</h2>
              <h3 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 leading-tight">Expert Management of <br className="hidden md:block" /> Hazardous Materials.</h3>
              <p className="text-slate-300 mb-8 text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Absolute Environmental Services (AES) is a market leader in the provision of hazardous material removal and environmental remediation services. Based in Sydney, we provide tailored solutions for residential, commercial and government sectors.
              </p>
              
              <div className="space-y-6 md:space-y-8 text-left">
                {[
                  { title: "Technical Excellence", desc: "Our technicians undergo continuous training in the latest removal and containment technologies." },
                  { title: "Project Management", desc: "From audit to clearance certification, we manage every aspect of the environmental risk." },
                  { title: "Integrated Systems", desc: "Our ISO-certified management systems ensure quality, safety and environment are prioritized." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 items-start">
                    <div className="flex-shrink-0 text-aes-cyan font-black text-xl md:text-2xl mt-1">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg md:text-xl mb-1 md:mb-2">{item.title}</h4>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-10 md:mt-12 w-full sm:w-auto bg-aes-cyan hover:bg-white hover:text-aes-navy text-white px-8 py-4 rounded font-bold transition-all uppercase text-xs tracking-widest">
                Learn More About Us
              </button>
            </div>
            
            <div className="relative lg:h-[600px] hidden lg:block">
              <video
                className="rounded-lg shadow-2xl h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Onsite remediation"
              >
                <source src={aboutVideo} type="video/mp4" />
              </video>
              <div className="absolute top-1/2 -left-10 bg-aes-cyan p-10 rounded shadow-2xl transform -translate-y-1/2">
                <p className="text-6xl font-black mb-2 text-white">100%</p>
                <p className="font-bold tracking-widest uppercase text-xs text-aes-navy">Safety Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-aes-cyan font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-4">Client Success</h2>
              <h3 className="text-3xl md:text-5xl font-black text-aes-navy">Trusted Across Sydney</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="bg-slate-50 p-6 md:p-10 rounded border-t-4 border-aes-cyan shadow-sm relative">
                  <div className="text-aes-cyan flex gap-1 mb-4 md:mb-6 text-sm">
                    {[...Array(t.rating)].map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <p className="text-slate-700 italic mb-6 md:mb-8 leading-relaxed font-medium text-sm md:text-base">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-aes-navy rounded-full flex items-center justify-center font-bold text-white uppercase text-sm md:text-base">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-aes-navy text-sm md:text-base">{t.name}</p>
                      <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest">{t.role}</p>
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
              <div className="p-8 md:p-12 lg:p-20 flex-grow">
                <h3 className="text-3xl md:text-4xl font-black text-aes-navy mb-4 uppercase tracking-tighter">Get a Professional Quote</h3>
                <p className="text-slate-500 mb-8 md:mb-10 text-base md:text-lg">Speak with one of our environmental specialists today about your property needs.</p>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Full Name</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Phone Number</label>
                      <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Email Address</label>
                    <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Service Type</label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 md:px-6 md:py-4 focus:ring-2 focus:ring-aes-cyan outline-none transition-all appearance-none">
                        <option>Asbestos Removal</option>
                        <option>Meth Lab Cleanup</option>
                        <option>Soil Remediation</option>
                        <option>Other / Hazmat Audit</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-aes-navy hover:bg-aes-cyan text-white font-bold py-4 md:py-5 rounded transition-all uppercase tracking-widest shadow-lg text-sm md:text-base">
                    Submit Inquiry
                  </button>
                </form>
              </div>
              <div className="lg:w-[400px] bg-aes-navy p-8 md:p-12 lg:p-20 flex flex-col justify-center text-white">
                <div className="mb-8 md:mb-12">
                  <p className="text-aes-cyan font-bold uppercase tracking-widest text-[10px] mb-4">Contact Details</p>
                  <a href="tel:1300227658" className="text-2xl md:text-3xl font-black hover:text-aes-cyan transition-colors block">1300 ABSOLUTE</a>
                  <p className="text-slate-400 text-xs md:text-sm mt-2">(1300 227 658)</p>
                </div>
                <div className="mb-8 md:mb-12">
                  <p className="text-aes-cyan font-bold uppercase tracking-widest text-[10px] mb-4">Email Us</p>
                  <a href="mailto:info@aesaus.com.au" className="text-base md:text-lg font-bold hover:text-aes-cyan transition-colors break-words">info@aesaus.com.au</a>
                </div>
                <div>
                  <p className="text-aes-cyan font-bold uppercase tracking-widest text-[10px] mb-4">Location</p>
                  <p className="text-slate-300 font-medium text-sm md:text-base">Headquartered in NSW, servicing residential & commercial projects Australia-wide.</p>
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
            <span className="font-extrabold text-white tracking-widest text-xs md:text-sm uppercase">Absolute Environmental Services</span>
          </div>
          
          <div className="flex justify-center flex-wrap gap-x-6 md:gap-x-12 gap-y-4 mb-8 md:mb-12 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
            <span>ISO 9001 Certified</span>
            <span>ISO 14001 Certified</span>
            <span>ISO 45001 Certified</span>
          </div>

          <p className="text-[10px] md:text-xs max-w-2xl mx-auto leading-relaxed">
            © {new Date().getFullYear()} Absolute Environmental Services Pty Ltd. All hazardous materials are handled and disposed of in accordance with the Work Health and Safety Regulation 2017 and Environmental Protection Authority guidelines.
          </p>
          
          <div className="flex justify-center gap-4 md:gap-8 mt-8 md:mt-10 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-aes-cyan transition-colors">Privacy</a>
            <a href="#" className="hover:text-aes-cyan transition-colors">Safety Policy</a>
            <a href="#" className="hover:text-aes-cyan transition-colors">Complaints</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
