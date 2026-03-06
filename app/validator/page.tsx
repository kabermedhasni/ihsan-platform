"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Users,
  CheckCircle,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

import { StatCard } from "@/components/validator/StatCard";
import { NeedCard, Need } from "@/components/validator/NeedCard";
import { CreateNeedForm } from "@/components/validator/CreateNeedForm";
import { ConfirmationModal } from "@/components/validator/ConfirmationModal";
import { NeedsHistoryTable } from "@/components/validator/NeedsHistoryTable";

// ─── TYPES ────────────────────────────────────────────────────────────

interface ValidatorStats {
  needsCreated: number;
  needsFunded: number;
  deliveriesConfirmed: number;
  totalBeneficiaries: number;
}

import { PaymentVerificationList } from "@/components/validator/PaymentVerificationList";
import { Transaction } from "@/types/payment";

// ─── MAIN PAGE COMPONENT ────────────────────────────────────────────────────────

export default function ValidatorDashboard() {
  const t = useTranslations("validator");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [activeTab, setActiveTab] = useState<"manage" | "create" | "payments">("manage");
  const [needs, setNeeds] = useState<Need[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<ValidatorStats>({
    needsCreated: 0,
    needsFunded: 0,
    deliveriesConfirmed: 0,
    totalBeneficiaries: 0,
  });
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      // 1. Auth check
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      // Check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = profile?.role || user.user_metadata?.role;
      if (role?.toLowerCase() !== "validator") {
        router.replace(role ? `/${role.toLowerCase()}` : "/auth");
        return;
      }

      setDisplayName(user.user_metadata?.display_name || user.email?.split("@")[0] || "Validator");

      // 2. Load Real Data
      try {
        const [needsRes, statsRes, paymentsRes] = await Promise.all([
          fetch('/api/validator/needs'),
          fetch('/api/validator/stats'),
          fetch('/api/validator/pending-payments')
        ]);

        if (needsRes.ok) {
          const needsData = await needsRes.json();
          setNeeds(needsData);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (paymentsRes.ok) {
          const paymentsData = await paymentsRes.json();
          setPendingPayments(paymentsData);
        }
      } catch (err) {
        console.error("Failed to load validator data:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const handleVerifyPayment = async (id: string, status: 'CONFIRMED' | 'REJECTED') => {
    // Simulate API call
    setPendingPayments(prev => prev.filter(p => p.id !== id));
    // In real app, this would trigger hash chain update the need's fundedAmount
  };

  const handleConfirmDelivery = (need: Need) => {
    setSelectedNeed(need);
    setIsConfirmModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20">

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">

        {/* WELCOME SECTION */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{t('role')}</p>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
              {t('welcome')}, {displayName} 👋
            </h1>
            <p className="text-muted-foreground font-medium mt-3 max-w-xl">
              {t('summary')}
            </p>
          </div>

          <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-sm">
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              {t('needs.title')}
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'payments' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              {t('createNeed.title')}
            </button>
          </div>
        </section>

        {/* STATS OVERVIEW */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<FileText className="w-5 h-5" />} label={t('stats.needsCreated')} value={stats.needsCreated.toString()} />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label={t('stats.needsFunded')} value={stats.needsFunded.toString()} />
          <StatCard icon={<CheckCircle className="w-5 h-5" />} label={t('stats.deliveriesConfirmed')} value={stats.deliveriesConfirmed.toString()} />
          <StatCard icon={<Users className="w-5 h-5" />} label={t('stats.totalBeneficiaries')} value={stats.totalBeneficiaries.toString()} />
        </section>

        <AnimatePresence mode="wait">
          {activeTab === "manage" ? (
            <motion.div
              key="manage"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-20"
            >
              {/* NEEDS LISTING */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-foreground tracking-tighter">{t('needs.title')}</h2>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    {needs.length} Active Needs
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {needs.map(n => (
                    <NeedCard key={n.id} n={n} onConfirm={handleConfirmDelivery} />
                  ))}
                </div>
              </div>

              {/* HISTORY TABLE */}
              <NeedsHistoryTable needs={needs} />
            </motion.div>
          ) : activeTab === "payments" ? (
            <motion.div
              key="payments"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PaymentVerificationList
                transactions={pendingPayments}
                onVerify={handleVerifyPayment}
              />
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CreateNeedForm />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <ConfirmationModal
            need={selectedNeed}
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
