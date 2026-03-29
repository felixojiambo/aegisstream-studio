import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, BarChart3, BookOpen, ShieldCheck, Plug } from "lucide-react";

const adminSections = [
  { value: "prompts", label: "Prompts", icon: Bot, description: "Manage AI prompt templates, versions, and A/B configurations for case triage and copilot features." },
  { value: "evals", label: "Evals", icon: BarChart3, description: "View evaluation results, accuracy metrics, and model performance across case categories." },
  { value: "knowledge", label: "Knowledge Docs", icon: BookOpen, description: "Upload and manage knowledge base documents used by the AI copilot for case context." },
  { value: "governance", label: "Governance", icon: ShieldCheck, description: "Configure approval workflows, role permissions, audit policies, and compliance rules." },
  { value: "integrations", label: "Integrations", icon: Plug, description: "Manage connections to external systems — CRM, document stores, notification services, and APIs." },
] as const;

export default function AdminPage() {
  return (
    <div>
      <PageHeader
        title="Admin"
        description="Platform configuration, AI management, and governance controls."
      />

      <Tabs defaultValue="prompts" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto mb-6">
          {adminSections.map((section) => (
            <TabsTrigger
              key={section.value}
              value={section.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm text-muted-foreground data-[state=active]:text-foreground gap-1.5"
            >
              <section.icon className="h-3.5 w-3.5" />
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {adminSections.map((section) => (
          <TabsContent key={section.value} value={section.value}>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-card-foreground">{section.label}</h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
              <EmptyState
                icon={section.icon}
                title={`No ${section.label.toLowerCase()} configured`}
                description={`This section will contain the ${section.label.toLowerCase()} management interface.`}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
