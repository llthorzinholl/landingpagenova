create table if not exists photo_checks (
  id bigserial primary key,
  full_name text not null,
  phone_number text not null,
  email_address text not null,
  material_location text not null,
  image_url text not null,
  image_pathname text,
  image_size_bytes integer,
  mime_type text,
  terms_accepted boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now()
);