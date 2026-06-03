import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  CheckCircle2, 
  Truck, 
  Package, 
  MapPin, 
  User, 
  Calculator,
  Ship,
  Plane,
  Save,
  RefreshCcw
} from "lucide-react";
import { shipmentService, ShipmentData } from "../../services/shipmentService";

export default function ShipmentEntry({ 
  isOpen, 
  onClose, 
  onSuccess,
  isDarkMode 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
  isDarkMode: boolean 
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [sender, setSender] = useState({ name: "", address: "", phone: "", email: "" });
  const [receiver, setReceiver] = useState({ name: "", address: "", phone: "", email: "" });
  const [cargo, setCargo] = useState({ type: "Courier" as any, weight: 0, commodity: "", value: 0 });
  const [status, setStatus] = useState<ShipmentData['status']>("Pending");

  const generateTracking = () => `YALA-${Math.floor(Math.random() * 900000) + 100000}`;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let ratePerKg = 0;
    switch (cargo.type) {
      case 'Courier': ratePerKg = 1200; break;
      case 'Cargo': ratePerKg = 850; break;
      case 'Freight': ratePerKg = 450; break;
      case 'Sea': ratePerKg = 250; break;
    }
    
    const basePrice = cargo.weight * ratePerKg;
    const customsFee = basePrice * 0.15;
    const total = basePrice + customsFee;

    const newShipment: Omit<ShipmentData, 'createdAt' | 'updatedAt'> = {
      trackingNumber: generateTracking(),
      sender,
      receiver,
      cargo,
      status,
      quote: {
        basePrice,
        customsFee,
        total,
        id: `INV-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString()
      }
    };

    await shipmentService.createShipment(newShipment);
    setIsSaving(false);
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-brand-primary/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${
            isDarkMode ? "bg-[#0a1128] border border-white/5" : "bg-white"
          }`}
        >
          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center text-brand-primary">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase italic italic">Entry Desk</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Global Consignment Registry</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className={`p-3 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-slate-100"}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-12">
              {/* Grid 1: Participants */}
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-brand-gold" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Consignor Details</h3>
                  </div>
                  <div className="grid gap-4">
                    <input 
                      type="text" placeholder="Sender Name" required
                      className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`}
                      value={sender.name} onChange={e => setSender({...sender, name: e.target.value})}
                    />
                    <input 
                      type="email" placeholder="Sender Email" required
                      className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`}
                      value={sender.email} onChange={e => setSender({...sender, email: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Sender Phone" required
                      className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`}
                      value={sender.phone} onChange={e => setSender({...sender, phone: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Pickup Address" required
                      className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`}
                      value={sender.address} onChange={e => setSender({...sender, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-brand-gold" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Consignee Details</h3>
                  </div>
                  <div className="grid gap-4">
                    <input 
                      type="text" placeholder="Receiver Name" required
                      className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`}
                      value={receiver.name} onChange={e => setReceiver({...receiver, name: e.target.value})}
                    />
                    <input 
                      type="email" placeholder="Receiver Email" required
                      className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`}
                      value={receiver.email} onChange={e => setReceiver({...receiver, email: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Receiver Phone" required
                      className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`}
                      value={receiver.phone} onChange={e => setReceiver({...receiver, phone: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Destination Address" required
                      className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`}
                      value={receiver.address} onChange={e => setReceiver({...receiver, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Grid 2: Cargo */}
              <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="w-5 h-5 text-brand-gold" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Operational Specs</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400">Service Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Courier', 'Cargo', 'Freight', 'Sea'].map(t => (
                        <button 
                          key={t} type="button"
                          onClick={() => setCargo({...cargo, type: t as any})}
                          className={`p-3 border rounded-xl text-[10px] font-black uppercase transition-all ${
                            cargo.type === t 
                              ? "bg-brand-gold text-brand-primary border-brand-gold" 
                              : isDarkMode ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-100"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400">Weight (KG)</label>
                    <input 
                      type="number" required step="0.01"
                      className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`}
                      value={cargo.weight || ""} onChange={e => setCargo({...cargo, weight: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400">Commodity</label>
                    <input 
                      type="text" required
                      className={`input-premium ${isDarkMode ? "bg-white/5 border-white/10 text-white" : ""}`}
                      value={cargo.commodity} onChange={e => setCargo({...cargo, commodity: e.target.value})}
                      placeholder="Garments, Electronics, etc."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-6 pt-12">
                <button 
                  type="button" onClick={onClose}
                  className="px-8 py-4 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-brand-gold transition-colors"
                >
                  Discard Draft
                </button>
                <button 
                  type="submit" disabled={isSaving}
                  className="btn-premium px-12 py-4 rounded-xl flex items-center gap-3 disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Execute Entry
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
