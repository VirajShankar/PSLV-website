-- HELPER FUNCTIONS FOR PSLV WEBSITE DATABASE
-- Run this in Supabase SQL Editor to create utility functions

-- Function to check if a table exists
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

-- Function to show all RLS policies for a table
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

-- Function to list all tables with their RLS status
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

-- Function to add default RLS policies to a table
CREATE OR REPLACE FUNCTION add_default_rls_policies(table_name TEXT)
RETURNS TEXT AS $$
DECLARE
    policy_name TEXT := 'Allow all operations for now';
    policy_exists BOOLEAN;
    result TEXT;
BEGIN
    -- Check if policy exists
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = table_name 
        AND policyname = policy_name
    ) INTO policy_exists;
    
    -- If policy exists, drop it first
    IF policy_exists THEN
        EXECUTE format('DROP POLICY "%s" ON %I', policy_name, table_name);
    END IF;
    
    -- Create new policy
    EXECUTE format('CREATE POLICY "%s" ON %I FOR ALL TO authenticated, anon USING (true) WITH CHECK (true)', 
                  policy_name, table_name);
    
    -- Enable RLS on the table
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    
    result := 'Successfully added RLS policy "' || policy_name || '" to table "' || table_name || '"';
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
