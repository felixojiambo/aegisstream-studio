// import { useState } from "react";
// import { Search, Filter, Plus, ChevronDown } from "lucide-react";
// import { PageHeader } from "@/components/shared/PageHeader";
// import { StatusBadge } from "@/components/shared/StatusBadge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useNavigate } from "react-router-dom";
//
// interface CaseItem {
//   id: string;
//   title: string;
//   status: "open" | "in-progress" | "escalated" | "resolved" | "closed";
//   priority: "high" | "medium" | "low";
//   assignee: string;
//   assigneeInitials: string;
//   created: string;
//   category: string;
// }
//
// const mockCases: CaseItem[] = [
//   { id: "CAS-2847", title: "Suspicious transaction flagged by ML model", status: "in-progress", priority: "high", assignee: "Agent Smith", assigneeInitials: "AS", created: "2h ago", category: "Fraud" },
//   { id: "CAS-2846", title: "KYC document verification failed", status: "open", priority: "high", assignee: "Unassigned", assigneeInitials: "?", created: "3h ago", category: "KYC" },
//   { id: "CAS-2845", title: "Customer dispute on wire transfer", status: "in-progress", priority: "medium", assignee: "Jane Doe", assigneeInitials: "JD", created: "5h ago", category: "Disputes" },
//   { id: "CAS-2844", title: "AML alert — unusual pattern detected", status: "escalated", priority: "high", assignee: "Agent Smith", assigneeInitials: "AS", created: "6h ago", category: "AML" },
//   { id: "CAS-2843", title: "Sanctions screening match review", status: "open", priority: "medium", assignee: "Unassigned", assigneeInitials: "?", created: "8h ago", category: "Sanctions" },
//   { id: "CAS-2840", title: "Regulatory reporting discrepancy", status: "resolved", priority: "low", assignee: "Bob Lee", assigneeInitials: "BL", created: "1d ago", category: "Reporting" },
//   { id: "CAS-2838", title: "Periodic review — high-risk client", status: "in-progress", priority: "medium", assignee: "Jane Doe", assigneeInitials: "JD", created: "1d ago", category: "KYC" },
//   { id: "CAS-2835", title: "Chargeback investigation #8821", status: "closed", priority: "low", assignee: "Agent Smith", assigneeInitials: "AS", created: "2d ago", category: "Disputes" },
// ];
//
// const statusFilters = ["All", "Open", "In Progress", "Escalated", "Resolved", "Closed"] as const;
//
// export default function CaseListPage() {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");
//   const [activeStatus, setActiveStatus] = useState<string>("All");
//
//   const filtered = mockCases.filter((c) => {
//     const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
//     const matchesStatus = activeStatus === "All" || c.status === activeStatus.toLowerCase().replace(" ", "-");
//     return matchesSearch && matchesStatus;
//   });
//
//   return (
//     <div>
//       <PageHeader
//         title="Cases"
//         description={`${mockCases.length} total cases`}
//         actions={
//           <Button size="sm">
//             <Plus className="h-3.5 w-3.5 mr-1.5" /> New Case
//           </Button>
//         }
//       />
//
//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-4">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
//           <Input
//             placeholder="Search cases…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9 h-9 text-sm"
//           />
//         </div>
//         <div className="flex items-center gap-1.5 flex-wrap">
//           {statusFilters.map((s) => (
//             <Button
//               key={s}
//               variant={activeStatus === s ? "default" : "outline"}
//               size="sm"
//               className="h-8 text-xs"
//               onClick={() => setActiveStatus(s)}
//             >
//               {s}
//             </Button>
//           ))}
//           <Button variant="outline" size="sm" className="h-8 text-xs">
//             <Filter className="h-3 w-3 mr-1" /> More <ChevronDown className="h-3 w-3 ml-1" />
//           </Button>
//         </div>
//       </div>
//
//       {/* Table */}
//       <div className="rounded-lg border bg-card overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b bg-muted/50">
//                 <th className="text-left p-3 font-medium text-muted-foreground">Case ID</th>
//                 <th className="text-left p-3 font-medium text-muted-foreground">Title</th>
//                 <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
//                 <th className="text-left p-3 font-medium text-muted-foreground">Priority</th>
//                 <th className="text-left p-3 font-medium text-muted-foreground">Assignee</th>
//                 <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
//                 <th className="text-left p-3 font-medium text-muted-foreground">Created</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {filtered.map((c) => (
//                 <tr
//                   key={c.id}
//                   className="hover:bg-muted/30 cursor-pointer transition-colors"
//                   onClick={() => navigate(`/cases/${c.id}`)}
//                 >
//                   <td className="p-3 font-mono text-xs font-medium text-primary">{c.id}</td>
//                   <td className="p-3 text-foreground max-w-xs truncate">{c.title}</td>
//                   <td className="p-3"><StatusBadge variant={c.status}>{c.status.replace("-", " ")}</StatusBadge></td>
//                   <td className="p-3"><StatusBadge variant={c.priority}>{c.priority}</StatusBadge></td>
//                   <td className="p-3">
//                     <div className="flex items-center gap-2">
//                       <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-semibold text-secondary-foreground">
//                         {c.assigneeInitials}
//                       </div>
//                       <span className="text-sm text-foreground">{c.assignee}</span>
//                     </div>
//                   </td>
//                   <td className="p-3 text-muted-foreground">{c.category}</td>
//                   <td className="p-3 text-muted-foreground text-xs">{c.created}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CasePriority,
  CaseStatus,
  formatDateTime,
  getInitials,
  useCases,
} from "@/features/cases/workspace";
import { CaseStatusBadge } from "@/features/cases/components/CaseStatusBadge";
import { CasePriorityBadge } from "@/features/cases/components/CasePriorityBadge";
import { CreateCaseDialog } from "@/features/cases/components/CreateCaseDialog";

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

