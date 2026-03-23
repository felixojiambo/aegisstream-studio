create or replace function public.has_role(role_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and lower(r.slug) = lower(role_name)
  );
$$;

create or replace function public.has_any_role(role_names text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and lower(r.slug) = any (
        select lower(x) from unnest(role_names) as x
      )
  );
$$;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.cases enable row level security;
alter table public.case_events enable row level security;
alter table public.case_comments enable row level security;
alter table public.documents enable row level security;
alter table public.document_processing_jobs enable row level security;
alter table public.document_chunks enable row level security;
alter table public.embeddings enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.prompt_versions enable row level security;
alter table public.eval_runs enable row level security;
alter table public.qna_interactions enable row level security;
alter table public.triage_runs enable row level security;
alter table public.triage_outputs enable row level security;
alter table public.review_queue enable row level security;
alter table public.reviews enable row level security;
alter table public.audit_events enable row level security;
create or replace function public.can_manage_governance()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(array['admin', 'knowledge_manager']);
$$;

create or replace function public.can_access_case(target_case_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.cases c
    where c.id = target_case_id
      and (
        c.created_by = auth.uid()
        or c.assigned_agent_id = auth.uid()
        or c.assigned_reviewer_id = auth.uid()
        or public.has_any_role(array['admin', 'knowledge_manager'])
      )
  );
$$;

create or replace function public.can_edit_case(target_case_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.cases c
    where c.id = target_case_id
      and (
        c.created_by = auth.uid()
        or c.assigned_agent_id = auth.uid()
        or public.has_role('admin')
      )
  );
$$;

create or replace function public.can_review_case(target_case_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.cases c
    where c.id = target_case_id
      and (
        c.assigned_reviewer_id = auth.uid()
        or public.has_any_role(array['reviewer', 'admin'])
      )
  );
$$;
create policy profiles_select_self_or_admin
on public.profiles
for select
to authenticated
using ((id = (select auth.uid())) or public.has_role('admin'));

create policy profiles_update_self_or_admin
on public.profiles
for update
to authenticated
using ((id = (select auth.uid())) or public.has_role('admin'))
with check ((id = (select auth.uid())) or public.has_role('admin'));

create policy roles_select_authenticated
on public.roles
for select
to authenticated
using (true);

create policy user_roles_select_own_or_admin
on public.user_roles
for select
to authenticated
using ((user_id = (select auth.uid())) or public.has_role('admin'));

create policy user_roles_admin_manage
on public.user_roles
for all
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy cases_select_accessible
on public.cases
for select
to authenticated
using (public.can_access_case(id));

create policy cases_insert_agents_reviewers_admin
on public.cases
for insert
to authenticated
with check (
  public.has_any_role(array['case_agent','reviewer','admin'])
  and created_by = (select auth.uid())
);

create policy cases_update_editable
on public.cases
for update
to authenticated
using (public.can_edit_case(id) or public.can_review_case(id))
with check (public.can_edit_case(id) or public.can_review_case(id));

create policy case_events_select_accessible
on public.case_events
for select
to authenticated
using (public.can_access_case(case_id));

create policy case_events_insert_editable
on public.case_events
for insert
to authenticated
with check (public.can_edit_case(case_id));

create policy case_comments_select_accessible
on public.case_comments
for select
to authenticated
using (public.can_access_case(case_id));

create policy case_comments_insert_editable
on public.case_comments
for insert
to authenticated
with check (
  public.can_edit_case(case_id)
  and author_user_id = (select auth.uid())
);

create policy case_comments_update_own_or_admin
on public.case_comments
for update
to authenticated
using (
  author_user_id = (select auth.uid())
  or public.has_role('admin')
)
with check (
  author_user_id = (select auth.uid())
  or public.has_role('admin')
);

create policy documents_select_accessible
on public.documents
for select
to authenticated
using (
  (kind = 'CASE' and public.can_access_case(case_id))
  or
  (
    kind = 'KNOWLEDGE'
    and exists (
      select 1
      from public.knowledge_documents kd
      where kd.document_id = documents.id
        and (kd.is_active or public.can_manage_governance())
    )
  )
);

create policy documents_insert_allowed
on public.documents
for insert
to authenticated
with check (
  (kind = 'CASE' and public.can_edit_case(case_id))
  or
  (kind = 'KNOWLEDGE' and public.can_manage_governance())
);

create policy documents_update_allowed
on public.documents
for update
to authenticated
using (
  (kind = 'CASE' and public.can_edit_case(case_id))
  or
  (kind = 'KNOWLEDGE' and public.can_manage_governance())
)
with check (
  (kind = 'CASE' and public.can_edit_case(case_id))
  or
  (kind = 'KNOWLEDGE' and public.can_manage_governance())
);

create policy document_processing_jobs_select_accessible
on public.document_processing_jobs
for select
to authenticated
using (
  exists (
    select 1
    from public.documents d
    where d.id = document_processing_jobs.document_id
      and (
        (d.kind = 'CASE' and public.can_access_case(d.case_id))
        or
        (d.kind = 'KNOWLEDGE' and public.can_manage_governance())
      )
  )
);

