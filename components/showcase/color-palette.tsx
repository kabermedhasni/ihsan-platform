export function ColorPalette() {
  const colors = [
    { name: "Background", var: "bg-background", hex: "#0f2419", textClass: "text-foreground" },
    { name: "Foreground", var: "bg-foreground", hex: "#f0ebe3", textClass: "text-background" },
    { name: "Card", var: "bg-card", hex: "#1a3a2a", textClass: "text-card-foreground" },
    { name: "Primary", var: "bg-primary", hex: "#f0b429", textClass: "text-primary-foreground" },
    { name: "Secondary", var: "bg-secondary", hex: "#1e4d3a", textClass: "text-secondary-foreground" },
    { name: "Accent", var: "bg-accent", hex: "#2a6b4f", textClass: "text-accent-foreground" },
    { name: "Muted", var: "bg-muted", hex: "#163328", textClass: "text-muted-foreground" },
    { name: "Destructive", var: "bg-destructive", hex: "#e04040", textClass: "text-destructive-foreground" },
    { name: "Border", var: "bg-border", hex: "#2a5a42", textClass: "text-foreground" },
    { name: "Ring", var: "bg-ring", hex: "#f0b429", textClass: "text-primary-foreground" },
  ]

  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Color Palette</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Design tokens extracted from the Ihsan brand identity. All components use these tokens.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {colors.map((color) => (
          <div key={color.name} className="flex flex-col overflow-hidden rounded-lg border border-border">
            <div className={`${color.var} ${color.textClass} flex h-20 items-center justify-center text-xs font-medium`}>
              {color.hex}
            </div>
            <div className="bg-card px-3 py-2">
              <p className="text-sm font-medium text-card-foreground">{color.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{color.var.replace("bg-", "--")}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
