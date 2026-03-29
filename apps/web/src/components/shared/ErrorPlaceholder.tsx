import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPlaceholderProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorPlaceholder({
  title = "Something went wrong",
  description = "An error occurred while loading this content.",
  onRetry,
}: ErrorPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-lg bg-destructive/10 p-3 mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  );
}
