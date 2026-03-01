import { ColorPalette } from "@/components/showcase/color-palette";
import { TypographySection } from "@/components/showcase/typography-section";
import { ButtonsSection } from "@/components/showcase/buttons-section";
import { InputsSection } from "@/components/showcase/inputs-section";
import { TogglesSection } from "@/components/showcase/toggles-section";
import { CardsSection } from "@/components/showcase/cards-section";
import { BadgesAndMiscSection } from "@/components/showcase/badges-section";
// import { AlertsSection } from "@/components/showcase/alerts-section";
import { OverlaysSection } from "@/components/showcase/overlays-section";
import { TabsAccordionSection } from "@/components/showcase/tabs-accordion-section";
import { TableSection } from "@/components/showcase/table-section";
import { ToastSection } from "@/components/showcase/toast-section";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";

export default function Page() {
  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Ihsan UI Showcase
            </h1>
            <p className="text-sm text-muted-foreground">
              All components imported and ready to use
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
              v1.0
            </span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl overflow-x-auto px-6 py-3">
          <div className="flex items-center gap-4 text-sm">
            {[
              "Colors",
              "Typography",
              "Buttons",
              "Inputs",
              "Toggles",
              "Cards",
              "Badges",
              "Toasts",
              "Overlays",
              "Tabs",
              "Table",
            ].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="whitespace-nowrap text-muted-foreground transition-colors hover:text-primary"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-12">
          <div id="colors">
            <ColorPalette />
          </div>
          <Separator />

          <div id="typography">
            <TypographySection />
          </div>
          <Separator />

          <div id="buttons">
            <ButtonsSection />
          </div>
          <Separator />

          <div id="inputs">
            <InputsSection />
          </div>
          <Separator />

          <div id="toggles">
            <TogglesSection />
          </div>
          <Separator />

          <div id="cards">
            <CardsSection />
          </div>
          <Separator />

          <div id="badges">
            <BadgesAndMiscSection />
          </div>
          <Separator />

          <div id="toasts">
            <ToastSection />
          </div>
          <Separator />

          <div id="overlays">
            <OverlaysSection />
          </div>
          <Separator />

          <div id="tabs">
            <TabsAccordionSection />
          </div>
          <Separator />

          <div id="table">
            <TableSection />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <p className="text-sm text-muted-foreground">
            Ihsan UI Component Library
          </p>
          <p className="text-xs text-muted-foreground">
            All components use semantic design tokens for consistent theming.
          </p>
        </div>
      </footer>
      <Toaster />
    </main>
  );
}
