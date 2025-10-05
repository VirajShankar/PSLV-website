-- Fix the enrolled_on column name issue

-- Check current column structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'PSLV_enrollments';

-- If the column has an incorrect name, rename it
ALTER TABLE "PSLV_enrollments" 
RENAME COLUMN "enrolled _on" TO "enrolled_on";

-- Verify the fix worked
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'PSLV_enrollments'
ORDER BY ordinal_position;
