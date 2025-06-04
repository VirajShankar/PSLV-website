-- Fix the PSLV_enrollments table structure issues

-- First, check the current structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'PSLV_enrollments';

-- If user_id column doesn't exist but something similar does (like userId), rename it
-- Uncomment and modify the line below based on what you find:
-- ALTER TABLE "PSLV_enrollments" RENAME COLUMN "userId" TO "user_id";

-- If no such column exists at all, add it
-- Uncomment this if needed:
-- ALTER TABLE "PSLV_enrollments" ADD COLUMN "user_id" UUID NOT NULL;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'PSLV_enrollments';
