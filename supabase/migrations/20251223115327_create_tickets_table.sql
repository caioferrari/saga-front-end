/*
  # Create Tickets Table

  1. New Tables
    - `tickets`
      - `id` (uuid, primary key)
      - `case_id` (text) - Customer case identifier
      - `case_type` (text) - Type of case: "Shopping" or "Tagging"
      - `priority` (text) - Priority level: "Gold" or "Silver"
      - `team` (text) - Assigned team: "SME" or "QA"
      - `on_call` (boolean) - Whether on-call status is active
      - `problem_description` (text) - Detailed problem description
      - `user_id` (uuid) - Reference to authenticated user
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `tickets` table
    - Add policy for authenticated users to create tickets
    - Add policy for authenticated users to read their own tickets
    - Add policy for authenticated users to update their own tickets
*/

CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id text NOT NULL,
  case_type text NOT NULL CHECK (case_type IN ('Shopping', 'Tagging')),
  priority text NOT NULL CHECK (priority IN ('Gold', 'Silver')),
  team text NOT NULL CHECK (team IN ('SME', 'QA')),
  on_call boolean DEFAULT false,
  problem_description text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tickets"
  ON tickets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS tickets_user_id_idx ON tickets(user_id);
CREATE INDEX IF NOT EXISTS tickets_created_at_idx ON tickets(created_at);
