import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Need } from "@/types/need";
import Link from "next/link";

// Fix for default marker icons in Leaflet + Next.js
// Helper to create custom colored icons
const createIcon = (color: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="
    width: 20px; 
    height: 20px; 
    background-color: ${color}; 
    border: 3px solid white; 
    border-radius: 50%; 
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

// Primary yellow from globals.css is oklch(0.82 0.16 88)
// Let's use a standard hex for simplicity in Leaflet or just use a CSS variable if possible
const confirmedIcon = createIcon("#d1a000"); // Approximating the golden yellow
const inProgressIcon = createIcon("#3b82f6"); // blue-500
const otherIcon = createIcon("#94a3b8"); // slate-400 for unknown/other

interface MapInnerProps {
  needs?: Need[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  isInteractive?: boolean;
}

export default function MapInner({
  needs: externalNeeds,
  center = [18.0858, -15.9485],
  zoom = 12,
  className = "w-full h-full grayscale-[0.8] invert-[0.1]",
  isInteractive = true,
}: MapInnerProps) {
  const t = useTranslations("map");
  const [needs, setNeeds] = useState<any[]>(externalNeeds || []);
  const [loading, setLoading] = useState(!externalNeeds);

  useEffect(() => {
    if (externalNeeds) {
      setNeeds(externalNeeds);
      setLoading(false);
      return;
    }

    const fetchNeeds = async () => {
      try {
        const response = await fetch("/api/needs/funding");
        const data = await response.json();
        if (Array.isArray(data)) {
          setNeeds(data);
        }
      } catch (error) {
        console.error("Error fetching needs for map:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNeeds();
  }, [externalNeeds]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={isInteractive}
      className={className}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {!loading &&
        needs
          .filter((need) => need.lat != null && need.lng != null)
          .map((need, idx) => (
            <Marker
              key={need.id || idx}
              position={[need.lat, need.lng] as [number, number]}
              icon={
                need.status === "completed"
                  ? confirmedIcon
                  : ["active", "urgent", "inProgress"].includes(need.status)
                    ? inProgressIcon
                    : otherIcon
              }
            >
              <Popup className="custom-popup">
                <div className="p-2 text-left font-sans" dir="ltr">
                  <h3 className="font-bold text-primary mb-1">{need.title}</h3>
                  <p className="text-xs text-gray-700 mb-1">
                    <span className="opacity-60">{t("location")}:</span>{" "}
                    <span className="font-semibold">{need.district}</span>
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 my-2">
                    <div
                      className="h-1.5 rounded-full bg-primary"
                      style={{ width: `${need.funding_percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center gap-4 border-t pt-2">
                    <span className="text-[10px] font-mono font-bold text-primary">
                      {need.amount_required} MRU
                    </span>
                    <Link
                      href={`/catalog?need=${need.id}`}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      {t("viewDetails")}
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
    </MapContainer>
  );
}
