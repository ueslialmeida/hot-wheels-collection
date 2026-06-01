INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- ID padrão de instância local
    'a3b8c9d2-e4f5-6a7b-8c9d-0e1f2a3b4c5d',
    'authenticated',
    'authenticated',
    'autotester@localhost.com',
    crypt('Testing2026!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
)
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'a3b8c9d2-e4f5-6a7b-8c9d-0e1f2a3b4c5d',
    '{"sub": "a3b8c9d2-e4f5-6a7b-8c9d-0e1f2a3b4c5d", "email": "autotester@localhost.com"}',
    'email',
    'a3b8c9d2-e4f5-6a7b-8c9d-0e1f2a3b4c5d',
    now(),
    now(),
    now()
)
ON CONFLICT (provider, provider_id) DO UPDATE 
SET identity_data = EXCLUDED.identity_data;