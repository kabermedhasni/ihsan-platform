"use client";

import React, { useState } from "react";
import { Plus, Store, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

export const CreateNeedForm = () => {
    const t = useTranslations("validator");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            category: formData.get('category'),
            title: formData.get('title'),
            description: formData.get('description'),
            city: formData.get('city'),
            district: formData.get('district'),
            amount_required: Number(formData.get('target')),
            beneficiaries: Number(formData.get('beneficiaries')),
            partner_name: formData.get('partner') // Optional
        };

        try {
            const res = await fetch('/api/needs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to create need');

            setStatus({ type: 'success', message: 'Need created successfully!' });
            // Refresh or redirect
            setTimeout(() => window.location.reload(), 2000);
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-primary">
                <Plus className="w-48 h-48" />
            </div>

            <div className="mb-10 relative">
                <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2">{t('createNeed.title')}</h2>
                <p className="text-muted-foreground font-medium text-sm">Post a new community need to start collecting donations.</p>
            </div>

            {status && (
                <div className={`mb-8 p-4 rounded-xl text-sm font-bold ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl relative">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{t('createNeed.formCategory')}</label>
                        <select name="category" required className="w-full bg-secondary border-2 border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none outline-none">
                            <option value="food">{t('createNeed.categories.food')}</option>
                            <option value="medical">{t('createNeed.categories.medical')}</option>
                            <option value="housing">{t('createNeed.categories.housing')}</option>
                            <option value="other">{t('createNeed.categories.other')}</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{t('createNeed.formTitle')}</label>
                        <Input name="title" required placeholder="e.g., 10 Food Kits for Families" className="h-12 border-2 text-sm font-bold rounded-xl bg-secondary" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{t('createNeed.formDesc')}</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        placeholder="Describe the need in detail..."
                        className="w-full bg-secondary border-2 border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none md:rtl:text-right"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{t('createNeed.formCity')}</label>
                        <Input name="city" required placeholder="Nouakchott" className="h-12 border-2 text-sm font-bold rounded-xl bg-secondary" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{t('createNeed.formDistrict')}</label>
                        <Input name="district" required placeholder="Tevragh Zeina" className="h-12 border-2 text-sm font-bold rounded-xl bg-secondary" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{t('createNeed.formTarget')}</label>
                        <Input name="target" type="number" required placeholder="5000" className="h-12 border-2 text-sm font-bold rounded-xl bg-secondary" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{t('createNeed.formBeneficiaries')}</label>
                        <Input name="beneficiaries" type="number" required placeholder="5" className="h-12 border-2 text-sm font-bold rounded-xl bg-secondary" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{t('createNeed.formPartner')}</label>
                    <div className="relative">
                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <Input name="partner" placeholder="Optional: Restaurant or Store Name" className="h-12 border-2 pl-12 text-sm font-bold rounded-xl bg-secondary" />
                    </div>
                </div>

                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full md:w-auto px-10 py-4 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                    {loading ? 'Publishing...' : t('createNeed.publish')}
                    <ArrowRight className="w-5 h-5" />
                </motion.button>
            </form>
        </div>
    );
};
