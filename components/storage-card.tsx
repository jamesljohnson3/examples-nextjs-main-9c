import { Database } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function StorageCard() {
  return (
    <Card className="rounded-md text-xs shadow-sm">
      <CardContent className="flex items-start gap-2.5 p-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50">
          <Database className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        </div>
        <div className="grid flex-1 gap-1">
          <p className="font-medium">Running out of space?</p>
          <p className="text-neutral-500 dark:text-neutral-400">79.2 GB / 100 GB used</p>
          <Progress
            value={79.2}
            className="mt-1"
            aria-label="79.2 GB / 100 used"
          />
        </div>
      </CardContent>
    </Card>
  )
}
