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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-4xl p-6 hover:shadow-xl transition-all duration-300 group"
    >
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
          <Link href={`/needs/${d.id}`}>
            <Eye className="w-4 h-4" />
            {t("viewDetails")}
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

const ProofCard = ({ d }: { d: Donation }) => {
  const t = useTranslations("donor");
  const tCatalog = useTranslations("catalog");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-4xl overflow-hidden hover:shadow-xl transition-all duration-300"
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
    </motion.div>
  );
};

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
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black text-foreground tracking-tighter text-left rtl:text-right">
          {t("historyTitle")}
        </h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={t("searchDonations")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 rtl:pl-4 rtl:pr-12 h-12 border-2 rounded-xl text-sm font-bold bg-card border-border"
          />
        </div>
      </div>
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
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
                    <td className="px-6 py-4 font-black text-xs text-foreground uppercase tracking-tight">
                      {d.city}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded text-[10px] font-black uppercase tracking-widest">
                        {d.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-sm text-primary whitespace-nowrap">
                      {d.amount.toLocaleString()} {tCatalog("mru")}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-6 py-4 font-bold text-[10px] text-muted-foreground uppercase whitespace-nowrap">
                      {new Date(d.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        asChild
                        variant="link"
                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1 group whitespace-nowrap h-auto p-0"
                      >
                        <Link href={`/verify/${d.id}`}>
                          <Shield className="w-3.5 h-3.5" />
                          {t("table.verify")}
                        </Link>
                      </Button>
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
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 md:w-14 md:h-14"
                  >
                    <path
                      d="M8.7838 21.9999C7.0986 21.2478 5.70665 20.0758 4.79175 18.5068"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14.8252 2.18595C16.5021 1.70882 18.2333 2.16305 19.4417 3.39724"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4.0106 8.36655L3.63846 7.71539L4.0106 8.36655ZM6.50218 8.86743L7.15007 8.48962L6.50218 8.86743ZM3.2028 10.7531L2.55491 11.1309H2.55491L3.2028 10.7531ZM7.69685 3.37253L8.34474 2.99472V2.99472L7.69685 3.37253ZM8.53873 4.81624L7.89085 5.19405L8.53873 4.81624ZM10.4165 9.52517C10.6252 9.88299 11.0844 10.0039 11.4422 9.79524C11.8 9.58659 11.9209 9.12736 11.7123 8.76955L10.4165 9.52517ZM7.53806 12.1327C7.74672 12.4905 8.20594 12.6114 8.56376 12.4027C8.92158 12.1941 9.0425 11.7349 8.83384 11.377L7.53806 12.1327ZM4.39747 5.25817L3.74958 5.63598L4.39747 5.25817ZM11.8381 2.9306L12.486 2.55279V2.55279L11.8381 2.9306ZM14.3638 7.26172L15.0117 6.88391L14.3638 7.26172ZM16.0475 10.1491L16.4197 10.8003C16.5934 10.701 16.7202 10.5365 16.772 10.3433C16.8238 10.15 16.7962 9.94413 16.6954 9.77132L16.0475 10.1491ZM17.0153 5.75389C17.2239 6.11171 17.6831 6.23263 18.041 6.02397C18.3988 5.81531 18.5197 5.35609 18.311 4.99827L17.0153 5.75389ZM20.1888 9.7072L20.8367 9.32939V9.32939L20.1888 9.7072ZM6.99128 17.2497L7.63917 16.8719L6.99128 17.2497ZM16.9576 19.2533L16.5854 18.6021L16.9576 19.2533ZM13.784 15.3C13.9927 15.6578 14.4519 15.7787 14.8097 15.5701C15.1676 15.3614 15.2885 14.9022 15.0798 14.5444L13.784 15.3ZM20.347 8.48962C20.1383 8.1318 19.6791 8.01089 19.3213 8.21954C18.9635 8.4282 18.8426 8.88742 19.0512 9.24524L20.347 8.48962ZM8.98692 20.1803C9.35042 20.3789 9.80609 20.2452 10.0047 19.8817C10.2033 19.5182 10.0697 19.0626 9.70616 18.864L8.98692 20.1803ZM13.8888 19.5453C13.4792 19.6067 13.1969 19.9886 13.2583 20.3982C13.3197 20.8079 13.7015 21.0902 14.1112 21.0288L13.8888 19.5453ZM4.38275 9.0177C5.01642 8.65555 5.64023 8.87817 5.85429 9.24524L7.15007 8.48962C6.4342 7.26202 4.82698 7.03613 3.63846 7.71539L4.38275 9.0177ZM3.63846 7.71539C2.44761 8.39597 1.83532 9.8969 2.55491 11.1309L3.85068 10.3753C3.64035 10.0146 3.75139 9.37853 4.38275 9.0177L3.63846 7.71539ZM7.04896 3.75034L7.89085 5.19405L9.18662 4.43843L8.34474 2.99472L7.04896 3.75034ZM7.89085 5.19405L10.4165 9.52517L11.7123 8.76955L9.18662 4.43843L7.89085 5.19405ZM8.83384 11.377L7.15007 8.48962L5.85429 9.24524L7.53806 12.1327L8.83384 11.377ZM7.15007 8.48962L5.04535 4.88036L3.74958 5.63598L5.85429 9.24524L7.15007 8.48962ZM5.57742 3.5228C6.21109 3.16065 6.8349 3.38327 7.04896 3.75034L8.34474 2.99472C7.62887 1.76712 6.02165 1.54123 4.83313 2.22048L5.57742 3.5228ZM4.83313 2.22048C3.64228 2.90107 3.02999 4.40199 3.74958 5.63598L5.04535 4.88036C4.83502 4.51967 4.94606 3.88363 5.57742 3.5228L4.83313 2.22048ZM11.1902 3.30841L13.7159 7.63953L15.0117 6.88391L12.486 2.55279L11.1902 3.30841ZM13.7159 7.63953L15.3997 10.5269L16.6954 9.77132L15.0117 6.88391L13.7159 7.63953ZM9.71869 3.08087C10.3524 2.71872 10.9762 2.94134 11.1902 3.30841L12.486 2.55279C11.7701 1.32519 10.1629 1.0993 8.9744 1.77855L9.71869 3.08087ZM8.9744 1.77855C7.78355 2.45914 7.17126 3.96006 7.89085 5.19405L9.18662 4.43843C8.97629 4.07774 9.08733 3.4417 9.71869 3.08087L8.9744 1.77855ZM15.5437 5.52635C16.1774 5.1642 16.8012 5.38682 17.0153 5.75389L18.311 4.99827C17.5952 3.77068 15.988 3.54478 14.7994 4.22404L15.5437 5.52635ZM14.7994 4.22404C13.6086 4.90462 12.9963 6.40555 13.7159 7.63953L15.0117 6.88391C14.8013 6.52322 14.9124 5.88718 15.5437 5.52635L14.7994 4.22404ZM2.55491 11.1309L6.34339 17.6276L7.63917 16.8719L3.85068 10.3753L2.55491 11.1309ZM19.5409 10.085C21.1461 12.8377 19.9501 16.6792 16.5854 18.6021L17.3297 19.9045C21.2539 17.6618 22.9512 12.9554 20.8367 9.32939L19.5409 10.085ZM15.0798 14.5444C14.4045 13.3863 14.8772 11.6818 16.4197 10.8003L15.6754 9.49797C13.5735 10.6993 12.5995 13.2687 13.784 15.3L15.0798 14.5444ZM19.0512 9.24524L19.5409 10.085L20.8367 9.32939L20.347 8.48962L19.0512 9.24524ZM9.70616 18.864C8.85353 18.3981 8.13826 17.7278 7.63917 16.8719L6.34339 17.6276C6.98843 18.7337 7.90969 19.5917 8.98692 20.1803L9.70616 18.864ZM16.5854 18.6021C15.7158 19.0991 14.7983 19.409 13.8888 19.5453L14.1112 21.0288C15.2038 20.865 16.2984 20.4939 17.3297 19.9045L16.5854 18.6021Z"
                      fill="currentColor"
                    />
                  </svg>
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
            <AnimatePresence>
              {activeDonations.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
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
                    <h2 className="text-2xl font-black text-foreground tracking-tighter text-left rtl:text-right">
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
                <h3 className="text-2xl font-black text-foreground tracking-tighter mb-2 text-left rtl:text-right">
                  {t("noDonations")}
                </h3>
                <p className="text-muted-foreground font-medium mb-10 max-w-sm mx-auto lowercase text-left rtl:text-right">
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
                asChild
                variant="outline"
                className="w-full py-6 h-auto rounded-xl font-black text-[10px] uppercase tracking-widest border-border"
              >
                <Link href="/catalog?verify=1">
                  <Shield className="w-4 h-4 text-primary mr-2" />
                  {t("verifyTransaction")}
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
