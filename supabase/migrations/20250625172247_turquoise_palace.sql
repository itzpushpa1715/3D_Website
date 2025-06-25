/*
  # Fix RLS Policies for Admin Operations

  1. Security Updates
    - Update RLS policies to allow anonymous users to perform admin operations
    - This is for development/demo purposes - in production, use proper authentication
    - Allow anonymous users to create, read, update portfolio data
    - Allow anonymous users to upload and access images in storage

  2. Storage Policies
    - Create policies for portfolio-images bucket
    - Allow anonymous users to upload and view images
*/

-- Update portfolio_data table policies to allow anonymous operations
DROP POLICY IF EXISTS "Allow authenticated users to manage portfolio data" ON portfolio_data;
DROP POLICY IF EXISTS "Allow public read access to portfolio data" ON portfolio_data;

-- Create new policies that allow anonymous users to perform all operations
CREATE POLICY "Allow anonymous users full access to portfolio data"
  ON portfolio_data
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure the portfolio-images storage bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('portfolio-images', 'portfolio-images', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the portfolio-images bucket
-- Allow anonymous users to upload images
CREATE POLICY "Allow anonymous users to upload images"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'portfolio-images');

-- Allow anonymous users to view images
CREATE POLICY "Allow anonymous users to view images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated, public
  USING (bucket_id = 'portfolio-images');

-- Allow anonymous users to update images
CREATE POLICY "Allow anonymous users to update images"
  ON storage.objects
  FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'portfolio-images')
  WITH CHECK (bucket_id = 'portfolio-images');

-- Allow anonymous users to delete images
CREATE POLICY "Allow anonymous users to delete images"
  ON storage.objects
  FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'portfolio-images');