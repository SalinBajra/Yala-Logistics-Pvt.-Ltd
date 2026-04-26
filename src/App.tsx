/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "motion/react";
import { 
  Truck, 
  Ship, 
  Plane, 
  Warehouse, 
  ShieldCheck, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  Search,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Award,
  Users2,
  Instagram,
  Facebook
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import PickupModal from "./components/PickupModal";

const services = [
  {
    title: "Air Freight Forwarding",
    description: "Expedited global air transport solutions with direct and consolidated options.",
    icon: <Plane className="w-6 h-6" />,
  },
  {
    title: "Ocean Cargo Solutions",
    description: "Comprehensive FCL and LCL services for international sea freight requirements.",
    icon: <Ship className="w-6 h-6" />,
  },
  {
    title: "Land Transportation",
    description: "Regional trucking and containerized road transport across the subcontinent.",
    icon: <Truck className="w-6 h-6" />,
  },
  {
    title: "Contract Logistics",
    description: "End-to-end warehousing, distribution, and smart inventory management systems.",
    icon: <Warehouse className="w-6 h-6" />,
  }
];

const cargoRules = [
  {
    title: "IATA Dangerous Goods",
    description: "Strict adherence to Category 1-9 HAZMAT shipping protocols, ensuring the safe transit of specialized cargo across the fragile Himalayan ecosystem.",
    type: "Compliance"
  },
  {
    title: "Customs Clearances",
    description: "Leveraging Patan's historic legacy as a trade gateway to provide seamless documentation for South Asian corridors and global dry ports.",
    type: "Governance"
  },
  {
    title: "In-Bond Logistics",
    description: "Secure, climate-controlled terminal handling for international cargo awaiting statutory clearance in our high-security Kathmandu facilities.",
    type: "Network"
  }
];

  const Logo = ({ scrolled, className = "" }: { scrolled: boolean; className?: string }) => {
  return (
    <div className={`flex items-center gap-4 group cursor-pointer ${className}`}>
      {/* Icon Logo Part - Increased size for better visibility of details */}
      <div className="relative w-[60px] h-[60px] md:w-[75px] md:h-[75px] flex items-center justify-center overflow-visible">
        <img 
          src="/logo.png" 
          alt="Yala Logistics" 
          className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      
      {/* Text Logo Part - Refined spacing and leading to prevent clipping */}
      <div className="flex flex-col select-none uppercase py-1">
        <div className={`text-[18px] md:text-[22px] font-black leading-tight tracking-[0.02em] transition-colors ${scrolled ? "text-slate-900" : "text-white"}`}>
          YALA
        </div>
        <div className="text-[16px] md:text-[20px] font-black leading-normal tracking-[0.02em] text-brand-gold -mt-1">
          LOGISTICS
        </div>
        <div className={`text-[9px] md:text-[10px] font-black tracking-[0.25em] mt-1 transition-colors ${scrolled ? "text-slate-400" : "text-white/60"}`}>
          SINCE 2021
        </div>
      </div>
    </div>
  );
};

// Reveal animation component
const Reveal = ({ children, delay = 0, x = 0, y = 30 }: { children: React.ReactNode; delay?: number; x?: number; y?: number; [key: string]: any }) => (
  <motion.div
    initial={{ opacity: 0, x, y }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const TakeoffPlane = ({ triggerKey, x, y }: { triggerKey: number; x: number; y: number }) => (
  <AnimatePresence mode="popLayout">
    {triggerKey > 0 && (
      <div className="fixed z-[1000] pointer-events-none" style={{ left: x, top: y }}>
        <motion.div
          key={triggerKey}
          initial={{ opacity: 0, scale: 0.2, rotate: -45 }}
          animate={{ 
            x: [0, 2000], 
            y: [0, -2000], 
            rotate: -45, 
            opacity: [0, 1, 1, 0],
            scale: [0.2, 1.4, 1.4, 6]
          }}
          transition={{ duration: 3.2, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            {/* Vapor Trail */}
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: 1000 }}
               transition={{ duration: 3.2 }}
               className="absolute top-1/2 right-0 h-1 bg-gradient-to-l from-brand-gold/60 via-brand-gold/5 to-transparent blur-md -z-10 origin-right rotate-135"
               style={{ width: '2000px', transform: 'translate(100%, -50%) rotate(0deg)' }}
            />
            
            <Plane className="w-24 h-24 text-brand-gold fill-brand-gold drop-shadow-[0_0_60px_rgba(197,160,89,0.9)]" />
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.6, 0], scale: [1, 10] }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-brand-gold/50 rounded-full blur-[100px] -z-10"
            />
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Hero Transitions
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 2.5]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 200]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.4, 0.6], ["blur(0px)", "blur(10px)", "blur(40px)"]);
  const atmosphereOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.25], [0, -100]);
  const cloudOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [0.3, 0.8, 0]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [takeoffKey, setTakeoffKey] = useState(0);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsHovering(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTakeoff = (e?: React.PointerEvent | React.MouseEvent | React.FormEvent) => {
    if (e && 'clientX' in e) {
      setClickPos({ x: e.clientX, y: e.clientY });
    } else {
      // Default to center if no coordinates provided (e.g. manual trigger)
      setClickPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    setTakeoffKey(Date.now());
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;
    setIsTracking(true);
    handleTakeoff();
    setTimeout(() => {
      setIsTracking(false);
      alert(`Consignment Status for ${trackingId}: In Transit (Arrival Expected: 2 Days)`);
    }, 1800);
  };

  return (
    <div 
      className="min-h-screen font-sans antialiased bg-white text-slate-900 selection:bg-brand-gold selection:text-white relative cursor-none"
      onPointerDown={(e) => handleTakeoff(e)}
    >
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[1000] text-brand-gold mix-blend-difference hidden md:block"
        animate={{
          x: mousePos.x - 12,
          y: mousePos.y - 12,
          scale: isHovering ? 1.5 : 1,
          rotate: isHovering ? 45 : 0
        }}
        transition={{ type: "spring", damping: 25, stiffness: 250, mass: 0.5 }}
      >
        <Plane className="w-full h-full fill-current" />
      </motion.div>
      <PickupModal isOpen={isPickupOpen} onClose={() => setIsPickupOpen(false)} />
      <TakeoffPlane triggerKey={takeoffKey} x={clickPos.x} y={clickPos.y} />
      {/* Scroll Progress Indicator */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-brand-gold z-[110] origin-left" style={{ scaleX }} />

      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          scrolled ? "bg-white/95 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm" : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-full">
          <Logo scrolled={scrolled} className="mr-auto md:mr-12" />

          <div className="hidden md:flex items-center gap-8 h-full">
            {["Home", "Services", "Track", "About", "Rules", "Contact"].map((item) => (
              <a 
                key={`nav-desktop-${item}`} 
                href={`#${item.toLowerCase()}`}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${scrolled ? "text-brand-primary" : "text-white/80 hover:text-white"}`}
              >
                {item === "Rules" ? "Compliance" : item}
              </a>
            ))}
            <button 
              onClick={() => setIsPickupOpen(true)}
              className="btn-premium px-8 py-3 rounded-full text-[10px]"
            >
              Schedule Pickup
            </button>
          </div>

          <button 
            className="md:hidden p-2 text-brand-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-8 shadow-2xl md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-6">
                {["Home", "Services", "Track", "About", "Compliance", "Contact"].map((item) => (
                  <a 
                    key={`nav-mobile-${item}`} 
                    href={`#${item.toLowerCase() === "compliance" ? "rules" : item.toLowerCase()}`}
                    className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <button 
                  onClick={() => {
                    setIsPickupOpen(true);
                    setIsMenuOpen(false);
                  }} 
                  className="btn-premium w-full"
                >
                  Request Quote
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero Section: Aviation Sky Theme */}
        <section id="home" className="relative min-h-screen flex items-end pb-32 pt-32 overflow-hidden bg-brand-primary">
          {/* Layered Parallax Background */}
          <motion.div 
            style={{ y: heroY, scale: heroScale, filter: heroBlur }}
            className="absolute inset-0 z-0"
          >
             <img 
                src="/flight.jpg" 
                className="w-full h-full object-cover opacity-100"
                alt="Altosky"
                referrerPolicy="no-referrer"
             />
             
             {/* Atmospheric Descent Overlay - Gradual shift to Brand Primary */}
             <motion.div 
               style={{ opacity: atmosphereOpacity }}
               className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/40 to-transparent z-10"
             />

             {/* Light/Readability Overlay */}
             <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 via-brand-primary/20 to-transparent z-0" />
          </motion.div>

          {/* Artificial Cloud Drift Layer */}
          <motion.div 
            style={{ opacity: cloudOpacity }}
            className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
          >
             <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 h-64 w-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent blur-[120px] rotate-[-15deg]"
             />
             <motion.div 
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 h-48 w-[200%] bg-gradient-to-r from-transparent via-brand-sky-blue/5 to-transparent blur-[100px] rotate-[10deg]"
             />
          </motion.div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-30">
            <motion.div 
              style={{ opacity: contentOpacity, y: contentY }}
              className="max-w-3xl"
            >
              <Reveal>
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-16 h-1 bg-brand-gold rounded-full" />
                   <span className="text-brand-gold text-[11px] font-black uppercase tracking-[0.6em]">Premium Logistics Architecture</span>
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.82] mb-14 tracking-tighter uppercase italic">
                  Seamless.<br/>Secure.<br/><span className="text-brand-gold not-italic">Strategic.</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed mb-20 font-medium border-l-2 border-brand-gold/30 pl-8">
                  Empowering your business with premium logistics solutions since 2021. From Kathmandu to the world, we move your ambition forward with absolute precision.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                  <button 
                    onClick={handleTakeoff}
                    className="btn-premium px-14 py-7 rounded-full shadow-2xl shadow-black/40 text-[11px]"
                  >
                    Explore Operational Specs
                  </button>
                  <button 
                    onClick={() => {
                       document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                       handleTakeoff();
                    }}
                    className="flex items-center gap-5 text-white font-black uppercase tracking-[0.4em] text-[11px] group px-10 py-7 border border-white/10 rounded-full hover:bg-white/5 transition-all backdrop-blur-sm"
                  >
                    Track Cargo <ArrowRight className="w-4 h-4 text-brand-gold group-hover:translate-x-3 transition-transform" />
                  </button>
                </div>
              </Reveal>
            </motion.div>
          </div>

          {/* Cinematic Frame Border */}
          <div className="absolute inset-0 pointer-events-none z-40 border-[4vw] border-brand-primary/10 rounded-[5vw] hidden lg:block opacity-30" />
        </section>

         {/* Global Reach Stats Bar */}
        <div className="bg-brand-primary relative z-50 py-24 -mt-10 overflow-hidden border-y border-white/10">
           <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4 gap-12 text-left">
              {[
                { label: "Transit Points", value: "250+", desc: "Global Logistics Nodes" },
                { label: "Tonnage / Year", value: "1.2M+", desc: "International Throughput" },
                { label: "Cargo Safety", value: "99.9%", desc: "Reliability Index Score" },
                { label: "Active Fleets", value: "450+", desc: "Cross-Border Assets" }
              ].map((stat, i) => (
                <Reveal key={`stat-${stat.label}`} delay={i * 0.1} y={20}>
                   <div className="relative pl-8 border-l border-white/10 group">
                      <div className="absolute left-0 top-0 w-1 h-full bg-brand-gold/0 group-hover:bg-brand-gold transition-all duration-700" />
                      <div className="text-brand-gold text-5xl font-black italic tracking-tighter mb-2 transform transition-transform group-hover:translate-x-1">{stat.value}</div>
                      <div className="text-[12px] font-black uppercase tracking-[0.4em] text-white mb-1">{stat.label}</div>
                      <div className="text-[10px] font-medium text-white/50 uppercase tracking-widest">{stat.desc}</div>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>

        {/* Services Section */}
        <section id="services" className="py-40 bg-white relative overflow-hidden">
          {/* Subtle Network Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
             <Globe className="w-[800px] h-[800px] text-brand-primary" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <Reveal>
              <div className="mb-24">
                <div className="section-heading-label">Operational Prowess</div>
                <h2 className="text-5xl md:text-7xl font-black text-brand-primary leading-[0.85] uppercase italic">
                  Logistics <br/><span className="text-brand-gold not-italic">Redefined.</span>
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Reveal 
                  key={`service-${index}`} 
                  delay={index * 0.1} 
                  y={40}
                >
                  <div className="group h-full p-8 bg-white hover:bg-brand-primary transition-all duration-700 rounded-sm border border-slate-100 hover:border-brand-primary relative overflow-hidden flex flex-col min-h-[450px]">
                    {/* Hover Reveal Grid */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                       <div className="w-12 h-12 bg-slate-50 flex items-center justify-center text-brand-primary group-hover:bg-brand-gold group-hover:text-brand-primary transition-all duration-700 rounded-sm mb-10">
                         {service.icon}
                       </div>
                       <div className="mb-4 text-[9px] font-black uppercase tracking-[0.4em] text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-1000">Sector 0{index + 1}</div>
                       <h3 className="text-2xl font-black text-brand-primary group-hover:text-white mb-6 uppercase italic leading-[1.1] tracking-tighter">{service.title}</h3>
                       <p className="text-slate-400 group-hover:text-white/50 leading-relaxed font-medium transition-colors mb-10 flex-grow text-xs">{service.description}</p>
                       <div className="flex items-center gap-3 text-brand-primary group-hover:text-brand-gold text-[9px] font-black uppercase tracking-[0.4em] mt-auto">
                         <span className="w-6 h-px bg-current" />
                         Engage
                       </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.4}>
              <div id="track" className="mt-32 max-w-4xl bg-slate-900 p-[1px] rounded-sm shadow-2xl border border-white/5 mx-auto overflow-hidden">
                 <form onSubmit={handleTrack} className="flex flex-col md:flex-row items-stretch">
                    <div className="flex-1 bg-brand-primary px-8 py-6 flex flex-col gap-4 group/track">
                       <div className="flex justify-between items-center">
                          <div className="text-[9px] font-black uppercase tracking-[0.5em] text-brand-gold flex items-center gap-3">
                             <Search className="w-3.5 h-3.5" />
                             Secure Consignment Validation
                          </div>
                          <div className="hidden md:flex gap-6">
                             <div className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                               <span className="w-1 h-1 bg-brand-gold rounded-full" />
                               LHR - KTM
                             </div>
                             <div className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                               <span className="w-1 h-1 bg-brand-gold rounded-full" />
                               AES-256
                             </div>
                          </div>
                       </div>
                       <input 
                         type="text" 
                         value={trackingId}
                         onChange={(e) => setTrackingId(e.target.value)}
                         placeholder="ENTER CARGO ID (E.G. YALA-992-X)" 
                         className="w-full bg-transparent border-none focus:ring-0 text-xl font-bold italic tracking-tight text-white placeholder:text-white/30 uppercase py-1"
                       />
                       <div className="flex gap-8 border-t border-white/10 pt-4">
                          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
                            Status: System Ready
                          </div>
                          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 bg-brand-gold/60 rounded-full" />
                            Session: Active
                          </div>
                       </div>
                    </div>
                    <button className="bg-brand-gold text-brand-primary hover:bg-white transition-all duration-700 px-14 flex items-center justify-center gap-4 group relative overflow-hidden group/btn">
                       <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-700 origin-left" />
                       <span className="text-[9px] font-black uppercase tracking-[0.5em] relative z-10">Initialize</span>
                       <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-3 transition-transform relative z-10" />
                    </button>
                 </form>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Heritage Section (Expanded About Us) */}
        <section id="about" className="py-40 bg-slate-900 relative overflow-hidden border-t border-white/5">
          {/* Subtle Grid Infrastructure */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px]" />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-32 items-center">
              <div className="lg:w-1/2">
                <Reveal x={-30}>
                  <div className="mb-20">
                     <div className="text-brand-gold text-[10px] font-black tracking-[0.8em] mb-6 uppercase flex items-center gap-4">
                        <span className="w-12 h-px bg-brand-gold/30" />
                        Established // 2021
                     </div>
                     <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.8] uppercase italic tracking-tighter">
                       Heritage <br/><span className="text-brand-gold not-italic">Arrival.</span>
                     </h2>
                  </div>
                  
                  <div className="space-y-12">
                    <p className="text-2xl md:text-4xl text-white/90 leading-[1.1] italic font-light tracking-tight">
                      "Derived from the ancient Newari name for <span className="text-brand-gold">Patan</span>, Yala represents a legacy of synthesized motion."
                    </p>
                    <p className="text-slate-400 leading-relaxed text-base font-medium max-w-xl">
                      Rooted in the cultural heart of the valley, Yala Logistics Pvt. Ltd honors the heritage of Patan—a historic hub of trade and craftsmanship. We bridge the gap between global shipping complexity and local operational agility. Since 2021, we have been the silent engine behind some of the region's most critical supply chains.
                    </p>
                  </div>

                  <div className="mt-20 grid grid-cols-2 gap-12 border-t border-white/10 pt-20">
                     <div className="group">
                        <h4 className="text-brand-gold font-black uppercase text-[11px] tracking-[0.3em] mb-4 group-hover:translate-x-2 transition-transform italic">Strategic Vision</h4>
                        <p className="text-slate-500 text-xs leading-relaxed font-medium">Architecting the future of Himalayan trade through digital-first logistics infrastructure.</p>
                     </div>
                     <div className="group">
                        <h4 className="text-brand-gold font-black uppercase text-[11px] tracking-[0.3em] mb-4 group-hover:translate-x-2 transition-transform italic">Core Mandate</h4>
                        <p className="text-slate-500 text-xs leading-relaxed font-medium">Unerring reliability and precision in every consignment, regardless of terrain or scale.</p>
                     </div>
                  </div>
                </Reveal>
              </div>

              <div className="lg:w-1/2 w-full">
                <Reveal x={30}>
                  <div className="relative group p-2 bg-white/5 rounded-none overflow-hidden border border-white/10 aspect-[4/5]">
                     <img 
                       src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200" 
                       className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100"
                       alt="Logistics center"
                       referrerPolicy="no-referrer"
                     />
                     {/* Data Mask Overlay */}
                     <div className="absolute inset-0 px-8 py-12 flex flex-col justify-end pointer-events-none">
                        <div className="bg-brand-primary/90 backdrop-blur-md p-10 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                           <div className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em] mb-2">Protocol 442-A</div>
                           <div className="text-3xl font-black text-white uppercase italic italic">Precision Terminal</div>
                        </div>
                     </div>
                     <div className="absolute top-8 right-8 text-[10px] font-mono text-white/20 uppercase tracking-widest leading-none">
                        LAT: 27.7172° N <br/> LON: 85.3240° E
                     </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Global Compliance Section (Cargo Rules) */}
        <section id="rules" className="py-40 bg-zinc-950 relative overflow-hidden border-t border-white/5">
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-20 left-10 w-px h-64 bg-brand-gold/50" />
              <div className="absolute bottom-20 right-10 w-px h-64 bg-brand-gold/50" />
           </div>

           <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
             <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
               <Reveal>
                 <div className="section-heading-label !text-brand-gold">Statutory Boundaries</div>
                 <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.85] uppercase italic">
                   Global <br/><span className="text-brand-gold not-italic">Standards.</span>
                 </h2>
               </Reveal>
               <Reveal delay={0.2}>
                 <p className="max-w-md text-zinc-500 font-medium text-sm leading-relaxed">
                   Comprehensive adherence to international maritime and aviation protocols ensures your cargo crosses borders without friction.
                 </p>
               </Reveal>
             </div>

             <div className="grid lg:grid-cols-3 gap-0 border border-white/10 overflow-hidden">
                {cargoRules.map((rule, idx) => (
                  <Reveal key={`rule-${idx}`} delay={idx * 0.1} y={0} x={0}>
                    <div className="h-full bg-transparent border-r border-white/10 last:border-r-0 p-16 hover:bg-brand-gold group transition-all duration-700 cursor-crosshair">
                       <span className="text-brand-gold group-hover:text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] mb-12 block transition-colors">Protocol Ref. 0{idx + 1}</span>
                       <h3 className="text-4xl font-black text-white group-hover:text-brand-primary italic mb-10 leading-[0.9] uppercase tracking-tighter transition-colors">{rule.title}</h3>
                       <p className="text-zinc-500 group-hover:text-brand-primary/70 text-sm leading-relaxed mb-12 transition-colors font-medium">{rule.description}</p>
                       <div className="flex items-center justify-between mt-auto">
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700 group-hover:text-brand-primary/40">{rule.type}</span>
                          <ArrowRight className="w-5 h-5 text-brand-gold group-hover:text-brand-primary transform -rotate-45 group-hover:rotate-0 transition-all duration-500" />
                       </div>
                    </div>
                  </Reveal>
                ))}
             </div>
           </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-40 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-0 items-stretch bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100">
              <div className="lg:w-7/12 p-12 lg:p-20">
                <Reveal>
                  <div className="mb-16">
                     <div className="section-heading-label">Inquiry Hub</div>
                     <h2 className="text-5xl md:text-6xl font-black text-brand-primary leading-[0.85] uppercase italic">
                       Landing <br/><span className="text-brand-gold not-italic">Procedures.</span>
                     </h2>
                  </div>
                  
                  <form className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Name</label>
                         <input type="text" placeholder="Professional Name" className="input-premium focus:bg-slate-50" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</label>
                         <input type="email" placeholder="Business Email" className="input-premium focus:bg-slate-50" />
                      </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mission Context</label>
                       <textarea rows={4} placeholder="Logistics requirements..." className="input-premium focus:bg-slate-50 resize-none" />
                    </div>
                    <button className="btn-premium w-full py-6 rounded-xl hover:shadow-2xl">Initialize Contact</button>
                  </form>
                </Reveal>
              </div>

              <div className="lg:w-5/12 bg-brand-primary p-12 lg:p-20 text-white flex flex-col justify-between">
                 <div className="relative z-10">
                    <span className="text-brand-gold font-black uppercase text-[10px] tracking-[0.5em] block mb-10">Coordinates</span>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-20">Kathmandu <br/>Logistics Center.</h3>
                    
                    <div className="space-y-10">
                      <div className="flex items-center gap-8">
                         <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold rounded-xl">
                            <Phone className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest mb-1">Direct Line</p>
                            <p className="text-xl font-black italic">+977 9818888905</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold rounded-xl">
                            <Mail className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest mb-1">Email Dispatch</p>
                            <p className="text-lg font-black italic">info@yalalogistics.com.np</p>
                         </div>
                      </div>
                    </div>
                 </div>

                 <div className="flex gap-4 pt-20">
                    <a href="https://www.facebook.com/yalalogistics/" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-brand-gold hover:border-brand-gold transition-all rounded-full">
                       <Facebook className="w-5 h-5" />
                    </a>
                    <a href="https://www.instagram.com/yalalogistics/" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-brand-gold hover:border-brand-gold transition-all rounded-full">
                       <Instagram className="w-5 h-5" />
                    </a>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-brand-primary/80 backdrop-blur-xl py-24 text-white border-t border-white/10 relative overflow-hidden">
        {/* Globe Background Watermark */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
           <Globe className="absolute -right-1/4 -bottom-1/4 w-[1000px] h-[1000px] text-brand-gold animate-spin-slow" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(197,160,89,0.15),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          <div className="space-y-8">
             <Logo scrolled={false} />
             <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                Premier logistics and supply chain services provider in the Himalayan region since 2021.
             </p>
          </div>

          <div className="space-y-8">
             <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-brand-gold">Services</h4>
             <ul className="space-y-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
               <li className="hover:text-brand-gold cursor-pointer transition-colors"><a href="#rules">Dangerous Goods</a></li>
               <li className="hover:text-brand-gold cursor-pointer transition-colors"><a href="#rules">Customs Brokerage</a></li>
               <li className="hover:text-brand-gold cursor-pointer transition-colors">Global Network</li>
             </ul>
          </div>

          <div className="space-y-8">
             <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-brand-gold">Quick Links</h4>
             <ul className="space-y-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
               <li className="hover:text-brand-gold cursor-pointer transition-colors">Consignment Tracking</li>
               <li className="hover:text-brand-gold cursor-pointer transition-colors">Global Footprint</li>
               <li className="hover:text-brand-gold cursor-pointer transition-colors">Governance</li>
               <li className="hover:text-brand-gold cursor-pointer transition-colors">Client Login</li>
             </ul>
          </div>

          <div className="space-y-8">
             <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-brand-gold">Contact</h4>
             <div className="text-white/60 text-[10px] font-black uppercase tracking-widest leading-loose space-y-2">
                <p className="flex items-center gap-3"><MapPin className="w-3 h-3 text-brand-gold" /> Kathmandu, Nepal</p>
                <p className="flex items-center gap-3"><Phone className="w-3 h-3 text-brand-gold" /> +977 9818888905</p>
                <p className="flex items-center gap-3"><Mail className="w-3 h-3 text-brand-gold" /> info@yalalogistics.com.np</p>
             </div>
             <div className="flex gap-4 pt-4">
                <a href="https://www.facebook.com/yalalogistics/" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/30 hover:text-brand-gold hover:border-brand-gold transition-all">
                   <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/yalalogistics/" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/30 hover:text-brand-gold hover:border-brand-gold transition-all">
                   <Instagram className="w-4 h-4" />
                </a>
             </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 relative z-10">
           <span>&copy; {new Date().getFullYear()} Yala Logistics Pvt. Ltd.</span>
           <div className="flex gap-12">
              <span className="hover:text-brand-gold cursor-pointer transition-colors">Digital Privacy</span>
              <span className="hover:text-brand-gold cursor-pointer transition-colors">Terms of Carriage</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
