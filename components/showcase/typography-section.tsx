import { Separator } from "@/components/ui/separator"

export function TypographySection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Typography</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Heading hierarchy, body text, and monospace code using Inter and JetBrains Mono.
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Headings */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Headings</h3>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Heading 1</h1>
            <h2 className="text-3xl font-semibold text-foreground tracking-tight">Heading 2</h2>
            <h3 className="text-2xl font-semibold text-foreground">Heading 3</h3>
            <h4 className="text-xl font-medium text-foreground">Heading 4</h4>
            <h5 className="text-lg font-medium text-foreground">Heading 5</h5>
            <h6 className="text-base font-medium text-muted-foreground">Heading 6</h6>
          </div>
        </div>

        {/* Body & Code */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Body Text & Code</h3>
          <p className="text-base text-foreground leading-relaxed">
            This is regular body text using the Inter font family. It provides excellent readability at all sizes with clean, modern letterforms.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is smaller muted text used for descriptions, captions, and secondary information throughout the interface.
          </p>
          <Separator />
          <div className="rounded-lg bg-muted p-4">
            <code className="font-mono text-sm text-primary">
              {'const campaign = await createCampaign({'}
              <br />
              {'  name: "Education Fund",'}
              <br />
              {'  goal: 100000,'}
              <br />
              {'  currency: "MRU"'}
              <br />
              {'});'}
            </code>
          </div>
          <p className="text-xs text-muted-foreground">
            Inline code example: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary">npm install</code>
          </p>
        </div>
      </div>
    </section>
  )
}
