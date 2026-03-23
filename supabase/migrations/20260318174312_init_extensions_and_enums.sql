create extension if not exists vector with schema extensions;

create type public.case_status as enum (
  'NEW',
  'IN_PROGRESS',
  'NEEDS_INFO',
  'TRIAGED',
  'IN_REVIEW',
  'APPROVED',
  'RESOLVED',
  'REJECTED'
);

create type public.case_priority as enum (
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT'
);

create type public.document_kind as enum (
  'CASE',
  'KNOWLEDGE'
);

create type public.document_processing_status as enum (
  'UPLOADED',
  'PROCESSING',
  'FAILED',
  'READY'
);

create type public.processing_job_status as enum (
  'PENDING',
  'RUNNING',
  'FAILED',
  'COMPLETED'
);

create type public.retrieval_scope as enum (
  'CASE_ONLY',
  'KNOWLEDGE_ONLY',
  'COMBINED'
);

create type public.triage_run_status as enum (
  'PENDING',
  'COMPLETED',
  'FAILED'
);

create type public.review_action_type as enum (
  'APPROVE',
  'EDIT_APPROVE',
  'REJECT',
  'REQUEST_MORE_INFO'
);

create type public.review_subject_type as enum (
  'TRIAGE',
  'ANSWER',
  'INTEGRATION_ACTION'
);

create type public.review_queue_status as enum (
  'OPEN',
  'IN_PROGRESS',
  'CLOSED'
);

create type public.prompt_status as enum (
  'DRAFT',
  'APPROVED',
  'DEPRECATED'
);

create type public.prompt_purpose as enum (
  'GROUNDED_QA',
  'TRIAGE',
  'EVAL_SUPPORT'
);

create type public.eval_run_status as enum (
  'PENDING',
  'COMPLETED',
  'FAILED'
);

create type public.eval_run_type as enum (
  'GROUNDING',
  'TRIAGE',
  'REFUSAL',
  'SCHEMA',
  'REGRESSION'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
