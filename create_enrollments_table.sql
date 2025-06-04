-- Create the PSLV_enrollments table

-- First, check if the table already exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name = 'PSLV_enrollments'
) as table_exists;

-- Drop the table if it exists (to ensure a clean state)
DROP TABLE IF EXISTS "PSLV_enrollments";

-- Create the enrollments table with correct structure
CREATE TABLE "PSLV_enrollments" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid UUID NOT NULL,
    course_id TEXT NOT NULL,
    course_name TEXT,
    price TEXT,
    enrolled_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT DEFAULT 'Active'
);

-- Enable RLS (Row Level Security)
ALTER TABLE "PSLV_enrollments" ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for development/testing
CREATE POLICY "Allow all operations on enrollments" 
ON "PSLV_enrollments" 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Insert a test enrollment (optional)
INSERT INTO "PSLV_enrollments" (userid, course_id, course_name, price, status)
VALUES 
('00000000-0000-0000-0000-000000000000', 'test-course', 'Test Course', '$199', 'Active');

-- Show confirmation message
SELECT 'PSLV_enrollments table created successfully!' as result;
