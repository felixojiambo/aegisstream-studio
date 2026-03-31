// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, Copy, MoreHorizontal, User, Clock, Tag } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { StatusBadge } from "@/components/shared/StatusBadge";
// import { EmptyState } from "@/components/shared/EmptyState";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//
// const tabConfig = [
//   "Overview", "Timeline", "Documents", "Copilot", "Triage", "Review", "Audit",
// ] as const;
//
// function OverviewTab() {
//   return (
//     <div className="grid gap-6 lg:grid-cols-3">
//       <div className="lg:col-span-2 space-y-6">
//         <div className="rounded-lg border bg-card p-5">
//           <h3 className="text-sm font-semibold text-card-foreground mb-3">Summary</h3>
//           <p className="text-sm text-muted-foreground leading-relaxed">
//             ML model flagged transaction #TX-998412 for anomalous behavior. The transaction amount of $47,250 deviates significantly from the customer's typical pattern. Initial triage suggests a potential false positive, but manual review is required to confirm.
//           </p>
//         </div>
//         <div className="rounded-lg border bg-card p-5">
//           <h3 className="text-sm font-semibold text-card-foreground mb-3">AI Triage Notes</h3>
//           <div className="bg-muted/50 rounded-md p-4 border border-dashed">
//             <p className="text-sm text-muted-foreground italic">
//               Copilot triage output will appear here once processing completes. Confidence score, risk factors, and recommended actions will be displayed.
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="space-y-4">
//         <div className="rounded-lg border bg-card p-5">
//           <h3 className="text-sm font-semibold text-card-foreground mb-4">Details</h3>
//           <dl className="space-y-3 text-sm">
//             {[
//               { label: "Status", value: <StatusBadge variant="in-progress">In Progress</StatusBadge> },
//               { label: "Priority", value: <StatusBadge variant="high">High</StatusBadge> },
//               { label: "Category", value: "Fraud" },
//               { label: "Created", value: "Mar 26, 2026 · 10:14 AM" },
//               { label: "Last Updated", value: "2 hours ago" },
//               { label: "SLA Due", value: "Mar 27, 2026 · 10:14 AM" },
//             ].map((d) => (
//               <div key={d.label} className="flex justify-between items-center">
//                 <dt className="text-muted-foreground">{d.label}</dt>
//                 <dd className="text-foreground font-medium">{typeof d.value === "string" ? d.value : d.value}</dd>
//               </div>
//             ))}
//           </dl>
//         </div>
//         <div className="rounded-lg border bg-card p-5">
//           <h3 className="text-sm font-semibold text-card-foreground mb-4">Assignees</h3>
//           <div className="space-y-3">
//             {[
//               { name: "Agent Smith", role: "Case Agent" },
//               { name: "Review pending", role: "Reviewer" },
//             ].map((a) => (
//               <div key={a.name} className="flex items-center gap-3">
//                 <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center">
//                   <User className="h-3.5 w-3.5 text-secondary-foreground" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-medium text-foreground">{a.name}</div>
//                   <div className="text-xs text-muted-foreground">{a.role}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// function TabPlaceholder({ name }: { name: string }) {
//   return (
//     <EmptyState
//       title={`${name} tab`}
//       description={`The ${name.toLowerCase()} view will be implemented here. This is a placeholder for the full feature.`}
//     />
//   );
// }
//
// export default function CaseDetailPage() {
//   const { caseId } = useParams();
//   const navigate = useNavigate();
//
//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-1">
//         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/cases")}>
//           <ArrowLeft className="h-4 w-4" />
//         </Button>
//         <div className="flex items-center gap-2">
//           <h1 className="text-xl font-semibold text-foreground">{caseId || "CAS-2847"}</h1>
//           <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
//             <Copy className="h-3 w-3" />
//           </Button>
//         </div>
//         <StatusBadge variant="in-progress">In Progress</StatusBadge>
//         <StatusBadge variant="high">High Priority</StatusBadge>
//         <div className="ml-auto flex items-center gap-2">
//           <Button variant="outline" size="sm">Assign</Button>
//           <Button size="sm">Resolve</Button>
//           <Button variant="ghost" size="icon" className="h-8 w-8">
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//
//       <div className="flex items-center gap-4 mb-6 ml-11 text-xs text-muted-foreground">
//         <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Fraud</span>
//         <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Opened 2h ago</span>
//         <span className="flex items-center gap-1"><User className="h-3 w-3" /> Agent Smith</span>
//       </div>
//
//       {/* Tabs */}
//       <Tabs defaultValue="Overview" className="w-full">
//         <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto mb-6">
//           {tabConfig.map((tab) => (
//             <TabsTrigger
//               key={tab}
//               value={tab}
//               className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm text-muted-foreground data-[state=active]:text-foreground"
//             >
//               {tab}
//             </TabsTrigger>
//           ))}
//         </TabsList>
//         <TabsContent value="Overview"><OverviewTab /></TabsContent>
//         {tabConfig.filter((t) => t !== "Overview").map((tab) => (
//           <TabsContent key={tab} value={tab}><TabPlaceholder name={tab} /></TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUserAccess } from "@/features/auth/useCurrentUserAccess";
import {
  canManageCaseFromUi,
  CasePriority,
  formatDateTime,
  useCase,
  useUpdateCase,
} from "@/features/cases/workspace";
import { CaseStatusBadge } from "@/features/cases/components/CaseStatusBadge";
import { CasePriorityBadge } from "@/features/cases/components/CasePriorityBadge";
import { CaseAssignmentPanel } from "@/features/cases/components/CaseAssignmentPanel";
import { CaseCommentsPanel } from "@/features/cases/components/CaseCommentsPanel";
import { CaseTimeline } from "@/features/cases/components/CaseTimeline";
import { CaseStatusTransitionMenu } from "@/features/cases/components/CaseStatusTransitionMenu";

