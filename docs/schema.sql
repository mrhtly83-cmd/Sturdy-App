-- ============================================
-- STURDY APP - DATABASE SCHEMA EXPORT
-- Generated from production Supabase database
-- ============================================
-- Complete PostgreSQL schema with all tables, constraints, and RLS policies
-- Last updated: January 2026
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- CHILDREN TABLE
-- ============================================
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  birth_date DATE,
  neurotype TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own children" ON children
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Users can insert their own children" ON children
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Users can update their own children" ON children
  FOR UPDATE USING (auth.uid() = parent_id);

-- ============================================
-- SCRIPTS TABLE
-- ============================================
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  situation TEXT,
  script_text TEXT,
  validation TEXT,
  reframe TEXT,
  script_language TEXT,
  psych_insight TEXT,
  tone TEXT,
  user_rating INTEGER,
  user_helpful BOOLEAN,
  generated_script TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scripts" ON scripts
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Users can insert own scripts" ON scripts
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Users can update their own scripts" ON scripts
  FOR UPDATE USING (auth.uid() = parent_id);

-- ============================================
-- PLANS TABLE (What If scripts)
-- ============================================
-- IMPORTANT: This table uses user_id, NOT parent_id!
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  struggle TEXT,
  frequency TEXT,
  triggers TEXT,
  prevention TEXT,
  intervention TEXT,
  escalation TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans" ON plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own plans" ON plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON plans
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- SCRIPT_FEEDBACK TABLE
-- ============================================
CREATE TABLE script_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  helpful BOOLEAN,
  child_response TEXT,
  rating INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

ALTER TABLE script_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their feedback" ON script_feedback
  FOR SELECT USING (auth.uid() = parent_id);

-- ============================================
-- FAMILY_INVITES TABLE
-- ============================================
CREATE TABLE family_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inviter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invitee_email TEXT,
  family_join_code UUID,
  accepted BOOLEAN,
  accepted_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

ALTER TABLE family_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their invites" ON family_invites
  FOR SELECT USING (auth.uid() = inviter_id);

-- ============================================
-- STRUGGLE_CATEGORIES TABLE
-- ============================================
CREATE TABLE struggle_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT,
  description TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

ALTER TABLE struggle_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories" ON struggle_categories
  FOR SELECT USING (true);

-- ============================================
-- STRUGGLE_KEYWORDS TABLE
-- ============================================
CREATE TABLE struggle_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  struggle_id UUID NOT NULL REFERENCES struggle_categories(id) ON DELETE CASCADE,
  keyword TEXT,
  keyword_type TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

ALTER TABLE struggle_keywords ENABLE ROW LEVEL SECURITY;

-- Security fix: Add RLS policy (was previously unrestricted)
CREATE POLICY "Anyone can read keywords" ON struggle_keywords
  FOR SELECT USING (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Children table indexes
CREATE INDEX idx_children_parent_id ON children(parent_id);

-- Scripts table indexes
CREATE INDEX idx_scripts_parent_id ON scripts(parent_id);
CREATE INDEX idx_scripts_child_id ON scripts(child_id);

-- Plans table indexes
CREATE INDEX idx_plans_user_id ON plans(user_id);
CREATE INDEX idx_plans_child_id ON plans(child_id);

-- Script_feedback table indexes
CREATE INDEX idx_script_feedback_parent_id ON script_feedback(parent_id);
CREATE INDEX idx_script_feedback_script_id ON script_feedback(script_id);

-- Family_invites table indexes
CREATE INDEX idx_family_invites_inviter_id ON family_invites(inviter_id);

-- Struggle_keywords table indexes
CREATE INDEX idx_struggle_keywords_struggle_id ON struggle_keywords(struggle_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_children_updated_at 
  BEFORE UPDATE ON children
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at 
  BEFORE UPDATE ON scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at 
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SETUP INSTRUCTIONS
-- ============================================
-- 
-- To restore this schema in a new Supabase project:
-- 
-- 1. Create a new Supabase project at https://supabase.com/dashboard
-- 2. Navigate to SQL Editor in your project dashboard
-- 3. Copy and paste this entire file into the SQL Editor
-- 4. Click "Run" to execute all commands
-- 5. Verify tables were created in Table Editor
-- 6. Verify RLS is enabled on all tables
-- 
-- ============================================
