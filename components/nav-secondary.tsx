"use client"

import Link from "next/link"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function NavSecondary({
  className,
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
} & React.ComponentProps<"ul">) {
  if (!items?.length) {
    return null
  }

  return (
    <ul className={cn("grid gap-0.5", className)}>
      {items.map((item) => (
        <li key={item.title}>
          <Link
            href={item.url}
            className="flex h-7 items-center gap-2.5 overflow-hidden rounded-md px-1.5 text-xs ring-neutral-950 transition-all hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 dark:ring-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
          >
            <item.icon className="h-4 w-4 shrink-0 translate-x-0.5 text-neutral-500 dark:text-neutral-400" />
            <div className="line-clamp-1 grow overflow-hidden pr-6 font-medium text-neutral-500 dark:text-neutral-400">
              {item.title}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
