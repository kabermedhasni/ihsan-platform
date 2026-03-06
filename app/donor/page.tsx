"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  CheckCircle,
  TrendingUp,
  Users,
  ExternalLink,
  Shield,
  Download,
  ChevronRight,
  MapPin,
  Eye,
  Calendar,
  Search,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type DonationStatus = "pending" | "completed" | "failed";

interface Donation {
  id: string;
  needTitle: string;
  city: string;
  district: string;
  category: string;
  amount: number;
  status: DonationStatus;
  date: string;
  hash: string;
  proofImage?: string | null;
  validatorMessage?: string | null;
  confirmedAt?: string | null;
  needTarget: number;
  needFunded: number;
  fundingPercentage: number;
}

interface DonorStats {
  totalDonated: number;
  confirmedCount: number;
  donationCount: number;
}

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<DonationStatus, { labelKey: string; cls: string }> =
{
  pending: {
    labelKey: "funding",
    cls: "bg-primary/15 text-primary border-primary/30",
  },
  completed: {
    labelKey: "delivered",
    cls: "bg-green-500/15 text-green-400 border-green-500/30",
  },
  failed: {
    labelKey: "failed",
    cls: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: DonationStatus }) => {
  const t = useTranslations("donor");
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${config.cls}`}
    >
      {t(config.labelKey)}
    </span>
  );
};

const ProgressBar = ({ current, max }: { current: number; max: number }) => {
  const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter mb-1.5 text-muted-foreground">
        <span>
          {current.toLocaleString('en-US')} / {max.toLocaleString('en-US')} MRU
        </span>
        <span className="text-primary font-bold">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-primary rounded-full"
        />
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all"
  >
    <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 w-fit">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-black text-foreground tracking-tighter">{value}</p>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
        {label} {sub && <span className="text-primary/80 ml-1">({sub})</span>}
      </p>
    </div>
  </motion.div>
);

const DonationCard = ({ d }: { d: Donation }) => {
  const t = useTranslations("donor");
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-[2rem] p-6 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-foreground text-xl tracking-tighter leading-tight mb-1 truncate group-hover:text-primary transition-colors">
            {d.needTitle}
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>
              {d.city}, {d.district}
            </span>
          </div>
        </div>
        <StatusBadge status={d.status} />
      </div>
      <ProgressBar current={d.needFunded} max={d.needTarget} />
      <div className="flex justify-between items-center mt-6">
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
            {t("yourDonation")}
          </p>
          <p className="text-xl font-black text-primary tracking-tighter">
            {d.amount.toLocaleString('en-US')} MRU
          </p>
        </div>
        <Link
          href={`/needs/${d.id}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
        >
          <Eye className="w-4 h-4" />
          {t("viewDetails")}
        </Link>
      </div>
    </motion.div>
  );
};

const ProofCard = ({ d }: { d: Donation }) => {
  const t = useTranslations("donor");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {d.proofImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={d.proofImage}
            alt="Proof of impact"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>
      )}
      <div className="p-6">
        {d.validatorMessage && (
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-sm text-foreground font-medium leading-relaxed">
              {d.validatorMessage}
            </p>
          </div>
        )}
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>
              {d.confirmedAt
                ? new Date(d.confirmedAt).toLocaleDateString("en-GB")
                : "--"}
            </span>
          </div>
          <span className="text-primary text-sm tracking-tighter">
            {d.amount.toLocaleString('en-US')} MRU
          </span>
        </div>
        <Link
          href={`/verify/${d.id}`}
          className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <ExternalLink className="w-4 h-4" />
          {t("viewTransaction")}
        </Link>
      </div>
    </motion.div>
  );
};

