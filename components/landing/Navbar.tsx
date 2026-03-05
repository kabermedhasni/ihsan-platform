"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);
        };
        checkAuth();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-white/5 py-3" : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                        <Image
                            src="/images/logo.jpg"
                            alt="Ihsan Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter">IHSAN</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#how-it-works" className="text-sm font-medium text-foreground/70 hover:text-white transition-colors">How it Works</Link>
                    <Link href="#map" className="text-sm font-medium text-foreground/70 hover:text-white transition-colors">Needs</Link>
                    <Link href="#transparency" className="text-sm font-medium text-foreground/70 hover:text-white transition-colors">Transparency</Link>
                    <div className="w-px h-4 bg-white/10 mx-2" />
                    <Link href="/auth" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/10 transition-all">
                        {isAuthenticated ? "Dashboard" : "Get Started"}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-white/5 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
                            <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white">How it Works</Link>
                            <Link href="#map" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white">Needs</Link>
                            <Link href="#transparency" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white">Transparency</Link>
                            <Link href="/auth" className="px-6 py-4 bg-primary text-white rounded-2xl font-bold text-center">
                                {isAuthenticated ? "Dashboard" : "Get Started"}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
