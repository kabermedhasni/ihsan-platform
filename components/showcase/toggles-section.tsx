"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function TogglesSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Checkboxes, Switches & Radios</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Selection controls for toggling options and choosing between values.
      </p>
      <div className="grid gap-8 md:grid-cols-3">
        {/* Checkboxes */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Checkboxes</h3>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" defaultChecked />
            <Label htmlFor="terms">Accept terms</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="newsletter" />
            <Label htmlFor="newsletter">Subscribe to newsletter</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="disabled-cb" disabled />
            <Label htmlFor="disabled-cb">Disabled option</Label>
          </div>
        </div>

        {/* Switches */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Switches</h3>
          <div className="flex items-center gap-3">
            <Switch id="notifications" defaultChecked />
            <Label htmlFor="notifications">Notifications</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="dark-mode" />
            <Label htmlFor="dark-mode">Dark mode</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="disabled-switch" disabled />
            <Label htmlFor="disabled-switch">Disabled</Label>
          </div>
        </div>

        {/* Radio Group */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Radio Group</h3>
          <RadioGroup defaultValue="monthly">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="quarterly" id="quarterly" />
              <Label htmlFor="quarterly">Quarterly</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yearly" id="yearly" />
              <Label htmlFor="yearly">Yearly</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </section>
  )
}
