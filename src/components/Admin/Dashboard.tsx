import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Package, 
  Plus, 
  LogOut, 
  Search, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle
} from "lucide-react";
import { motion } from "motion/react";
import { auth, signInWithGoogle } from "../../lib/firebase";
import { shipmentService, ShipmentData } from "../../services/shipmentService";
import { useAdmin } from "../../hooks/useAdmin";
import ShipmentEntry from "./ShipmentEntry";

export default function AdminDashboard({ isDarkMode }: { isDarkMode: boolean }) {
  const { user, isAdmin, loading } = useAdmin();
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (isAdmin) {
      loadShipments();
    }
  }, [isAdmin]);

  const loadShipments = async () => {
    const data = await shipmentService.listShipments();
    setShipments(data);
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${isDarkMode ? "bg-brand-primary text-white" : "bg-slate-50 text-slate-900"}`}>
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 text-center">
          <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-brand-gold" />
          </div>
          <h1 className="text-2xl font-black uppercase italic mb-4">Restricted Terminal</h1>
          <p className="text-slate-500 dark:text-white/40 text-sm mb-8 leading-relaxed">
            Authorized personnel only. Please authenticate using organizational credentials to access the Yala Logistics Global Pipeline.
          </p>
          <button 
            onClick={signInWithGoogle}
            className="btn-premium w-full flex items-center justify-center gap-3"
          >
            Authenticate Identity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 md:p-12 transition-colors duration-500 ${isDarkMode ? "bg-[#050b1a] text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">Administrative Node</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Cargo Management <span className="text-brand-gold not-italic">System</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEntryOpen(true)}
              className="btn-premium flex items-center gap-2 px-6 py-3 rounded-xl"
            >
              <Plus className="w-4 h-4" /> New Consignment
            </button>
            <button 
              onClick={() => auth.signOut()}
              className={`p-3 rounded-xl border transition-colors ${
                isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Active Inbound", value: shipments.length, icon: <Package />, color: "text-brand-gold" },
            { label: "In Transit", value: shipments.filter(s => s.status === 'In Transit').length, icon: <Truck />, color: "text-blue-500" },
            { label: "Delivered", value: shipments.filter(s => s.status === 'Delivered').length, icon: <CheckCircle2 />, color: "text-green-500" },
            { label: "Pending", value: shipments.filter(s => s.status === 'Pending').length, icon: <Clock />, color: "text-orange-500" }
          ].map((stat, i) => (
            <div key={i} className={`p-6 rounded-2xl border transition-colors ${isDarkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-sm"}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-slate-100 dark:bg-white/5 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-black italic mb-1">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div className={`p-6 md:p-8 rounded-2xl border mb-8 flex flex-col md:flex-row gap-6 items-center transition-colors ${
          isDarkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by tracking or sender..." 
              className={`w-full pl-12 pr-6 py-3 rounded-xl border focus:ring-0 focus:border-brand-gold transition-all text-sm ${
                isDarkMode ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              className={`px-6 py-3 rounded-xl border focus:ring-0 focus:border-brand-gold transition-all text-sm w-full md:w-48 appearance-none cursor-pointer ${
                isDarkMode ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200"
              }`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Pending</option>
              <option>In Transit</option>
              <option>Arrived</option>
              <option>Delivered</option>
            </select>
            <button className={`p-3 rounded-xl border transition-colors ${
              isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200 hover:bg-slate-50"
            }`}>
              <Filter className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Shipment Table */}
        <div className={`rounded-2xl border overflow-hidden transition-colors ${
          isDarkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-black uppercase tracking-widest ${
                  isDarkMode ? "border-white/5 text-slate-500" : "border-slate-100 text-slate-400"
                }`}>
                  <th className="px-8 py-6">Tracking ID</th>
                  <th className="px-8 py-6">Consignor (Sender)</th>
                  <th className="px-8 py-6">Service</th>
                  <th className="px-8 py-6">Weight</th>
                  <th className="px-8 py-6">Operational Status</th>
                  <th className="px-8 py-6">Financials</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredShipments.map((s, index) => (
                  <motion.tr 
                    key={s.trackingNumber} 
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: (idx: number) => ({
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: Math.min(idx * 0.04, 0.4),
                          duration: 0.35,
                          ease: "easeOut"
                        }
                      }),
                      hover: {
                        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(5, 11, 26, 0.02)",
                        transition: {
                          duration: 0.15,
                          ease: "easeOut"
                        }
                      }
                    }}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                    className={`group transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}
                  >
                    <td className="px-8 py-6">
                      <div className="text-sm font-black italic text-brand-gold transition-transform group-hover:translate-x-1 duration-200">{s.trackingNumber}</div>
                      <div className="text-[10px] text-slate-400 dark:text-white/20 mt-1 uppercase font-mono">ID: {s.quote.id}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black transition-colors">{s.sender.name}</div>
                      <div className="text-[10px] text-slate-400 dark:text-white/20 mt-1 uppercase">{s.sender.phone}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 ${
                        s.cargo.type === 'Courier' ? "text-blue-500" : 
                        s.cargo.type === 'Cargo' ? "text-brand-gold" : 
                        s.cargo.type === 'Freight' ? "text-purple-500" : "text-cyan-500"
                      }`}>
                        {s.cargo.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold uppercase">{s.cargo.weight} KG</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2 max-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            s.status === 'Delivered' ? "bg-green-500" : 
                            s.status === 'In Transit' ? "bg-blue-500" : 
                            s.status === 'Arrived' ? "bg-brand-gold" : "bg-orange-500"
                          }`} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{s.status}</span>
                        </div>
                        <div className={`w-full h-1 rounded-full overflow-hidden ${isDarkMode ? "bg-white/10" : "bg-slate-100"}`}>
                          <motion.div 
                            className={`h-full rounded-full ${
                              s.status === 'Delivered' ? "bg-green-500" : 
                              s.status === 'Arrived' ? "bg-brand-gold" : 
                              s.status === 'In Transit' ? "bg-blue-500" : "bg-orange-500"
                            }`} 
                            initial={{ width: "0%" }}
                            animate={{ 
                              width: s.status === 'Delivered' ? '100%' : 
                                     s.status === 'Arrived' ? '80%' : 
                                     s.status === 'In Transit' ? '55%' : '25%' 
                            }}
                            transition={{ duration: 0.8, delay: 0.15 + Math.min(index * 0.04, 0.4), ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black">NPR {s.quote.total.toLocaleString()}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-3">
                         <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-slate-100"}`}>
                           <ExternalLink className="w-4 h-4 text-slate-400" />
                         </button>
                         <button className={`p-2 rounded-lg transition-colors bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-white group-hover:translate-x-1 duration-200`}>
                           <ChevronRight className="w-4 h-4" />
                         </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredShipments.length === 0 && (
            <div className="p-20 text-center">
              <Package className="w-12 h-12 text-slate-200 dark:text-white/10 mx-auto mb-4" />
              <p className="text-slate-400 dark:text-white/20 text-sm font-black uppercase tracking-widest">No matching consignments detected</p>
            </div>
          )}
        </div>
      </div>

      <ShipmentEntry 
        isOpen={isEntryOpen} 
        onClose={() => setIsEntryOpen(false)} 
        onSuccess={() => {
          setIsEntryOpen(false);
          loadShipments();
        }}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
