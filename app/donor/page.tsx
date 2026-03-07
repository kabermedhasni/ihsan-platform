"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Button } from "@/components/ui/button";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type DonationStatus = "pending" | "completed" | "failed";

interface Donation {
  id: string;
  needId: string;
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
  donorBankNumber: string;
  validatorBankNumber: string;
}

import { HashBadge } from "@/components/payment/HashBadge";
import { Check, ShieldCheck } from "lucide-react";

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
  const tCatalog = useTranslations("catalog");
  const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter mb-1.5 text-muted-foreground">
        <span>
          {current.toLocaleString()} / {max.toLocaleString()} {tCatalog("mru")}
        </span>
        <span className="text-primary font-bold">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div
          style={{ width: `${pct}%` }}
          className="h-full bg-primary rounded-full transition-[width] duration-1000 ease-out"
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
  <div className="group relative p-6 rounded-2xl bg-secondary/30 border border-white/5 hover:border-primary/50 transition-all duration-500 flex flex-col gap-4 overflow-hidden">
    <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 w-fit group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-black text-foreground tracking-tighter shrink-0 truncate text-left rtl:text-right">
        {value}
      </p>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 text-left rtl:text-right">
        {label} {sub && <span className="text-primary/80 ml-1">({sub})</span>}
      </p>
    </div>
    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

