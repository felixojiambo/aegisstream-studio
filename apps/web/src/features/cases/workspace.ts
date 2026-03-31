import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export type CaseStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "NEEDS_INFO"
  | "TRIAGED"
  | "IN_REVIEW"
  | "APPROVED"
  | "RESOLVED"
  | "REJECTED";

export type CasePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface UserSummary {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export interface CaseRecord {
  id: string;
  external_ref: string | null;
  title: string;
  description: string | null;
  status: CaseStatus;
  priority: CasePriority;
  created_by: string;
  assigned_agent_id: string | null;
  assigned_reviewer_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  creator?: UserSummary | null;
  assigned_agent?: UserSummary | null;
  assigned_reviewer?: UserSummary | null;
}

export interface CaseCommentRecord {
  id: string;
  case_id: string;
  author_user_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  author?: UserSummary | null;
}

export interface CaseEventRecord {
  id: string;
  case_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  actor_user_id: string | null;
  occurred_at: string;
  actor?: UserSummary | null;
}

export interface CaseFilters {
  search?: string;
  status?: CaseStatus | "ALL";
  priority?: CasePriority | "ALL";
  sortBy?: "created_at" | "updated_at" | "title";
  sortDirection?: "asc" | "desc";
}

type CaseRow = {
  id: string;
  external_ref: string | null;
  title: string;
  description: string | null;
  status: CaseStatus;
  priority: CasePriority;
  created_by: string;
  assigned_agent_id: string | null;
  assigned_reviewer_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export const CASE_STATUS_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  NEW: ["IN_PROGRESS"],
  IN_PROGRESS: ["NEEDS_INFO", "TRIAGED"],
  NEEDS_INFO: ["IN_PROGRESS"],
  TRIAGED: ["IN_REVIEW"],
  IN_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["RESOLVED"],
  RESOLVED: [],
  REJECTED: [],
};

async function getCurrentUserId() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("No authenticated user found.");
  }

  return userId;
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function getInitials(user?: UserSummary | null) {
  const name = user?.full_name?.trim();

  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  const email = user?.email?.trim();
  if (email) return email.slice(0, 2).toUpperCase();

  return "U";
}

function attachUsersToCase(caseRow: CaseRow, users: UserSummary[]): CaseRecord {
  const byId = new Map(users.map((u) => [u.id, u]));

  return {
    ...caseRow,
    creator: byId.get(caseRow.created_by) ?? null,
    assigned_agent: caseRow.assigned_agent_id
      ? byId.get(caseRow.assigned_agent_id) ?? null
      : null,
    assigned_reviewer: caseRow.assigned_reviewer_id
      ? byId.get(caseRow.assigned_reviewer_id) ?? null
      : null,
  };
}

async function getDirectoryUsersByIds(userIds: string[]) {
  if (!userIds.length) return [] as UserSummary[];

  const uniqueIds = Array.from(new Set(userIds.filter(Boolean)));
  if (!uniqueIds.length) return [] as UserSummary[];

  const { data, error } = await supabase.rpc("directory_users_by_ids", {
    p_user_ids: uniqueIds,
  });

  if (error) throw error;
  return (data ?? []) as UserSummary[];
}

async function insertCaseEvent(params: {
  caseId: string;
  eventType: string;
  eventData?: Record<string, unknown>;
}) {
  const actorUserId = await getCurrentUserId();

  const { error } = await supabase.from("case_events").insert({
    case_id: params.caseId,
    event_type: params.eventType,
    event_data: params.eventData ?? {},
    actor_user_id: actorUserId,
  });

  if (error) throw error;
}

export async function listCases(filters: CaseFilters = {}) {
  let query = supabase.from("cases").select(`
      id,
      external_ref,
      title,
      description,
      status,
      priority,
      created_by,
      assigned_agent_id,
      assigned_reviewer_id,
      metadata,
      created_at,
      updated_at
    `);

  if (filters.search?.trim()) {
    const term = filters.search.trim();
    query = query.or(`title.ilike.%${term}%,external_ref.ilike.%${term}%`);
  }

  if (filters.status && filters.status !== "ALL") {
    query = query.eq("status", filters.status);
  }

  if (filters.priority && filters.priority !== "ALL") {
    query = query.eq("priority", filters.priority);
  }

  query = query.order(filters.sortBy ?? "updated_at", {
    ascending: filters.sortDirection === "asc",
  });

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as CaseRow[];

  const userIds = rows.flatMap((row) =>
    [row.created_by, row.assigned_agent_id, row.assigned_reviewer_id].filter(
      Boolean
    ) as string[]
  );

  const users = await getDirectoryUsersByIds(userIds);

  return rows.map((row) => attachUsersToCase(row, users));
}