const statusOptions: Array<CaseStatus | "ALL"> = [
  "ALL",
  "NEW",
  "IN_PROGRESS",
  "NEEDS_INFO",
  "TRIAGED",
  "IN_REVIEW",
  "APPROVED",
  "RESOLVED",
  "REJECTED",
];

const priorityOptions: Array<CasePriority | "ALL"> = [
  "ALL",
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

export default function CaseListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState<CaseStatus | "ALL">(
    (searchParams.get("status") as CaseStatus | "ALL") ?? "ALL"
  );
  const [priority, setPriority] = useState<CasePriority | "ALL">(
    (searchParams.get("priority") as CasePriority | "ALL") ?? "ALL"
  );
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at" | "title">(
    (searchParams.get("sortBy") as "created_at" | "updated_at" | "title") ??
      "updated_at"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    (searchParams.get("sortDirection") as "asc" | "desc") ?? "desc"
  );
  const [createOpen, setCreateOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    const next = new URLSearchParams();

    if (debouncedSearch) next.set("q", debouncedSearch);
    if (status !== "ALL") next.set("status", status);
    if (priority !== "ALL") next.set("priority", priority);
    if (sortBy !== "updated_at") next.set("sortBy", sortBy);
    if (sortDirection !== "desc") next.set("sortDirection", sortDirection);

    setSearchParams(next, { replace: true });
  }, [
    debouncedSearch,
    status,
    priority,
    sortBy,
    sortDirection,
    setSearchParams,
  ]);

  const { data: cases = [], isLoading, isError } = useCases({
    search: debouncedSearch,
    status,
    priority,
    sortBy,
    sortDirection,
  });

  return (
    <div>
      <PageHeader
        title="Cases"
        description={`${cases.length} cases`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Case
          </Button>
        }
      />

      <div className="mb-4 grid gap-3 lg:grid-cols-[1.5fr,1fr,1fr,1fr,1fr]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search title or external ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <select
          className="h-10 rounded-md border bg-background px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as CaseStatus | "ALL")}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option === "ALL" ? "All statuses" : option.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        <select
          className="h-10 rounded-md border bg-background px-3 text-sm"
          value={priority}
          onChange={(e) => setPriority(e.target.value as CasePriority | "ALL")}
        >
          {priorityOptions.map((option) => (
            <option key={option} value={option}>
              {option === "ALL" ? "All priorities" : option}
            </option>
          ))}
        </select>

        <select
          className="h-10 rounded-md border bg-background px-3 text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "created_at" | "updated_at" | "title")}
        >
          <option value="updated_at">Sort: Updated</option>
          <option value="created_at">Sort: Created</option>
          <option value="title">Sort: Title</option>
        </select>

        <select
          className="h-10 rounded-md border bg-background px-3 text-sm"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium text-muted-foreground">Reference</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Priority</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Agent</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Reviewer</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Updated</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td className="p-4 text-muted-foreground" colSpan={7}>
                    Loading cases...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td className="p-4 text-destructive" colSpan={7}>
                    Failed to load cases.
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td className="p-4 text-muted-foreground" colSpan={7}>
                    No cases found.
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr
                    key={c.id}
                    className="cursor-pointer transition-colors hover:bg-muted/30"
                    onClick={() => navigate(`/cases/${c.id}`)}
                  >
                    <td className="p-3 font-mono text-xs font-medium text-primary">
                      {c.external_ref ?? c.id.slice(0, 8)}
                    </td>
                    <td className="max-w-md p-3 text-foreground">
                      <div className="font-medium">{c.title}</div>
                      {c.description ? (
                        <div className="truncate text-xs text-muted-foreground">
                          {c.description}
                        </div>
                      ) : null}
                    </td>
                    <td className="p-3">
                      <CaseStatusBadge status={c.status} />
                    </td>
                    <td className="p-3">
                      <CasePriorityBadge priority={c.priority} />
                    </td>
                    <td className="p-3">
                      {c.assigned_agent ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold">
                            {getInitials(c.assigned_agent)}
                          </div>
                          <span>{c.assigned_agent.full_name ?? c.assigned_agent.email}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      {c.assigned_reviewer ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold">
                            {getInitials(c.assigned_reviewer)}
                          </div>
                          <span>{c.assigned_reviewer.full_name ?? c.assigned_reviewer.email}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {formatDateTime(c.updated_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateCaseDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(caseId) => navigate(`/cases/${caseId}`)}
      />
    </div>
  );
}
