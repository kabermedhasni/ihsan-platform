"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const tagOptions = [
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "environment", label: "Environment" },
  { value: "community", label: "Community" },
  { value: "technology", label: "Technology" },
  { value: "arts", label: "Arts & Culture" },
];

function SelectDropdown({
  label,
  options,
  placeholder,
}: {
  label: string;
  options: string[];
  placeholder: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "border-input flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm transition-colors duration-200 outline-none focus-visible:border-ring",
            !selected && "text-muted-foreground",
          )}
        >
          <span>{selected ?? placeholder}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 opacity-50 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]"
        align="start"
        sideOffset={4}
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => setSelected(opt)}
            className={cn(selected === opt && "bg-primary/15 text-primary")}
          >
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function InputsSection() {
  const [selectedTags, setSelectedTags] = useState<string[]>(["education"]);

  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Inputs &amp; Forms
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Text inputs, textareas, selects, multi-select, and labeled form fields
        for building any form.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Text Inputs */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Text Inputs
          </h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="disabled-input">Disabled Input</Label>
            <Input
              id="disabled-input"
              placeholder="Cannot type here"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="search"
              placeholder="Search campaigns..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="number-input">Number (no spinner)</Label>
            <Input id="number-input" type="number" placeholder="0" />
          </div>
        </div>

        {/* Textarea, Select & MultiSelect */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Textarea &amp; Select
          </h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Category (Single Select)</Label>
            <SelectDropdown
              label="Category"
              placeholder="Select a category"
              options={["Education", "Health", "Environment", "Community"]}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Priority</Label>
            <SelectDropdown
              label="Priority"
              placeholder="Select priority"
              options={["Low", "Medium", "High", "Urgent"]}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Tags (Multi Select)</Label>
            <MultiSelect
              options={tagOptions}
              selected={selectedTags}
              onChange={setSelectedTags}
              placeholder="Select tags..."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
