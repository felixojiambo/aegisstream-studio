import type { ElementType } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  ClipboardCheck,
  Shield,
  Settings,
  Zap,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type UserRole = "agent" | "reviewer" | "admin";

interface NavItem {
  title: string;
  url: string;
  icon: ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["agent", "reviewer", "admin"],
  },
  {
    title: "Cases",
    url: "/cases",
    icon: FolderOpen,
    roles: ["agent", "reviewer", "admin"],
  },
  {
    title: "Review Queue",
    url: "/review-queue",
    icon: ClipboardCheck,
    roles: ["reviewer", "admin"],
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Shield,
    roles: ["admin"],
  },
];

const currentUserRole: UserRole = "admin";

function isRouteActive(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`);
}

export function AppSidebar() {
  const location = useLocation();

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(currentUserRole)
  );

  return (
    <Sidebar
      collapsible="none"
      className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex"
    >
      <SidebarContent className="flex-1 bg-sidebar">
        <SidebarGroup className="flex min-h-0 flex-1 flex-col">
          <SidebarGroupLabel className="mb-2 px-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-sidebar-primary">
                <Zap className="h-3.5 w-3.5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-sidebar-accent-foreground">
                AegisStream
              </span>
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent className="flex-1">
            <SidebarMenu>
              {filteredItems.map((item) => {
                const active = isRouteActive(location.pathname, item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink
                        to={item.url}
                        className={() =>
                          [
                            "flex w-full items-center gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            active &&
                              "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                          ]
                            .filter(Boolean)
                            .join(" ")
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isRouteActive(location.pathname, "/settings")}
            >
              <NavLink
                to="/settings"
                className={() =>
                  [
                    "flex w-full items-center gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isRouteActive(location.pathname, "/settings") &&
                      "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}




// import type { ElementType } from "react";
// import {
//   LayoutDashboard,
//   FolderOpen,
//   ClipboardCheck,
//   Shield,
//   Settings,
//   Zap,
// } from "lucide-react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import {
//   useCurrentUserAccess,
//   type AppRole,
// } from "@/features/auth/useCurrentUserAccess";
//
// interface NavItem {
//   title: string;
//   url: string;
//   icon: ElementType;
//   roles: AppRole[];
// }
//
// const navItems: NavItem[] = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: LayoutDashboard,
//     roles: ["case_agent", "reviewer", "admin", "knowledge_manager"],
//   },
//   {
//     title: "Cases",
//     url: "/cases",
//     icon: FolderOpen,
//     roles: ["case_agent", "reviewer", "admin"],
//   },
//   {
//     title: "Review Queue",
//     url: "/review-queue",
//     icon: ClipboardCheck,
//     roles: ["reviewer", "admin"],
//   },
//   {
//     title: "Admin",
//     url: "/admin",
//     icon: Shield,
//     roles: ["admin", "knowledge_manager"],
//   },
// ];
//
// function isRouteActive(pathname: string, url: string) {
//   return pathname === url || pathname.startsWith(`${url}/`);
// }
//
// export function AppSidebar() {
//   const location = useLocation();
//   const { data, isLoading, isError } = useCurrentUserAccess();
//
//   const currentRoles = data?.roles ?? [];
//
//   const filteredItems = navItems.filter((item) =>
//     item.roles.some((role) => currentRoles.includes(role))
//   );
//
//   return (
//     <Sidebar
//       collapsible="none"
//       className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex"
//     >
//       <SidebarContent className="flex-1 bg-sidebar">
//         <SidebarGroup className="flex min-h-0 flex-1 flex-col">
//           <SidebarGroupLabel className="mb-2 px-3">
//             <div className="flex items-center gap-2">
//               <div className="flex h-6 w-6 items-center justify-center rounded bg-sidebar-primary">
//                 <Zap className="h-3.5 w-3.5 text-sidebar-primary-foreground" />
//               </div>
//               <span className="text-sm font-semibold tracking-tight text-sidebar-accent-foreground">
//                 AegisStream
//               </span>
//             </div>
//           </SidebarGroupLabel>
//
//           <SidebarGroupContent className="flex-1">
//             {isLoading ? (
//               <div className="px-3 py-2 text-sm text-muted-foreground">
//                 Loading navigation...
//               </div>
//             ) : isError ? (
//               <div className="px-3 py-2 text-sm text-destructive">
//                 Failed to load navigation.
//               </div>
//             ) : (
//               <SidebarMenu>
//                 {filteredItems.map((item) => {
//                   const active = isRouteActive(location.pathname, item.url);
//
//                   return (
//                     <SidebarMenuItem key={item.title}>
//                       <SidebarMenuButton asChild isActive={active}>
//                         <NavLink
//                           to={item.url}
//                           className={() =>
//                             [
//                               "flex w-full items-center gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
//                               active &&
//                                 "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
//                             ]
//                               .filter(Boolean)
//                               .join(" ")
//                           }
//                         >
//                           <item.icon className="h-4 w-4" />
//                           <span>{item.title}</span>
//                         </NavLink>
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   );
//                 })}
//               </SidebarMenu>
//             )}
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//
//       <SidebarFooter className="mt-auto border-t border-sidebar-border bg-sidebar">
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               asChild
//               isActive={isRouteActive(location.pathname, "/settings")}
//             >
//               <NavLink
//                 to="/settings"
//                 className={() =>
//                   [
//                     "flex w-full items-center gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
//                     isRouteActive(location.pathname, "/settings") &&
//                       "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
//                   ]
//                     .filter(Boolean)
//                     .join(" ")
//                 }
//               >
//                 <Settings className="h-4 w-4" />
//                 <span>Settings</span>
//               </NavLink>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   );
// }
