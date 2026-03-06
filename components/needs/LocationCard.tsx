"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../landing/MapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-secondary/20 animate-pulse rounded-2xl flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  ),
});

interface LocationCardProps {
  city: string;
  district: string;
  lat?: number;
  lng?: number;
}

export const LocationCard = ({
  city,
  district,
  lat,
  lng,
}: LocationCardProps) => {
  const t = useTranslations("needsDetail");

  return (
    <div className="mb-12">
      <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-primary" />
        </span>
        {t("locationHeader")}
      </h2>

      <div className="space-y-4">
        <div className="flex flex-col">
          <p className="font-black text-2xl text-foreground mb-1">{city}</p>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
            {district}
          </p>
        </div>

        <div className="h-80 w-full rounded-[2rem] overflow-hidden border border-border shadow-sm bg-secondary/10 relative">
          {lat && lng ? (
            <Map
              center={[lat, lng]}
              zoom={13}
              isInteractive={true}
              needs={
                [
                  {
                    id: "current",
                    lat: lat,
                    lng: lng,
                    title: city,
                    city: city,
                    district: district,
                  },
                ] as any
              }
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-medium text-sm">
              {t("notFound")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
