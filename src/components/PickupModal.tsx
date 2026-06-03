import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  Package, 
  MapPin, 
  User, 
  CheckCircle2, 
  Printer, 
  Send,
  Calculator,
  ShieldCheck,
  Ship,
  Plane,
  FileText
} from "lucide-react";

interface Contact {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface Cargo {
  type: 'Courier' | 'Cargo' | 'Freight' | 'Sea';
  weight: number;
  commodity: string;
  value: number;
}

interface Quotation {
  basePrice: number;
  customsFee: number;
  total: number;
  id: string;
  date: string;
}

export default function PickupModal({ isOpen, onClose, isDarkMode }: { isOpen: boolean; onClose: () => void; isDarkMode: boolean }) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<'computing' | 'validating'>('computing');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [sender, setSender] = useState<Contact>({ name: "", address: "", phone: "", email: "" });
  const [receiver, setReceiver] = useState<Contact>({ name: "", address: "", phone: "", email: "" });
  const [cargo, setCargo] = useState<Cargo>({ type: "Courier", weight: 0, commodity: "", value: 0 });
  const [quote, setQuote] = useState<Quotation | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const calculateQuote = () => {
    setIsProcessing(true);
    setLoadingPhase('computing');
    
    // Stage 1: Skeleton/Computing
    setTimeout(() => {
      setLoadingPhase('validating');
      
      // Stage 2: Validating/Syncing
      setTimeout(() => {
        let ratePerKg = 0;
        switch (cargo.type) {
          case 'Courier': ratePerKg = 1200; break;
          case 'Cargo': ratePerKg = 850; break;
          case 'Freight': ratePerKg = 450; break;
          case 'Sea': ratePerKg = 250; break;
        }
        
        const basePrice = cargo.weight * ratePerKg;
        const customsFee = basePrice * 0.15; // 15% customs
        const total = basePrice + customsFee;
        
        setQuote({
          basePrice,
          customsFee,
          total,
          id: `INV-${Math.floor(Math.random() * 900000) + 100000}`,
          date: new Date().toLocaleDateString()
        });
        setIsProcessing(false);
        setStep(4);
      }, 1200);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    alert(`Quotation ${quote?.id} has been sent to ${sender.email}`);
  };

  const reset = () => {
    setStep(1);
    setSender({ name: "", address: "", phone: "", email: "" });
    setReceiver({ name: "", address: "", phone: "", email: "" });
    setCargo({ type: "Courier", weight: 0, commodity: "", value: 0 });
    setQuote(null);
    setAcceptedTerms(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 backdrop-blur-xl pointer-events-auto transition-colors duration-500 ${isDarkMode ? "bg-brand-primary/95" : "bg-slate-900/60"}`}
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] transition-colors duration-500 ${
            isDarkMode ? "bg-brand-primary border border-white/5" : "bg-white"
          }`}
        >
          {/* Header */}
          <div className={`px-8 py-6 border-b flex justify-between items-center transition-colors duration-500 ${
            isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 flex items-center justify-center text-brand-gold rounded-lg ${
                isDarkMode ? "bg-white/5 border border-white/10" : "bg-brand-primary"
              }`}>
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-xl font-black italic uppercase leading-none transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>Schedule a Pickup</h2>
                <p className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${isDarkMode ? "text-white/40" : "text-slate-400"}`}>Global Logistics Pipeline</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${
              isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-slate-200 text-brand-primary"
            }`}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className={`px-8 py-2 flex gap-2 transition-colors duration-500 ${isDarkMode ? "bg-white/5" : "bg-slate-50"}`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  step >= i ? "bg-brand-gold" : (isDarkMode ? "bg-white/5" : "bg-slate-200")
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 relative">
            <AnimatePresence mode="wait">
              {isProcessing && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 z-50 backdrop-blur-sm flex flex-col items-center justify-center gap-12 text-center transition-colors duration-500 ${
                    isDarkMode ? "bg-brand-primary/80" : "bg-white/80"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {loadingPhase === 'computing' ? (
                      <motion.div 
                        key="skeleton"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full max-w-2xl px-12 space-y-12"
                      >
                         <div className="flex flex-col items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-brand-gold/10 rounded-full animate-pulse flex items-center justify-center">
                               <Calculator className="w-6 h-6 text-brand-gold animate-bounce" />
                            </div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDarkMode ? "text-brand-gold" : "text-brand-primary"}`}>Assembling Financial Matrix</p>
                         </div>
                         
                         <div className="grid md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                               <div key={i} className={`h-24 rounded-xl animate-pulse ${isDarkMode ? "bg-white/5" : "bg-slate-100"}`} />
                            ))}
                         </div>
                         <div className={`h-32 w-full rounded-xl animate-pulse ${isDarkMode ? "bg-white/5" : "bg-slate-100"}`} />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="validating"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-6"
                      >
                        <div className="relative">
                          <div className={`w-20 h-20 border-4 rounded-full ${isDarkMode ? "border-white/5" : "border-slate-100"}`} />
                          <div className="absolute inset-0 w-20 h-20 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
                        </div>
                        <div>
                          <p className={`text-sm font-black italic uppercase tracking-widest ${isDarkMode ? "text-brand-gold" : "text-brand-primary"}`}>Validating Consignment</p>
                          <p className={`text-[10px] font-bold mt-2 uppercase animate-pulse ${isDarkMode ? "text-white/40" : "text-slate-400"}`}>Syncing with Kathmandu Terminal...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-3 mb-10">
                    <User className="w-8 h-8 text-brand-gold" />
                    <h3 className={`text-3xl font-black italic uppercase tracking-tighter transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>Sender Details</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
                      <input 
                        type="text" 
                        className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} 
                        value={sender.name}
                        onChange={(e) => setSender({...sender, name: e.target.value})}
                        placeholder="Organization or Individual" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Contact Email</label>
                      <input 
                        type="email" 
                        className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} 
                        value={sender.email}
                        onChange={(e) => setSender({...sender, email: e.target.value})}
                        placeholder="business@email.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Contact Number</label>
                      <input 
                        type="text" 
                        className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} 
                        value={sender.phone}
                        onChange={(e) => setSender({...sender, phone: e.target.value})}
                        placeholder="+977 98..." 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Pickup Address</label>
                      <input 
                        type="text" 
                        className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} 
                        value={sender.address}
                        onChange={(e) => setSender({...sender, address: e.target.value})}
                        placeholder="Street, City, Sector" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-3 mb-10">
                    <MapPin className="w-8 h-8 text-brand-gold" />
                    <h3 className={`text-3xl font-black italic uppercase tracking-tighter transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>Receiver Details</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Recipient Name</label>
                      <input 
                        type="text" 
                        className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} 
                        value={receiver.name}
                        onChange={(e) => setReceiver({...receiver, name: e.target.value})}
                        placeholder="Contact Participant" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Contact Email</label>
                      <input 
                        type="email" 
                        className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} 
                        value={receiver.email}
                        onChange={(e) => setReceiver({...receiver, email: e.target.value})}
                        placeholder="receiver@email.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Contact Number</label>
                      <input 
                        type="text" 
                        className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} 
                        value={receiver.phone}
                        onChange={(e) => setReceiver({...receiver, phone: e.target.value})}
                        placeholder="International Phone" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Destination Address</label>
                      <input 
                        type="text" 
                        className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} 
                        value={receiver.address}
                        onChange={(e) => setReceiver({...receiver, address: e.target.value})}
                        placeholder="Full Destination Coordinates" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-3 mb-10">
                    <Package className="w-8 h-8 text-brand-gold" />
                    <h3 className={`text-3xl font-black italic uppercase tracking-tighter transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>Cargo Specification</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-400">Service Category</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Courier', 'Cargo', 'Freight', 'Sea'].map((t) => (
                          <button 
                            key={t}
                            onClick={() => setCargo({...cargo, type: t as any})}
                            className={`p-4 border rounded-xl flex items-center gap-3 transition-all ${
                              cargo.type === t 
                                ? "border-brand-gold bg-brand-gold/10 text-brand-gold" 
                                : isDarkMode ? "border-white/5 text-white/30 hover:border-white/20" : "border-slate-100 text-slate-400 hover:border-slate-300"
                            }`}
                          >
                            {t === 'Courier' && <ArrowRight className="w-4 h-4" />}
                            {t === 'Cargo' && <Plane className="w-4 h-4" />}
                            {t === 'Freight' && <Truck className="w-4 h-4" />}
                            {t === 'Sea' && <Ship className="w-4 h-4" />}
                            <span className="text-xs font-black uppercase tracking-widest">{t}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Weight (KG)</label>
                      <input 
                        type="number" 
                        className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} 
                        value={cargo.weight || ""}
                        onChange={(e) => setCargo({...cargo, weight: parseFloat(e.target.value)})}
                        placeholder="Operational Load" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Commodity Type</label>
                      <input 
                        type="text" 
                        className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} 
                        value={cargo.commodity}
                        onChange={(e) => setCargo({...cargo, commodity: e.target.value})}
                        placeholder="e.g. Electronics, Garments, Documents" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Estimated Value (NPR)</label>
                      <input 
                        type="number" 
                        className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`} 
                        value={cargo.value || ""}
                        onChange={(e) => setCargo({...cargo, value: parseFloat(e.target.value)})}
                        placeholder="Invoice Value" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && quote && (
                <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <Calculator className="w-8 h-8 text-brand-gold" />
                      <h3 className={`text-3xl font-black italic uppercase tracking-tighter transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>Financial Quote</h3>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full w-fit">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Entry Registered in Global Pipeline</span>
                    </div>
                  </div>
                  
                  <div className={`border rounded-2xl p-10 grid md:grid-cols-3 gap-10 transition-colors duration-500 ${
                    isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
                  }`}>
                    <div>
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4">Base Operations</p>
                        <h4 className={`text-3xl font-black italic transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>NPR {quote.basePrice.toLocaleString()}</h4>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4">Customs Clearance (15%)</p>
                        <h4 className={`text-3xl font-black italic transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>NPR {quote.customsFee.toLocaleString()}</h4>
                    </div>
                    <div className={`md:border-l md:pl-10 transition-colors ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
                        <p className="text-[9px] font-black uppercase text-brand-gold tracking-[0.3em] mb-4 underline decoration-brand-gold/30">Total Consignment Cost</p>
                        <h4 className={`text-5xl font-black italic tracking-tighter leading-none transition-colors ${isDarkMode ? "text-white" : "text-brand-primary"}`}>NPR {quote.total.toLocaleString()}</h4>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className={`flex gap-4 p-8 border rounded-xl transition-colors duration-500 ${
                      isDarkMode ? "bg-brand-gold/5 border-brand-gold/10" : "bg-brand-gold/5 border-brand-gold/20"
                    }`}>
                      <ShieldCheck className={`w-8 h-8 shrink-0 transition-colors ${isDarkMode ? "text-brand-gold" : "text-brand-primary"}`} />
                      <p className={`text-xs font-medium leading-relaxed transition-colors ${isDarkMode ? "text-white/60" : "text-brand-primary/80"}`}>
                        This estimation includes standard handling and institutional clearances. Real-time variances may apply subject to inspection protocols.
                      </p>
                    </div>

                    <label className={`flex items-start gap-4 p-6 rounded-xl cursor-pointer transition-all border group ${
                      acceptedTerms 
                        ? (isDarkMode ? "bg-brand-gold/5 border-brand-gold/50" : "bg-brand-gold/5 border-brand-gold/30") 
                        : (isDarkMode ? "bg-white/5 border-white/5 hover:border-white/20" : "bg-slate-50 border-slate-100 hover:border-slate-200")
                    }`}>
                      <div className="relative flex items-center justify-center pt-1">
                        <input 
                          type="checkbox" 
                          className="peer sr-only"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                        />
                        <div className={`w-6 h-6 border-2 rounded transition-all flex items-center justify-center ${
                          acceptedTerms 
                            ? "bg-brand-gold border-brand-gold" 
                            : (isDarkMode ? "border-white/20 bg-transparent" : "border-slate-300 bg-white")
                        }`}>
                          {acceptedTerms && <CheckCircle2 className="w-4 h-4 text-brand-primary fill-current" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-white" : "text-brand-primary"}`}>Legal Acknowledgment</p>
                        <p className={`text-[10px] uppercase font-bold tracking-tight leading-relaxed ${isDarkMode ? "text-white/40" : "text-slate-500"}`}>
                          I hereby declare that the cargo described does not contain any prohibited substances and I agree to the Yala Logistics <span className="text-brand-gold">Statutory Terms of Carriage</span> and international maritime protocols.
                        </p>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {step === 5 && quote && (
                <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-brand-primary">
                        <FileText className="w-8 h-8 text-brand-gold" />
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Generated Invoice</h3>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all">
                          <Printer className="w-4 h-4" /> Print
                        </button>
                        <button onClick={handleSendEmail} className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-gold text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all">
                          <Send className="w-4 h-4" /> Dispatch to Email
                        </button>
                    </div>
                  </div>

                  {/* Printable Invoice Section */}
                  <div id="invoice-capture" className="bg-white border-2 border-slate-100 p-10 md:p-16 rounded-xl shadow-lg font-mono relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6">
                       <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 border border-green-100 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-[7px] font-black uppercase tracking-widest">Quote Validated</span>
                       </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-10 border-b-2 border-slate-100 pb-12 mb-12">
                       <div className="flex flex-col gap-2">
                          <div className="text-2xl font-black text-brand-primary">YALA <span className="text-brand-gold">LOGISTICS</span></div>
                          <p className="text-[10px] text-slate-400">KATHMANDU, NEPAL | SINCE 2021</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Global Compliance ID: 442-A-99</p>
                       </div>
                       <div className="text-right">
                          <h4 className="text-3xl font-black text-brand-primary italic leading-none mb-2">QUOTATION</h4>
                          <p className="text-[10px] text-brand-gold font-black">{quote.id}</p>
                          <p className="text-[10px] text-slate-400">DATE: {quote.date}</p>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 mb-12">
                       <div>
                          <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Sender Information</h5>
                          <p className="text-sm font-black text-slate-800">{sender.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{sender.address}</p>
                          <p className="text-xs text-slate-500">{sender.phone}</p>
                          <p className="text-xs text-slate-500">{sender.email}</p>
                       </div>
                       <div>
                          <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Receiver Information</h5>
                          <p className="text-sm font-black text-slate-800">{receiver.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{receiver.address}</p>
                          <p className="text-xs text-slate-500">{receiver.phone}</p>
                          <p className="text-xs text-slate-500">{receiver.email}</p>
                       </div>
                    </div>

                    <table className="w-full mb-12 border-collapse">
                       <thead>
                          <tr className="border-b-2 border-brand-primary">
                            <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Activity</th>
                            <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                            <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Weight</th>
                            <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                          </tr>
                       </thead>
                       <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="py-6">
                              <p className="text-xs font-black text-brand-primary">Primary Carriage</p>
                              <p className="text-[9px] text-slate-400 uppercase italic">{cargo.commodity}</p>
                            </td>
                            <td className="py-6 text-center text-xs font-bold uppercase">{cargo.type}</td>
                            <td className="py-6 text-center text-xs font-bold">{cargo.weight} KG</td>
                            <td className="py-6 text-right text-xs font-bold">NPR {quote.basePrice.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="py-6 text-right text-[10px] font-black text-slate-400 border-t border-slate-100">Customs Clearance Charge (15%)</td>
                            <td className="py-6 text-right text-xs font-bold border-t border-slate-100">NPR {quote.customsFee.toLocaleString()}</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td colSpan={3} className="py-8 text-right text-sm font-black text-brand-primary italic">TOTAL SETTLEMENT</td>
                            <td className="py-8 text-right text-xl font-black text-brand-gold italic">NPR {quote.total.toLocaleString()}</td>
                          </tr>
                       </tbody>
                    </table>

                    <div className="bg-brand-primary/5 p-8 rounded-lg border border-brand-primary/10">
                       <h5 className="text-[10px] font-black uppercase text-brand-primary tracking-widest mb-4">Carrier Institutional Protocols</h5>
                       <ul className="space-y-2 text-[9px] text-slate-500 uppercase leading-loose">
                          <li>• COURIER: Max 30KG per individual parcel / Express validation.</li>
                          <li>• CARGO: Air freight protocols apply / IATA Category A clearance.</li>
                          <li>• FREIGHT: Road/Surface transport / Cross-border transit insurance active.</li>
                          <li>• SEA: Maritime shipping / Bill of Lading documentation mandatory.</li>
                          <li>• All shipments subject to terminal inspection and security clearance.</li>
                       </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className={`px-8 py-6 border-t flex justify-between items-center transition-colors duration-500 ${
            isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
          }`}>
            {step > 1 && step < 5 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className={`flex items-center gap-2 font-black uppercase text-[10px] tracking-widest transition-colors ${
                  isDarkMode ? "text-white/40 hover:text-brand-gold" : "text-slate-400 hover:text-brand-primary"
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Go Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-4">
               {step < 3 && (
                 <button 
                   onClick={() => setStep(step + 1)}
                   disabled={(step === 1 && !sender.name) || (step === 2 && !receiver.name)}
                   className="btn-premium px-10 py-3 rounded-lg text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Continue <ArrowRight className="ml-2 w-4 h-4 inline" />
                 </button>
               )}
               {step === 3 && (
                 <button 
                   onClick={calculateQuote}
                   disabled={!cargo.weight || !cargo.commodity}
                   className="btn-premium px-10 py-3 rounded-lg text-[10px] disabled:opacity-50"
                 >
                   Generate Quote <Calculator className="ml-2 w-4 h-4 inline" />
                 </button>
               )}
               {step === 4 && (
                 <button 
                   onClick={() => setStep(5)}
                   disabled={!acceptedTerms}
                   className="btn-premium px-10 py-3 rounded-lg text-[10px] disabled:opacity-30 disabled:grayscale transition-all"
                 >
                   Confirm & Finalize Invoice <CheckCircle2 className="ml-2 w-4 h-4 inline" />
                 </button>
               )}
               {step === 5 && (
                  <button 
                    onClick={reset}
                    className="btn-premium px-10 py-3 rounded-lg text-[10px]"
                  >
                    New Booking <CheckCircle2 className="ml-2 w-4 h-4 inline" />
                  </button>
               )}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-capture, #invoice-capture * {
            visibility: visible;
          }
          #invoice-capture {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
