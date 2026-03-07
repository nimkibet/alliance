-- =====================================================
-- PHASE 1: SUPABASE DATABASE SETUP & RLS POLICIES
-- =====================================================

-- Create the votes table
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    department TEXT NOT NULL,
    reg_no TEXT NOT NULL,
    otp TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'used'))
);

-- Enable Row Level Security on the votes table
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Policy 1: Allow anonymous users to INSERT new votes
-- This enables public submission of OTPs without authentication
CREATE POLICY "Allow public insert for votes"
ON votes
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 2: Allow authenticated users to SELECT votes matching their department
-- Users must have a 'department' claim in their user_metadata
-- This ensures admins can only see votes from their department
CREATE POLICY "Allow authenticated users to select their department votes"
ON votes
FOR SELECT
TO authenticated
USING (
    department = (raw_user_meta_data->>'department')
);

-- Policy 3: Allow authenticated users to UPDATE votes matching their department
-- Admins can mark votes as 'used' for their department only
CREATE POLICY "Allow authenticated users to update their department votes"
ON votes
FOR UPDATE
TO authenticated
USING (
    department = (raw_user_meta_data->>'department')
)
WITH CHECK (
    department = (raw_user_meta_data->>'department')
);

-- =====================================================
-- INDEX FOR BETTER QUERY PERFORMANCE
-- =====================================================
CREATE INDEX idx_votes_department_status ON votes(department, status);
CREATE INDEX idx_votes_created_at ON votes(created_at DESC);

-- =====================================================
-- NOTE: To set up admins, you need to:
-- 1. Create users in Supabase Authentication
-- 2. Set their user_metadata with a 'department' field
-- Example user_metadata: {"department": "SPAS"}
-- 
-- Departments available: SPAS, EDU, BUS, ENG, HEALTH
-- =====================================================
