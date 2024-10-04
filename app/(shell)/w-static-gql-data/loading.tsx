import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function LoadingUI() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <div className="flex space-x-4">
        <div className="w-1/3 space-y-2">
          <Skeleton className="h-6 w-[100px]" />
          <Card className="border-2 border-slate-200">
            <CardContent className="p-1">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2 p-2">
                  {Array(8).fill(0).map((_, index) => (
                    <Card key={index} className="border border-slate-200">
                      <CardContent className="p-3 flex items-center space-x-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <div className="space-y-2 flex-grow">
                          <Skeleton className="h-4 w-[120px]" />
                          <Skeleton className="h-3 w-[80px]" />
                        </div>
                        <Skeleton className="h-6 w-[60px]" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <Separator orientation="vertical" className="h-auto" />
        <div className="w-2/3 space-y-2">
          <Skeleton className="h-6 w-[100px]" />
          <Card className="border-2 border-slate-200">
            <CardContent className="p-1">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2 p-2">
                  {Array(12).fill(0).map((_, index) => (
                    <Card key={index} className="border border-slate-200">
                      <CardContent className="p-3 flex items-center space-x-3">
                        <Skeleton className="h-12 w-12 rounded" />
                        <div className="space-y-2 flex-grow">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-[80px]" />
                          <div className="flex space-x-1">
                            <Skeleton className="h-6 w-6" />
                            <Skeleton className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}