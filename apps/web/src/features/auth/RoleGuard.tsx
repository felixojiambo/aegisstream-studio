import { Navigate } from "react-router-dom";
import {
  useCurrentUserAccess,
  type AppRole,
} from "@/features/auth/useCurrentUserAccess";

export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: AppRole[];
  children: React.ReactNode;
}) {
  const { data, isLoading } = useCurrentUserAccess();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const roles = data?.roles ?? [];
  const allowed = allowedRoles.some((role) => roles.includes(role));

  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
