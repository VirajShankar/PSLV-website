-- RLS (Row Level Security) policies for PSLV Website Tables
-- Run this in the Supabase SQL Editor

-- STEP 1: First, make sure the tables exist
-- If tables don't exist, create them with proper structure

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    course_interest TEXT,
    registered_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    course_id TEXT NOT NULL,
    course_name TEXT,
    price TEXT,
    enrolled_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT DEFAULT 'Active'
);

-- STEP 2: Enable RLS on tables but with policies that allow operations

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- TEMPORARY POLICY: Allow all operations for testing
CREATE POLICY "Allow all operations for now" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Enable RLS on enrollments table
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- TEMPORARY POLICY: Allow all operations for testing
CREATE POLICY "Allow all operations for now" ON enrollments
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- STEP 3: Later, replace with more secure policies
-- NOTE: Keep these commented until you're ready to implement proper security

/*
-- More secure policies for users table
DROP POLICY "Allow all operations for now" ON users;

CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can register" ON users
    FOR INSERT WITH CHECK (true);
    
-- More secure policies for enrollments table
DROP POLICY "Allow all operations for now" ON enrollments;

CREATE POLICY "Users can view own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON enrollments
    FOR UPDATE USING (auth.uid() = user_id);
*/
