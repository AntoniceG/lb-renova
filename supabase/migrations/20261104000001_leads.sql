-- Phase 5 : leads, historique, profils admin.
-- Toutes les écritures publiques passent par le serveur Next.js avec la clé service_role
-- (qui contourne la RLS). Les clés publiques (anon) n'ont AUCUN accès aux tables.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profils admin (utilisés par les politiques RLS et par l'admin de la phase 6)
-- ---------------------------------------------------------------------------
create table public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_profiles where user_id = (select auth.uid()));
$$;

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  ref_number bigint generated always as identity,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- 'incomplete' : demande non finalisée (option A : purgée après 30 jours).
  status text not null default 'new'
    check (status in ('incomplete', 'new', 'contacted', 'visit_planned', 'quote_sent', 'won', 'lost')),

  -- Projet
  project_type text not null check (char_length(project_type) between 1 and 60),
  postal_code text not null check (postal_code ~ '^[0-9]{5}$'),
  property_type text check (property_type in ('maison', 'appartement', 'immeuble', 'local', 'autre')),
  occupancy text check (occupancy in ('proprietaire', 'locataire', 'autre')),
  timeline text check (timeline in ('urgent', '1-3-mois', '3-6-mois', 'plus-tard', 'information')),
  description text check (char_length(description) <= 4000),

  -- Contact
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (phone ~ '^\+[0-9]{8,15}$'),
  email text not null check (char_length(email) <= 254),
  call_slot text check (call_slot in ('matin', 'apres-midi', 'soir', 'peu-importe')),

  -- RGPD
  consent_at timestamptz not null,
  consent_version text not null,

  -- Origine (aucune donnée personnelle : utm_*, page d'arrivée, référent)
  utm jsonb not null default '{}'::jsonb,
  landing_path text check (char_length(landing_path) <= 300),
  referrer text check (char_length(referrer) <= 500),

  -- Suivi des envois
  confirmation_email_sent_at timestamptz,
  notification_email_sent_at timestamptz,
  webhook_sent_at timestamptz,

  completed_at timestamptz
);

create index leads_status_created_idx on public.leads (status, created_at desc);
create index leads_email_created_idx on public.leads (lower(email), created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Historique d'un lead (création, envois, changements de statut, notes, appels)
-- ---------------------------------------------------------------------------
create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  type text not null
    check (type in ('created', 'email_sent', 'email_failed', 'webhook_sent', 'webhook_failed', 'status_changed', 'note', 'call')),
  data jsonb not null default '{}'::jsonb,
  actor uuid references auth.users (id) on delete set null
);

create index lead_events_lead_idx on public.lead_events (lead_id, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS : tout fermé, sauf lecture/écriture pour les administrateurs authentifiés
-- ---------------------------------------------------------------------------
alter table public.admin_profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_events enable row level security;

create policy admin_profiles_self_read on public.admin_profiles
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy leads_admin_all on public.leads
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy lead_events_admin_all on public.lead_events
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

revoke all on public.admin_profiles, public.leads, public.lead_events from anon;

-- ---------------------------------------------------------------------------
-- Conservation des données : à valider avec le client (TODO_CLIENT.md, RGPD)
--   - demandes incomplètes : 30 jours
--   - leads aboutis : 3 ans après la dernière mise à jour
-- ---------------------------------------------------------------------------
create or replace function public.purge_expired_leads()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  removed integer;
begin
  delete from public.leads
  where (status = 'incomplete' and updated_at < now() - interval '30 days')
     or (status <> 'incomplete' and updated_at < now() - interval '3 years');
  get diagnostics removed = row_count;
  return removed;
end;
$$;

revoke all on function public.purge_expired_leads() from public, anon, authenticated;
