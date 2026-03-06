"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, MapPin, Clock, Calendar, CheckCircle2 } from "lucide-react";

interface Order {
    id: string;
    realId: string;
    city: string;
    district: string;
    type: string;
    amount: number;
    scheduledTime: string;
    status: string;
    validatorName: string;
    beneficiaries: number;
    notes: string;
    deliveryWindow: string;
}

interface OrderModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderModal({ order, isOpen, onClose }: OrderModalProps) {
    if (!order) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-secondary p-8 text-foreground relative border-b border-border">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-background/50 hover:bg-background rounded-full transition-colors border border-border"
                            >
                                <X size={20} />
                            </button>
                            <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">Order Details</p>
                            <h2 className="text-4xl font-black tracking-tighter">#{order.id}</h2>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Location Info</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-2xl border border-border">
                                            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">District</p>
                                                <p className="text-sm font-black text-foreground tracking-tight">{order.district}, {order.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Verification</h4>
                                    <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-2xl border border-border">
                                        <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Validator</p>
                                            <p className="text-sm font-black text-foreground tracking-tight">{order.validatorName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Preparation</h4>
                                    <div className="bg-secondary/30 p-6 rounded-[2rem] border border-border space-y-4">
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-muted-foreground text-xs uppercase tracking-widest">Meal Type</span>
                                            <span className="text-foreground font-black">{order.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-muted-foreground text-xs uppercase tracking-widest">Quantity</span>
                                            <span className="text-foreground font-black">{order.beneficiaries} Units</span>
                                        </div>
                                        <div className="pt-4 border-t border-border flex justify-between items-center">
                                            <span className="text-muted-foreground text-xs uppercase tracking-widest">Scheduled</span>
                                            <div className="flex items-center gap-2 text-primary font-black">
                                                <Clock size={16} />
                                                <span className="tracking-tighter">{order.scheduledTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Note */}
                            <div className="md:col-span-2">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Internal Notes</h4>
                                <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                                    <p className="text-sm font-medium text-foreground leading-relaxed italic opacity-80">
                                        "{order.notes || "No special instructions provided for this order."}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pt-0">
                            <button
                                onClick={onClose}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                            >
                                Close Details
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