export async function getCaseById(caseId: string) {
  const { data, error } = await supabase
    .from("cases")
    .select(`
      id,
      external_ref,
      title,
      description,
      status,
      priority,
      created_by,
      assigned_agent_id,
      assigned_reviewer_id,
      metadata,
      created_at,
      updated_at
    `)
    .eq("id", caseId)
    .single();

  if (error) throw error;

  const row = data as CaseRow;

  const users = await getDirectoryUsersByIds(
    [row.created_by, row.assigned_agent_id, row.assigned_reviewer_id].filter(
      Boolean
    ) as string[]
  );

  return attachUsersToCase(row, users);
}

export async function listCaseComments(caseId: string) {
  const { data, error } = await supabase
    .from("case_comments")
    .select(`
      id,
      case_id,
      author_user_id,
      body,
      created_at,
      updated_at
    `)
    .eq("case_id", caseId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as Array<{
    id: string;
    case_id: string;
    author_user_id: string;
    body: string;
    created_at: string;
    updated_at: string;
  }>;

  const users = await getDirectoryUsersByIds(rows.map((r) => r.author_user_id));
  const byId = new Map(users.map((u) => [u.id, u]));

  return rows.map((row) => ({
    ...row,
    author: byId.get(row.author_user_id) ?? null,
  })) as CaseCommentRecord[];
}

export async function listCaseEvents(caseId: string) {
  const { data, error } = await supabase
    .from("case_events")
    .select(`
      id,
      case_id,
      event_type,
      event_data,
      actor_user_id,
      occurred_at
    `)
    .eq("case_id", caseId)
    .order("occurred_at", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as Array<{
    id: string;
    case_id: string;
    event_type: string;
    event_data: Record<string, unknown>;
    actor_user_id: string | null;
    occurred_at: string;
  }>;

  const users = await getDirectoryUsersByIds(
    rows.map((r) => r.actor_user_id).filter(Boolean) as string[]
  );
  const byId = new Map(users.map((u) => [u.id, u]));

  return rows.map((row) => ({
    ...row,
    actor: row.actor_user_id ? byId.get(row.actor_user_id) ?? null : null,
  })) as CaseEventRecord[];
}

export async function listAssignableUsers(roleSlug: "case_agent" | "reviewer") {
  const { data, error } = await supabase.rpc("directory_users_by_role", {
    p_role_slug: roleSlug,
  });

  if (error) throw error;
  return (data ?? []) as UserSummary[];
}

export async function createCase(input: {
  title: string;
  description?: string;
  externalRef?: string;
  priority: CasePriority;
}) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("cases")
    .insert({
      title: input.title,
      description: input.description?.trim() || null,
      external_ref: input.externalRef?.trim() || null,
      priority: input.priority,
      status: "NEW",
      created_by: userId,
    })
    .select()
    .single();

  if (error) throw error;

  await insertCaseEvent({
    caseId: data.id,
    eventType: "CASE_CREATED",
    eventData: {
      status: "NEW",
      priority: input.priority,
    },
  });

  return data as CaseRecord;
}

export async function updateCaseDetails(
  caseId: string,
  updates: Partial<
    Pick<CaseRecord, "title" | "description" | "external_ref" | "priority">
  >
) {
  const { data, error } = await supabase
    .from("cases")
    .update({
      title: updates.title,
      description: updates.description,
      external_ref: updates.external_ref,
      priority: updates.priority,
    })
    .eq("id", caseId)
    .select()
    .single();

  if (error) throw error;

  await insertCaseEvent({
    caseId,
    eventType: "CASE_UPDATED",
    eventData: updates as Record<string, unknown>,
  });

  return data as CaseRecord;
}

export async function assignCaseUsers(params: {
  caseId: string;
  assignedAgentId: string | null;
  assignedReviewerId: string | null;
}) {
  const existing = await getCaseById(params.caseId);

  const { data, error } = await supabase
    .from("cases")
    .update({
      assigned_agent_id: params.assignedAgentId,
      assigned_reviewer_id: params.assignedReviewerId,
    })
    .eq("id", params.caseId)
    .select()
    .single();

  if (error) throw error;

  await insertCaseEvent({
    caseId: params.caseId,
    eventType: "ASSIGNMENT_CHANGED",
    eventData: {
      previous_agent_id: existing.assigned_agent_id,
      next_agent_id: params.assignedAgentId,
      previous_reviewer_id: existing.assigned_reviewer_id,
      next_reviewer_id: params.assignedReviewerId,
    },
  });

  return data as CaseRecord;
}

export async function transitionCaseStatus(params: {
  caseId: string;
  nextStatus: CaseStatus;
}) {
  const existing = await getCaseById(params.caseId);

  const allowedNextStatuses = CASE_STATUS_TRANSITIONS[existing.status] ?? [];
  if (!allowedNextStatuses.includes(params.nextStatus)) {
    throw new Error(`Invalid transition from ${existing.status} to ${params.nextStatus}`);
  }

  const { data, error } = await supabase
    .from("cases")
    .update({
      status: params.nextStatus,
    })
    .eq("id", params.caseId)
    .select()
    .single();

  if (error) throw error;

  await insertCaseEvent({
    caseId: params.caseId,
    eventType: "STATUS_CHANGED",
    eventData: {
      from_status: existing.status,
      to_status: params.nextStatus,
    },
  });

  return data as CaseRecord;
}

export async function addCaseComment(params: { caseId: string; body: string }) {
  const authorUserId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("case_comments")
    .insert({
      case_id: params.caseId,
      author_user_id: authorUserId,
      body: params.body.trim(),
    })
    .select()
    .single();

  if (error) throw error;

  await insertCaseEvent({
    caseId: params.caseId,
    eventType: "COMMENT_ADDED",
    eventData: {
      comment_id: data.id,
      preview: params.body.trim().slice(0, 120),
    },
  });

  return data as CaseCommentRecord;
}

export function canManageCaseFromUi(params: {
  roles: string[];
  userId: string | null;
  caseRecord: CaseRecord;
}) {
  const { roles, userId, caseRecord } = params;

  if (!userId) return false;
  if (roles.includes("admin")) return true;

  return (
    caseRecord.created_by === userId ||
    caseRecord.assigned_agent_id === userId ||
    caseRecord.assigned_reviewer_id === userId
  );
}

export function useCases(filters: CaseFilters) {
  return useQuery({
    queryKey: ["cases", filters],
    queryFn: () => listCases(filters),
  });
}

export function useCase(caseId?: string) {
  return useQuery({
    queryKey: ["case", caseId],
    queryFn: () => getCaseById(caseId!),
    enabled: Boolean(caseId),
  });
}

export function useCaseComments(caseId?: string) {
  return useQuery({
    queryKey: ["case-comments", caseId],
    queryFn: () => listCaseComments(caseId!),
    enabled: Boolean(caseId),
  });
}

export function useCaseEvents(caseId?: string) {
  return useQuery({
    queryKey: ["case-events", caseId],
    queryFn: () => listCaseEvents(caseId!),
    enabled: Boolean(caseId),
  });
}

export function useAssignableUsers(roleSlug: "case_agent" | "reviewer") {
  return useQuery({
    queryKey: ["assignable-users", roleSlug],
    queryFn: () => listAssignableUsers(roleSlug),
  });
}

export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast.success("Case created");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create case");
    },
  });
}

export function useUpdateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      caseId,
      updates,
    }: {
      caseId: string;
      updates: Parameters<typeof updateCaseDetails>[1];
    }) => updateCaseDetails(caseId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["case-events", variables.caseId] });
      toast.success("Case updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update case");
    },
  });
}

export function useAssignCaseUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignCaseUsers,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["case-events", variables.caseId] });
      toast.success("Assignments updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update assignments");
    },
  });
}

export function useTransitionCaseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transitionCaseStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["case-events", variables.caseId] });
      toast.success("Case status updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update case status");
    },
  });
}

export function useAddCaseComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCaseComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case-comments", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["case-events", variables.caseId] });
      toast.success("Comment added");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add comment");
    },
  });
}
