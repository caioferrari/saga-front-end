/*
  # Create Knowledge Base for AI Assistant

  1. New Tables
    - `knowledge_base`
      - `id` (uuid, primary key)
      - `title` (text) - Title of the article/FAQ
      - `question` (text) - The main question or topic
      - `answer` (text) - The detailed answer
      - `category` (text) - Category (e.g., "Technical", "Process", "Troubleshooting")
      - `tags` (text[]) - Array of tags for better searchability
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `knowledge_base` table
    - Add policy for authenticated users to read knowledge base
    - Add policy for authenticated users to insert/update knowledge base (for admins)
*/

CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'General',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read knowledge base (since it's for internal help)
CREATE POLICY "Anyone can read knowledge base"
  ON knowledge_base
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert knowledge base entries
CREATE POLICY "Authenticated users can insert knowledge base"
  ON knowledge_base
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update knowledge base entries
CREATE POLICY "Authenticated users can update knowledge base"
  ON knowledge_base
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster text search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_question ON knowledge_base USING gin(to_tsvector('english', question));
CREATE INDEX IF NOT EXISTS idx_knowledge_base_answer ON knowledge_base USING gin(to_tsvector('english', answer));
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING gin(tags);
