import { useState } from "react";
import {
  formatDateTime,
  getInitials,
  useAddCaseComment,
  useCaseComments,
} from "@/features/cases/workspace";
import { Button } from "@/components/ui/button";

export function CaseCommentsPanel({ caseId }: { caseId: string }) {
  const { data: comments = [], isLoading } = useCaseComments(caseId);
  const addComment = useAddCaseComment();
  const [body, setBody] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    await addComment.mutateAsync({ caseId, body });
    setBody("");
  }

  return (
    <div className="rounded-lg border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold">Notes & comments</h3>

      <form onSubmit={handleSubmit} className="mb-4 space-y-3">
        <textarea
          className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Add an internal note or comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={addComment.isPending || !body.trim()}>
            {addComment.isPending ? "Saving..." : "Add comment"}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-muted-foreground">No comments yet.</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-md border p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                  {getInitials(comment.author)}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {comment.author?.full_name ?? comment.author?.email ?? "User"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDateTime(comment.created_at)}
                  </div>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground">{comment.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
