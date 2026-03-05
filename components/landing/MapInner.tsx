import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix for default marker icons in Leaflet + Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function MapInner() {
    const [districts, setDistricts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNeeds = async () => {
            try {
                const response = await fetch('/api/needs/funding');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setDistricts(data);
                }
            } catch (error) {
                console.error('Error fetching needs for map:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNeeds();
    }, []);

    return (
        <MapContainer
            center={[18.0858, -15.9485]}
            zoom={12}
            className="w-full h-full grayscale-[0.8] invert-[0.1]"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {!loading && districts.map((district, idx) => (
                <Marker key={district.id || idx} position={[district.lat, district.lng] as [number, number]} icon={icon}>
                    <Popup className="custom-popup">
                        <div className="p-2 text-left">
                            <h3 className="font-bold text-emerald-900 mb-1">{district.title}</h3>
                            <p className="text-sm text-gray-700 mb-2">Location: <span className="font-semibold">{district.district}</span></p>
                            <p className="text-sm text-gray-700 mb-2">Help Type: <span className="font-semibold">{district.description}</span></p>
                            <div className="flex justify-between items-center gap-4 border-t pt-2">
                                <span className="text-xs font-mono font-bold text-emerald-600">{district.amount_required} MRU</span>
                                <span className="text-xs font-medium px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{district.funding_percentage}% funded</span>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
