"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, Map as MapIcon } from 'lucide-react';
import Navbar from '@/components/catalog/NavBar';
import NeedCard from '@/components/catalog/NeedCard';
import NeedDrawer from '@/components/catalog/NeedDrawer';
import NeedsMap from '@/components/catalog/NeedsMap';
import { Need } from '@/types/need';

export default function CatalogPage() {
    const [needs, setNeeds] = useState<Need[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);

    // Fetch needs from API
    useEffect(() => {
        const fetchNeeds = async () => {
            try {
                const response = await fetch('/api/needs/funding');
                if (!response.ok) throw new Error('Failed to fetch needs');
                const data = await response.json();
                setNeeds(data);
            } catch (error) {
                console.error("Error fetching needs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNeeds();
    }, []);

    // Filter & Sort Logic
    const filteredNeeds = useMemo(() => {
        return needs.filter(need => {
            const matchesSearch = need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                need.validator.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = selectedCity === 'All' || need.city === selectedCity;
            const matchesCategory = selectedCategory === 'All' ||
                (selectedCategory === 'Meals' && (need.category === 'meals' || need.category === 'وجبات')) ||
                (selectedCategory === 'Medical' && (need.category === 'medical' || need.category === 'طبي')) ||
                (selectedCategory === 'Housing' && (need.category === 'housing' || need.category === 'إيواء')) ||
                (selectedCategory === 'Other' && !['meals', 'وجبات', 'medical', 'طبي', 'housing', 'إيواء'].includes(need.category));

            const normalizedStatus = need.status === 'active' ? 'Open' :
                need.status === 'urgent' ? 'In Progress' :
                    need.status === 'completed' ? 'Completed' : 'Unknown';
            const matchesStatus = selectedStatus === 'All' || normalizedStatus === selectedStatus;

            return matchesSearch && matchesCity && matchesCategory && matchesStatus;
        }).sort((a, b) => {
            if (sortBy === 'Most Funded') return b.funding_percentage - a.funding_percentage;
            if (sortBy === 'Closest to Goal') return (a.amount_required - a.total_donated) - (b.amount_required - b.total_donated);
            return 0;
        });
    }, [needs, searchQuery, selectedCity, selectedCategory, selectedStatus, sortBy]);

    const uniqueCities = ['All', ...Array.from(new Set(needs.map(n => n.city)))];
    const categories = ['All', 'Meals', 'Medical', 'Housing', 'Other'];
    const statuses = ['All', 'Open', 'In Progress', 'Completed'];
    const sortOptions = ['Newest', 'Most Funded', 'Closest to Goal'];

    const selectClass = "appearance-none bg-secondary border border-border text-foreground py-2.5 pl-4 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-colors cursor-pointer";

    return (
        <div className="min-h-screen bg-background text-foreground font-sans" dir="ltr">

            <Navbar />

            {/* HEADER */}
            <section className="bg-card border-b border-border pt-16 pb-12 sm:pt-24 sm:pb-16 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="max-w-xl">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
                                Available Needs
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Choose a real need and contribute to funding it — make a direct impact on others&apos; lives.
                            </p>
                        </div>

                        <div className="w-full md:w-[320px] relative mt-4 md:mt-0">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for a need..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full block pl-11 pr-4 py-3.5 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary focus:bg-accent transition-colors text-left shadow-sm text-foreground"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto max-w-7xl px-4 py-8">

                {/* FILTER BAR */}
                <div className="bg-card p-4 rounded-2xl shadow-sm border border-border mb-8 overflow-x-auto">
                    <div className="flex flex-nowrap md:flex-wrap items-center gap-3 md:gap-4 min-w-max md:min-w-0">

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline-block pr-2">
                                Filters:
                            </span>

                            {/* City */}
                            <div className="relative">
                                <select className={selectClass} value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                                    {uniqueCities.map(c => <option key={c} value={c}>{c === 'All' ? 'City (All)' : c}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>

                            {/* Category */}
                            <div className="relative">
                                <select className={selectClass} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                    {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'Category (All)' : c}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>

                            {/* Status */}
                            <div className="relative">
                                <select className={selectClass} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                                    {statuses.map(c => <option key={c} value={c}>{c === 'All' ? 'Status (All)' : c}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div className="mx-auto w-px h-8 bg-border hidden md:block" />

                        {/* Sort */}
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline-block pr-2">
                                Sort by:
                            </span>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-accent border border-border text-foreground py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-colors cursor-pointer"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEEDS GRID */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : filteredNeeds.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {filteredNeeds.map((need) => (
                            <NeedCard
                                key={need.id}
                                need={need}
                                onViewDetails={(n) => setSelectedNeed(n)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-card rounded-2xl p-12 text-center border border-border flex flex-col items-center justify-center mb-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">No results found</h3>
                        <p className="text-muted-foreground">Try searching with different keywords or removing some filters.</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCity('All');
                                setSelectedCategory('All');
                                setSelectedStatus('All');
                            }}
                            className="mt-6 text-primary font-medium hover:text-primary/80 text-sm transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* LOAD MORE */}
                {!loading && filteredNeeds.length > 0 && (
                    <div className="text-center mb-16">
                        <button className="py-3 px-8 bg-card border border-border text-foreground font-medium rounded-xl hover:bg-accent shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring/40">
                            Load More
                        </button>
                    </div>
                )}

                {/* MAP SECTION */}
                <section className="bg-card rounded-3xl p-6 sm:p-8 shadow-sm border border-border mb-12">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                                <MapIcon className="w-6 h-6 text-primary" />
                                Interactive Map
                            </h2>
                            <p className="text-muted-foreground text-sm">Explore needs across locations on the interactive map</p>
                        </div>
                    </div>

                    <div className="w-full h-[400px] bg-muted rounded-2xl overflow-hidden border border-border relative">
                        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                        {!loading && <NeedsMap needs={filteredNeeds} />}
                    </div>
                </section>

            </div>

            {/* DRAWER */}
            <NeedDrawer
                need={selectedNeed}
                isOpen={selectedNeed !== null}
                onClose={() => setSelectedNeed(null)}
            />

        </div>
    );
}