const tabConfig = [
  { value: "overview", label: "Overview" },
  { value: "timeline", label: "Timeline" },
  { value: "documents", label: "Documents" },
  { value: "copilot", label: "Copilot" },
  { value: "triage", label: "Triage" },
  { value: "review", label: "Review" },
  { value: "audit", label: "Audit" },
] as const;

function PlaceholderTab({ name }: { name: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
      {name} will be filled in by the next phases.
    </div>
  );
}

export default function CaseDetailPage() {
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();

  const { data: caseRecord, isLoading, isError } = useCase(caseId);
  const { data: access } = useCurrentUserAccess();
  const updateCase = useUpdateCase();

  const [title, setTitle] = useState("");
  const [externalRef, setExternalRef] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<CasePriority>("MEDIUM");

  useEffect(() => {
    if (!caseRecord) return;
    setTitle(caseRecord.title);
    setExternalRef(caseRecord.external_ref ?? "");
    setDescription(caseRecord.description ?? "");
    setPriority(caseRecord.priority);
  }, [caseRecord]);

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading case...</div>;
  }

  if (isError || !caseRecord) {
    return <div className="p-6 text-sm text-destructive">Failed to load case.</div>;
  }

  const canEditOverview = canManageCaseFromUi({
    roles: access?.roles ?? [],
    userId: access?.userId ?? null,
    caseRecord,
  });

  async function handleSaveOverview(e: React.FormEvent) {
    e.preventDefault();
    if (!caseRecord || !canEditOverview) return;

    await updateCase.mutateAsync({
      caseId: caseRecord.id,
      updates: {
        title,
        external_ref: externalRef || null,
        description,
        priority,
      },
    });
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate("/cases")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-xl font-semibold">
              {caseRecord.external_ref ?? caseRecord.id.slice(0, 8)}
            </h1>
            <CaseStatusBadge status={caseRecord.status} />
            <CasePriorityBadge priority={caseRecord.priority} />
          </div>
          <div className="text-sm text-muted-foreground">{caseRecord.title}</div>
        </div>

        <div className="ml-auto">
          <CaseStatusTransitionMenu caseRecord={caseRecord} />
        </div>
      </div>

      <div className="mb-6 ml-11 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span>Created: {formatDateTime(caseRecord.created_at)}</span>
        <span>Updated: {formatDateTime(caseRecord.updated_at)}</span>
        <span>
          Agent:{" "}
          {caseRecord.assigned_agent?.full_name ??
            caseRecord.assigned_agent?.email ??
            "Unassigned"}
        </span>
        <span>
          Reviewer:{" "}
          {caseRecord.assigned_reviewer?.full_name ??
            caseRecord.assigned_reviewer?.email ??
            "Unassigned"}
        </span>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
          {tabConfig.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <form onSubmit={handleSaveOverview} className="rounded-lg border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Overview</h3>
                  <Button
                    type="submit"
                    disabled={!canEditOverview || updateCase.isPending}
                  >
                    {updateCase.isPending ? "Saving..." : "Save changes"}
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Title</label>
                    <input
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={!canEditOverview}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">External reference</label>
                    <input
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      value={externalRef}
                      onChange={(e) => setExternalRef(e.target.value)}
                      disabled={!canEditOverview}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Priority</label>
                    <select
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as CasePriority)}
                      disabled={!canEditOverview}
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="URGENT">URGENT</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Description</label>
                    <textarea
                      className="min-h-32 w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={!canEditOverview}
                    />
                  </div>
                </div>
              </form>

              <CaseCommentsPanel caseId={caseRecord.id} />
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-5">
                <h3 className="mb-4 text-sm font-semibold">Details</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd>
                      <CaseStatusBadge status={caseRecord.status} />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Priority</dt>
                    <dd>
                      <CasePriorityBadge priority={caseRecord.priority} />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Created by</dt>
                    <dd className="text-right font-medium">
                      {caseRecord.creator?.full_name ?? caseRecord.creator?.email ?? "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd className="text-right font-medium">
                      {formatDateTime(caseRecord.created_at)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Updated</dt>
                    <dd className="text-right font-medium">
                      {formatDateTime(caseRecord.updated_at)}
                    </dd>
                  </div>
                </dl>
              </div>

              <CaseAssignmentPanel caseRecord={caseRecord} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <CaseTimeline caseId={caseRecord.id} />
        </TabsContent>

        <TabsContent value="documents">
          <PlaceholderTab name="Documents" />
        </TabsContent>
        <TabsContent value="copilot">
          <PlaceholderTab name="Copilot" />
        </TabsContent>
        <TabsContent value="triage">
          <PlaceholderTab name="Triage" />
        </TabsContent>
        <TabsContent value="review">
          <PlaceholderTab name="Review" />
        </TabsContent>
        <TabsContent value="audit">
          <PlaceholderTab name="Audit" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
