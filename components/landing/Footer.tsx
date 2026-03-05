import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="py-12 bg-background border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 shadow-2xl">
              <Image
                src="/images/logo.jpg"
                alt="Ihsan Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">
              IHSAN
            </span>
          </div>

          <div className="text-muted-foreground text-sm text-center md:text-start rtl:md:text-right">
            © {new Date().getFullYear()} {t("platform")}. {t("allRights")}
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex gap-6 text-foreground/40 text-sm">
              <a href="#" className="hover:text-primary transition-colors">
                {t("privacy")}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {t("terms")}
              </a>
            </div>
            <LanguageSwitcher align="end" side="top" />
          </div>
        </div>
      </div>
    </footer>
  );
}
