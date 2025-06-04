-- DEFINITIVE FIX FOR ENROLLMENTS TABLE
-- This script addresses case sensitivity issues with the table name

-- Step 1: Drop both possible tables to ensure clean slate
DROP TABLE IF EXISTS "pslv_enrollments";
DROP TABLE IF EXISTS "PSLV_enrollments";

-- Step 2: Create the table with UPPERCASE name - use double quotes to preserve case
CREATE TABLE "PSLV_enrollments" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid UUID NOT NULL,
    course_id TEXT NOT NULL,
    course_name TEXT,
    price TEXT,
    enrolled_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT DEFAULT 'Active'
);

-- Step 3: Enable RLS (Row Level Security)
ALTER TABLE "PSLV_enrollments" ENABLE ROW LEVEL SECURITY;

-- Step 4: Create a permissive policy for development
CREATE POLICY "Allow all operations on enrollments" 
ON "PSLV_enrollments" 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Step 5: Insert a test record to verify it works
INSERT INTO "PSLV_enrollments" (userid, course_id, course_name, price, status)
VALUES 
('00000000-0000-0000-0000-000000000000', 'test-course', 'Test Course', '$199', 'Active');

-- Success message
SELECT 'PSLV_enrollments table created successfully with UPPERCASE name!' as result;
