/*
  # Create portfolio data table

  1. New Tables
    - `portfolio_data`
      - `id` (uuid, primary key)
      - `data_type` (text) - Type of data (profile, projects, certificates, etc.)
      - `content` (jsonb) - The actual data content
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `portfolio_data` table
    - Add policy for public read access
    - Add policy for authenticated write access
*/

CREATE TABLE IF NOT EXISTS portfolio_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type text UNIQUE NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_data ENABLE ROW LEVEL SECURITY;

-- Allow public read access to portfolio data
CREATE POLICY "Allow public read access to portfolio data"
  ON portfolio_data
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert/update portfolio data
CREATE POLICY "Allow authenticated users to manage portfolio data"
  ON portfolio_data
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default data
INSERT INTO portfolio_data (data_type, content) VALUES
('profile', '{
  "name": "Pushpa Koirala",
  "title": "Automation & Robotics Engineer",
  "bio": "Passionate automation engineering student bridging technology and innovation through cutting-edge robotics solutions. Currently studying at JAMK University and specializing in PLC programming, industrial automation, and intelligent control systems.",
  "location": "Jyvaskyla, Finland",
  "profileImage": "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg",
  "skills": ["Python", "C#", "TIA Portal", "AutoCAD", "Blender", "UI/UX", "PLC Programming", "Industrial Automation"],
  "yearsExperience": "1+",
  "projectsCompleted": "5+",
  "socialLinks": {
    "github": "https://github.com/itzpushpa1715",
    "linkedin": "https://www.linkedin.com/in/pushpakoirala/",
    "email": "thepushpaco@outlook.com"
  }
}'),
('footer', '{
  "text": "© 2024 Pushpa Koirala. Crafted with passion in Jyvaskyla, Finland.",
  "links": [
    {"name": "Privacy Policy", "url": "/privacy"},
    {"name": "Terms of Service", "url": "/terms"}
  ]
}')
ON CONFLICT (data_type) DO NOTHING;