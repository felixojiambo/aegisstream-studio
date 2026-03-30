import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUserAccess } from "@/features/auth/useCurrentUserAccess";
import {
  canManageCaseFromUi,
  CASE_STATUS_TRANSITIONS,
  CaseRecord,
  CaseStatus,
  useTransitionCaseStatus,
} from "@/features/cases/workspace";

export function CaseStatusTransitionMenu({ caseRecord }: { caseRecord: CaseRecord }) {
  const { data: access } = useCurrentUserAccess();
  const transitionMutation = useTransitionCaseStatus();
  const nextStatuses = CASE_STATUS_TRANSITIONS[caseRecord.status] ?? [];
  const [nextStatus, setNextStatus] = useState<CaseStatus | "">("");

  const canTransition = canManageCaseFromUi({
    roles: access?.roles ?? [],
    userId: access?.userId ?? null,
    caseRecord,
  });

  async function handleTransition() {
    if (!nextStatus) return;

    await transitionMutation.mutateAsync({
      caseId: caseRecord.id,
      nextStatus,
    });

    setNextStatus("");
  }

  if (!nextStatuses.length) {
    return (
      <Button variant="outline" size="sm" disabled>
        No next step
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        className="h-9 rounded-md border bg-background px-3 text-sm"
        value={nextStatus}
        onChange={(e) => setNextStatus(e.target.value as CaseStatus)}
        disabled={!canTransition || transitionMutation.isPending}
      >
        <option value="">Next status</option>
        {nextStatuses.map((status) => (
          <option key={status} value={status}>
            {status.replaceAll("_", " ")}
          </option>
        ))}
      </select>

      <Button
        size="sm"
        onClick={handleTransition}
        disabled={!canTransition || !nextStatus || transitionMutation.isPending}
      >
        {transitionMutation.isPending ? "Updating..." : "Apply"}
      </Button>
    </div>
  );
}
