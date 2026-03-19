import { MeetingSummary } from "@/types/summary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, ListChecks, MessageSquare } from "lucide-react";

interface SummaryCardProps {
  data: MeetingSummary;
}

export function SummaryCard({ data }: SummaryCardProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <Card className="border-t-4 border-t-primary shadow-2xl shadow-primary/5 bg-card overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground  ">
                {data.MeetingInfo?.MeetingName}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2 text-muted-foreground font-medium">
                <Calendar className="w-4 h-4 text-primary" />
                {data.MeetingInfo?.Date}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20"
            >
              AI Generated
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Participants */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-foreground font-semibold">
              <Users className="w-5 h-5 text-primary" />
              <h3>Participants</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data &&
                data.Participants &&
                data.Participants.map((p, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1">
                    {p?.Name}{" "}
                    <span className="ml-1 text-muted-foreground font-normal">
                      ({p?.Role})
                    </span>
                  </Badge>
                ))}
            </div>
          </section>

          <Separator className="bg-border/50" />

          {/* Discussion Points - Using Accordion for better UX */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-foreground font-semibold">
              <MessageSquare className="w-5 h-5" />
              <h3>Key Discussion Points</h3>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {data &&
                data.Discussion &&
                data.Discussion.map((item, i) => (
                  <AccordionItem
                    value={`item-${i}`}
                    key={i}
                    className="border-slate-100"
                  >
                    <AccordionTrigger className="text-left text-foreground font-medium hover:text-primary transition-colors">
                      {item?.Topic}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      <p className="mb-2">{item?.Description}</p>
                      {item?.Action !== "-" && (
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-100 text-green-800 text-xs font-medium">
                          Outcome: {item?.Action}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </section>

          {/* Action Items */}
          <section className="bg-muted/30 p-5 rounded-xl border border-border/50">
            <div className="flex items-center gap-2 mb-4 text-primary-foreground font-bold">
              <ListChecks className="w-5 h-5" />
              <h3>Critical Action Items</h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data &&
                data.ActionItems &&
                data.ActionItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex flex-col p-3 bg-card rounded-lg shadow-sm border border-border/80"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                      Assignee: {item?.Assignee}
                    </span>
                    <p className="text-sm text-foreground font-medium">
                      {item?.Description}
                    </p>
                  </li>
                ))}
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
