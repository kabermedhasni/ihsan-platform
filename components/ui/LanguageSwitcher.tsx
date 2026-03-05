"use client";

import { useTransition, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LOCALES = [
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
] as const;

type LocaleCode = "ar" | "en" | "fr";

interface LanguageSwitcherProps {
  variant?: "default" | "compact";
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "end" | "center";
}

export default function LanguageSwitcher({
  variant = "default",
  side = "bottom",
  align = "start",
}: LanguageSwitcherProps) {
  const locale = useLocale() as LocaleCode;
  const t = useTranslations("language");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const handleLocaleChange = (newLocale: LocaleCode) => {
    if (newLocale === locale) return;

    startTransition(() => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("skip-animations", "true");
      }

      document.cookie = `locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
      window.location.reload();
    });
  };

  const ArrowIcon = side === "top" ? ChevronUp : ChevronDown;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          disabled={isPending}
          className={cn(
            "flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-white/10 hover:text-white transition-all duration-200 outline-none focus:ring-1 focus:ring-primary/50 w-36",
            isPending && "opacity-60 cursor-not-allowed",
            open && "bg-white/10 text-white border-primary/30",
          )}
          aria-label={t("label")}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 shrink-0 text-primary" />
            {variant === "default" && <span>{currentLocale.label}</span>}
          </div>
          {variant === "default" && (
            <ArrowIcon
              className={cn(
                "h-3.5 w-3.5 opacity-50 transition-transform duration-300",
                open && "rotate-180",
              )}
            />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={side}
        align={align}
        className="w-36 border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl p-1 rounded-xl"
      >
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => handleLocaleChange(l.code)}
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2 cursor-pointer transition-colors rounded-lg",
              locale === l.code
                ? "text-primary font-semibold bg-primary/5"
                : "text-foreground/70",
            )}
          >
            <span>{l.label}</span>
            {locale === l.code && <Check className="h-3.5 w-3.5 shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
