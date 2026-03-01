"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertTriangle, Info, XCircle, Copy } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";

export function ToastSection() {
  const { toast } = useToast();

  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Notification Toasts
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Colored toast notifications that stack, deduplicate with a counter, and
        support actions. Click the same button multiple times to see the
        counter.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          className="bg-emerald-700 text-emerald-50 hover:bg-emerald-800"
          onClick={() => {
            toast({
              variant: "success",
              title: "Success",
              description: "Your campaign has been created successfully.",
            });
          }}
        >
          <CheckCircle className="size-4" />
          Success Toast
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Something went wrong. Please try again.",
            });
          }}
        >
          <XCircle className="size-4" />
          Error Toast
        </Button>

        <Button
          className="bg-amber-700 text-amber-50 hover:bg-amber-800"
          onClick={() => {
            toast({
              variant: "warning",
              title: "Warning",
              description: "Your session will expire in 5 minutes.",
            });
          }}
        >
          <AlertTriangle className="size-4" />
          Warning Toast
        </Button>

        <Button
          className="bg-sky-700 text-sky-50 hover:bg-sky-800"
          onClick={() => {
            toast({
              variant: "info",
              title: "Info",
              description:
                "Version 2.0 includes new donation tracking features.",
            });
          }}
        >
          <Info className="size-4" />
          Info Toast
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            toast({
              variant: "success",
              title: "Duplicate test",
              description: "Click me again to see the counter increase!",
            });
          }}
        >
          <Copy className="size-4" />
          Test Deduplication
        </Button>
      </div>
    </section>
  );
}
