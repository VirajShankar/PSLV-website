-- Verify the PSLV_enrollments table structure

-- Check if the table exists (case-sensitive check)
SELECT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'PSLV_enrollments'
) as table_exists_uppercase;

SELECT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'pslv_enrollments'
) as table_exists_lowercase;

-- Show table columns and their types
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'PSLV_enrollments'
ORDER BY ordinal_position;

-- Count records in the table
SELECT COUNT(*) as record_count FROM "PSLV_enrollments";
