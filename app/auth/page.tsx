"use client";

import { useState, useEffect, Suspense } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

import {
  AnimatedTabs,
  AnimatedTabsContent,
  AnimatedTabsList,
  AnimatedTabsTrigger,
} from "@/components/ui/animated-tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthView = "login" | "register" | "forgot-password";

function AuthContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Persistent view state using URL params
  const currentView = (searchParams.get("view") as AuthView) || "login";

  const [role, setRole] = useState<"donneur" | "validateur" | "partenaire">(
    "donneur",
  );
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const setView = (view: AuthView) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden relative font-sans">
      {/* Dynamic CSS Background Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.35_0.06_152),oklch(0.15_0.03_152))]" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[30vh] bg-linear-to-b from-primary/5 to-transparent" />
      </div>

      <div className="flex w-full relative z-10 min-h-screen">
        {/* Left Side - Form Container */}
        <div className="flex w-full flex-col md:w-[45%] px-8 sm:px-16 lg:px-24 pt-[22vh] items-center text-left">
          <div className="w-full max-w-sm">
            {/* Logo - Stable Header */}
            <div className="mb-8 flex items-center gap-2">
              <div className="flex h-10 w-10 overflow-hidden rounded-lg transition-all hover:scale-105">
                <img
                  src="/images/logo.jpg"
                  alt="Ihsan Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground lowercase">
                ihsan
              </span>
            </div>

            <AnimatePresence mode="wait">
              {currentView !== "forgot-password" ? (
                <motion.div
                  key="auth-tabs-group"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full"
                >
                  <AnimatedTabs
                    value={currentView}
                    onValueChange={(v) => setView(v as AuthView)}
                    className="w-full"
                  >
                    <div className="mb-10">
                      <AnimatedTabsList className="grid w-full grid-cols-2 bg-muted/40 p-1.5 rounded-xl backdrop-blur-sm border border-border/20 h-12">
                        <AnimatedTabsTrigger
                          value="login"
                          className="h-full capitalize rounded-lg text-base"
                        >
                          Login
                        </AnimatedTabsTrigger>
                        <AnimatedTabsTrigger
                          value="register"
                          className="h-full capitalize rounded-lg text-base"
                        >
                          Register
                        </AnimatedTabsTrigger>
                      </AnimatedTabsList>
                    </div>

                    <div className="relative min-h-[500px]">
                      <AnimatePresence mode="wait">
                        {currentView === "login" && (
                          <motion.div
                            key="login-view"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-6"
                          >
                            <div className="space-y-1.5">
                              <h1 className="text-[2.5rem] font-bold tracking-tight text-foreground leading-tight">
                                Welcome Back!
                              </h1>
                              <p className="text-muted-foreground text-sm">
                                Please enter log in details below
                              </p>
                            </div>

                            <div className="space-y-4 pt-2">
                              <div className="space-y-1.5">
                                <Label htmlFor="login-email">Email</Label>
                                <Input
                                  id="login-email"
                                  type="email"
                                  placeholder="Email"
                                  className="h-12 rounded-xl border-border bg-background/30 backdrop-blur-md px-4 text-base focus-visible:ring-primary focus-visible:bg-background/50 transition-all"
                                  required
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="login-password">Password</Label>
                                <div className="relative">
                                  <Input
                                    id="login-password"
                                    type={
                                      showLoginPassword ? "text" : "password"
                                    }
                                    placeholder="Password"
                                    className="h-12 rounded-xl border-border bg-background/30 backdrop-blur-md px-4 pr-12 text-base focus-visible:ring-primary focus-visible:bg-background/50 transition-all"
                                    required
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowLoginPassword(!showLoginPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {showLoginPassword ? (
                                      <Eye className="size-5" />
                                    ) : (
                                      <EyeOff className="size-5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <button
                                onClick={() => setView("forgot-password")}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                              >
                                Forget password?
                              </button>
                            </div>

                            <Button
                              className="h-12 w-full rounded-xl bg-primary text-primary-foreground text-base font-bold hover:bg-primary/90 transition-all active:scale-[0.98]"
                              type="submit"
                            >
                              Sign In
                            </Button>
                          </motion.div>
                        )}

                        {currentView === "register" && (
                          <motion.div
                            key="register-view"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-6"
                          >
                            <div className="space-y-1.5">
                              <h1 className="text-[2.5rem] font-bold tracking-tight text-foreground leading-tight">
                                Get Started
                              </h1>
                              <p className="text-muted-foreground text-sm">
                                Join the community of IHSAN
                              </p>
                            </div>

                            <div className="space-y-3 pt-2">
                              <div className="space-y-1">
                                <Label htmlFor="register-name">Full Name</Label>
                                <Input
                                  id="register-name"
                                  placeholder="Full Name"
                                  className="h-12 rounded-xl border-border bg-background/30 backdrop-blur-md px-4 text-sm"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="register-email">Email</Label>
                                <Input
                                  id="register-email"
                                  type="email"
                                  placeholder="Email"
                                  className="h-12 rounded-xl border-border bg-background/30 backdrop-blur-md px-4 text-sm"
                                  required
                                />
                              </div>

                              <div className="space-y-2 pt-2">
                                <Label>Join as a</Label>
                                <div className="grid grid-cols-3 gap-3">
                                  <RoleCard
                                    active={role === "donneur"}
                                    onClick={() => setRole("donneur")}
                                    label="Donneur"
                                    desc="Give & track"
                                  />
                                  <RoleCard
                                    active={role === "validateur"}
                                    onClick={() => setRole("validateur")}
                                    label="Validateur"
                                    desc="Validate needs"
                                  />
                                  <RoleCard
                                    active={role === "partenaire"}
                                    onClick={() => setRole("partenaire")}
                                    label="Partenaire"
                                    desc="Iftar prep"
                                  />
                                </div>
                              </div>
                            </div>

                            <Button
                              className="h-12 w-full rounded-xl bg-primary text-primary-foreground text-base font-bold hover:bg-primary/90 transition-all active:scale-[0.98]"
                              type="submit"
                            >
                              Create Account
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </AnimatedTabs>
                </motion.div>
              ) : (
                <motion.div
                  key="forgot-password-view"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full flex flex-col"
                >
                  <button
                    onClick={() => setView("login")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-4 cursor-pointer w-fit"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </button>

                  <div className="pt-12 space-y-6">
                    <div className="space-y-1.5">
                      <h1 className="text-[2.5rem] font-bold tracking-tight text-foreground leading-tight">
                        Reset Password
                      </h1>
                      <p className="text-muted-foreground text-sm">
                        We'll send a link to your email
                      </p>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="forgot-email">Email Address</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="Email"
                          className="h-12 rounded-xl border-border bg-background/30 backdrop-blur-md px-4 text-base focus-visible:ring-primary"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      className="h-12 w-full rounded-xl bg-primary text-primary-foreground text-base font-bold hover:bg-primary/90 transition-all active:scale-[0.98]"
                      type="submit"
                    >
                      Send Reset Link
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side - Picture Cutout View */}
        <div className="hidden md:flex md:w-[55%] p-4 h-full max-h-screen relative z-10">
          <div className="w-full h-full bg-zinc-950/80 backdrop-blur-sm rounded-tr-lg rounded-tl-lg rounded-br-lg rounded-bl-[6rem] relative overflow-hidden flex flex-col items-center justify-center border border-white/5 shadow-2xl">
            {/* Inner glow/lighting effect for the cutout */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -ml-24 -mb-24" />

            {/* Picture Placeholder */}
            <div className="absolute inset-0 z-20 overflow-hidden">
              <img
                src="/images/right-side-picture.png"
                alt="Ihsan Platform Community"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Grid pattern peeking through slightly different on dark */}
            <div
              className="absolute inset-0 opacity-[0.03] z-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0 L120 60 L60 120 L0 60 Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: "120px 120px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthContent />
    </Suspense>
  );
}

function RoleCard({
  active,
  onClick,
  label,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 gap-1 h-32 group relative overflow-hidden backdrop-blur-md",
        active
          ? "bg-primary/10 border-primary ring-1 ring-primary/50"
          : "bg-background/20 border-border/30 hover:bg-background/30 hover:border-border/50",
      )}
    >
      <div className="text-center z-10">
        <p
          className={cn(
            "text-sm font-bold",
            active ? "text-primary" : "text-foreground",
          )}
        >
          {label}
        </p>
        <p className="text-[10px] text-muted-foreground leading-tight hidden sm:block mt-1">
          {desc}
        </p>
      </div>
    </button>
  );
}
