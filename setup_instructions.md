# Database Setup Instructions

To set up the database for the PSLV website, follow these steps carefully:

## Step 1: Access Supabase SQL Editor

1. Open your Supabase project at: [https://app.supabase.com/](https://app.supabase.com/)
2. Select your project (with URL: https://berfykdzrhhayqzjpyua.supabase.co)
3. In the left sidebar, click on **SQL Editor**
4. Click the **+ New Query** button

## Step 2: Run the Database Setup Script

1. Copy the **ENTIRE** code block below:

```sql
-- MINIMAL DATABASE SETUP FOR PSLV WEBSITE

-- Create users table without foreign key constraints
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    course_interest TEXT,
    registered_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create enrollments table without foreign key constraints
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    course_id TEXT NOT NULL,
    course_name TEXT,
    price TEXT,
    enrolled_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT DEFAULT 'Active'
);

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DROP POLICY IF EXISTS "Users can do anything" ON users;
CREATE POLICY "Users can do anything" ON users FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- Create policies for enrollments table
DROP POLICY IF EXISTS "Users can do anything" ON enrollments;
CREATE POLICY "Users can do anything" ON enrollments FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- Verify setup
SELECT 'Tables and policies created successfully!' AS result;
```

2. Paste the code into the SQL Editor
3. Click the **Run** button (or press Ctrl+Enter)
4. You should see "Tables and policies created successfully!" in the results

## Step 3: Verify the Tables Were Created

1. Go to **Table Editor** in the left sidebar
2. Look for `users` and `enrollments` tables in the list
3. If you see them, your database is set up correctly
4. If you don't see them, try running the setup script again

## Step 4: Return to the Website

Once the tables are created successfully, return to the website and refresh the page. The registration and login features should now work correctly.

## Troubleshooting

If you still see the "Database tables need to be set up" error after following these instructions:

1. Make sure you copied and pasted the **entire** SQL script
2. Check for any error messages in the SQL Editor results
3. Try running each CREATE TABLE statement separately
4. Check if your Supabase project has enough database space
