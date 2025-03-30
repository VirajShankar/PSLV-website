-- Fix the column name issue in the PSLV_enrollments table

-- First, check the current structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pslv_enrollments';

-- Create a new table with the correct column name
CREATE TABLE IF NOT EXISTS pslv_enrollments_fixed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid UUID NOT NULL,
    course_id TEXT NOT NULL,
    course_name TEXT,
    price TEXT,
    enrolled_on TIMESTAMP WITH TIME ZONE DEFAULT now(), -- Fixed: No space in column name
    status TEXT DEFAULT 'Active'
);

-- Copy data from the old table to the new one (if the old table exists)
INSERT INTO pslv_enrollments_fixed (id, userid, course_id, course_name, price, status)
SELECT id, userid, course_id, course_name, price, status
FROM pslv_enrollments;

-- Update the enrolled_on column with current timestamp for existing records
UPDATE pslv_enrollments_fixed SET enrolled_on = now();

-- Drop the old table
DROP TABLE IF EXISTS pslv_enrollments;

-- Rename the new table to the original name
ALTER TABLE pslv_enrollments_fixed RENAME TO pslv_enrollments;

-- Enable RLS on the fixed table
ALTER TABLE pslv_enrollments ENABLE ROW LEVEL SECURITY;

-- Re-create the RLS policies
CREATE POLICY "Allow all operations" ON pslv_enrollments FOR ALL USING (true) WITH CHECK (true);

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pslv_enrollments';
