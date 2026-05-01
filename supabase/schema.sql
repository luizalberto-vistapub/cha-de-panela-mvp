create extension if not exists "pgcrypto";

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  couple_name text not null,
  short_description text not null,
  welcome_text text not null,
  event_date date not null,
  event_time text not null,
  event_place text not null,
  cover_image_url text not null,
  public_slug text not null unique,
  status text not null default 'ATIVO',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists guest_confirmations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  visitor_token text not null,
  name text not null,
  phone text not null,
  presence_confirmed boolean not null default true,
  confirmed_at timestamptz not null default now(),
  user_agent text,
  source text,
  duplicate_status text not null default 'NAO_ANALISADO',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, visitor_token)
);

create table if not exists gifts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  description text,
  category text,
  image_url text,
  reference_link text,
  display_order integer not null default 0,
  status text not null default 'DISPONIVEL',
  reserved_by_confirmation_id uuid references guest_confirmations(id) on delete set null,
  reserved_by_visitor_token text,
  reserved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gift_reservation_history (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  gift_id uuid not null references gifts(id) on delete cascade,
  confirmation_id uuid references guest_confirmations(id) on delete set null,
  visitor_token text,
  action text not null,
  performed_by text not null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists idx_guest_event_token on guest_confirmations(event_id, visitor_token);
create index if not exists idx_guest_event_phone on guest_confirmations(event_id, phone);
create index if not exists idx_gifts_event_status on gifts(event_id, status);
create index if not exists idx_gifts_reserved_token on gifts(event_id, reserved_by_visitor_token);

alter table events enable row level security;
alter table guest_confirmations enable row level security;
alter table gifts enable row level security;
alter table gift_reservation_history enable row level security;

create or replace function reserve_gift(p_slug text, p_gift_id uuid, p_visitor_token text)
returns table(success boolean, message text)
language plpgsql
as $$
declare
  v_event_id uuid;
  v_confirmation_id uuid;
  v_existing_gift uuid;
begin
  select id into v_event_id from events where public_slug = p_slug and status = 'ATIVO';
  if v_event_id is null then
    return query select false, 'Evento nao encontrado.';
    return;
  end if;

  select id into v_confirmation_id
  from guest_confirmations
  where event_id = v_event_id and visitor_token = p_visitor_token;

  if v_confirmation_id is null then
    return query select false, 'Confirme sua presenca antes de reservar.';
    return;
  end if;

  select id into v_existing_gift
  from gifts
  where event_id = v_event_id
    and reserved_by_confirmation_id = v_confirmation_id
    and status = 'RESERVADO'
  limit 1;

  if v_existing_gift is not null then
    return query select false, 'Voce ja tem um presente reservado.';
    return;
  end if;

  update gifts
  set status = 'RESERVADO',
      reserved_by_confirmation_id = v_confirmation_id,
      reserved_by_visitor_token = p_visitor_token,
      reserved_at = now(),
      updated_at = now()
  where id = p_gift_id
    and event_id = v_event_id
    and status = 'DISPONIVEL';

  if not found then
    return query select false, 'Esse presente acabou de ser escolhido por outra pessoa.';
    return;
  end if;

  insert into gift_reservation_history (
    event_id,
    gift_id,
    confirmation_id,
    visitor_token,
    action,
    performed_by
  )
  values (
    v_event_id,
    p_gift_id,
    v_confirmation_id,
    p_visitor_token,
    'RESERVADO',
    'CONVIDADO'
  );

  return query select true, 'Presente reservado com sucesso.';
end;
$$;