const DonationCard = ({ d }: { d: Donation }) => {
  const t = useTranslations("donor");
  const tCatalog = useTranslations("catalog");

  return (
    <div className="bg-card border border-border rounded-4xl p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-foreground text-xl tracking-tighter leading-tight mb-1 truncate group-hover:text-primary transition-colors text-left rtl:text-right">
            {d.needTitle}
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-left rtl:text-right">
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
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5 text-left rtl:text-right">
            {t("yourDonation")}
          </p>
          <p className="text-xl font-black text-primary tracking-tighter">
            {d.amount.toLocaleString()} {tCatalog("mru")}
          </p>
        </div>
        <Button
          asChild
          variant="secondary"
          className="flex items-center gap-2 px-5 py-2.5 h-auto rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-primary/20"
        >
          <Link href={`/needs/${d.needId}`}>
            <Eye className="w-4 h-4" />
            {t("viewDetails")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

const ProofCard = ({ d }: { d: Donation }) => {
  const t = useTranslations("donor");
  const tCatalog = useTranslations("catalog");

  return (
    <div className="bg-card border border-border rounded-4xl overflow-hidden hover:shadow-xl transition-all duration-300">
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
            <p className="text-sm text-foreground font-medium leading-relaxed text-left rtl:text-right">
              {d.validatorMessage}
            </p>
          </div>
        )}
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>
              {d.confirmedAt
                ? new Date(d.confirmedAt).toLocaleDateString()
                : "--"}
            </span>
          </div>
          <span className="text-primary text-sm tracking-tighter">
            {d.amount.toLocaleString()} {tCatalog("mru")}
          </span>
        </div>
        <Button
          asChild
          className="flex items-center justify-center gap-3 w-full py-6 h-auto rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
        >
          <Link href={`/verify/${d.id}`}>
            <ExternalLink className="w-4 h-4" />
            {t("viewTransaction")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DonationsTable = ({ donations }: { donations: Donation[] }) => {
  const t = useTranslations("donor");
  const tCatalog = useTranslations("catalog");
  const [query, setQuery] = useState("");
  const filtered = donations.filter(
    (d) =>
      d.needTitle.toLowerCase().includes(query.toLowerCase()) ||
      d.city.toLowerCase().includes(query.toLowerCase()) ||
      d.id.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="mb-32">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div className="text-left rtl:text-right">
          <h2 className="text-3xl font-black text-foreground tracking-tighter">
            {t("historyTitle")}
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            {t("searchDonations")}
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={t("searchDonations")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 rtl:pl-4 rtl:pr-12 h-12 border border-white/10 rounded-xl text-sm font-bold bg-secondary/50"
          />
        </div>
      </div>

      <div className="bg-secondary/20 rounded-lg border border-white/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-white/2">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("table.id")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("table.city")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("table.category")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("table.amount")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("table.status")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm text-end">
                {t("table.date")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm text-end">
                {t("table.verify")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground text-sm font-bold uppercase tracking-widest"
                >
                  {t("noDonationsFound")}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d) => (
                <TableRow
                  key={d.id}
                  className="border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <TableCell className="px-6 py-4 text-white font-mono text-sm">
                    #{d.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="px-6 py-4 text-white font-medium">
                    {d.city}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-secondary text-muted-foreground px-2 py-1 rounded-md border border-white/5">
                      {d.category}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-primary font-bold whitespace-nowrap">
                    {d.amount.toLocaleString()} {tCatalog("mru")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        d.status === "completed"
                          ? "bg-primary/20 text-primary border-primary/30"
                          : d.status === "pending"
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            : "bg-destructive/20 text-destructive border-destructive/30"
                      }`}
                    >
                      {t(d.status)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground font-mono text-sm text-end">
                    {new Date(d.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-end">
                    <div className="flex items-center justify-end gap-4">
                      {d.hash && (
                        <div className="hidden lg:block">
                          <HashBadge hash={d.hash} />
                        </div>
                      )}
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10 text-primary group"
                      >
                        <Link href={`/verify/${d.id}`}>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function DonorPage() {
  const t = useTranslations("donor");
  const tCatalog = useTranslations("catalog");
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

  const redirectingRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Auth check
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          redirectingRef.current = true;
          router.replace("/auth");
          return;
        }
        setDisplayName(
          user.user_metadata?.display_name ||
            user.email?.split("@")[0] ||
            t("defaultDisplayName"),
        );

        // Read role from profiles table (authoritative source)
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        const role = profile?.role || user.user_metadata?.role;
        if ((role || "donor").toLowerCase() !== "donor") {
          redirectingRef.current = true;
          router.replace(`/${(role || "donor").toLowerCase()}`);
          return;
        }

        // 1. Fetch last confirmed hash for chaining
        const lastHashRes = await fetch("/api/transparency/last-hash");
        const lastHashData = await lastHashRes
          .json()
          .catch(() => ({ lastHash: "0".repeat(64) }));
        const lastHash = lastHashData.lastHash;
        const txId = crypto.randomUUID();
        const timestamp = new Date().toISOString();
        // 2. Load donor data from API
        const res = await fetch("/api/donations/mine");
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || t("error.loadFailed"));
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
        setError(t("error.loadFailed"));
      } finally {
        if (!redirectingRef.current) setLoading(false);
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
    <div className="min-h-screen bg-background text-foreground font-sans">
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl"
          >
            <div className="mb-4 mt-6 md:mt-10">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-2 text-left rtl:text-right">
                {t("welcome")}
              </h2>
              <div className="flex items-center gap-4 overflow-hidden">
                <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter text-left rtl:text-right leading-[1.1] truncate">
                  {displayName}
                </h1>
                <div className="w-14 h-14 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 animate-in fade-in zoom-in duration-700">
                  <Heart className="w-10 h-10 md:w-14 md:h-14" />
                </div>
              </div>
            </div>
            <p className="text-muted-foreground font-medium text-lg max-w-2xl text-left rtl:text-right leading-relaxed">
              {t("summary")}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-6 py-12">
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
                value={stats.totalDonated.toLocaleString()}
                sub={tCatalog("mru")}
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
            {activeDonations.length > 0 && (
              <section className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-foreground tracking-tighter text-left rtl:text-right">
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
              </section>
            )}

            {/* PROOF OF IMPACT */}
            {proofDonations.length > 0 && (
              <section className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-foreground tracking-tighter text-left rtl:text-right">
                    {t("proofOfImpact")}
                  </h2>
                  <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 uppercase tracking-widest px-4 py-1 rounded-full border border-emerald-500/20">
                    {proofDonations.length} {t("confirmed").toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {proofDonations.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-card border border-border rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-10"
                    >
                      {/* Proof Screenshot */}
                      <div className="w-full md:w-64 aspect-video bg-muted rounded-3xl overflow-hidden relative border border-border">
                        {tx.proofImage ? (
                          <img
                            src={tx.proofImage}
                            alt="Proof"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                            {t("noImage")}
                          </div>
                        )}
                        <Link
                          href={`/verify/${tx.id}`}
                          className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <ExternalLink className="w-8 h-8 text-white" />
                        </Link>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-black text-foreground tracking-tight mb-2">
                                {tx.needTitle}
                              </h3>
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                {t("donorAccount")}
                              </p>
                              <p className="text-sm font-black text-foreground">
                                {tx.donorBankNumber}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                {t("amount")}
                              </p>
                              <p className="text-2xl font-black text-primary tracking-tighter">
                                {tx.amount.toLocaleString()}{" "}
                                <span className="text-xs">
                                  {tCatalog("mru")}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                {t("targetAccount")}
                              </p>
                              <p className="text-xs font-bold text-foreground">
                                {tx.validatorBankNumber}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                {t("date")}
                              </p>
                              <p className="text-xs font-bold text-foreground">
                                {new Date(
                                  tx.confirmedAt || tx.date,
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 flex items-center gap-4">
                            <HashBadge hash={tx.hash} />
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                {t("validHash")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                          <Button
                            asChild
                            className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                          >
                            <Link href={`/verify/${tx.id}`}>
                              <Check className="w-4 h-4" />
                              {t("viewTransaction")}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

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
                <Button
                  asChild
                  variant="default"
                  className="px-10 py-7 h-auto rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                  <Link href="/catalog">
                    {t("browseCatalog")}{" "}
                    <ChevronRight className="w-5 h-5 rtl:rotate-180 ml-2" />
                  </Link>
                </Button>
              </div>
            )}

            {/* HISTORY TABLE */}
            {donations.length > 0 && <DonationsTable donations={donations} />}

            {/* TRANSPARENCY */}
            <section className="bg-card border border-border rounded-4xl p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                <div className="p-5 bg-primary/10 text-primary rounded-2xl shrink-0">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-2xl tracking-tighter mb-4 text-left rtl:text-right">
                    {t("fullTransparency")}
                  </h3>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed mb-8 max-w-2xl text-left rtl:text-right">
                    {t("transparencyNote")}
                  </p>
                  <Button
                    asChild
                    variant="default"
                    className="px-8 py-7 h-auto rounded-xl font-black text-xs uppercase tracking-widest"
                  >
                    <Link href="/transparency">
                      {t("viewPublicLedger")}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>

          {/* QUICK ACTIONS SIDEBAR */}
          <aside className="w-full xl:w-72 shrink-0">
            <div className="bg-card border border-border rounded-3xl p-6 sticky top-28 space-y-4 shadow-sm">
              <h3 className="font-black text-foreground text-xs uppercase tracking-widest mb-4 text-left rtl:text-right">
                {t("quickActions")}
              </h3>
              <Button
                asChild
                className="w-full py-6 h-auto rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
              >
                <Link href="/catalog">
                  <Heart className="w-4 h-4 mr-2" />
                  {t("browseCatalog")}
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="w-full py-6 h-auto rounded-xl font-black text-[10px] uppercase tracking-widest border-border"
              >
                <Download className="w-4 h-4 text-primary mr-2" />
                {t("downloadReceipts")}
              </Button>
              {lastHash && (
                <div className="mt-4 pt-6 border-t border-border">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 text-left rtl:text-right">
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
