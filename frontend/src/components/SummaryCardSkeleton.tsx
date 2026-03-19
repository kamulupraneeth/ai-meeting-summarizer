import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "@/components/ui/separator";

export function SummaryCardSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-muted shadow-md bg-card overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-full">
              {/* Title Skeleton */}
              <Skeleton className="h-8 w-2/3" />
              {/* Date Skeleton */}
              <Skeleton className="h-4 w-1/3" />
            </div>
            {/* Badge Skeleton */}
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Participants Skeleton */}
          <section>
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-32 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </section>

          <Separator className="bg-border/50" />

          {/* Discussion Points Skeleton */}
          <section>
            <Skeleton className="h-5 w-40 mb-3" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-3 border-b border-border/50">
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </section>

          {/* Action Items Skeleton */}
          <section className="bg-muted/30 p-5 rounded-xl border border-border/50">
            <Skeleton className="h-5 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-3 bg-card rounded-lg border border-border/80 space-y-2"
                >
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
