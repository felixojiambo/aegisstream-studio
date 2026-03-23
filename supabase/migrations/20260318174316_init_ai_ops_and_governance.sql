create table public.prompt_versions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  purpose public.prompt_purpose not null,
  version_label text not null,
  status public.prompt_status not null default 'DRAFT',
  model_name text not null default 'claude',
  system_prompt text not null,
  schema_contract jsonb not null default '{}'::jsonb,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, version_label)
);

create table public.eval_runs (
  id uuid primary key default gen_random_uuid(),
  prompt_version_id uuid not null references public.prompt_versions(id) on delete cascade,
  dataset_name text not null,
  run_type public.eval_run_type not null,
  status public.eval_run_status not null default 'PENDING',
  total_cases integer not null default 0,
  passed_cases integer not null default 0,
  failed_cases integer not null default 0,
  summary_metrics jsonb not null default '{}'::jsonb,
  report_path text,
  triggered_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.qna_interactions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  question text not null,
  retrieval_scope public.retrieval_scope not null,
  answer text,
  confidence numeric(4,3) check (confidence >= 0 and confidence <= 1),
  refusal_reason text,
  citations jsonb not null default '[]'::jsonb,
  missing_context_questions jsonb not null default '[]'::jsonb,
  prompt_version_id uuid references public.prompt_versions(id) on delete set null,
  asked_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.triage_runs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  status public.triage_run_status not null default 'PENDING',
  retrieval_scope public.retrieval_scope not null default 'COMBINED',
  review_required boolean not null default true,
  confidence numeric(4,3) check (confidence >= 0 and confidence <= 1),
  prompt_version_id uuid not null references public.prompt_versions(id) on delete restrict,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.triage_outputs (
  triage_run_id uuid primary key references public.triage_runs(id) on delete cascade,
  summary text,
  extracted_fields jsonb not null default '{}'::jsonb,
  missing_information jsonb not null default '[]'::jsonb,
  classification text,
  routing_recommendation text,
  draft_response text,
  risk_flags jsonb not null default '[]'::jsonb,
  evidence_refs jsonb not null default '[]'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.review_queue (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  subject_type public.review_subject_type not null,
  subject_id uuid not null,
  reason text not null,
  status public.review_queue_status not null default 'OPEN',
  assigned_reviewer_id uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_type, subject_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  review_queue_id uuid references public.review_queue(id) on delete set null,
  subject_type public.review_subject_type not null,
  subject_id uuid not null,
  reviewer_id uuid not null references auth.users(id) on delete restrict,
  action public.review_action_type not null,
  comment text,
  diff_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create trigger trg_prompt_versions_set_updated_at
before update on public.prompt_versions
for each row
execute procedure public.set_updated_at();

create trigger trg_eval_runs_set_updated_at
before update on public.eval_runs
for each row
execute procedure public.set_updated_at();

create trigger trg_triage_runs_set_updated_at
before update on public.triage_runs
for each row
execute procedure public.set_updated_at();

create trigger trg_triage_outputs_set_updated_at
before update on public.triage_outputs
for each row
execute procedure public.set_updated_at();

create trigger trg_review_queue_set_updated_at
before update on public.review_queue
for each row
execute procedure public.set_updated_at();
