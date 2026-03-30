import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CaseListPage from "./pages/CaseListPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import ReviewQueuePage from "./pages/ReviewQueuePage";
import AdminPage from "./pages/AdminPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import {ProfilePage} from "./pages/ProfilePage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cases" element={<CaseListPage />} />
            <Route path="/cases/:caseId" element={<CaseDetailPage />} />
            <Route path="/review-queue" element={<ReviewQueuePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/settings" element={<SettingsPage />} />
{/*            <Route*/}
{/*  path="/review-queue"*/}
{/*  element={*/}
{/*    <RoleGuard allowedRoles={["reviewer", "admin"]}>*/}
{/*      <ReviewQueuePage />*/}
{/*    </RoleGuard>*/}
{/*  }*/}
{/*/>*/}

{/*<Route*/}
{/*  path="/admin"*/}
{/*  element={*/}
{/*    <RoleGuard allowedRoles={["admin", "knowledge_manager"]}>*/}
{/*      <AdminPage />*/}
{/*    </RoleGuard>*/}
{/*  }*/}
{/*/>*/}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
