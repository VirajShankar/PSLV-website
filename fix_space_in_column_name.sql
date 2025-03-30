-- FIX FOR COLUMN NAME ISSUE IN PSLV_enrollments TABLE

-- STEP 1: Check if the problematic column exists (with space)
SELECT EXISTS (
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'PSLV_enrollments'
    AND column_name = 'enrolled _on'
) as has_column_with_space;

-- STEP 2: Rename the column if it exists with a space
ALTER TABLE "PSLV_enrollments" 
RENAME COLUMN "enrolled _on" TO "enrolled_on";

-- STEP 3: Add the column if it doesn't exist at all
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'PSLV_enrollments'
        AND column_name = 'enrolled_on'
    ) THEN
        ALTER TABLE "PSLV_enrollments" 
        ADD COLUMN "enrolled_on" TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- STEP 4: Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'PSLV_enrollments'
ORDER BY ordinal_position;

-- STEP 5: Show success message
SELECT 'Column renamed successfully to "enrolled_on"' as result;
