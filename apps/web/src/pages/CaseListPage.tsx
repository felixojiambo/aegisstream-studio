import { useState } from "react";
import { Search, Filter, Plus, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface CaseItem {
  id: string;
  title: string;
  status: "open" | "in-progress" | "escalated" | "resolved" | "closed";
  priority: "high" | "medium" | "low";
  assignee: string;
  assigneeInitials: string;
  created: string;
  category: string;
}

const mockCases: CaseItem[] = [
  { id: "CAS-2847", title: "Suspicious transaction flagged by ML model", status: "in-progress", priority: "high", assignee: "Agent Smith", assigneeInitials: "AS", created: "2h ago", category: "Fraud" },
  { id: "CAS-2846", title: "KYC document verification failed", status: "open", priority: "high", assignee: "Unassigned", assigneeInitials: "?", created: "3h ago", category: "KYC" },
  { id: "CAS-2845", title: "Customer dispute on wire transfer", status: "in-progress", priority: "medium", assignee: "Jane Doe", assigneeInitials: "JD", created: "5h ago", category: "Disputes" },
  { id: "CAS-2844", title: "AML alert — unusual pattern detected", status: "escalated", priority: "high", assignee: "Agent Smith", assigneeInitials: "AS", created: "6h ago", category: "AML" },
  { id: "CAS-2843", title: "Sanctions screening match review", status: "open", priority: "medium", assignee: "Unassigned", assigneeInitials: "?", created: "8h ago", category: "Sanctions" },
  { id: "CAS-2840", title: "Regulatory reporting discrepancy", status: "resolved", priority: "low", assignee: "Bob Lee", assigneeInitials: "BL", created: "1d ago", category: "Reporting" },
  { id: "CAS-2838", title: "Periodic review — high-risk client", status: "in-progress", priority: "medium", assignee: "Jane Doe", assigneeInitials: "JD", created: "1d ago", category: "KYC" },
  { id: "CAS-2835", title: "Chargeback investigation #8821", status: "closed", priority: "low", assignee: "Agent Smith", assigneeInitials: "AS", created: "2d ago", category: "Disputes" },
];

const statusFilters = ["All", "Open", "In Progress", "Escalated", "Resolved", "Closed"] as const;

export default function CaseListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<string>("All");

  const filtered = mockCases.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = activeStatus === "All" || c.status === activeStatus.toLowerCase().replace(" ", "-");
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Cases"
        description={`${mockCases.length} total cases`}
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Case
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search cases…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {statusFilters.map((s) => (
            <Button
              key={s}
              variant={activeStatus === s ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setActiveStatus(s)}
            >
              {s}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Filter className="h-3 w-3 mr-1" /> More <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Case ID</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Priority</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Assignee</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/cases/${c.id}`)}
                >
                  <td className="p-3 font-mono text-xs font-medium text-primary">{c.id}</td>
                  <td className="p-3 text-foreground max-w-xs truncate">{c.title}</td>
                  <td className="p-3"><StatusBadge variant={c.status}>{c.status.replace("-", " ")}</StatusBadge></td>
                  <td className="p-3"><StatusBadge variant={c.priority}>{c.priority}</StatusBadge></td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-semibold text-secondary-foreground">
                        {c.assigneeInitials}
                      </div>
                      <span className="text-sm text-foreground">{c.assignee}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{c.category}</td>
                  <td className="p-3 text-muted-foreground text-xs">{c.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
