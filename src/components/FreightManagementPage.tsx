import React, { useState } from 'react';
import { FREIGHT_ORDERS, ACTIVE_VEHICLES } from '../data/mockData';
import { 
  Package, 
  Truck, 
  UserCheck, 
  Fuel, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Filter,
  ArrowUpRight,
  Send
} from 'lucide-react';

export const FreightManagementPage: React.FC = () => {
  const [orders, setOrders] = useState(FREIGHT_ORDERS);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(FREIGHT_ORDERS[0]);
  const [dispatchedNotice, setDispatchedNotice] = useState<string | null>(null);

  const filteredOrders = orders.filter(ord => {
    if (filterPriority !== 'all' && ord.priority !== filterPriority) return false;
    if (searchQuery && !ord.cargo.toLowerCase().includes(searchQuery.toLowerCase()) && !ord.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleApplyReroute = (orderId: string, recommendation: string) => {
    setDispatchedNotice(`Reroute command dispatched to driver for ${orderId}: Switched to safer corridor.`);
    setTimeout(() => setDispatchedNotice(null), 4000);
  };

  return (
    <div id="freight-management-page" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" />
            Commercial & Government Freight Fleet
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Freight Management & AI Route Orchestration
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Proactively redirecting commercial supply chains away from mudslides and blocked gorges.
            Tracking 1,248 active vehicles, driver rest cycles, and high-priority cargo integrity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
            <span className="text-[11px] text-slate-400 block font-mono">Active Heavy Fleet</span>
            <span className="text-xl font-bold text-white">1,248 Trucks</span>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
            <span className="text-[11px] text-slate-400 block font-mono">On-Time Reliability</span>
            <span className="text-xl font-bold text-emerald-400">94.6%</span>
          </div>
        </div>
      </div>

      {/* Prominent AI Recommendation Banner as requested */}
      <div className="bg-blue-600/10 border-2 border-blue-500/40 rounded-2xl p-5 text-blue-900 dark:text-blue-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 font-mono flex items-center gap-1.5">
              Live AI Fleet Directive • High Priority Dispatch
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              "Medicine delivery has high priority. Truck 12 should use Route B due to lower landslide risk."
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Vehicle AS-01-GC-4481 carrying critical vaccines diverted from blocked Sonapur NH-6 to the reinforced Lumding-Haflong link.
            </p>
          </div>
        </div>
        <button
          onClick={() => handleApplyReroute('ORD-8921', 'Route B Lumding Bypass')}
          className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          Transmit Reroute to Truck 12
        </button>
      </div>

      {dispatchedNotice && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {dispatchedNotice}
        </div>
      )}

      {/* Main Grid: Orders Table (Left) + Detailed Cargo Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Orders Table */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Active Consignments & Dispatches ({filteredOrders.length})
            </h3>

            {/* Filter controls */}
            <div className="flex items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search cargo or order..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Emergency">Emergency</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.map(order => {
              const isSelected = selectedOrder?.id === order.id;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-500 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{order.id}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        order.priority === 'Emergency' ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30' :
                        order.priority === 'High' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      }`}>
                        {order.priority} Priority
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {order.weightTons} Tons
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {order.cargo}
                    </h4>
                    <p className="text-xs text-slate-500">
                      To: <span className="font-medium text-slate-700 dark:text-slate-300">{order.recipient}</span>
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center text-xs gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-semibold">{order.eta}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                      <Fuel className="w-3 h-3 text-cyan-500" />
                      <span>{order.fuelEstimateLiters} L est.</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Order Detail & Vehicle / Driver Info */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Dispatch Telemetry
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {selectedOrder.id} • {selectedOrder.assignedTruck}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-200 block text-[11px] uppercase">
                Driver & Vehicle Status
              </span>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-500" /> Pilot
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedOrder.driver}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-indigo-500" /> Current Corridor
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedOrder.currentRoute}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-cyan-500" /> Fuel Estimation
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedOrder.fuelEstimateLiters} Liters</span>
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-blue-700 dark:text-blue-300">
                <Sparkles className="w-3.5 h-3.5" />
                AI Routing Intelligence:
              </div>
              <p className="text-xs leading-relaxed">
                {selectedOrder.aiRecommendation}
              </p>
            </div>

            <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">Consignor Details:</span>
              <p className="text-slate-500 text-[11px]">{selectedOrder.sender}</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleApplyReroute(selectedOrder.id, selectedOrder.currentRoute)}
              className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Transmit Satellite HUD Waypoints
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
