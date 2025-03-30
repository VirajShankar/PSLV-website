-- Create the PSLV_contact_us table
CREATE TABLE IF NOT EXISTS PSLV_contact_us (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_on TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row-Level Security (RLS) on the table
ALTER TABLE PSLV_contact_us ENABLE ROW LEVEL SECURITY;

-- Add RLS policies

-- Allow anyone to insert contact us entries
CREATE POLICY "Allow anyone to insert contact us entries"
ON PSLV_contact_us
FOR INSERT
WITH CHECK (true);

-- Allow admins to view all contact us entries
CREATE POLICY "Allow admins to view contact us entries"
ON PSLV_contact_us
FOR SELECT
USING (auth.role() = 'service_role');
