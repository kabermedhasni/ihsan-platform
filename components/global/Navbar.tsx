"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";
import { logout } from "@/app/auth/actions";

interface NavLink {
  name: string;
  href: string;
  sectionId?: string;
}

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use undefined as "not yet determined" so we avoid flashing the wrong state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined,
  );
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("home");

  const isHome =
    pathname === "/" ||
    pathname === "/ar" ||
    pathname === "/fr" ||
    pathname === "/en";

  // ── Scroll handler ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    const applySession = async (sessionUser: any) => {
      if (!sessionUser) {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        return;
      }

      // Read role from profiles table (authoritative source)
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionUser.id)
        .single();

      const role = profile?.role || sessionUser.user_metadata?.role || "donor";

      setIsAuthenticated(true);
      setUser(sessionUser);
      setUserRole(role);
    };

    // getSession reads from cookie/localStorage synchronously (no network round-trip)
    // and fires immediately, preventing the logged-out flash on page load.
    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session?.user ?? null);
    });

    // Real-time listener for sign-in / sign-out events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Scroll Spy ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isHome || isAuthenticated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    ["home", "how-it-works", "map", "transparency"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome, isAuthenticated, pathname]);

  // ── Don't render on auth pages ───────────────────────────────────────────────
  if (pathname.includes("/auth")) return null;

  // ── While auth state is loading, render a skeleton navbar (no links shown) ──
  const authLoaded = isAuthenticated !== undefined;

  // ── Build nav links ──────────────────────────────────────────────────────────
  const navLinks: NavLink[] =
    !authLoaded || !isAuthenticated
      ? [
          { name: t("home"), href: "/#home", sectionId: "home" },
          {
            name: t("howItWorks"),
            href: "/#how-it-works",
            sectionId: "how-it-works",
          },
          { name: t("map"), href: "/#map", sectionId: "map" },
          {
            name: t("transparency"),
            href: "/#transparency",
            sectionId: "transparency",
          },
        ]
      : [
          { name: t("home"), href: "/" },
          { name: t("needs"), href: "/catalog" },
          { name: t("transparency"), href: "/transparency" },
        ];

  if (authLoaded && isAuthenticated && userRole) {
    navLinks.push({
      name: t("dashboard"),
      href: `/${userRole.toLowerCase()}`,
    });
  }

  const dashboardHref = userRole ? `/${userRole.toLowerCase()}` : "/auth";

  // ── Active detection ─────────────────────────────────────────────────────────
  const getIsActive = (link: NavLink) => {
    // Scroll-spy mode: logged-out user on home page
    if (!isAuthenticated && isHome && link.sectionId) {
      return activeSection === link.sectionId;
    }

    const cleanPath =
      (pathname.replace(/\/$/, "") || "/").replace(
        /^\/(ar|fr|en)(\/|$)/,
        "/",
      ) || "/";

    const cleanLinkHref = link.href.replace(/\/$/, "") || "/";

    if (cleanPath === cleanLinkHref) return true;
    if (cleanLinkHref === "/" && isHome) return true;
    if (
      cleanLinkHref !== "/" &&
      !cleanLinkHref.startsWith("/#") &&
      cleanPath.startsWith(cleanLinkHref)
    )
      return true;

    return false;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome
          ? "bg-background/80 backdrop-blur-lg border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 shadow-2xl group-hover:border-primary/50 transition-colors">
            <Image
              src="/images/logo.jpg"
              alt="Ihsan Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">
            IHSAN
          </span>
        </Link>

        {/* Desktop Links — only show once auth state is resolved */}
        {authLoaded && (
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isLinkActive = getIsActive(link);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-bold transition-all px-3 py-1.5 rounded-lg ${
                    isLinkActive
                      ? "text-primary bg-primary/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="w-px h-4 bg-white/10 mx-2" />

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-2.5 group/user"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-extrabold text-sm group-hover/user:bg-primary group-hover/user:text-white transition-all">
                    {user?.user_metadata?.display_name
                      ?.slice(0, 2)
                      .toUpperCase() || <UserIcon size={16} />}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-white leading-none">
                      {user?.user_metadata?.display_name ||
                        user?.email?.split("@")[0]}
                    </p>
                    <p className="text-[10px] text-white/40 uppercase tracking-tighter mt-1 font-black">
                      {userRole}
                    </p>
                  </div>
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="p-2 rounded-xl text-white/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                    title={t("signOut")}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                {t("getStarted")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && authLoaded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-white/5 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
              {navLinks.map((link) => {
                const isLinkActive = getIsActive(link);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl font-black transition-all ${
                      isLinkActive ? "text-primary" : "text-white/60"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {!isAuthenticated && (
                <Link
                  href="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-4 bg-primary text-white rounded-2xl font-bold text-center mt-4"
                >
                  {t("getStarted")}
                </Link>
              )}

              {isAuthenticated && (
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl font-bold text-center flex items-center justify-center gap-2 mt-4"
                  >
                    <LogOut size={18} />
                    {t("signOut")}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
