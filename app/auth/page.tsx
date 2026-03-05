"use client";

import { useState, useCallback, Suspense, useEffect, useRef } from "react";
import { Eye, EyeOff, ArrowLeft, Check, X, Info } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

import {
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
} from "@/components/ui/animated-tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  signup,
  login,
  verifyOTP,
  resetPassword,
  updatePassword,
} from "./actions";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthView =
  | "login"
  | "register"
  | "forgot-password"
  | "verify-otp"
  | "new-password"
  | "verify-recovery";

interface FieldState {
  value: string;
  touched: boolean;
  focused: boolean;
  editedSinceError: boolean;
  isDirty: boolean;
}

// ─── Validation helpers ───────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email: string) => {
  if (!email) return "required";
  if (!EMAIL_REGEX.test(email)) return "invalid";
  return null;
};

const validateName = (name: string) => {
  if (!name) return "required";
  if (name.replace(/\s/g, "").length < 2) return "short";
  return null;
};

const passwordRules = [
  {
    key: "length",
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8,
  },
  {
    key: "uppercase",
    label: "One uppercase letter (A–Z)",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    key: "lowercase",
    label: "One lowercase letter (a–z)",
    test: (p: string) => /[a-z]/.test(p),
  },
  {
    key: "digit",
    label: "One number (0–9)",
    test: (p: string) => /[0-9]/.test(p),
  },
  {
    key: "special",
    label: "One special character (!@#…)",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

const validatePassword = (password: string) => {
  if (!password) return "required";
  for (const rule of passwordRules) {
    if (!rule.test(password)) return "invalid";
  }
  return null;
};

// ─── Animated error message ───────────────────────────────────────────────────

function FieldError({ message }: { message: string | null }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          key="error"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden text-xs text-destructive font-medium pt-1 rtl:text-right"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// ─── Password tooltip checklist ───────────────────────────────────────────────

function PasswordTooltipContent({ password }: { password: string }) {
  const t = useTranslations("auth.passwordRules");
  return (
    <div className="space-y-1.5 p-1 min-w-[220px]">
      <p className="text-xs font-semibold text-foreground mb-2">{t("title")}</p>
      {passwordRules.map((rule) => {
        const passed = rule.test(password);
        return (
          <div key={rule.key} className="flex items-center gap-2">
            <div
              className={cn(
                "shrink-0 size-4 rounded-full flex items-center justify-center transition-colors duration-300",
                passed ? "bg-primary" : "bg-muted-foreground/30",
              )}
            >
              {passed ? (
                <Check className="size-2.5 text-primary-foreground stroke-3" />
              ) : (
                <X className="size-2.5 text-muted-foreground stroke-3" />
              )}
            </div>
            <span
              className={cn(
                "text-xs transition-colors duration-300",
                passed ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {t(rule.key as any)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Validated email input ────────────────────────────────────────────────────

function EmailField({
  id,
  name,
  field,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  className,
}: {
  id: string;
  name: string;
  field: FieldState;
  onChange: (v: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  placeholder?: string;
  className?: string;
}) {
  const t = useTranslations("auth");

  const getError = () => {
    if (!field.touched || !field.isDirty) return null;
    const err = validateEmail(field.value);
    if (err === "required") return t("error.emailRequired");
    if (err === "invalid") return t("error.emailInvalid");
    return null;
  };

  const error = getError();
  const isInvalid = !!(
    field.touched &&
    field.isDirty &&
    !field.editedSinceError &&
    error
  );

  return (
    <div className="space-y-0">
      <Input
        id={id}
        name={name}
        type="email"
        placeholder={placeholder ?? "Email"}
        value={field.value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-invalid={isInvalid}
        className={cn(
          "h-12 rounded-xl border-border bg-background/30 backdrop-blur-md px-4 text-base transition-all duration-300",
          "focus-visible:ring-primary focus-visible:bg-background/50",
          isInvalid &&
            "border-destructive! focus-visible:ring-destructive! focus-visible:border-destructive! ring-destructive!",
          className,
        )}
        required
      />
      <FieldError message={field.editedSinceError ? null : error} />
    </div>
  );
}

// ─── Validated password input with tooltip ────────────────────────────────────

function PasswordField({
  id,
  name,
  field,
  onChange,
  onBlur,
  onFocus,
  showPassword,
  onToggleShow,
  validate,
  placeholder,
  className,
}: {
  id: string;
  name: string;
  field: FieldState;
  onChange: (v: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  showPassword: boolean;
  onToggleShow: () => void;
  validate: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const locale = useLocale();
  const isRtl = locale === "ar";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;
    if (!tooltipOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!tooltipRef.current || !target) return;
      if (!tooltipRef.current.contains(target)) {
        setTooltipOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [tooltipOpen]);

  const t = useTranslations("auth");

  const getError = () => {
    if (!field.touched || !field.isDirty) return null;
    if (!field.value) return t("error.required") || "Required";
    const err = validate ? validatePassword(field.value) : null;
    if (err === "required") return t("error.required") || "Required";
    if (err === "invalid") return t("error.invalid") || "Invalid";
    return null;
  };
  const error = getError();
  const isInvalid = !!(
    field.touched &&
    field.isDirty &&
    !field.editedSinceError &&
    error
  );

  return (
    <div className="space-y-0">
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder ?? "Password"}
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          aria-invalid={isInvalid}
          className={cn(
            "h-12 rounded-xl border-border bg-background/30 backdrop-blur-md px-4 pr-20 rtl:pr-4 rtl:pl-20 text-base transition-all duration-300",
            "focus-visible:ring-primary focus-visible:bg-background/50",
            isInvalid &&
              "border-destructive! focus-visible:ring-destructive! focus-visible:border-destructive! ring-destructive!",
            className,
          )}
          required
        />
        <div
          ref={tooltipRef}
          className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 flex items-center gap-1"
        >
          {validate && (
            <Tooltip
              open={tooltipOpen}
              onOpenChange={(open) => {
                if (window.innerWidth >= 768) setTooltipOpen(open);
              }}
            >
              <TooltipTrigger asChild>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.innerWidth < 768) {
                      setTooltipOpen((prev) => !prev);
                    }
                  }}
                  onMouseEnter={() => {
                    if (window.innerWidth >= 768) setTooltipOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (window.innerWidth >= 768) setTooltipOpen(false);
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors p-1 outline-none"
                  aria-label={t("passwordRules.title")}
                >
                  <Info className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side={isRtl ? "left" : "right"}
                sideOffset={8}
                className="bg-card border border-border/50 text-foreground shadow-xl px-4 py-3"
              >
                <PasswordTooltipContent password={field.value} />
              </TooltipContent>
            </Tooltip>
          )}
          <button
            type="button"
            onClick={onToggleShow}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {showPassword ? (
              <Eye className="size-5" />
            ) : (
              <EyeOff className="size-5" />
            )}
          </button>
        </div>
      </div>
      <FieldError message={field.editedSinceError ? null : error} />
    </div>
  );
}

// ─── Reusable hook for a field ────────────────────────────────────────────────

function useField(initialValue = ""): [
  FieldState,
  {
    onChange: (v: string) => void;
    onBlur: () => void;
    onFocus: () => void;
    reset: () => void;
  },
] {
  const [state, setState] = useState<FieldState>({
    value: initialValue,
    touched: false,
    focused: false,
    editedSinceError: false,
    isDirty: false,
  });

  const onChange = useCallback((v: string) => {
    setState((s) => ({
      ...s,
      value: v,
      editedSinceError: true,
      isDirty: true,
    }));
  }, []);

  const onBlur = useCallback(() => {
    setState((s) => ({
      ...s,
      focused: false,
      touched: true,
      editedSinceError: false,
    }));
  }, []);

  const onFocus = useCallback(() => {
    setState((s) => ({ ...s, focused: true }));
  }, []);

  const reset = useCallback(() => {
    setState({
      value: initialValue,
      touched: false,
      focused: false,
      editedSinceError: false,
      isDirty: false,
    });
  }, [initialValue]);

  return [state, { onChange, onBlur, onFocus, reset }];
}

// ─── RoleCard ─────────────────────────────────────────────────────────────────

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
        "flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-300 gap-1 h-24 backdrop-blur-md active:scale-97",
        active
          ? "bg-primary/10 border-primary ring-1 ring-primary/50"
          : "bg-background/20 border-border/30 hover:bg-background/30 hover:border-border/50",
      )}
    >
      <p
        className={cn(
          "text-sm font-bold",
          active ? "text-primary" : "text-foreground",
        )}
      >
        {label}
      </p>
      <p className="text-[10px] text-muted-foreground leading-tight mt-1">
        {desc}
      </p>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function AuthContent() {
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = (searchParams.get("view") as AuthView) || "login";

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push(`/${user.user_metadata?.role}`);
      }
    };
    init();
  }, [router]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      if (error === "auth-callback-error") {
        toast.error(t("error.genericError"));
      } else {
        toast.error(getTranslatedError(error));
      }
      // Remove error from URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname, t]);

  const [pendingEmail, setPendingEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Fields
  const [loginEmail, loginEmailActions] = useField();
  const [loginPassword, loginPasswordActions] = useField();

  const [regName, regNameActions] = useField();
  const [regEmail, regEmailActions] = useField();
  const [regPassword, regPasswordActions] = useField();

  const [forgotEmail, forgotEmailActions] = useField();

  const [newPasswordField, newPasswordActions] = useField();
  const [confirmPasswordField, confirmPasswordActions] = useField();

  const [role, setRole] = useState<"donor" | "validator" | "partner">("donor");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const setView = (view: AuthView) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const getTranslatedError = (error: string) => {
    const lowerError = error.toLowerCase();
    if (lowerError.includes("invalid login credentials"))
      return t("error.invalidCredentials");
    if (lowerError.includes("user already registered"))
      return t("error.userExists");
    if (lowerError.includes("email not confirmed"))
      return t("error.emailNotConfirmed");
    if (
      lowerError.includes("invalid otp") ||
      lowerError.includes("token is invalid")
    )
      return t("error.invalidOTP");
    if (
      lowerError.includes("otp has expired") ||
      lowerError.includes("token has expired")
    )
      return t("error.otpExpired");
    if (
      lowerError.includes("link-expired") ||
      lowerError.includes("link has expired")
    )
      return t("error.linkExpired");
    return error;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginEmailActions.onBlur();
    loginPasswordActions.onBlur();

    if (validateEmail(loginEmail.value) || !loginPassword.value) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("email", loginEmail.value);
    formData.append("password", loginPassword.value);
    const result = await login(formData);
    if (result?.error) {
      if (result.error.toLowerCase().includes("rate limit")) {
        toast.error(t("error.rateLimit"));
      } else {
        toast.error(getTranslatedError(result.error));
      }
      setLoading(false);
    } else if (result?.success) {
      toast.success(t("success.signedIn"));
      router.push(`/${result.role}`);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    regEmailActions.onBlur();
    regPasswordActions.onBlur();

    if (
      validateEmail(regEmail.value) ||
      validatePassword(regPassword.value) ||
      validateName(regName.value) ||
      !regName.value
    )
      return;

    setLoading(true);
    const formData = new FormData();
    formData.append("email", regEmail.value);
    formData.append("password", regPassword.value);
    formData.append("name", regName.value);
    formData.append("role", role);
    const result = await signup(formData);
    if (result?.error) {
      if (result.error.toLowerCase().includes("rate limit")) {
        toast.error(t("error.signupLimit"));
      } else {
        toast.error(getTranslatedError(result.error));
      }
    } else {
      setPendingEmail(regEmail.value);
      setView("verify-otp");
      toast.success(t("success.otpSent"));
    }
    setLoading(false);
  };

  const handleResetRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgotEmailActions.onBlur();
    if (validateEmail(forgotEmail.value)) return;

    setLoading(true);
    const result = await resetPassword(forgotEmail.value);
    if (result?.error) {
      if (result.error.toLowerCase().includes("rate limit")) {
        toast.error(t("error.emailLimit"));
      } else {
        toast.error(getTranslatedError(result.error));
      }
    } else {
      setPendingEmail(forgotEmail.value);
      setView("verify-recovery");
      toast.success(t("success.recoverySent"));
    }
    setLoading(false);
  };

  const onOTPComplete = async (otp: string, type: "signup" | "recovery") => {
    setLoading(true);
    const result = await verifyOTP(pendingEmail, otp, type);
    if (result?.error) {
      if (result.error.toLowerCase().includes("rate limit")) {
        toast.error(t("error.otpLimit"));
      } else {
        toast.error(getTranslatedError(result.error));
      }
      setLoading(false);
    } else if (result?.type === "recovery") {
      setView("new-password");
      setLoading(false);
    } else if (result?.success) {
      toast.success(t("success.verified"));
      router.push(`/${result.role}`);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    newPasswordActions.onBlur();
    confirmPasswordActions.onBlur();

    if (validatePassword(newPasswordField.value)) return;
    if (newPasswordField.value !== confirmPasswordField.value) {
      toast.error(t("error.mismatch"));
      return;
    }
    setLoading(true);
    const result = await updatePassword(newPasswordField.value);
    if (result?.error) toast.error(getTranslatedError(result.error));
    else toast.success(t("success.passUpdated"));
    setLoading(false);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const isOTPView =
    currentView === "verify-otp" || currentView === "verify-recovery";

  const isLoginValid =
    !validateEmail(loginEmail.value) && loginPassword.value.length > 0;
  const isRegisterValid =
    !validateEmail(regEmail.value) &&
    !validatePassword(regPassword.value) &&
    !validateName(regName.value) &&
    regName.value.length > 0;
  const isForgotValid =
    forgotEmail.value.length > 0 && !validateEmail(forgotEmail.value);
  const isNewPassValid =
    !validatePassword(newPasswordField.value) &&
    newPasswordField.value === confirmPasswordField.value;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-dvh w-full bg-background overflow-hidden relative font-sans">
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

      <div className="flex w-full relative z-10 min-h-dvh">
        {/* Left Side */}
        <div className="flex w-full flex-col md:w-[45%] px-8 sm:px-16 lg:px-24 pt-8 md:pt-[22vh] items-center rtl:items-end text-start rtl:text-right h-dvh md:h-auto overflow-y-auto md:overflow-visible">
          <div className="w-full max-sm:max-w-full max-w-sm">
            {/* Logo + Language Switcher row */}
            <div className="mb-4 md:mb-8 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 overflow-hidden rounded-lg">
                  <img
                    src="/images/logo.jpg"
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-2xl font-bold tracking-tight text-foreground lowercase">
                  ihsan
                </span>
              </div>
              <LanguageSwitcher align="end" />
            </div>

            <AnimatePresence mode="wait">
              {(currentView === "login" || currentView === "register") && (
                <motion.div
                  key="tabs"
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
                    <div className="mb-6 md:mb-10">
                      <AnimatedTabsList className="grid w-full grid-cols-2 bg-muted/40 p-1.5 rounded-xl border border-border/20 h-12">
                        <AnimatedTabsTrigger
                          value="login"
                          className="h-full rounded-lg text-base"
                        >
                          {t("login")}
                        </AnimatedTabsTrigger>
                        <AnimatedTabsTrigger
                          value="register"
                          className="h-full rounded-lg text-base"
                        >
                          {t("register")}
                        </AnimatedTabsTrigger>
                      </AnimatedTabsList>
                    </div>

                    <div className="relative min-h-[400px] md:min-h-[500px]">
                      <AnimatePresence mode="wait">
                        {currentView === "login" && (
                          <motion.form
                            key="login"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onSubmit={handleLogin}
                            className="space-y-5"
                          >
                            <div className="space-y-1.5" dir="auto">
                              <h1 className="text-4xl font-bold rtl:text-right">
                                {t("welcome")}
                              </h1>
                              <p className="text-muted-foreground text-sm rtl:text-right">
                                {t("loginSubtitle")}
                              </p>
                            </div>
                            <div className="space-y-4 pt-2">
                              <div className="space-y-1.5">
                                <Label
                                  htmlFor="login-email"
                                  className="rtl:justify-end"
                                >
                                  {t("email")}
                                </Label>
                                <EmailField
                                  id="login-email"
                                  name="email"
                                  field={loginEmail}
                                  onChange={loginEmailActions.onChange}
                                  onBlur={loginEmailActions.onBlur}
                                  onFocus={loginEmailActions.onFocus}
                                  placeholder={t("email")}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label
                                  htmlFor="login-password"
                                  className="rtl:justify-end"
                                >
                                  {t("password")}
                                </Label>
                                <PasswordField
                                  id="login-password"
                                  name="password"
                                  field={loginPassword}
                                  onChange={loginPasswordActions.onChange}
                                  onBlur={loginPasswordActions.onBlur}
                                  onFocus={loginPasswordActions.onFocus}
                                  showPassword={showLoginPassword}
                                  onToggleShow={() =>
                                    setShowLoginPassword(!showLoginPassword)
                                  }
                                  validate={false}
                                  placeholder={t("password")}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => setView("forgot-password")}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                              >
                                {t("forgotPassword")}
                              </button>
                            </div>
                            <Button
                              className="h-12 w-full rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                              type="submit"
                              disabled={loading || !isLoginValid}
                            >
                              {loading ? (
                                <div className="flex items-center gap-2">
                                  <Spinner className="size-4" />
                                  <span>{t("signingIn")}</span>
                                </div>
                              ) : (
                                t("signIn")
                              )}
                            </Button>
                          </motion.form>
                        )}

                        {currentView === "register" && (
                          <motion.form
                            key="register"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onSubmit={handleRegister}
                            className="space-y-5"
                          >
                            <div className="space-y-1.5" dir="auto">
                              <h1 className="text-4xl font-bold rtl:text-right">
                                {t("getStarted")}
                              </h1>
                              <p className="text-muted-foreground text-sm rtl:text-right">
                                {t("joinToday")}
                              </p>
                            </div>
                            <div className="space-y-3 pt-2">
                              <div className="space-y-1">
                                <Label
                                  htmlFor="register-name"
                                  className="rtl:justify-end"
                                >
                                  {t("fullName")}
                                </Label>
                                <Input
                                  id="register-name"
                                  name="name"
                                  placeholder={t("fullName")}
                                  value={regName.value}
                                  onChange={(e) =>
                                    regNameActions.onChange(e.target.value)
                                  }
                                  onBlur={regNameActions.onBlur}
                                  onFocus={regNameActions.onFocus}
                                  aria-invalid={
                                    !!(
                                      regName.touched &&
                                      regName.isDirty &&
                                      !regName.editedSinceError &&
                                      validateName(regName.value)
                                    )
                                  }
                                  className={cn(
                                    "h-12 rounded-xl border-border bg-background/30 backdrop-blur-md px-4 text-sm transition-all duration-300",
                                    regName.touched &&
                                      regName.isDirty &&
                                      !regName.editedSinceError &&
                                      validateName(regName.value) &&
                                      "border-destructive! ring-destructive!",
                                  )}
                                  required
                                />
                                <FieldError
                                  message={
                                    regName.touched &&
                                    regName.isDirty &&
                                    !regName.editedSinceError
                                      ? (() => {
                                          const err = validateName(
                                            regName.value,
                                          );
                                          if (err === "required")
                                            return t("error.nameRequired");
                                          if (err === "short")
                                            return t("error.nameShort");
                                          return null;
                                        })()
                                      : null
                                  }
                                />
                              </div>
                              <div className="space-y-1">
                                <Label
                                  htmlFor="register-email"
                                  className="rtl:justify-end"
                                >
                                  {t("email")}
                                </Label>
                                <EmailField
                                  id="register-email"
                                  name="email"
                                  field={regEmail}
                                  onChange={regEmailActions.onChange}
                                  onBlur={regEmailActions.onBlur}
                                  onFocus={regEmailActions.onFocus}
                                  placeholder={t("email")}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label
                                  htmlFor="register-password"
                                  className="rtl:justify-end"
                                >
                                  {t("password")}
                                </Label>
                                <PasswordField
                                  id="register-password"
                                  name="password"
                                  field={regPassword}
                                  onChange={regPasswordActions.onChange}
                                  onBlur={regPasswordActions.onBlur}
                                  onFocus={regPasswordActions.onFocus}
                                  showPassword={showRegisterPassword}
                                  onToggleShow={() =>
                                    setShowRegisterPassword(
                                      !showRegisterPassword,
                                    )
                                  }
                                  validate={true}
                                  placeholder={t("password")}
                                />
                              </div>
                              <div className="space-y-2 pt-2">
                                <Label className="rtl:justify-end">
                                  {t("role")}
                                </Label>
                                <div className="grid grid-cols-3 gap-2">
                                  <RoleCard
                                    active={role === "donor"}
                                    onClick={() => setRole("donor")}
                                    label={t("donor")}
                                    desc={t("donorDesc")}
                                  />
                                  <RoleCard
                                    active={role === "validator"}
                                    onClick={() => setRole("validator")}
                                    label={t("validator")}
                                    desc={t("validatorDesc")}
                                  />
                                  <RoleCard
                                    active={role === "partner"}
                                    onClick={() => setRole("partner")}
                                    label={t("partner")}
                                    desc={t("partnerDesc")}
                                  />
                                </div>
                              </div>
                            </div>
                            <Button
                              className="h-12 w-full rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                              type="submit"
                              disabled={loading || !isRegisterValid}
                            >
                              {loading ? (
                                <div className="flex items-center gap-2">
                                  <Spinner className="size-4" />
                                  <span>{t("creatingAccount")}</span>
                                </div>
                              ) : (
                                t("createAccount")
                              )}
                            </Button>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    </div>
                  </AnimatedTabs>
                </motion.div>
              )}

              {currentView === "forgot-password" && (
                <motion.div
                  key="forgot"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full"
                >
                  <button
                    onClick={() => setView("login")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-4"
                  >
                    <ArrowLeft className="size-4 rtl:rotate-180" />
                    {t("backToLogin")}
                  </button>
                  <form
                    onSubmit={handleResetRequest}
                    className="space-y-6 pt-12"
                  >
                    <div className="space-y-1.5">
                      <h1 className="text-4xl font-bold">
                        {t("forgotPasswordTitle")}
                      </h1>
                      <p className="text-muted-foreground text-sm">
                        {t("forgotPasswordSubtitle")}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="forgot-email" className="rtl:justify-end">
                        {t("email")}
                      </Label>
                      <EmailField
                        id="forgot-email"
                        name="email"
                        field={forgotEmail}
                        onChange={forgotEmailActions.onChange}
                        onBlur={forgotEmailActions.onBlur}
                        onFocus={forgotEmailActions.onFocus}
                        placeholder={t("email")}
                      />
                    </div>
                    <Button
                      className="h-12 w-full rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={loading || !isForgotValid}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Spinner className="size-4" />
                          <span>{t("sendingCode")}</span>
                        </div>
                      ) : (
                        t("sendResetCode")
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}

              {isOTPView && (
                <motion.div
                  key="otp"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full flex flex-col items-center"
                >
                  <button
                    onClick={() =>
                      setView(
                        currentView === "verify-otp"
                          ? "register"
                          : "forgot-password",
                      )
                    }
                    className="flex self-start items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-4"
                  >
                    <ArrowLeft className="size-4" /> {t("backToLogin")}
                  </button>
                  <div className="pt-12 space-y-8 text-center">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold">{t("verifyEmail")}</h1>
                      <p className="text-muted-foreground text-sm max-w-[280px]">
                        {t("verifySubtitle")}{" "}
                        <span className="text-foreground font-medium">
                          {pendingEmail}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-6">
                      <InputOTP
                        maxLength={6}
                        onComplete={(otp) =>
                          onOTPComplete(
                            otp,
                            currentView === "verify-otp"
                              ? "signup"
                              : "recovery",
                          )
                        }
                        disabled={loading}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <button
                        type="button"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        {t("resendCode")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentView === "new-password" && (
                <motion.div
                  key="new-pass"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full"
                >
                  <div className="pt-12 space-y-6">
                    <div className="space-y-1.5">
                      <h1 className="text-4xl font-bold">
                        {t("newPasswordTitle")}
                      </h1>
                      <p className="text-muted-foreground text-sm">
                        {t("newPasswordSubtitle")}
                      </p>
                    </div>
                    <form
                      onSubmit={handleUpdatePassword}
                      className="space-y-4 pt-4"
                    >
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="new-password"
                          className="rtl:justify-end"
                        >
                          {t("newPassword")}
                        </Label>
                        <PasswordField
                          id="new-password"
                          name="newPassword"
                          field={newPasswordField}
                          onChange={newPasswordActions.onChange}
                          onBlur={newPasswordActions.onBlur}
                          onFocus={newPasswordActions.onFocus}
                          showPassword={showNewPassword}
                          onToggleShow={() =>
                            setShowNewPassword(!showNewPassword)
                          }
                          validate={true}
                          placeholder={t("newPassword")}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="confirm-password"
                          title={t("confirmPassword")}
                        >
                          {t("confirmPassword")}
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder={t("password")}
                          value={confirmPasswordField.value}
                          onChange={(e) =>
                            confirmPasswordActions.onChange(e.target.value)
                          }
                          onBlur={confirmPasswordActions.onBlur}
                          onFocus={confirmPasswordActions.onFocus}
                          aria-invalid={
                            confirmPasswordField.touched &&
                            confirmPasswordField.isDirty &&
                            !confirmPasswordField.editedSinceError &&
                            confirmPasswordField.value !==
                              newPasswordField.value
                          }
                          className={cn(
                            "h-12 rounded-xl border-border bg-background/30 backdrop-blur-md px-4 text-base transition-all duration-300",
                            confirmPasswordField.touched &&
                              confirmPasswordField.isDirty &&
                              !confirmPasswordField.editedSinceError &&
                              confirmPasswordField.value !==
                                newPasswordField.value &&
                              "border-destructive! ring-destructive!",
                          )}
                          required
                        />
                        <FieldError
                          message={
                            confirmPasswordField.touched &&
                            confirmPasswordField.isDirty &&
                            !confirmPasswordField.editedSinceError &&
                            confirmPasswordField.value !==
                              newPasswordField.value
                              ? t("error.mismatch")
                              : null
                          }
                        />
                      </div>
                      <Button
                        className="h-12 w-full rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading || !isNewPassValid}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <Spinner className="size-4" />
                            <span>{t("updatingPassword")}</span>
                          </div>
                        ) : (
                          t("updatePassword")
                        )}
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex md:w-[55%] p-4 h-full relative z-10">
          <div className="w-full h-full bg-zinc-950/80 backdrop-blur-sm rounded-tr-lg rounded-tl-lg rounded-br-lg rtl:rounded-br-[6rem] rounded-bl-[6rem] rtl:rounded-bl-lg relative overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center">
            <img
              src="/images/right-side-picture.png"
              alt="Community"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.35_0.06_152/0.2),transparent)]" />
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
