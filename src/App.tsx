/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from "motion/react";
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
  Facebook,
  Sun,
  Moon,
  Package
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import PickupModal from "./components/PickupModal";
import AdminDashboard from "./components/Admin/Dashboard";
import { shipmentService, ShipmentData } from "./services/shipmentService";

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

  const Logo = ({ scrolled, isDarkMode, className = "" }: { scrolled: boolean; isDarkMode: boolean; className?: string }) => {
  return (
    <div className={`flex items-center gap-4 group cursor-pointer ${className}`}>
      {/* Icon Logo Part */}
      <div className="relative w-[60px] h-[60px] md:w-[75px] md:h-[75px] flex items-center justify-center overflow-visible">
        <img 
          src="/logo.png" 
          alt="Yala Logistics" 
          className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      
      {/* Text Logo Part */}
      <div className="flex flex-col select-none uppercase py-1">
        <div className={`text-[18px] md:text-[22px] font-black leading-tight tracking-[0.02em] transition-colors ${scrolled ? (isDarkMode ? "text-white" : "text-slate-900") : "text-white"}`}>
          YALA
        </div>
        <div className="text-[16px] md:text-[20px] font-black leading-normal tracking-[0.02em] text-brand-gold -mt-1">
          LOGISTICS
        </div>
        <div className={`text-[9px] md:text-[10px] font-black tracking-[0.25em] mt-1 transition-colors ${scrolled ? (isDarkMode ? "text-white/40" : "text-slate-400") : "text-white/60"}`}>
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
  const [view, setView] = useState<'landing' | 'admin'>('landing');
  const [takeoffKey, setTakeoffKey] = useState(0);
  const [trackingResult, setTrackingResult] = useState<ShipmentData | null>(null);
  const [trackingError, setTrackingError] = useState("");
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("yala-theme");
      return saved ? saved === "dark" : true; // Default to dark for branding
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("yala-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

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

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;
    setIsTracking(true);
    setTrackingError("");
    handleTakeoff();
    
    try {
      const result = await shipmentService.getShipment(trackingId.trim().toUpperCase());
      setTimeout(() => {
        setIsTracking(false);
        if (result) {
          setTrackingResult(result);
        } else {
          setTrackingError("Invalid Tracking Protocol. ID Not Recognized.");
        }
      }, 1500);
    } catch (err) {
      setIsTracking(false);
      setTrackingError("Communication Failure with Kathmandu Terminal.");
    }
  };

  if (view === 'admin') {
    return (
      <div className={isDarkMode ? "dark" : ""}>
        <AdminDashboard isDarkMode={isDarkMode} />
        <button 
          onClick={() => setView('landing')}
          className="fixed bottom-8 left-8 z-[200] btn-premium px-6 py-3 rounded-xl text-[10px]"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen font-sans antialiased selection:bg-brand-gold selection:text-white relative transition-colors duration-500 ${isDarkMode ? "dark bg-brand-primary text-white" : "bg-white text-slate-900"}`}
      onPointerDown={(e) => handleTakeoff(e)}
    >
      <PickupModal isOpen={isPickupOpen} onClose={() => setIsPickupOpen(false)} isDarkMode={isDarkMode} />
      <TakeoffPlane triggerKey={takeoffKey} x={clickPos.x} y={clickPos.y} />
      {/* Scroll Progress Indicator */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-brand-gold z-[110] origin-left" style={{ scaleX }} />

      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          scrolled ? (isDarkMode ? "bg-[#0a1128]/95 backdrop-blur-md border-b border-white/5 py-4 shadow-2xl" : "bg-white/95 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm") : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-full">
          <Logo scrolled={scrolled} isDarkMode={isDarkMode} className="mr-auto md:mr-12" />

          <div className="hidden md:flex items-center gap-8 h-full">
            {["Home", "Services", "Track", "About", "Rules", "Contact"].map((item) => (
              <a 
                key={`nav-desktop-${item}`} 
                href={`#${item.toLowerCase()}`}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${scrolled ? (isDarkMode ? "text-white" : "text-brand-primary") : "text-white/80 hover:text-white"}`}
              >
                {item === "Rules" ? "Compliance" : item}
              </a>
            ))}
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all duration-500 ${scrolled ? (isDarkMode ? "bg-white/5 text-brand-gold" : "bg-slate-100 text-brand-primary") : "bg-white/10 text-brand-gold hover:bg-white/20"}`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

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
              className={`absolute top-full left-0 w-full border-b p-8 shadow-2xl md:hidden overflow-hidden transition-colors duration-500 ${
                isDarkMode ? "bg-brand-primary border-white/5" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${isDarkMode ? "text-white/40" : "text-slate-400"}`}>Navigation</span>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-2 rounded-full transition-all duration-500 ${isDarkMode ? "bg-white/5 text-brand-gold" : "bg-slate-100 text-brand-primary"}`}
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>
                {["Home", "Services", "Track", "About", "Compliance", "Contact"].map((item) => (
                  <a 
                    key={`nav-mobile-${item}`} 
                    href={`#${item.toLowerCase() === "compliance" ? "rules" : item.toLowerCase()}`}
                    className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors ${isDarkMode ? "text-white hover:text-brand-gold" : "text-brand-primary hover:text-brand-gold"}`}
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
        <section id="home" className={`relative min-h-screen flex items-end pb-32 pt-32 overflow-hidden transition-colors duration-500 ${isDarkMode ? "bg-brand-primary" : "bg-slate-50"}`}>
          {/* Layered Parallax Background */}
          <motion.div 
            style={{ y: heroY, scale: heroScale, filter: heroBlur }}
            className="absolute inset-0 z-0"
          >
             <img 
                src="/flight.jpg" 
                className={`w-full h-full object-cover transition-all duration-700 ${isDarkMode ? "opacity-100" : "opacity-40 grayscale-[0.5]"}`}
                alt="Altosky"
                referrerPolicy="no-referrer"
             />
             
             {/* Atmospheric Descent Overlay */}
             <motion.div 
               style={{ opacity: atmosphereOpacity }}
               className={`absolute inset-0 bg-gradient-to-t z-10 transition-colors duration-500 ${
                 isDarkMode ? "from-brand-primary via-brand-primary/40 to-transparent" : "from-slate-50 via-slate-50/40 to-transparent"
               }`}
             />

             {/* Light/Readability Overlay */}
             <div className={`absolute inset-0 z-0 transition-colors duration-500 ${
               isDarkMode ? "bg-gradient-to-r from-brand-primary/80 via-brand-primary/20 to-transparent" : "bg-gradient-to-r from-slate-50/80 via-transparent to-transparent"
             }`} />
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
                <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black leading-[0.82] mb-14 tracking-tighter uppercase italic transition-colors duration-500 ${isDarkMode ? "text-white" : "text-brand-primary"}`}>
                  Seamless.<br/>Secure.<br/><span className="text-brand-gold not-italic">Strategic.</span>
                </h1>
                <p className={`text-xl md:text-2xl max-w-2xl leading-relaxed mb-20 font-medium border-l-2 border-brand-gold/30 pl-8 transition-colors duration-500 ${isDarkMode ? "text-white/70" : "text-brand-primary/70"}`}>
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
                    className={`flex items-center gap-5 font-black uppercase tracking-[0.4em] text-[11px] group px-10 py-7 border transition-all backdrop-blur-sm rounded-full ${
                      isDarkMode ? "text-white border-white/10 hover:bg-white/5" : "text-brand-primary border-brand-primary/10 hover:bg-brand-primary/5 shadow-lg shadow-black/5"
                    }`}
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
        <div className={`relative z-50 py-24 -mt-10 overflow-hidden border-y transition-all duration-500 ${
          isDarkMode ? "bg-brand-primary border-white/10" : "bg-slate-50 border-slate-200"
        }`}>
           <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4 gap-12 text-left">
              {[
                { label: "Transit Points", value: "250+", desc: "Global Logistics Nodes" },
                { label: "Tonnage / Year", value: "1.2M+", desc: "International Throughput" },
                { label: "Cargo Safety", value: "99.9%", desc: "Reliability Index Score" },
                { label: "Active Fleets", value: "450+", desc: "Cross-Border Assets" }
              ].map((stat, i) => (
                <Reveal key={`stat-${stat.label}`} delay={i * 0.1} y={20}>
                   <div className={`relative pl-8 border-l transition-colors group ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
                      <div className="absolute left-0 top-0 w-1 h-full bg-brand-gold/0 group-hover:bg-brand-gold transition-all duration-700" />
                      <div className="text-brand-gold text-5xl font-black italic tracking-tighter mb-2 transform transition-transform group-hover:translate-x-1">{stat.value}</div>
                      <div className={`text-[12px] font-black uppercase tracking-[0.4em] mb-1 transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>{stat.label}</div>
                      <div className={`text-[10px] font-medium uppercase tracking-widest transition-colors ${isDarkMode ? "text-white/50" : "text-slate-400"}`}>{stat.desc}</div>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>

        {/* Services Section */}
        <section id="services" className={`py-40 relative transition-colors duration-500 overflow-hidden ${isDarkMode ? "bg-brand-primary" : "bg-white"}`}>
          {/* Subtle Network Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
             <Globe className={`w-[800px] h-[800px] ${isDarkMode ? "text-brand-gold" : "text-brand-primary"}`} />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <Reveal>
              <div className="mb-24">
                <div className="section-heading-label">Operational Prowess</div>
                <h2 className={`text-5xl md:text-7xl font-black leading-[0.85] uppercase italic transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>
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
                  <div className={`group h-full p-8 transition-all duration-700 rounded-sm border relative overflow-hidden flex flex-col min-h-[450px] ${
                    isDarkMode 
                      ? "bg-white/5 border-white/5 hover:bg-brand-gold hover:border-brand-gold" 
                      : "bg-white border-slate-100 hover:bg-brand-primary hover:border-brand-primary"
                  }`}>
                    {/* Hover Reveal Grid */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                       <div className={`w-12 h-12 flex items-center justify-center transition-all duration-700 rounded-sm mb-10 ${
                         isDarkMode 
                           ? "bg-white/5 text-brand-gold group-hover:bg-brand-primary group-hover:text-brand-gold" 
                           : "bg-slate-50 text-brand-primary group-hover:bg-brand-gold group-hover:text-brand-primary"
                       }`}>
                         {service.icon}
                       </div>
                       <div className="mb-4 text-[9px] font-black uppercase tracking-[0.4em] text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-1000">Sector 0{index + 1}</div>
                       <h3 className={`text-2xl font-black mb-6 uppercase italic leading-[1.1] tracking-tighter transition-colors ${
                         isDarkMode ? "text-white group-hover:text-brand-primary" : "text-brand-primary group-hover:text-white"
                       }`}>{service.title}</h3>
                       <p className={`leading-relaxed font-medium transition-colors mb-10 flex-grow text-xs ${
                         isDarkMode ? "text-white/40 group-hover:text-brand-primary/60" : "text-slate-400 group-hover:text-white/50"
                       }`}>{service.description}</p>
                       <div className={`flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] mt-auto transition-colors ${
                         isDarkMode ? "text-brand-gold group-hover:text-brand-primary" : "text-brand-primary group-hover:text-brand-gold"
                       }`}>
                         <span className="w-6 h-px bg-current" />
                         Engage
                       </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.4}>
              <div id="track" className={`mt-32 max-w-4xl p-[1px] rounded-sm shadow-2xl transition-colors duration-500 mx-auto overflow-hidden ${
                isDarkMode ? "bg-slate-900 border border-white/5" : "bg-slate-200 border border-slate-200"
              }`}>
                 <form onSubmit={handleTrack} className="flex flex-col md:flex-row items-stretch">
                    <div className={`flex-1 px-8 py-6 flex flex-col gap-4 group/track transition-colors duration-500 ${
                      isDarkMode ? "bg-brand-primary" : "bg-white"
                    }`}>
                       <div className="flex justify-between items-center">
                          <div className="text-[9px] font-black uppercase tracking-[0.5em] text-brand-gold flex items-center gap-3">
                             <Search className="w-3.5 h-3.5" />
                             Secure Consignment Validation
                          </div>
                          <div className="hidden md:flex gap-6">
                             <div className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${isDarkMode ? "text-white/40" : "text-slate-400"}`}>
                               <span className="w-1 h-1 bg-brand-gold rounded-full" />
                               LHR - KTM
                             </div>
                             <div className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${isDarkMode ? "text-white/40" : "text-slate-400"}`}>
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
                         className={`w-full bg-transparent border-none focus:ring-0 text-xl font-bold italic tracking-tight uppercase py-1 transition-colors ${
                           isDarkMode ? "text-white placeholder:text-white/30" : "text-brand-primary placeholder:text-slate-300"
                         }`}
                       />
                       <div className={`flex gap-8 border-t pt-4 transition-colors ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
                          <div className={`text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 transition-colors ${isDarkMode ? "text-white/70" : "text-slate-500"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${trackingError ? "bg-red-500" : trackingResult ? "bg-green-500" : "bg-brand-gold"}`} />
                            {trackingError || (trackingResult ? `Status: ${trackingResult.status}` : "Status: System Ready")}
                          </div>
                          <div className={`text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 transition-colors ${isDarkMode ? "text-white/70" : "text-slate-500"}`}>
                            <span className="w-1.5 h-1.5 bg-brand-gold/60 rounded-full" />
                            Session: Active
                          </div>
                       </div>
                    </div>
                    <button className="bg-brand-gold text-brand-primary hover:bg-white transition-all duration-700 px-14 flex items-center justify-center gap-4 group relative overflow-hidden group/btn">
                       <div className={`absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-700 origin-left ${isDarkMode ? "bg-white" : "bg-brand-primary"}`} />
                       <span className="text-[9px] font-black uppercase tracking-[0.5em] relative z-10">Initialize</span>
                       <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-3 transition-transform relative z-10" />
                    </button>
                 </form>

                 <AnimatePresence>
                   {trackingResult && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: "auto", opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className={`border-t transition-colors ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-100"}`}
                     >
                       <div className="p-8 md:p-12">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold">
                               <Package className="w-6 h-6" />
                             </div>
                             <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Validated Consignment</p>
                               <h4 className="text-xl font-black italic">{trackingResult.trackingNumber}</h4>
                             </div>
                           </div>
                           <div className="flex items-center gap-6">
                             <div className="text-right">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Vector</p>
                               <p className="text-sm font-black text-brand-gold uppercase">{trackingResult.status}</p>
                             </div>
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                               isDarkMode ? "bg-white/5" : "bg-white border"
                             }`}>
                               <Truck className="w-6 h-6 text-brand-gold" />
                             </div>
                           </div>
                         </div>

                         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                           <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Service Type</p>
                             <p className="text-xs font-bold uppercase">{trackingResult.cargo.type}</p>
                           </div>
                           <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Load Capacity</p>
                             <p className="text-xs font-bold uppercase">{trackingResult.cargo.weight} KG</p>
                           </div>
                           <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Commodity Class</p>
                             <p className="text-xs font-bold uppercase">{trackingResult.cargo.commodity}</p>
                           </div>
                           <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Invoice Ref</p>
                             <p className="text-xs font-bold uppercase">{trackingResult.quote.id}</p>
                           </div>
                         </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Heritage Section (Expanded About Us) */}
        <section id="about" className={`py-40 relative overflow-hidden border-t transition-colors duration-500 ${
          isDarkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-100"
        }`}>
          {/* Subtle Grid Infrastructure */}
          <div className={`absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] ${
            !isDarkMode && "invert opacity-[0.05]"
          }`} />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-32 items-center">
              <div className="lg:w-1/2">
                <Reveal x={-30}>
                  <div className="mb-20">
                     <div className="text-brand-gold text-[10px] font-black tracking-[0.8em] mb-6 uppercase flex items-center gap-4">
                        <span className="w-12 h-px bg-brand-gold/30" />
                        Established // 2021
                     </div>
                     <h2 className={`text-6xl md:text-8xl font-black leading-[0.8] uppercase italic tracking-tighter transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>
                       Heritage <br/><span className="text-brand-gold not-italic">Arrival.</span>
                     </h2>
                  </div>
                  
                  <div className="space-y-12">
                    <p className={`text-2xl md:text-4xl leading-[1.1] italic font-light tracking-tight transition-colors ${isDarkMode ? "text-white/90" : "text-brand-primary"}`}>
                      "Derived from the ancient Newari name for <span className="text-brand-gold">Patan</span>, Yala represents a legacy of synthesized motion."
                    </p>
                    <p className={`leading-relaxed text-base font-medium max-w-xl transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Rooted in the cultural heart of the valley, Yala Logistics Pvt. Ltd honors the heritage of Patan—a historic hub of trade and craftsmanship. We bridge the gap between global shipping complexity and local operational agility. Since 2021, we have been the silent engine behind some of the region's most critical supply chains.
                    </p>
                  </div>

                  <div className={`mt-20 grid grid-cols-2 gap-12 border-t pt-20 transition-colors ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
                     <div className="group">
                        <h4 className="text-brand-gold font-black uppercase text-[11px] tracking-[0.3em] mb-4 group-hover:translate-x-2 transition-transform italic">Strategic Vision</h4>
                        <p className={`text-xs leading-relaxed font-medium transition-colors ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Architecting the future of Himalayan trade through digital-first logistics infrastructure.</p>
                     </div>
                     <div className="group">
                        <h4 className="text-brand-gold font-black uppercase text-[11px] tracking-[0.3em] mb-4 group-hover:translate-x-2 transition-transform italic">Core Mandate</h4>
                        <p className={`text-xs leading-relaxed font-medium transition-colors ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Unerring reliability and precision in every consignment, regardless of terrain or scale.</p>
                     </div>
                  </div>
                </Reveal>
              </div>

              <div className="lg:w-1/2 w-full">
                <Reveal x={30}>
                  <div className={`relative group p-2 rounded-none overflow-hidden border aspect-[4/5] transition-colors ${
                    isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                  }`}>
                     <img 
                       src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200" 
                       className={`w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100 ${!isDarkMode && "contrast-110"}`}
                       alt="Logistics center"
                       referrerPolicy="no-referrer"
                     />
                     {/* Data Mask Overlay */}
                     <div className="absolute inset-0 px-8 py-12 flex flex-col justify-end pointer-events-none">
                        <div className={`backdrop-blur-md p-10 transform translate-y-10 group-hover:translate-y-0 transition-all duration-700 ${
                          isDarkMode ? "bg-brand-primary/90" : "bg-white/90"
                        }`}>
                           <div className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em] mb-2 font-mono">Protocol 442-A</div>
                           <div className={`text-3xl font-black uppercase italic transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>Precision Terminal</div>
                        </div>
                     </div>
                     <div className={`absolute top-8 right-8 text-[10px] font-mono uppercase tracking-widest leading-none ${isDarkMode ? "text-white/20" : "text-slate-400/40"}`}>
                        LAT: 27.7172° N <br/> LON: 85.3240° E
                     </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Global Compliance Section (Cargo Rules) */}
        <section id="rules" className={`py-40 relative overflow-hidden border-t transition-colors duration-500 ${
          isDarkMode ? "bg-zinc-950 border-white/5" : "bg-slate-50 border-slate-200"
        }`}>
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-20 left-10 w-px h-64 bg-brand-gold/50" />
              <div className="absolute bottom-20 right-10 w-px h-64 bg-brand-gold/50" />
           </div>

           <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
             <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
               <Reveal>
                 <div className="section-heading-label !text-brand-gold">Statutory Boundaries</div>
                 <h2 className={`text-5xl md:text-7xl font-black leading-[0.85] uppercase italic transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>
                   Global <br/><span className="text-brand-gold not-italic">Standards.</span>
                 </h2>
               </Reveal>
               <Reveal delay={0.2}>
                 <p className={`max-w-md font-medium text-sm leading-relaxed transition-colors ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>
                   Comprehensive adherence to international maritime and aviation protocols ensures your cargo crosses borders without friction.
                 </p>
               </Reveal>
             </div>

             <div className={`grid lg:grid-cols-3 gap-0 border overflow-hidden transition-colors ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
                {cargoRules.map((rule, idx) => (
                  <Reveal key={`rule-${idx}`} delay={idx * 0.1} y={0} x={0}>
                    <div className={`h-full bg-transparent border-r p-16 hover:bg-brand-gold group transition-all duration-700 cursor-crosshair transition-colors ${
                      isDarkMode ? "border-white/10" : "border-slate-200"
                    } last:border-r-0`}>
                       <span className="text-brand-gold group-hover:text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] mb-12 block transition-colors">Protocol Ref. 0{idx + 1}</span>
                       <h3 className={`text-4xl font-black group-hover:text-brand-primary italic mb-10 leading-[0.9] uppercase tracking-tighter transition-colors ${
                         isDarkMode ? "text-white" : "text-brand-primary"
                       }`}>{rule.title}</h3>
                       <p className={`group-hover:text-brand-primary/70 text-sm leading-relaxed mb-12 transition-colors font-medium ${
                         isDarkMode ? "text-zinc-500" : "text-slate-500"
                       }`}>{rule.description}</p>
                       <div className="flex items-center justify-between mt-auto">
                          <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                            isDarkMode ? "text-zinc-700 group-hover:text-brand-primary/40" : "text-slate-400 group-hover:text-brand-primary/30"
                          }`}>{rule.type}</span>
                          <ArrowRight className="w-5 h-5 text-brand-gold group-hover:text-brand-primary transform -rotate-45 group-hover:rotate-0 transition-all duration-500" />
                       </div>
                    </div>
                  </Reveal>
                ))}
             </div>
           </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={`py-40 relative transition-colors duration-500 overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className={`flex flex-col lg:flex-row gap-0 items-stretch shadow-2xl rounded-3xl overflow-hidden border transition-colors duration-500 ${
              isDarkMode ? "bg-brand-primary border-white/5" : "bg-white border-slate-100"
            }`}>
              <div className="lg:w-7/12 p-12 lg:p-20">
                <Reveal>
                  <div className="mb-16">
                     <div className="section-heading-label">Inquiry Hub</div>
                     <h2 className={`text-5xl md:text-6xl font-black leading-[0.85] uppercase italic transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>
                       Landing <br/><span className="text-brand-gold not-italic">Procedures.</span>
                     </h2>
                  </div>
                  
                  <form className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Name</label>
                         <input type="text" placeholder="Professional Name" className={`input-premium focus:bg-slate-50 ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</label>
                         <input type="email" placeholder="Business Email" className={`input-premium focus:bg-slate-50 ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} />
                      </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mission Context</label>
                       <textarea rows={4} placeholder="Logistics requirements..." className={`input-premium focus:bg-slate-50 resize-none ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} />
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
      <footer className={`transition-colors duration-500 py-24 relative overflow-hidden backdrop-blur-xl ${
        isDarkMode ? "bg-brand-primary/80 text-white border-t border-white/10" : "bg-slate-100 text-brand-primary border-t border-slate-200"
      }`}>
        {/* Globe Background Watermark */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
           <Globe className="absolute -right-1/4 -bottom-1/4 w-[1000px] h-[1000px] text-brand-gold animate-spin-slow" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(197,160,89,0.15),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          <div className="space-y-8">
             <Logo scrolled={false} isDarkMode={isDarkMode} />
             <p className={`text-sm leading-relaxed max-w-xs transition-colors ${isDarkMode ? "text-white/70" : "text-brand-primary/70"}`}>
                Premier logistics and supply chain services provider in the Himalayan region since 2021.
             </p>
          </div>

          <div className="space-y-8">
             <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-brand-gold">Services</h4>
             <ul className={`space-y-4 text-[10px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? "text-white/40" : "text-brand-primary/40"}`}>
               <li className="hover:text-brand-gold cursor-pointer transition-colors"><a href="#rules">Dangerous Goods</a></li>
               <li className="hover:text-brand-gold cursor-pointer transition-colors"><a href="#rules">Customs Brokerage</a></li>
               <li className="hover:text-brand-gold cursor-pointer transition-colors">Global Network</li>
             </ul>
          </div>

          <div className="space-y-8">
             <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-brand-gold">Quick Links</h4>
             <ul className={`space-y-4 text-[10px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? "text-white/40" : "text-brand-primary/40"}`}>
               <li className="hover:text-brand-gold cursor-pointer transition-colors">Consignment Tracking</li>
               <li className="hover:text-brand-gold cursor-pointer transition-colors">Global Footprint</li>
               <li className="hover:text-brand-gold cursor-pointer transition-colors">Governance</li>
               <li className="hover:text-brand-gold cursor-pointer transition-colors">Client Login</li>
             </ul>
          </div>

          <div className="space-y-8">
             <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-brand-gold">Contact</h4>
             <div className={`text-[10px] font-black uppercase tracking-widest leading-loose space-y-2 transition-colors ${isDarkMode ? "text-white/60" : "text-brand-primary/60"}`}>
                <p className="flex items-center gap-3"><MapPin className="w-3 h-3 text-brand-gold" /> Kathmandu, Nepal</p>
                <p className="flex items-center gap-3"><Phone className="w-3 h-3 text-brand-gold" /> +977 9818888905</p>
                <p className="flex items-center gap-3"><Mail className="w-3 h-3 text-brand-gold" /> info@yalalogistics.com.np</p>
             </div>
             <div className="flex gap-4 pt-4">
                <a href="https://www.facebook.com/yalalogistics/" target="_blank" rel="noreferrer" className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10 text-white/30 hover:text-brand-gold hover:border-brand-gold" : "bg-brand-primary/5 border-brand-primary/10 text-brand-primary/30 hover:text-brand-gold hover:border-brand-gold"
                }`}>
                   <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/yalalogistics/" target="_blank" rel="noreferrer" className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10 text-white/30 hover:text-brand-gold hover:border-brand-gold" : "bg-brand-primary/5 border-brand-primary/10 text-brand-primary/30 hover:text-brand-gold hover:border-brand-gold"
                }`}>
                   <Instagram className="w-4 h-4" />
                </a>
             </div>
          </div>
        </div>

        <div className={`max-w-7xl mx-auto px-6 mt-24 pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] relative z-10 transition-colors ${
          isDarkMode ? "border-white/5 text-white/20" : "border-brand-primary/5 text-brand-primary/20"
        }`}>
           <span>&copy; {new Date().getFullYear()} Yala Logistics Pvt. Ltd.</span>
           <div className="flex gap-12">
              <span 
                onClick={() => setView('admin')}
                className="hover:text-brand-gold cursor-pointer transition-colors border-r pr-12 border-white/10"
              >
                Admin Terminal
              </span>
              <span className="hover:text-brand-gold cursor-pointer transition-colors">Digital Privacy</span>
              <span className="hover:text-brand-gold cursor-pointer transition-colors">Terms of Carriage</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
