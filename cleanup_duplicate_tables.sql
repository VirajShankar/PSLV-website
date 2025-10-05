-- Clean up duplicate course tables

-- Check what course tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE '%course%' 
AND table_schema = 'public';

-- Drop any duplicate course tables (keep only the ones we need)
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS pslv_courses;

-- Show remaining tables to confirm cleanup
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
