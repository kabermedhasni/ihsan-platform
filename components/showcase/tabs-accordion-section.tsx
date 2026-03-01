"use client"

import { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger, AnimatedTabsContent } from "@/components/ui/animated-tabs"

export function TabsAccordionSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Tabs</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Organize content into tab panels with a smooth sliding active indicator.
      </p>
      <div className="max-w-xl">
        <AnimatedTabs defaultValue="overview">
          <AnimatedTabsList className="w-full">
            <AnimatedTabsTrigger value="overview">Overview</AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="analytics">Analytics</AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="settings">Settings</AnimatedTabsTrigger>
          </AnimatedTabsList>
          <AnimatedTabsContent value="overview" className="mt-4">
            <div className="rounded-lg border border-border p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Overview Panel</h4>
              <p className="text-sm text-muted-foreground">
                This is the overview content. Here you can view a summary of all campaigns, donations, and recent activities on the platform.
              </p>
            </div>
          </AnimatedTabsContent>
          <AnimatedTabsContent value="analytics" className="mt-4">
            <div className="rounded-lg border border-border p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Analytics Panel</h4>
              <p className="text-sm text-muted-foreground">
                Detailed analytics and reports about your fundraising performance, donor engagement, and growth trends.
              </p>
            </div>
          </AnimatedTabsContent>
          <AnimatedTabsContent value="settings" className="mt-4">
            <div className="rounded-lg border border-border p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Settings Panel</h4>
              <p className="text-sm text-muted-foreground">
                Configure your profile, notifications, payment methods, and platform preferences.
              </p>
            </div>
          </AnimatedTabsContent>
        </AnimatedTabs>
      </div>
    </section>
  )
}
