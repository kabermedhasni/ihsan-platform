"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleGlobalToggle(event: any) {
      if (event.detail.ref !== containerRef) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("toggle-dropdown", handleGlobalToggle);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("toggle-dropdown", handleGlobalToggle);
    };
  }, []);

  const handleToggle = () => {
    const nextState = !open;
    setOpen(nextState);
    if (nextState) {
      window.dispatchEvent(
        new CustomEvent("toggle-dropdown", { detail: { ref: containerRef } }),
      );
    }
  };

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "border-input dark:bg-input/30 flex min-h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-1.5 text-sm transition-colors duration-200 outline-none focus-visible:border-ring",
          selected.length === 0 && "text-muted-foreground",
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {selected.length === 0 ? (
            <span>{placeholder}</span>
          ) : (
            selected.map((value) => {
              const option = options.find((o) => o.value === value);
              return (
                <Badge
                  key={value}
                  variant="secondary"
                  className="gap-1 px-2 py-0.5 text-xs"
                >
                  {option?.label}
                  <span
                    role="button"
                    tabIndex={0}
                    className="hover:text-foreground cursor-pointer rounded-full"
                    onClick={(e) => removeOption(value, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        removeOption(value, e as unknown as React.MouseEvent);
                      }
                    }}
                  >
                    <X className="size-3" />
                  </span>
                </Badge>
              );
            })
          )}
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 opacity-50 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-popover text-popover-foreground absolute top-full left-0 z-50 mt-1 w-full rounded-md border p-1 shadow-md backdrop-blur-md flex flex-col gap-0.5 origin-top"
          >
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2.5 py-2 text-sm outline-none transition-all duration-200 ease-out hover:bg-primary/10 hover:text-primary",
                    isSelected && "bg-primary/15 text-primary",
                  )}
                >
                  {option.label}
                  {isSelected && <Check className="absolute right-2 size-4" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
