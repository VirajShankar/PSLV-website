-- Row Level Security Setup for PSLV Website Tables

----------------------------------------------
-- STEP 1: USERS TABLE RLS
----------------------------------------------

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile only
CREATE POLICY "Users can view own data" ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Allow users to update their own profile only
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Allow insertion during registration (anyone can register)
CREATE POLICY "Anyone can register" ON users
    FOR INSERT
    WITH CHECK (true);

----------------------------------------------
-- STEP 2: COURSES TABLE RLS
----------------------------------------------

-- Enable RLS on courses table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view courses (even anonymous users)
CREATE POLICY "Anyone can view courses" ON courses
    FOR SELECT
    USING (true);

-- Only admins can modify courses
CREATE POLICY "Only admins can modify courses" ON courses
    FOR INSERT UPDATE DELETE
    USING (auth.role() = 'service_role');

----------------------------------------------
-- STEP 3: ENROLLMENTS TABLE RLS
----------------------------------------------

-- Enable RLS on enrollments table
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own enrollments
CREATE POLICY "Users can view own enrollments" ON enrollments
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow authenticated users to create enrollments for themselves
CREATE POLICY "Users can enroll in courses" ON enrollments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own enrollments
CREATE POLICY "Users can update own enrollments" ON enrollments
    FOR UPDATE
    USING (auth.uid() = user_id);

----------------------------------------------
-- STEP 4: PROGRESS TABLE RLS
----------------------------------------------

-- Enable RLS on progress_tracking table
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own progress
CREATE POLICY "Users can view own progress" ON progress
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to create progress entries for themselves
CREATE POLICY "Users can create progress entries" ON progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own progress
CREATE POLICY "Users can update own progress" ON progress
    FOR UPDATE
    USING (auth.uid() = user_id);

----------------------------------------------
-- STEP 5: TESTIMONIALS TABLE RLS
----------------------------------------------

-- Enable RLS on testimonials table
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view approved testimonials
CREATE POLICY "Anyone can view approved testimonials" ON testimonials
    FOR SELECT
    USING (is_approved = true);

-- Allow authenticated users to view their own unapproved testimonials
CREATE POLICY "Users can view own testimonials" ON testimonials
    FOR SELECT
    USING (auth.uid() = user_id OR is_approved = true);

-- Allow authenticated users to submit testimonials
CREATE POLICY "Allow authenticated users to insert testimonials" 
ON PSLV_testimonials
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Only admins can approve testimonials
CREATE POLICY "Only admins can approve testimonials" ON testimonials
    FOR UPDATE
    USING (auth.role() = 'service_role');
