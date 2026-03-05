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
                        className="relative w-full max-w-2xl bg-card rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-secondary p-8 text-white relative border-b border-white/5">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-2">Order Details</p>
                            <h2 className="text-3xl font-black">#{order.id}</h2>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Location Info</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="p-2 bg-secondary rounded-lg">
                                                <MapPin size={18} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase">District</p>
                                                <p className="text-sm font-black text-white">{order.district}, {order.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Verification</h4>
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="p-2 bg-secondary rounded-lg">
                                            <User size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase">Validator</p>
                                            <p className="text-sm font-black text-white">{order.validatorName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Preparation</h4>
                                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-muted-foreground">Meal Type</span>
                                            <span className="text-white">{order.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-muted-foreground">Quantity</span>
                                            <span className="text-white">{order.beneficiaries} Beneficiaries</span>
                                        </div>
                                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                            <span className="text-muted-foreground">Scheduled Time</span>
                                            <div className="flex items-center gap-2 text-primary font-black">
                                                <Clock size={16} />
                                                <span>{order.scheduledTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Note */}
                            <div className="md:col-span-2">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Internal Notes</h4>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-sm font-bold text-emerald-100/60 leading-relaxed italic">
                                        "{order.notes || "No special instructions provided for this order."}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pt-0">
                            <button
                                onClick={onClose}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black hover:opacity-90 transition-all shadow-xl shadow-primary/20"
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
