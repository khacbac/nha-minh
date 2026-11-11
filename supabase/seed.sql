-- Local stack only (`pnpm db:reset`): the family account to sign in with on a dev build.
-- Email nha@example.com, password nhaminh123. Production gets its account by hand
-- (dev/guides/backend.md §1).
do $$
declare
  uid uuid := '6e1d9d2a-0000-4000-8000-000000000001';
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
    'nha@example.com', extensions.crypt('nhaminh123', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(),
    '', '', '', ''
  );
  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), uid, uid::text,
    jsonb_build_object('sub', uid::text, 'email', 'nha@example.com', 'email_verified', true),
    'email', now(), now(), now()
  );
end $$;
