create table if not exists public.retrieval_traces (
  id uuid primary key default uuid_generate_v4(),
  case_id uuid references public.cases(id) on delete set null,
  scope public.retrieval_scope not null,
  query_text text not null,
  top_k integer not null check (top_k > 0),
  filters jsonb not null default '{}'::jsonb,
  result_count integer not null default 0,
  results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists retrieval_traces_case_id_idx
on public.retrieval_traces(case_id);

create index if not exists retrieval_traces_scope_idx
on public.retrieval_traces(scope);

create index if not exists knowledge_documents_is_active_idx
on public.knowledge_documents(is_active);

create or replace function public.match_retrieval_chunks(
  query_embedding extensions.vector(1536),
  match_count integer,
  p_scope public.retrieval_scope,
  p_case_id uuid default null,
  p_filters jsonb default '{}'::jsonb
)
returns table (
  document_id uuid,
  chunk_id uuid,
  content text,
  score double precision,
  document_kind public.document_kind,
  case_id uuid,
  document_title text,
  storage_bucket text,
  storage_path text,
  metadata jsonb
)
language sql
stable
set search_path = public
as $$
  with filtered as (
    select
      d.id as document_id,
      dc.id as chunk_id,
      dc.content,
      1 - (e.embedding <=> query_embedding) as score,
      d.kind as document_kind,
      d.case_id,
      coalesce(d.title, d.file_name) as document_title,
      d.storage_bucket,
      d.storage_path,
      dc.metadata
    from public.embeddings e
    join public.document_chunks dc
      on dc.id = e.chunk_id
    join public.documents d
      on d.id = dc.document_id
    left join public.knowledge_documents kd
      on kd.document_id = d.id
    where
      (
        p_scope = 'CASE_ONLY'
        and d.kind = 'CASE'
        and p_case_id is not null
        and d.case_id = p_case_id
      )
      or
      (
        p_scope = 'KNOWLEDGE_ONLY'
        and d.kind = 'KNOWLEDGE'
        and kd.is_active = true
      )
      or
      (
        p_scope = 'COMBINED'
        and (
          (d.kind = 'CASE' and p_case_id is not null and d.case_id = p_case_id)
          or
          (d.kind = 'KNOWLEDGE' and kd.is_active = true)
        )
      )
  )
  select
    f.document_id,
    f.chunk_id,
    f.content,
    f.score,
    f.document_kind,
    f.case_id,
    f.document_title,
    f.storage_bucket,
    f.storage_path,
    f.metadata
  from filtered f
  order by f.score desc
  limit match_count;
$$;
