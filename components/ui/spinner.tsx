import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
  xl: "h-16 w-16",
};

export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
}
