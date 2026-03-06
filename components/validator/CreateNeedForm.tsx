"use client";

import React, { useState } from "react";
import { Plus, Store, ArrowRight, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const MAURITANIA_CITIES = [
  "Nouakchott",
  "Nouadhibou",
  "Rosso",
  "Atar",
  "Kiffa",
  "Kaedi",
  "Zouerate",
  "Aioun",
  "Nema",
  "Akjoujt",
  "Tidjikja",
  "Selibaby",
];

export const CreateNeedForm = () => {
  const t = useTranslations("validator");
  const t_common = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category || !city) {
      setStatus({
        type: "error",
        message: t("createNeed.errorSelect"),
      });
      return;
    }
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      category,
      title: formData.get("title"),
      description: formData.get("description"),
      city,
      district: formData.get("district"),
      amount_required: Number(formData.get("target")),
      beneficiaries: Number(formData.get("beneficiaries")),
      partner_name: formData.get("partner"),
    };

    try {
      const res = await fetch("/api/needs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(t("error.genericError")); // Using existing generic error

      setStatus({ type: "success", message: t("createNeed.success") });
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-primary">
        <Plus className="w-48 h-48" />
      </div>

      <div className="mb-10 relative">
        <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2 text-left rtl:text-right">
          {t("createNeed.title")}
        </h2>
        <p className="text-muted-foreground font-medium text-sm text-left rtl:text-right">
          {t("createNeed.formSubtitle")}
        </p>
      </div>

      {status && (
        <div
          className={`mb-8 p-4 rounded-xl text-sm font-bold border ${status.type === "success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl relative">
        {/* Row 1: Category + Title */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 text-left rtl:text-right">
              {t("createNeed.formCategory")}
            </label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="w-full h-[2.9rem]! rounded-xl border border-border bg-secondary/50 text-sm font-bold data-placeholder:text-muted-foreground text-left rtl:text-right">
                <SelectValue placeholder={t("createNeed.selectCategory")} />
              </SelectTrigger>
              <SelectContent className="max-h-60 rounded-xl border-border bg-popover shadow-2xl backdrop-blur-xl">
                <SelectGroup>
                  <SelectItem
                    value="meals"
                    className="text-left rtl:text-right"
                  >
                    {t("createNeed.categories.food")}
                  </SelectItem>
                  <SelectItem
                    value="medical"
                    className="text-left rtl:text-right"
                  >
                    {t("createNeed.categories.medical")}
                  </SelectItem>
                  <SelectItem
                    value="housing"
                    className="text-left rtl:text-right"
                  >
                    {t("createNeed.categories.housing")}
                  </SelectItem>
                  <SelectItem
                    value="other"
                    className="text-left rtl:text-right"
                  >
                    {t("createNeed.categories.other")}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 text-left rtl:text-right">
              {t("createNeed.formTitle")}
            </label>
            <Input
              name="title"
              required
              placeholder={t("createNeed.placeholderTitle")}
              className="h-12 border border-border text-sm font-bold rounded-xl bg-secondary/50 text-left rtl:text-right"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 text-left rtl:text-right">
            {t("createNeed.formDesc")}
          </label>
          <Textarea
            name="description"
            required
            rows={4}
            placeholder={t("createNeed.placeholderDesc")}
            className="border border-border rounded-xl bg-secondary/50 text-sm font-medium text-foreground min-h-28 resize-none text-left rtl:text-right"
          />
        </div>

        {/* Row 2: City + District */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 text-left rtl:text-right">
              {t("createNeed.formCity")}
            </label>
            <Select value={city} onValueChange={setCity} required>
              <SelectTrigger className="w-full h-[2.9rem]! rounded-xl border border-border bg-secondary/50 text-sm font-bold data-placeholder:text-muted-foreground text-left rtl:text-right">
                <SelectValue placeholder={t("createNeed.selectCity")} />
              </SelectTrigger>
              <SelectContent className="max-h-60 rounded-xl border-border bg-popover shadow-2xl backdrop-blur-xl">
                <SelectGroup>
                  {MAURITANIA_CITIES.map((c) => (
                    <SelectItem
                      key={c}
                      value={c}
                      className="text-left rtl:text-right"
                    >
                      {t_common(`cities.${c}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 text-left rtl:text-right">
              {t("createNeed.formDistrict")}
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
              <Input
                name="district"
                required
                placeholder={t("createNeed.placeholderDistrict")}
                className="h-12 border border-border pl-12 rtl:pl-4 rtl:pr-12 text-sm font-bold rounded-xl bg-secondary/50 text-left rtl:text-right"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Target + Beneficiaries */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 text-left rtl:text-right">
              {t("createNeed.formTarget")}
            </label>
            <Input
              name="target"
              type="number"
              required
              placeholder="5000"
              className="h-12 border border-border text-sm font-bold rounded-xl bg-secondary/50 text-left rtl:text-right"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 text-left rtl:text-right">
              {t("createNeed.formBeneficiaries")}
            </label>
            <Input
              name="beneficiaries"
              type="number"
              required
              placeholder="5"
              className="h-12 border border-border text-sm font-bold rounded-xl bg-secondary/50 text-left rtl:text-right"
            />
          </div>
        </div>

        {/* Partner (optional) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 text-left rtl:text-right">
            {t("createNeed.formPartner")}
          </label>
          <div className="relative">
            <Store className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
            <Input
              name="partner"
              placeholder={t("createNeed.placeholderPartner")}
              className="h-12 border border-border pl-12 rtl:pl-4 rtl:pr-12 text-sm font-bold rounded-xl bg-secondary/50 text-left rtl:text-right"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10 py-6 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center gap-3"
        >
          {loading ? (
            <>
              <Spinner size="sm" className="text-primary-foreground" />
              {t("createNeed.publishing")}
            </>
          ) : (
            <>
              {t("createNeed.publish")}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
