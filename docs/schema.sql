-- =============================================================================
-- STURDY APP - DATABASE SCHEMA
-- =============================================================================
-- Complete PostgreSQL schema for Supabase
-- Includes: Tables, RLS policies, indexes, constraints
-- Last updated: January 2026
-- =============================================================================

-- Enable UUID extension (required for uuid_generate_v4())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Profiles Table (extends auth.users)
-- -----------------------------------------------------------------------------
-- Stores user profile information and subscription tier
-- Links to Supabase Auth via foreign key to auth.users(id)
-- -----------------------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'family')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Children Table
-- -----------------------------------------------------------------------------
-- Stores information about each child profile
-- Each child belongs to a parent (profile)
-- Tracks neurotype for personalized script generation
-- -----------------------------------------------------------------------------
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE,
  neurotype TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Scripts Table (SOS scripts)
-- -----------------------------------------------------------------------------
-- Stores generated SOS scripts (immediate crisis mode)
-- Each script is linked to both parent and child
-- Includes optional helpful_rating for feedback loop
-- -----------------------------------------------------------------------------
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  situation TEXT NOT NULL,
  script_text TEXT NOT NULL,
  tone TEXT,
  helpful_rating BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- What If Scripts Table (proactive planning)
-- -----------------------------------------------------------------------------
-- Stores generated What If scripts (proactive planning mode)
-- Used for advance preparation for anticipated struggles
-- Includes frequency and context for better personalization
-- -----------------------------------------------------------------------------
CREATE TABLE what_if_scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  struggle TEXT NOT NULL,
  context TEXT,
  frequency TEXT,
  tone TEXT,
  script TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE what_if_scripts ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Profiles RLS Policies
-- -----------------------------------------------------------------------------
-- Users can only view and update their own profile
-- No insert policy needed (handled by auth trigger)
-- No delete policy needed (Supabase auth handles user deletion)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- Children RLS Policies
-- -----------------------------------------------------------------------------
-- Parents can perform all CRUD operations on their own children
-- Cannot view or modify children belonging to other parents
-- -----------------------------------------------------------------------------
CREATE POLICY "Parents can view own children" 
  ON children FOR SELECT 
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert own children" 
  ON children FOR INSERT 
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update own children" 
  ON children FOR UPDATE 
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete own children" 
  ON children FOR DELETE 
  USING (auth.uid() = parent_id);

-- -----------------------------------------------------------------------------
-- Scripts RLS Policies
-- -----------------------------------------------------------------------------
-- Parents can view, insert, and delete their own scripts
-- No update policy (scripts are immutable once created)
-- -----------------------------------------------------------------------------
CREATE POLICY "Parents can view own scripts" 
  ON scripts FOR SELECT 
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert own scripts" 
  ON scripts FOR INSERT 
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can delete own scripts" 
  ON scripts FOR DELETE 
  USING (auth.uid() = parent_id);

-- -----------------------------------------------------------------------------
-- What If Scripts RLS Policies
-- -----------------------------------------------------------------------------
-- Parents can view and insert their own what-if scripts
-- No update or delete policies (scripts are immutable)
-- -----------------------------------------------------------------------------
CREATE POLICY "Parents can view own what_if_scripts" 
  ON what_if_scripts FOR SELECT 
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert own what_if_scripts" 
  ON what_if_scripts FOR INSERT 
  WITH CHECK (auth.uid() = parent_id);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Children table indexes
CREATE INDEX idx_children_parent_id ON children(parent_id);

-- Scripts table indexes
CREATE INDEX idx_scripts_parent_id ON scripts(parent_id);
CREATE INDEX idx_scripts_child_id ON scripts(child_id);
CREATE INDEX idx_scripts_created_at ON scripts(created_at DESC);

-- What If Scripts table indexes
CREATE INDEX idx_what_if_scripts_parent_id ON what_if_scripts(parent_id);
CREATE INDEX idx_what_if_scripts_child_id ON what_if_scripts(child_id);
CREATE INDEX idx_what_if_scripts_created_at ON what_if_scripts(created_at DESC);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Auto-update updated_at timestamp
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to children
CREATE TRIGGER update_children_updated_at 
  BEFORE UPDATE ON children
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- MIGRATION INSTRUCTIONS
-- =============================================================================
-- 
-- To set up this schema in a new Supabase project:
-- 
-- 1. Create a new Supabase project at https://supabase.com/dashboard
-- 
-- 2. Go to SQL Editor in your project dashboard
-- 
-- 3. Copy and paste this entire file into the SQL Editor
-- 
-- 4. Click "Run" to execute all commands
-- 
-- 5. Verify tables were created:
--    - Go to Table Editor
--    - You should see: profiles, children, scripts, what_if_scripts
-- 
-- 6. Verify RLS is enabled:
--    - Click on each table
--    - Check "Row Level Security" is enabled
--    - Check policies are listed
-- 
-- 7. Test the setup:
--    - Create a test user via Authentication
--    - Try inserting a profile record
--    - Verify RLS prevents unauthorized access
-- 
-- =============================================================================
-- ROLLBACK (if needed)
-- =============================================================================
-- 
-- To remove this schema (WARNING: destroys all data):
-- 
-- DROP TABLE IF EXISTS what_if_scripts CASCADE;
-- DROP TABLE IF EXISTS scripts CASCADE;
-- DROP TABLE IF EXISTS children CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
-- 
-- =============================================================================
