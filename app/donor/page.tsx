"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart, CheckCircle, TrendingUp, Users,
  ExternalLink, Shield, Download, LogOut,
  ChevronRight, MapPin, Eye, Calendar, Search, AlertCircle
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { logout } from '@/app/auth/actions';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type DonationStatus = 'pending' | 'completed' | 'failed';

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

const STATUS_CONFIG: Record<DonationStatus, { label: string; cls: string }> = {
  pending: { label: 'Funding', cls: 'bg-primary/15 text-primary border-primary/30' },
  completed: { label: 'Delivered', cls: 'bg-green-500/15 text-green-400 border-green-500/30' },
  failed: { label: 'Failed', cls: 'bg-destructive/15 text-destructive border-destructive/30' },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: DonationStatus }) => {
  const { label, cls } = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${cls}`}>{label}</span>;
};

const ProgressBar = ({ current, max }: { current: number; max: number }) => {
  const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
        <span>{current.toLocaleString()} / {max.toLocaleString()} MRU</span>
        <span className="text-primary font-bold">{pct}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) => (
  <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0">{icon}</div>
    <div>
      <p className="text-2xl font-extrabold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {sub && <p className="text-xs text-primary font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

const DonationCard = ({ d }: { d: Donation }) => (
  <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex justify-between items-start mb-3 gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground text-base leading-tight mb-1 truncate">{d.needTitle}</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" /><span>{d.city}, {d.district}</span>
        </div>
      </div>
      <StatusBadge status={d.status} />
    </div>
    <ProgressBar current={d.needFunded} max={d.needTarget} />
    <div className="flex justify-between items-center mt-4">
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">Your Donation</p>
        <p className="text-lg font-extrabold text-primary">{d.amount.toLocaleString()} MRU</p>
      </div>
      <Link href={`/verify/${d.id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
        <Eye className="w-3.5 h-3.5" />View Details
      </Link>
    </div>
  </div>
);

const ProofCard = ({ d }: { d: Donation }) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
    {d.proofImage && (
      <div className="h-40 overflow-hidden">
        <img src={d.proofImage} alt="Proof of impact" className="w-full h-full object-cover" />
      </div>
    )}
    <div className="p-5">
      {d.validatorMessage && (
        <div className="flex items-start gap-2 mb-3">
          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground font-medium">{d.validatorMessage}</p>
        </div>
      )}
      <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{d.confirmedAt ? new Date(d.confirmedAt).toLocaleDateString('en-GB') : '--'}</span>
        </div>
        <span className="font-bold text-primary">{d.amount.toLocaleString()} MRU</span>
      </div>
      <Link href={`/verify/${d.id}`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
        <ExternalLink className="w-3.5 h-3.5" />View Transaction
      </Link>
    </div>
  </div>
);

const DonationsTable = ({ donations }: { donations: Donation[] }) => {
  const [query, setQuery] = useState('');
  const filtered = donations.filter(d =>
    d.needTitle.toLowerCase().includes(query.toLowerCase()) ||
    d.city.toLowerCase().includes(query.toLowerCase()) ||
    d.id.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <h2 className="text-xl font-extrabold text-foreground">Donation History</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input type="text" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {['ID', 'City', 'Category', 'Amount', 'Status', 'Date', 'Verify'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">No donations found.</td></tr>
                : filtered.map((d, i) => (
                  <tr key={d.id} className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${i % 2 !== 0 ? 'bg-secondary/20' : ''}`}>
                    <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{d.id.slice(0, 12)}…</td>
                    <td className="px-4 py-3.5 text-foreground">{d.city}</td>
                    <td className="px-4 py-3.5 text-foreground">{d.category}</td>
                    <td className="px-4 py-3.5 font-bold text-primary whitespace-nowrap">{d.amount.toLocaleString()} MRU</td>
                    <td className="px-4 py-3.5"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3.5 text-muted-foreground text-xs whitespace-nowrap">{new Date(d.date).toLocaleDateString('en-GB')}</td>
                    <td className="px-4 py-3.5">
                      <Link href={`/verify/${d.id}`} className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                        <Shield className="w-3.5 h-3.5" />Verify
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function DonorPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonorStats>({ totalDonated: 0, confirmedCount: 0, donationCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      // 1. Auth check
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/auth'); return; }
      setEmail(user.email ?? '');
      setDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || 'Donor');

      // 2. Load donor data from API
      try {
        const res = await fetch('/api/donations/mine');
        if (!res.ok) throw new Error('Failed to load your donations.');
        const json = await res.json();
        setDonations(json.donations ?? []);
        setStats(json.stats ?? { totalDonated: 0, confirmedCount: 0, donationCount: 0 });
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const activeDonations = donations.filter(d => d.status === 'pending');
  const proofDonations = donations.filter(d => d.status === 'completed' && (d.proofImage || d.validatorMessage));
  const initials = displayName.slice(0, 2).toUpperCase();
  const lastHash = donations[0]?.hash;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans" dir="ltr">

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-black text-primary tracking-tighter">IHSAN</Link>
            <div className="w-px h-6 bg-border" />
            <span className="text-foreground font-bold text-base hidden sm:inline">Donor Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/catalog" className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all">
              Browse Needs<ChevronRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-extrabold text-sm">{initials}</div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-foreground leading-none">{displayName}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
            <form action={logout}>
              <button type="submit" title="Sign Out" className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1">Welcome back, {displayName} 👋</h1>
          <p className="text-muted-foreground text-base">Here&apos;s a full summary of your donations and their real-world impact.</p>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="mb-8 flex items-center gap-3 px-5 py-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-10">

            {/* STAT CARDS */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Total Donated" value={stats.totalDonated.toLocaleString()} sub="MRU" />
              <StatCard icon={<Heart className="w-5 h-5" />} label="Donations Made" value={`${stats.donationCount}`} sub="donations" />
              <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Confirmed" value={`${stats.confirmedCount}`} sub="completed" />
              <StatCard icon={<Users className="w-5 h-5" />} label="Active Needs" value={`${activeDonations.length}`} sub="in progress" />
            </section>

            {/* ACTIVE DONATIONS */}
            {activeDonations.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-extrabold text-foreground">Active Donations</h2>
                  <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">{activeDonations.length} active</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeDonations.map(d => <DonationCard key={d.id} d={d} />)}
                </div>
              </section>
            )}

            {/* PROOF OF IMPACT */}
            {proofDonations.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-extrabold text-foreground">Proof of Impact</h2>
                  <span className="text-xs bg-green-500/15 text-green-400 font-bold px-3 py-1 rounded-full border border-green-500/20">{proofDonations.length} confirmed</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proofDonations.map(d => <ProofCard key={d.id} d={d} />)}
                </div>
              </section>
            )}

            {/* EMPTY STATE */}
            {!error && donations.length === 0 && (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">No donations yet</h3>
                <p className="text-muted-foreground text-sm mb-6">Browse available needs and make your first donation today.</p>
                <Link href="/catalog" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">
                  Browse Needs <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* HISTORY TABLE */}
            {donations.length > 0 && <DonationsTable donations={donations} />}

            {/* TRANSPARENCY */}
            <section className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0 mt-0.5"><Shield className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-extrabold text-foreground text-base mb-2">Full Transparency</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    Every donation is recorded in a tamper-proof ledger using encrypted hashes, ensuring complete transparency and preventing any manipulation of data.
                  </p>
                  <Link href="/transparency" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">
                    View Public Transparency Board<ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>

          </div>

          {/* QUICK ACTIONS SIDEBAR */}
          <aside className="w-full xl:w-64 flex-shrink-0">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24 space-y-3">
              <h3 className="font-extrabold text-foreground text-sm mb-2">Quick Actions</h3>
              <Link href="/catalog" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all">
                <Heart className="w-4 h-4" />Browse Needs
              </Link>
              <Link href="/verify" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-bold text-sm hover:bg-accent transition-colors">
                <Shield className="w-4 h-4 text-primary" />Verify a Transaction
              </Link>
              <button onClick={() => window.print()} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-bold text-sm hover:bg-accent transition-colors">
                <Download className="w-4 h-4 text-primary" />Download Receipts
              </button>
              {lastHash && (
                <div className="mt-2 p-4 bg-secondary/60 border border-border rounded-xl">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Last Transaction Hash</p>
                  <p className="font-mono text-xs text-foreground/60 break-all">{lastHash.slice(0, 28)}…</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
