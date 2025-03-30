-- COMPLETE FIX FOR PSLV_contact_us TABLE
-- Run this exact script in your Supabase SQL editor

-- Step 1: Drop the table if it exists to solve any structure issues
DROP TABLE IF EXISTS PSLV_contact_us;

-- Step 2: Create the table with the exact structure needed
CREATE TABLE PSLV_contact_us (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_on TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 3: Enable Row Level Security
ALTER TABLE PSLV_contact_us ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies with the widest permissions for now
-- This allows anyone (even anonymous users) to insert records
CREATE POLICY "Allow anyone to insert contact records" 
ON PSLV_contact_us
FOR INSERT 
TO anon
WITH CHECK (true);

-- This allows the service role to read all records
CREATE POLICY "Allow service role to read all contact records" 
ON PSLV_contact_us
FOR SELECT 
TO service_role
USING (true);

-- Step 5: Add a test record to verify everything works
INSERT INTO PSLV_contact_us (name, email, message) 
VALUES ('Test User', 'test@example.com', 'This is a test message to verify the table is working.');

-- Step 6: Display success message
SELECT 'Contact Us table created successfully with correct policies!' as result;
