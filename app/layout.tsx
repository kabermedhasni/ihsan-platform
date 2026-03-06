import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ihsan Platform",
  description: "Doing good with excellence",
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${quicksand.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <PageTransition>
            <main className="min-h-screen flex flex-col">{children}</main>
          </PageTransition>
          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              className:
                "backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl px-4 py-3 font-sans",
              style: {
                background: "rgba(0, 0, 0, 0.3)",
              },
              classNames: {
                toast: "flex items-center gap-3",
                error:
                  "border-destructive! text-destructive! bg-destructive/10!",
                success:
                  "border-emerald-500! text-emerald-400! bg-emerald-500/10!",
                warning: "border-amber-500! text-amber-400! bg-amber-500/10!",
                info: "border-sky-500! text-sky-400! bg-sky-500/10!",
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
