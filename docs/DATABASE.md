# Sturdy App - Database Documentation

## Overview

Sturdy uses **PostgreSQL** via **Supabase** for all data persistence. The database schema includes **8 tables** with Row Level Security (RLS) policies to ensure data privacy and security.

This document describes the actual production database structure from Supabase, including all tables, columns, relationships, and security policies.

---

## Database Tables

### 1. **profiles**

**Purpose:** Extends Supabase Auth to store user profile information and subscription tier.

**Schema:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: UUID primary key, references Supabase auth.users(id)
- `email`: User's email address
- `subscription_tier`: Subscription level (default: 'free')
- `created_at`: Timestamp when profile was created
- `updated_at`: Timestamp when profile was last updated (auto-updated via trigger)

**Relationships:**
- Parent to: `children`, `scripts`, `plans`, `script_feedback`, `family_invites`
- Cascading delete: When auth.users record is deleted, profile is automatically deleted

---

### 2. **children**

**Purpose:** Stores information about each child profile for personalized script generation.

**Schema:**
```sql
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  birth_date DATE,
  neurotype TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: UUID primary key (auto-generated)
- `parent_id`: Foreign key to profiles.id
- `name`: Child's name
- `birth_date`: Child's date of birth
- `neurotype`: Child's neurotype (e.g., 'ADHD', 'Autistic', 'Neurotypical')
- `created_at`: Timestamp when child profile was created
- `updated_at`: Timestamp when child profile was last updated (auto-updated via trigger)

**Relationships:**
- Child of: `profiles`
- Parent to: `scripts`, `plans`
- Cascading delete: When parent profile is deleted, all children are deleted

---

### 3. **scripts**

**Purpose:** Stores SOS scripts generated for immediate crisis situations.

**Schema:**
```sql
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
```

**Columns:**
- `id`: UUID primary key (auto-generated)
- `parent_id`: Foreign key to profiles.id
- `child_id`: Foreign key to children.id
- `situation`: The crisis situation described by parent
- `script_text`: The generated AI script
- `validation`: Validation component of the script
- `reframe`: Reframe component of the script
- `script_language`: Language used for the script
- `psych_insight`: Psychological insights included
- `tone`: Tone used in the script (e.g., 'gentle', 'firm', 'playful')
- `user_rating`: User's rating of the script (integer)
- `user_helpful`: Boolean feedback - was the script helpful?
- `generated_script`: Full generated script text
- `created_at`: Timestamp when script was generated
- `updated_at`: Timestamp when script was last updated (auto-updated via trigger)

**Relationships:**
- Child of: `profiles` and `children`
- Parent to: `script_feedback`
- Cascading delete: Deleted when parent or child is deleted

---

### 4. **plans** (What If Scripts)

**Purpose:** Stores What If scripts for proactive planning of anticipated struggles.

**⚠️ IMPORTANT:** This table uses `user_id` instead of `parent_id` (different from scripts table!)

**Schema:**
```sql
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
```

**Columns:**
- `id`: UUID primary key (auto-generated)
- `user_id`: Foreign key to profiles.id (**NOTE: uses `user_id`, NOT `parent_id`**)
- `child_id`: Foreign key to children.id
- `struggle`: The anticipated struggle
- `frequency`: How often the struggle occurs
- `triggers`: Known triggers for the struggle
- `prevention`: Prevention strategies
- `intervention`: Intervention strategies
- `escalation`: De-escalation strategies
- `created_at`: Timestamp when plan was created
- `updated_at`: Timestamp when plan was last updated (auto-updated via trigger)

**Relationships:**
- Child of: `profiles` (via `user_id`) and `children`
- Cascading delete: Deleted when user or child is deleted

**Key Difference:** RLS policies check `auth.uid() = user_id` (not `parent_id`)

---

### 5. **script_feedback**

**Purpose:** Stores detailed feedback about scripts from parents.

**Schema:**
```sql
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
```

**Columns:**
- `id`: UUID primary key (auto-generated)
- `parent_id`: Foreign key to profiles.id
- `script_id`: Foreign key to scripts.id
- `helpful`: Boolean - was the script helpful?
- `child_response`: Description of how child responded
- `rating`: Numeric rating of the script
- `notes`: Additional feedback notes
- `created_at`: Timestamp when feedback was created

**Relationships:**
- Child of: `profiles` and `scripts`
- Cascading delete: Deleted when parent or script is deleted

---

### 6. **family_invites**

**Purpose:** Manages family sharing invitations between users.

**Schema:**
```sql
CREATE TABLE family_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inviter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invitee_email TEXT,
  family_join_code UUID,
  accepted BOOLEAN,
  accepted_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: UUID primary key (auto-generated)
