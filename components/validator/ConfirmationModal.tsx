"use client";

import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Need } from "./NeedCard";

interface ConfirmationModalProps {
  need: Need | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmationModal = ({
  need,
  isOpen,
  onClose,
}: ConfirmationModalProps) => {
  const t = useTranslations("validator");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !need) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/confirmations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          need_id: need.id,
          message,
          proof_image:
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop", // Placeholder for now
        }),
      });

      if (!res.ok) throw new Error("Failed to confirm delivery");

      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
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
        className="bg-card w-full max-w-lg border border-border rounded-4xl shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="p-8 pb-0 flex justify-between items-start">
          <div>
            <StatusBadge status="confirmed" />
            <h2 className="text-2xl font-black text-foreground mt-4 tracking-tighter text-left rtl:text-right">
              {t("confirmModal.title")}
            </h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 text-left rtl:text-right">
              {need.title}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-colors font-black"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive text-sm font-bold rounded-xl border border-destructive/20">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
              {t("confirmModal.uploadProof")}
            </label>
            <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all font-black">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-black text-foreground mb-1 text-left rtl:text-right">
                Upload Photo or Video
              </p>
              <p className="text-xs text-muted-foreground font-medium text-left rtl:text-right">
                PNG, JPG or MP4 up to 10MB
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
              {t("confirmModal.message")}
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("confirmModal.messagePlaceholder")}
              className="w-full bg-secondary border-2 border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-left rtl:text-right"
            />
          </div>

          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full py-7 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-all"
          >
            {loading ? "Confirming..." : t("confirmModal.confirm")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
