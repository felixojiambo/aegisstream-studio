import { FolderOpen, ClipboardCheck, AlertTriangle, Activity, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const recentActivity = [
  { id: "CAS-2847", action: "Triage completed", time: "4m ago", status: "in-progress" as const },
  { id: "CAS-2845", action: "Document uploaded", time: "12m ago", status: "open" as const },
  { id: "CAS-2841", action: "Review approved", time: "28m ago", status: "approved" as const },
  { id: "CAS-2839", action: "Escalated to L2", time: "1h ago", status: "escalated" as const },
  { id: "CAS-2836", action: "Case resolved", time: "2h ago", status: "resolved" as const },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Dashboard" description="Your operational overview for today." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard icon={FolderOpen} title="Assigned Cases" value={12} description="3 due today" trend={{ value: "+2", positive: false }} />
        <MetricCard icon={ClipboardCheck} title="Review Queue" value={7} description="2 high priority" />
        <MetricCard icon={AlertTriangle} title="Doc Failures" value={3} description="Requires attention" trend={{ value: "+1", positive: false }} />
        <MetricCard icon={Activity} title="Resolved Today" value={18} trend={{ value: "+22%", positive: true }} description="vs. yesterday" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-sm font-semibold text-card-foreground">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/cases")}>
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="divide-y">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/cases/${item.id}`)}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-medium text-primary">{item.id}</span>
                  <span className="text-sm text-foreground">{item.action}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge variant={item.status}>{item.status.replace("-", " ")}</StatusBadge>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border bg-card">
          <div className="p-4 border-b">
            <h2 className="text-sm font-semibold text-card-foreground">Quick Actions</h2>
          </div>
          <div className="p-4 grid gap-3">
            <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate("/cases")}>
              <FolderOpen className="h-4 w-4 mr-3 text-primary" />
              <div className="text-left">
                <div className="text-sm font-medium">Open Case Queue</div>
                <div className="text-xs text-muted-foreground">View and triage assigned cases</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate("/reviews")}>
              <ClipboardCheck className="h-4 w-4 mr-3 text-primary" />
              <div className="text-left">
                <div className="text-sm font-medium">Start Reviews</div>
                <div className="text-xs text-muted-foreground">7 cases awaiting review</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3">
              <AlertTriangle className="h-4 w-4 mr-3 text-warning" />
              <div className="text-left">
                <div className="text-sm font-medium">Fix Document Failures</div>
                <div className="text-xs text-muted-foreground">3 documents need re-processing</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
