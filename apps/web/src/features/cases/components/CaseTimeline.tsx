import { formatDateTime, useCaseEvents } from "@/features/cases/workspace";

function describeEvent(eventType: string, eventData: Record<string, unknown>) {
  switch (eventType) {
    case "CASE_CREATED":
      return "Case created";
    case "STATUS_CHANGED":
      return `Status changed from ${String(eventData.from_status ?? "—")} to ${String(
        eventData.to_status ?? "—"
      )}`;
    case "ASSIGNMENT_CHANGED":
      return "Assignments updated";
    case "COMMENT_ADDED":
      return `Comment added${eventData.preview ? `: ${String(eventData.preview)}` : ""}`;
    case "CASE_UPDATED":
      return "Case details updated";
    default:
      return eventType.replaceAll("_", " ");
  }
}

export function CaseTimeline({ caseId }: { caseId: string }) {
  const { data: events = [], isLoading } = useCaseEvents(caseId);

  return (
    <div className="rounded-lg border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold">Timeline</h3>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading timeline...</div>
      ) : events.length === 0 ? (
        <div className="text-sm text-muted-foreground">No timeline events yet.</div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex gap-3">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">
                  {describeEvent(event.event_type, event.event_data)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {event.actor?.full_name ?? event.actor?.email ?? "System"} ·{" "}
                  {formatDateTime(event.occurred_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
