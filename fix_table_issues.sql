-- COMPREHENSIVE FIX FOR SUPABASE CONTACT ISSUES

-- STEP 1: Create helper functions for diagnosing issues
CREATE OR REPLACE FUNCTION check_table_exists(table_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = table_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to list tables with RLS status
CREATE OR REPLACE FUNCTION list_tables_with_rls_status()
RETURNS TABLE(
    table_name TEXT,
    rls_enabled BOOLEAN,
    policy_count INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.tablename::TEXT,
        t.rowsecurity,
        COALESCE(p.policy_count, 0)
    FROM
        pg_tables t
    LEFT JOIN (
        SELECT tablename, COUNT(*) as policy_count
        FROM pg_policies
        GROUP BY tablename
    ) p ON t.tablename = p.tablename
    WHERE
        t.schemaname = 'public'
    ORDER BY
        t.tablename;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to show policies on a table
CREATE OR REPLACE FUNCTION show_table_policies(table_name TEXT)
RETURNS TABLE(
    policy_name TEXT,
    operation TEXT,
    roles TEXT[],
    using_expression TEXT,
    with_check_expression TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        policyname::TEXT,
        cmd::TEXT,
        roles::TEXT[],
        COALESCE(qual::TEXT, '(true)'),
        COALESCE(with_check::TEXT, '(true)')
    FROM
        pg_policies
    WHERE
        tablename = table_name
    ORDER BY
        policyname;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 2: Drop the existing table (if it exists)
DROP TABLE IF EXISTS pslv_contact_us;

-- STEP 3: Create the table with the correct structure
CREATE TABLE pslv_contact_us (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_on TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- STEP 4: Enable Row Level Security
ALTER TABLE pslv_contact_us ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create the most permissive policies possible for this table
-- This allows ANY client to insert data (including anonymous users)
CREATE POLICY "Allow anonymous inserts" 
ON pslv_contact_us
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- This allows the service role (your server) to read all data
CREATE POLICY "Allow service role to read all data" 
ON pslv_contact_us
FOR SELECT 
TO service_role
USING (true);

-- STEP 6: Insert a test record to verify everything works
INSERT INTO pslv_contact_us (name, email, message) 
VALUES ('Test User', 'test@example.com', 'This is a test message created by SQL script.');

-- STEP 7: Create a helper function to insert contact messages
-- This provides an alternative way to insert data via RPC (Remote Procedure Call)
CREATE OR REPLACE FUNCTION insert_contact_message(
    p_name TEXT,
    p_email TEXT,
    p_message TEXT
) RETURNS JSONB AS $$
DECLARE
    new_id BIGINT;
BEGIN
    INSERT INTO pslv_contact_us (name, email, message)
    VALUES (p_name, p_email, p_message)
    RETURNING id INTO new_id;
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Contact message inserted successfully',
        'id', new_id
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', FALSE,
        'message', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 8: Verify the setup
SELECT 'Contact table recreated with correct structure and policies!' as result;
SELECT * FROM pslv_contact_us;
