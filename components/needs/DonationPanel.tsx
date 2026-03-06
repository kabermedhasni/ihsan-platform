"use client";

import React, { useState, useEffect } from "react";
import { Heart, ShieldCheck, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export const DonationPanel = ({ needId }: { needId: string }) => {
  const t = useTranslations("needsDetail");
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Fetch role from profile as the authoritative source
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const finalRole =
          profile?.role?.toLowerCase() ||
          user.user_metadata?.role?.toLowerCase() ||
          "donor";
        setRole(finalRole);
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const handleDonate = () => {
    if (!user || role !== "donor") {
      if (!user) router.push("/auth");
      return;
    }
    router.push(`/donate/${needId}`);
  };

  const isRestricted = !authLoading && user && role !== "donor";

  return (
    <div className="bg-card rounded-4xl p-8 md:p-10 shadow-2xl border border-border sticky top-28">
      <div className="space-y-6">
        <button
          disabled={isRestricted || authLoading}
          onClick={handleDonate}
          className={`w-full font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg ${
            isRestricted || authLoading
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          <Heart
            className={`w-6 h-6 ${isRestricted ? "" : "fill-primary-foreground"}`}
          />
          {t("donation.submit")}
        </button>

        {isRestricted && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{t("donation.donorOnly")}</span>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 pt-4">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-primary" />
            {t("donation.verifiedNote")}
          </div>
          <div className="w-full h-px bg-border" />
          <p className="text-[10px] text-muted-foreground text-center leading-relaxed font-bold">
            {t("donation.beneficiaryNote")}
          </p>
        </div>
      </div>
    </div>
  );
};
