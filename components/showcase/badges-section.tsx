import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export function BadgesAndMiscSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Badges & Avatars</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Small visual indicators and identity components.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Badges */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          <Separator />
          <h3 className="text-sm font-medium text-muted-foreground">Use Cases</h3>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-600/30">Active</Badge>
            <Badge className="bg-amber-900/40 text-amber-300 border-amber-500/30">Pending</Badge>
            <Badge className="bg-sky-900/40 text-sky-300 border-sky-500/30">New</Badge>
            <Badge className="bg-destructive/15 text-destructive border-destructive/30">Overdue</Badge>
          </div>
        </div>

        {/* Avatars */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Avatars</h3>
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">AM</AvatarFallback>
            </Avatar>
            <Avatar className="size-10">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-bold">MO</AvatarFallback>
            </Avatar>
            <Avatar className="size-12">
              <AvatarFallback className="bg-accent text-accent-foreground text-base font-bold">KD</AvatarFallback>
            </Avatar>
            <Avatar className="size-14">
              <AvatarFallback className="bg-muted text-muted-foreground text-lg font-bold">FS</AvatarFallback>
            </Avatar>
          </div>
          <Separator />
          <h3 className="text-sm font-medium text-muted-foreground">Avatar Group</h3>
          <div className="flex -space-x-2">
            {["AM", "MO", "KD", "FS", "+3"].map((initials) => (
              <Avatar key={initials} className="size-9 border-2 border-background">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
