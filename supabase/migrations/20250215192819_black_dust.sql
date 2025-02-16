/*
  # Create access requests table

  1. New Tables
    - `access_requests`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `created_at` (timestamp with timezone)
      - `status` (text, default: 'pending')

  2. Security
    - Enable RLS on `access_requests` table
    - Add policy for service role to manage access requests
*/

CREATE TABLE IF NOT EXISTS access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage access requests
CREATE POLICY "Service role can manage access requests"
  ON access_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anyone to insert access requests
CREATE POLICY "Anyone can request access"
  ON access_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);