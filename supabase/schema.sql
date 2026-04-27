-- Jastip Agent production database schema.
-- Run this in Supabase SQL Editor if you want persistent hosted storage.

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('BUYER', 'JASTIPER')),
  name text not null,
  wallet_address text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  chain_order_id text,
  buyer_wallet text not null,
  jastiper_wallet text,
  item_name text not null,
  brand text not null,
  model text not null,
  color text not null,
  size text not null,
  destination_country text not null check (destination_country in ('Japan', 'Korea', 'Singapore')),
  target_store text not null,
  estimated_local_price numeric not null,
  estimated_idr_price numeric not null,
  max_budget_idr numeric not null,
  service_fee_percent numeric not null,
  platform_fee_percent numeric not null default 3,
  escrow_amount_idr numeric not null,
  escrow_breakdown jsonb not null,
  reference_photo_url text,
  receipt_photo_url text,
  item_photo_url text,
  additional_item_photo_url text,
  status text not null check (status in ('CREATED', 'ACCEPTED', 'VERIFIED', 'RELEASED', 'DISPUTED', 'REFUNDED')),
  verification_report_id text,
  tx_hashes jsonb,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  verified_at timestamptz,
  auto_release_at timestamptz
);

create table if not exists public.verification_reports (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  store_verified boolean not null,
  store_name text not null,
  item_match_confidence numeric not null,
  item_notes text not null,
  price_amount_idr numeric not null,
  price_within_budget boolean not null,
  date_valid boolean not null,
  fraud_risk_score numeric not null,
  fraud_flags text[] not null default '{}',
  overall_status text not null check (overall_status in ('APPROVED', 'FLAGGED', 'REJECTED')),
  raw_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_reputations (
  id text primary key,
  wallet_address text not null unique,
  agent_id text not null unique,
  metadata_uri text,
  completed_orders integer not null default 0,
  disputed_orders integer not null default 0,
  average_verification_score numeric not null default 0,
  trust_score numeric not null default 0
);

create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_buyer_wallet_idx on public.orders(buyer_wallet);
create index if not exists orders_jastiper_wallet_idx on public.orders(jastiper_wallet);
create index if not exists verification_reports_order_id_idx on public.verification_reports(order_id);
