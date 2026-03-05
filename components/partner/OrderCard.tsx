"use client";

import { MapPin, Clock, ArrowRight, Info } from "lucide-react";
import StatusBadge, { OrderStatus } from "./StatusBadge";

interface Order {
    id: string;
    realId: string;
    city: string;
    district: string;
    type: string;
    amount: number;
    scheduledTime: string;
    status: OrderStatus;
    validatorName: string;
    beneficiaries: number;
    notes: string;
    deliveryWindow: string;
}

interface OrderCardProps {
    order: Order;
    onUpdateStatus: (id: string, nextStatus: OrderStatus) => void;
    onViewDetails: (order: Order) => void;
}

export default function OrderCard({ order, onUpdateStatus, onViewDetails }: OrderCardProps) {
    const getNextStatus = (current: OrderStatus): OrderStatus | null => {
        if (current === "Funded") return "Preparing";
        if (current === "Preparing") return "Ready";
        if (current === "Ready") return "Delivered";
        return null;
    };

    const nextStatus = getNextStatus(order.status);

    return (
        <div className="bg-secondary/20 backdrop-blur-sm p-6 rounded-3xl border border-white/5 flex flex-col gap-4 group hover:border-primary/20 transition-all hover:bg-secondary/30">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Order #{order.id}</p>
                    <h3 className="text-lg font-black text-white">{order.type}</h3>
                </div>
                <StatusBadge status={order.status} />
            </div>

            <div className="space-y-3 py-4 border-y border-white/5">
                <div className="flex items-center gap-3 text-emerald-100/60">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-sm font-bold">{order.district}, {order.city}</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-100/60">
                    <Clock size={16} className="text-primary" />
                    <span className="text-sm font-bold">Scheduled: {order.scheduledTime}</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <p className="text-[10px] font-bold text-muted-foreground lowercase">Target</p>
                    <p className="text-sm font-black text-primary">{order.amount} MRU</p>
                </div>
                <button
                    onClick={() => onViewDetails(order)}
                    className="p-2 hover:bg-white/5 rounded-xl text-primary transition-colors"
                >
                    <Info size={20} />
                </button>
            </div>

            <div className="flex gap-2 mt-2">
                {nextStatus && (
                    <button
                        onClick={() => onUpdateStatus(order.id, nextStatus)}
                        className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
                    >
                        Move to {nextStatus}
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
}
