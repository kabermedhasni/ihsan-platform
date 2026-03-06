"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useTranslations } from "next-intl";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    city: string;
    district: string;
  }) => void;
}

function LocationMarker({ onLocationSelect }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    async click(e) {
      setPosition(e.latlng);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&accept-language=en`,
        );
        const data = await response.json();

        // Extract best city/district matches from Nominatim response
        const address = data.address || {};
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.region ||
          address.state ||
          "";
        const district =
          address.suburb || address.neighbourhood || address.county || "";

        onLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          city,
          district,
        });
      } catch (error) {
        console.error("Geocoding reverse lookup failed", error);
        // Save the coordinates even if reverse lookup fails
        onLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          city: "",
          district: "",
        });
      }
    },
  });

  return position === null ? null : <Marker position={position} icon={icon} />;
}

export function MapPicker({ onLocationSelect }: MapPickerProps) {
  const t = useTranslations("validator.createNeed");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient)
    return (
      <div className="h-[250px] w-full rounded-xl bg-secondary animate-pulse" />
    );

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 text-left rtl:text-right block">
        {t("formLocation")}
      </label>
      <div className="h-[250px] w-full rounded-xl overflow-hidden border border-border">
        <MapContainer
          center={[18.0858, -15.9485]} // Default centered on Nouakchott
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelect={onLocationSelect} />
        </MapContainer>
      </div>
      <p className="text-xs text-muted-foreground italic px-1 text-left rtl:text-right">
        {t("formLocationHint")}
      </p>
    </div>
  );
}
