"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
    ArrowLeft,
    MapPin,
    Tag,
    Users,
    ShieldCheck,
    CheckCircle,
    Clock,
    AlertCircle,
    Banknote,
    Hash,
    Box
} from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

interface VerifyData {
    donation: any;
    need: any;
    confirmation: any;
    validator: any;
}

export default function VerifyDonationPage() {
    const params = useParams();
    const router = useRouter();
    const t = useTranslations("verifyPage");
    const tDonor = useTranslations("donor");

    const [data, setData] = useState<VerifyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVerificationData = async () => {
            if (!params?.id) return;

            try {
                const id = params.id as string;

                const supabase = createClient();

                // 1. Fetch donation
                const { data: donation, error: donationError } = await supabase
                    .from("donations")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (donationError || !donation) {
                    throw new Error("Donation not found");
                }

                // 2. Fetch need
                let need = null;
                if (donation.need_id) {
                    const { data: needData } = await supabase
                        .from("needs")
                        .select("*")
                        .eq("id", donation.need_id)
                        .single();
                    need = needData;
                }

                // 3. Fetch confirmation (if any)
                let confirmation = null;
                let validator = null;
                if (donation.need_id) {
                    const { data: confData } = await supabase
                        .from("confirmations")
                        .select("*")
                        .eq("need_id", donation.need_id)
                        .single();

                    if (confData) {
                        confirmation = confData;
                        // Fetch validator profile
                        const { data: valData } = await supabase
                            .from("profiles")
                            .select("*")
                            .eq("id", confData.validator_id)
                            .single();
                        validator = valData;
                    }
                }

                setData({ donation, need, confirmation, validator });
            } catch (err: any) {
                console.error("Verification fetch error:", err);
                setError(t("notFound"));
            } finally {
                setLoading(false);
            }
        };

        fetchVerificationData();
    }, [params.id, t]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Spinner size="lg" className="text-primary mb-4" />
                <p className="text-muted-foreground font-medium animate-pulse">{t("loading")}</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-12 h-12 text-destructive" />
                    </div>
                    <h2 className="text-3xl font-black text-foreground">{t("error")}</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <Button asChild className="w-full">
                        <Link href="/donor">
                            <ArrowLeft className="w-4 h-4 mr-2 rtl:rotate-180 rtl:ml-2 rtl:mr-0" />
                            {t("backToDonor")}
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const { donation, need, confirmation, validator } = data;
    const isConfirmed = donation.status === "completed" || confirmation;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans rtl:text-right">
            <div className="container mx-auto max-w-5xl px-6 py-24">

                {/* HEADER SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Link
                        href="/donor"
                        className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 rtl:rotate-180 rtl:ml-2 rtl:mr-0" />
                        {t("backToDonor")}
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{t("title")}</h1>
                            <p className="text-muted-foreground font-medium text-lg">{t("subtitle")}</p>
                        </div>
                        {isConfirmed ? (
                            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-6 py-3 rounded-2xl border border-emerald-500/20">
                                <CheckCircle className="w-6 h-6" />
                                <span className="font-black text-sm uppercase tracking-widest">{tDonor("delivered")}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-2xl border border-primary/20">
                                <Clock className="w-6 h-6" />
                                <span className="font-black text-sm uppercase tracking-widest">{tDonor("inProgress")}</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* LEFT COLUMN: DONATION & NEED INFO */}
                    <div className="space-y-8">

                        {/* DONATION CARD */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card border border-border rounded-4xl p-8 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Box className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tighter">{t("donationDetails")}</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t("amount")}</p>
                                    <p className="text-3xl font-black text-primary">{Number(donation.amount).toLocaleString()} MRO</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t("date")}</p>
                                        <p className="font-semibold">{new Date(donation.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t("status")}</p>
                                        <p className="font-semibold capitalize text-primary">{donation.status}</p>
                                    </div>
                                </div>

                                {donation.hash && (
                                    <div className="bg-secondary/50 p-4 rounded-2xl border border-border">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                                            <Hash className="w-3.5 h-3.5" />
                                            {t("transactionHash")}
                                        </p>
                                        <p className="font-mono text-xs break-all text-foreground/80">{donation.hash}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* NEED CARD */}
                        {need && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-card border border-border rounded-4xl p-8 shadow-sm"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tighter">{t("needDetails")}</h2>
                                </div>

                                <h3 className="font-bold text-xl mb-6">{need.title}</h3>

                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {t("location")}</p>
                                        <p className="font-semibold">{need.city}, {need.district}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {t("category")}</p>
                                        <p className="font-semibold capitalize">{need.category}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {t("beneficiaries")}</p>
                                        <p className="font-semibold">{need.beneficiaries_count || "—"} People</p>
                                    </div>
                                </div>

                                <Button asChild variant="outline" className="w-full mt-6 rounded-xl">
                                    <Link href={`/needs/${need.id}`}>
                                        {t("viewNeed")}
                                    </Link>
                                </Button>
                            </motion.div>
                        )}

                    </div>

                    {/* RIGHT COLUMN: VALIDATION & PROOF */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-card border border-border rounded-4xl p-8 shadow-sm h-full flex flex-col items-start"
                        >
                            <div className="flex items-center gap-3 mb-8 w-full">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrinks-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter">{t("validationProof")}</h2>
                                    <p className="text-xs font-semibold text-muted-foreground mt-1">{t("blockchainNote")}</p>
                                </div>
                            </div>

                            {confirmation ? (
                                <div className="w-full space-y-6">
                                    {confirmation.proof_image ? (
                                        <div className="rounded-3xl overflow-hidden border border-border">
                                            <img
                                                src={confirmation.proof_image}
                                                alt="Proof of Delivery"
                                                className="w-full h-auto object-cover max-h-80"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full py-12 bg-secondary/50 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                                            <ShieldCheck className="w-12 h-12 mb-3 opacity-20" />
                                            <p className="text-sm font-bold uppercase tracking-widest">{t("proofImage")} N/A</p>
                                        </div>
                                    )}

                                    <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            {t("validationMessage")}
                                        </p>
                                        <p className="text-sm font-semibold text-foreground/90 leading-relaxed italic">
                                            "{confirmation.message || "Delivery confirmed successfully."}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t("validationDate")}</p>
                                            <p className="font-bold text-sm">{new Date(confirmation.created_at).toLocaleDateString()}</p>
                                        </div>
                                        {validator && (
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t("verifiedBy")}</p>
                                                <p className="font-bold text-sm text-primary">{validator.display_name || "Field Validator"}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center w-full py-20 text-center">
                                    <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-6">
                                        <Clock className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tighter mb-2">Pending Validation</h3>
                                    <p className="text-muted-foreground max-w-xs">{t("noProofYet")}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
