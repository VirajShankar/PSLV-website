-- Create a stored procedure to help with contact submissions

-- RPC function to insert contact entry (Alternative method)
CREATE OR REPLACE FUNCTION insert_contact(
    p_name TEXT,
    p_email TEXT,
    p_message TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO PSLV_contact_us (name, email, message, submitted_on)
    VALUES (p_name, p_email, p_message, now());
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to insert contact: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if the contact_us table exists and properly configured
CREATE OR REPLACE FUNCTION check_contact_table() RETURNS JSONB AS $$
DECLARE
    table_exists BOOLEAN;
    has_correct_columns BOOLEAN;
    has_rls_policies BOOLEAN;
    result JSONB;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'pslv_contact_us'
    ) INTO table_exists;
    
    -- Check if table has correct columns
    IF table_exists THEN
        SELECT COUNT(*) = 4 FROM information_schema.columns 
        WHERE table_name = 'pslv_contact_us'
        AND column_name IN ('name', 'email', 'message', 'submitted_on')
        INTO has_correct_columns;
    ELSE
        has_correct_columns := FALSE;
    END IF;
    
    -- Check if table has RLS policies
    IF table_exists THEN
        SELECT COUNT(*) > 0 FROM pg_policies 
        WHERE tablename = 'pslv_contact_us'
        INTO has_rls_policies;
    ELSE
        has_rls_policies := FALSE;
    END IF;
    
    -- Compile results
    result := jsonb_build_object(
        'table_exists', table_exists,
        'has_correct_columns', has_correct_columns,
        'has_rls_policies', has_rls_policies,
        'status', CASE 
            WHEN table_exists AND has_correct_columns AND has_rls_policies THEN 'OK'
            WHEN table_exists AND has_correct_columns AND NOT has_rls_policies THEN 'MISSING_RLS'
            WHEN table_exists AND NOT has_correct_columns THEN 'WRONG_COLUMNS'
            WHEN NOT table_exists THEN 'TABLE_MISSING'
            ELSE 'UNKNOWN_ISSUE'
        END
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