- `inviter_id`: Foreign key to profiles.id (user who sent invite)
- `invitee_email`: Email address of invited user
- `family_join_code`: Unique UUID for the family invitation
- `accepted`: Boolean - has invite been accepted?
- `accepted_at`: Timestamp when invite was accepted
- `created_at`: Timestamp when invite was created

**Relationships:**
- Child of: `profiles` (via `inviter_id`)
- Cascading delete: Deleted when inviter profile is deleted

---

### 7. **struggle_categories**

**Purpose:** Stores predefined categories of common childhood struggles for classification.

**Schema:**
```sql
CREATE TABLE struggle_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT,
  description TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: UUID primary key (auto-generated)
- `category`: Name of the struggle category
- `description`: Description of the category
- `keywords`: Array of keywords associated with the category
- `created_at`: Timestamp when category was created

**Relationships:**
- Parent to: `struggle_keywords`

**Access:** Public read access (anyone can view categories)

---

### 8. **struggle_keywords**

**Purpose:** Stores individual keywords linked to struggle categories for better matching.

**Schema:**
```sql
CREATE TABLE struggle_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  struggle_id UUID NOT NULL REFERENCES struggle_categories(id) ON DELETE CASCADE,
  keyword TEXT,
  keyword_type TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: UUID primary key (auto-generated)
- `struggle_id`: Foreign key to struggle_categories.id
- `keyword`: Individual keyword text
- `keyword_type`: Type/classification of the keyword
- `created_at`: Timestamp when keyword was created

**Relationships:**
- Child of: `struggle_categories`
- Cascading delete: Deleted when parent category is deleted

**Security Note:** RLS policy was added to fix security gap (previously unrestricted)

---

## Row Level Security (RLS) Policies

All tables have RLS enabled to ensure data privacy and security.

### **profiles** Policies

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Users can view their own profile | SELECT | auth.uid() = id |
| Allow users to insert their own profile | INSERT | auth.uid() = id |
| Allow users to update their own profile | UPDATE | auth.uid() = id |

---

### **children** Policies

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Users can view their own children | SELECT | auth.uid() = parent_id |
| Users can insert their own children | INSERT | auth.uid() = parent_id |
| Users can update their own children | UPDATE | auth.uid() = parent_id |

---

### **scripts** Policies

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Users can view own scripts | SELECT | auth.uid() = parent_id |
| Users can insert own scripts | INSERT | auth.uid() = parent_id |
| Users can update their own scripts | UPDATE | auth.uid() = parent_id |

---

### **plans** Policies

⚠️ **Note:** Plans table uses `user_id` field (not `parent_id`)

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Users can view own plans | SELECT | auth.uid() = user_id |
| Users can create own plans | INSERT | auth.uid() = user_id |
| Users can update own plans | UPDATE | auth.uid() = user_id |
| Users can delete own plans | DELETE | auth.uid() = user_id |

---

### **script_feedback** Policies

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Users can view their feedback | SELECT | auth.uid() = parent_id |

---

### **family_invites** Policies

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Users can view their invites | SELECT | auth.uid() = inviter_id |

---

### **struggle_categories** Policies

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Anyone can read categories | SELECT | true |

**Access:** Public read-only access

---

### **struggle_keywords** Policies

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Anyone can read keywords | SELECT | true |

**Security Fix:** This policy was added to fix a security gap. Previously, this table had no RLS policies (unrestricted access).

---

## Performance Indexes

Indexes are created on foreign keys and frequently queried columns:

```sql
-- Children
CREATE INDEX idx_children_parent_id ON children(parent_id);

-- Scripts
CREATE INDEX idx_scripts_parent_id ON scripts(parent_id);
CREATE INDEX idx_scripts_child_id ON scripts(child_id);

-- Plans
CREATE INDEX idx_plans_user_id ON plans(user_id);
CREATE INDEX idx_plans_child_id ON plans(child_id);

-- Script Feedback
CREATE INDEX idx_script_feedback_parent_id ON script_feedback(parent_id);
CREATE INDEX idx_script_feedback_script_id ON script_feedback(script_id);

-- Family Invites
CREATE INDEX idx_family_invites_inviter_id ON family_invites(inviter_id);

-- Struggle Keywords
CREATE INDEX idx_struggle_keywords_struggle_id ON struggle_keywords(struggle_id);
```

**Purpose:** Speed up queries filtering by foreign keys and improve JOIN performance.

---

## Database Triggers

### Auto-update `updated_at` Timestamps

The `updated_at` column is automatically updated using a PostgreSQL trigger:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Applied to:**
- `profiles.updated_at`
- `children.updated_at`
- `scripts.updated_at`
- `plans.updated_at`

---

## Local Development Setup

