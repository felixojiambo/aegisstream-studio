import { CaseStatus } from "@/features/cases/workspace";

const styles: Record<CaseStatus, string> = {
  NEW: "bg-slate-100 text-slate-700 border-slate-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  NEEDS_INFO: "bg-amber-100 text-amber-700 border-amber-200",
  TRIAGED: "bg-violet-100 text-violet-700 border-violet-200",
  IN_REVIEW: "bg-orange-100 text-orange-700 border-orange-200",
  APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  RESOLVED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[status],
      ].join(" ")}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
