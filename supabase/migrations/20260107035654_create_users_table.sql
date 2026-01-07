/*
  # Create users management table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `ldap` (text, unique) - User's LDAP identifier
      - `full_name` (text) - User's full name
      - `role` (text) - User role (SME, Agent, TL, QA, WFM)
      - `status` (text) - Account status (active, inactive)
      - `email` (text) - User's email address
      - `created_at` (timestamptz) - When user was created
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read all users
    - Add policy for admin users to manage users (for now, all authenticated can manage)
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ldap text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'Agent',
  status text NOT NULL DEFAULT 'active',
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for reading users
CREATE POLICY "Users can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for inserting users
CREATE POLICY "Authenticated users can create users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for updating users
CREATE POLICY "Authenticated users can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for deleting users
CREATE POLICY "Authenticated users can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_ldap ON users(ldap);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert sample data
INSERT INTO users (ldap, full_name, role, status, email) VALUES
  ('cferrari', 'Caio Ferrari', 'SME', 'active', 'cferrari@google.com'),
  ('jalvesribeiro', 'Juliana Alves Ribeiro', 'Agent', 'active', 'jalvesribeiro@google.com'),
  ('histyanailehts', 'Histyanailehts Garcia', 'Agent', 'active', 'histyanailehts@google.com'),
  ('ppdossantos', 'Patricia dos Santos', 'Agent', 'active', 'ppdossantos@google.com'),
  ('tzannis', 'Marcia Tzannis', 'Agent', 'active', 'tzannis@google.com'),
  ('xamary', 'Xamary Aponte', 'Agent', 'active', 'xamary@google.com'),
  ('marianaiara', 'Naiara Almeida', 'Agent', 'active', 'marianaiara@google.com'),
  ('agerlinzer', 'Aline Gerlinzer', 'Agent', 'active', 'agerlinzer@google.com'),
  ('estaba', 'Ana Valentina Estaba', 'Agent', 'active', 'estaba@google.com'),
  ('yabetha', 'Yabeth Alexandra Mejias Ascanio', 'Agent', 'active', 'yabetha@google.com'),
  ('yulic', 'Yuli Costa', 'QA', 'active', 'yulic@google.com'),
  ('oliveiramd', 'Mariana Oliveira', 'Agent', 'inactive', 'oliveiramd@google.com'),
  ('lindaperezvera', 'Rosa Linda Perez Vera', 'Agent', 'active', 'lindaperezvera@google.com'),
  ('silenny', 'Silenny Rojas', 'Agent', 'active', 'silenny@google.com'),
  ('vangeles', 'Angeles Victoria Guerra Azocar', 'Agent', 'active', 'vangeles@google.com'),
  ('decarvalholima', 'Thais de Carvalho Lima', 'Agent', 'active', 'decarvalholima@google.com'),
  ('johnsmith', 'John Smith', 'TL', 'active', 'johnsmith@google.com'),
  ('sarahjones', 'Sarah Jones', 'WFM', 'active', 'sarahjones@google.com')
ON CONFLICT (ldap) DO NOTHING;
