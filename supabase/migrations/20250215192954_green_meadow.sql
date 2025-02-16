/*
  # Create test user

  1. Creates a test user with email and password
  2. Uses proper unique constraint handling
*/

DO $$ 
BEGIN
  -- Create test user with email and password if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'test@clearcom.ai'
  ) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin
    )
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'test@clearcom.ai',
      crypt('ClearCom2025!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      false
    );
  END IF;
END $$;