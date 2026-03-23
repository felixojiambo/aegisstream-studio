create table public.cases (
  id uuid primary key default gen_random_uuid(),
  external_ref text,
  title text not null,
  description text,
  status public.case_status not null default 'NEW',
  priority public.case_priority not null default 'MEDIUM',
  created_by uuid not null references auth.users(id) on delete restrict,
  assigned_agent_id uuid references auth.users(id) on delete set null,
  assigned_reviewer_id uuid references auth.users(id) on delete set null,
  tags text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.case_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  actor_user_id uuid references auth.users(id) on delete set null,
  occurred_at timestamptz not null default now()
);

create table public.case_comments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  author_user_id uuid not null references auth.users(id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  kind public.document_kind not null,
  case_id uuid references public.cases(id) on delete cascade,
  title text,
  document_type text not null,
  file_name text not null,
  storage_bucket text not null,
  storage_path text not null unique,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  processing_status public.document_processing_status not null default 'UPLOADED',
  processing_error text,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_kind_case_bucket_chk check (
    (
      kind = 'CASE'
      and case_id is not null
      and storage_bucket = 'case-documents'
    )
    or
    (
      kind = 'KNOWLEDGE'
      and case_id is null
      and storage_bucket = 'knowledge-documents'
    )
  )
);

create table public.document_processing_jobs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null unique references public.documents(id) on delete cascade,
  status public.processing_job_status not null default 'PENDING',
  attempt_count integer not null default 0 check (attempt_count >= 0),
  requested_by uuid references auth.users(id) on delete set null,
  last_error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  token_count integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table public.embeddings (
  id uuid primary key default gen_random_uuid(),
  chunk_id uuid not null unique references public.document_chunks(id) on delete cascade,
  model_name text not null,
  embedding extensions.vector(1536) not null,
  created_at timestamptz not null default now()
);

create table public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null unique references public.documents(id) on delete cascade,
  title text not null,
  category text,
  is_active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_cases_set_updated_at
before update on public.cases
for each row
execute procedure public.set_updated_at();

create trigger trg_case_comments_set_updated_at
before update on public.case_comments
for each row
execute procedure public.set_updated_at();

create trigger trg_documents_set_updated_at
before update on public.documents
for each row
execute procedure public.set_updated_at();

create trigger trg_document_processing_jobs_set_updated_at
before update on public.document_processing_jobs
for each row
execute procedure public.set_updated_at();

create trigger trg_knowledge_documents_set_updated_at
before update on public.knowledge_documents
for each row
execute procedure public.set_updated_at();
