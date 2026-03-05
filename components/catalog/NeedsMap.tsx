"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Map as MapIcon } from 'lucide-react';
import { Need } from '@/types/need';
import { getCategoryLabel } from './CategoryIcon';

const NeedsMapInner = dynamic(
    () => import('react-leaflet').then(mod => {
        const { MapContainer, TileLayer, Marker, Popup } = mod;

        return function MapComponent({ needs }: { needs: Need[] }) {
            return (
                <MapContainer
                    center={[18.0735, -15.9582]}
                    zoom={6}
                    scrollWheelZoom={false}
                    className="h-full w-full z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {needs.map((need) => (
                        <Marker key={need.id} position={[need.lat, need.lng]}>
                            <Popup className="font-sans">
                                <div dir="ltr" className="text-left p-1 max-w-[200px]" style={{ color: 'oklch(0.25 0.04 152)' }}>
                                    <div className="font-bold text-sm mb-1">{need.title}</div>
                                    <div className="text-xs font-medium mb-2" style={{ color: 'oklch(0.82 0.16 88)' }}>{getCategoryLabel(need.category)}</div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                        <div
                                            className="h-1.5 rounded-full"
                                            style={{ width: `${need.funding_percentage}%`, background: 'oklch(0.82 0.16 88)' }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 flex justify-between mb-2">
                                        <span>{need.total_donated.toLocaleString()} / {need.amount_required.toLocaleString()} MRU</span>
                                    </div>
                                    <Link
                                        href={`/donate/${need.id}`}
                                        className="mt-2 block text-center w-full py-1.5 rounded text-xs font-bold hover:opacity-90 transition-opacity"
                                        style={{ background: 'oklch(0.82 0.16 88)', color: 'oklch(0.25 0.04 152)' }}
                                    >
                                        Donate
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            );
        };
    }),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground">
                <MapIcon className="w-8 h-8 opacity-20" />
            </div>
        )
    }
);

export default NeedsMapInner;
