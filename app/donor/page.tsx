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
  LogOut,
  ChevronRight,
  MapPin,
  Eye,
  Calendar,
  Search,
  AlertCircle,
  Info,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/auth/actions";
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
      className={`px-2.5 py-1 text-xs font-bold rounded-full border ${config.cls}`}
    >
      {t(config.labelKey)}
    </span>
  );
};

const ProgressBar = ({ current, max }: { current: number; max: number }) => {
  const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
        <span>
          {current.toLocaleString()} / {max.toLocaleString()} MRU
        </span>
        <span className="text-primary font-bold">{pct}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
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
  <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-extrabold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {sub && <p className="text-xs text-primary font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

const DonationCard = ({ d }: { d: Donation }) => {
  const t = useTranslations("donor");
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-base leading-tight mb-1 truncate">
            {d.needTitle}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {d.city}, {d.district}
            </span>
          </div>
        </div>
        <StatusBadge status={d.status} />
      </div>
      <ProgressBar current={d.needFunded} max={d.needTarget} />
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">
            {t("yourDonation")}
          </p>
          <p className="text-lg font-extrabold text-primary">
            {d.amount.toLocaleString()} MRU
          </p>
        </div>
        <Link
          href={`/verify/${d.id}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          {t("viewDetails")}
        </Link>
      </div>
    </div>
  );
};

const ProofCard = ({ d }: { d: Donation }) => {
  const t = useTranslations("donor");
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {d.proofImage && (
        <div className="h-40 overflow-hidden">
          <img
            src={d.proofImage}
            alt="Proof of impact"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        {d.validatorMessage && (
          <div className="flex items-start gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
            <p className="text-sm text-foreground font-medium">
              {d.validatorMessage}
            </p>
          </div>
        )}
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {d.confirmedAt
                ? new Date(d.confirmedAt).toLocaleDateString("en-GB")
                : "--"}
            </span>
          </div>
          <span className="font-bold text-primary">
            {d.amount.toLocaleString()} MRU
          </span>
        </div>
        <Link
          href={`/verify/${d.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {t("viewTransaction")}
        </Link>
      </div>
    </div>
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
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <h2 className="text-xl font-extrabold text-foreground">
          {t("historyTitle")}
        </h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
          <Input
            type="text"
            placeholder={t("searchDonations")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 h-10 rounded-xl bg-card border-border text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
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
                    className="text-left rtl:text-right text-xs font-bold text-muted-foreground px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                  >
                    {t("noDonationsFound")}
                  </td>
                </tr>
              ) : (
                filtered.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${i % 2 !== 0 ? "bg-secondary/20" : ""}`}
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                      {d.id.slice(0, 12)}…
                    </td>
                    <td className="px-4 py-3.5 text-foreground">{d.city}</td>
                    <td className="px-4 py-3.5 text-foreground">
                      {d.category}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-primary whitespace-nowrap">
                      {d.amount.toLocaleString()} MRU
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(d.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/verify/${d.id}`}
                        className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
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
  const [email, setEmail] = useState("");
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
      setEmail(user.email ?? "");
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
          console.error("API Error details:", errData);
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
    <div className="font-sans pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1 flex items-center gap-3">
            {t("welcome")}, {displayName}
            <span className="inline-block hover:scale-110 transition-transform duration-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
              >
                <path
                  d="M8.7838 21.9999C7.0986 21.2478 5.70665 20.0758 4.79175 18.5068"
                  stroke="oklch(0.82 0.16 88)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M14.8252 2.18595C16.5021 1.70882 18.2333 2.16305 19.4417 3.39724"
                  stroke="oklch(0.82 0.16 88)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M4.0106 8.36655L3.63846 7.71539L4.0106 8.36655ZM6.50218 8.86743L7.15007 8.48962L6.50218 8.86743ZM3.2028 10.7531L2.55491 11.1309H2.55491L3.2028 10.3753ZM7.69685 3.37253L8.34474 2.99472V2.99472L7.69685 3.37253ZM8.53873 4.81624L7.89085 5.19405L8.53873 4.81624ZM10.4165 9.52517C10.6252 9.88299 11.0844 10.0039 11.4422 9.79524C11.8 9.58659 11.9209 9.12736 11.7123 8.76955L10.4165 9.52517ZM7.53806 12.1327C7.74672 12.4905 8.20594 12.6114 8.56376 12.4027C8.92158 12.1941 9.0425 11.7349 8.83384 11.377L7.53806 12.1327ZM4.39747 5.25817L3.74958 5.63598L4.39747 5.25817ZM11.8381 2.9306L12.486 2.55279V2.55279L11.8381 2.9306ZM14.3638 7.26172L15.0117 6.88391L14.3638 7.26172ZM16.0475 10.1491L16.4197 10.8003C16.5934 10.701 16.7202 10.5365 16.772 10.3433C16.8238 10.15 16.7962 9.94413 16.6954 9.77132L16.0475 10.1491ZM17.0153 5.75389C17.2239 6.11171 17.6831 6.23263 18.041 6.02397C18.3988 5.81531 18.5197 5.35609 18.311 4.99827L17.0153 5.75389ZM20.1888 9.7072L20.8367 9.32939V9.32939L20.1888 9.7072ZM6.99128 17.2497L7.63917 16.8719L6.99128 17.2497ZM16.9576 19.2533L16.5854 18.6021L16.9576 19.2533ZM13.784 15.3C13.9927 15.6578 14.4519 15.7787 14.8097 15.5701C15.1676 15.3614 15.2885 14.9022 15.0798 14.5444L13.784 15.3ZM20.347 8.48962C20.1383 8.1318 19.6791 8.01089 19.3213 8.21954C18.9635 8.4282 18.8426 8.88742 19.0512 9.24524L20.347 8.48962ZM8.98692 20.1803C9.35042 20.3789 9.80609 20.2452 10.0047 19.8817C10.2033 19.5182 10.0697 19.0626 9.70616 18.864L8.98692 20.1803ZM13.8888 19.5453C13.4792 19.6067 13.1969 19.9886 13.2583 20.3982C13.3197 20.8079 13.7015 21.0902 14.1112 21.0288L13.8888 19.5453ZM4.38275 9.0177C5.01642 8.65555 5.64023 8.87817 5.85429 9.24524L7.15007 8.48962C6.43420 7.26202 4.82698 7.03613 3.63846 7.71539L4.38275 9.0177ZM3.63846 7.71539C2.44761 8.39597 1.83532 9.89690 2.55491 11.1309L3.85068 10.3753C3.64035 10.0146 3.75139 9.37853 4.38275 9.0177L3.63846 7.71539ZM7.04896 3.75034L7.89085 5.19405L9.18662 4.43843L8.34474 2.99472L7.04896 3.75034ZM7.89085 5.19405L10.4165 9.52517L11.7123 8.76955L9.18662 4.43843L7.89085 5.19405ZM8.83384 11.377L7.15007 8.48962L5.85429 9.24524L7.53806 12.1327L8.83384 11.377ZM7.15007 8.48962L5.04535 4.88036L3.74958 5.63598L5.85429 9.24524L7.15007 8.48962ZM5.57742 3.5228C6.21109 3.16065 6.83490 3.38327 7.04896 3.75034L8.34474 2.99472C7.62887 1.76712 6.02165 1.54123 4.83313 2.22048L5.57742 3.5228ZM4.83313 2.22048C3.64228 2.90107 3.02999 4.40199 3.74958 5.63598L5.04535 4.88036C4.83502 4.51967 4.94606 3.88363 5.57742 3.5228L4.83313 2.22048ZM11.1902 3.30841L13.7159 7.63953L15.0117 6.88391L12.486 2.55279L11.1902 3.30841ZM13.7159 7.63953L15.3997 10.5269L16.6954 9.77132L15.0117 6.88391L13.7159 7.63953ZM9.71869 3.08087C10.3524 2.71872 10.9762 2.94134 11.1902 3.30841L12.486 2.55279C11.7701 1.32519 10.1629 1.09930 8.97440 1.77855L9.71869 3.08087ZM8.97440 1.77855C7.78355 2.45914 7.17126 3.96006 7.89085 5.19405L9.18662 4.43843C8.97629 4.07774 9.08733 3.44170 9.71869 3.08087L8.97440 1.77855ZM15.5437 5.52635C16.1774 5.16420 16.8012 5.38682 17.0153 5.75389L18.3110 4.99827C17.5952 3.77068 15.9880 3.54478 14.7994 4.22404L15.5437 5.52635ZM14.7994 4.22404C13.6086 4.90462 12.9963 6.40555 13.7159 7.63953L15.0117 6.88391C14.8013 6.52322 14.9124 5.88718 15.5437 5.52635L14.7994 4.22404ZM2.55491 11.1309L6.34339 17.6276L7.63917 16.8719L3.85068 10.3753L2.55491 11.1309ZM19.5409 10.085C21.1461 12.8377 19.9501 16.6792 16.5854 18.6021L17.3297 19.9045C21.2539 17.6618 22.9512 12.9554 20.8367 9.32939L19.5409 10.085ZM15.0798 14.5444C14.4045 13.3863 14.8772 11.6818 16.4197 10.8003L15.6754 9.49797C13.5735 10.6993 12.5995 13.2687 13.7840 15.3L15.0798 14.5444ZM19.0512 9.24524L19.5409 10.085L20.8367 9.32939L20.3470 8.48962L19.0512 9.24524ZM9.70616 18.864C8.85353 18.3981 8.13826 17.7278 7.63917 16.8719L6.34339 17.6276C6.98843 18.7337 7.90969 19.5917 8.98692 20.1803L9.70616 18.864ZM16.5854 18.6021C15.7158 19.0991 14.7983 19.4090 13.8888 19.5453L14.1112 21.0288C15.2038 20.8650 16.2984 20.4939 17.3297 19.9045L16.5854 18.6021Z"
                  fill="oklch(0.82 0.16 88)"
                ></path>
              </svg>
            </span>
          </h1>
          <p className="text-muted-foreground text-base">{t("summary")}</p>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="mb-8 flex items-center gap-3 px-5 py-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-10">
            {/* STAT CARDS */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label={t("totalDonated")}
                value={stats.totalDonated.toLocaleString()}
                sub="MRU"
              />
              <StatCard
                icon={<Heart className="w-5 h-5" />}
                label={t("donations")}
                value={`${stats.donationCount}`}
                sub={t("donations").toLowerCase()}
              />
              <StatCard
                icon={<CheckCircle className="w-5 h-5" />}
                label={t("confirmed")}
                value={`${stats.confirmedCount}`}
                sub={t("confirmed").toLowerCase()}
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label={t("activeNeeds")}
                value={`${activeDonations.length}`}
                sub={t("inProgress").toLowerCase()}
              />
            </section>

            {/* ACTIVE DONATIONS */}
            {activeDonations.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-extrabold text-foreground">
                    {t("activeDonations")}
                  </h2>
                  <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
                    {activeDonations.length} {t("active")}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeDonations.map((d) => (
                    <DonationCard key={d.id} d={d} />
                  ))}
                </div>
              </section>
            )}

            {/* PROOF OF IMPACT */}
            {proofDonations.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-extrabold text-foreground">
                    {t("proofOfImpact")}
                  </h2>
                  <span className="text-xs bg-green-500/15 text-green-400 font-bold px-3 py-1 rounded-full border border-green-500/20">
                    {proofDonations.length} {t("confirmed").toLowerCase()}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proofDonations.map((d) => (
                    <ProofCard key={d.id} d={d} />
                  ))}
                </div>
              </section>
            )}

            {/* EMPTY STATE */}
            {!error && donations.length === 0 && (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {t("noDonations")}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {t("noDonationsDesc")}
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all"
                >
                  {t("browseCatalog")} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* HISTORY TABLE */}
            {donations.length > 0 && <DonationsTable donations={donations} />}

            {/* TRANSPARENCY */}
            <section className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-base mb-2">
                    {t("fullTransparency")}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {t("transparencyNote")}
                  </p>
                  <Link
                    href="/transparency"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all"
                  >
                    {t("viewPublicLedger")}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* QUICK ACTIONS SIDEBAR */}
          <aside className="w-full xl:w-64 shrink-0">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24 space-y-3">
              <h3 className="font-extrabold text-foreground text-sm mb-2">
                {t("quickActions")}
              </h3>
              <Link
                href="/catalog"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all"
              >
                <Heart className="w-4 h-4" />
                {t("browseCatalog")}
              </Link>
              <Link
                href="/verify"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-bold text-sm hover:bg-accent transition-colors"
              >
                <Shield className="w-4 h-4 text-primary" />
                {t("verifyTransaction")}
              </Link>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-bold text-sm hover:bg-accent transition-colors"
              >
                <Download className="w-4 h-4 text-primary" />
                {t("downloadReceipts")}
              </button>
              {lastHash && (
                <div className="mt-2 p-4 bg-secondary/60 border border-border rounded-xl">
                  <p className="text-xs text-muted-foreground font-medium mb-2">
                    {t("lastHash")}
                  </p>
                  <p className="font-mono text-xs text-foreground/60 break-all">
                    {lastHash.slice(0, 28)}…
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