const DonationsTable = ({ donations }: { donations: Donation[] }) => {
  const t = useTranslations("donor");
  const [query, setQuery] = useState("");
  const filtered = donations.filter(
    (d) =>
      d.needTitle.toLowerCase().includes(query.toLowerCase()) ||
      d.city.toLowerCase().includes(query.toLowerCase()) ||
      d.id.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black text-foreground tracking-tighter">
          {t("historyTitle")}
        </h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={t("searchDonations")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 border-2 rounded-xl text-sm font-bold bg-card border-border"
          />
        </div>
      </div>
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                {[
                  t("table.id"),
                  t("table.city"),
                  t("table.category"),
                  t("table.amount"),
                  t("table.status"),
                  t("table.date"),
                  t("table.verify"),
                ].map((h) => (
                  <th
                    key={h}
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-6 py-4 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-muted-foreground text-sm font-bold uppercase tracking-widest"
                  >
                    {t("noDonationsFound")}
                  </td>
                </tr>
              ) : (
                filtered.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`hover:bg-accent transition-colors ${i % 2 !== 0 ? "bg-secondary/20" : ""}`}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {d.id.slice(0, 12)}…
                    </td>
                    <td className="px-6 py-4 font-black text-xs text-foreground uppercase tracking-tight">{d.city}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded text-[10px] font-black uppercase tracking-widest">{d.category}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-sm text-primary whitespace-nowrap">
                      {d.amount.toLocaleString('en-US')} MRU
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-6 py-4 font-bold text-[10px] text-muted-foreground uppercase whitespace-nowrap">
                      {new Date(d.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/verify/${d.id}`}
                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1 group whitespace-nowrap"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        {t("table.verify")}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function DonorPage() {
  const t = useTranslations("donor");
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonorStats>({
    totalDonated: 0,
    confirmedCount: 0,
    donationCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      // 1. Auth check
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth");
        return;
      }
      setDisplayName(
        user.user_metadata?.display_name ||
        user.email?.split("@")[0] ||
        "Donor",
      );

      // 2. Load donor data from API
      try {
        const res = await fetch("/api/donations/mine");
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load your donations.");
        }
        const json = await res.json();
        setDonations(json.donations ?? []);
        setStats(
          json.stats ?? {
            totalDonated: 0,
            confirmedCount: 0,
            donationCount: 0,
          },
        );
      } catch (err: any) {
        console.error("Donation fetch error:", err);
        setError("Failed to load your donations.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  const activeDonations = donations.filter((d) => d.status === "pending");
  const proofDonations = donations.filter(
    (d) => d.status === "completed" && (d.proofImage || d.validatorMessage),
  );
  const lastHash = donations[0]?.hash;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{t("welcome")}</p>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
            {displayName} 👋
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl">{t("summary")}</p>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="mb-10 flex items-center gap-4 px-6 py-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-black uppercase tracking-widest shadow-lg shadow-destructive/5">
            <AlertCircle className="w-6 h-6 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-12">
          <div className="flex-1 min-w-0 space-y-20">
            {/* STAT CARDS */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label={t("totalDonated")}
                value={stats.totalDonated.toLocaleString('en-US')}
                sub="MRU"
              />
              <StatCard
                icon={<Heart className="w-5 h-5" />}
                label={t("donations")}
                value={`${stats.donationCount}`}
              />
              <StatCard
                icon={<CheckCircle className="w-5 h-5" />}
                label={t("confirmed")}
                value={`${stats.confirmedCount}`}
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label={t("activeNeeds")}
                value={`${activeDonations.length}`}
              />
            </section>

            {/* ACTIVE DONATIONS */}
            <AnimatePresence>
              {activeDonations.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-foreground tracking-tighter">
                      {t("activeDonations")}
                    </h2>
                    <span className="text-[10px] font-black bg-primary/10 text-primary uppercase tracking-widest px-4 py-1 rounded-full border border-primary/20">
                      {activeDonations.length} {t("active")}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {activeDonations.map((d) => (
                      <DonationCard key={d.id} d={d} />
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* PROOF OF IMPACT */}
            <AnimatePresence>
              {proofDonations.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-foreground tracking-tighter">
                      {t("proofOfImpact")}
                    </h2>
                    <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 uppercase tracking-widest px-4 py-1 rounded-full border border-emerald-500/20">
                      {proofDonations.length} {t("confirmed").toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {proofDonations.map((d) => (
                      <ProofCard key={d.id} d={d} />
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* EMPTY STATE */}
            {!error && donations.length === 0 && (
              <div className="bg-card border-2 border-dashed border-border rounded-[2.5rem] p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tighter mb-2">
                  {t("noDonations")}
                </h3>
                <p className="text-muted-foreground font-medium mb-10 max-w-sm mx-auto lowercase">
                  {t("noDonationsDesc")}
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  {t("browseCatalog")} <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )}

            {/* HISTORY TABLE */}
            {donations.length > 0 && <DonationsTable donations={donations} />}

            {/* TRANSPARENCY */}
            <section className="bg-card border border-border rounded-[2rem] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                <div className="p-5 bg-primary/10 text-primary rounded-2xl shrink-0">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-2xl tracking-tighter mb-4">
                    {t("fullTransparency")}
                  </h3>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed mb-8 max-w-2xl">
                    {t("transparencyNote")}
                  </p>
                  <Link
                    href="/transparency"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                  >
                    {t("viewPublicLedger")}
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* QUICK ACTIONS SIDEBAR */}
          <aside className="w-full xl:w-72 shrink-0">
            <div className="bg-card border border-border rounded-3xl p-6 sticky top-28 space-y-4 shadow-sm">
              <h3 className="font-black text-foreground text-xs uppercase tracking-widest mb-4">
                {t("quickActions")}
              </h3>
              <Link
                href="/catalog"
                className="flex items-center gap-3 w-full px-5 py-4 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                <Heart className="w-4 h-4" />
                {t("browseCatalog")}
              </Link>
              <Link
                href="/catalog?verify=1"
                className="flex items-center gap-3 w-full px-5 py-4 rounded-xl bg-secondary border border-border text-foreground font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                <Shield className="w-4 h-4 text-primary" />
                {t("verifyTransaction")}
              </Link>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-3 w-full px-5 py-4 rounded-xl bg-secondary border border-border text-foreground font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                <Download className="w-4 h-4 text-primary" />
                {t("downloadReceipts")}
              </button>
              {lastHash && (
                <div className="mt-4 pt-6 border-t border-border">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
                    {t("lastHash")}
                  </p>
                  <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                    <p className="font-mono text-[10px] text-primary break-all leading-relaxed">
                      {lastHash.slice(0, 48)}…
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
