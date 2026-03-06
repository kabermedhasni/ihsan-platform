import { useTranslations } from "next-intl";

export default function TransparencyPage() {
  const t = useTranslations("transparency");

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-black mb-8">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">{t("description")}</p>
      </div>
    </div>
  );
}
