-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow anon insert" ON users;
DROP POLICY IF EXISTS "Allow authenticated insert" ON users;

-- Create new policies for registration
CREATE POLICY "Allow anon insert" ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow anon to read users (for login)
CREATE POLICY "Allow anon select" ON users
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to update their own record
CREATE POLICY "Allow authenticated update own" ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);