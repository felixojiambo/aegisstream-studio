import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CasePriority, useCreateCase } from "@/features/cases/workspace";

export function CreateCaseDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (caseId: string) => void;
}) {
  const createCase = useCreateCase();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalRef, setExternalRef] = useState("");
  const [priority, setPriority] = useState<CasePriority>("MEDIUM");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const created = await createCase.mutateAsync({
      title,
      description,
      externalRef,
      priority,
    });

    setTitle("");
    setDescription("");
    setExternalRef("");
    setPriority("MEDIUM");
    onClose();
    onCreated(created.id);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl border bg-background p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Create case</h2>
          <p className="text-sm text-muted-foreground">Start a new operational case.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">External reference</label>
            <Input
              value={externalRef}
              onChange={(e) => setExternalRef(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Priority</label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value as CasePriority)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCase.isPending}>
              {createCase.isPending ? "Creating..." : "Create case"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
