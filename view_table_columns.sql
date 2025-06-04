-- Replace 'your_table_name' with the name of your table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'PSLV_contact_us';
