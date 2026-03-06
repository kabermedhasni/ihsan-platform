"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, Map as MapIcon } from "lucide-react";
import { motion } from "framer-motion";
import NeedCard from "@/components/catalog/NeedCard";
import NeedDrawer from "@/components/catalog/NeedDrawer";
import { Need } from "@/types/need";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InteractiveMap from "@/components/landing/InteractiveMap";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);

  // Fetch needs from API
  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const response = await fetch("/api/needs/funding");
        if (!response.ok) throw new Error("Failed to fetch needs");
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
    return needs
      .filter((need) => {
        const matchesCity =
          selectedCity === "All" || need.city === selectedCity;

        // Map database categories to translation-friendly labels
        const categoryKey = need.category.toLowerCase().replace(/\s+/g, "");
        let normalizedCategory = "other";
        if (["meals", "وجبات"].includes(categoryKey))
          normalizedCategory = "Meals";
        else if (["medical", "طبي"].includes(categoryKey))
          normalizedCategory = "Medical";
        else if (["housing", "إيواء"].includes(categoryKey))
          normalizedCategory = "Housing";

        const matchesCategory =
          selectedCategory === "All" || normalizedCategory === selectedCategory;

        const normalizedStatus =
          need.status === "active"
            ? "Open"
            : need.status === "urgent"
              ? "In Progress"
              : need.status === "completed"
                ? "Completed"
                : "Unknown";
        const matchesStatus =
          selectedStatus === "All" || normalizedStatus === selectedStatus;

        return matchesCity && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "Most Funded")
          return b.funding_percentage - a.funding_percentage;
        if (sortBy === "Closest to Goal")
          return (
            a.amount_required -
            a.total_donated -
            (b.amount_required - b.total_donated)
          );
        return 0;
      });
  }, [needs, selectedCity, selectedCategory, selectedStatus, sortBy]);

  const uniqueCities = [
    "All",
    ...Array.from(new Set(needs.map((n) => n.city))),
  ];

  const categories = ["All", "Meals", "Medical", "Housing", "Other"];
  const statuses = ["All", "Open", "In Progress", "Completed"];
  const sortOptions = ["Newest", "Most Funded", "Closest to Goal"];

  return (
    <div className="bg-background text-foreground font-sans">
      {/* HEADER */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="container mx-auto max-w-7xl px-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl mt-10 md:text-6xl font-black text-foreground tracking-tighter leading-tight mb-6 text-left rtl:text-right">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed text-left rtl:text-right">
              {t("description")}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* FILTER BAR */}
        <div className="bg-card p-4 rounded-2xl shadow-sm border border-border mb-8 overflow-x-auto">
          <div className="flex flex-nowrap md:flex-wrap items-center gap-3 md:gap-4 min-w-max md:min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline-block pr-2">
                {t("filters.title") || "Filters"}:
              </span>

              {/* City */}
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-10 bg-secondary border-border rounded-xl text-sm min-w-[140px]">
                  <SelectValue
                    placeholder={`${t("filters.city")} (${t("all")})`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c === "All" ? `${t("filters.city")} (${t("all")})` : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Category */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-10 bg-secondary border-border rounded-xl text-sm min-w-[140px]">
                  <SelectValue
                    placeholder={`${t("filters.category")} (${t("all")})`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c === "All"
                        ? `${t("filters.category")} (${t("all")})`
                        : t(`categories.${c.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-10 bg-secondary border-border rounded-xl text-sm min-w-[140px]">
                  <SelectValue
                    placeholder={`${t("filters.status")} (${t("all")})`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((c) => {
                    const statusKey =
                      c === "In Progress" ? "inProgress" : c.toLowerCase();
                    return (
                      <SelectItem key={c} value={c}>
                        {c === "All"
                          ? `${t("filters.status")} (${t("all")})`
                          : t(`statuses.${statusKey}`)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="mx-auto w-px h-8 bg-border hidden md:block" />

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline-block pr-2">
                {t("filters.sortBy") || "Sort by"}:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 bg-accent border-border rounded-xl text-sm font-medium min-w-[160px]">
                  <SelectValue placeholder={t("filters.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((c) => {
                    const sortKey =
                      c === "Most Funded"
                        ? "mostFunded"
                        : c === "Closest to Goal"
                          ? "closest"
                          : c.toLowerCase();
                    return (
                      <SelectItem key={c} value={c}>
                        {t(`sort.${sortKey}`)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* NEEDS GRID */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" className="text-primary" />
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
              <MapIcon className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {t("noNeeds")}
            </h3>
            <p className="text-muted-foreground">{t("adjustFilters")}</p>
            <Button
              variant="link"
              onClick={() => {
                setSelectedCity("All");
                setSelectedCategory("All");
                setSelectedStatus("All");
              }}
              className="mt-6 text-primary font-medium hover:text-primary/80 text-sm transition-colors"
            >
              {t("reset")}
            </Button>
          </div>
        )}

        {/* LOAD MORE */}
        {!loading && filteredNeeds.length > 0 && (
          <div className="text-center mb-16">
            <Button
              variant="outline"
              className="py-6 px-10 rounded-xl font-bold uppercase tracking-widest text-xs border-border"
            >
              {t("loadMore")}
            </Button>
          </div>
        )}

        {/* MAP SECTION */}
        <section className="bg-card rounded-3xl p-6 sm:p-8 shadow-sm border border-border mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                <MapIcon className="w-6 h-6 text-primary" />
                {t("interactiveMap")}
              </h2>
              <p className="text-muted-foreground text-sm">
                {t("interactiveMapDesc")}
              </p>
            </div>
          </div>

          <div className="w-full h-[450px] relative">
            {!loading && (
              <InteractiveMap
                needs={filteredNeeds}
                center={[18.0735, -15.9582]}
                zoom={6}
                showTitle={false}
                height="450px"
              />
            )}
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
