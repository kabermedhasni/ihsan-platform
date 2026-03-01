"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const AnimatedTabs = TabsPrimitive.Root

function AnimatedTabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({
    left: 0,
    width: 0,
    opacity: 0,
  })

  const updateIndicator = React.useCallback(() => {
    const list = listRef.current
    if (!list) return
    const activeTab = list.querySelector<HTMLElement>('[data-state="active"]')
    if (!activeTab) return
    setIndicatorStyle({
      left: activeTab.offsetLeft,
      width: activeTab.offsetWidth,
      opacity: 1,
    })
  }, [])

  React.useEffect(() => {
    updateIndicator()
    const list = listRef.current
    if (!list) return
    const observer = new MutationObserver(updateIndicator)
    observer.observe(list, { attributes: true, subtree: true, attributeFilter: ["data-state"] })
    return () => observer.disconnect()
  }, [updateIndicator])

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="animated-tabs-list"
      className={cn(
        "bg-muted text-muted-foreground relative inline-flex h-10 w-fit items-center justify-center rounded-lg p-1",
        className,
      )}
      {...props}
    >
      <span
        className="absolute top-1 bottom-1 rounded-md bg-background shadow-sm transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      />
      {children}
    </TabsPrimitive.List>
  )
}

function AnimatedTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="animated-tabs-trigger"
      className={cn(
        "relative z-10 inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground/80 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function AnimatedTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="animated-tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger, AnimatedTabsContent }
