import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, MoreHorizontal, User, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabConfig = [
  "Overview", "Timeline", "Documents", "Copilot", "Triage", "Review", "Audit",
] as const;

function OverviewTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ML model flagged transaction #TX-998412 for anomalous behavior. The transaction amount of $47,250 deviates significantly from the customer's typical pattern. Initial triage suggests a potential false positive, but manual review is required to confirm.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">AI Triage Notes</h3>
          <div className="bg-muted/50 rounded-md p-4 border border-dashed">
            <p className="text-sm text-muted-foreground italic">
              Copilot triage output will appear here once processing completes. Confidence score, risk factors, and recommended actions will be displayed.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Details</h3>
          <dl className="space-y-3 text-sm">
            {[
              { label: "Status", value: <StatusBadge variant="in-progress">In Progress</StatusBadge> },
              { label: "Priority", value: <StatusBadge variant="high">High</StatusBadge> },
              { label: "Category", value: "Fraud" },
              { label: "Created", value: "Mar 26, 2026 · 10:14 AM" },
              { label: "Last Updated", value: "2 hours ago" },
              { label: "SLA Due", value: "Mar 27, 2026 · 10:14 AM" },
            ].map((d) => (
              <div key={d.label} className="flex justify-between items-center">
                <dt className="text-muted-foreground">{d.label}</dt>
                <dd className="text-foreground font-medium">{typeof d.value === "string" ? d.value : d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Assignees</h3>
          <div className="space-y-3">
            {[
              { name: "Agent Smith", role: "Case Agent" },
              { name: "Review pending", role: "Reviewer" },
            ].map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-secondary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabPlaceholder({ name }: { name: string }) {
  return (
    <EmptyState
      title={`${name} tab`}
      description={`The ${name.toLowerCase()} view will be implemented here. This is a placeholder for the full feature.`}
    />
  );
}

export default function CaseDetailPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/cases")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-foreground">{caseId || "CAS-2847"}</h1>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        <StatusBadge variant="in-progress">In Progress</StatusBadge>
        <StatusBadge variant="high">High Priority</StatusBadge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">Assign</Button>
          <Button size="sm">Resolve</Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 ml-11 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Fraud</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Opened 2h ago</span>
        <span className="flex items-center gap-1"><User className="h-3 w-3" /> Agent Smith</span>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="Overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto mb-6">
          {tabConfig.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm text-muted-foreground data-[state=active]:text-foreground"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Overview"><OverviewTab /></TabsContent>
        {tabConfig.filter((t) => t !== "Overview").map((tab) => (
          <TabsContent key={tab} value={tab}><TabPlaceholder name={tab} /></TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
