import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export type AppRole =
  | "case_agent"
  | "reviewer"
  | "admin"
  | "knowledge_manager";

export interface CurrentUserAccess {
  userId: string | null;
  profile: {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  roles: AppRole[];
}

async function fetchCurrentUserAccess(): Promise<CurrentUserAccess> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const userId = session?.user?.id ?? null;

  if (!userId) {
    return {
      userId: null,
      profile: null,
      roles: [],
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      full_name,
      avatar_url,
      user_roles (
        roles (
          slug
        )
      )
    `)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    return {
      userId,
      profile: null,
      roles: [],
    };
  }

  const roles =
    data.user_roles
      ?.flatMap((userRole: any) =>
        userRole?.roles ? [userRole.roles.slug as AppRole] : []
      ) ?? [];

  return {
    userId,
    profile: {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
    },
    roles,
  };
}

export function useCurrentUserAccess() {
  return useQuery({
    queryKey: ["current-user-access"],
    queryFn: fetchCurrentUserAccess,
    staleTime: 60_000,
  });
}
