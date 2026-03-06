"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Components
import StatCard from "@/components/partner/StatCard";
import OrderCard from "@/components/partner/OrderCard";
import OrderModal from "@/components/partner/OrderModal";
import OrdersTable from "@/components/partner/OrdersTable";
import Timeline from "@/components/partner/Timeline";
import { OrderStatus } from "@/components/partner/StatusBadge";
import { Spinner } from "@/components/ui/spinner";
export default function PartnerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnerName, setPartnerName] = useState("Partner");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = profile?.role || user.user_metadata?.role;
      if (role?.toLowerCase() !== "partner") {
        router.replace(role ? `/${role.toLowerCase()}` : "/auth");
        return;
      }

      setPartnerName(user.user_metadata?.display_name || "Verified Partner");
      await fetchOrders();
    };
    init();
  }, [router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/partner/orders");
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
      const realOrder = orders.find((o) => o.id === id);
      if (!realOrder) return;

      const res = await fetch("/api/partner/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: (realOrder as any).realId,
          status: nextStatus,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o)),
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const activeOrders = orders.filter((o) => o.status !== "Delivered");
  const historyOrders = orders.filter((o) => o.status === "Delivered");

  const stats = [
    {
      title: "New Orders",
      value: activeOrders.filter((o) => o.status === "Funded").length,
      icon: Package,
    },
    {
      title: "Preparing",
      value: activeOrders.filter(
        (o) => o.status === "Preparing" || o.status === "Ready",
      ).length,
      icon: Clock,
    },
    { title: "Delivered", value: historyOrders.length, icon: CheckCircle2 },
    {
      title: "Global Impact",
      value: orders
        .reduce(
          (sum, o) => sum + (o.status === "Delivered" ? Number(o.amount) : 0),
          0,
        )
        .toLocaleString(),
      unit: "MRU",
      icon: BarChart3,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Spinner size="xl" className="text-primary" />
        <p className="mt-6 text-foreground font-black uppercase tracking-widest text-sm animate-pulse">
          Syncing ...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">

        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Official Partner</p>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
              Welcome back, {partnerName} 👋
            </h1>
            <p className="text-muted-foreground font-medium mt-3 max-w-xl">
              Manage your active orders and track your community impact in real-time.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </section>

        {/* Orders Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Active Orders List */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-foreground tracking-tighter">
                Active Pipeline
              </h2>
              <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
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
                <div className="col-span-full py-24 bg-card rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center gap-6">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center">
                    <Package size={32} className="text-primary/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-foreground tracking-tighter">
                      All caught up!
                    </p>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      New funded orders will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Daily Timeline Sidebar */}
          <aside className="space-y-10">
            <h2 className="text-2xl font-black text-foreground tracking-tighter">Today's Flow</h2>
            <Timeline
              items={orders.slice(0, 5).map((o) => ({
                time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) : "N/A",
                title: o.type,
                status: o.status,
              }))}
            />

            <div className="bg-card border border-border p-8 rounded-[2rem] text-foreground relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-black mb-2 relative tracking-tight">
                Partner Support
              </h3>
              <p className="text-sm text-muted-foreground font-medium mb-8 relative">
                Need help with an order or scheduling? Our team is active 24/7.
              </p>
              <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                Open Support
              </button>
            </div>
          </aside>
        </div>

        {/* History Ledger Section */}
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-foreground tracking-tighter">Order History</h2>
            <button className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1 group">
              Full Archive
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
          <OrdersTable orders={historyOrders} />
        </section>
      </main>

      <AnimatePresence>
        {selectedOrder && (
          <OrderModal
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            order={selectedOrder}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
