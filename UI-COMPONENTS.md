# Ihsan UI — Component Library

A premium, dark-green themed component library built with **Next.js 15**, **Tailwind CSS v4**, and **Radix UI** primitives. All components are ready-to-use and located in `components/ui/`.

---

## 📦 Project Structure

```
components/
├── ui/                    # Base UI components (import these in your pages)
│   ├── accordion.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── multi-select.tsx
│   ├── progress.tsx
│   ├── radio-group.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── skeleton.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   ├── toaster.tsx        ← Mount once in your layout/page
│   ├── tooltip.tsx
│   └── ...
└── showcase/              # Demo sections (for reference only, not for production use)
```

---

## ⚠️ What Are Those Warnings?

You may see editor warnings like:

```
The class `data-[state=open]:animate-in` can be written as `data-state-open:animate-in`
The class `min-w-[8rem]` can be written as `min-w-32`
```

**These are NOT errors.** They are **Tailwind CSS v4 style suggestions** — the linter is recommending the newer shorthand syntax introduced in Tailwind v4. The code compiles and runs perfectly without changes. You can safely ignore them, or update the classes to use the new syntax if you prefer cleaner code.

---

## 🚀 Quick Start

### 1. Mount the Toaster (once, globally)

Add `<Toaster />` to your root `layout.tsx` or main page. It renders all toast notifications.

```tsx
// app/layout.tsx
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster /> {/* ← Add this once */}
      </body>
    </html>
  );
}
```

---

## 🧩 Component Reference

### Button

```tsx
import { Button } from "@/components/ui/button"

// Variants: default | outline | ghost | secondary | destructive | link
<Button>Click Me</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

---

### Input

```tsx
import { Input } from "@/components/ui/input"

<Input placeholder="Enter text..." />
<Input type="email" placeholder="you@example.com" />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled" />
```

---

### Label

```tsx
import { Label } from "@/components/ui/label"

<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

---

### Textarea

```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Type your message..." rows={4} />;
```

---

### Dropdown Menu (animated, all dropdowns use this)

> **Note:** All selectable dropdowns in this project use `DropdownMenu` for consistent open/close animations.

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

---

### Multi-Select

```tsx
import { MultiSelect } from "@/components/ui/multi-select"

const options = [
  { value: "education", label: "Education" },
  { value: "health",    label: "Health" },
  { value: "tech",      label: "Technology" },
]

const [selected, setSelected] = useState<string[]>([])

<MultiSelect
  options={options}
  selected={selected}
  onChange={setSelected}
  placeholder="Select options..."
/>
```

---

### Checkbox

```tsx
import { Checkbox } from "@/components/ui/checkbox"

<Checkbox id="terms" />
<Label htmlFor="terms">Accept terms and conditions</Label>

// Pre-checked
<Checkbox id="newsletter" defaultChecked />

// Disabled
<Checkbox disabled />
```

---

### Switch

```tsx
import { Switch } from "@/components/ui/switch"

<Switch id="notifications" />
<Label htmlFor="notifications">Enable notifications</Label>

// Pre-toggled
<Switch defaultChecked />
```

---

### Radio Group

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

<RadioGroup defaultValue="monthly">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="monthly" id="monthly" />
    <Label htmlFor="monthly">Monthly</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="yearly" id="yearly" />
    <Label htmlFor="yearly">Yearly</Label>
  </div>
</RadioGroup>;
```

---

### Dialog (Modal)

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>Are you sure you want to do this?</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

---

### Toast Notifications

> Requires `<Toaster />` mounted in your layout.

```tsx
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

// Default
toast({ title: "Saved!", description: "Your changes were saved." });

// Success
toast({
  title: "Success",
  description: "Operation completed.",
  variant: "success",
});

// Warning
toast({
  title: "Warning",
  description: "Check your input.",
  variant: "warning",
});

// Error
toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
});

// Info
toast({ title: "Info", description: "New update available.", variant: "info" });

// With action button
import { ToastAction } from "@/components/ui/toast";

toast({
  title: "Undo?",
  description: "Item was deleted.",
  variant: "warning",
  action: (
    <ToastAction altText="Undo" onClick={() => restoreItem()}>
      Undo
    </ToastAction>
  ),
});
```

---

### Tooltip

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>This is a helpful tooltip</p>
  </TooltipContent>
</Tooltip>;
```

---

### Badge

```tsx
import { Badge } from "@/components/ui/badge"

// Variants: default | secondary | destructive | outline
<Badge>Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Rejected</Badge>
<Badge variant="outline">Draft</Badge>
```

---

### Card

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Campaign Name</CardTitle>
    <CardDescription>A short description of the campaign.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>View Campaign</Button>
  </CardFooter>
</Card>;
```

---

### Progress

```tsx
import { Progress } from "@/components/ui/progress"

<Progress value={72} />       // 72% filled
<Progress value={100} />      // Complete
```

---

### Skeleton (Loading Placeholder)

```tsx
import { Skeleton } from "@/components/ui/skeleton"

<Skeleton className="h-4 w-48" />         // Single line
<Skeleton className="h-32 w-full" />      // Image/card placeholder
<Skeleton className="h-9 w-24 rounded-lg" />  // Button placeholder
```

---

### Separator

```tsx
import { Separator } from "@/components/ui/separator"

<Separator />                         // Horizontal
<Separator orientation="vertical" />  // Vertical
```

---

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content here.</TabsContent>
  <TabsContent value="analytics">Analytics content here.</TabsContent>
  <TabsContent value="settings">Settings content here.</TabsContent>
</Tabs>;
```

---

### Accordion

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is Ihsan?</AccordionTrigger>
    <AccordionContent>Ihsan is a charitable giving platform.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>How do I donate?</AccordionTrigger>
    <AccordionContent>
      Click on any campaign and follow the steps.
    </AccordionContent>
  </AccordionItem>
</Accordion>;
```

---

### Table

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableCaption>Monthly donations</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Donor</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Date</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ahmed Ali</TableCell>
      <TableCell>$100</TableCell>
      <TableCell>Mar 1, 2026</TableCell>
    </TableRow>
  </TableBody>
</Table>;
```

---

## 🎨 Theme Colors

All colors are defined as CSS variables in `app/globals.css`. Use them via Tailwind utility classes:

| Token       | Class                                 | Description                |
| ----------- | ------------------------------------- | -------------------------- |
| Background  | `bg-background`                       | Dark green page background |
| Foreground  | `text-foreground`                     | Off-white text             |
| Primary     | `bg-primary` / `text-primary`         | Golden yellow accent       |
| Secondary   | `bg-secondary`                        | Lighter green surface      |
| Card        | `bg-card`                             | Elevated card surface      |
| Muted       | `bg-muted` / `text-muted-foreground`  | Subtle backgrounds & hints |
| Destructive | `bg-destructive` / `text-destructive` | Error/danger red           |
| Border      | `border-border`                       | Subtle border color        |

---

## 📚 Dependencies

| Package                    | Purpose                                            |
| -------------------------- | -------------------------------------------------- |
| `@radix-ui/*`              | Accessible headless UI primitives                  |
| `framer-motion`            | Animation for MultiSelect and Toast stacking       |
| `lucide-react`             | Icon library                                       |
| `class-variance-authority` | Variant-based styling                              |
| `clsx` + `tailwind-merge`  | Dynamic class composition via `cn()`               |
| `tailwindcss-animate`      | Tailwind animation plugin (open/close transitions) |