### Prerequisites
- Supabase account (free tier available at https://supabase.com)
- Basic PostgreSQL knowledge

### Setup Instructions

1. **Create a New Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Enter project name, database password, and select region
   - Wait for project initialization (~2 minutes)

2. **Restore Database Schema**
   - Open your Supabase project dashboard
   - Navigate to: **SQL Editor** (left sidebar)
   - Click "New Query"
   - Open `/docs/schema.sql` from this repository
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

3. **Verify Tables Created**
   - Navigate to: **Table Editor** (left sidebar)
   - You should see 8 tables:
     - `profiles`
     - `children`
     - `scripts`
     - `plans`
     - `script_feedback`
     - `family_invites`
     - `struggle_categories`
     - `struggle_keywords`

4. **Verify RLS Policies**
   - Click on each table in Table Editor
   - Check "Row Level Security" is enabled
   - Click "Policies" tab to see policies

5. **Get API Credentials**
   - Navigate to: **Settings → API** (left sidebar)
   - Copy these values to your `.env.local` file:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

6. **Test the Setup**
   - Run your application
   - Sign up a test user
   - Verify profile is created automatically
   - Create a child profile
   - Generate a script
   - Verify RLS prevents unauthorized access

---

## How to Restore from schema.sql

If you need to restore or recreate the database:

1. **Using Supabase Dashboard:**
   - Navigate to SQL Editor
   - Create a new query
   - Copy contents of `/docs/schema.sql`
   - Paste and click "Run"

2. **Using Supabase CLI:**
   ```bash
   supabase db reset
   supabase db push
   ```

3. **For Fresh Installation:**
   - Simply run the entire `schema.sql` file in SQL Editor
   - All tables, indexes, policies, and triggers will be created

---

## Important Notes

### Plans Table Uses `user_id`

⚠️ **Critical:** The `plans` table uses `user_id` instead of `parent_id`:
- Most tables use `parent_id` (scripts, children, script_feedback, family_invites)
- **Plans table uses `user_id`** for foreign key to profiles
- RLS policies check `auth.uid() = user_id` (not `parent_id`)
- Keep this in mind when writing queries or RLS policies

### Timestamp Format

All timestamps use `TIMESTAMP WITHOUT TIME ZONE`:
- Not `TIMESTAMP WITH TIME ZONE`
- Stored in UTC
- Convert to local timezone in application layer

### Security Fix Applied

The `struggle_keywords` table had a security gap (no RLS policies). This has been fixed:
- Added policy: "Anyone can read keywords" (SELECT: true)
- Previously: unrestricted access (security risk)
- Now: proper RLS policy enforced

---

## Common Queries

### Get all children for a user
```sql
SELECT * FROM children 
WHERE parent_id = auth.uid() 
ORDER BY created_at DESC;
```

### Get all plans for a user (note: uses user_id!)
```sql
SELECT * FROM plans 
WHERE user_id = auth.uid() 
ORDER BY created_at DESC;
```

### Get scripts with child info
```sql
SELECT s.*, c.name as child_name 
FROM scripts s
JOIN children c ON s.child_id = c.id
WHERE s.parent_id = auth.uid()
ORDER BY s.created_at DESC;
```

### Get struggle categories with keywords
```sql
SELECT sc.*, 
  (SELECT json_agg(sk.*) FROM struggle_keywords sk WHERE sk.struggle_id = sc.id) as keywords
FROM struggle_categories sc;
```

---

## Security Best Practices

1. **Use anon key for client-side:** Never use service_role key in client code
2. **Service role bypasses RLS:** Only use on secure server-side code
3. **Validate all inputs:** Check data before inserting
4. **Monitor access patterns:** Review logs regularly
5. **Regular backups:** Export data frequently
6. **Test RLS policies:** Verify users can't access other users' data

---

## Troubleshooting

### "new row violates row-level security policy"
- **Cause:** Trying to insert/update data that violates RLS rules
- **Solution:** Ensure foreign keys match authenticated user's ID
- **For plans:** Remember to use `user_id` not `parent_id`

### "relation does not exist"
- **Cause:** Schema not created
- **Solution:** Run `/docs/schema.sql` in SQL Editor

### "permission denied for table"
- **Cause:** Using anon key for admin operations
- **Solution:** Use service_role key for server-side queries

### Plans not showing up
- **Cause:** Querying with `parent_id` instead of `user_id`
- **Solution:** Use `WHERE user_id = auth.uid()` for plans table

---

## Database Version

- **Last Updated:** January 2026
- **PostgreSQL Version:** 15.x (via Supabase)
- **Schema Version:** 2.0.0 (production export)

---

## Contact & Resources

- **Supabase Documentation:** https://supabase.com/docs
- **Schema File:** `/docs/schema.sql`
- **This File:** `/docs/DATABASE.md`
