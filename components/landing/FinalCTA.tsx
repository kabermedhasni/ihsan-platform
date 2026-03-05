"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function FinalCTA() {
  const t = useTranslations("cta");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 border-4 border-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-primary rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-flex p-4 rounded-3xl bg-primary text-white shadow-2xl shadow-primary/50">
            <Heart className="w-12 h-12 fill-current" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 dir-rtl text-center">
            وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ
          </h2>

          {!isAuthenticated && (
            <div>
              <Link
                href="/auth"
                className="px-12 py-5 text-primary bg-secondary hover:bg-secondary/90 rounded-2xl font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-3 w-full sm:w-auto mx-auto"
              >
                {t("getStarted")}
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
