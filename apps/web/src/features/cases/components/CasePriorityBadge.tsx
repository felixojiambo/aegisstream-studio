import { CasePriority } from "@/features/cases/workspace";

const styles: Record<CasePriority, string> = {
  LOW: "bg-slate-100 text-slate-700 border-slate-200",
  MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  URGENT: "bg-red-100 text-red-700 border-red-200",
};

export function CasePriorityBadge({ priority }: { priority: CasePriority }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[priority],
      ].join(" ")}
    >
      {priority}
    </span>
  );
}
