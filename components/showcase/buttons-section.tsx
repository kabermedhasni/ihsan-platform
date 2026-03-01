import { Button } from "@/components/ui/button"
import { Loader2, Mail, Plus, Trash2, Download, ArrowRight } from "lucide-react"

export function ButtonsSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Buttons</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Button variants for every context: primary actions, secondary, outlines, ghost, destructive, and links.
      </p>
      <div className="flex flex-col gap-6">
        {/* Variants */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Variants</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Plus /></Button>
            <Button size="icon-sm"><Plus /></Button>
            <Button size="icon-lg"><Plus /></Button>
          </div>
        </div>

        {/* With Icons */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">With Icons</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button><Mail /> Send Email</Button>
            <Button variant="destructive"><Trash2 /> Delete</Button>
            <Button variant="outline"><Download /> Download</Button>
            <Button variant="secondary">
              Continue <ArrowRight />
            </Button>
          </div>
        </div>

        {/* States */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">States</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Disabled</Button>
            <Button disabled>
              <Loader2 className="animate-spin" />
              Loading...
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
