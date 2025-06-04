-- SUPER SIMPLE FIX FOR CONTACT_US TABLE

-- Step 1: Drop the table to start fresh
DROP TABLE IF EXISTS pslv_contact_us;

-- Step 2: Create a new table with minimal structure
CREATE TABLE pslv_contact_us (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_on TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 3: Make sure RLS is enabled
ALTER TABLE pslv_contact_us ENABLE ROW LEVEL SECURITY;

-- Step 4: Add a single RLS policy that allows ANYONE to insert data
CREATE POLICY "Anyone can insert data" 
ON pslv_contact_us 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Step 5: Insert a test record
INSERT INTO pslv_contact_us (name, email, message)
VALUES ('Test User', 'test@example.com', 'This is a test record');

-- Step 6: Verify it worked
SELECT * FROM pslv_contact_us;
