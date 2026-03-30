import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUserAccess } from "@/features/auth/useCurrentUserAccess";
import {
  canManageCaseFromUi,
  CaseRecord,
  useAssignableUsers,
  useAssignCaseUsers,
} from "@/features/cases/workspace";

export function CaseAssignmentPanel({ caseRecord }: { caseRecord: CaseRecord }) {
  const { data: agents = [] } = useAssignableUsers("case_agent");
  const { data: reviewers = [] } = useAssignableUsers("reviewer");
  const { data: access } = useCurrentUserAccess();
  const assignMutation = useAssignCaseUsers();

  const canEdit = canManageCaseFromUi({
    roles: access?.roles ?? [],
    userId: access?.userId ?? null,
    caseRecord,
  });

  const [assignedAgentId, setAssignedAgentId] = useState<string>(
    caseRecord.assigned_agent_id ?? ""
  );
  const [assignedReviewerId, setAssignedReviewerId] = useState<string>(
    caseRecord.assigned_reviewer_id ?? ""
  );

  useEffect(() => {
    setAssignedAgentId(caseRecord.assigned_agent_id ?? "");
    setAssignedReviewerId(caseRecord.assigned_reviewer_id ?? "");
  }, [caseRecord.assigned_agent_id, caseRecord.assigned_reviewer_id]);

  async function handleSave() {
    await assignMutation.mutateAsync({
      caseId: caseRecord.id,
      assignedAgentId: assignedAgentId || null,
      assignedReviewerId: assignedReviewerId || null,
    });
  }

  return (
    <div className="rounded-lg border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold">Assignments</h3>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Case agent</label>
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={assignedAgentId}
            onChange={(e) => setAssignedAgentId(e.target.value)}
            disabled={!canEdit || assignMutation.isPending}
          >
            <option value="">Unassigned</option>
            {agents.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name ?? user.email ?? user.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Reviewer</label>
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={assignedReviewerId}
            onChange={(e) => setAssignedReviewerId(e.target.value)}
            disabled={!canEdit || assignMutation.isPending}
          >
            <option value="">Unassigned</option>
            {reviewers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name ?? user.email ?? user.id}
              </option>
            ))}
          </select>
        </div>

        <Button
          className="w-full"
          onClick={handleSave}
          disabled={!canEdit || assignMutation.isPending}
        >
          {assignMutation.isPending ? "Saving..." : "Save assignments"}
        </Button>
      </div>
    </div>
  );
}
