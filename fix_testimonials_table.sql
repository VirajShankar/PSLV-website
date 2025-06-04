-- Fix the PSLV_testimonials table structure and policies

-- Step 1: Check if the table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'PSLV_testimonials';

-- Step 2: Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS PSLV_testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    course TEXT NOT NULL,
    text TEXT NOT NULL,
    submitted_on TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 3: Enable Row-Level Security (RLS) on the table
ALTER TABLE PSLV_testimonials ENABLE ROW LEVEL SECURITY;

-- Step 4: Add RLS policies

-- Allow authenticated users to insert testimonials
CREATE POLICY "Allow authenticated users to insert testimonials" 
ON PSLV_testimonials
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow anyone to view testimonials
CREATE POLICY "Allow anyone to view testimonials" 
ON PSLV_testimonials
FOR SELECT
USING (true);

-- Step 5: Verify the table structure and policies
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'PSLV_testimonials';

SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'PSLV_testimonials';
