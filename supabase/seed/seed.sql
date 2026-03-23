insert into public.roles (slug, name, description)
values
  ('admin', 'Admin', 'Full governance and platform access'),
  ('case_agent', 'Case Agent', 'Handles case intake and operations'),
  ('reviewer', 'Reviewer', 'Reviews AI-assisted outputs'),
  ('knowledge_manager', 'Knowledge Manager', 'Manages prompts and knowledge sources')
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description;

insert into auth.users (id, email)
values
  ('11111111-1111-1111-1111-111111111111', 'admin@aegisstream.local'),
  ('22222222-2222-2222-2222-222222222222', 'agent@aegisstream.local'),
  ('33333333-3333-3333-3333-333333333333', 'reviewer@aegisstream.local'),
  ('44444444-4444-4444-4444-444444444444', 'outsider@aegisstream.local')
on conflict (id) do nothing;

update public.profiles
set full_name = case id
  when '11111111-1111-1111-1111-111111111111' then 'Local Admin'
  when '22222222-2222-2222-2222-222222222222' then 'Local Agent'
  when '33333333-3333-3333-3333-333333333333' then 'Local Reviewer'
  when '44444444-4444-4444-4444-444444444444' then 'Local Outsider'
  else full_name
end
where id in (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444'
);

insert into public.user_roles (user_id, role_id, assigned_by)
select
  '11111111-1111-1111-1111-111111111111',
  r.id,
  '11111111-1111-1111-1111-111111111111'
from public.roles r
where r.slug in ('admin', 'knowledge_manager')
on conflict do nothing;

insert into public.user_roles (user_id, role_id, assigned_by)
select
  '22222222-2222-2222-2222-222222222222',
  r.id,
  '11111111-1111-1111-1111-111111111111'
from public.roles r
where r.slug = 'case_agent'
on conflict do nothing;

insert into public.user_roles (user_id, role_id, assigned_by)
select
  '33333333-3333-3333-3333-333333333333',
  r.id,
  '11111111-1111-1111-1111-111111111111'
from public.roles r
where r.slug = 'reviewer'
on conflict do nothing;

insert into public.cases (
  id,
  external_ref,
  title,
  description,
  status,
  priority,
  created_by,
  assigned_agent_id,
  assigned_reviewer_id
)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'CASE-001',
  'Local seeded case',
  'Seeded case for RLS smoke tests',
  'IN_PROGRESS',
  'HIGH',
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
)
on conflict (id) do nothing;

insert into public.prompt_versions (
  id,
  name,
  purpose,
  version_label,
  status,
  model_name,
  system_prompt,
  schema_contract,
  created_by
)
values (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'default-triage',
  'TRIAGE',
  'v1',
  'APPROVED',
  'claude',
  'Seed prompt for local development',
  '{}'::jsonb,
  '11111111-1111-1111-1111-111111111111'
)
on conflict (id) do nothing;

insert into public.triage_runs (
  id,
  case_id,
  status,
  retrieval_scope,
  review_required,
  confidence,
  prompt_version_id,
  created_by
)
values (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'COMPLETED',
  'COMBINED',
  true,
  0.610,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '22222222-2222-2222-2222-222222222222'
)
on conflict (id) do nothing;

insert into public.triage_outputs (
  triage_run_id,
  summary,
  extracted_fields,
  missing_information,
  classification,
  routing_recommendation,
  draft_response,
  risk_flags,
  evidence_refs,
  output_payload
)
values (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Seeded triage output',
  '{"customer_name":"Example"}'::jsonb,
  '["Proof of address"]'::jsonb,
  'STANDARD',
  'Route to manual review',
  'Please provide proof of address.',
  '["LOW_CONFIDENCE"]'::jsonb,
  '[]'::jsonb,
  '{}'::jsonb
)
on conflict (triage_run_id) do nothing;

insert into public.review_queue (
  id,
  case_id,
  subject_type,
  subject_id,
  reason,
  status,
  assigned_reviewer_id,
  created_by
)
values (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'TRIAGE',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Seeded review item',
  'OPEN',
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222'
)
on conflict (id) do nothing;
