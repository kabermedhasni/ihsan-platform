"use client";
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className="group relative p-6 rounded-2xl bg-secondary/30 border border-white/5 hover:border-primary/50 transition-all duration-500 flex flex-col gap-4">
    <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-black text-foreground tracking-tighter text-left rtl:text-right">
        {value}
      </p>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 text-left rtl:text-right">
        {label}
      </p>
    </div>
    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);
