-- SUPER SIMPLE DATABASE SETUP FOR PSLV WEBSITE
-- Copy and paste ONLY THIS SCRIPT into your Supabase SQL Editor

-- Create PSLV_users table
CREATE TABLE IF NOT EXISTS PSLV_users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    course_interest TEXT,
    registered_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create PSLV_enrollments table with correct columns
CREATE TABLE IF NOT EXISTS PSLV_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid UUID NOT NULL,  -- FIXED: Using correct column name "userid" (no underscore)
    course_id TEXT NOT NULL,
    course_name TEXT,
    price TEXT,
    enrolled _on TIMESTAMP WITH TIME ZONE DEFAULT now(),  -- FIXED: Added space between enrolled and _on
    status TEXT DEFAULT 'Active'
);

-- Enable RLS but make it permissive
ALTER TABLE PSLV_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE PSLV_enrollments ENABLE ROW LEVEL SECURITY;

-- Create simple policies that allow all operations
CREATE POLICY "Allow all operations" ON PSLV_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON PSLV_enrollments FOR ALL USING (true) WITH CHECK (true);

-- Success message to verify the script worked
SELECT 'Tables created successfully! You can now register users with PSLV_ prefix.' as result;