create policy document_chunks_select_accessible
on public.document_chunks
for select
to authenticated
using (
  exists (
    select 1
    from public.documents d
    where d.id = document_chunks.document_id
      and (
        (d.kind = 'CASE' and public.can_access_case(d.case_id))
        or
        (d.kind = 'KNOWLEDGE' and public.can_manage_governance())
      )
  )
);

create policy embeddings_select_accessible
on public.embeddings
for select
to authenticated
using (
  exists (
    select 1
    from public.document_chunks dc
    join public.documents d on d.id = dc.document_id
    where dc.id = embeddings.chunk_id
      and (
        (d.kind = 'CASE' and public.can_access_case(d.case_id))
        or
        (d.kind = 'KNOWLEDGE' and public.can_manage_governance())
      )
  )
);

create policy knowledge_documents_select_active_or_governance
on public.knowledge_documents
for select
to authenticated
using (is_active or public.can_manage_governance());

create policy knowledge_documents_manage_governance
on public.knowledge_documents
for all
to authenticated
using (public.can_manage_governance())
with check (public.can_manage_governance());

create policy prompt_versions_governance_select
on public.prompt_versions
for select
to authenticated
using (public.can_manage_governance());

create policy prompt_versions_governance_manage
on public.prompt_versions
for all
to authenticated
using (public.can_manage_governance())
with check (public.can_manage_governance());

create policy eval_runs_governance_select
on public.eval_runs
for select
to authenticated
using (public.can_manage_governance());

create policy eval_runs_governance_manage
on public.eval_runs
for all
to authenticated
using (public.can_manage_governance())
with check (public.can_manage_governance());

create policy qna_interactions_select_accessible
on public.qna_interactions
for select
to authenticated
using (
  (case_id is null and asked_by = (select auth.uid()))
  or
  (case_id is not null and public.can_access_case(case_id))
);

create policy qna_interactions_insert_own
on public.qna_interactions
for insert
to authenticated
with check (
  asked_by = (select auth.uid())
  and (
    case_id is null
    or public.can_access_case(case_id)
  )
);

create policy triage_runs_select_accessible
on public.triage_runs
for select
to authenticated
using (public.can_access_case(case_id));

create policy triage_runs_insert_editable
on public.triage_runs
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and public.can_edit_case(case_id)
);

create policy triage_outputs_select_accessible
on public.triage_outputs
for select
to authenticated
using (
  exists (
    select 1
    from public.triage_runs tr
    where tr.id = triage_outputs.triage_run_id
      and public.can_access_case(tr.case_id)
  )
);

create policy review_queue_select_reviewers_or_admin
on public.review_queue
for select
to authenticated
using (
  public.can_review_case(case_id)
  or public.has_role('admin')
);

create policy review_queue_manage_reviewers_or_admin
on public.review_queue
for all
to authenticated
using (
  public.can_review_case(case_id)
  or public.has_role('admin')
)
with check (
  public.can_review_case(case_id)
  or public.has_role('admin')
);

create policy reviews_select_reviewers_or_admin
on public.reviews
for select
to authenticated
using (
  public.can_review_case(case_id)
  or public.has_role('admin')
);

create policy reviews_insert_reviewers_or_admin
on public.reviews
for insert
to authenticated
with check (
  reviewer_id = (select auth.uid())
  and (public.can_review_case(case_id) or public.has_role('admin'))
);

create policy audit_events_governance_select
on public.audit_events
for select
to authenticated
using (public.can_manage_governance() or public.has_role('admin'));

create policy audit_events_governance_manage
on public.audit_events
for all
to authenticated
using (public.can_manage_governance() or public.has_role('admin'))
with check (public.can_manage_governance() or public.has_role('admin'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'case-documents',
    'case-documents',
    false,
    20971520,
    array['application/pdf', 'image/png', 'image/jpeg', 'text/plain']
  ),
  (
    'knowledge-documents',
    'knowledge-documents',
    false,
    20971520,
    array['application/pdf', 'text/plain', 'text/markdown']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy storage_case_documents_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'case-documents'
  and exists (
    select 1
    from public.documents d
    where d.storage_bucket = bucket_id
      and d.storage_path = name
      and d.kind = 'CASE'
      and public.can_access_case(d.case_id)
  )
);

create policy storage_case_documents_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'case-documents'
  and public.has_any_role(array['case_agent','reviewer','admin'])
  and public.can_edit_case(((storage.foldername(name))[1])::uuid)
);

create policy storage_knowledge_documents_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'knowledge-documents'
  and exists (
    select 1
    from public.documents d
    join public.knowledge_documents kd on kd.document_id = d.id
    where d.storage_bucket = bucket_id
      and d.storage_path = name
      and (kd.is_active or public.can_manage_governance())
  )
);

create policy storage_knowledge_documents_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'knowledge-documents'
  and public.can_manage_governance()
);
