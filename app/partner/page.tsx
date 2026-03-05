"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  BarChart3,
  LogOut,
  ChevronRight,
  UtensilsCrossed
} from "lucide-react";
import { logout } from "@/app/auth/actions";
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";

// Components
import StatCard from "@/components/partner/StatCard";
import OrderCard from "@/components/partner/OrderCard";
import OrderModal from "@/components/partner/OrderModal";
import OrdersTable from "@/components/partner/OrdersTable";
import Timeline from "@/components/partner/Timeline";
import { OrderStatus } from "@/components/partner/StatusBadge";

export default function PartnerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnerName, setPartnerName] = useState("Partner");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.role !== "partner") {
        router.push("/auth");
        return;
      }

      setPartnerName(user.user_metadata?.display_name || "Verified Partner");
      await fetchOrders();
    };
    init();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/partner/orders');
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch partner orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: OrderStatus) => {
    try {
      const realOrder = orders.find(o => o.id === id);
      if (!realOrder) return;

      const res = await fetch('/api/partner/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: (realOrder as any).realId, status: nextStatus })
      });

      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const activeOrders = orders.filter(o => o.status !== "Delivered");
  const historyOrders = orders.filter(o => o.status === "Delivered");

  const stats = [
    { title: "New Orders", value: activeOrders.filter(o => o.status === "Funded").length, icon: Package },
    { title: "Preparing", value: activeOrders.filter(o => o.status === "Preparing" || o.status === "Ready").length, icon: Clock },
    { title: "Delivered", value: historyOrders.length, icon: CheckCircle2 },
    { title: "Global Impact", value: orders.reduce((sum, o) => sum + (o.status === "Delivered" ? Number(o.amount) : 0), 0).toLocaleString(), unit: "MRU", icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/5 rounded-full animate-ping opacity-20" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <UtensilsCrossed className="absolute inset-0 m-auto text-primary" size={24} />
        </div>
        <p className="mt-6 text-foreground font-black uppercase tracking-widest text-sm animate-pulse">Syncing Kitchen...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans pb-20 text-foreground">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 shadow-2xl">
              <Image
                src="/images/logo.jpg"
                alt="Ihsan Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-black text-white leading-none">{partnerName}</h1>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 size={10} /> Verified Partner
              </span>
            </div>
          </div>

          <button
            onClick={async () => {
              try {
                await logout();
              } catch (err) {
                // Handle potential redirect errors or network failures
              } finally {
                window.location.href = "/auth";
              }
            }}
            className="p-3 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-destructive transition-all active:scale-95 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 space-y-16">
        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </section>

        {/* Orders Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Active Orders List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Active Pipeline</h2>
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black border border-primary/20">
                {activeOrders.length} ORDERS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  onViewDetails={setSelectedOrder}
                />
              ))}
              {activeOrders.length === 0 && (
                <div className="col-span-full py-24 bg-secondary/10 backdrop-blur-sm rounded-[2.5rem] border-4 border-dashed border-white/5 flex flex-col items-center justify-center gap-6">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    <Package size={32} className="text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-white">All caught up!</p>
                    <p className="text-sm font-bold text-muted-foreground">New funded orders will appear here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Daily Timeline Sidebar */}
          <aside className="space-y-8">
            <h2 className="text-2xl font-black text-white">Today's Flow</h2>
            <Timeline items={orders.slice(0, 5).map(o => ({
              time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              title: o.type,
              status: o.status
            }))} />

            <div className="bg-secondary/40 backdrop-blur-md p-8 rounded-[2rem] text-white border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-black mb-2 relative">Partner Support</h3>
              <p className="text-sm text-emerald-100/60 font-bold mb-6 relative">Need help with an order or scheduling? Contact our team.</p>
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-black text-sm active:scale-95 transition-all">
                Open Support
              </button>
            </div>
          </aside>
        </div>

        {/* History Ledger Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Order History</h2>
            <button className="text-primary font-black text-sm hover:underline flex items-center gap-1 group">
              Full Archive <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <OrdersTable orders={historyOrders} />
        </section>
      </main>

      <OrderModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
