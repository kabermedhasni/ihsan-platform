"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastTimer,
} from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      <AnimatePresence mode="popLayout">
        {toasts.map(function ({
          id,
          title,
          description,
          action,
          count,
          variant,
          ...props
        }) {
          return (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Toast variant={variant} {...props}>
                <div className="grid gap-1">
                  {title && (
                    <div className="flex items-center gap-2">
                      <ToastTitle>{title}</ToastTitle>
                      {count && count > 1 && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/15 px-1.5 text-xs font-bold tabular-nums">
                          {count}
                        </span>
                      )}
                    </div>
                  )}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
                {action}
                <ToastClose />
                <ToastTimer
                  duration={props.duration || 5000}
                  variant={variant}
                />
              </Toast>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <ToastViewport />
    </ToastProvider>
  );
}
