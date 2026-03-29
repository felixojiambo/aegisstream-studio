// import { PageHeader } from "@/components/shared/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { User, Bell, Shield, Palette } from "lucide-react";
//
// export default function SettingsPage() {
//   return (
//     <div className="max-w-2xl">
//       <PageHeader title="Profile & Settings" description="Manage your account preferences and notification settings." />
//
//       {/* Profile Section */}
//       <div className="rounded-lg border bg-card p-6 mb-6">
//         <div className="flex items-center gap-3 mb-5">
//           <User className="h-4 w-4 text-muted-foreground" />
//           <h2 className="text-sm font-semibold text-card-foreground">Profile</h2>
//         </div>
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div className="space-y-2">
//             <Label htmlFor="name">Display Name</Label>
//             <Input id="name" defaultValue="Agent Smith" />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" defaultValue="agent@aegisstream.io" disabled />
//           </div>
//           <div className="space-y-2">
//             <Label>Role</Label>
//             <Input value="Case Agent" disabled className="text-muted-foreground" />
//           </div>
//           <div className="space-y-2">
//             <Label>Team</Label>
//             <Input value="Fraud Operations" disabled className="text-muted-foreground" />
//           </div>
//         </div>
//         <div className="mt-4 flex justify-end">
//           <Button size="sm">Save Changes</Button>
//         </div>
//       </div>
//
//       {/* Notifications */}
//       <div className="rounded-lg border bg-card p-6 mb-6">
//         <div className="flex items-center gap-3 mb-5">
//           <Bell className="h-4 w-4 text-muted-foreground" />
//           <h2 className="text-sm font-semibold text-card-foreground">Notifications</h2>
//         </div>
//         <div className="space-y-4">
//           {["Case assignments", "Review requests", "Escalations", "SLA warnings", "Document processing"].map((item) => (
//             <div key={item} className="flex items-center justify-between">
//               <span className="text-sm text-foreground">{item}</span>
//               <div className="flex items-center gap-3">
//                 <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
//                   <input type="checkbox" defaultChecked className="rounded border-border" /> Email
//                 </label>
//                 <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
//                   <input type="checkbox" defaultChecked className="rounded border-border" /> In-app
//                 </label>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//
//       {/* Security */}
//       <div className="rounded-lg border bg-card p-6">
//         <div className="flex items-center gap-3 mb-5">
//           <Shield className="h-4 w-4 text-muted-foreground" />
//           <h2 className="text-sm font-semibold text-card-foreground">Security</h2>
//         </div>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-sm font-medium text-foreground">Password</div>
//               <div className="text-xs text-muted-foreground">Last changed 30 days ago</div>
//             </div>
//             <Button variant="outline" size="sm">Change Password</Button>
//           </div>
//           <Separator />
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-sm font-medium text-foreground">Two-Factor Authentication</div>
//               <div className="text-xs text-muted-foreground">Adds an extra layer of security</div>
//             </div>
//             <Button variant="outline" size="sm">Enable</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  Shield,
  Palette,
  Mail,
  Briefcase,
  Building2,
  CheckCircle2,
} from "lucide-react";

const notificationItems = [
  {
    title: "Case assignments",
    description: "Get notified when a case is assigned to you.",
  },
  {
    title: "Review requests",
    description: "Alerts when a case needs your review.",
  },
  {
    title: "Escalations",
    description: "Immediate updates for escalated cases.",
  },
  {
    title: "SLA warnings",
    description: "Warnings when response time is at risk.",
  },
  {
    title: "Document processing",
    description: "Status updates for uploads and extraction jobs.",
  },
];

const preferenceItems = [
  {
    title: "Compact tables",
    description: "Show denser rows in case lists and review queues.",
    enabled: true,
  },
  {
    title: "Show AI confidence hints",
    description: "Display model confidence and review indicators.",
    enabled: true,
  },
  {
    title: "Sticky filters",
    description: "Keep list filters visible while scrolling.",
    enabled: false,
  },
];

export default function SettingsPage() {
  return (
    <div className="w-full max-w-6xl space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your profile, notifications, security, and workspace preferences."
      />

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <User className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-card-foreground">
                      Profile
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Update your personal details and view workspace info.
                    </p>
                  </div>
                </div>

                <div className="hidden rounded-full border bg-background px-3 py-1 text-xs font-medium text-foreground sm:flex sm:items-center sm:gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Active account
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" defaultValue="Agent Smith" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue="agent@aegisstream.io"
                      disabled
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="role"
                      value="Case Agent"
                      disabled
                      className="pl-9 text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team">Team</Label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="team"
                      value="Fraud Operations"
                      disabled
                      className="pl-9 text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Your role and team are managed by workspace administrators.
                </p>
                <div className="flex items-center gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-6 py-5">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">
                    Notifications
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Choose how you want to receive important updates.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="hidden grid-cols-[minmax(0,1fr)_120px_120px] gap-4 px-4 pb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
                <div>Event</div>
                <div>Email</div>
                <div>In-app</div>
              </div>

              <div className="space-y-3">
                {notificationItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border bg-background/60 p-4"
                  >
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px_120px] md:items-center">
                      <div>
                        <div className="font-medium text-foreground">
                          {item.title}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-border"
                        />
                        <span>Email</span>
                      </label>

                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-border"
                        />
                        <span>In-app</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-6 py-5">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">
                    Security
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Protect your account and sign-in access.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-xl border bg-background/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-foreground">Password</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Last changed 30 days ago
                    </div>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
              </div>

              <div className="rounded-xl border bg-background/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-foreground">
                      Two-Factor Authentication
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Add another verification step for extra protection.
                    </div>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </div>

              <Separator />

              <div className="rounded-xl bg-muted/40 p-4">
                <div className="text-sm font-medium text-foreground">
                  Session activity
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Last signed in from Nairobi, Kenya on Chrome for Windows.
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-6 py-5">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">
                    Workspace Preferences
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Tailor the interface to your daily workflow.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-6">
              {preferenceItems.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start justify-between gap-4 rounded-xl border bg-background/60 p-4"
                >
                  <div>
                    <div className="font-medium text-foreground">
                      {item.title}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      defaultChecked={item.enabled}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span>Enabled</span>
                  </label>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
