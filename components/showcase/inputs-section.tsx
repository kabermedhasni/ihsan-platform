"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"

const tagOptions = [
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "environment", label: "Environment" },
  { value: "community", label: "Community" },
  { value: "technology", label: "Technology" },
  { value: "arts", label: "Arts & Culture" },
]

export function InputsSection() {
  const [selectedTags, setSelectedTags] = useState<string[]>(["education"])

  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Inputs & Forms</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Text inputs, textareas, selects, multi-select, and labeled form fields for building any form.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Text Inputs */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Text Inputs</h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="disabled-input">Disabled Input</Label>
            <Input id="disabled-input" placeholder="Cannot type here" disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="search">Search</Label>
            <Input id="search" type="search" placeholder="Search campaigns..." />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="number-input">Number (no spinner)</Label>
            <Input id="number-input" type="number" placeholder="0" />
          </div>
        </div>

        {/* Textarea, Select & MultiSelect */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Textarea & Select</h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Type your message here..." rows={3} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category (Single Select)</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
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
  )
}
