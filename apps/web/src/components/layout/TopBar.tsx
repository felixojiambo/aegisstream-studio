import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUserAccess } from "@/features/auth/useCurrentUserAccess";

function getInitials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  if (email?.trim()) {
    return email.slice(0, 2).toUpperCase();
  }

  return "U";
}

export function TopBar() {
  const { data } = useCurrentUserAccess();

  const fullName = data?.profile?.full_name ?? null;
  const email = data?.profile?.email ?? null;
  const avatarUrl = data?.profile?.avatar_url ?? null;

  return (
    <header className="border-b bg-background px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="font-semibold">AegisStream Studio</div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {fullName ?? email ?? "User"}
            </div>
            {fullName && email ? (
              <div className="text-xs text-muted-foreground">{email}</div>
            ) : null}
          </div>

          <Avatar className="h-9 w-9 border">
            <AvatarImage
              src={avatarUrl ?? undefined}
              alt={fullName ?? email ?? "User"}
            />
            <AvatarFallback>{getInitials(fullName, email)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
