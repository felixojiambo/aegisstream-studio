import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye, Filter, ChevronDown } from "lucide-react";

interface ReviewItem {
  id: string;
  caseRef: string;
  reason: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "approved" | "rejected";
  reviewer: string;
  reviewerInitials: string;
  submitted: string;
}

const mockReviews: ReviewItem[] = [
  { id: "REV-412", caseRef: "CAS-2847", reason: "ML model escalation — anomaly score > 0.92", priority: "high", status: "pending", reviewer: "Unassigned", reviewerInitials: "?", submitted: "30m ago" },
  { id: "REV-411", caseRef: "CAS-2844", reason: "AML pattern requires L2 sign-off", priority: "high", status: "in-progress", reviewer: "Jane Doe", reviewerInitials: "JD", submitted: "1h ago" },
  { id: "REV-410", caseRef: "CAS-2843", reason: "Sanctions screening — partial name match", priority: "medium", status: "pending", reviewer: "Unassigned", reviewerInitials: "?", submitted: "3h ago" },
  { id: "REV-409", caseRef: "CAS-2841", reason: "Document classification confidence < 70%", priority: "medium", status: "approved", reviewer: "Bob Lee", reviewerInitials: "BL", submitted: "5h ago" },
  { id: "REV-408", caseRef: "CAS-2838", reason: "Periodic high-risk client review due", priority: "low", status: "pending", reviewer: "Unassigned", reviewerInitials: "?", submitted: "8h ago" },
  { id: "REV-407", caseRef: "CAS-2835", reason: "Chargeback threshold exceeded", priority: "low", status: "rejected", reviewer: "Agent Smith", reviewerInitials: "AS", submitted: "1d ago" },
];

export default function ReviewQueuePage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Review Queue"
        description={`${mockReviews.filter((r) => r.status === "pending").length} pending reviews`}
        actions={
          <Button variant="outline" size="sm">
            <Filter className="h-3.5 w-3.5 mr-1.5" /> Filter <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        }
      />

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Review ID</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Case</th>
                <th className="text-left p-3 font-medium text-muted-foreground min-w-[250px]">Reason</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Priority</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Reviewer</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Submitted</th>
                <th className="text-left p-3 font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockReviews.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs font-medium text-primary">{r.id}</td>
                  <td className="p-3">
                    <button onClick={() => navigate(`/cases/${r.caseRef}`)} className="font-mono text-xs font-medium text-info hover:underline">
                      {r.caseRef}
                    </button>
                  </td>
                  <td className="p-3 text-foreground">{r.reason}</td>
                  <td className="p-3"><StatusBadge variant={r.priority}>{r.priority}</StatusBadge></td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-semibold text-secondary-foreground">
                        {r.reviewerInitials}
                      </div>
                      <span className="text-sm">{r.reviewer}</span>
                    </div>
                  </td>
                  <td className="p-3"><StatusBadge variant={r.status}>{r.status}</StatusBadge></td>
                  <td className="p-3 text-xs text-muted-foreground">{r.submitted}</td>
                  <td className="p-3">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
