import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground ring-border",
        open: "bg-info/10 text-info ring-info/30",
        "in-progress": "bg-warning/10 text-warning ring-warning/30",
        resolved: "bg-success/10 text-success ring-success/30",
        closed: "bg-muted text-muted-foreground ring-border",
        escalated: "bg-destructive/10 text-destructive ring-destructive/30",
        pending: "bg-warning/10 text-warning ring-warning/30",
        approved: "bg-success/10 text-success ring-success/30",
        rejected: "bg-destructive/10 text-destructive ring-destructive/30",
        high: "bg-destructive/10 text-destructive ring-destructive/30",
        medium: "bg-warning/10 text-warning ring-warning/30",
        low: "bg-info/10 text-info ring-info/30",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}
