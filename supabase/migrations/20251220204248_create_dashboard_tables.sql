/*
  # Dashboard Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `ldap` (text, unique)
      - `full_name` (text)
      - `role` (text) - SME, QA, TL, Agent
      - `avatar_url` (text)
      - `status` (text) - online, offline, busy
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `content_library`
      - `id` (uuid, primary key)
      - `title` (text)
      - `category` (text) - Technical, Process, Product, Troubleshooting
      - `content` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `mock_calls`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `duration` (integer) - in seconds
      - `status` (text) - completed, in_progress, abandoned
      - `score` (integer) - 0-100
      - `created_at` (timestamptz)
    
    - `team_activity`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `activity_type` (text) - mock_call, content_added, ticket_raised
      - `description` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ldap text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'Agent',
  avatar_url text,
  status text DEFAULT 'offline',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Content library table
CREATE TABLE IF NOT EXISTS content_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all content"
  ON content_library FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert content"
  ON content_library FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own content"
  ON content_library FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Mock calls table
CREATE TABLE IF NOT EXISTS mock_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  duration integer DEFAULT 0,
  status text DEFAULT 'in_progress',
  score integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mock_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mock calls"
  ON mock_calls FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own mock calls"
  ON mock_calls FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own mock calls"
  ON mock_calls FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Team activity table
CREATE TABLE IF NOT EXISTS team_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  activity_type text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all team activity"
  ON team_activity FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert team activity"
  ON team_activity FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Insert sample data
INSERT INTO profiles (ldap, full_name, role, status) VALUES
  ('jsmith', 'John Smith', 'Agent', 'online'),
  ('mgarcia', 'Maria Garcia', 'SME', 'online'),
  ('rjohnson', 'Robert Johnson', 'QA', 'offline'),
  ('lwilliams', 'Lisa Williams', 'TL', 'busy')
ON CONFLICT (ldap) DO NOTHING;

INSERT INTO content_library (title, category, content, created_by) VALUES
  ('Google Ads Setup Guide', 'Technical', 'Complete guide for setting up Google Ads campaigns...', (SELECT id FROM profiles WHERE ldap = 'mgarcia' LIMIT 1)),
  ('Customer Escalation Process', 'Process', 'Steps to follow when escalating customer issues...', (SELECT id FROM profiles WHERE ldap = 'mgarcia' LIMIT 1)),
  ('Analytics Troubleshooting', 'Troubleshooting', 'Common Analytics issues and solutions...', (SELECT id FROM profiles WHERE ldap = 'mgarcia' LIMIT 1)),
  ('Product Features Overview', 'Product', 'Latest Google product features...', (SELECT id FROM profiles WHERE ldap = 'mgarcia' LIMIT 1))
ON CONFLICT DO NOTHING;